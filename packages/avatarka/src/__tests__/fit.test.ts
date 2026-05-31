import { describe, it, expect } from 'vitest';
import { fitToCircle, __test } from '../fit';

const { collectPoints, minEnclosingCircle } = __test;

const SIZE = 100;
const CENTER = SIZE / 2;

/** Max distance of any geometry point of `content` from the viewBox center. */
function maxRadius(content: string): number {
  const { points } = collectPoints(content);
  let max = 0;
  for (const p of points) {
    const d = Math.hypot(p.x - CENTER, p.y - CENTER);
    if (d > max) max = d;
  }
  return max;
}

describe('fitToCircle — never overflows the target circle', () => {
  const padding = 4;
  const R = SIZE / 2 - padding; // 46

  // `touch` = the geometry itself should reach the boundary. For stroked
  // shapes the centerline is intentionally inset by stroke/2 (so the visible
  // stroke edge touches the circle), so we only assert no-overflow there.
  const cases: Array<{ label: string; content: string; touch?: boolean }> = [
    { label: 'centered circle', content: '<circle cx="50" cy="50" r="10"/>' },
    { label: 'off-center small circle', content: '<circle cx="20" cy="20" r="5"/>' },
    { label: 'huge circle (overflows raw)', content: '<circle cx="50" cy="50" r="90"/>' },
    { label: 'tall rect', content: '<rect x="46" y="5" width="8" height="90"/>' },
    { label: 'wide ellipse', content: '<ellipse cx="50" cy="50" rx="48" ry="6"/>' },
    { label: 'polygon', content: '<polygon points="10,90 90,90 50,10"/>' },
    { label: 'path with curves', content: '<path d="M20,50 Q50,0 80,50 Q50,100 20,50 Z"/>' },
    { label: 'rotated rect', content: '<rect x="30" y="48" width="40" height="4" transform="rotate(45 50 50)"/>' },
    { label: 'nested group transform', content: '<g transform="translate(50 50) scale(2) translate(-50 -50)"><circle cx="50" cy="50" r="20"/></g>' },
    { label: 'stroked line', content: '<line x1="10" y1="50" x2="90" y2="50" stroke="#000" stroke-width="6"/>', touch: false },
  ];

  for (const { label, content, touch = true } of cases) {
    it(`fits: ${label}`, () => {
      const fitted = fitToCircle(content, { padding });
      const max = maxRadius(fitted);
      // Hard guarantee: never overflows (small epsilon for float + sampling).
      expect(max).toBeLessThanOrEqual(R + 0.05);
      // Touches the boundary (only for shapes whose geometry is the visible edge).
      if (touch) expect(max).toBeGreaterThan(R - 0.5);
    });
  }
});

describe('fitToCircle — geometry parsing', () => {
  it('ignores <defs> content', () => {
    const content = '<defs><circle cx="0" cy="0" r="1000"/></defs><circle cx="50" cy="50" r="10"/>';
    const fitted = fitToCircle(content, { padding: 4 });
    // If defs were counted, the scale would be ~tiny; expect the r=10 circle to drive a ~4.6x scale.
    const m = fitted.match(/scale\(([\d.]+)\)/);
    expect(m).not.toBeNull();
    expect(parseFloat(m![1]!)).toBeGreaterThan(4);
  });

  it('ignores <clipPath> content', () => {
    const content = '<clipPath id="c"><rect x="0" y="0" width="1000" height="1000"/></clipPath><circle cx="50" cy="50" r="20"/>';
    const max = maxRadius(fitToCircle(content, { padding: 4 }));
    expect(max).toBeLessThanOrEqual(46 + 0.05);
  });

  it('centers an off-center shape onto the viewBox center', () => {
    const fitted = fitToCircle('<rect x="0" y="0" width="20" height="20"/>', { padding: 4 });
    // square centered at (10,10) -> translate(-10 -10) inside the group
    expect(fitted).toContain('translate(-10 -10)');
    expect(fitted).toContain(`translate(${CENTER} ${CENTER})`);
  });

  it('returns content unchanged when there is no geometry', () => {
    expect(fitToCircle('<defs></defs>')).toBe('<g><defs></defs></g>');
  });
});

describe('minEnclosingCircle', () => {
  it('encloses a square tightly', () => {
    const c = minEnclosingCircle([
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 },
    ]);
    expect(c.x).toBeCloseTo(5, 5);
    expect(c.y).toBeCloseTo(5, 5);
    expect(c.r).toBeCloseTo(Math.hypot(5, 5), 5);
  });

  it('is deterministic regardless of point order', () => {
    const pts = [
      { x: 1, y: 2 }, { x: 7, y: 3 }, { x: 4, y: 9 }, { x: 0, y: 0 }, { x: 5, y: 5 },
    ];
    const a = minEnclosingCircle(pts);
    const b = minEnclosingCircle(pts.slice().reverse());
    expect(a.x).toBeCloseTo(b.x, 6);
    expect(a.y).toBeCloseTo(b.y, 6);
    expect(a.r).toBeCloseTo(b.r, 6);
  });
});
