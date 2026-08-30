import { fitToCircle } from '../fit';
import type { ParamSchema, ParamsFromSchema } from '../types';
import { paletteNames, palettes, type Palette } from '../palettes';
import {
  createArtVariation,
  renderAvatarFrame,
  tonalEdge,
  type ArtVariation,
} from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';

type FeatureName = 'none' | 'antenna' | 'horn' | 'odd-ears' | 'tuft' | 'side-fin' | 'feet';
type PatternName = 'plain' | 'belly' | 'dapple' | 'swoop' | 'blush' | 'patch';
type ColorRole = 'primary' | 'secondary' | 'accent';

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BodyBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface SurfaceAnchor {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

interface FeatureAnchors {
  top: SurfaceAnchor;
  left: SurfaceAnchor;
  right: SurfaceAnchor;
  baseLeft: SurfaceAnchor;
  baseRight: SurfaceAnchor;
}

interface PatternZone {
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
}

interface PatternZones {
  left: PatternZone;
  right: PatternZone;
  belly: PatternZone;
  faceExclusion: FaceBox;
}

type WeightedFeatures = readonly (readonly [FeatureName, number])[];
type WeightedPatterns = readonly (readonly [PatternName, number])[];

interface BodyDefinition<TId extends string = string> {
  id: TId;
  label: string;
  topology: string;
  faceBox: FaceBox;
  bounds: BodyBounds;
  featureAnchors: FeatureAnchors;
  patternZones: PatternZones;
  colorRole: ColorRole;
  bodyTilt: number;
  naturalFeatures: WeightedFeatures;
  naturalPatterns: WeightedPatterns;
}

interface BodyLayout {
  definition: BodyDefinition<BodyShapeName>;
  svg: string;
}

interface FeatureLayers {
  behind: string;
  front: string;
}

interface OddlingArt {
  faceTilt: number;
  eyeSkew: number;
  leftEyeScale: number;
  rightEyeScale: number;
  gazeX: number;
  gazeY: number;
  mouthShiftX: number;
  mouthShiftY: number;
  mouthScale: number;
  patternShiftX: number;
  patternShiftY: number;
  patternTilt: number;
  patternScale: number;
  patternOnLeft: boolean;
  patternRhythm: number;
  featureOnLeft: boolean;
}

const gentleFeatures = [
  ['none', 38], ['antenna', 13], ['horn', 7], ['odd-ears', 13],
  ['tuft', 15], ['side-fin', 7], ['feet', 7],
] as const satisfies WeightedFeatures;
const topFeatures = [
  ['none', 43], ['antenna', 15], ['horn', 9], ['tuft', 19],
  ['odd-ears', 6], ['side-fin', 4], ['feet', 4],
] as const satisfies WeightedFeatures;
const sideFeatures = [
  ['none', 42], ['odd-ears', 20], ['side-fin', 16], ['antenna', 7],
  ['tuft', 7], ['horn', 4], ['feet', 4],
] as const satisfies WeightedFeatures;
const baseFeatures = [
  ['none', 46], ['feet', 22], ['odd-ears', 9], ['side-fin', 8],
  ['tuft', 7], ['antenna', 5], ['horn', 3],
] as const satisfies WeightedFeatures;
const quietFeatures = [
  ['none', 58], ['tuft', 13], ['feet', 10], ['antenna', 8],
  ['odd-ears', 5], ['side-fin', 4], ['horn', 2],
] as const satisfies WeightedFeatures;

const softPatterns = [
  ['plain', 32], ['belly', 23], ['dapple', 13], ['swoop', 12],
  ['blush', 12], ['patch', 8],
] as const satisfies WeightedPatterns;
const graphicPatterns = [
  ['plain', 40], ['belly', 17], ['swoop', 16], ['patch', 12],
  ['blush', 9], ['dapple', 6],
] as const satisfies WeightedPatterns;
const quietPatterns = [
  ['plain', 52], ['belly', 18], ['blush', 12], ['dapple', 7],
  ['swoop', 6], ['patch', 5],
] as const satisfies WeightedPatterns;
const painterlyPatterns = [
  ['plain', 28], ['dapple', 19], ['swoop', 18], ['belly', 15],
  ['patch', 12], ['blush', 8],
] as const satisfies WeightedPatterns;

type FaceTuple = readonly [number, number, number, number];
type BoundsTuple = readonly [number, number, number, number];
type AnchorTuple = readonly [number, number, number, number];
type ZoneTuple = readonly [number, number, number, number, number];

function surface(tuple: AnchorTuple): SurfaceAnchor {
  const length = Math.hypot(tuple[2], tuple[3]);
  if (length === 0) throw new Error('Oddlings surface anchors need a normal');
  return {
    x: tuple[0],
    y: tuple[1],
    nx: tuple[2] / length,
    ny: tuple[3] / length,
  };
}

function zone(tuple: ZoneTuple): PatternZone {
  return {
    x: tuple[0],
    y: tuple[1],
    width: tuple[2],
    height: tuple[3],
    angle: tuple[4],
  };
}

interface DefinitionOverrides {
  anchors?: Partial<Record<keyof FeatureAnchors, AnchorTuple>>;
  zones?: Partial<Record<'left' | 'right' | 'belly', ZoneTuple>>;
}

function defineBody<const TId extends string>(
  id: TId,
  label: string,
  topology: string,
  faceTuple: FaceTuple,
  boundsTuple: BoundsTuple,
  colorRole: ColorRole,
  naturalFeatures: WeightedFeatures,
  naturalPatterns: WeightedPatterns,
  bodyTilt = 0,
  overrides: DefinitionOverrides = {},
): BodyDefinition<TId> {
  const faceBox: FaceBox = {
    x: faceTuple[0],
    y: faceTuple[1],
    width: faceTuple[2],
    height: faceTuple[3],
  };
  const bounds: BodyBounds = {
    top: boundsTuple[0],
    bottom: boundsTuple[1],
    left: boundsTuple[2],
    right: boundsTuple[3],
  };
  const baseSpread = Math.min(18, Math.max(8, faceBox.width * 0.34));
  const defaults: FeatureAnchors = {
    top: surface([faceBox.x, bounds.top, 0, -1]),
    left: surface([bounds.left, faceBox.y, -1, 0]),
    right: surface([bounds.right, faceBox.y, 1, 0]),
    baseLeft: surface([faceBox.x - baseSpread, bounds.bottom, 0, 1]),
    baseRight: surface([faceBox.x + baseSpread, bounds.bottom, 0, 1]),
  };
  const featureAnchors = Object.fromEntries(
    (Object.keys(defaults) as (keyof FeatureAnchors)[]).map((key) => [
      key,
      overrides.anchors?.[key] ? surface(overrides.anchors[key]!) : defaults[key],
    ]),
  ) as unknown as FeatureAnchors;
  const flankWidth = Math.min(18, Math.max(10, (bounds.right - bounds.left) * 0.22));
  const flankHeight = Math.min(30, Math.max(18, (bounds.bottom - bounds.top) * 0.38));
  const leftX = Math.max(bounds.left + flankWidth / 2 + 3, faceBox.x - faceBox.width / 2 - 5);
  const rightX = Math.min(bounds.right - flankWidth / 2 - 3, faceBox.x + faceBox.width / 2 + 5);
  const flankY = Math.min(bounds.bottom - flankHeight / 2 - 4, faceBox.y + 7);
  const bellyWidth = Math.min(44, Math.max(20, (bounds.right - bounds.left) * 0.55));
  const bellyHeight = Math.min(20, Math.max(12, (bounds.bottom - bounds.top) * 0.22));
  const defaultZones = {
    left: zone([leftX, flankY, flankWidth, flankHeight, -4]),
    right: zone([rightX, flankY, flankWidth, flankHeight, 4]),
    belly: zone([
      (bounds.left + bounds.right) / 2,
      bounds.bottom - bellyHeight / 2 - 3,
      bellyWidth,
      bellyHeight,
      0,
    ]),
  };
  const patternZones: PatternZones = {
    left: overrides.zones?.left ? zone(overrides.zones.left) : defaultZones.left,
    right: overrides.zones?.right ? zone(overrides.zones.right) : defaultZones.right,
    belly: overrides.zones?.belly ? zone(overrides.zones.belly) : defaultZones.belly,
    faceExclusion: {
      x: faceBox.x,
      y: faceBox.y,
      width: faceBox.width + 4,
      height: faceBox.height + 4,
    },
  };

  return {
    id,
    label,
    topology,
    faceBox,
    bounds,
    featureAnchors,
    patternZones,
    colorRole,
    bodyTilt,
    naturalFeatures,
    naturalPatterns,
  };
}

/** Canonical 5×10 order and exhaustive metadata source for the Oddlings schema. */
const bodyDefinitions = [
  defineBody('pebble', 'Pebble', 'single rounded stone', [49, 50, 38, 34], [19, 84, 20, 80], 'primary', gentleFeatures, softPatterns),
  defineBody('crown', 'Crown', 'three-point crown crest', [50, 56, 36, 30], [10, 88, 18, 82], 'accent', baseFeatures, graphicPatterns, 0.3),
  defineBody('glider', 'Glider', 'swept delta wing', [50, 44, 28, 24], [15, 76, 7, 93], 'secondary', sideFeatures, quietPatterns, -0.5, {
    anchors: {
      left: [10, 56, -0.9, 0.15],
      right: [90, 56, 0.9, 0.15],
      baseLeft: [38, 69, -0.3, 0.95],
      baseRight: [62, 69, 0.3, 0.95],
    },
    zones: { left: [29, 45, 12, 8, -26], right: [71, 45, 12, 8, 26], belly: [50, 68, 22, 10, 0] },
  }),
  defineBody('bean', 'Bean', 'kidney bean curve', [47, 50, 36, 34], [17, 86, 20, 78], 'secondary', gentleFeatures, painterlyPatterns, -1),
  defineBody('loop', 'Loop', 'hollow oval ring', [50, 24, 30, 20], [12, 88, 16, 84], 'primary', quietFeatures, quietPatterns, 0, {
    anchors: { top: [50, 12, 0, -1], left: [25, 24, -0.8, -0.6], right: [75, 24, 0.8, -0.6], baseLeft: [34, 86, 0, 1], baseRight: [66, 86, 0, 1] },
    zones: { left: [25, 55, 12, 24, -8], right: [75, 55, 12, 24, 8], belly: [50, 78, 28, 12, 0] },
  }),
  defineBody('starlet', 'Starlet', 'five soft star points', [50, 52, 32, 28], [9, 90, 10, 90], 'accent', quietFeatures, graphicPatterns, 0.4, {
    anchors: { baseLeft: [37, 66, -0.35, 0.94], baseRight: [63, 66, 0.35, 0.94] },
    zones: { belly: [50, 81, 28, 12, 0] },
  }),
  defineBody('bell', 'Bell', 'flared bell skirt', [50, 49, 36, 32], [14, 87, 20, 80], 'primary', topFeatures, softPatterns, 0.5),
  defineBody('bowtie', 'Bowtie', 'paired pinched side lobes', [50, 52, 28, 28], [24, 80, 8, 92], 'secondary', quietFeatures, graphicPatterns, 0, {
    anchors: { top: [50, 35, 0, -1], baseLeft: [28, 74, -0.2, 0.98], baseRight: [72, 74, 0.2, 0.98] },
  }),
  defineBody('sprout', 'Sprout', 'upright seedling drop', [50, 57, 36, 30], [2, 88, 25, 75], 'accent', topFeatures, painterlyPatterns, 1, {
    anchors: { top: [50, 20, 0, -1] },
    zones: { left: [33.5, 64, 11, 21, -4], right: [66.5, 64, 11, 21, 4], belly: [50, 79, 27.5, 12, 0] },
  }),
  defineBody('tripod', 'Tripod', 'three grounded legs', [50, 47, 34, 29], [16, 91, 16, 84], 'primary', topFeatures, quietPatterns),

  defineBody('puddle', 'Puddle', 'low spreading pool', [51, 54, 40, 28], [29, 84, 15, 86], 'secondary', sideFeatures, painterlyPatterns, -0.5),
  defineBody('flame', 'Flame', 'curling flame tip', [49, 55, 32, 31], [7, 91, 17, 80], 'accent', quietFeatures, graphicPatterns, 0.8, {
    anchors: { top: [52, 7, 0.25, -0.97], baseLeft: [39, 85, -0.25, 0.97], baseRight: [61, 84, 0.25, 0.97] },
  }),
  defineBody('pillow', 'Pillow', 'pinched rounded cushion', [50, 51, 38, 34], [17, 86, 15, 85], 'secondary', gentleFeatures, softPatterns),
  defineBody('notch', 'Notch', 'deep side bite', [45, 51, 34, 32], [16, 87, 17, 79], 'accent', sideFeatures, painterlyPatterns, -1.2),
  defineBody('flower', 'Flower', 'five petal rosette', [50, 51, 32, 28], [10, 90, 10, 90], 'accent', quietFeatures, quietPatterns, 0.4),
  defineBody('monolith', 'Monolith', 'tall stone slab', [50, 44, 36, 36], [8, 91, 31, 69], 'primary', topFeatures, graphicPatterns, 0, {
    anchors: { top: [50, 11, -0.12, -0.99], left: [32, 44, -1, 0], right: [68, 44, 1, 0], baseLeft: [41, 89, -0.1, 0.99], baseRight: [59, 89, 0.1, 0.99] },
    zones: { left: [37, 73, 8, 12, -4], right: [63, 73, 8, 12, 4], belly: [50, 82, 20, 7, 0] },
  }),
  defineBody('caterpillar', 'Caterpillar', 'four linked lobes', [61, 51, 28, 28], [25, 79, 5, 96], 'secondary', baseFeatures, painterlyPatterns, -0.3),
  defineBody('heart', 'Heart', 'cleft heart lobes', [50, 50, 34, 28], [15, 89, 13, 87], 'accent', quietFeatures, softPatterns, 0.4, {
    anchors: { top: [37, 16, -0.25, -0.97], baseLeft: [39, 74, -0.4, 0.92], baseRight: [61, 74, 0.4, 0.92] },
  }),
  defineBody('totem', 'Totem', 'stacked double body', [50, 46, 33, 30], [12, 89, 21, 78], 'primary', topFeatures, graphicPatterns, 0.8),
  defineBody('bridge', 'Bridge', 'wide hollow bridge', [50, 34, 46, 26], [22, 86, 8, 92], 'primary', sideFeatures, quietPatterns, 0, {
    anchors: { top: [50, 22, 0, -1], left: [20, 35, -0.9, -0.4], right: [80, 35, 0.9, -0.4], baseLeft: [20, 84, 0, 1], baseRight: [80, 84, 0, 1] },
    zones: { left: [23, 55, 15, 23, -4], right: [77, 55, 15, 23, 4], belly: [50, 38, 36, 12, 0] },
  }),

  defineBody('lean', 'Lean', 'slanted tower', [54, 51, 34, 32], [14, 88, 20, 85], 'primary', sideFeatures, graphicPatterns, -2.2),
  defineBody('clover', 'Clover', 'four leaf lobes', [50, 52, 31, 29], [9, 91, 9, 91], 'secondary', quietFeatures, softPatterns, 0, {
    anchors: { baseLeft: [37, 76, -0.4, 0.92], baseRight: [63, 76, 0.4, 0.92] },
  }),
  defineBody('shield', 'Shield', 'pointed heraldic shield', [50, 46, 35, 31], [10, 92, 18, 82], 'primary', topFeatures, graphicPatterns, 0.2, {
    anchors: { baseLeft: [38, 78, -0.35, 0.94], baseRight: [62, 78, 0.35, 0.94] },
  }),
  defineBody('worm', 'Worm', 'curved tubular sweep', [35, 37, 27, 24], [17, 94, 10, 90], 'accent', quietFeatures, quietPatterns, -0.8, {
    anchors: { top: [35, 17, 0, -1], left: [18, 38, -1, 0], right: [88, 64, 1, 0], baseLeft: [53, 81, 0, 1], baseRight: [74, 86, 0, 1] },
    zones: { left: [25, 55, 11, 20, -15], right: [70, 70, 15, 18, 12], belly: [58, 76, 24, 12, 8] },
  }),
  defineBody('lantern', 'Lantern', 'handled lantern chamber', [50, 57, 34, 31], [7, 91, 23, 77], 'primary', quietFeatures, graphicPatterns),
  defineBody('mitten', 'Mitten', 'thumbed mitten', [50, 48, 33, 31], [11, 91, 18, 84], 'secondary', topFeatures, softPatterns, -0.5),
  defineBody('hourglass', 'Hourglass', 'pinched hourglass waist', [50, 26, 34, 24], [9, 91, 20, 80], 'accent', quietFeatures, graphicPatterns),
  defineBody('kite', 'Kite', 'diamond with split tail', [50, 43, 31, 27], [7, 92, 15, 85], 'primary', quietFeatures, quietPatterns, 0.5, {
    anchors: { baseLeft: [34, 62, -0.7, 0.7], baseRight: [66, 62, 0.7, 0.7] },
  }),
  defineBody('cloudlet', 'Cloudlet', 'scalloped cloud bank', [51, 55, 40, 28], [22, 82, 6, 94], 'secondary', sideFeatures, softPatterns),
  defineBody('split-tail', 'Split tail', 'forked lower tails', [50, 47, 34, 29], [14, 92, 18, 82], 'accent', topFeatures, painterlyPatterns, 0.5),

  defineBody('droplet', 'Droplet', 'single pointed teardrop', [50, 56, 32, 31], [6, 91, 20, 80], 'secondary', quietFeatures, painterlyPatterns, 0.4, {
    anchors: { baseLeft: [38, 80, -0.3, 0.95], baseRight: [62, 80, 0.3, 0.95] },
  }),
  defineBody('satellite', 'Satellite', 'central pod with four panels', [50, 50, 29, 27], [13, 87, 6, 94], 'primary', quietFeatures, graphicPatterns, 0, {
    anchors: { top: [50, 31, 0, -1], left: [32, 50, -1, 0], right: [68, 50, 1, 0], baseLeft: [42, 68, -0.1, 1], baseRight: [58, 68, 0.1, 1] },
  }),
  defineBody('arch', 'Arch', 'tall hollow arch', [50, 20, 30, 20], [8, 91, 19, 81], 'accent', topFeatures, quietPatterns, 0, {
    anchors: { top: [50, 8, 0, -1], left: [30, 20, -0.7, -0.7], right: [70, 20, 0.7, -0.7], baseLeft: [28, 89, 0, 1], baseRight: [72, 89, 0, 1] },
    zones: { left: [29, 55, 12, 28, -2], right: [71, 55, 12, 28, 2], belly: [50, 31, 26, 11, 0] },
  }),
  defineBody('prickle', 'Prickle', 'many-pointed oval', [50, 52, 33, 29], [7, 93, 6, 94], 'accent', quietFeatures, quietPatterns, 0.3),
  defineBody('vase', 'Vase', 'narrow neck and broad bowl', [50, 57, 33, 31], [8, 91, 21, 79], 'primary', topFeatures, graphicPatterns),
  defineBody('comma', 'Comma', 'round head with curling tail', [44, 42, 31, 27], [11, 92, 12, 88], 'secondary', quietFeatures, painterlyPatterns, -0.8, {
    anchors: { top: [43, 12, 0, -1], right: [75, 47, 1, 0], baseLeft: [52, 82, 0, 1], baseRight: [72, 89, 0.4, 0.9] },
  }),
  defineBody('scallop', 'Scallop', 'ribbed shell fan', [50, 56, 34, 29], [13, 89, 13, 87], 'accent', quietFeatures, graphicPatterns),
  defineBody('elbow', 'Elbow', 'rounded right-angle body', [41, 45, 32, 30], [13, 88, 16, 87], 'primary', sideFeatures, quietPatterns, -0.5, {
    anchors: { top: [41, 15, 0, -1], left: [28, 45, -1, 0], right: [83, 74, 1, 0], baseLeft: [59, 88, 0, 1], baseRight: [75, 88, 0, 1] },
    zones: { left: [40, 33, 16, 20, 0], right: [68, 74, 20, 16, 0], belly: [62, 76, 22, 13, 0] },
  }),
  defineBody('gourd', 'Gourd', 'two vertical bulbs', [50, 55, 33, 29], [8, 92, 22, 78], 'secondary', topFeatures, softPatterns),
  defineBody('pinwheel', 'Pinwheel', 'four curled radial arms', [50, 50, 28, 26], [7, 93, 7, 93], 'accent', quietFeatures, graphicPatterns, 0.8, {
    anchors: { top: [68, 19, 0.45, -0.89], baseLeft: [31, 80, -0.45, 0.89], baseRight: [61, 74, 0.45, 0.89] },
  }),

  defineBody('saddle', 'Saddle', 'concave saddle top', [50, 60, 36, 28], [19, 82, 12, 88], 'primary', sideFeatures, quietPatterns, 0, {
    anchors: { top: [30, 20, -0.3, -0.95] },
  }),
  defineBody('tulip', 'Tulip', 'three-lobed bloom on stem', [50, 39, 31, 24], [8, 92, 21, 79], 'accent', quietFeatures, softPatterns, 0.4),
  defineBody('wedge', 'Wedge', 'asymmetric triangular wedge', [49, 58, 36, 30], [10, 89, 10, 90], 'secondary', sideFeatures, graphicPatterns, -0.7, {
    anchors: { top: [46, 10, -0.1, -1], left: [21, 50, -0.88, -0.47], right: [75, 48, 0.85, -0.53], baseLeft: [33, 88, -0.1, 1], baseRight: [67, 88, 0.1, 1] },
  }),
  defineBody('shell', 'Shell', 'spiral shell with foot', [47, 63, 30, 22], [14, 86, 10, 92], 'primary', quietFeatures, painterlyPatterns, 0, {
    anchors: { baseLeft: [50, 82, -0.1, 1], baseRight: [70, 82, 0.1, 1] },
  }),
  defineBody('fork', 'Fork', 'three-pronged stem', [50, 55, 29, 27], [7, 92, 22, 78], 'accent', quietFeatures, graphicPatterns),
  defineBody('canopy', 'Canopy', 'broad cap and narrow trunk', [50, 39, 38, 25], [14, 91, 8, 92], 'secondary', quietFeatures, softPatterns, 0, {
    anchors: { baseLeft: [43, 89, -0.1, 1], baseRight: [57, 89, 0.1, 1] },
  }),
  defineBody('zigzag', 'Zigzag', 'thick lightning zigzag', [50, 46, 30, 26], [5, 95, 27, 75], 'accent', quietFeatures, quietPatterns, -1, {
    anchors: { top: [55, 8, 0.1, -0.99], left: [29, 47, -1, 0], right: [71, 51, 1, 0], baseLeft: [42, 89, -0.3, 0.95], baseRight: [53, 90, 0.3, 0.95] },
    zones: { left: [47, 28, 12, 15, -58], right: [54, 66, 12, 15, -66], belly: [53, 64, 20, 11, -66] },
  }),
  defineBody('fan', 'Fan', 'open radial fan', [50, 58, 34, 28], [10, 90, 8, 94], 'primary', quietFeatures, graphicPatterns, 0, {
    anchors: { top: [57, 13, 0.1, -1], baseLeft: [38, 77, -0.4, 0.92], baseRight: [62, 77, 0.4, 0.92] },
  }),
  defineBody('stack', 'Stack', 'three offset tiers', [50, 48, 31, 29], [8, 92, 20, 81], 'secondary', sideFeatures, quietPatterns, 0.6),
  defineBody('prism', 'Prism', 'faceted crystal prism', [50, 51, 32, 29], [7, 92, 17, 83], 'primary', quietFeatures, graphicPatterns, 0, {
    anchors: { baseLeft: [34, 81, -0.35, 0.94], baseRight: [66, 81, 0.35, 0.94] },
  }),
] as const satisfies readonly BodyDefinition[];

type BodyShapeName = (typeof bodyDefinitions)[number]['id'];

function orderedBodyShapeIds<const TDefinitions extends readonly BodyDefinition[]>(
  definitions: TDefinitions,
): { readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'] } {
  return definitions.map((definition) => definition.id) as {
    readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'];
  };
}

export const bodyShapeNames = orderedBodyShapeIds(bodyDefinitions);

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
  bodyShape: {
    type: 'select',
    default: 'pebble',
    options: bodyShapeNames,
  },
  eyeArrangement: {
    type: 'select',
    default: 'pair',
    options: ['pair', 'offset', 'cyclops', 'trio', 'stacked', 'wide', 'wink'],
  },
  mouthStyle: {
    type: 'select',
    default: 'smile',
    options: ['smile', 'crooked', 'quiet', 'open', 'toothy', 'ooh'],
  },
  feature: {
    type: 'select',
    default: 'tuft',
    options: ['none', 'antenna', 'horn', 'odd-ears', 'tuft', 'side-fin', 'feet'],
  },
  pattern: {
    type: 'select',
    default: 'belly',
    options: ['plain', 'belly', 'dapple', 'swoop', 'blush', 'patch'],
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'bodyShape' as const;

export type OddlingsParams = ParamsFromSchema<typeof schema>;

const bodyById = Object.fromEntries(
  bodyDefinitions.map((definition) => [definition.id, definition]),
) as Record<BodyShapeName, BodyDefinition<BodyShapeName>>;

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Oddlings ${param}: ${String(value)}`);
}

function resolveOddlingArt(
  definition: BodyDefinition,
  variation: ArtVariation,
): OddlingArt {
  return {
    faceTilt: definition.bodyTilt + variation.number('face-tilt', -1.2, 1.2),
    eyeSkew: variation.number('eye-skew', -0.85, 0.85),
    leftEyeScale: variation.number('left-eye-scale', 0.94, 1.06),
    rightEyeScale: variation.number('right-eye-scale', 0.94, 1.06),
    gazeX: variation.number('gaze-x', -0.8, 0.8),
    gazeY: variation.number('gaze-y', -0.45, 0.65),
    mouthShiftX: variation.number('mouth-x', -0.8, 0.8),
    mouthShiftY: variation.number('mouth-y', -0.5, 0.6),
    mouthScale: variation.number('mouth-scale', 0.93, 1.08),
    patternShiftX: variation.number('pattern-x', -0.55, 0.55),
    patternShiftY: variation.number('pattern-y', -0.4, 0.45),
    patternTilt: variation.number('pattern-tilt', -2.2, 2.2),
    patternScale: variation.number('pattern-scale', 0.97, 1.03),
    patternOnLeft: variation.bool('pattern-side'),
    patternRhythm: variation.number('pattern-rhythm', -0.55, 0.55),
    featureOnLeft: variation.bool('feature-side'),
  };
}

function renderBody(
  shape: BodyShapeName,
  color: string,
  detail: string,
): string {
  switch (shape) {
    case 'pebble':
      return `<path d="M49 20C68 18 82 32 80 52C79 72 67 83 48 84C29 84 18 72 20 54C21 35 31 22 49 20Z" fill="${color}"/>`;
    case 'crown':
      return `<path d="M22 83Q16 66 22 46L18 19L35 32L50 10L65 32L82 18L78 46Q85 65 77 82Q51 90 22 83Z" fill="${color}"/>`;
    case 'glider':
      // Rounded swept delta (paper-glider planform): soft nose up top, broad
      // leading edges to wingtips, a gentle W trailing edge, and detail-tone
      // fold creases from the nose along each wing, clear of the face.
      return `<path d="M50 13Q55 18 61 25Q75 39 89 53Q94 58 89 61Q78 63 67 66Q59 70 53 74Q50 77 47 74Q41 70 33 66Q22 63 11 61Q6 58 11 53Q25 39 39 25Q45 18 50 13Z" fill="${color}"/><path d="M48 19Q36 36 26 55M52 19Q64 36 74 55" fill="none" stroke="${detail}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'bean':
      return `<path d="M57 18C74 22 82 39 74 53C69 62 72 75 60 82C43 91 22 79 20 59C18 40 34 13 57 18Z" fill="${color}"/>`;
    case 'loop':
      return `<path d="M50 12C75 12 84 30 84 51C84 75 70 88 50 88C30 88 16 75 16 51C16 30 25 12 50 12ZM50 34C40 34 36 42 36 52C36 62 41 68 50 68C59 68 64 62 64 52C64 42 60 34 50 34Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'starlet':
      return `<path d="M50 9L61 32L86 23L75 47L90 68L64 66L50 90L36 66L10 68L25 47L14 23L39 32Z" fill="${color}" stroke="${detail}" stroke-width="1.1" stroke-linejoin="round"/>`;
    case 'bell':
      return `<path d="M46 15C61 13 68 24 68 36C68 45 78 54 80 68C82 81 69 87 49 87C29 87 18 80 20 67C22 54 31 47 31 35C31 24 36 17 46 15Z" fill="${color}"/>`;
    case 'bowtie':
      return `<path d="M47 36C35 24 15 23 8 38Q19 51 8 66C19 79 37 77 48 66Q50 62 52 66C63 77 81 79 92 66Q81 51 92 38C85 23 65 24 53 36Q50 40 47 36Z" fill="${color}"/>`;
    case 'sprout':
      return `<path d="M50 35Q49 28 50 21" fill="none" stroke="${color}" stroke-width="3.6" stroke-linecap="round"/><path d="M50 26C43 28 33 25 28 15C36 10 47 14 51 22Z" fill="${color}"/><path d="M50 22C56 19 66 15 70 5C61 2 51 9 49 19Z" fill="${color}"/><path d="M50 33C64 33 75 45 75 61C75 77 64 88 50 88C36 88 25 77 25 61C25 45 36 33 50 33Z" fill="${color}"/><path d="M36 17Q43 19 48 22M63 9Q56 13 52 17" fill="none" stroke="${detail}" stroke-width="1.2" stroke-linecap="round"/>`;
    case 'tripod':
      return `<path d="M31 20Q50 10 69 20Q82 35 74 60L84 86Q73 93 61 76L50 91L39 76Q27 93 16 86L26 60Q18 35 31 20Z" fill="${color}"/>`;
    case 'puddle':
      return `<path d="M23 39C32 29 49 28 61 33C70 36 80 37 84 49C90 67 73 81 51 82C29 84 13 72 15 57C16 49 19 44 23 39Z" fill="${color}"/>`;
    case 'flame':
      return `<path d="M52 7Q72 26 63 43Q78 35 79 58Q81 82 58 90Q35 93 21 73Q10 52 31 35Q32 52 44 53Q36 31 52 7Z" fill="${color}"/>`;
    case 'pillow':
      return `<path d="M27 18Q50 24 73 18Q80 21 78 35Q73 50 82 66Q85 80 73 85Q50 79 27 86Q15 82 18 67Q26 50 19 34Q16 21 27 18Z" fill="${color}"/>`;
    case 'notch':
      return `<path d="M31 18C48 13 69 18 77 31C80 37 76 43 68 46C76 50 80 57 79 65C77 80 62 88 44 87C26 86 16 76 17 59C18 43 22 25 31 18Z" fill="${color}"/>`;
    case 'flower':
      return `<g fill="${color}"><ellipse cx="50" cy="25" rx="15" ry="17"/><ellipse cx="73" cy="42" rx="17" ry="15" transform="rotate(35 73 42)"/><ellipse cx="64" cy="70" rx="16" ry="19" transform="rotate(-25 64 70)"/><ellipse cx="36" cy="70" rx="16" ry="19" transform="rotate(25 36 70)"/><ellipse cx="27" cy="42" rx="17" ry="15" transform="rotate(-35 27 42)"/><circle cx="50" cy="51" r="23"/></g>`;
    case 'monolith':
      return `<path d="M35 14L63 9L67 15L69 74Q69 86 58 89Q50 91.5 42 89Q31 86 31 74L33 18Z" fill="${color}"/><path d="M41 15L45.5 22L42.5 29L46 34" fill="none" stroke="${detail}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M37 68H63" fill="none" stroke="${detail}" stroke-width="1.4" stroke-linecap="round"/><path d="M42 74L46 78.5L50 74L54 78.5L58 74" fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36.5" cy="24" r="1.4" fill="${detail}"/><circle cx="63.5" cy="62" r="1.2" fill="${detail}"/>`;
    case 'caterpillar':
      // Stub feet first so the lobes cover their tops, then tail-to-head lobes
      // (head last so it overlaps), then creases where each segment tucks in.
      return `<g fill="none" stroke="${detail}" stroke-width="3.2" stroke-linecap="round"><path d="M57 66.5L56 74.5"/><path d="M74 65.5L75.5 73"/><path d="M37 64L35.8 72"/><path d="M51 64L50.4 72"/><path d="M23 63.5L22 71"/><path d="M33 63.5L32.6 70.6"/><path d="M14 61.5L13 68"/></g><g fill="${color}"><circle cx="15" cy="58" r="8.5"/><circle cx="28" cy="55" r="13.5"/><circle cx="45" cy="52" r="17"/><circle cx="66" cy="50" r="22"/></g><g fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"><path d="M49.4 35.5Q37.2 52.7 52.4 67.3"/><path d="M31.3 41.9Q23.1 55.8 35.6 66.1"/><path d="M15.5 50Q12.2 59.8 20.4 66.2"/></g>`;
    case 'heart':
      return `<path d="M50 89Q10 62 14 35Q17 14 37 16Q49 18 50 31Q51 18 63 16Q83 14 86 35Q90 62 50 89Z" fill="${color}"/>`;
    case 'totem':
      return `<path d="M42 14C55 10 68 17 69 29C70 37 66 42 62 46C73 49 79 57 78 69C76 84 62 89 48 87C34 90 22 81 22 68C21 56 28 49 38 45C33 39 31 31 34 23C35 18 38 15 42 14Z" fill="${color}"/><ellipse cx="50" cy="47" rx="17" ry="14" fill="${color}"/>`;
    case 'bridge':
      return `<path d="M8 84V60Q10 24 50 22Q90 24 92 60V84H70V64Q69 49 50 48Q31 49 30 64V84Z" fill="${color}" fill-rule="evenodd"/><path d="M23 45Q27 34 38 30M77 45Q73 34 62 30M19 62L19 73M81 62L81 73" fill="none" stroke="${detail}" stroke-width="1.4" stroke-linecap="round"/>`;
    case 'lean':
      return `<path d="M35 21C50 12 72 18 77 33L84 62C87 75 72 87 52 88C34 89 20 79 23 64L29 36C30 29 32 24 35 21Z" fill="${color}"/>`;
    case 'clover':
      return `<g fill="${color}"><circle cx="50" cy="27" r="19"/><circle cx="73" cy="50" r="19"/><circle cx="50" cy="73" r="19"/><circle cx="27" cy="50" r="19"/><circle cx="50" cy="50" r="23"/></g>`;
    case 'shield':
      return `<path d="M18 18Q50 8 82 18L78 57Q73 78 50 92Q27 78 22 57Z" fill="${color}"/>`;
    case 'worm':
      return `<path d="M35 17Q18 17 12 34Q5 52 20 65Q32 75 48 68Q60 63 69 72Q74 77 69 84Q64 91 72 94Q85 91 89 81Q93 67 80 58Q66 46 48 55Q36 62 29 55Q20 47 25 37Q29 29 40 31Q51 33 52 23Q49 17 35 17Z" fill="${color}"/>`;
    case 'lantern':
      return `<path d="M35 24Q34 7 50 7Q66 7 65 24H58Q58 15 50 15Q42 15 42 24ZM27 25Q50 18 73 25L77 77Q69 91 50 91Q31 91 23 77Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'mitten':
      return `<path d="M38 12Q47 8 51 20Q54 7 62 12Q68 17 64 35Q74 24 81 32Q88 44 72 58L73 79Q64 92 43 90Q25 88 22 72L18 47Q18 35 29 36Q34 37 38 43Z" fill="${color}"/>`;
    case 'hourglass':
      return `<path d="M22 9H78Q80 29 62 43Q55 49 62 57Q80 71 78 91H22Q20 71 38 57Q45 49 38 43Q20 29 22 9Z" fill="${color}"/>`;
    case 'kite':
      return `<path d="M50 7L85 43L50 78L15 43Z" fill="${color}"/><path d="M50 76Q38 82 50 86Q62 90 50 92" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
    case 'cloudlet':
      return `<path d="M13 72Q6 54 21 45Q20 25 40 28Q49 15 63 28Q83 24 82 44Q94 53 88 70Q73 83 51 80Q29 84 13 72Z" fill="${color}"/>`;
    case 'split-tail':
      return `<path d="M29 18Q50 9 71 18Q83 35 76 59L82 91L59 77L50 92L41 77L18 91L24 59Q17 35 29 18Z" fill="${color}"/>`;
    case 'droplet':
      return `<path d="M50 6Q79 39 80 61Q81 89 50 92Q19 89 20 61Q21 39 50 6Z" fill="${color}"/>`;
    case 'satellite':
      return `<g fill="${color}"><rect x="32" y="31" width="36" height="38" rx="16"/><path d="M35 39L13 20Q6 25 12 35L32 50ZM65 39L87 20Q94 25 88 35L68 50ZM35 61L13 80Q6 75 12 65L32 50ZM65 61L87 80Q94 75 88 65L68 50Z"/></g>`;
    case 'arch':
      return `<path d="M19 91V43Q19 9 50 8Q81 9 81 43V91H62V45Q62 31 50 29Q38 31 38 45V91Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'prickle':
      return `<path d="M50 7L58 21L70 10L72 27L88 20L82 38L94 45L81 54L90 68L73 68L70 88L57 77L50 93L42 77L29 89L27 69L10 68L19 54L6 45L18 38L12 20L28 27L30 10L42 21Z" fill="${color}"/>`;
    case 'vase':
      return `<path d="M34 8H66L62 29Q79 43 78 67Q77 90 50 91Q23 90 22 67Q21 43 38 29Z" fill="${color}"/>`;
    case 'comma':
      return `<path d="M44 11Q73 10 77 37Q80 60 60 68Q48 73 52 83Q56 91 72 88Q62 94 48 90Q33 83 36 68Q13 63 12 39Q12 13 44 11Z" fill="${color}"/>`;
    case 'scallop':
      return `<path d="M13 65Q12 37 27 20Q35 10 42 28Q49 7 56 28Q65 9 73 22Q88 40 87 65L73 88H27Z" fill="${color}"/><path d="M28 79Q30 62 37 48M72 79Q70 62 63 48" fill="none" stroke="${detail}" stroke-width="1.35" stroke-linecap="round"/>`;
    case 'elbow':
      // A soft bent tube: fat stroked centerline with round caps, rim echoes at
      // both openings, and a small seam hugging the inner corner of the bend.
      return `<path d="M40 27.5V52Q40 74 64 74H78" fill="none" stroke="${color}" stroke-width="24" stroke-linecap="round"/><g fill="none" stroke="${detail}" stroke-width="2" stroke-linecap="round"><path d="M32.5 28.5Q40 32 47.5 28.5"/><path d="M73.5 68.5Q76 74 73.5 78.5"/><path d="M41 64Q44.5 70.5 52.5 72.5"/></g>`;
    case 'gourd':
      return `<path d="M42 9Q50 4 58 9L57 25Q75 30 76 47Q77 60 66 66Q78 72 73 84Q67 92 50 91Q33 92 27 84Q22 72 34 66Q23 60 24 47Q25 30 43 25Z" fill="${color}"/>`;
    case 'pinwheel':
      return `<path d="M50 43Q33 17 11 24Q23 39 42 49Q16 67 24 89Q39 77 49 58Q67 84 89 76Q77 61 58 51Q84 33 76 11Q61 23 50 43Z" fill="${color}"/><circle cx="50" cy="50" r="15" fill="${color}"/>`;
    case 'saddle':
      return `<path d="M17 46C12 28 24 18 36 22C44 25 43 37 50 37C57 37 62 24 68 20C76 17 90 30 84 48C90 62 78 72 66 76Q50 84 34 76C22 72 10 62 17 46Z" fill="${color}"/><path d="M35 39Q50 49 65 39" fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'tulip':
      return `<path d="M22 10L42 25L50 8L58 25L78 10L75 39Q68 56 57 59L60 91H40L43 59Q32 56 25 39Z" fill="${color}"/>`;
    case 'wedge':
      return `<path d="M41 13Q46 5 53 14Q77 50 87 71Q93 82 81 86Q50 92 19 86Q7 82 13 70Q23 38 41 13Z" fill="${color}"/><path d="M21 78Q50 84.5 79 77" fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"/><circle cx="33" cy="34" r="1.6" fill="${detail}"/><circle cx="60" cy="29" r="1.3" fill="${detail}"/>`;
    case 'shell':
      return `<path d="M12 67Q11 32 43 17Q75 7 84 36Q92 58 73 73Q85 74 90 84H42Q17 86 12 67Z" fill="${color}"/><path d="M70 53Q78 40 66 29Q54 18 40 25Q27 32 30 45Q32 53 40 56" fill="none" stroke="${detail}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'fork':
      return `<path d="M22 8H39V35H43V8H57V35H61V8H78V43Q75 57 62 61L64 92H36L38 61Q25 57 22 43Z" fill="${color}"/>`;
    case 'canopy':
      return `<path d="M8 49Q16 15 50 14Q84 15 92 49Q72 56 58 51L62 91H38L42 51Q28 56 8 49Z" fill="${color}"/>`;
    case 'zigzag':
      return `<path d="M59.3 2.2L65.2 13.9L54.2 40L72.7 43.6L69.4 54.5L55.4 91.5L43.5 94.5L36.6 84.5L44.8 58.2L25.8 56L46.8 6.1Z" fill="${color}" stroke="${detail}" stroke-width="1.4" stroke-linejoin="round"/>`;
    case 'fan':
      return `<path d="M50 90L10 54Q8 30 25 26Q29 9 46 22Q57 5 66 24Q85 13 87 35Q94 49 84 63Z" fill="${color}"/><path d="M24 31Q31 45 37 55M45 25Q47 36 48 43M66 28Q62 38 59 45M83 41Q74 50 67 58" fill="none" stroke="${detail}" stroke-width="1.3" stroke-linecap="round"/>`;
    case 'stack':
      return `<path d="M29 8H68Q75 11 72 28L78 31Q84 42 76 56L81 61Q84 78 72 90H32Q20 78 23 61L28 56Q20 42 26 31L31 28Q26 11 29 8Z" fill="${color}"/><path d="M28 32Q50 38 72 31M25 59Q50 65 78 58" fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'prism':
      return `<path d="M50 7L83 29L77 77L50 92L23 77L17 29Z" fill="${color}"/><path d="M50 7V30M50 72V92M17 29L34 38M66 38L83 29M23 77L34 66M66 66L77 77" fill="none" stroke="${detail}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/>`;
    default:
      return invalidOption('bodyShape', shape);
  }
}

function resolveBodyPalette(definition: BodyDefinition, base: Palette): Palette {
  switch (definition.colorRole) {
    case 'primary':
      return base;
    case 'secondary':
      return { ...base, primary: base.secondary, secondary: base.primary };
    case 'accent':
      return { ...base, primary: base.accent, accent: base.primary };
  }
}

function anchorTransform(anchor: SurfaceAnchor): string {
  // Feature artwork is authored with local -Y pointing away from the body.
  const angle = Math.atan2(anchor.ny, anchor.nx) * 180 / Math.PI + 90;
  return `translate(${anchor.x} ${anchor.y}) rotate(${Math.round(angle * 1000) / 1000})`;
}

function renderFeature(
  feature: OddlingsParams['feature'],
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): FeatureLayers {
  const edge = (fill: string, amount = 0.38): string => (
    `stroke="${tonalEdge(fill, palette.ink, amount)}" stroke-width="1.4" stroke-linejoin="round"`
  );
  const stem = tonalEdge(palette.primary, palette.ink, 0.45);
  const at = (anchor: SurfaceAnchor, artwork: string): string => (
    `<g transform="${anchorTransform(anchor)}">${artwork}</g>`
  );
  const { top, left, right, baseLeft, baseRight } = definition.featureAnchors;

  switch (feature) {
    case 'none':
      return { behind: '', front: '' };
    case 'antenna':
      return {
        behind: at(top, `
          <path d="M-4 2Q-5 -6 -9 -10M4 2Q5 -7 9 -12" fill="none" stroke="${stem}" stroke-width="1.55" stroke-linecap="round"/>
          <circle cx="-9" cy="-10" r="3.2" fill="${palette.secondary}" ${edge(palette.secondary)}/>
          <circle cx="9" cy="-12" r="3.5" fill="${palette.accent}" ${edge(palette.accent)}/>
        `),
        front: '',
      };
    case 'horn': {
      const horn = `<path d="M-5 3Q-2 -7 3 -13Q8 -4 6 5Z" fill="${palette.accent}" ${edge(palette.accent, 0.42)}/>`;
      return {
        behind: at(top, art.featureOnLeft
          ? `<g transform="scale(-1 1)">${horn}</g>`
          : horn),
        front: '',
      };
    }
    case 'odd-ears':
      return {
        behind: [
          at(left, `<path d="M-5 3Q-8 -8 0 -14Q8 -7 5 4Z" fill="${palette.secondary}" ${edge(palette.secondary)}/><path d="M-2 0Q-3 -6 0 -9Q3 -5 2 1Z" fill="${palette.primary}"/>`),
          at(right, `<g transform="scale(0.84 0.84)"><path d="M-5 3Q-7 -7 1 -12Q8 -5 5 4Z" fill="${palette.accent}" ${edge(palette.accent)}/><path d="M-2 0Q-2 -5 1 -8Q4 -4 2 1Z" fill="${palette.primary}"/></g>`),
        ].join(''),
        front: '',
      };
    case 'tuft':
      return {
        behind: at(top, `
          <path d="M-10 4Q-12 -5 -5 -10Q0 -8 0 -2Q3 -12 10 -11Q13 -4 6 5Z" fill="${palette.secondary}" ${edge(palette.secondary)}/>
          <path d="M-1 1Q1 -7 6 -9Q7 -3 4 3Z" fill="${palette.accent}"/>
        `),
        front: '',
      };
    case 'side-fin': {
      const anchor = art.featureOnLeft ? left : right;
      return {
        behind: at(anchor, `<path d="M-5 4Q-10 -3 -4 -13Q6 -11 7 1Q4 6 -5 4Z" fill="${palette.accent}" ${edge(palette.accent, 0.42)}/>`),
        front: '',
      };
    }
    case 'feet':
      return {
        behind: [
          at(baseLeft, `<ellipse cx="0" cy="-3" rx="9" ry="4.8" fill="${palette.secondary}" ${edge(palette.secondary)} transform="rotate(-7 0 -3)"/>`),
          at(baseRight, `<ellipse cx="0" cy="-3" rx="8.5" ry="4.6" fill="${palette.accent}" ${edge(palette.accent)} transform="rotate(8 0 -3)"/>`),
        ].join(''),
        front: '',
      };
    default:
      return invalidOption('feature', feature);
  }
}

function placedZone(zoneValue: PatternZone, art: OddlingArt, weight = 1): PatternZone {
  return {
    x: zoneValue.x + art.patternShiftX * weight,
    y: zoneValue.y + art.patternShiftY * weight,
    width: zoneValue.width * art.patternScale,
    height: zoneValue.height * art.patternScale,
    angle: zoneValue.angle + art.patternTilt * 0.24 + art.patternRhythm * weight,
  };
}

function organicField(
  zoneValue: PatternZone,
  fill: string,
  art: OddlingArt,
  broad: boolean,
  direction: -1 | 1,
): string {
  const mark = placedZone(zoneValue, art, broad ? 0.35 : 0.55);
  const rx = mark.width * (broad ? 0.65 : 0.5);
  const ry = mark.height * (broad ? 0.63 : 0.5);
  const shoulder = broad ? 0.94 : 0.78;
  const inner = broad ? -0.5 : -0.3;
  const fieldX = (amount: number): number => mark.x + amount * rx * direction;
  return `<path d="M${fieldX(-0.45)} ${mark.y - ry * 0.9}C${fieldX(0.2)} ${mark.y - ry * 1.02} ${fieldX(shoulder)} ${mark.y - ry * 0.55} ${fieldX(1)} ${mark.y + ry * 0.08}C${fieldX(0.84)} ${mark.y + ry * 0.76} ${fieldX(0.14)} ${mark.y + ry} ${fieldX(-0.62)} ${mark.y + ry * 0.56}C${fieldX(inner)} ${mark.y + ry * 0.12} ${fieldX(-0.13)} ${mark.y - ry * 0.46} ${fieldX(-0.45)} ${mark.y - ry * 0.9}Z" fill="${fill}" transform="rotate(${mark.angle} ${mark.x} ${mark.y})"/>`;
}

function renderBellyPattern(
  zoneValue: PatternZone,
  fill: string,
  art: OddlingArt,
): string {
  const mark = placedZone(zoneValue, art, 0.25);
  const left = mark.x - mark.width / 2;
  const right = mark.x + mark.width / 2;
  const top = mark.y - mark.height / 2;
  const bottom = mark.y + mark.height / 2;
  const rhythm = art.patternRhythm * mark.height * 0.08;
  return `<path d="M${left} ${top + rhythm}Q${mark.x} ${top - mark.height * 0.28} ${right} ${top - rhythm}Q${right - mark.width * 0.04} ${bottom} ${mark.x} ${bottom}Q${left + mark.width * 0.04} ${bottom} ${left} ${top + rhythm}Z" fill="${fill}" transform="rotate(${mark.angle} ${mark.x} ${mark.y})"/>`;
}

function renderBlushPattern(
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): string {
  const box = definition.faceBox;
  const scale = Math.max(0.58, Math.min(1, box.width / 38, box.height / 32));
  const y = box.y + box.height * 0.25 + art.patternShiftY * 0.18;
  const gap = Math.min(box.width * 0.36, 14 * scale);
  const width = 6.4 * scale;
  const height = 4.4 * scale;
  const cheek = (x: number, direction: -1 | 1): string => (
    `<path d="M${x - width} ${y}Q${x - width * 0.25} ${y - height} ${x + width} ${y - height * 0.08}Q${x + width * 0.28} ${y + height} ${x - width} ${y}Z" fill="${palette.accent}" opacity="0.78" transform="rotate(${direction * 4 + art.patternTilt * 0.16} ${x} ${y})"/>`
  );
  return `${cheek(box.x - gap, -1)}${cheek(box.x + gap, 1)}`;
}

function renderPattern(
  pattern: OddlingsParams['pattern'],
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): string {
  const direction: -1 | 1 = art.patternOnLeft ? -1 : 1;
  const side = direction < 0 ? definition.patternZones.left : definition.patternZones.right;
  switch (pattern) {
    case 'plain':
      return '';
    case 'belly':
      return renderBellyPattern(definition.patternZones.belly, palette.secondary, art);
    case 'dapple':
      // Exactly one quiet, painterly flank whose irregular edge follows the body.
      return organicField(side, palette.secondary, art, false, direction);
    case 'swoop':
      // Exactly one broad colour wash; it never becomes a repeated surface motif.
      return organicField(side, palette.secondary, art, true, direction);
    case 'blush':
      return renderBlushPattern(definition, palette, art);
    case 'patch':
      return organicField(side, palette.accent, art, true, direction);
    default:
      return invalidOption('pattern', pattern);
  }
}

interface FaceMetrics {
  x: number;
  eyeY: number;
  mouthY: number;
  scale: number;
}

function faceMetrics(definition: BodyDefinition): FaceMetrics {
  const box = definition.faceBox;
  const scale = Math.max(0.56, Math.min(1, box.width / 38, box.height / 32));
  return {
    x: box.x,
    eyeY: box.y,
    mouthY: box.y + Math.min(box.height * 0.42, 15 * scale),
    scale,
  };
}

function outlinedEye(
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  palette: Palette,
  art: OddlingArt,
  pupilScale = 1,
): string {
  const outline = tonalEdge(palette.canvas, palette.ink, 0.4);
  const pupilRadius = Math.max(1.35, Math.min(radiusX, radiusY) * 0.4) * pupilScale;
  return `<ellipse cx="${x}" cy="${y}" rx="${radiusX}" ry="${radiusY}" fill="${palette.canvas}" stroke="${outline}" stroke-width="1.4"/><circle cx="${x + art.gazeX * 0.6}" cy="${y + art.gazeY * 0.55}" r="${pupilRadius}" fill="${palette.ink}"/>`;
}

function faceLine(path: string, palette: Palette): string {
  return `<path d="${path}" fill="none" stroke="${palette.ink}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function renderEyes(
  arrangement: OddlingsParams['eyeArrangement'],
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): string {
  const face = faceMetrics(definition);
  const { x, eyeY: y, scale } = face;
  const leftY = y - art.eyeSkew / 2;
  const rightY = y + art.eyeSkew / 2;
  const eye = (
    eyeX: number,
    eyeY: number,
    rx: number,
    ry: number,
    sideScale: number,
    pupilScale = 1,
  ): string => outlinedEye(
    eyeX,
    eyeY,
    rx * scale * sideScale,
    ry * scale * sideScale,
    palette,
    art,
    pupilScale,
  );

  switch (arrangement) {
    case 'pair':
      return `${eye(x - 10 * scale, leftY, 6, 7, art.leftEyeScale)}${eye(x + 10 * scale, rightY, 6, 7, art.rightEyeScale)}`;
    case 'offset':
      return `${eye(x - 9 * scale, y - 2 * scale + art.eyeSkew * 0.3, 7, 8, art.leftEyeScale)}${eye(x + 11 * scale, y + 3 * scale + art.eyeSkew * 0.3, 5, 6, art.rightEyeScale, 0.9)}`;
    case 'cyclops':
      return eye(x + scale, y, 9, 10, (art.leftEyeScale + art.rightEyeScale) / 2, 1.08);
    case 'trio':
      return `${eye(x - 9 * scale, y + 3 * scale - art.eyeSkew / 2, 5, 5.5, art.leftEyeScale, 0.88)}${eye(x + 9 * scale, y + 3 * scale + art.eyeSkew / 2, 5, 5.5, art.rightEyeScale, 0.88)}${eye(x + scale, y - 8 * scale, 5, 5.5, 1, 0.88)}`;
    case 'stacked':
      return `${eye(x - 3 * scale, y - 7 * scale, 5.5, 6, art.leftEyeScale)}${eye(x + 4 * scale, y + 6 * scale, 5.5, 6, art.rightEyeScale)}`;
    case 'wide':
      return `${eye(x - 14 * scale, leftY, 4.5, 5.5, art.leftEyeScale, 0.9)}${eye(x + 14 * scale, rightY - 2 * scale, 4.5, 5.5, art.rightEyeScale, 0.9)}`;
    case 'wink':
      return `${eye(x - 9 * scale, leftY, 6.5, 7, art.leftEyeScale)}${faceLine(`M${x + 3 * scale} ${rightY + scale}Q${x + 9 * scale} ${rightY - 5 * scale} ${x + 15 * scale} ${rightY}`, palette)}`;
    default:
      return invalidOption('eyeArrangement', arrangement);
  }
}

function renderMouth(
  style: OddlingsParams['mouthStyle'],
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): string {
  const face = faceMetrics(definition);
  const x = face.x + art.mouthShiftX;
  const y = face.mouthY + art.mouthShiftY;
  const scale = face.scale * art.mouthScale;

  switch (style) {
    case 'smile':
      return faceLine(`M${x - 9 * scale} ${y - scale}Q${x} ${y + 7 * scale} ${x + 9 * scale} ${y - scale}`, palette);
    case 'crooked':
      return faceLine(`M${x - 9 * scale} ${y + 2 * scale}Q${x - 2 * scale} ${y - 5 * scale} ${x + 9 * scale} ${y + scale}`, palette);
    case 'quiet':
      return `<rect x="${x - 6.5 * scale}" y="${y - 2.5 * scale}" width="${13 * scale}" height="${5 * scale}" rx="${2.5 * scale}" fill="${palette.canvas}" stroke="${tonalEdge(palette.canvas, palette.ink, 0.4)}" stroke-width="1.4"/>`;
    case 'open':
      return `<ellipse cx="${x + scale}" cy="${y + scale}" rx="${6 * scale}" ry="${5 * scale}" fill="${palette.ink}"/>`;
    case 'toothy':
      return `<rect x="${x - 7 * scale}" y="${y - 4 * scale}" width="${14 * scale}" height="${9 * scale}" rx="${4.5 * scale}" fill="${palette.canvas}" stroke="${tonalEdge(palette.canvas, palette.ink, 0.42)}" stroke-width="1.5"/>`;
    case 'ooh':
      return `<ellipse cx="${x + scale}" cy="${y}" rx="${4.5 * scale}" ry="${4.8 * scale}" fill="none" stroke="${palette.ink}" stroke-width="1.7"/>`;
    default:
      return invalidOption('mouthStyle', style);
  }
}

function renderFace(
  eyeArrangement: OddlingsParams['eyeArrangement'],
  mouthStyle: OddlingsParams['mouthStyle'],
  definition: BodyDefinition,
  palette: Palette,
  art: OddlingArt,
): string {
  const pivotY = definition.faceBox.y + definition.faceBox.height * 0.18;
  return `<g data-part="face" transform="rotate(${art.faceTilt} ${definition.faceBox.x} ${pivotY})"><g data-part="eyes" data-eye-arrangement="${eyeArrangement}">${renderEyes(eyeArrangement, definition, palette, art)}</g><g data-part="mouth" data-mouth-style="${mouthStyle}">${renderMouth(mouthStyle, definition, palette, art)}</g></g>`;
}

const bodyFitTransforms = new Map<BodyShapeName, string>();

function fitOddlingArtwork(
  layout: BodyLayout,
  palette: Palette,
  art: OddlingArt,
  artwork: string,
): string {
  const bodyShape = layout.definition.id;
  let transform = bodyFitTransforms.get(bodyShape);
  if (!transform) {
    const definition = layout.definition;
    const envelope = [
      layout.svg,
      ...schema.feature.options.flatMap((feature) => {
        const layers = renderFeature(feature, definition, palette, art);
        return [layers.behind, layers.front];
      }),
      ...schema.pattern.options.map((pattern) => (
        renderPattern(pattern, definition, palette, art)
      )),
      ...schema.eyeArrangement.options.map((eyeArrangement) => (
        renderFace(eyeArrangement, 'smile', definition, palette, art)
      )),
      ...schema.mouthStyle.options.map((mouthStyle) => (
        renderFace('pair', mouthStyle, definition, palette, art)
      )),
    ].join('');
    const fittedEnvelope = fitToCircle(envelope, { size: 100, padding: 4 });
    const match = fittedEnvelope.match(/^<g transform="([^"]+)">/);
    if (!match) throw new Error(`Unable to fit Oddlings body: ${bodyShape}`);
    transform = match[1]!;
    bodyFitTransforms.set(bodyShape, transform);
  }
  return `<g transform="${transform}">${artwork}</g>`;
}

export function generate(params: OddlingsParams): string {
  const basePalette = palettes[params.palette];
  if (!basePalette) invalidOption('palette', params.palette);
  if (!schema.backgroundShape.options.some((shape) => shape === params.backgroundShape)) {
    invalidOption('backgroundShape', params.backgroundShape);
  }
  const definition = bodyById[params.bodyShape];
  if (!definition) invalidOption('bodyShape', params.bodyShape);

  // Base-only illustrator variation prevents any secondary or presentation
  // control from silently moving the established silhouette and face anchors.
  const art = resolveOddlingArt(
    definition,
    createArtVariation('oddlings', { bodyShape: params.bodyShape }),
  );
  const palette = resolveBodyPalette(definition, basePalette);
  const detail = tonalEdge(palette.primary, palette.ink, 0.32);
  const layout: BodyLayout = {
    definition,
    svg: renderBody(params.bodyShape, palette.primary, detail),
  };
  const feature = renderFeature(params.feature, definition, palette, art);
  const featureGroup = (layer: 'behind' | 'front', content: string): string => (
    `<g data-part="feature" data-feature="${params.feature}" data-layer="${layer}">${content}</g>`
  );
  const artwork = [
    featureGroup('behind', feature.behind),
    `<g data-part="body" data-body-shape="${params.bodyShape}" data-topology="${definition.topology}">${layout.svg}</g>`,
    `<g data-part="pattern" data-pattern="${params.pattern}">${renderPattern(params.pattern, definition, palette, art)}</g>`,
    renderFace(params.eyeArrangement, params.mouthStyle, definition, palette, art),
    featureGroup('front', feature.front),
  ].join('');
  const content = fitOddlingArtwork(layout, palette, art, artwork);

  return renderAvatarFrame(content, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<OddlingsParams> = {},
): OddlingsParams {
  const bodyShape = traits.bodyShape ?? random.pick('body-shape', schema.bodyShape.options);
  const definition = bodyById[bodyShape];
  const feature = traits.feature ?? random.weightedPick(
    `feature:${bodyShape}`,
    definition.naturalFeatures,
  );

  return {
    backgroundShape: random.weightedPick('background-shape', [
      ['circle', 5],
      ['rounded', 4],
      ['square', 1],
    ] as const),
    palette: random.pick('palette', schema.palette.options),
    bodyShape,
    eyeArrangement: traits.eyeArrangement ?? random.weightedPick('eye-arrangement', [
      ['pair', 20],
      ['offset', 18],
      ['cyclops', 12],
      ['trio', 9],
      ['stacked', 9],
      ['wide', 17],
      ['wink', 15],
    ] as const),
    mouthStyle: traits.mouthStyle ?? random.weightedPick('mouth-style', [
      ['smile', 30],
      ['crooked', 19],
      ['quiet', 17],
      ['open', 11],
      ['toothy', 10],
      ['ooh', 13],
    ] as const),
    feature,
    pattern: traits.pattern ?? random.weightedPick(
      `pattern:${bodyShape}`,
      definition.naturalPatterns,
    ),
  };
}

export const oddlings: InternalTheme<typeof schema, 'character', typeof baseTypeParam> = {
  name: 'Oddlings',
  description: 'Offbeat little characters with soft shapes and quietly playful expressions.',
  kind: 'character',
  baseTypeParam,
  schema,
  generate,
  randomize,
};

/** Internal structural hooks for exhaustive artwork invariant tests. */
export const __test = {
  bodyDefinitions,
  renderBody,
  renderFeature,
  renderPattern,
};
