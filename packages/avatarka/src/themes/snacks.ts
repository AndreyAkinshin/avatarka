import type { ParamSchema, ParamsFromSchema } from '../types';
import { fitToCircle } from '../fit';
import { getPalette, paletteNames, type Palette } from '../palettes';
import { createArtVariation, renderAvatarFrame, tonalEdge } from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';

const expressionOptions = ['calm', 'soft-smile', 'content', 'curious', 'sleepy'] as const;
const finishOptions = ['plain', 'seeds', 'drizzle', 'stripes', 'spots'] as const;
const companionOptions = ['none', 'leaf', 'berry', 'butter', 'steam', 'pick'] as const;
const poseOptions = ['centered', 'lean-left', 'lean-right'] as const;

type FinishName = (typeof finishOptions)[number];
type CompanionName = (typeof companionOptions)[number];
type PoseName = (typeof poseOptions)[number];
type FinishProfileName = 'fruit' | 'baked' | 'sweet' | 'savory' | 'vessel' | 'fresh';
type CompanionProfileName = 'fruit' | 'breakfast' | 'warm' | 'hot' | 'served' | 'hot-served' | 'sweet' | 'fresh';
type LimbProfileName = 'compact' | 'wide' | 'tall' | 'floating' | 'none';
type PoseProfileName = 'round' | 'wide' | 'upright' | 'tall' | 'small';

interface PoseProfile {
  readonly pivotY: number;
  readonly angle: number;
  readonly shiftX: number;
  readonly shiftY: number;
  readonly poseScaleX: number;
  readonly poseScaleY: number;
}

const poseProfiles = {
  round: { pivotY: 76, angle: 6, shiftX: 2.4, shiftY: 1, poseScaleX: 1.01, poseScaleY: 0.99 },
  wide: { pivotY: 73, angle: 4, shiftX: 2.5, shiftY: 1.5, poseScaleX: 1.035, poseScaleY: 0.97 },
  upright: { pivotY: 79, angle: 5, shiftX: 2.7, shiftY: 1, poseScaleX: 1.015, poseScaleY: 0.985 },
  tall: { pivotY: 81, angle: 4.5, shiftX: 2.4, shiftY: 1, poseScaleX: 1.01, poseScaleY: 0.99 },
  small: { pivotY: 75, angle: 5.5, shiftX: 2.2, shiftY: 1.5, poseScaleX: 1.025, poseScaleY: 0.98 },
} as const satisfies Record<PoseProfileName, PoseProfile>;

/** Ordered product catalog and compatibility source of truth for Snacks. */
const snackDefinitions = [
  { id: 'toast', label: 'Toast', finish: 'baked', companion: 'warm', limbs: 'wide', pose: 'upright' },
  { id: 'banana', label: 'Banana', finish: 'fruit', companion: 'fruit', limbs: 'tall', pose: 'tall' },
  { id: 'coffee', label: 'Coffee', finish: 'vessel', companion: 'hot', limbs: 'compact', pose: 'upright' },
  { id: 'pizza', label: 'Pizza', finish: 'savory', companion: 'hot-served', limbs: 'wide', pose: 'wide' },
  { id: 'berry', label: 'Berry', finish: 'fruit', companion: 'fruit', limbs: 'compact', pose: 'round' },
  { id: 'pretzel', label: 'Pretzel', finish: 'baked', companion: 'warm', limbs: 'wide', pose: 'round' },
  { id: 'avocado', label: 'Avocado', finish: 'fruit', companion: 'fruit', limbs: 'compact', pose: 'tall' },
  { id: 'fries', label: 'Fries', finish: 'savory', companion: 'hot-served', limbs: 'compact', pose: 'upright' },
  { id: 'cupcake', label: 'Cupcake', finish: 'sweet', companion: 'sweet', limbs: 'compact', pose: 'upright' },
  { id: 'sushi', label: 'Sushi', finish: 'savory', companion: 'served', limbs: 'compact', pose: 'upright' },
  { id: 'dumpling', label: 'Dumpling', finish: 'savory', companion: 'hot', limbs: 'wide', pose: 'wide' },
  { id: 'pineapple', label: 'Pineapple', finish: 'fruit', companion: 'fruit', limbs: 'tall', pose: 'tall' },
  { id: 'boba', label: 'Boba', finish: 'vessel', companion: 'sweet', limbs: 'compact', pose: 'upright' },
  { id: 'croissant', label: 'Croissant', finish: 'baked', companion: 'warm', limbs: 'wide', pose: 'wide' },
  { id: 'apple', label: 'Apple', finish: 'fruit', companion: 'fruit', limbs: 'compact', pose: 'round' },
  { id: 'noodles', label: 'Noodles', finish: 'savory', companion: 'hot', limbs: 'wide', pose: 'upright' },
  { id: 'taco', label: 'Taco', finish: 'savory', companion: 'hot-served', limbs: 'wide', pose: 'wide' },
  { id: 'donut', label: 'Donut', finish: 'sweet', companion: 'sweet', limbs: 'compact', pose: 'round' },
  { id: 'corn', label: 'Corn', finish: 'fresh', companion: 'fresh', limbs: 'tall', pose: 'tall' },
  { id: 'cake', label: 'Cake', finish: 'sweet', companion: 'sweet', limbs: 'wide', pose: 'upright' },
  { id: 'citrus', label: 'Citrus', finish: 'fruit', companion: 'fruit', limbs: 'compact', pose: 'round' },
  { id: 'burger', label: 'Burger', finish: 'savory', companion: 'hot-served', limbs: 'wide', pose: 'wide' },
  { id: 'carrot', label: 'Carrot', finish: 'fresh', companion: 'fresh', limbs: 'tall', pose: 'tall' },
  { id: 'waffle', label: 'Waffle', finish: 'baked', companion: 'warm', limbs: 'wide', pose: 'upright' },
  { id: 'mushroom', label: 'Mushroom', finish: 'fresh', companion: 'fresh', limbs: 'compact', pose: 'upright' },
  { id: 'watermelon', label: 'Watermelon', finish: 'fruit', companion: 'fruit', limbs: 'wide', pose: 'wide' },
  { id: 'soda-can', label: 'Soda can', finish: 'vessel', companion: 'served', limbs: 'compact', pose: 'tall' },
  { id: 'popcorn', label: 'Popcorn', finish: 'savory', companion: 'hot-served', limbs: 'wide', pose: 'upright' },
  { id: 'egg', label: 'Egg', finish: 'fresh', companion: 'breakfast', limbs: 'wide', pose: 'wide' },
  { id: 'ice-cream', label: 'Ice cream', finish: 'sweet', companion: 'sweet', limbs: 'compact', pose: 'tall' },
  { id: 'pea-pod', label: 'Pea pod', finish: 'fresh', companion: 'fresh', limbs: 'wide', pose: 'wide' },
  { id: 'sandwich', label: 'Sandwich', finish: 'savory', companion: 'served', limbs: 'wide', pose: 'wide' },
  { id: 'onion', label: 'Onion', finish: 'fresh', companion: 'fresh', limbs: 'compact', pose: 'round' },
  { id: 'pancakes', label: 'Pancakes', finish: 'baked', companion: 'warm', limbs: 'wide', pose: 'wide' },
  { id: 'lollipop', label: 'Lollipop', finish: 'sweet', companion: 'sweet', limbs: 'floating', pose: 'tall' },
  { id: 'cheese', label: 'Cheese', finish: 'savory', companion: 'served', limbs: 'wide', pose: 'wide' },
  { id: 'celery', label: 'Celery', finish: 'fresh', companion: 'fresh', limbs: 'tall', pose: 'tall' },
  { id: 'candy', label: 'Candy', finish: 'sweet', companion: 'sweet', limbs: 'wide', pose: 'wide' },
  { id: 'hot-dog', label: 'Hot dog', finish: 'savory', companion: 'hot-served', limbs: 'wide', pose: 'wide' },
  { id: 'jelly', label: 'Jelly', finish: 'sweet', companion: 'sweet', limbs: 'wide', pose: 'small' },
  { id: 'milk-carton', label: 'Milk carton', finish: 'vessel', companion: 'breakfast', limbs: 'compact', pose: 'tall' },
  { id: 'bell-pepper', label: 'Bell pepper', finish: 'fresh', companion: 'fresh', limbs: 'compact', pose: 'round' },
  { id: 'baguette', label: 'Baguette', finish: 'baked', companion: 'warm', limbs: 'tall', pose: 'tall' },
  { id: 'teapot', label: 'Teapot', finish: 'vessel', companion: 'hot', limbs: 'wide', pose: 'wide' },
  { id: 'tofu', label: 'Tofu', finish: 'fresh', companion: 'hot-served', limbs: 'compact', pose: 'upright' },
  { id: 'chocolate', label: 'Chocolate', finish: 'sweet', companion: 'sweet', limbs: 'wide', pose: 'upright' },
  { id: 'artichoke', label: 'Artichoke', finish: 'fresh', companion: 'fresh', limbs: 'compact', pose: 'round' },
  { id: 'ice-pop', label: 'Ice pop', finish: 'sweet', companion: 'sweet', limbs: 'compact', pose: 'tall' },
  { id: 'honey-jar', label: 'Honey jar', finish: 'vessel', companion: 'breakfast', limbs: 'compact', pose: 'upright' },
  { id: 'cookie', label: 'Cookie', finish: 'baked', companion: 'sweet', limbs: 'compact', pose: 'round' },
] as const satisfies readonly {
  readonly id: string;
  readonly label: string;
  readonly finish: FinishProfileName;
  readonly companion: CompanionProfileName;
  readonly limbs: LimbProfileName;
  readonly pose: PoseProfileName;
}[];

type SnackName = (typeof snackDefinitions)[number]['id'];
const snackOptions = Object.freeze(
  snackDefinitions.map(({ id }) => id),
) as readonly SnackName[];

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: backgroundShapeNames,
  },
  palette: {
    type: 'select',
    default: 'clay',
    options: paletteNames,
  },
  snack: {
    type: 'select',
    default: 'toast',
    options: snackOptions,
  },
  expression: {
    type: 'select',
    default: 'soft-smile',
    options: expressionOptions,
  },
  finish: {
    type: 'select',
    default: 'plain',
    options: finishOptions,
  },
  companion: {
    type: 'select',
    default: 'none',
    options: companionOptions,
  },
  pose: {
    type: 'select',
    default: 'centered',
    options: poseOptions,
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'snack' as const;

/**
 * Per-snack presence scale. The transparent r="49" sentinel circle in the
 * artwork keeps the fit envelope stable no matter which finish or companion
 * is enabled, but it also pinned every snack well below the frame size the
 * fullest silhouettes reach. These authored factors grow each snack's drawn
 * geometry toward — never past — that sentinel envelope, so timid snacks fill
 * the frame comparably to the fullest ones. Snacks whose widest lean-pose
 * extent already reaches the envelope keep factor 1: the floor rises, the
 * ceiling does not. Every factor keeps the scaled envelope inside the
 * sentinel circle and keeps combo-dependent strokes inside the sentinel's
 * stroke allowance, so the shared fit stays sentinel-dominated and identical
 * across finish/companion choices.
 */
const snackPresence = {
  toast: 1.014,
  banana: 1.104,
  coffee: 1.048,
  pizza: 1,
  berry: 1,
  pretzel: 1.099,
  avocado: 1.088,
  fries: 1.114,
  cupcake: 1.125,
  sushi: 1.096,
  dumpling: 1,
  pineapple: 1.076,
  boba: 1.01,
  croissant: 1,
  apple: 1.112,
  noodles: 1,
  taco: 1,
  donut: 1.129,
  corn: 1.1,
  cake: 1,
  citrus: 1.049,
  burger: 1,
  carrot: 1.076,
  waffle: 1,
  mushroom: 1.096,
  watermelon: 1,
  'soda-can': 1.121,
  popcorn: 1,
  egg: 1,
  'ice-cream': 1.132,
  'pea-pod': 1,
  sandwich: 1,
  onion: 1.091,
  pancakes: 1.016,
  lollipop: 1.126,
  cheese: 1.011,
  celery: 1.088,
  candy: 1,
  'hot-dog': 1,
  jelly: 1.016,
  'milk-carton': 1.084,
  'bell-pepper': 1.087,
  baguette: 1.11,
  teapot: 1,
  tofu: 1.106,
  chocolate: 1,
  artichoke: 1.092,
  'ice-pop': 1.095,
  'honey-jar': 1.086,
  cookie: 1.121,
} as const satisfies Record<SnackName, number>;

export type SnacksParams = ParamsFromSchema<typeof schema>;


interface FaceAnchor {
  x: number;
  eyeY: number;
  eyeGap: number;
  eyeRx: number;
  eyeRy: number;
  pupilRadius: number;
  mouthY: number;
  mouthWidth: number;
  mouthDepth: number;
}

interface FinishAnchor {
  x: number;
  y: number;
  span: number;
  rotation: number;
}

interface CompanionAnchor {
  x: number;
  y: number;
}

interface SnackLayout {
  body: string;
  face: FaceAnchor;
  finish: FinishAnchor;
  companion: CompanionAnchor;
}

interface SnackArt {
  contour: number;
  detailTilt: number;
  faceShiftX: number;
  faceShiftY: number;
  eyeSkew: number;
  eyeScale: number;
  mouthScale: number;
  widthScale: number;
  heightScale: number;
  restingTilt: number;
}

interface CompanionArt {
  behind: string;
  front: string;
}

function resolveSnackArt(params: SnacksParams): SnackArt {
  // Secondary styling never re-rolls the authored character. A snack keeps the
  // same contour and face placement while finishes, companions, poses, frames,
  // and palettes are explored around it.
  const art = createArtVariation('snacks', {
    ...params,
    backgroundShape: schema.backgroundShape.default,
    palette: schema.palette.default,
    expression: schema.expression.default,
    finish: schema.finish.default,
    companion: schema.companion.default,
    pose: schema.pose.default,
  });
  return {
    contour: art.number('contour', -1, 1),
    detailTilt: art.number('detail-tilt', -2.2, 2.2),
    faceShiftX: art.number('face-shift-x', -0.75, 0.75),
    faceShiftY: art.number('face-shift-y', -0.45, 0.45),
    eyeSkew: art.number('eye-skew', -0.38, 0.38),
    eyeScale: art.number('eye-scale', 0.94, 1.055),
    mouthScale: art.number('mouth-scale', 0.92, 1.08),
    widthScale: art.number('width-scale', 0.975, 1.025),
    heightScale: art.number('height-scale', 0.975, 1.025),
    restingTilt: art.number('resting-tilt', -0.8, 0.8),
  };
}

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Snacks ${param}: ${String(value)}`);
}

function assertSnacksParams(params: SnacksParams): void {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    throw new Error('Invalid Snacks parameters');
  }

  const values = params as Record<string, unknown>;
  for (const [key, definition] of Object.entries(schema)) {
    const value = values[key];
    if (typeof value !== 'string' || !(definition.options as readonly string[]).includes(value)) {
      invalidOption(key, value);
    }
  }
  for (const key of Object.keys(values)) {
    if (!(key in schema)) throw new Error(`Unknown Snacks parameter: ${key}`);
  }
}

function snackFace(
  snack: SnackName,
  x: number,
  eyeY: number,
  eyeGap: number,
  mouthY: number,
  art: SnackArt,
): FaceAnchor {
  const profiles: Record<
    SnackName,
    Pick<FaceAnchor, 'eyeRx' | 'eyeRy' | 'pupilRadius' | 'mouthWidth' | 'mouthDepth'>
  > = {
    toast: { eyeRx: 4.3, eyeRy: 4.8, pupilRadius: 1.9, mouthWidth: 13, mouthDepth: 4.5 },
    banana: { eyeRx: 3.45, eyeRy: 4.2, pupilRadius: 1.6, mouthWidth: 10.5, mouthDepth: 3.8 },
    coffee: { eyeRx: 3.5, eyeRy: 4.1, pupilRadius: 1.65, mouthWidth: 11, mouthDepth: 3.8 },
    pizza: { eyeRx: 3.7, eyeRy: 4.15, pupilRadius: 1.7, mouthWidth: 11.8, mouthDepth: 4 },
    berry: { eyeRx: 3.8, eyeRy: 4.5, pupilRadius: 1.75, mouthWidth: 11.5, mouthDepth: 4.4 },
    pretzel: { eyeRx: 3.4, eyeRy: 3.9, pupilRadius: 1.55, mouthWidth: 10.8, mouthDepth: 3.7 },
    avocado: { eyeRx: 3.7, eyeRy: 4.1, pupilRadius: 1.7, mouthWidth: 11.5, mouthDepth: 4 },
    fries: { eyeRx: 3.35, eyeRy: 4, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    cupcake: { eyeRx: 3.35, eyeRy: 4, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    sushi: { eyeRx: 3.55, eyeRy: 3.85, pupilRadius: 1.6, mouthWidth: 11, mouthDepth: 3.8 },
    dumpling: { eyeRx: 4.1, eyeRy: 3.8, pupilRadius: 1.8, mouthWidth: 12, mouthDepth: 4 },
    pineapple: { eyeRx: 3.45, eyeRy: 4.05, pupilRadius: 1.6, mouthWidth: 10.8, mouthDepth: 3.8 },
    boba: { eyeRx: 3.3, eyeRy: 3.8, pupilRadius: 1.5, mouthWidth: 10.2, mouthDepth: 3.6 },
    croissant: { eyeRx: 3.65, eyeRy: 4, pupilRadius: 1.65, mouthWidth: 11.5, mouthDepth: 3.9 },
    apple: { eyeRx: 3.85, eyeRy: 4.35, pupilRadius: 1.75, mouthWidth: 11.8, mouthDepth: 4.2 },
    noodles: { eyeRx: 3.4, eyeRy: 3.95, pupilRadius: 1.55, mouthWidth: 10.8, mouthDepth: 3.7 },
    taco: { eyeRx: 3.6, eyeRy: 3.9, pupilRadius: 1.65, mouthWidth: 11, mouthDepth: 3.8 },
    donut: { eyeRx: 3.55, eyeRy: 4.1, pupilRadius: 1.65, mouthWidth: 11.2, mouthDepth: 4 },
    corn: { eyeRx: 3.35, eyeRy: 4, pupilRadius: 1.55, mouthWidth: 10.3, mouthDepth: 3.7 },
    cake: { eyeRx: 3.45, eyeRy: 4, pupilRadius: 1.6, mouthWidth: 10.8, mouthDepth: 3.8 },
    citrus: { eyeRx: 4, eyeRy: 4.2, pupilRadius: 1.8, mouthWidth: 12, mouthDepth: 4.2 },
    burger: { eyeRx: 3.55, eyeRy: 3.85, pupilRadius: 1.65, mouthWidth: 11.2, mouthDepth: 3.8 },
    carrot: { eyeRx: 3.35, eyeRy: 4, pupilRadius: 1.55, mouthWidth: 10.2, mouthDepth: 3.6 },
    waffle: { eyeRx: 3.6, eyeRy: 4.05, pupilRadius: 1.65, mouthWidth: 11.5, mouthDepth: 3.9 },
    mushroom: { eyeRx: 3.9, eyeRy: 4.1, pupilRadius: 1.75, mouthWidth: 12, mouthDepth: 4.1 },
    watermelon: { eyeRx: 3.65, eyeRy: 4, pupilRadius: 1.65, mouthWidth: 11.5, mouthDepth: 3.9 },
    'soda-can': { eyeRx: 3.25, eyeRy: 3.85, pupilRadius: 1.5, mouthWidth: 10, mouthDepth: 3.6 },
    popcorn: { eyeRx: 3.3, eyeRy: 3.9, pupilRadius: 1.55, mouthWidth: 10.4, mouthDepth: 3.7 },
    egg: { eyeRx: 3.85, eyeRy: 4.25, pupilRadius: 1.75, mouthWidth: 11.8, mouthDepth: 4.1 },
    'ice-cream': { eyeRx: 3.35, eyeRy: 4, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    'pea-pod': { eyeRx: 3.4, eyeRy: 3.9, pupilRadius: 1.55, mouthWidth: 10.8, mouthDepth: 3.7 },
    sandwich: { eyeRx: 3.55, eyeRy: 3.95, pupilRadius: 1.6, mouthWidth: 11.2, mouthDepth: 3.8 },
    onion: { eyeRx: 3.75, eyeRy: 4.25, pupilRadius: 1.7, mouthWidth: 11.5, mouthDepth: 4 },
    pancakes: { eyeRx: 3.45, eyeRy: 3.9, pupilRadius: 1.6, mouthWidth: 10.8, mouthDepth: 3.7 },
    lollipop: { eyeRx: 3.25, eyeRy: 3.75, pupilRadius: 1.5, mouthWidth: 9.8, mouthDepth: 3.5 },
    cheese: { eyeRx: 3.55, eyeRy: 4, pupilRadius: 1.6, mouthWidth: 11, mouthDepth: 3.8 },
    celery: { eyeRx: 3.2, eyeRy: 3.85, pupilRadius: 1.5, mouthWidth: 9.8, mouthDepth: 3.5 },
    candy: { eyeRx: 3.3, eyeRy: 3.8, pupilRadius: 1.5, mouthWidth: 10.2, mouthDepth: 3.6 },
    'hot-dog': { eyeRx: 3.4, eyeRy: 3.85, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    jelly: { eyeRx: 3.75, eyeRy: 4.1, pupilRadius: 1.7, mouthWidth: 11.5, mouthDepth: 4 },
    'milk-carton': { eyeRx: 3.3, eyeRy: 3.9, pupilRadius: 1.5, mouthWidth: 10.2, mouthDepth: 3.6 },
    'bell-pepper': { eyeRx: 3.75, eyeRy: 4.2, pupilRadius: 1.7, mouthWidth: 11.5, mouthDepth: 4.1 },
    baguette: { eyeRx: 3.2, eyeRy: 3.85, pupilRadius: 1.5, mouthWidth: 9.8, mouthDepth: 3.5 },
    teapot: { eyeRx: 3.5, eyeRy: 4, pupilRadius: 1.6, mouthWidth: 11, mouthDepth: 3.8 },
    tofu: { eyeRx: 3.55, eyeRy: 4, pupilRadius: 1.6, mouthWidth: 11, mouthDepth: 3.8 },
    chocolate: { eyeRx: 3.35, eyeRy: 3.9, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    artichoke: { eyeRx: 3.45, eyeRy: 4, pupilRadius: 1.6, mouthWidth: 10.8, mouthDepth: 3.8 },
    'ice-pop': { eyeRx: 3.2, eyeRy: 3.85, pupilRadius: 1.5, mouthWidth: 9.8, mouthDepth: 3.5 },
    'honey-jar': { eyeRx: 3.4, eyeRy: 3.95, pupilRadius: 1.55, mouthWidth: 10.5, mouthDepth: 3.7 },
    cookie: { eyeRx: 3.7, eyeRy: 4.2, pupilRadius: 1.7, mouthWidth: 11.5, mouthDepth: 4 },
  };
  const profile = profiles[snack];
  return {
    x: x + art.faceShiftX,
    eyeY: eyeY + art.faceShiftY,
    eyeGap: eyeGap + art.contour * 0.35,
    eyeRx: profile.eyeRx * art.eyeScale,
    eyeRy: profile.eyeRy * art.eyeScale,
    pupilRadius: profile.pupilRadius * art.eyeScale,
    mouthY: mouthY + art.faceShiftY * 0.6,
    mouthWidth: profile.mouthWidth * art.mouthScale,
    mouthDepth: profile.mouthDepth * art.mouthScale,
  };
}

/** One rounded-rectangle subpath, used to pack inset cells into a single path. */
function roundedCell(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): string {
  return `M${x + radius} ${y}H${x + width - radius}Q${x + width} ${y} ${x + width} ${y + radius}V${y + height - radius}Q${x + width} ${y + height} ${x + width - radius} ${y + height}H${x + radius}Q${x} ${y + height} ${x} ${y + height - radius}V${y + radius}Q${x} ${y} ${x + radius} ${y}Z`;
}

/** The waffle's inset pocket grid: three columns by four rows of recessed cells. */
function wafflePocketGrid(): string {
  const cells: string[] = [];
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      cells.push(roundedCell(26.8 + col * 17.7, 27.2 + row * 14, 11, 8.5, 2.6));
    }
  }
  return cells.join('');
}

/** The chocolate bar's raised segment blocks: two columns by three rows. */
function chocolateSegmentGrid(): string {
  const cells: string[] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      cells.push(roundedCell(30 + col * 21.5, 19.5 + row * 14, 16.5, 11, 3));
    }
  }
  return cells.join('');
}

function renderSnack(
  snack: SnackName,
  palette: Palette,
  art: SnackArt,
): SnackLayout {
  const primaryOutline = `stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="1.45" stroke-linejoin="round"`;
  const secondaryOutline = `stroke="${tonalEdge(palette.secondary, palette.ink, 0.3)}" stroke-width="1.45" stroke-linejoin="round"`;
  const accentOutline = `stroke="${tonalEdge(palette.accent, palette.ink, 0.3)}" stroke-width="1.45" stroke-linejoin="round"`;
  const contour = art.contour;

  switch (snack) {
    case 'toast':
      return {
        body: `
          <path d="M22 80L${20 - contour * 0.8} 42C17 30 ${25 + contour} ${21 - contour * 0.7} ${38 + contour * 1.5} 21C44 21 48 24 ${50 + contour * 0.7} 29C52 24 56 21 ${62 - contour * 1.2} ${21 + contour * 0.6}C75 21 83 30 ${80 + contour * 0.6} 42L78 80Q${50 + contour * 1.4} ${87 + contour * 0.7} 22 80Z" fill="${palette.primary}"/>
          <path d="M29 73L${27 - contour * 0.6} 42C25 34 ${31 + contour * 0.7} 28 ${40 + contour} 28C45 28 48 31 ${50 + contour * 0.5} 36C52 31 55 28 ${60 - contour} 28C69 28 75 34 ${73 + contour * 0.5} 42L71 73Q${50 + contour} ${79 + contour * 0.5} 29 73Z" fill="${palette.secondary}"/>
        `,
        face: snackFace(snack, 50, 52, 17, 65, art),
        finish: { x: 50, y: 38, span: 14, rotation: -4 },
        companion: { x: 65, y: 21 },
      };

    case 'dumpling':
      return {
        body: `
          <path d="M15 68Q${21 - contour} 40 ${50 + contour * 2.2} ${29 - contour * 0.8}Q${79 + contour} 40 85 68Q${78 - contour * 1.4} ${82 + contour * 0.5} ${50 + contour * 0.8} ${84 + contour * 0.7}Q${22 + contour} 82 15 68Z" fill="${palette.secondary}"/>
          <path d="M22 61Q30 45 ${50 + contour * 2.2} ${37 - contour * 0.5}Q70 45 78 61M29 49L34 57M38 42L42 51M${50 + contour * 2.2} ${37 - contour * 0.5}L50 48M62 42L58 51M71 49L66 57" fill="none" stroke="${palette.primary}" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/>
        `,
        face: snackFace(snack, 50, 62, 18, 75, art),
        finish: { x: 50, y: 51, span: 13, rotation: 0 },
        companion: { x: 68, y: 27 },
      };

    case 'citrus':
      return {
        body: `
          <g transform="rotate(${art.detailTilt} 50 54)">
            <ellipse cx="50" cy="54" rx="${31.5 + contour * 0.9}" ry="${30.5 - contour * 0.7}" fill="${palette.primary}" ${primaryOutline}/>
            <ellipse cx="50" cy="54" rx="27.3" ry="26.3" fill="${palette.canvas}"/>
            <ellipse cx="50" cy="54" rx="23.8" ry="22.8" fill="${palette.secondary}"/>
            <path d="M54.2 55.7L70.3 62.4M51.7 58.2L58.4 74.3M48.3 58.2L41.6 74.3M45.8 55.7L29.7 62.4M45.8 52.3L29.7 45.6M48.3 49.8L41.6 33.7M51.7 49.8L58.4 33.7M54.2 52.3L70.3 45.6" fill="none" stroke="${palette.canvas}" stroke-width="2.3" stroke-linecap="round"/>
            <circle cx="50" cy="54" r="3.4" fill="${palette.canvas}"/>
          </g>
          <path d="M57 27Q62 13 76 15Q73 29 58 32Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M60 28L72 18" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.34)}" stroke-width="1.3" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 55, 18, 68, art),
        finish: { x: 50, y: 36, span: 13, rotation: 0 },
        companion: { x: 67, y: 24 },
      };

    case 'berry':
      return {
        body: `
          <g data-snack-silhouette="berry" stroke-width="1.25" stroke-linejoin="round">
            <circle data-snack-lobe="berry-lower-left" cx="${34 - contour * 0.25}" cy="68" r="17" fill="${palette.primary}" stroke="${tonalEdge(palette.primary, palette.ink, 0.28)}"/>
            <circle data-snack-lobe="berry-lower-right" cx="${66 + contour * 0.25}" cy="68" r="17" fill="${palette.primary}" stroke="${tonalEdge(palette.primary, palette.ink, 0.28)}"/>
            <circle data-snack-lobe="berry-upper-left" cx="${36 - contour * 0.35}" cy="48" r="18" fill="${palette.primary}" stroke="${tonalEdge(palette.primary, palette.ink, 0.28)}"/>
            <circle data-snack-lobe="berry-upper-right" cx="${64 + contour * 0.35}" cy="48" r="18" fill="${palette.primary}" stroke="${tonalEdge(palette.primary, palette.ink, 0.28)}"/>
            <circle data-snack-lobe="berry-center" cx="${50 + contour * 0.2}" cy="61" r="20" fill="${palette.primary}" stroke="${tonalEdge(palette.primary, palette.ink, 0.28)}"/>
          </g>
          <path data-snack-leaf="berry" d="M58 24Q68 10 81 17Q75 31 59 32Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-snack-calyx="berry" d="M39 31Q42 22 ${49 + contour * 0.3} 27Q51 17 ${57 + contour * 0.4} 25Q66 21 65 32Q57 30 ${51 + contour * 0.3} 36Q46 30 39 31Z" fill="${tonalEdge(palette.secondary, palette.ink, 0.28)}" ${secondaryOutline}/>
          <path data-snack-stem="berry" d="M51 28Q58 19 70 17M61 27L76 19" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.4)}" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        `,
        face: snackFace(snack, 50, 52, 16, 65, art),
        finish: { x: 50, y: 73, span: 15, rotation: 4 },
        companion: { x: 68, y: 24 },
      };

    case 'mushroom':
      return {
        body: `
          <path d="M${36 - contour * 0.8} 42Q${31 - contour} 67 ${37 - contour * 0.6} 82Q${50 + contour * 0.7} ${90 + contour * 0.5} ${63 + contour * 0.8} 82Q${69 + contour} 67 ${64 + contour * 0.8} 42Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M17 46Q${22 - contour * 1.2} 17 ${50 + contour * 2} ${15 - contour * 0.8}Q${78 + contour * 0.8} 17 83 46Q${50 + contour * 0.7} ${50 + contour * 0.4} 17 46Z" fill="${palette.primary}" ${primaryOutline}/>
        `,
        face: snackFace(snack, 50, 59, 17, 72, art),
        finish: { x: 50, y: 32, span: 20, rotation: -2 },
        companion: { x: 69, y: 23 },
      };

    case 'coffee':
      return {
        body: `
          <path d="M${71 + contour * 0.7} 41H${79 + contour}Q${88 + contour} 42 ${87 + contour * 1.2} 53Q${86 + contour} 64 ${72 + contour * 0.5} 64" fill="none" stroke="${palette.primary}" stroke-width="10" stroke-linecap="round"/>
          <path d="M${25 - contour * 0.6} 29H${74 + contour * 0.8}L${69 + contour * 0.5} 77Q${50 + contour * 0.8} ${86 + contour * 0.5} ${31 - contour * 0.5} 77Z" fill="${palette.primary}"/>
          <ellipse cx="${49.5 + contour * 0.2}" cy="29" rx="${24.5 + contour * 0.7}" ry="${8 - contour * 0.25}" fill="${palette.secondary}" ${secondaryOutline} transform="rotate(${art.detailTilt * 0.45} 49.5 29)"/>
          <path d="M23 82Q${50 + contour} ${89 + contour * 0.4} 77 82" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="1.65" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 49, 53, 18, 66, art),
        finish: { x: 50, y: 30, span: 16, rotation: -4 },
        companion: { x: 49, y: 13 },
      };

    case 'sushi':
      return {
        body: `
          <path d="M27 40Q29 34 ${36 + contour} 34Q40 28 ${47 + contour * 0.8} 33Q53 28 ${60 + contour * 0.6} 34Q69 33 73 40L${76 + contour * 0.7} 70Q74 83 ${50 + contour * 0.7} ${85 + contour * 0.4}Q26 83 ${24 - contour * 0.5} 70Z" fill="${palette.secondary}"/>
          <path d="M18 36Q19 27 ${29 - contour} 23Q${49 + contour * 1.5} ${17 - contour * 0.6} ${71 + contour} 23Q81 26 82 35L76 47Q${51 + contour} 41 24 47Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M30 25Q35 31 39 44M${48 + contour} 21Q52 30 55 43M65 23Q68 31 70 45" fill="none" stroke="${palette.primary}" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M29 55Q33 51 36 54M64 54Q67 51 71 55" fill="none" stroke="${palette.primary}" stroke-width="2.5" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 59, 18, 72, art),
        finish: { x: 50, y: 33, span: 18, rotation: -4 },
        companion: { x: 70, y: 24 },
      };

    case 'avocado':
      return {
        body: `
          <path d="M${50 + contour} 13C${62 + contour * 1.2} 22 ${76 + contour} 45 76 62C76 79 ${65 + contour * 0.6} 87 ${50 + contour * 0.5} 87C35 87 ${24 - contour} 79 24 62C24 45 ${38 - contour * 0.7} 22 ${50 + contour} 13Z" fill="${palette.primary}"/>
          <path d="M${50 + contour * 0.8} 22C59 31 ${69 + contour * 0.6} 48 69 62C69 74 ${61 + contour * 0.5} 80 50 80C39 80 ${31 - contour * 0.5} 74 31 62C31 48 ${41 - contour * 0.4} 31 ${50 + contour * 0.8} 22Z" fill="${palette.secondary}"/>
          <ellipse cx="${50 + contour * 0.5}" cy="68" rx="${12 + contour * 0.35}" ry="${12 - contour * 0.25}" fill="${palette.accent}" ${accentOutline}/>
        `,
        face: snackFace(snack, 50, 46, 17, 58, art),
        finish: { x: 50, y: 32, span: 12, rotation: 0 },
        companion: { x: 66, y: 24 },
      };

    case 'taco':
      return {
        body: `
          <path d="M14 73Q${18 - contour} 35 ${50 + contour * 2.5} ${24 - contour * 0.7}Q${82 + contour} 35 86 73Q${50 + contour} ${77 + contour * 0.5} 14 73Z" fill="${palette.accent}"/>
          <path d="M20 45Q27 37 ${36 - contour} 43Q43 32 ${51 + contour * 1.5} 41Q60 31 ${68 + contour} 43Q77 36 81 47" fill="none" stroke="${palette.secondary}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 48Q29 43 ${36 - contour * 0.7} 48Q44 39 ${51 + contour} 47Q59 38 ${68 + contour * 0.7} 48Q76 43 81 49" fill="none" stroke="${palette.primary}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        `,
        face: snackFace(snack, 50, 54, 18, 66, art),
        finish: { x: 50, y: 34, span: 12, rotation: -3 },
        companion: { x: 71, y: 29 },
      };

    case 'cupcake':
      return {
        body: `
          <path d="M${25 - contour * 0.5} 47H${75 + contour * 0.5}L${67 + contour * 0.7} 83Q${50 + contour * 0.7} ${88 + contour * 0.4} ${33 - contour * 0.6} 83Z" fill="${palette.primary}"/>
          <path d="M24 50C21 44 27 38 ${35 - contour} 37C32 31 38 27 ${45 + contour} 29C42 24 ${47 + contour * 0.8} 19 ${53 + contour * 1.5} ${20 - contour * 0.8}C60 21 62 27 58 32C66 30 ${72 + contour} 35 70 41C77 40 81 46 75 50Q69 55 63 50Q56 56 ${50 + contour * 0.6} 50Q44 56 37 50Q31 55 24 50Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M35 38Q${50 + contour} 43 65 37M${45 + contour} 29Q52 33 ${59 + contour * 0.6} 31" fill="none" stroke="${palette.accent}" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M35 53L39 80M50 53V84M65 53L61 80" fill="none" stroke="${palette.accent}" stroke-width="2.8" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 62, 18, 75, art),
        finish: { x: 50, y: 38, span: 15, rotation: -3 },
        companion: { x: 59, y: 18 },
      };

    case 'banana':
      return {
        body: `
          <path d="M28 20Q${37 + contour} 24 ${45 + contour * 0.6} 20Q42 40 53 52Q64 64 78 60Q73 79 57 83Q38 86 25 70Q15 58 19 43Q22 31 28 20Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M31 29Q30 49 43 63Q55 76 69 69Q62 78 51 77Q35 75 27 61Q20 47 31 29Z" fill="${palette.secondary}"/>
          <path d="M27 21Q29 15 34 18L35 23M75 61Q82 61 81 67Q78 71 73 68" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.36)}" stroke-width="2" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 48, 49, 15, 61, art),
        finish: { x: 44, y: 35, span: 10, rotation: 35 },
        companion: { x: 64, y: 19 },
      };

    case 'pizza':
      return {
        body: `
          <path d="M50 16L84 75Q68 84 ${50 + contour} 84Q32 84 16 75Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M17 72Q50 82 83 72L87 79Q68 91 50 90Q30 90 13 79Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M42 35Q46 29 52 34Q55 40 49 44Q42 43 42 35ZM62 48Q68 44 72 50Q73 57 66 59Q60 56 62 48ZM32 57Q37 52 42 57Q44 63 38 66Q31 64 32 57Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        face: snackFace(snack, 50, 58, 18, 71, art),
        finish: { x: 50, y: 41, span: 12, rotation: 0 },
        companion: { x: 68, y: 20 },
      };

    case 'pretzel':
      return {
        body: `
          <path data-snack-silhouette="pretzel" d="M31 30C18 27 13 40 19 52C25 65 38 66 48 51L56 39C61 31 67 26 74 31C84 38 85 49 78 58C71 66 58 72 50 79C42 72 29 66 22 58C15 49 16 38 26 31C33 26 39 31 44 39L52 51C62 66 75 65 81 52C87 40 82 27 69 30" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M31 30C18 27 13 40 19 52C25 65 38 66 48 51L56 39C61 31 67 26 74 31C84 38 85 49 78 58C71 66 58 72 50 79C42 72 29 66 22 58C15 49 16 38 26 31C33 26 39 31 44 39L52 51C62 66 75 65 81 52C87 40 82 27 69 30" fill="none" stroke="${palette.primary}" stroke-width="11.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path data-snack-negative-space="pretzel-left" d="M27 38C22 42 23 49 28 52C33 55 37 52 41 46L37 40Q32 35 27 38Z" fill="${palette.canvas}"/>
          <path data-snack-negative-space="pretzel-right" d="M73 38C78 42 77 49 72 52C67 55 63 52 59 46L63 40Q68 35 73 38Z" fill="${palette.canvas}"/>
          <path data-snack-bottom-band="pretzel" d="M27 67Q50 87 73 67" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="12" stroke-linecap="round"/>
          <path d="M27 67Q50 87 73 67" fill="none" stroke="${palette.primary}" stroke-width="8" stroke-linecap="round"/>
          <path data-snack-knot-crossing="pretzel" d="M38 48Q49 61 69 76M62 48Q51 61 31 76" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M38 48Q49 61 69 76M62 48Q51 61 31 76" fill="none" stroke="${palette.primary}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
          <g data-snack-salt="pretzel" fill="${palette.canvas}" stroke="${tonalEdge(palette.canvas, palette.ink, 0.26)}" stroke-width="0.8">
            <ellipse cx="25" cy="57" rx="1.8" ry="2.5" transform="rotate(-34 25 57)"/>
            <ellipse cx="35" cy="30" rx="1.7" ry="2.4" transform="rotate(-27 35 30)"/>
            <ellipse cx="65" cy="30" rx="1.7" ry="2.4" transform="rotate(27 65 30)"/>
            <ellipse cx="75" cy="57" rx="1.8" ry="2.5" transform="rotate(34 75 57)"/>
          </g>
        `,
        face: snackFace(snack, 50, 60, 12, 70, art),
        finish: { x: 50, y: 28, span: 16, rotation: 0 },
        companion: { x: 68, y: 19 },
      };

    case 'fries':
      return {
        body: `
          <g ${secondaryOutline} fill="${palette.secondary}">
            <path d="M27 50L24 18Q29 14 34 18L37 51Z"/><path d="M38 50L39 12Q44 9 49 13L49 51Z"/><path d="M50 51L53 16Q58 12 62 17L61 52Z"/><path d="M62 51L69 20Q75 18 77 24L72 55Z"/>
          </g>
          <path d="M22 43Q50 51 78 43L72 83Q50 89 28 83Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M27 51Q50 57 73 51L71 61Q50 66 29 61Z" fill="${palette.accent}"/>
        `,
        face: snackFace(snack, 50, 63, 17, 76, art),
        finish: { x: 50, y: 35, span: 13, rotation: 2 },
        companion: { x: 75, y: 20 },
      };

    case 'pineapple':
      return {
        body: `
          <path d="M50 29C68 27 77 39 76 60C75 80 64 88 50 88C36 88 25 80 24 60C23 39 32 27 50 29Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M50 31Q43 20 35 14Q47 14 51 22Q55 11 63 8Q62 20 56 29Q67 18 74 20Q67 29 57 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M32 43L68 73M31 58L60 83M68 43L32 73M69 58L40 83" fill="none" stroke="${palette.accent}" stroke-width="1.8" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 55, 17, 69, art),
        finish: { x: 50, y: 41, span: 13, rotation: 0 },
        companion: { x: 69, y: 19 },
      };

    case 'boba':
      return {
        body: `
          <path d="M29 28H73L68 82Q50 88 32 82Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M26 25Q51 19 76 25L73 34Q51 39 29 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M61 26L69 8" fill="none" stroke="${tonalEdge(palette.accent, palette.ink, 0.3)}" stroke-width="5" stroke-linecap="round"/>
          <g fill="${palette.accent}" ${accentOutline}><circle cx="39" cy="75" r="4"/><circle cx="50" cy="78" r="4.2"/><circle cx="61" cy="74" r="3.8"/></g>
        `,
        face: snackFace(snack, 50, 52, 16, 65, art),
        finish: { x: 49, y: 41, span: 12, rotation: -2 },
        companion: { x: 76, y: 21 },
      };

    case 'croissant':
      return {
        body: `
          <g data-snack-roll="croissant" transform="rotate(-7 50 49)">
            <path data-snack-silhouette="croissant" d="M9 70C1 50 ${9 - contour * 0.6} 30 ${30 - contour * 0.8} 23C41 ${17.5 - contour * 0.5} 59 ${17.5 - contour * 0.5} ${70 + contour * 0.8} 23C${91 + contour * 0.6} 30 99 50 91 70C93 61 86 53 ${75 + contour * 0.4} 50.5C65 ${50 - contour * 0.4} 35 ${50 - contour * 0.4} ${25 - contour * 0.4} 50.5C14 53 7 61 9 70Z" fill="${palette.primary}" ${primaryOutline}/>
            <path data-snack-lamination="croissant-center" d="M33 21.5C43 18.5 57 18.5 67 21.5Q64 36 62 48.5Q50 47.5 38 48.5Q36 36 33 21.5Z" fill="${palette.secondary}" opacity="0.3" stroke="${tonalEdge(palette.primary, palette.ink, 0.22)}" stroke-width="1.05"/>
            <path data-snack-lamination="croissant-left" d="M28 22.5Q31 36 34 49.5Q32 51.1 29.5 50.1Q26.5 36.5 24 24.5Q26 22.7 28 22.5Z" fill="${tonalEdge(palette.primary, palette.ink, 0.3)}"/>
            <path data-snack-lamination="croissant-right" d="M72 22.5Q69 36 66 49.5Q68 51.1 70.5 50.1Q73.5 36.5 76 24.5Q74 22.7 72 22.5Z" fill="${tonalEdge(palette.primary, palette.ink, 0.3)}"/>
            <path data-snack-horn="croissant-left" d="M5.5 52Q8 56.5 12.5 55" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.6" stroke-linecap="round"/>
            <path data-snack-horn="croissant-right" d="M94.5 52Q92 56.5 87.5 55" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.6" stroke-linecap="round"/>
            <path data-snack-inner-curve="croissant" d="M13 64Q18 55 25 52.5M87 64Q82 55 75 52.5" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        `,
        face: snackFace(snack, 50, 33, 14, 45, art),
        finish: { x: 50, y: 22, span: 13, rotation: -4 },
        companion: { x: 74, y: 17 },
      };

    case 'apple':
      return {
        body: `
          <path d="M49 28C39 20 23 28 21 46C18 68 32 85 49 87C66 85 82 68 79 46C77 28 61 20 51 28Q50 30 49 28Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M50 30Q45 19 50 10" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.34)}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M51 19Q62 10 72 17Q65 28 52 26Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M31 40Q36 31 44 34" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 51, 18, 65, art),
        finish: { x: 50, y: 36, span: 13, rotation: 0 },
        companion: { x: 70, y: 20 },
      };

    case 'noodles':
      return {
        body: `
          <path d="M23 43Q50 35 77 43L72 79Q50 88 28 79Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M20 42Q50 52 80 42" fill="none" stroke="${palette.secondary}" stroke-width="7" stroke-linecap="round"/>
          <path d="M31 41C27 31 38 30 34 20M44 43C40 32 51 29 47 18M58 42C54 31 65 29 61 17M68 42C65 34 73 31 71 24" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round"/>
          <path d="M65 35L80 12M70 39L87 17" fill="none" stroke="${tonalEdge(palette.accent, palette.ink, 0.32)}" stroke-width="2.2" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 58, 17, 71, art),
        finish: { x: 49, y: 35, span: 13, rotation: 0 },
        companion: { x: 74, y: 20 },
      };

    case 'donut':
      return {
        body: `
          <path d="M50 17C70 17 84 31 84 51C84 72 70 86 50 86C30 86 16 72 16 51C16 31 30 17 50 17Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M20 45Q${27 - contour} 20 50 20Q${73 + contour} 20 80 45Q77 52 70 47Q63 40 57 38.5Q50 36 43 38.5Q37 40 30 47Q24 52 20 45Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M31 29L35 32M45 24L49 28M63 26L60 31M72 36L68 38" fill="none" stroke="${palette.accent}" stroke-width="2.6" stroke-linecap="round"/>
          <path d="M38 34L42 37M55 30L59 33M26 40L30 42" fill="none" stroke="${palette.canvas}" stroke-width="2.4" stroke-linecap="round"/>
          <ellipse cx="50" cy="47" rx="13.5" ry="13" fill="${tonalEdge(palette.primary, palette.ink, 0.38)}"/>
          <ellipse cx="50" cy="49" rx="8.6" ry="8.2" fill="${tonalEdge(palette.primary, palette.ink, 0.58)}"/>
          <path d="M41.5 42.5Q50 37.5 58.5 42.5" fill="none" stroke="${tonalEdge(palette.primary, palette.canvas, 0.5)}" stroke-width="1.7" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 66.5, 16, 77.5, art),
        finish: { x: 50, y: 27, span: 14, rotation: 0 },
        companion: { x: 72, y: 20 },
      };

    case 'corn':
      return {
        body: `
          <path d="M50 18Q66 20 68 47Q70 73 50 87Q30 73 32 47Q34 20 50 18Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M33 42Q20 50 27 78Q39 75 48 63Q38 56 33 42ZM67 42Q80 50 73 78Q61 75 52 63Q62 56 67 42Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M40 30H60M37 41H63M36 52H64M39 63H61M44 24V70M55 24V70" fill="none" stroke="${palette.accent}" stroke-width="1.7" stroke-linecap="round" opacity="0.8"/>
        `,
        face: snackFace(snack, 50, 47, 15, 59, art),
        finish: { x: 50, y: 28, span: 10, rotation: 0 },
        companion: { x: 67, y: 18 },
      };

    case 'cake':
      return {
        body: `
          <path d="M22 37L77 29L79 81Q51 89 23 81Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M22 37Q48 44 77 29L73 43Q48 56 23 49Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M24 61Q49 70 78 55L78 66Q50 80 24 72Z" fill="${palette.accent}"/>
          <path d="M57 32Q58 18 64 14Q70 19 66 30" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.34)}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 49, 54, 17, 67, art),
        finish: { x: 47, y: 36, span: 13, rotation: -7 },
        companion: { x: 72, y: 17 },
      };

    case 'burger':
      return {
        body: `
          <path d="M18 47Q22 20 50 19Q78 20 82 47Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M17 48Q50 39 83 48L78 58Q50 65 22 58Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M20 59Q28 52 36 60Q44 52 51 60Q59 51 67 60Q75 53 81 60L76 69H24Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M21 68H79Q77 84 50 85Q23 84 21 68Z" fill="${palette.primary}" ${primaryOutline}/>
        `,
        face: snackFace(snack, 50, 51, 17, 76, art),
        finish: { x: 50, y: 32, span: 14, rotation: 0 },
        companion: { x: 73, y: 20 },
      };

    case 'carrot':
      return {
        body: `
          <path d="M34 29Q50 20 66 29Q65 53 50 88Q35 53 34 29Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M47 29Q36 18 38 8Q49 14 51 25Q52 10 63 7Q65 19 55 29Q65 18 72 23Q67 32 56 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M40 44L49 47M39 57L47 60M55 39L63 42M50 70L57 72" fill="none" stroke="${palette.accent}" stroke-width="2.1" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 45, 15, 57, art),
        finish: { x: 50, y: 35, span: 10, rotation: 0 },
        companion: { x: 69, y: 19 },
      };

    case 'waffle':
      return {
        body: `
          <g transform="rotate(${art.detailTilt * 0.5} 50 52)">
            <rect x="20" y="21" width="60" height="63" rx="14" fill="${tonalEdge(palette.primary, palette.ink, 0.26)}" ${primaryOutline}/>
            <rect x="23.5" y="24.5" width="53" height="56" rx="11" fill="${palette.primary}"/>
            <path d="${wafflePocketGrid()}" fill="${tonalEdge(palette.primary, palette.ink, 0.19)}"/>
            <path d="M44 39.5Q42.5 44 44.5 47.5M50 40V47M56 39Q58 43.5 56 47" fill="none" stroke="${palette.accent}" stroke-width="3.1" stroke-linecap="round" opacity="0.88"/>
            <rect x="41.5" y="27.5" width="17" height="11" rx="3.5" fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.3)}" stroke-width="1.45" stroke-linejoin="round" transform="rotate(${-7 + art.detailTilt} 50 33)"/>
            <path d="M46 32.5L54 31.5" fill="none" stroke="${palette.accent}" stroke-width="1.7" stroke-linecap="round" transform="rotate(${-7 + art.detailTilt} 50 33)"/>
          </g>
        `,
        face: snackFace(snack, 50, 52, 18, 66, art),
        finish: { x: 50, y: 41, span: 13, rotation: 0 },
        companion: { x: 72, y: 20 },
      };

    case 'watermelon':
      return {
        body: `
          <path d="M14 42H86Q82 79 50 87Q18 79 14 42Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M21 44H79Q75 72 50 79Q25 72 21 44Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M31 50Q35 45 38 51Q36 57 31 50ZM62 51Q66 45 69 52Q66 57 62 51ZM47 67Q50 61 53 67Q50 72 47 67Z" fill="${palette.ink}"/>
        `,
        face: snackFace(snack, 50, 55, 17, 68, art),
        finish: { x: 50, y: 47, span: 13, rotation: 0 },
        companion: { x: 72, y: 27 },
      };

    case 'soda-can':
      return {
        body: `
          <path d="M31 22Q50 17 69 22L67 82Q50 88 33 82Z" fill="${palette.primary}" ${primaryOutline}/>
          <ellipse cx="50" cy="22" rx="19" ry="6" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M42 21Q49 16 57 21Q53 27 45 25Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M32 67Q50 73 68 67" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 47, 15, 59, art),
        finish: { x: 50, y: 34, span: 10, rotation: 0 },
        companion: { x: 69, y: 18 },
      };

    case 'popcorn':
      return {
        body: `
          <path d="M25 39H75L69 84Q50 89 31 84Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M34 42L38 82M49 41V86M65 41L61 82" fill="none" stroke="${palette.accent}" stroke-width="5"/>
          <path d="M23 39Q15 30 23 24Q30 18 36 25Q38 14 48 17Q55 10 61 19Q72 15 74 26Q84 25 84 35Q82 43 73 43Q65 48 58 42Q50 48 43 42Q34 48 28 42Q25 42 23 39Z" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        face: snackFace(snack, 50, 58, 16, 71, art),
        finish: { x: 50, y: 29, span: 14, rotation: 0 },
        companion: { x: 75, y: 20 },
      };

    case 'egg':
      return {
        body: `
          <path d="M17 52Q12 34 29 28Q34 13 50 22Q65 13 71 29Q88 33 83 51Q91 66 75 74Q69 90 51 82Q35 91 27 76Q9 69 17 52Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <ellipse cx="49" cy="47" rx="18" ry="16" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M37 40Q46 29 58 35" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 48, 15, 60, art),
        finish: { x: 50, y: 34, span: 11, rotation: 0 },
        companion: { x: 72, y: 22 },
      };

    case 'ice-cream':
      return {
        body: `
          <path d="M30 47L70 47L55 88Q50 92 45 88Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M36 55L61 80M63 55L40 79" fill="none" stroke="${palette.accent}" stroke-width="2" stroke-linecap="round"/>
          <path d="M25 43Q20 34 29 29Q27 18 39 18Q45 9 53 17Q63 10 69 21Q82 22 77 34Q84 43 72 49Q62 54 54 48Q45 55 37 48Q29 52 25 43Z" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        face: snackFace(snack, 50, 33, 16, 45, art),
        finish: { x: 50, y: 22, span: 13, rotation: 0 },
        companion: { x: 70, y: 17 },
      };

    case 'pea-pod':
      return {
        body: `
          <path d="M13 58Q28 22 73 25Q83 26 88 19Q89 52 65 72Q40 91 13 58Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M25 57Q39 36 70 34Q57 65 25 68Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <g fill="${palette.accent}" ${accentOutline}><circle cx="38" cy="55" r="7"/><circle cx="53" cy="49" r="7.3"/><circle cx="68" cy="42" r="6.6"/></g>
        `,
        face: snackFace(snack, 49, 54, 15, 66, art),
        finish: { x: 50, y: 39, span: 12, rotation: -18 },
        companion: { x: 72, y: 20 },
      };

    case 'sandwich':
      return {
        body: `
          <path d="M14 72L49 20L86 72Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M18 66L49 29L81 66L74 75H24Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M23 62Q32 55 40 62Q49 54 57 62Q67 54 77 62L72 69H28Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M18 73Q50 82 82 73L78 81Q50 90 22 81Z" fill="${palette.primary}"/>
        `,
        face: snackFace(snack, 50, 57, 17, 70, art),
        finish: { x: 50, y: 38, span: 12, rotation: 0 },
        companion: { x: 69, y: 21 },
      };

    case 'onion':
      return {
        body: `
          <path d="M50 20Q55 31 66 37Q80 45 76 62Q72 82 50 88Q28 82 24 62Q20 45 34 37Q45 31 50 20Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M45 26Q37 16 40 8Q48 14 50 22Q52 12 60 7Q64 17 55 28Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M38 41Q29 60 41 78M50 36V82M62 41Q71 60 59 78" fill="none" stroke="${palette.accent}" stroke-width="1.8" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 51, 17, 65, art),
        finish: { x: 50, y: 36, span: 12, rotation: 0 },
        companion: { x: 68, y: 18 },
      };

    case 'pancakes':
      return {
        body: `
          <path d="M19 64Q50 55 81 64V78Q50 90 19 78Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M19 52Q50 43 81 52V65Q50 76 19 65Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M20 40Q50 29 80 40V53Q50 64 20 53Z" fill="${palette.primary}" ${primaryOutline}/>
          <ellipse cx="50" cy="40" rx="30" ry="10" fill="${palette.secondary}" ${secondaryOutline}/>
          <rect x="43" y="31" width="15" height="10" rx="3" fill="${palette.accent}" ${accentOutline} transform="rotate(-7 50 36)"/>
        `,
        face: snackFace(snack, 50, 57, 17, 70, art),
        finish: { x: 50, y: 38, span: 12, rotation: 0 },
        companion: { x: 72, y: 21 },
      };

    case 'lollipop':
      return {
        body: `
          <path d="M50 49L49 88" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.34)}" stroke-width="7" stroke-linecap="round"/>
          <circle cx="50" cy="34" r="25" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M50 17Q66 18 67 32Q68 45 54 47Q41 49 34 39Q28 29 37 22Q46 15 55 22Q63 29 57 36Q52 42 45 38" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 31, 15, 43, art),
        finish: { x: 50, y: 19, span: 11, rotation: 0 },
        companion: { x: 72, y: 17 },
      };

    case 'cheese':
      return {
        body: `
          <path d="M16 73L44 25L84 39L79 82Q47 89 16 73Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M44 25L84 39L67 50L27 46Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <g fill="${palette.accent}" ${accentOutline}><circle cx="34" cy="62" r="5"/><circle cx="62" cy="67" r="4"/><circle cx="69" cy="48" r="3.5"/></g>
        `,
        face: snackFace(snack, 52, 57, 16, 70, art),
        finish: { x: 50, y: 39, span: 12, rotation: 8 },
        companion: { x: 71, y: 21 },
      };

    case 'celery':
      return {
        body: `
          <path d="M31 31Q38 27 43 32L47 84Q39 89 32 84ZM45 26Q51 21 56 27L58 85Q51 90 45 85ZM57 32Q64 27 70 33L67 84Q61 89 56 84Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M38 35Q24 27 27 14Q40 16 45 29Q42 15 51 8Q59 17 54 30Q62 15 75 17Q76 31 65 38Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M39 40L42 75M52 35L52 78M64 40L62 75" fill="none" stroke="${palette.accent}" stroke-width="1.8" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 51, 53, 14, 65, art),
        finish: { x: 51, y: 38, span: 10, rotation: 0 },
        companion: { x: 70, y: 17 },
      };

    case 'candy':
      return {
        body: `
          <path d="M28 39L13 27L16 46L10 59L29 61Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M72 39L87 27L84 46L90 59L71 61Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M28 35Q50 25 72 35L73 66Q50 77 27 66Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M36 35Q50 47 64 34M35 67Q50 55 65 66" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 48, 16, 60, art),
        finish: { x: 50, y: 36, span: 12, rotation: 0 },
        companion: { x: 75, y: 22 },
      };

    case 'hot-dog':
      return {
        body: `
          <path d="M12 56Q13 36 31 32L70 38Q87 43 87 62Q86 79 70 82L29 75Q12 72 12 56Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M20 52Q22 40 35 41L69 46Q79 48 79 60Q78 70 67 72L32 67Q20 65 20 52Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M29 49Q35 43 41 51T53 53T66 55" fill="none" stroke="${palette.secondary}" stroke-width="3.2" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 55, 16, 66, art),
        finish: { x: 49, y: 43, span: 12, rotation: 8 },
        companion: { x: 73, y: 27 },
      };

    case 'jelly':
      return {
        body: `
          <path d="M20 69Q21 31 50 27Q79 31 80 69L72 82L62 76L51 84L40 76L29 82Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M29 44Q35 32 46 35" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
          <path d="M24 67Q50 58 76 67" fill="none" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round" opacity="0.8"/>
        `,
        face: snackFace(snack, 50, 53, 18, 66, art),
        finish: { x: 50, y: 39, span: 13, rotation: 0 },
        companion: { x: 70, y: 22 },
      };

    case 'milk-carton':
      return {
        body: `
          <path d="M29 29L42 12H65L73 29V84Q51 89 29 84Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M29 29L42 12L52 29Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M42 12H65L73 29H52Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M36 42H66V58H36Z" fill="${palette.secondary}" opacity="0.75"/>
        `,
        face: snackFace(snack, 51, 51, 16, 64, art),
        finish: { x: 51, y: 37, span: 11, rotation: 0 },
        companion: { x: 69, y: 17 },
      };

    case 'bell-pepper':
      return {
        body: `
          <path data-snack-silhouette="bell-pepper" d="M50 31C58 ${24 - contour * 0.4} 68 25 73 32C85 38 ${86 + contour * 0.5} 52 82 64C80 74 74 80 65 81C63 86 57 85.5 55 79.5C53 85 47 85 45 79.5C43 85.5 37 86 35 81C26 80 20 74 18 64C${14 - contour * 0.5} 52 15 38 27 32C32 25 42 ${24 - contour * 0.4} 50 31Z" fill="${palette.primary}" ${primaryOutline}/>
          <path data-snack-stem="bell-pepper" d="M48.5 31.5Q45.5 19 54 13.5Q61 12.5 59.5 19.5Q58 25.5 56 31.5Z" fill="${tonalEdge(palette.secondary, palette.ink, 0.36)}" ${secondaryOutline}/>
          <path data-snack-calyx="bell-pepper" d="M36 35Q50 26 64 35Q58 41 50 38.5Q42 41 36 35Z" fill="${tonalEdge(palette.secondary, palette.ink, 0.36)}" ${secondaryOutline}/>
          <path data-snack-lobe="bell-pepper-left" d="M39 36Q32 52 38 74" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.25)}" stroke-width="1.65" stroke-linecap="round"/>
          <path data-snack-lobe="bell-pepper-right" d="M61 36Q68 52 62 74" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.25)}" stroke-width="1.65" stroke-linecap="round"/>
          <path data-snack-lobe="bell-pepper-center" d="M50 34Q47.5 38 48 43M48 81Q50 83 52 81" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.25)}" stroke-width="1.45" stroke-linecap="round"/>
          <path d="M27 45Q30 37 38 34" fill="none" stroke="${tonalEdge(palette.primary, palette.canvas, 0.55)}" stroke-width="2.8" stroke-linecap="round" opacity="0.85"/>
        `,
        face: snackFace(snack, 50, 51, 17, 65, art),
        finish: { x: 50, y: 37, span: 12, rotation: 0 },
        companion: { x: 68, y: 19 },
      };

    case 'baguette': {
      const score = (y: number): string => `
          <path d="M43 ${y + 3.6}Q50.5 ${y + 1.6} 58 ${y - 2.4}" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.4)}" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M43 ${y + 2.4}Q50.5 ${y - 3.2} 58 ${y - 2.8}Q50.5 ${y + 0.8} 43 ${y + 2.4}Z" fill="${palette.secondary}"/>`;
      return {
        body: `
          <g transform="rotate(23 50 50)">
            <path d="M50 9C57 9 60 14 59.5 24C60.5 43 60.5 62 58 80C57 87.5 54 90.5 50 90.5C46 90.5 43 87.5 42 80C39.5 62 39.5 43 40.5 24C40 14 43 9 50 9Z" fill="${palette.primary}" ${primaryOutline}/>
            <path d="M43.5 28C42.5 46 42.5 62 45 80" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.2)}" stroke-width="2.1" stroke-linecap="round"/>
            <path d="M55.5 22C57 42 57 58 55 76" fill="none" stroke="${tonalEdge(palette.primary, palette.canvas, 0.42)}" stroke-width="2.3" stroke-linecap="round" opacity="0.8"/>
            ${score(26)}${score(41)}${score(56)}${score(71)}
          </g>
        `,
        face: snackFace(snack, 48.5, 50, 13.5, 62, art),
        finish: { x: 52, y: 33, span: 9, rotation: -26 },
        companion: { x: 74, y: 18 },
      };
    }

    case 'teapot':
      return {
        body: `
          <path d="M28 39Q50 29 72 39L76 68Q70 84 50 85Q30 84 24 68Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M72 44Q89 42 91 55Q91 69 76 70" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="9" stroke-linecap="round"/>
          <path d="M25 45Q12 43 8 31Q25 31 36 43Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M37 35Q50 26 63 35M43 27Q50 20 57 27" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 53, 17, 66, art),
        finish: { x: 50, y: 41, span: 12, rotation: 0 },
        companion: { x: 70, y: 21 },
      };

    case 'tofu':
      return {
        body: `
          <path data-snack-side="tofu" d="M${66 + contour * 0.5} ${38 - contour * 0.3}L76 29V71L${66 + contour * 0.5} ${80 + contour * 0.3}Z" fill="${tonalEdge(palette.primary, palette.ink, 0.14)}" stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="1.2" stroke-linejoin="round"/>
          <path data-snack-top="tofu" d="M${24 - contour * 0.5} ${38 - contour * 0.3}L34 29H76L${66 + contour * 0.5} ${38 - contour * 0.3}Z" fill="${tonalEdge(palette.primary, palette.canvas, 0.42)}" ${secondaryOutline}/>
          <path d="M34 29.4H75.4L${70.5 + contour * 0.3} 32.8H39.5Z" fill="${tonalEdge(palette.primary, palette.canvas, 0.26)}"/>
          <path data-snack-silhouette="tofu" d="M${28 - contour * 0.5} ${38 - contour * 0.3}H${62 + contour * 0.5}Q${66 + contour * 0.5} ${38 - contour * 0.3} ${66 + contour * 0.5} ${42 - contour * 0.3}V${76 + contour * 0.2}Q${66 + contour * 0.5} ${80 + contour * 0.3} ${62 + contour * 0.4} ${80.4 + contour * 0.35}Q${45 + contour * 0.5} ${84 + contour * 0.4} ${28 - contour * 0.4} ${80.2 + contour * 0.3}Q${24 - contour * 0.5} ${79.6 + contour * 0.3} ${24 - contour * 0.5} ${76 + contour * 0.2}V${42 - contour * 0.3}Q${24 - contour * 0.5} ${38 - contour * 0.3} ${28 - contour * 0.5} ${38 - contour * 0.3}Z" fill="${palette.primary}" ${primaryOutline}/>
          <path data-snack-press="tofu" d="M30 44H41M49 44H60M29 75Q45 78.5 61 75" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.22)}" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M30.2 47a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0 -1.7 0ZM59.2 48a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0 -1.7 0ZM28.2 62a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0 -1.7 0ZM60.2 63a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0 -1.7 0ZM56.2 73a0.85 0.85 0 1 0 1.7 0a0.85 0.85 0 1 0 -1.7 0Z" fill="${tonalEdge(palette.primary, palette.ink, 0.13)}"/>
          <g data-snack-garnish="tofu" transform="rotate(${art.detailTilt * 0.6} 50 33)">
            <ellipse cx="42.5" cy="34.5" rx="4" ry="2.4" fill="${palette.secondary}" ${secondaryOutline}/>
            <ellipse cx="42.5" cy="34.5" rx="1.7" ry="1" fill="${tonalEdge(palette.secondary, palette.canvas, 0.55)}"/>
            <ellipse cx="56" cy="33.5" rx="4" ry="2.4" fill="${palette.secondary}" ${secondaryOutline}/>
            <ellipse cx="56" cy="33.5" rx="1.7" ry="1" fill="${tonalEdge(palette.secondary, palette.canvas, 0.55)}"/>
            <ellipse cx="49.5" cy="36.8" rx="3.6" ry="2.2" fill="${palette.secondary}" ${secondaryOutline}/>
            <ellipse cx="49.5" cy="36.8" rx="1.5" ry="0.9" fill="${tonalEdge(palette.secondary, palette.canvas, 0.55)}"/>
          </g>
        `,
        face: snackFace(snack, 45, 57, 15, 70, art),
        finish: { x: 45, y: 47, span: 10, rotation: 0 },
        companion: { x: 72, y: 19 },
      };

    case 'chocolate':
      return {
        body: `
          <rect x="25" y="15" width="50" height="53" rx="7" fill="${palette.primary}" ${primaryOutline}/>
          <path d="${chocolateSegmentGrid()}" fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.3)}" stroke-width="1.1" stroke-linejoin="round" transform="rotate(${art.detailTilt * 0.3} 50 40)"/>
          <path d="M25 63L31 58.5L37 63L43 58.5L49 63L55 58.5L61 63L67 58.5L73 63Q75 63 75 66V77Q75 84 68 84H32Q25 84 25 77Z" fill="${palette.canvas}" stroke="${tonalEdge(palette.canvas, palette.ink, 0.34)}" stroke-width="1.45" stroke-linejoin="round"/>
          <path d="M33 67V79M50 66.5V80M67 67V79" fill="none" stroke="${tonalEdge(palette.canvas, palette.ink, 0.24)}" stroke-width="1.6" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 42, 15, 56, art),
        finish: { x: 50, y: 30, span: 11, rotation: 0 },
        companion: { x: 72, y: 20 },
      };

    case 'artichoke':
      return {
        body: `
          <path d="M50 18Q59 27 59 39Q70 30 75 42Q77 55 67 64Q73 64 69 75Q61 87 50 89Q39 87 31 75Q27 64 33 64Q23 55 25 42Q30 30 41 39Q41 27 50 18Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M50 25Q43 43 50 53Q57 43 50 25ZM34 40Q33 54 45 62Q47 49 34 40ZM66 40Q67 54 55 62Q53 49 66 40ZM34 66Q41 79 50 82Q48 67 34 66ZM66 66Q59 79 50 82Q52 67 66 66Z" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        face: snackFace(snack, 50, 55, 15, 68, art),
        finish: { x: 50, y: 38, span: 11, rotation: 0 },
        companion: { x: 69, y: 20 },
      };

    case 'ice-pop':
      return {
        body: `
          <path d="M43 75V91Q50 96 57 91V75" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M29 27Q29 12 44 9H56Q71 12 71 27V76Q50 84 29 76Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M30 48Q50 39 70 48V76Q50 84 30 76Z" fill="${palette.accent}" opacity="0.78"/>
          <path d="M36 25Q39 16 48 15" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 44, 15, 57, art),
        finish: { x: 50, y: 28, span: 11, rotation: 0 },
        companion: { x: 68, y: 16 },
      };

    case 'honey-jar':
      return {
        body: `
          <path d="M29 31H71L76 43L72 81Q50 89 28 81L24 43Z" fill="${palette.primary}" ${primaryOutline}/>
          <rect x="28" y="22" width="44" height="13" rx="5" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M26 47Q50 55 74 47V65Q50 73 27 65Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M38 25V33M50 24V34M62 25V33" stroke="${tonalEdge(palette.secondary, palette.ink, 0.34)}" stroke-width="1.6" stroke-linecap="round"/>
        `,
        face: snackFace(snack, 50, 54, 16, 68, art),
        finish: { x: 50, y: 39, span: 12, rotation: 0 },
        companion: { x: 72, y: 20 },
      };

    case 'cookie':
      return {
        body: `
          <path d="M50 16Q69 16 80 31Q73 35 77 43Q84 49 79 57Q85 65 76 72Q68 86 50 86Q31 86 20 72Q10 58 17 40Q22 22 40 17Q45 21 50 16Z" fill="${palette.primary}" ${primaryOutline}/>
          <path d="M71 24Q67 31 75 35M78 43Q69 47 79 54" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
          <g fill="${palette.accent}" ${accentOutline}><circle cx="35" cy="34" r="4"/><circle cx="55" cy="29" r="3.5"/><circle cx="64" cy="51" r="4"/><circle cx="35" cy="64" r="3.6"/><circle cx="55" cy="72" r="3.2"/></g>
        `,
        face: snackFace(snack, 49, 49, 17, 63, art),
        finish: { x: 49, y: 36, span: 12, rotation: 0 },
        companion: { x: 70, y: 19 },
      };

    default:
      return invalidOption('snack', snack);
  }
}

function faceLine(path: string, palette: Palette, weight = 2.2): string {
  return `
    <path d="${path}" fill="none" stroke="${palette.canvas}" stroke-width="${weight + 2.15}" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${path}" fill="none" stroke="${palette.ink}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round"/>
  `;
}

function openEye(
  x: number,
  y: number,
  face: FaceAnchor,
  palette: Palette,
  scale = 1,
): string {
  const rx = face.eyeRx * scale;
  const ry = face.eyeRy * scale;
  return `
    <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${palette.canvas}" stroke="${palette.ink}" stroke-width="2.35"/>
    <circle cx="${x}" cy="${y + 0.35}" r="${face.pupilRadius * scale}" fill="${palette.ink}"/>
  `;
}

function renderExpression(
  snack: SnackName,
  expression: SnacksParams['expression'],
  face: FaceAnchor,
  palette: Palette,
  art: SnackArt,
): string {
  if (snack === 'pretzel') {
    const left = 44 + art.faceShiftX;
    const right = 56 + art.faceShiftX;
    const eyeY = face.eyeY;
    const mouthY = face.mouthY;
    const open = (x: number, y: number, scale = 1) => `
      <ellipse data-snack-eye="pretzel" cx="${x}" cy="${y}" rx="${2.75 * scale}" ry="${3.35 * scale}" fill="${palette.canvas}" stroke="${palette.ink}" stroke-width="1.65"/>
      <circle cx="${x}" cy="${y + 0.25}" r="${1.15 * scale}" fill="${palette.ink}"/>
      <circle cx="${x - 0.35}" cy="${y - 0.25}" r="${0.38 * scale}" fill="${palette.canvas}"/>
    `;
    const closed = (x: number, y: number, sleepy = false) => faceLine(
      `M${x - 4.2} ${y + (sleepy ? 0.8 : 0)}Q${x} ${y + (sleepy ? -1.8 : 2)} ${x + 4.2} ${y + (sleepy ? 0.8 : 0)}`,
      palette,
      1.85,
    );

    switch (expression) {
      case 'calm':
        return `${open(left, eyeY)}${open(right, eyeY)}${faceLine(`M46 ${mouthY}Q50 ${mouthY + 0.7} 54 ${mouthY}`, palette)}`;
      case 'soft-smile':
        return `${open(left, eyeY)}${open(right, eyeY)}${faceLine(`M45.5 ${mouthY - 1}Q50 ${mouthY + 2.8} 54.5 ${mouthY - 1}`, palette)}`;
      case 'content':
        return `${closed(left, eyeY)}${closed(right, eyeY)}${faceLine(`M44 ${mouthY - 1}Q50 ${mouthY + 3.5} 56 ${mouthY - 1}`, palette)}`;
      case 'curious':
        return `${open(left, eyeY, 0.88)}${open(right, eyeY - 0.6, 1.12)}<ellipse cx="50.6" cy="${mouthY}" rx="2.2" ry="2.7" fill="${palette.canvas}" stroke="${palette.ink}" stroke-width="1.8"/>`;
      case 'sleepy':
        return `${closed(left, eyeY, true)}${closed(right, eyeY, true)}${faceLine(`M45 ${mouthY}Q50 ${mouthY - 0.7} 55 ${mouthY}`, palette)}`;
      default:
        return invalidOption('expression', expression);
    }
  }

  const left = face.x - face.eyeGap / 2;
  const right = face.x + face.eyeGap / 2;
  const leftY = face.eyeY - art.eyeSkew;
  const rightY = face.eyeY + art.eyeSkew;
  const mouthY = face.mouthY;
  const halfMouth = face.mouthWidth / 2;
  const closedEyeHalf = face.eyeRx * 0.9;

  switch (expression) {
    case 'calm':
      return `${openEye(left, leftY, face, palette)}${openEye(right, rightY, face, palette)}${faceLine(`M${face.x - halfMouth * 0.72} ${mouthY}Q${face.x} ${mouthY + 0.8} ${face.x + halfMouth * 0.72} ${mouthY}`, palette)}`;
    case 'soft-smile':
      return `${openEye(left, leftY, face, palette)}${openEye(right, rightY, face, palette)}${faceLine(`M${face.x - halfMouth} ${mouthY - 1}Q${face.x} ${mouthY + face.mouthDepth} ${face.x + halfMouth} ${mouthY - 1}`, palette)}`;
    case 'content':
      return `${faceLine(`M${left - closedEyeHalf} ${leftY}Q${left} ${leftY + face.eyeRy * 0.55} ${left + closedEyeHalf} ${leftY}`, palette, 2)}${faceLine(`M${right - closedEyeHalf} ${rightY}Q${right} ${rightY + face.eyeRy * 0.55} ${right + closedEyeHalf} ${rightY}`, palette, 2)}${faceLine(`M${face.x - halfMouth * 0.9} ${mouthY - 1}Q${face.x} ${mouthY + face.mouthDepth * 0.85} ${face.x + halfMouth * 0.9} ${mouthY - 1}`, palette)}`;
    case 'curious':
      return `${openEye(left, leftY, face, palette, 0.9)}${openEye(right, rightY - 1, face, palette, 1.16)}<ellipse cx="${face.x + 0.8}" cy="${mouthY}" rx="${face.mouthDepth * 0.68}" ry="${face.mouthDepth * 0.78}" fill="${palette.canvas}" stroke="${palette.ink}" stroke-width="2.25"/>`;
    case 'sleepy':
      return `${faceLine(`M${left - closedEyeHalf} ${leftY + 1}Q${left} ${leftY - face.eyeRy * 0.45} ${left + closedEyeHalf} ${leftY + 1}`, palette, 2)}${faceLine(`M${right - closedEyeHalf} ${rightY + 1}Q${right} ${rightY - face.eyeRy * 0.45} ${right + closedEyeHalf} ${rightY + 1}`, palette, 2)}${faceLine(`M${face.x - halfMouth * 0.62} ${mouthY}Q${face.x} ${mouthY - 0.6} ${face.x + halfMouth * 0.62} ${mouthY}`, palette)}`;
    default:
      return invalidOption('expression', expression);
  }
}

function renderFinish(
  finish: FinishName,
  snack: SnackName,
  anchor: FinishAnchor,
  palette: Palette,
  art: SnackArt,
): string {
  const { x, y, span, rotation } = anchor;
  const transform = `rotate(${rotation + art.detailTilt * 0.35} ${x} ${y})`;

  if (finish === 'plain') return '';

  switch (snack) {
    case 'toast':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}" transform="${transform}"><ellipse cx="38" cy="38" rx="1.7" ry="2.8" transform="rotate(-28 38 38)"/><ellipse cx="48" cy="42" rx="1.7" ry="2.8"/><ellipse cx="59" cy="37" rx="1.7" ry="2.8" transform="rotate(25 59 37)"/><ellipse cx="64" cy="47" rx="1.5" ry="2.5" transform="rotate(38 64 47)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M33 39Q39 33 45 39T57 39T68 38" fill="none" stroke="${palette.canvas}" stroke-width="5.5" stroke-linecap="round" transform="${transform}"/><path d="M33 39Q39 33 45 39T57 39T68 38" fill="none" stroke="${palette.accent}" stroke-width="2.7" stroke-linecap="round" transform="${transform}"/>`;
      }
      if (finish === 'stripes') {
        return `<path d="M35 35L41 45M47 34L53 45M59 34L65 44" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.7" stroke-linecap="round" transform="${transform}"/>`;
      }
      if (finish === 'spots') {
        return `<path d="M34 41C37 34 44 33 48 38C53 32 63 34 66 42C58 47 43 48 34 41Z" fill="${palette.accent}" stroke="${tonalEdge(palette.accent, palette.ink, 0.32)}" stroke-width="1.3" transform="${transform}"/>`;
      }
      break;
    case 'dumpling':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}"><ellipse cx="43" cy="48" rx="1.5" ry="2.5" transform="rotate(-24 43 48)"/><ellipse cx="50" cy="45" rx="1.5" ry="2.5"/><ellipse cx="57" cy="48" rx="1.5" ry="2.5" transform="rotate(24 57 48)"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M35 48Q39 52 40 58M44 43Q47 49 47 56M55 43Q52 49 53 56M65 48Q61 52 60 58" fill="none" stroke="${palette.primary}" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      break;
    case 'citrus':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}"><path d="M43 35Q47 30 49 36Q47 40 43 35Z"/><path d="M55 35Q58 31 60 37Q57 40 55 35Z"/><path d="M50 45Q54 41 56 46Q53 50 50 45Z"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M50 28V42M34 35L44 45M66 35L56 45" fill="none" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round" transform="rotate(${art.detailTilt} 50 52)"/>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.accent}"><circle cx="38" cy="38" r="2.5"/><circle cx="51" cy="34" r="2"/><circle cx="63" cy="40" r="2.4"/></g>`;
      }
      break;
    case 'berry':
      if (finish === 'seeds') {
        return `<g fill="${palette.secondary}"><ellipse cx="34" cy="45" rx="1.6" ry="2.7" transform="rotate(-25 34 45)"/><ellipse cx="48" cy="40" rx="1.6" ry="2.7"/><ellipse cx="64" cy="47" rx="1.6" ry="2.7" transform="rotate(25 64 47)"/><ellipse cx="39" cy="64" rx="1.5" ry="2.5" transform="rotate(-18 39 64)"/><ellipse cx="59" cy="66" rx="1.5" ry="2.5" transform="rotate(18 59 66)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M34 39Q43 32 52 36" fill="none" stroke="${palette.canvas}" stroke-width="5" stroke-linecap="round"/><path d="M34 39Q43 32 52 36" fill="none" stroke="${palette.accent}" stroke-width="2.4" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.32)}" stroke-width="1"><circle cx="34" cy="45" r="2.8"/><circle cx="62" cy="47" r="2.5"/><circle cx="43" cy="72" r="2.3"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M31 55Q35 59 39 58M61 62Q65 59 69 55" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="1.7" stroke-linecap="round"/>`;
      }
      break;
    case 'mushroom':
      if (finish === 'spots') {
        return `<g fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.32)}" stroke-width="1.15"><circle cx="34" cy="32" r="5"/><circle cx="53" cy="25" r="4"/><circle cx="68" cy="36" r="4.5"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M31 43L27 49M42 42L40 50M58 42L60 50M69 43L73 49" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round"/>`;
      }
      break;
    case 'coffee':
      if (finish === 'drizzle') {
        return `<path d="M35 29C39 24 48 25 49 29C51 34 61 33 65 28" fill="none" stroke="${palette.canvas}" stroke-width="4.8" stroke-linecap="round"/><path d="M35 29C39 24 48 25 49 29C51 34 61 33 65 28" fill="none" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round"/>`;
      }
      if (finish === 'stripes') {
        return `<path d="M29 44Q50 49 72 43M28 51Q50 56 71 50" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round"/>`;
      }
      break;
    case 'sushi':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}"><ellipse cx="36" cy="29" rx="1.5" ry="2.5" transform="rotate(-24 36 29)"/><ellipse cx="50" cy="27" rx="1.5" ry="2.5"/><ellipse cx="64" cy="29" rx="1.5" ry="2.5" transform="rotate(24 64 29)"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M31 25L39 43M46 22L54 43M61 23L69 44" fill="none" stroke="${palette.primary}" stroke-width="2.7" stroke-linecap="round"/>`;
      }
      break;
    case 'avocado':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}"><ellipse cx="42" cy="34" rx="1.4" ry="2.4" transform="rotate(-20 42 34)"/><ellipse cx="51" cy="31" rx="1.4" ry="2.4"/><ellipse cx="59" cy="37" rx="1.4" ry="2.4" transform="rotate(24 59 37)"/></g>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.primary}"><circle cx="40" cy="34" r="2.4"/><circle cx="58" cy="38" r="2"/><circle cx="49" cy="29" r="1.8"/></g>`;
      }
      break;
    case 'taco':
      if (finish === 'seeds') {
        return `<g fill="${palette.ink}"><ellipse cx="39" cy="39" rx="1.4" ry="2.3" transform="rotate(-28 39 39)"/><ellipse cx="52" cy="36" rx="1.4" ry="2.3"/><ellipse cx="65" cy="40" rx="1.4" ry="2.3" transform="rotate(28 65 40)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M27 43Q34 37 41 43T55 42T73 43" fill="none" stroke="${palette.canvas}" stroke-width="5.5" stroke-linecap="round"/><path d="M27 43Q34 37 41 43T55 42T73 43" fill="none" stroke="${palette.accent}" stroke-width="2.7" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.32)}" stroke-width="0.9"><circle cx="37" cy="40" r="2.5"/><circle cx="51" cy="37" r="2.3"/><circle cx="66" cy="42" r="2.5"/></g>`;
      }
      break;
    case 'cupcake':
      if (finish === 'drizzle') {
        return `<path d="M31 39Q39 33 46 39T60 38T70 40" fill="none" stroke="${palette.canvas}" stroke-width="5.5" stroke-linecap="round"/><path d="M31 39Q39 33 46 39T60 38T70 40" fill="none" stroke="${palette.accent}" stroke-width="2.7" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.accent}" stroke="${tonalEdge(palette.accent, palette.ink, 0.32)}" stroke-width="0.9"><circle cx="38" cy="39" r="2.4"/><circle cx="51" cy="29" r="2.2"/><circle cx="64" cy="40" r="2.5"/></g>`;
      }
      if (finish === 'stripes') {
        return `<path d="M34 57L38 79M49 55V82M64 56L61 79" fill="none" stroke="${palette.accent}" stroke-width="2.8" stroke-linecap="round"/>`;
      }
      break;
    case 'pretzel':
      if (finish === 'seeds') {
        return `<g fill="${palette.secondary}"><ellipse cx="24" cy="57" rx="1.4" ry="2.3" transform="rotate(-35 24 57)"/><ellipse cx="34" cy="31" rx="1.4" ry="2.3" transform="rotate(-28 34 31)"/><ellipse cx="66" cy="31" rx="1.4" ry="2.3" transform="rotate(28 66 31)"/><ellipse cx="76" cy="57" rx="1.4" ry="2.3" transform="rotate(35 76 57)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M26 31Q34 24 42 35M58 35Q66 24 74 31" fill="none" stroke="${palette.accent}" stroke-width="2.6" stroke-linecap="round"/>`;
      }
      if (finish === 'stripes') {
        return `<path d="M23 59L29 55M47 78L52 74M71 55L77 59" fill="none" stroke="${palette.secondary}" stroke-width="2.2" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<g fill="${palette.secondary}"><circle cx="29" cy="31" r="2"/><circle cx="50" cy="77" r="1.9"/><circle cx="71" cy="31" r="2"/></g>`;
      }
      break;
    case 'croissant':
      if (finish === 'seeds') {
        return `<g fill="${tonalEdge(palette.secondary, palette.ink, 0.3)}"><ellipse cx="40" cy="26" rx="1.3" ry="2.2" transform="rotate(-24 40 26)"/><ellipse cx="50" cy="28.5" rx="1.3" ry="2.2"/><ellipse cx="60" cy="26" rx="1.3" ry="2.2" transform="rotate(24 60 26)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M36 25Q43 21.5 49 25Q55 28.5 63 24" fill="none" stroke="${palette.accent}" stroke-width="2.6" stroke-linecap="round"/>`;
      }
      if (finish === 'stripes') {
        return `<path d="M44 26Q50 30 56 26" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.8" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<path d="M31 27Q34 23 37 27Q34 31 31 27ZM63 27Q66 23 69 27Q66 31 63 27Z" fill="${palette.accent}"/>`;
      }
      break;
    case 'bell-pepper':
      if (finish === 'seeds') {
        return `<g fill="${palette.secondary}"><ellipse cx="35" cy="43" rx="1.4" ry="2.3" transform="rotate(-25 35 43)"/><ellipse cx="65" cy="43" rx="1.4" ry="2.3" transform="rotate(25 65 43)"/></g>`;
      }
      if (finish === 'drizzle') {
        return `<path d="M34 40Q42 34 48 38" fill="none" stroke="${palette.accent}" stroke-width="2.5" stroke-linecap="round"/>`;
      }
      if (finish === 'stripes') {
        return `<path d="M37 73Q50 79 63 73" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.3)}" stroke-width="1.8" stroke-linecap="round"/>`;
      }
      if (finish === 'spots') {
        return `<path d="M32 47Q35 43 39 47Q36 52 32 47ZM61 69Q64 65 68 69Q65 73 61 69Z" fill="${palette.accent}"/>`;
      }
      break;
  }

  switch (finish) {
    case 'seeds':
      return `
        <g fill="${palette.ink}" transform="${transform}">
          <ellipse cx="${x - span * 0.45}" cy="${y}" rx="2.2" ry="3.2" transform="rotate(-25 ${x - span * 0.45} ${y})"/>
          <ellipse cx="${x}" cy="${y + 3}" rx="2.2" ry="3.2"/>
          <ellipse cx="${x + span * 0.45}" cy="${y - 1}" rx="2.2" ry="3.2" transform="rotate(25 ${x + span * 0.45} ${y - 1})"/>
        </g>
      `;
    case 'drizzle':
      return `
        <path d="M${x - span} ${y}Q${x - span * 0.5} ${y - 6} ${x} ${y}Q${x + span * 0.5} ${y + 6} ${x + span} ${y}" fill="none" stroke="${palette.canvas}" stroke-width="6" stroke-linecap="round" transform="${transform}"/>
        <path d="M${x - span} ${y}Q${x - span * 0.5} ${y - 6} ${x} ${y}Q${x + span * 0.5} ${y + 6} ${x + span} ${y}" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round" transform="${transform}"/>
      `;
    case 'stripes':
      return `
        <g fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.34)}" stroke-width="1.7" stroke-linecap="round" transform="${transform}">
          <path d="M${x - span * 0.65} ${y - 5}L${x - span * 0.35} ${y + 5}"/>
          <path d="M${x - span * 0.15} ${y - 5}L${x + span * 0.15} ${y + 5}"/>
          <path d="M${x + span * 0.35} ${y - 5}L${x + span * 0.65} ${y + 5}"/>
        </g>
      `;
    case 'spots':
      return `
        <circle cx="${x - span * 0.48}" cy="${y}" r="3.6" fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.32)}" stroke-width="1.1"/>
        <circle cx="${x + 1}" cy="${y + 3}" r="3.2" fill="${palette.accent}" stroke="${tonalEdge(palette.accent, palette.ink, 0.32)}" stroke-width="1.1"/>
        <circle cx="${x + span * 0.48}" cy="${y - 2}" r="3.6" fill="${palette.secondary}" stroke="${tonalEdge(palette.secondary, palette.ink, 0.32)}" stroke-width="1.1"/>
      `;
    default:
      return invalidOption('finish', finish);
  }
}

function renderCompanion(
  companion: CompanionName,
  snack: SnackName,
  anchor: CompanionAnchor,
  palette: Palette,
  art: SnackArt,
): CompanionArt {
  // Keep optional companions inside the shared fit envelope so enabling one
  // never shrinks or shifts the primary snack.
  const x = Math.min(anchor.x, 62);
  const y = Math.max(anchor.y, 28);
  const primaryEdge = tonalEdge(palette.primary, palette.ink, 0.34);
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.34);
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.34);
  const canvasEdge = tonalEdge(palette.canvas, palette.ink, 0.3);
  const secondaryOutline = `stroke="${secondaryEdge}" stroke-width="1.45" stroke-linejoin="round"`;
  const accentOutline = `stroke="${accentEdge}" stroke-width="1.45" stroke-linejoin="round"`;
  const empty = { behind: '', front: '' };

  switch (companion) {
    case 'none':
      return empty;
    case 'leaf': {
      const attachY = snack === 'avocado' || snack === 'berry' ? y + 10 : y + 13;
      return {
        behind: `
          <path d="M${x - 1} ${attachY}Q${x + 1} ${y + 4} ${x + 7} ${y - 1}" fill="none" stroke="${secondaryEdge}" stroke-width="1.55" stroke-linecap="round"/>
          <g transform="rotate(${art.detailTilt} ${x + 7} ${y})"><path d="M${x + 2} ${y + 4}Q${x + 5} ${y - 8} ${x + 17} ${y - 6}Q${x + 15} ${y + 6} ${x + 5} ${y + 8}Z" fill="${palette.secondary}" ${secondaryOutline}/><path d="M${x + 5} ${y + 5}L${x + 14} ${y - 3}" stroke="${secondaryEdge}" stroke-width="1.3" stroke-linecap="round"/></g>
        `,
        front: '',
      };
    }
    case 'berry':
      return {
        behind: `<path d="M${x} ${y + 5}L${x - 2} ${y + 12}" stroke="${secondaryEdge}" stroke-width="1.45" stroke-linecap="round"/>`,
        front: `<circle cx="${x}" cy="${y}" r="6.2" fill="${palette.accent}" ${accentOutline}/><path d="M${x - 4} ${y - 5}Q${x} ${y - 10} ${x + 4} ${y - 5}" fill="${palette.secondary}" ${secondaryOutline}/>`
      };
    case 'butter': {
      const butterX = snack === 'toast' ? 59 : x;
      const butterY = snack === 'toast' ? 35 : y;
      return {
        behind: '',
        front: `<rect x="${butterX - 8}" y="${butterY - 5}" width="16" height="10" rx="3" fill="${palette.canvas}" stroke="${canvasEdge}" stroke-width="1.45" stroke-linejoin="round" transform="rotate(${-8 + art.detailTilt} ${butterX} ${butterY})"/><path d="M${butterX - 4} ${butterY - 1}L${butterX + 3} ${butterY - 2}" stroke="${palette.accent}" stroke-width="1.8" stroke-linecap="round"/>`,
      };
    }
    case 'steam': {
      if (snack === 'coffee') {
        return {
          behind: `<path d="M42 29C35 22 44 18 40 10M57 29C64 22 55 18 60 9" fill="none" stroke="${canvasEdge}" stroke-width="1.65" stroke-linecap="round"/>`,
          front: '',
        };
      }
      if (snack === 'dumpling') {
        return {
          behind: `<path d="M39 40C33 34 42 30 38 23M51 36C45 30 54 25 50 18M62 40C68 34 59 30 63 23" fill="none" stroke="${canvasEdge}" stroke-width="1.65" stroke-linecap="round"/>`,
          front: '',
        };
      }
      return {
        behind: `<path d="M${x - 7} ${y + 8}Q${x - 12} ${y} ${x - 6} ${y - 8}M${x + 7} ${y + 8}Q${x + 12} ${y} ${x + 6} ${y - 8}" fill="none" stroke="${canvasEdge}" stroke-width="1.65" stroke-linecap="round"/>`,
        front: '',
      };
    }
    case 'pick':
      return {
        behind: `<path d="M${x - 4} ${y + 15}L${x + 3} ${y - 10}" stroke="${primaryEdge}" stroke-width="1.65" stroke-linecap="round"/><circle cx="${x + 3}" cy="${y - 10}" r="4.3" fill="${palette.accent}" ${accentOutline}/>` ,
        front: `<circle cx="${x - 1}" cy="${y + 5}" r="2.2" fill="${palette.ink}"/>`,
      };
    default:
      return invalidOption('companion', companion);
  }
}

function getSnackDefinition(snack: SnackName): (typeof snackDefinitions)[number] {
  const definition = snackDefinitions.find(({ id }) => id === snack);
  if (!definition) return invalidOption('snack', snack);
  return definition;
}

function renderLimbs(
  snack: SnackName,
  profile: LimbProfileName,
  palette: Palette,
  art: SnackArt,
): string {
  if (profile === 'none') return '';

  const edge = tonalEdge(palette.secondary, palette.ink, 0.4);
  const handFill = palette.secondary;
  const shift = art.contour * 0.45;

  // These silhouettes already carry strong gestures of their own. Sparse,
  // silhouette-aware feet keep the tiny versions lively without pasting the
  // same arms and round hands over their identifying negative spaces.
  switch (snack) {
    case 'berry':
      return '';
    case 'pretzel':
      return '';
    case 'croissant':
      return `<path data-snack-limbs="croissant" d="M42 50Q40 66 33 71M58 50Q60 66 67 71" fill="none" stroke="${edge}" stroke-width="3.2" stroke-linecap="round"/>`;
    case 'bell-pepper':
      return `<path data-snack-limbs="bell-pepper" d="M43 79Q42 87 36 89M57 79Q58 87 64 89" fill="none" stroke="${edge}" stroke-width="3.3" stroke-linecap="round"/>`;
  }

  const configs = {
    compact: { left: 29, right: 71, armY: 58, handY: 65, footX: 8, footY: 84, arms: true, feet: true },
    wide: { left: 23, right: 77, armY: 58, handY: 65, footX: 11, footY: 83, arms: true, feet: true },
    tall: { left: 34, right: 66, armY: 57, handY: 65, footX: 7, footY: 87, arms: true, feet: true },
    floating: { left: 31, right: 69, armY: 43, handY: 49, footX: 0, footY: 0, arms: true, feet: false },
  } as const;
  const config = configs[profile];
  const arms = config.arms
    ? `
      <path d="M${config.left + shift} ${config.armY}Q${config.left - 7} ${config.armY + 1} ${config.left - 10} ${config.handY}" fill="none" stroke="${edge}" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M${config.right + shift} ${config.armY}Q${config.right + 7} ${config.armY + 1} ${config.right + 10} ${config.handY}" fill="none" stroke="${edge}" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="${config.left - 10}" cy="${config.handY}" r="2.7" fill="${handFill}" stroke="${edge}" stroke-width="1.1"/>
      <circle cx="${config.right + 10}" cy="${config.handY}" r="2.7" fill="${handFill}" stroke="${edge}" stroke-width="1.1"/>
    `
    : '';
  const feet = config.feet
    ? `
      <path d="M${50 - config.footX} ${config.footY - 5}Q${50 - config.footX - 1} ${config.footY + 1} ${50 - config.footX - 6} ${config.footY + 2}" fill="none" stroke="${edge}" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M${50 + config.footX} ${config.footY - 5}Q${50 + config.footX + 1} ${config.footY + 1} ${50 + config.footX + 6} ${config.footY + 2}" fill="none" stroke="${edge}" stroke-width="3.4" stroke-linecap="round"/>
    `
    : '';
  return `${arms}${feet}`;
}

function poseTransform(
  snack: SnackName,
  pose: PoseName,
  art: SnackArt,
): string {
  const definition = getSnackDefinition(snack);
  const config = poseProfiles[definition.pose];
  const direction = pose === 'lean-left' ? -1 : pose === 'lean-right' ? 1 : 0;
  const shiftX = direction * config.shiftX;
  const shiftY = Math.abs(direction) * config.shiftY;
  const angle = art.restingTilt + direction * config.angle;
  const scaleX = art.widthScale * (direction === 0 ? 1 : config.poseScaleX);
  const scaleY = art.heightScale * (direction === 0 ? 1 : config.poseScaleY);
  return `translate(${shiftX} ${shiftY}) rotate(${angle} 50 ${config.pivotY}) translate(50 ${config.pivotY}) scale(${scaleX} ${scaleY}) translate(-50 -${config.pivotY})`;
}

const finishesByProfile: Record<
  FinishProfileName,
  readonly (readonly [FinishName, number])[]
> = {
  fruit: [['plain', 6], ['seeds', 3], ['spots', 2], ['stripes', 1]],
  baked: [['plain', 6], ['drizzle', 2], ['stripes', 3], ['spots', 1]],
  sweet: [['plain', 5], ['drizzle', 4], ['spots', 3], ['stripes', 2]],
  savory: [['plain', 7], ['seeds', 2], ['stripes', 2], ['spots', 1]],
  vessel: [['plain', 6], ['drizzle', 2], ['stripes', 3]],
  fresh: [['plain', 7], ['seeds', 2], ['stripes', 1], ['spots', 2]],
};

const companionsByProfile: Record<
  CompanionProfileName,
  readonly (readonly [CompanionName, number])[]
> = {
  fruit: [['none', 8], ['leaf', 3], ['pick', 1]],
  breakfast: [['none', 7], ['butter', 3], ['berry', 2]],
  warm: [['none', 6], ['butter', 3], ['berry', 1], ['steam', 2]],
  hot: [['none', 6], ['steam', 5], ['pick', 1]],
  served: [['none', 8], ['pick', 3], ['leaf', 1]],
  'hot-served': [['none', 6], ['steam', 3], ['pick', 2], ['leaf', 1]],
  sweet: [['none', 7], ['berry', 3], ['butter', 1], ['pick', 1]],
  fresh: [['none', 9], ['leaf', 2], ['pick', 1]],
};

export function generate(params: SnacksParams): string {
  assertSnacksParams(params);
  const palette = getPalette(params.palette);
  const art = resolveSnackArt(params);
  const definition = getSnackDefinition(params.snack);
  const layout = renderSnack(params.snack, palette, art);
  const companion = renderCompanion(
    params.companion,
    params.snack,
    layout.companion,
    palette,
    art,
  );
  const limbs = renderLimbs(params.snack, definition.limbs, palette, art);
  const presence = snackPresence[params.snack];
  const presenceGroup = presence === 1
    ? ['', '']
    : [
      `<g transform="translate(50 50) scale(${presence}) translate(-50 -50)">`,
      '</g>',
    ];
  const artwork = `
    <circle cx="50" cy="50" r="49" fill="none" stroke="transparent" stroke-width="8"/>
    <g transform="${poseTransform(params.snack, params.pose, art)}">
      ${presenceGroup[0]}
      ${companion.behind}
      ${limbs}
      ${layout.body}
      ${renderFinish(params.finish, params.snack, layout.finish, palette, art)}
      ${companion.front}
      ${renderExpression(params.snack, params.expression, layout.face, palette, art)}
      ${presenceGroup[1]}
    </g>
  `;
  const content = fitToCircle(artwork, { size: 100, padding: 5 });

  return renderAvatarFrame(content, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<SnacksParams> = {},
): SnacksParams {
  const snack = traits.snack ?? random.pick('snack', schema.snack.options);
  const definition = getSnackDefinition(snack);

  return {
    backgroundShape: traits.backgroundShape ?? random.weightedPick('background-shape', [
      ['circle', 5],
      ['rounded', 4],
      ['square', 1],
    ]),
    palette: traits.palette ?? random.pick('palette', schema.palette.options),
    snack,
    expression: traits.expression ?? random.weightedPick('expression', [
      ['calm', 4],
      ['soft-smile', 6],
      ['content', 5],
      ['curious', 2],
      ['sleepy', 3],
    ]),
    finish: traits.finish ?? random.weightedPick(
      `finish:${snack}`,
      finishesByProfile[definition.finish],
    ),
    companion: traits.companion ?? random.weightedPick(
      `companion:${snack}`,
      companionsByProfile[definition.companion],
    ),
    pose: traits.pose ?? random.weightedPick('pose', [
      ['centered', 6],
      ['lean-left', 2],
      ['lean-right', 2],
    ]),
  };
}

/** Theme-private inspection helpers used by exhaustive artwork invariants. */
export const __test = {
  renderParts(params: SnacksParams): {
    readonly body: string;
    readonly face: string;
    readonly limbs: string;
  } {
    assertSnacksParams(params);
    const palette = getPalette(params.palette);
    const art = resolveSnackArt(params);
    const layout = renderSnack(params.snack, palette, art);
    const definition = getSnackDefinition(params.snack);
    return {
      body: layout.body,
      face: renderExpression(params.snack, params.expression, layout.face, palette, art),
      limbs: renderLimbs(params.snack, definition.limbs, palette, art),
    };
  },
};

export const snacks: InternalTheme<typeof schema, 'food', typeof baseTypeParam> = {
  name: 'Snacks',
  description: 'Editorial food characters with bold silhouettes and quietly warm expressions.',
  kind: 'food',
  baseTypeParam,
  schema,
  generate,
  randomize,
};
