/**
 * Geometry-based fitting.
 *
 * Scales and shifts arbitrary SVG content so that it fits exactly inside a
 * target circle — the circle inscribed in the square viewBox, with its radius
 * reduced by a small padding while keeping the center fixed. The content is
 * guaranteed to never overflow the circle, and is sized/positioned so its
 * minimal enclosing circle is concentric with — and touches — the target.
 *
 * The library generates SVG as strings and must work in Node (no DOM /
 * `getBBox`), so bounds are computed analytically: we parse the primitives
 * this library emits (circle, ellipse, rect, line, polygon, polyline, path),
 * honor nested `<g transform>` and element-level transforms, account for
 * stroke width, sample curves, and skip non-drawn `<defs>` / `<clipPath>`
 * content. Everything is deterministic (no Math.random / Date) so SVG output
 * is stable for snapshot tests.
 */

export interface FitOptions {
  /** Side of the square viewBox. Default 100. */
  size?: number;
  /** Gap between the fitted content and the inscribed circle, in viewBox units. Default 4. */
  padding?: number;
}

interface Pt {
  x: number;
  y: number;
}

/** Affine matrix [a, b, c, d, e, f]: x' = a·x + c·y + e, y' = b·x + d·y + f. */
type Mat = [number, number, number, number, number, number];

const IDENT: Mat = [1, 0, 0, 1, 0, 0];

/** Compose two matrices: result applies `n` first, then `m`. */
function matMul(m: Mat, n: Mat): Mat {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

function matApply(m: Mat, x: number, y: number): Pt {
  return { x: m[0] * x + m[2] * y + m[4], y: m[1] * x + m[3] * y + m[5] };
}

/** Representative uniform scale of a matrix (for converting stroke width to viewBox units). */
function matScale(m: Mat): number {
  const det = Math.abs(m[0] * m[3] - m[1] * m[2]);
  return Math.sqrt(det) || 1;
}

/** Parse an SVG `transform` attribute value (one or more ops) into a matrix. */
function parseTransform(value: string): Mat {
  let m: Mat = IDENT;
  const re = /(translate|scale|rotate|matrix)\s*\(([^)]*)\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(value)) !== null) {
    const name = match[1]!;
    const args = match[2]!.split(/[\s,]+/).filter((s) => s.length > 0).map(Number);
    let t: Mat = IDENT;
    if (name === 'translate') {
      t = [1, 0, 0, 1, args[0] || 0, args[1] || 0];
    } else if (name === 'scale') {
      const sx = args[0] || 0;
      const sy = args.length > 1 ? args[1]! : sx;
      t = [sx, 0, 0, sy, 0, 0];
    } else if (name === 'rotate') {
      const a = ((args[0] || 0) * Math.PI) / 180;
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      const rot: Mat = [cos, sin, -sin, cos, 0, 0];
      if (args.length >= 3) {
        const cx = args[1]!;
        const cy = args[2]!;
        t = matMul([1, 0, 0, 1, cx, cy], matMul(rot, [1, 0, 0, 1, -cx, -cy]));
      } else {
        t = rot;
      }
    } else if (name === 'matrix' && args.length >= 6) {
      t = [args[0]!, args[1]!, args[2]!, args[3]!, args[4]!, args[5]!];
    }
    m = matMul(m, t);
  }
  return m;
}

/** Read a numeric attribute (word-boundary safe so `x` does not match `rx`/`cx`). */
function numAttr(attrs: string, name: string): number | undefined {
  const m = (' ' + attrs).match(new RegExp('[\\s]' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? parseFloat(m[1]!) : undefined;
}

function strAttr(attrs: string, name: string): string | undefined {
  const m = (' ' + attrs).match(new RegExp('[\\s]' + name + '\\s*=\\s*"([^"]*)"'));
  return m ? m[1] : undefined;
}

/** Effective half stroke width (in local units) contributed by an element, 0 if no stroke. */
function strokePad(attrs: string): number {
  const stroke = strAttr(attrs, 'stroke');
  if (stroke === undefined || stroke === 'none') return 0;
  const sw = numAttr(attrs, 'stroke-width');
  return (sw === undefined ? 1 : sw) / 2;
}

const CIRCLE_SAMPLES = 24;
const CUBIC_SAMPLES = 16;
const QUAD_SAMPLES = 12;
const ARC_SAMPLES = 24;

function sampleCubic(p0: Pt, c1: Pt, c2: Pt, p1: Pt, out: Pt[]): void {
  for (let i = 0; i <= CUBIC_SAMPLES; i++) {
    const t = i / CUBIC_SAMPLES;
    const u = 1 - t;
    const a = u * u * u;
    const b = 3 * u * u * t;
    const c = 3 * u * t * t;
    const d = t * t * t;
    out.push({
      x: a * p0.x + b * c1.x + c * c2.x + d * p1.x,
      y: a * p0.y + b * c1.y + c * c2.y + d * p1.y,
    });
  }
}

function sampleQuad(p0: Pt, c: Pt, p1: Pt, out: Pt[]): void {
  for (let i = 0; i <= QUAD_SAMPLES; i++) {
    const t = i / QUAD_SAMPLES;
    const u = 1 - t;
    const a = u * u;
    const b = 2 * u * t;
    const d = t * t;
    out.push({ x: a * p0.x + b * c.x + d * p1.x, y: a * p0.y + b * c.y + d * p1.y });
  }
}

/**
 * Sample an SVG elliptical arc (endpoint -> center parameterization, per the SVG
 * spec implementation notes), so the arc's curvature is bounded — not just its
 * endpoints. Without this, arcs (e.g. the rainbow) would be under-bounded and
 * could overflow the fit circle.
 */
function sampleArc(
  x1: number, y1: number,
  rx: number, ry: number, phiDeg: number,
  largeArc: boolean, sweep: boolean,
  x2: number, y2: number,
  out: Pt[],
): void {
  if (rx === 0 || ry === 0) {
    out.push({ x: x2, y: y2 });
    return;
  }
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const phi = (phiDeg * Math.PI) / 180;
  const cosp = Math.cos(phi);
  const sinp = Math.sin(phi);

  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cosp * dx + sinp * dy;
  const y1p = -sinp * dx + cosp * dy;

  let rxs = rx * rx;
  let rys = ry * ry;
  const x1ps = x1p * x1p;
  const y1ps = y1p * y1p;
  const lambda = x1ps / rxs + y1ps / rys;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
    rxs = rx * rx;
    rys = ry * ry;
  }

  const sign = largeArc !== sweep ? 1 : -1;
  const num = Math.max(0, rxs * rys - rxs * y1ps - rys * x1ps);
  const denom = rxs * y1ps + rys * x1ps;
  const co = denom === 0 ? 0 : sign * Math.sqrt(num / denom);
  const cxp = (co * (rx * y1p)) / ry;
  const cyp = (co * -(ry * x1p)) / rx;

  const cx = cosp * cxp - sinp * cyp + (x1 + x2) / 2;
  const cy = sinp * cxp + cosp * cyp + (y1 + y2) / 2;

  const angle = (ux: number, uy: number, vx: number, vy: number): number => {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    let a = len === 0 ? 0 : Math.acos(Math.min(1, Math.max(-1, dot / len)));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };

  const ux = (x1p - cxp) / rx;
  const uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx;
  const vy = (-y1p - cyp) / ry;
  const theta1 = angle(1, 0, ux, uy);
  let dtheta = angle(ux, uy, vx, vy);
  if (!sweep && dtheta > 0) dtheta -= 2 * Math.PI;
  else if (sweep && dtheta < 0) dtheta += 2 * Math.PI;

  for (let i = 0; i <= ARC_SAMPLES; i++) {
    const t = theta1 + dtheta * (i / ARC_SAMPLES);
    const cost = Math.cos(t);
    const sint = Math.sin(t);
    out.push({
      x: cosp * rx * cost - sinp * ry * sint + cx,
      y: sinp * rx * cost + cosp * ry * sint + cy,
    });
  }
}

/** Parse path data into a list of points that bound the path (curves are sampled). */
function pathPoints(d: string): Pt[] {
  const out: Pt[] = [];
  const tokens: Array<{ cmd?: string; num?: number }> = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g;
  let mt: RegExpExecArray | null;
  while ((mt = re.exec(d)) !== null) {
    if (mt[1]) tokens.push({ cmd: mt[1] });
    else tokens.push({ num: parseFloat(mt[2]!) });
  }

  let i = 0;
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let px = 0; // last control point (for S/T reflection)
  let py = 0;
  let cmd = '';

  const next = (): number => {
    const tok = tokens[i++];
    return tok && tok.num !== undefined ? tok.num : 0;
  };

  while (i < tokens.length) {
    if (tokens[i]!.cmd !== undefined) {
      cmd = tokens[i]!.cmd!;
      i++;
    }
    if (i > tokens.length) break;
    const rel = cmd === cmd.toLowerCase();
    switch (cmd.toUpperCase()) {
      case 'M': {
        let x = next();
        let y = next();
        if (rel) { x += cx; y += cy; }
        cx = x; cy = y; sx = x; sy = y; px = x; py = y;
        out.push({ x, y });
        cmd = rel ? 'l' : 'L'; // subsequent implicit pairs are lineto
        break;
      }
      case 'L': {
        let x = next();
        let y = next();
        if (rel) { x += cx; y += cy; }
        cx = x; cy = y; px = x; py = y;
        out.push({ x, y });
        break;
      }
      case 'H': {
        let x = next();
        if (rel) x += cx;
        cx = x; px = cx; py = cy;
        out.push({ x: cx, y: cy });
        break;
      }
      case 'V': {
        let y = next();
        if (rel) y += cy;
        cy = y; px = cx; py = cy;
        out.push({ x: cx, y: cy });
        break;
      }
      case 'C': {
        let x1 = next(), y1 = next(), x2 = next(), y2 = next(), x = next(), y = next();
        if (rel) { x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy; }
        sampleCubic({ x: cx, y: cy }, { x: x1, y: y1 }, { x: x2, y: y2 }, { x, y }, out);
        px = x2; py = y2; cx = x; cy = y;
        break;
      }
      case 'S': {
        let x2 = next(), y2 = next(), x = next(), y = next();
        if (rel) { x2 += cx; y2 += cy; x += cx; y += cy; }
        const x1 = 2 * cx - px;
        const y1 = 2 * cy - py;
        sampleCubic({ x: cx, y: cy }, { x: x1, y: y1 }, { x: x2, y: y2 }, { x, y }, out);
        px = x2; py = y2; cx = x; cy = y;
        break;
      }
      case 'Q': {
        let x1 = next(), y1 = next(), x = next(), y = next();
        if (rel) { x1 += cx; y1 += cy; x += cx; y += cy; }
        sampleQuad({ x: cx, y: cy }, { x: x1, y: y1 }, { x, y }, out);
        px = x1; py = y1; cx = x; cy = y;
        break;
      }
      case 'T': {
        let x = next(), y = next();
        if (rel) { x += cx; y += cy; }
        const x1 = 2 * cx - px;
        const y1 = 2 * cy - py;
        sampleQuad({ x: cx, y: cy }, { x: x1, y: y1 }, { x, y }, out);
        px = x1; py = y1; cx = x; cy = y;
        break;
      }
      case 'A': {
        const rx = next();
        const ry = next();
        const rot = next();
        const laf = next();
        const sf = next();
        let x = next();
        let y = next();
        if (rel) { x += cx; y += cy; }
        sampleArc(cx, cy, rx, ry, rot, laf !== 0, sf !== 0, x, y, out);
        cx = x; cy = y; px = x; py = y;
        break;
      }
      case 'Z': {
        cx = sx; cy = sy; px = cx; py = cy;
        break;
      }
      default:
        i++; // skip unknown token defensively
        break;
    }
  }
  return out;
}

/** Walk the SVG content string and collect bounding sample points in final coordinates. */
function collectPoints(content: string): { points: Pt[]; pad: number } {
  const points: Pt[] = [];
  let maxPad = 0;
  const stack: Mat[] = [IDENT];
  let skipDepth = 0; // inside <defs> / <clipPath>: not drawn

  const tagRe = /<(\/?)\s*([a-zA-Z]+)([^>]*?)(\/?)\s*>/g;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(content)) !== null) {
    const closing = m[1] === '/';
    const name = m[2]!.toLowerCase();
    const attrs = m[3] || '';
    const selfClose = m[4] === '/';

    if (name === 'defs' || name === 'clippath') {
      if (closing) skipDepth = Math.max(0, skipDepth - 1);
      else if (!selfClose) skipDepth++;
      continue;
    }
    if (name === 'g') {
      if (closing) {
        if (stack.length > 1) stack.pop();
      } else {
        const tf = strAttr(attrs, 'transform');
        const ctm = tf ? matMul(stack[stack.length - 1]!, parseTransform(tf)) : stack[stack.length - 1]!;
        if (!selfClose) stack.push(ctm);
      }
      continue;
    }
    if (closing || skipDepth > 0) continue;

    // Drawable shape — compute its effective CTM (group CTM + element transform).
    const tf = strAttr(attrs, 'transform');
    const base = stack[stack.length - 1]!;
    const ctm = tf ? matMul(base, parseTransform(tf)) : base;
    const local: Pt[] = [];

    switch (name) {
      case 'circle': {
        const cx = numAttr(attrs, 'cx') ?? 0;
        const cy = numAttr(attrs, 'cy') ?? 0;
        const r = numAttr(attrs, 'r') ?? 0;
        for (let k = 0; k < CIRCLE_SAMPLES; k++) {
          const a = (2 * Math.PI * k) / CIRCLE_SAMPLES;
          local.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        }
        break;
      }
      case 'ellipse': {
        const cx = numAttr(attrs, 'cx') ?? 0;
        const cy = numAttr(attrs, 'cy') ?? 0;
        const rx = numAttr(attrs, 'rx') ?? 0;
        const ry = numAttr(attrs, 'ry') ?? 0;
        for (let k = 0; k < CIRCLE_SAMPLES; k++) {
          const a = (2 * Math.PI * k) / CIRCLE_SAMPLES;
          local.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
        }
        break;
      }
      case 'rect': {
        const x = numAttr(attrs, 'x') ?? 0;
        const y = numAttr(attrs, 'y') ?? 0;
        const w = numAttr(attrs, 'width') ?? 0;
        const h = numAttr(attrs, 'height') ?? 0;
        local.push({ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h });
        break;
      }
      case 'line': {
        local.push(
          { x: numAttr(attrs, 'x1') ?? 0, y: numAttr(attrs, 'y1') ?? 0 },
          { x: numAttr(attrs, 'x2') ?? 0, y: numAttr(attrs, 'y2') ?? 0 },
        );
        break;
      }
      case 'polygon':
      case 'polyline': {
        const raw = strAttr(attrs, 'points');
        if (raw) {
          const nums = raw.match(/-?\d*\.?\d+(?:[eE][-+]?\d+)?/g);
          if (nums) {
            for (let k = 0; k + 1 < nums.length; k += 2) {
              local.push({ x: parseFloat(nums[k]!), y: parseFloat(nums[k + 1]!) });
            }
          }
        }
        break;
      }
      case 'path': {
        const d = strAttr(attrs, 'd');
        if (d) local.push(...pathPoints(d));
        break;
      }
      default:
        break; // ignore non-geometric elements (stop, gradients, text, ...)
    }

    if (local.length === 0) continue;
    const pad = strokePad(attrs) * matScale(ctm);
    if (pad > maxPad) maxPad = pad;
    for (const p of local) points.push(matApply(ctm, p.x, p.y));
  }

  return { points, pad: maxPad };
}

// --- Minimal enclosing circle (deterministic) -------------------------------

interface Circle {
  x: number;
  y: number;
  r: number;
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

function inCircle(c: Circle, p: Pt, eps = 1e-7): boolean {
  return dist(c.x, c.y, p.x, p.y) <= c.r + eps;
}

function circleFrom2(a: Pt, b: Pt): Circle {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, r: dist(a.x, a.y, b.x, b.y) / 2 };
}

function circleFrom3(a: Pt, b: Pt, c: Pt): Circle | null {
  const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  if (Math.abs(d) < 1e-9) return null; // collinear
  const a2 = a.x * a.x + a.y * a.y;
  const b2 = b.x * b.x + b.y * b.y;
  const c2 = c.x * c.x + c.y * c.y;
  const ux = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
  const uy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
  return { x: ux, y: uy, r: dist(ux, uy, a.x, a.y) };
}

/** Andrew's monotone chain convex hull (deterministic). */
function convexHull(pts: Pt[]): Pt[] {
  if (pts.length < 3) return pts.slice();
  const sorted = pts.slice().sort((p, q) => (p.x - q.x) || (p.y - q.y));
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let k = sorted.length - 1; k >= 0; k--) {
    const p = sorted[k]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

/**
 * Minimal enclosing circle via the incremental (Welzl) construction over the
 * convex hull. The hull is small, so the deterministic O(h^3) worst case is
 * cheap, and using a fixed point order keeps output stable for snapshots.
 */
function minEnclosingCircle(allPoints: Pt[]): Circle {
  const pts = convexHull(allPoints);
  if (pts.length === 0) return { x: 0, y: 0, r: 0 };
  if (pts.length === 1) return { x: pts[0]!.x, y: pts[0]!.y, r: 0 };

  let c: Circle = circleFrom2(pts[0]!, pts[1]!);
  for (let i = 2; i < pts.length; i++) {
    if (inCircle(c, pts[i]!)) continue;
    c = circleFrom2(pts[i]!, pts[0]!);
    for (let j = 1; j < i; j++) {
      if (inCircle(c, pts[j]!)) continue;
      c = circleFrom2(pts[i]!, pts[j]!);
      for (let k = 0; k < j; k++) {
        if (inCircle(c, pts[k]!)) continue;
        const c3 = circleFrom3(pts[i]!, pts[j]!, pts[k]!);
        if (c3) c = c3;
      }
    }
  }
  return c;
}

function round(n: number): number {
  return Math.round(n * 1e4) / 1e4;
}

/**
 * Wrap `content` in a group transform that scales and centers it to fit exactly
 * inside the target circle (inscribed in the `size`×`size` viewBox, minus
 * `padding`). The content never overflows the circle and touches it on all
 * sides (its minimal enclosing circle becomes concentric with the target).
 */
export function fitToCircle(content: string, options: FitOptions = {}): string {
  const size = options.size ?? 100;
  const padding = options.padding ?? 4;
  const targetR = size / 2 - padding;

  const { points, pad } = collectPoints(content);
  if (points.length === 0) return `<g>${content}</g>`;

  const mec = minEnclosingCircle(points);
  const contentR = mec.r + pad; // include stroke so it never overflows
  if (contentR < 1e-6) return `<g>${content}</g>`;

  const s = round(targetR / contentR);
  const cx = round(mec.x);
  const cy = round(mec.y);
  const center = size / 2;

  return `<g transform="translate(${center} ${center}) scale(${s}) translate(${-cx} ${-cy})">${content}</g>`;
}

// Exposed for unit tests.
export const __test = { collectPoints, minEnclosingCircle, parseTransform, pathPoints };
