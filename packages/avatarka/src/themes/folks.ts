import type { ParamSchema, ParamsFromSchema } from '../types';
import { paletteNames, palettes, type PaletteName } from '../palettes';
import {
  createArtVariation,
  renderAvatarFrame,
  tonalEdge,
} from '../internal/art';
import {
  backgroundShapeNames,
  type BackgroundShape,
  type AvatarRandom,
  type InternalTheme,
} from '../internal/types';
import {
  getHairDefinition,
  hairStyleNames,
  hairStyleWeights,
  renderHairLayer,
  renderHeadband,
  renderScalpUnderlay,
} from './folksHair';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: backgroundShapeNames,
  },
  palette: {
    type: 'select',
    default: 'coast',
    options: paletteNames,
  },
  skinTone: {
    type: 'select',
    default: 'sand',
    options: ['porcelain', 'peach', 'sand', 'honey', 'copper', 'umber', 'deep'],
  },
  faceShape: {
    type: 'select',
    default: 'oval',
    options: ['oval', 'round', 'soft-square', 'tapered'],
  },
  hairStyle: {
    type: 'select',
    default: 'sweep',
    options: hairStyleNames,
  },
  hairColor: {
    type: 'select',
    default: 'espresso',
    options: ['ink', 'espresso', 'chestnut', 'copper', 'gold', 'silver'],
  },
  eyeStyle: {
    type: 'select',
    default: 'soft',
    options: ['soft', 'open', 'calm', 'focused', 'wink'],
  },
  mouthStyle: {
    type: 'select',
    default: 'soft-smile',
    options: ['neutral', 'soft-smile', 'smile', 'open'],
  },
  topStyle: {
    type: 'select',
    default: 'crew',
    options: ['crew', 'collar', 'hood', 'wrap'],
  },
  accessory: {
    type: 'select',
    default: 'none',
    options: ['none', 'round-glasses', 'soft-glasses', 'studs', 'headband'],
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'hairStyle' as const;

export type FolksParams = ParamsFromSchema<typeof schema>;

const skinTones = {
  porcelain: { base: '#f4d9ce', ink: '#3f2924' },
  peach: { base: '#edc4ae', ink: '#3f2924' },
  sand: { base: '#dca982', ink: '#3b2721' },
  honey: { base: '#c88b5b', ink: '#34221d' },
  copper: { base: '#a86643', ink: '#291a16' },
  umber: { base: '#85543c', ink: '#2b1a16' },
  deep: { base: '#684236', ink: '#211310' },
} as const;

const hairColors = {
  ink: { base: '#25282c', shade: '#151719' },
  espresso: { base: '#4a332a', shade: '#2f211c' },
  chestnut: { base: '#75442f', shade: '#4f2c20' },
  copper: { base: '#a85f3e', shade: '#76402c' },
  gold: { base: '#c69752', shade: '#8d6637' },
  silver: { base: '#a5a6a5', shade: '#747675' },
} as const;

// Eye whites are a semantic pigment, not part of the palette canvas.
const eyeWhite = '#fffaf7';

interface FaceMetrics {
  eyeGap: number;
  eyeY: number;
  eyeSkew: number;
  leftEyeScale: number;
  rightEyeScale: number;
  gazeX: number;
  browLift: number;
  noseX: number;
  noseY: number;
  noseLean: number;
  mouthX: number;
  mouthY: number;
  mouthScale: number;
  earX: number;
  earY: number;
  leftEarScale: number;
  rightEarScale: number;
  headTilt: number;
  headShiftX: number;
  headShiftY: number;
  shoulderTilt: number;
  detail: 'none' | 'freckles' | 'beauty-mark' | 'cheek-lines';
}

interface FacialFeatureStyle {
  color: string;
  strokeScale: number;
  strokeFloor: number;
}

function facialFeatureStyle(
  skinTone: FolksParams['skinTone'],
  base: string,
  ink: string,
): FacialFeatureStyle {
  switch (skinTone) {
    case 'deep':
      return {
        color: tonalEdge(base, ink, 0.72),
        strokeScale: 1.2,
        strokeFloor: 1.7,
      };
    case 'umber':
      return {
        color: tonalEdge(base, ink, 0.62),
        strokeScale: 1.12,
        strokeFloor: 1.55,
      };
    default:
      return {
        color: tonalEdge(base, ink, 0.54),
        strokeScale: 1,
        strokeFloor: 0,
      };
  }
}

function facialStrokeWidth(style: FacialFeatureStyle, width: number): number {
  return Math.round(Math.max(width * style.strokeScale, style.strokeFloor) * 100) / 100;
}

function faceMetrics(params: FolksParams): FaceMetrics {
  // Pigments are presentation. Excluding them keeps every facial and head
  // coordinate stable while consumers recolor an otherwise identical person.
  const art = createArtVariation('folks', {
    accessory: params.accessory,
    eyeStyle: params.eyeStyle,
    faceShape: params.faceShape,
    hairStyle: params.hairStyle,
    mouthStyle: params.mouthStyle,
    topStyle: params.topStyle,
  });
  const shapeMetrics = {
    oval: { eyeGap: 18, eyeY: 50, noseY: 55, mouthY: 67, earX: 27, earY: 53 },
    round: { eyeGap: 19.5, eyeY: 49, noseY: 54, mouthY: 65.5, earX: 25.5, earY: 52 },
    'soft-square': { eyeGap: 20, eyeY: 49.5, noseY: 55, mouthY: 67, earX: 26.5, earY: 52.5 },
    tapered: { eyeGap: 17, eyeY: 48.5, noseY: 54, mouthY: 66.5, earX: 29, earY: 52 },
  } as const;
  const base = shapeMetrics[params.faceShape];

  return {
    eyeGap: base.eyeGap + art.number('eye-gap', -1.15, 1.15),
    eyeY: base.eyeY + art.number('eye-line', -0.65, 0.65),
    eyeSkew: art.number('eye-skew', -0.7, 0.7),
    leftEyeScale: art.number('left-eye-scale', 0.92, 1.07),
    rightEyeScale: art.number('right-eye-scale', 0.92, 1.07),
    gazeX: art.number('gaze-x', -0.65, 0.65),
    browLift: art.number('brow-lift', -0.8, 0.8),
    noseX: 50 + art.number('nose-x', -0.85, 0.85),
    noseY: base.noseY + art.number('nose-y', -0.45, 0.55),
    noseLean: art.number('nose-lean', -1.2, 1.2),
    mouthX: 50 + art.number('mouth-x', -0.9, 0.9),
    mouthY: base.mouthY + art.number('mouth-y', -0.55, 0.65),
    mouthScale: art.number('mouth-scale', 0.88, 1.13),
    earX: base.earX + art.number('ear-spacing', -0.55, 0.55),
    earY: base.earY + art.number('ear-line', -0.7, 0.7),
    leftEarScale: art.number('left-ear-scale', 0.9, 1.08),
    rightEarScale: art.number('right-ear-scale', 0.9, 1.08),
    headTilt: art.number('head-tilt', -2.35, 2.35),
    headShiftX: art.number('head-shift-x', -0.9, 0.9),
    headShiftY: art.number('head-shift-y', -0.4, 0.65),
    shoulderTilt: art.number('shoulder-tilt', -1.4, 1.4),
    detail: art.pick('skin-detail', [
      'none', 'none', 'none', 'none', 'freckles', 'beauty-mark', 'cheek-lines',
    ] as const),
  };
}

function face(shape: FolksParams['faceShape'], base: string, edge: string): string {
  const common = `fill="${base}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"`;

  switch (shape) {
    case 'round':
      return `<path d="M50 20C66 20 76 31 76 48C76 66 66 78 50 79C34 78 24 66 24 48C24 31 34 20 50 20Z" ${common}/>`;
    case 'soft-square':
      return `<path d="M35 20Q50 16 65 20Q74 24 74 37V62Q72 77 59 81H41Q28 77 26 62V37Q26 24 35 20Z" ${common}/>`;
    case 'tapered':
      return `<path d="M28 35Q28 20 50 18Q72 20 72 35L68 61Q64 74 50 82Q36 74 32 61Z" ${common}/>`;
    case 'oval':
      return `<path d="M50 18C64 18 72 29 72.5 47C73 66 64 79 50 81C36 79 27 66 27.5 47C28 29 36 18 50 18Z" ${common}/>`;
  }
}

function ears(
  base: string,
  edge: string,
  feature: string,
  metrics: FaceMetrics,
): string {
  const leftX = metrics.earX;
  const rightX = 100 - metrics.earX;
  const leftRx = 4.2 * metrics.leftEarScale;
  const leftRy = 6.8 * metrics.leftEarScale;
  const rightRx = 4.2 * metrics.rightEarScale;
  const rightRy = 6.8 * metrics.rightEarScale;
  const leftY = metrics.earY - metrics.eyeSkew * 0.35;
  const rightY = metrics.earY + metrics.eyeSkew * 0.35;

  return `
    <ellipse cx="${leftX}" cy="${leftY}" rx="${leftRx}" ry="${leftRy}" fill="${base}" stroke="${edge}" stroke-width="1.2"/>
    <ellipse cx="${rightX}" cy="${rightY}" rx="${rightRx}" ry="${rightRy}" fill="${base}" stroke="${edge}" stroke-width="1.2"/>
    <path d="M${leftX} ${leftY - 3}Q${leftX - 1.5} ${leftY} ${leftX} ${leftY + 3}M${rightX} ${rightY - 3}Q${rightX + 1.5} ${rightY} ${rightX} ${rightY + 3}" fill="none" stroke="${feature}" stroke-width="1.35" stroke-linecap="round" opacity="0.4"/>
  `;
}

function brows(
  hairShade: string,
  metrics: FaceMetrics,
): string {
  const left = 50 - metrics.eyeGap / 2;
  const right = 50 + metrics.eyeGap / 2;
  const y = metrics.eyeY - 7 + metrics.browLift;
  const path = `M${left - 5} ${y + metrics.eyeSkew * 0.35} Q${left} ${y - 3} ${left + 5} ${y + metrics.eyeSkew * 0.15} M${right - 5} ${y - metrics.eyeSkew * 0.15} Q${right} ${y - 3} ${right + 5} ${y - metrics.eyeSkew * 0.35}`;
  return `<path d="${path}" fill="none" stroke="${hairShade}" stroke-width="1.75" stroke-linecap="round"/>`;
}

function nose(feature: FacialFeatureStyle, metrics: FaceMetrics): string {
  const { noseX: x, noseY: y, noseLean: lean } = metrics;
  const path = `M${x} ${y} Q${x - 3 + lean} ${y + 6} ${x + 1 + lean * 0.45} ${y + 7}`;
  return `<path d="${path}" fill="none" stroke="${feature.color}" stroke-width="${facialStrokeWidth(feature, 1.45)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.82"/>`;
}

function eyes(
  style: FolksParams['eyeStyle'],
  feature: FacialFeatureStyle,
  canvas: string,
  pupil: string,
  metrics: FaceMetrics,
): string {
  const left = 50 - metrics.eyeGap / 2;
  const right = 50 + metrics.eyeGap / 2;
  const leftY = metrics.eyeY - metrics.eyeSkew / 2;
  const rightY = metrics.eyeY + metrics.eyeSkew / 2;
  const openEye = (
    x: number,
    y: number,
    scale: number,
    radiusX = 2.7,
    radiusY = 3.5,
  ): string => `
    <ellipse cx="${x}" cy="${y}" rx="${radiusX * scale}" ry="${radiusY * scale}" fill="${pupil}"/>
    <circle cx="${x - 0.8 + metrics.gazeX}" cy="${y - 1}" r="0.75" fill="${canvas}"/>
  `;
  const closedEye = (path: string): string => (
    `<path d="${path}" fill="none" stroke="${feature.color}" stroke-width="${facialStrokeWidth(feature, 1.75)}" stroke-linecap="round"/>`
  );

  switch (style) {
    case 'soft':
      return `${openEye(left, leftY, metrics.leftEyeScale)}${openEye(right, rightY, metrics.rightEyeScale)}`;
    case 'open':
      return `
        <ellipse cx="${left}" cy="${leftY}" rx="${4.6 * metrics.leftEyeScale}" ry="${3.6 * metrics.leftEyeScale}" fill="${canvas}" stroke="${feature.color}" stroke-width="${facialStrokeWidth(feature, 1.35)}"/>
        <ellipse cx="${right}" cy="${rightY}" rx="${4.6 * metrics.rightEyeScale}" ry="${3.6 * metrics.rightEyeScale}" fill="${canvas}" stroke="${feature.color}" stroke-width="${facialStrokeWidth(feature, 1.35)}"/>
        <circle cx="${left + metrics.gazeX}" cy="${leftY}" r="${2.2 * metrics.leftEyeScale}" fill="${pupil}"/><circle cx="${right + metrics.gazeX}" cy="${rightY}" r="${2.2 * metrics.rightEyeScale}" fill="${pupil}"/>
        <circle cx="${left - 0.6 + metrics.gazeX}" cy="${leftY - 0.7}" r="0.65" fill="${canvas}"/><circle cx="${right - 0.6 + metrics.gazeX}" cy="${rightY - 0.7}" r="0.65" fill="${canvas}"/>
      `;
    case 'calm':
      return `${closedEye(`M${left - 5} ${leftY + 1} Q${left} ${leftY - 3} ${left + 5} ${leftY + 1}`)}${closedEye(`M${right - 5} ${rightY + 1} Q${right} ${rightY - 3} ${right + 5} ${rightY + 1}`)}`;
    case 'focused':
      return `
        ${openEye(left, leftY + 1, metrics.leftEyeScale, 3, 3.2)}${openEye(right, rightY + 1, metrics.rightEyeScale, 3, 3.2)}
        <path d="M${left - 4} ${leftY - 2}Q${left} ${leftY - 4} ${left + 4} ${leftY - 1}M${right - 4} ${rightY - 1}Q${right} ${rightY - 4} ${right + 4} ${rightY - 2}" fill="none" stroke="${feature.color}" stroke-width="${facialStrokeWidth(feature, 1.55)}" stroke-linecap="round"/>
      `;
    case 'wink':
      return `${openEye(left, leftY, metrics.leftEyeScale, 2.8, 3.6)}${closedEye(`M${right - 5} ${rightY + 1} Q${right} ${rightY - 3} ${right + 5} ${rightY + 1}`)}`;
  }
}

function mouth(
  style: FolksParams['mouthStyle'],
  lip: FacialFeatureStyle,
  inner: string,
  metrics: FaceMetrics,
): string {
  const x = metrics.mouthX;
  const y = metrics.mouthY;
  const width = metrics.mouthScale;

  switch (style) {
    case 'neutral':
      return `<path d="M${x - 4 * width} ${y} Q${x} ${y + 1} ${x + 4 * width} ${y - 0.2}" fill="none" stroke="${lip.color}" stroke-width="${facialStrokeWidth(lip, 1.65)}" stroke-linecap="round"/>`;
    case 'soft-smile':
      return `<path d="M${x - 5.5 * width} ${y} Q${x} ${y + 4} ${x + 5.5 * width} ${y}" fill="none" stroke="${lip.color}" stroke-width="${facialStrokeWidth(lip, 1.7)}" stroke-linecap="round"/>`;
    case 'smile':
      return `<path d="M${x - 7.5 * width} ${y - 1} Q${x} ${y + 3} ${x + 7.5 * width} ${y - 1}" fill="none" stroke="${lip.color}" stroke-width="${facialStrokeWidth(lip, 1.7)}" stroke-linecap="round"/>`;
    case 'open':
      return `
        <path d="M${x - 6 * width} ${y - 1} Q${x} ${y + 6} ${x + 6 * width} ${y - 1} Q${x + 4 * width} ${y + 8} ${x} ${y + 8} Q${x - 4 * width} ${y + 8} ${x - 6 * width} ${y - 1} Z" fill="${inner}"/>
        <path d="M${x - 3 * width} ${y + 5}Q${x} ${y + 7} ${x + 3 * width} ${y + 5}" fill="none" stroke="${lip.color}" stroke-width="${facialStrokeWidth(lip, 1.55)}" stroke-linecap="round"/>
      `;
  }
}

function top(
  style: FolksParams['topStyle'],
  primary: string,
  secondary: string,
  edge: string,
  metrics: FaceMetrics,
): string {
  let artwork: string;

  // Shoulder seams keep their authored curves; below the seam each garment
  // follows the avatar circle itself (the A-arc) so the bust reads as cropped
  // by the frame while no geometry ever escapes it — even under the maximum
  // shoulder tilt, which rotates the flank joins slightly outward.
  switch (style) {
    case 'crew':
      artwork = `<path d="M16.3 85.4 Q21.8 81.2 30 79 Q39 76 42 76 L58 76 Q61 76 70 79 Q78.2 81.2 83.7 85.4 A48.9 48.9 0 0 1 16.3 85.4 Z" fill="${primary}"/><path d="M38 78 Q50 91 62 78 Q59 89 50 91 Q41 89 38 78 Z" fill="${secondary}"/>`;
      break;
    case 'collar':
      artwork = `
        <path d="M19.6 88.3 Q24.7 83.1 33 80 Q41 77 44 76 L56 76 Q59 77 67 80 Q75.4 83.1 80.4 88.3 A48.9 48.9 0 0 1 19.6 88.3 Z" fill="${primary}"/>
        <path d="M40 77 L50 86 L43 92 L35 80 Z" fill="${secondary}"/>
        <path d="M60 77 L50 86 L57 92 L65 80 Z" fill="${secondary}"/>
        <path d="M50 86 L50 99" stroke="${edge}" stroke-width="1.5" stroke-linecap="round" opacity="0.62"/>
      `;
      break;
    case 'hood':
      artwork = `
        <path d="M15.4 84.6 Q20.5 78.5 30 75 Q39 70 50 72 Q61 70 70 75 Q79.5 78.5 84.6 84.6 A48.9 48.9 0 0 1 15.4 84.6 Z" fill="${secondary}"/>
        <path d="M24.6 91.8 Q28.9 84.4 38 81 Q50 93 62 81 Q71.1 84.4 75.4 91.8 A48.9 48.9 0 0 1 24.6 91.8 Z" fill="${primary}"/>
      `;
      break;
    case 'wrap':
      artwork = `
        <path d="M17.9 86.8 Q23.1 82.6 31 80 Q40 76 44 76 L58 76 Q64 78 72 82 Q77.1 84.7 81 87.9 A48.9 48.9 0 0 1 17.9 86.8 Z" fill="${primary}"/>
        <path d="M25 81 Q41.6 86 65.2 96.5 A48.9 48.9 0 0 1 46.3 98.8 Q35.6 92.2 21 88 Z" fill="${secondary}"/>
      `;
      break;
  }

  return `<g transform="rotate(${metrics.shoulderTilt} 50 91)">${artwork}</g>`;
}

function faceAccessory(
  style: FolksParams['accessory'],
  hairStyle: FolksParams['hairStyle'],
  edge: string,
  accent: string,
  metrics: FaceMetrics,
): string {
  const left = 50 - metrics.eyeGap / 2;
  const right = 50 + metrics.eyeGap / 2;
  const eyeY = metrics.eyeY;

  switch (style) {
    case 'round-glasses':
      return `
        <circle cx="${left}" cy="${eyeY - metrics.eyeSkew / 2}" r="8" fill="none" stroke="${edge}" stroke-width="1.6"/>
        <circle cx="${right}" cy="${eyeY + metrics.eyeSkew / 2}" r="8" fill="none" stroke="${edge}" stroke-width="1.6"/>
        <path d="M${left + 8} ${eyeY} Q50 ${eyeY - 2} ${right - 8} ${eyeY}" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>
      `;
    case 'soft-glasses':
      return `
        <rect x="${left - 8}" y="${eyeY - 6 - metrics.eyeSkew / 2}" width="16" height="12" rx="5" fill="none" stroke="${edge}" stroke-width="1.6"/>
        <rect x="${right - 8}" y="${eyeY - 6 + metrics.eyeSkew / 2}" width="16" height="12" rx="5" fill="none" stroke="${edge}" stroke-width="1.6"/>
        <path d="M${left + 8} ${eyeY - 1} Q50 ${eyeY - 3} ${right - 8} ${eyeY - 1}" fill="none" stroke="${edge}" stroke-width="1.6" stroke-linecap="round"/>
      `;
    case 'studs':
      {
        const { studs } = getHairDefinition(hairStyle).anchors;
        return `
        <circle cx="${metrics.earX + studs.leftX}" cy="${metrics.earY + studs.y}" r="2.15" fill="${accent}" stroke="${edge}" stroke-width="1.15"/>
        <circle cx="${100 - metrics.earX + studs.rightX}" cy="${metrics.earY + studs.y}" r="2.15" fill="${accent}" stroke="${edge}" stroke-width="1.15"/>
      `;
      }
    case 'headband':
      return '';
    case 'none':
      return '';
  }
}

function skinDetail(metrics: FaceMetrics, color: string): string {
  switch (metrics.detail) {
    case 'none':
      return '';
    case 'freckles':
      return `<g fill="${color}" opacity="0.42"><circle cx="${metrics.mouthX - 10}" cy="${metrics.mouthY - 6}" r="0.8"/><circle cx="${metrics.mouthX - 7}" cy="${metrics.mouthY - 5}" r="0.65"/><circle cx="${metrics.mouthX + 8}" cy="${metrics.mouthY - 5.5}" r="0.75"/></g>`;
    case 'beauty-mark':
      return `<circle cx="${metrics.mouthX + 9}" cy="${metrics.mouthY - 4}" r="0.85" fill="${color}" opacity="0.7"/>`;
    case 'cheek-lines':
      return `<path d="M${metrics.mouthX - 14} ${metrics.mouthY - 4}l3 -1M${metrics.mouthX + 11} ${metrics.mouthY - 5}l3 1" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>`;
  }
}

export function generate(params: FolksParams): string {
  const {
    backgroundShape,
    palette: paletteName,
    skinTone,
    faceShape,
    hairStyle,
    hairColor,
    eyeStyle,
    mouthStyle,
    topStyle,
    accessory: accessoryStyle,
  } = params;
  const palette = palettes[paletteName as PaletteName];
  const skin = skinTones[skinTone];
  const hair = hairColors[hairColor];
  const skinEdge = tonalEdge(skin.base, skin.ink, 0.28);
  const skinFeature = facialFeatureStyle(skinTone, skin.base, skin.ink);
  const topEdge = tonalEdge(palette.primary, palette.ink, 0.34);
  const accessoryEdge = tonalEdge(palette.accent, palette.ink, 0.46);
  const metrics = faceMetrics(params);
  const earLayer = ears(skin.base, skinEdge, skinFeature.color, metrics);
  const definition = getHairDefinition(hairStyle);
  const hairPigments = { base: hair.base, shade: hair.shade };
  const earsUnderHair = definition.anchors.ears === 'under-hair';
  const lowerBehindNeck = definition.anchors.lowerHair === 'behind-neck';
  const headTransform = `translate(${metrics.headShiftX} ${metrics.headShiftY}) rotate(${metrics.headTilt} 50 53)`;

  const content = `
    ${top(topStyle, palette.primary, palette.secondary, topEdge, metrics)}
    <g transform="${headTransform}">
      ${lowerBehindNeck ? renderHairLayer(hairStyle, 'lower', hairPigments) : ''}
      <path d="M41 68 Q41 79 38 82 Q50 89 62 82 Q59 79 59 68 Z" fill="${skin.base}" stroke="${skinEdge}" stroke-width="1.2" stroke-linejoin="round"/>
      ${lowerBehindNeck ? '' : renderHairLayer(hairStyle, 'lower', hairPigments)}
      ${earsUnderHair ? earLayer : ''}
      ${renderHairLayer(hairStyle, 'back', hairPigments)}
      ${earsUnderHair ? '' : earLayer}
      ${face(faceShape, skin.base, skinEdge)}
      ${renderScalpUnderlay(hairStyle, hairPigments)}
      ${accessoryStyle === 'headband' ? renderHeadband(hairStyle, palette.accent, 'before-front') : ''}
      ${renderHairLayer(hairStyle, 'front', hairPigments)}
      ${renderHairLayer(hairStyle, 'overlay', hairPigments)}
      ${brows(hair.shade, metrics)}
      ${eyes(eyeStyle, skinFeature, eyeWhite, skin.ink, metrics)}
      ${nose(skinFeature, metrics)}
      ${mouth(mouthStyle, skinFeature, skin.ink, metrics)}
      ${skinDetail(metrics, skinFeature.color)}
      ${accessoryStyle === 'headband' ? renderHeadband(hairStyle, palette.accent, 'over-front') : ''}
      ${faceAccessory(accessoryStyle, hairStyle, accessoryEdge, palette.accent, metrics)}
    </g>
  `;

  return renderAvatarFrame(
    content,
    paletteName as PaletteName,
    backgroundShape as BackgroundShape,
    // Folks geometry fits the circle on its own; no CSS clip fallback needed.
    { clipContent: false },
  );
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<FolksParams> = {},
): FolksParams {
  const hairStyle = traits.hairStyle
    ?? random.weightedPick('hair-style', hairStyleWeights);
  const skinTone = traits.skinTone ?? random.pick('skin-tone', schema.skinTone.options);
  const incompatibleHairColors: Record<FolksParams['skinTone'], readonly FolksParams['hairColor'][]> = {
    porcelain: [],
    peach: [],
    sand: ['silver'],
    honey: ['gold', 'silver'],
    copper: ['copper'],
    umber: ['chestnut'],
    deep: ['espresso'],
  };
  const hairColorChoices = ([
    ['ink', 20],
    ['espresso', 25],
    ['chestnut', 21],
    ['copper', 13],
    ['gold', 13],
    ['silver', 8],
  ] as const).filter(([color]) => (
    !incompatibleHairColors[skinTone].some((excluded) => excluded === color)
  ));

  return {
    backgroundShape: random.weightedPick('background-shape', [
      ['circle', 58],
      ['rounded', 34],
      ['square', 8],
    ] as const),
    palette: random.pick('palette', schema.palette.options),
    skinTone,
    faceShape: random.weightedPick('face-shape', [
      ['oval', 35],
      ['round', 25],
      ['soft-square', 22],
      ['tapered', 18],
    ] as const),
    hairStyle,
    hairColor: random.weightedPick('hair-color', hairColorChoices),
    eyeStyle: random.weightedPick('eye-style', [
      ['soft', 36],
      ['open', 24],
      ['calm', 22],
      ['focused', 13],
      ['wink', 5],
    ] as const),
    mouthStyle: random.weightedPick('mouth-style', [
      ['neutral', 32],
      ['soft-smile', 43],
      ['smile', 20],
      ['open', 5],
    ] as const),
    topStyle: random.pick('top-style', schema.topStyle.options),
    accessory: random.weightedPick('accessory', [
      ['none', 78],
      ['round-glasses', 5],
      ['soft-glasses', 5],
      ['studs', 7],
      ['headband', 5],
    ] as const),
  };
}

export const folks: InternalTheme<typeof schema, 'person', typeof baseTypeParam> = {
  name: 'Folks',
  description: 'Clean, calm people with an optical head-and-shoulders crop.',
  kind: 'person',
  baseTypeParam,
  schema,
  generate,
  randomize,
};
