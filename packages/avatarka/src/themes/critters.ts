import type { ParamSchema, ParamsFromSchema } from '../types';
import { fitToCircle } from '../fit';
import {
  palettes,
  paletteNames,
  type Palette,
  type PaletteName,
} from '../palettes';
import {
  createArtVariation,
  renderAvatarFrame,
  tonalEdge,
} from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';

type MarkingName = 'none' | 'blaze' | 'eye-patch' | 'freckles' | 'forehead-stripes' | 'cheek-spots';
type AccessoryName = 'none' | 'collar' | 'bandana' | 'round-glasses' | 'leaf';

interface EyeAnchor {
  x: number;
  y: number;
  rx: number;
  ry: number;
  angle: number;
}

interface MouthAnchor {
  x: number;
  y: number;
  width: number;
  depth: number;
  bias: number;
}

interface MarkingAnchors {
  blazeTopY: number;
  blazeBottomY: number;
  blazeWidth: number;
  patchX: number;
  patchY: number;
  patchRx: number;
  patchRy: number;
  patchAngle: number;
  foreheadY: number;
  foreheadSpread: number;
  cheekY: number;
  cheekSpread: number;
  cheekRadius: number;
}

interface LeafAnchor {
  x: number;
  y: number;
  angle: number;
  scale: number;
}

interface AccessoryAnchors {
  kind: 'neck' | 'base';
  x: number;
  y: number;
  width: number;
  angle: number;
  glassesScale: number;
  leaf: LeafAnchor;
}

interface SpeciesAnchors {
  eyes: readonly [EyeAnchor, EyeAnchor];
  mouth: MouthAnchor;
  marking: MarkingAnchors;
  accessory: AccessoryAnchors;
}

type WeightedMarkings = readonly (readonly [MarkingName, number])[];
type WeightedAccessories = readonly (readonly [AccessoryName, number])[];

interface SpeciesDefinition<TId extends string = string> {
  id: TId;
  label: string;
  anchors: SpeciesAnchors;
  naturalMarkings: WeightedMarkings;
  naturalAccessories: WeightedAccessories;
}

interface CoatColors {
  base: string;
  inner: string;
  panel: string;
  strongMark: string;
  externalMark: string;
}

interface FaceLayout {
  behind: string;
  silhouette: string;
  foreground: string;
  muzzle: string;
  nose: string;
  details: string;
  eyes: readonly [EyeAnchor, EyeAnchor];
  mouth: MouthAnchor;
  marking: MarkingAnchors;
  accessory: AccessoryAnchors;
}

interface CritterArt {
  faceShift: number;
  eyeSkew: number;
  mouthShift: number;
  leftEarLift: number;
  rightEarLift: number;
  leftEarTurn: number;
  rightEarTurn: number;
}

type EyeTuple = readonly [number, number, number, number, number];
type MouthTuple = readonly [number, number, number, number, number];
type BaseTuple = readonly [
  'neck' | 'base',
  number,
  number,
  number,
  x?: number,
  angle?: number,
];
type LeafTuple = readonly [number, number, number, number];

function speciesAnchors(
  left: EyeTuple,
  right: EyeTuple,
  mouth: MouthTuple,
  base: BaseTuple,
  leaf: LeafTuple,
  marking: Partial<MarkingAnchors> = {},
): SpeciesAnchors {
  const eyeY = (left[1] + right[1]) / 2;
  const eyeGap = right[0] - left[0];
  return {
    eyes: [
      { x: left[0], y: left[1], rx: left[2], ry: left[3], angle: left[4] },
      { x: right[0], y: right[1], rx: right[2], ry: right[3], angle: right[4] },
    ],
    mouth: {
      x: mouth[0],
      y: mouth[1],
      width: mouth[2],
      depth: mouth[3],
      bias: mouth[4],
    },
    marking: {
      blazeTopY: eyeY - 22,
      blazeBottomY: eyeY + 9,
      blazeWidth: Math.max(7, eyeGap * 0.34),
      patchX: left[0],
      patchY: left[1],
      patchRx: Math.max(6, left[2] + 5),
      patchRy: Math.max(6, left[3] + 4),
      patchAngle: -12,
      foreheadY: eyeY - 18,
      foreheadSpread: Math.max(7, eyeGap * 0.38),
      cheekY: mouth[1] - 5,
      cheekSpread: Math.max(12, eyeGap * 0.9),
      cheekRadius: 3.8,
      ...marking,
    },
    accessory: {
      kind: base[0],
      x: base[4] ?? 50,
      y: base[1],
      width: base[2],
      angle: base[5] ?? 0,
      glassesScale: base[3],
      leaf: { x: leaf[0], y: leaf[1], angle: leaf[2], scale: leaf[3] },
    },
  };
}

const furryMarkings = [
  ['none', 34], ['blaze', 16], ['eye-patch', 10], ['freckles', 15],
  ['forehead-stripes', 13], ['cheek-spots', 12],
] as const satisfies WeightedMarkings;
const plainMarkings = [
  ['none', 52], ['blaze', 9], ['eye-patch', 8], ['freckles', 13],
  ['forehead-stripes', 8], ['cheek-spots', 10],
] as const satisfies WeightedMarkings;
const stripedMarkings = [
  ['none', 30], ['blaze', 8], ['freckles', 10],
  ['forehead-stripes', 38], ['cheek-spots', 14],
] as const satisfies WeightedMarkings;
const spottedMarkings = [
  ['none', 32], ['blaze', 7], ['eye-patch', 8], ['freckles', 28],
  ['forehead-stripes', 8], ['cheek-spots', 17],
] as const satisfies WeightedMarkings;
const maskedMarkings = [
  ['none', 54], ['blaze', 8], ['freckles', 15],
  ['forehead-stripes', 9], ['cheek-spots', 14],
] as const satisfies WeightedMarkings;
const scaledMarkings = [
  ['none', 43], ['blaze', 6], ['eye-patch', 7], ['freckles', 16],
  ['forehead-stripes', 17], ['cheek-spots', 11],
] as const satisfies WeightedMarkings;
const aquaticMarkings = [
  ['none', 50], ['blaze', 6], ['eye-patch', 7], ['freckles', 15],
  ['forehead-stripes', 10], ['cheek-spots', 12],
] as const satisfies WeightedMarkings;
const clownfishMarkings = [
  ['none', 82], ['freckles', 8], ['cheek-spots', 10],
] as const satisfies WeightedMarkings;
const wingedMarkings = [
  ['none', 46], ['blaze', 10], ['eye-patch', 6], ['freckles', 12],
  ['forehead-stripes', 14], ['cheek-spots', 12],
] as const satisfies WeightedMarkings;

const neckAccessories = [
  ['none', 60], ['collar', 13], ['bandana', 10], ['round-glasses', 11], ['leaf', 6],
] as const satisfies WeightedAccessories;
const baseAccessories = [
  ['none', 68], ['collar', 7], ['bandana', 8], ['round-glasses', 10], ['leaf', 7],
] as const satisfies WeightedAccessories;
const delicateAccessories = [
  ['none', 78], ['round-glasses', 12], ['leaf', 10],
] as const satisfies WeightedAccessories;
const aquaticAccessories = [
  ['none', 78], ['round-glasses', 12], ['leaf', 10],
] as const satisfies WeightedAccessories;
const wingedAccessories = [
  ['none', 70], ['collar', 5], ['bandana', 7], ['round-glasses', 10], ['leaf', 8],
] as const satisfies WeightedAccessories;

function speciesDefinition<const TId extends string>(
  id: TId,
  label: string,
  anchors: SpeciesAnchors,
  naturalMarkings: WeightedMarkings,
  naturalAccessories: WeightedAccessories,
): SpeciesDefinition<TId> {
  return { id, label, anchors, naturalMarkings, naturalAccessories };
}

/** Ordered, exhaustive source for the Critters schema and catalog contact sheet. */
const speciesDefinitions = [
  speciesDefinition('cat', 'Cat', speciesAnchors([41, 49, 2.2, 3.4, -10], [59, 49, 2.2, 3.4, 10], [50, 68, 8.8, 4.1, -0.2], ['neck', 74, 34, 1], [78, 25, 18, 0.9]), furryMarkings, neckAccessories),
  speciesDefinition('elephant', 'Elephant', speciesAnchors([40, 48, 2.6, 3, -2], [60, 48, 2.6, 3, 2], [50, 68, 9, 3.5, 0], ['neck', 77, 40, 1], [72, 8, 12, 0.72]), plainMarkings, neckAccessories),
  speciesDefinition('owl', 'Owl', speciesAnchors([39, 48, 3.3, 3.6, 0], [61, 48, 3.3, 3.6, 0], [50, 66, 7.5, 3.3, 0], ['base', 77, 38, 1.08], [77, 23, 18, 0.85]), wingedMarkings, wingedAccessories),
  speciesDefinition('dolphin', 'Dolphin', speciesAnchors([60, 41, 2.4, 3, -6], [72, 43, 2.4, 3, 6], [72, 50, 11, 3, 0], ['base', 58, 18, 0.74, 66, 90], [62, 20, -12, 0.7], { foreheadY: 31, foreheadSpread: 6 }), aquaticMarkings, aquaticAccessories),
  speciesDefinition('fox', 'Fox', speciesAnchors([41, 48, 2.2, 3.5, -13], [59, 48, 2.2, 3.5, 13], [50, 70, 8.5, 3.8, 0.35], ['neck', 75.5, 28, 1], [77, 24, 18, 0.86]), furryMarkings, neckAccessories),
  speciesDefinition('turtle', 'Turtle', speciesAnchors([41, 50, 2.5, 3, -2], [59, 50, 2.5, 3, 2], [50, 65, 8.5, 3.4, 0], ['base', 77, 32, 1], [77, 26, 16, 0.84]), scaledMarkings, baseAccessories),
  speciesDefinition('panda', 'Panda', speciesAnchors([41, 49.5, 2.8, 2.8, 0], [59, 49.5, 2.8, 2.8, 0], [50, 71, 8.2, 4.2, 0.1], ['neck', 76, 44, 1], [77, 23, 18, 0.88]), maskedMarkings, neckAccessories),
  speciesDefinition('parrot', 'Parrot', speciesAnchors([40, 47, 2.6, 3.2, -5], [60, 47, 2.6, 3.2, 5], [50, 66, 7.5, 3.5, 0], ['neck', 76, 32, 1], [76, 22, 15, 0.82]), wingedMarkings, wingedAccessories),
  speciesDefinition('pufferfish', 'Pufferfish', speciesAnchors([40, 49, 2.6, 3, -2], [60, 49, 2.6, 3, 2], [50, 65, 8, 3.5, 0], ['base', 75, 34, 1], [72, 8, 12, 0.7]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('butterfly', 'Butterfly', speciesAnchors([45, 43, 2, 2.7, -4], [55, 43, 2, 2.7, 4], [50, 54, 6.5, 3.1, 0], ['base', 70, 18, 0.78], [72, 6, 12, 0.62]), wingedMarkings, delicateAccessories),

  speciesDefinition('dog', 'Dog', speciesAnchors([40, 47.2, 2.9, 3.1, -2], [60, 47.2, 2.9, 3.1, 2], [50, 68, 10.5, 4.8, 0.15], ['neck', 74, 38, 1], [76, 25, 16, 0.88]), furryMarkings, neckAccessories),
  speciesDefinition('frog', 'Frog', speciesAnchors([38, 45, 3.2, 3.2, 0], [62, 45, 3.2, 3.2, 0], [50, 65, 12, 4, 0], ['base', 76, 43, 1.05], [72, 9, 12, 0.72]), spottedMarkings, baseAccessories),
  speciesDefinition('lion', 'Lion', speciesAnchors([41, 49, 2.5, 3, -6], [59, 49, 2.5, 3, 6], [50, 68, 9.5, 4.2, 0], ['neck', 76, 36, 1], [77, 22, 18, 0.86]), furryMarkings, neckAccessories),
  speciesDefinition('toucan', 'Toucan', speciesAnchors([45, 38, 2.4, 3, -5], [57, 37.5, 2.4, 3, 5], [76, 47.5, 9, 2.4, 0], ['base', 60, 18, 0.76, 60, 84], [52, 14, 8, 0.78], { blazeTopY: 26, blazeBottomY: 38, foreheadY: 28, foreheadSpread: 7, cheekY: 46, cheekSpread: 8.5 }), wingedMarkings, wingedAccessories),
  speciesDefinition('seal', 'Seal', speciesAnchors([41, 50, 2.5, 3.1, -2], [59, 50, 2.5, 3.1, 2], [50, 68, 9.5, 4, 0], ['base', 78, 38, 1], [76, 27, 12, 0.82]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('chameleon', 'Chameleon', speciesAnchors([37, 45, 3, 3.4, -5], [63, 45, 3, 3.4, 5], [50, 63, 9, 3, 0], ['base', 79, 30, 1], [71, 16, 14, 0.78]), scaledMarkings, baseAccessories),
  speciesDefinition('rabbit', 'Rabbit', speciesAnchors([42, 50.2, 2.3, 3.7, -3], [58, 50.2, 2.3, 3.7, 3], [50, 70, 7.8, 4.5, 0.1], ['neck', 77, 42, 1], [76, 25, 15, 0.86]), furryMarkings, neckAccessories),
  speciesDefinition('octopus', 'Octopus', speciesAnchors([41, 47, 2.7, 3.2, -2], [59, 47, 2.7, 3.2, 2], [50, 62, 8.5, 3.5, 0], ['base', 72, 38, 1], [76, 25, 12, 0.8]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('giraffe', 'Giraffe', speciesAnchors([41, 45, 2.3, 3.2, -5], [59, 45, 2.3, 3.2, 5], [50, 66, 8, 3.5, 0], ['neck', 77, 25, 1], [70, 7, 12, 0.7]), spottedMarkings, neckAccessories),
  speciesDefinition('shark', 'Shark', speciesAnchors([40, 49, 2.5, 3, -4], [60, 49, 2.5, 3, 4], [50, 65, 11, 3.8, 0], ['base', 76, 40, 1], [75, 24, 12, 0.8]), aquaticMarkings, aquaticAccessories),

  speciesDefinition('bear', 'Bear', speciesAnchors([41.5, 49, 2.5, 2.8, 0], [58.5, 49, 2.5, 2.8, 0], [50, 69, 9.5, 4.2, -0.1], ['neck', 77, 42, 1], [72, 8, 12, 0.72]), furryMarkings, neckAccessories),
  speciesDefinition('axolotl', 'Axolotl', speciesAnchors([41, 48, 2.6, 3.2, -2], [59, 48, 2.6, 3.2, 2], [50, 65, 9, 3.8, 0], ['base', 75, 34, 1], [75, 24, 12, 0.8]), spottedMarkings, aquaticAccessories),
  speciesDefinition('eagle', 'Eagle', speciesAnchors([40, 46, 2.5, 3.2, -9], [60, 46, 2.5, 3.2, 9], [50, 66, 7.5, 3.2, 0], ['neck', 76, 34, 1], [76, 21, 14, 0.82]), wingedMarkings, wingedAccessories),
  speciesDefinition('zebra', 'Zebra', speciesAnchors([41, 47, 2.4, 3.3, -5], [59, 47, 2.4, 3.3, 5], [50, 68, 8, 3.5, 0], ['neck', 77, 28, 1], [76, 19, 14, 0.82]), stripedMarkings, neckAccessories),
  speciesDefinition('crab', 'Crab', speciesAnchors([35, 29, 2.7, 2.8, 0], [65, 29, 2.7, 2.8, 0], [50, 59, 8, 3.2, 0], ['base', 71, 48, 0.92], [52, 9, -12, 0.78], { blazeTopY: 42, blazeBottomY: 58, foreheadY: 44, foreheadSpread: 12, cheekY: 56, cheekSpread: 20 }), aquaticMarkings, aquaticAccessories),
  speciesDefinition('koala', 'Koala', speciesAnchors([39.5, 48, 2.3, 2.8, 0], [60.5, 48, 2.3, 2.8, 0], [50, 73, 7.5, 3.4, -0.1], ['neck', 75.5, 40, 1], [72, 7, 12, 0.68]), furryMarkings, neckAccessories),
  speciesDefinition('crocodile', 'Crocodile', speciesAnchors([39, 46, 2.5, 3, -3], [61, 46, 2.5, 3, 3], [50, 68, 11, 3.6, 0], ['base', 76, 44, 1], [76, 23, 12, 0.8]), scaledMarkings, baseAccessories),
  speciesDefinition('penguin', 'Penguin', speciesAnchors([41, 47, 2.5, 3.1, -2], [59, 47, 2.5, 3.1, 2], [50, 65, 7.5, 3.3, 0], ['base', 78, 34, 1], [76, 22, 14, 0.82]), maskedMarkings, wingedAccessories),
  speciesDefinition('whale', 'Whale', speciesAnchors([39, 49, 2.5, 3, -3], [61, 49, 2.5, 3, 3], [50, 66, 11, 3.7, 0], ['base', 75, 36, 0.94], [72, 19, 12, 0.76]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('mouse', 'Mouse', speciesAnchors([41, 49, 2.2, 3.1, -4], [59, 49, 2.2, 3.1, 4], [50, 69, 7.5, 3.5, 0], ['neck', 76, 30, 1], [72, 8, 12, 0.7]), furryMarkings, neckAccessories),

  speciesDefinition('raccoon', 'Raccoon', speciesAnchors([40.5, 49, 2.5, 3, -4], [59.5, 49, 2.5, 3, 4], [50, 70, 8.5, 3.8, 0], ['neck', 76, 38, 1], [77, 23, 16, 0.86]), maskedMarkings, neckAccessories),
  speciesDefinition('duck', 'Duck', speciesAnchors([41, 46, 2.5, 3, -2], [59, 46, 2.5, 3, 2], [50, 66, 7.5, 3.2, 0], ['neck', 75, 30, 1], [76, 21, 14, 0.82]), wingedMarkings, wingedAccessories),
  speciesDefinition('salamander', 'Salamander', speciesAnchors([52, 43, 2.8, 3.4, -4], [66, 44, 2.8, 3.4, 4], [62, 58, 9, 3.4, 0], ['base', 52, 18, 0.78, 45, 82], [62, 18, -12, 0.72], { blazeTopY: 31, foreheadY: 33 }), spottedMarkings, baseAccessories),
  speciesDefinition('tiger', 'Tiger', speciesAnchors([39.5, 48.5, 2.7, 3, -8], [60.5, 48.5, 2.7, 3, 8], [50, 70, 10.5, 4, 0.2], ['neck', 77, 48, 1], [77, 23, 16, 0.86]), stripedMarkings, neckAccessories),
  speciesDefinition('manta-ray', 'Manta ray', speciesAnchors([40, 47, 2.4, 2.9, -4], [60, 47, 2.4, 2.9, 4], [50, 60, 9, 3.2, 0], ['base', 69, 30, 0.92], [74, 22, 12, 0.74]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('snail', 'Snail', speciesAnchors([32, 30, 2.2, 2.7, -3], [50, 30, 2.2, 2.7, 3], [43, 54, 7, 3.1, 0], ['base', 77, 42, 0.88], [76, 27, 12, 0.78]), spottedMarkings, delicateAccessories),
  speciesDefinition('deer', 'Deer', speciesAnchors([39.75, 49, 2.1, 3.5, -7], [60.25, 49, 2.1, 3.5, 7], [50, 73, 7.4, 3.6, 0.25], ['neck', 76.5, 26, 1], [72, 7, 12, 0.7]), spottedMarkings, neckAccessories),
  speciesDefinition('chicken', 'Chicken', speciesAnchors([41, 47, 2.5, 3, -3], [59, 47, 2.5, 3, 3], [50, 65, 7, 3.1, 0], ['neck', 75, 31, 1], [75, 22, 14, 0.82]), wingedMarkings, wingedAccessories),
  speciesDefinition('anglerfish', 'Anglerfish', speciesAnchors([40, 49, 2.6, 3.1, -4], [60, 49, 2.6, 3.1, 4], [50, 66, 11, 4.2, 0], ['base', 76, 40, 1], [75, 25, 12, 0.78]), aquaticMarkings, aquaticAccessories),
  speciesDefinition('iguana', 'Iguana', speciesAnchors([40, 47, 2.5, 3.2, -5], [60, 47, 2.5, 3.2, 5], [50, 67, 8.5, 3.5, 0], ['neck', 76, 34, 1], [75, 21, 12, 0.8]), scaledMarkings, baseAccessories),

  speciesDefinition('pig', 'Pig', speciesAnchors([40, 48, 2.5, 3, -3], [60, 48, 2.5, 3, 3], [50, 70, 9, 3.8, 0], ['neck', 77, 40, 1], [76, 24, 16, 0.86]), furryMarkings, neckAccessories),
  speciesDefinition('peacock', 'Peacock', speciesAnchors([41, 45, 2.4, 3, -4], [59, 45, 2.4, 3, 4], [50, 63, 7, 3.2, 0], ['neck', 74, 27, 1], [75, 18, 14, 0.8]), wingedMarkings, wingedAccessories),
  speciesDefinition('gecko', 'Gecko', speciesAnchors([39, 47, 3, 3.2, -4], [61, 47, 3, 3.2, 4], [50, 64, 8, 3.3, 0], ['base', 74, 34, 1.06], [75, 23, 12, 0.8]), spottedMarkings, baseAccessories),
  speciesDefinition('bee', 'Bee', speciesAnchors([42, 43, 2.3, 2.8, -3], [58, 43, 2.3, 2.8, 3], [50, 55, 7, 3.1, 0], ['base', 72, 24, 0.9], [70, 7, 12, 0.65]), stripedMarkings, delicateAccessories),
  speciesDefinition('alpaca', 'Alpaca', speciesAnchors([41, 46, 2.4, 3.2, -4], [59, 46, 2.4, 3.2, 4], [50, 68, 8, 3.6, 0], ['neck', 78, 27, 1], [76, 20, 15, 0.84]), furryMarkings, neckAccessories),
  speciesDefinition('jellyfish', 'Jellyfish', speciesAnchors([41, 43, 2.5, 3, -2], [59, 43, 2.5, 3, 2], [50, 56, 8, 3.3, 0], ['base', 67, 34, 1], [75, 23, 12, 0.78]), aquaticMarkings, delicateAccessories),
  speciesDefinition('bat', 'Bat', speciesAnchors([41, 48, 2.4, 3.2, -8], [59, 48, 2.4, 3.2, 8], [50, 67, 8, 3.5, 0], ['neck', 75, 30, 1], [76, 21, 14, 0.82]), furryMarkings, wingedAccessories),
  speciesDefinition('clownfish', 'Clownfish', speciesAnchors([55, 44, 2.3, 2.9, -5], [68, 45, 2.3, 2.9, 5], [67, 59, 9, 3.4, 0], ['base', 49, 18, 0.78, 49, 90], [52, 18, -16, 0.72]), clownfishMarkings, aquaticAccessories),
  speciesDefinition('toad', 'Toad', speciesAnchors([36, 46, 3.1, 3, 0], [64, 46, 3.1, 3, 0], [50, 68, 13, 3.5, 0], ['base', 76, 38, 1], [70, 12, 12, 0.68]), spottedMarkings, baseAccessories),
  speciesDefinition('snake', 'Snake', speciesAnchors([42, 43, 2.4, 3.2, -4], [58, 43, 2.4, 3.2, 4], [50, 58, 7.5, 3.2, 0], ['base', 75, 30, 1], [74, 21, 12, 0.78]), scaledMarkings, baseAccessories),
] as const satisfies readonly SpeciesDefinition[];

type SpeciesName = (typeof speciesDefinitions)[number]['id'];

function orderedSpeciesIds<const TDefinitions extends readonly SpeciesDefinition[]>(
  definitions: TDefinitions,
): { readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'] } {
  return definitions.map((definition) => definition.id) as {
    readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'];
  };
}

/** Public schema values are derived from the one ordered definition catalog. */
export const speciesNames = orderedSpeciesIds(speciesDefinitions);

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
  species: {
    type: 'select',
    default: 'cat',
    options: speciesNames,
  },
  coat: {
    type: 'select',
    default: 'classic',
    options: ['classic', 'light', 'warm'],
  },
  expression: {
    type: 'select',
    default: 'soft-smile',
    options: ['calm', 'soft-smile', 'content', 'curious', 'sleepy'],
  },
  marking: {
    type: 'select',
    default: 'none',
    options: [
      'none',
      'blaze',
      'eye-patch',
      'freckles',
      'forehead-stripes',
      'cheek-spots',
    ],
  },
  accessory: {
    type: 'select',
    default: 'none',
    options: ['none', 'collar', 'bandana', 'round-glasses', 'leaf'],
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'species' as const;

export type CrittersParams = ParamsFromSchema<typeof schema>;

const speciesById = Object.fromEntries(
  speciesDefinitions.map((definition) => [definition.id, definition]),
) as Record<SpeciesName, SpeciesDefinition>;

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Critters ${param}: ${String(value)}`);
}

function resolveArt(params: CrittersParams): CritterArt {
  // Base drawing geometry belongs to the catalog species. Coat, expression,
  // marking, accessory, palette, and frame may never move or rescale it.
  const art = createArtVariation('critters', { species: params.species });

  return {
    faceShift: art.number('face-shift', -0.55, 0.55),
    eyeSkew: art.number('eye-skew', -0.28, 0.28),
    mouthShift: art.number('mouth-shift', -0.45, 0.45),
    leftEarLift: art.number('left-ear-lift', -0.9, 0.9),
    rightEarLift: art.number('right-ear-lift', -0.9, 0.9),
    leftEarTurn: art.number('left-ear-turn', -2.2, 2.2),
    rightEarTurn: art.number('right-ear-turn', -2.2, 2.2),
  };
}

function earGroup(
  content: string,
  side: 'left' | 'right',
  pivotX: number,
  pivotY: number,
  art: CritterArt,
): string {
  const lift = side === 'left' ? art.leftEarLift : art.rightEarLift;
  const turn = side === 'left' ? art.leftEarTurn : art.rightEarTurn;
  return `<g transform="translate(0 ${lift}) rotate(${turn} ${pivotX} ${pivotY})">${content}</g>`;
}

type SpeciesDrawing = Pick<FaceLayout, 'behind' | 'silhouette' | 'foreground' | 'muzzle' | 'nose' | 'details'>;
type LegacySpeciesDrawing = Pick<FaceLayout, 'silhouette' | 'muzzle' | 'nose' | 'details'>;

function createFaceLayout(
  species: SpeciesName,
  drawing: SpeciesDrawing,
  art: CritterArt,
): FaceLayout {
  const anchors = speciesById[species].anchors;
  return {
    ...drawing,
    eyes: [
      {
        ...anchors.eyes[0],
        x: anchors.eyes[0].x + art.faceShift,
        y: anchors.eyes[0].y + art.eyeSkew,
      },
      {
        ...anchors.eyes[1],
        x: anchors.eyes[1].x + art.faceShift,
        y: anchors.eyes[1].y - art.eyeSkew,
      },
    ],
    mouth: {
      ...anchors.mouth,
      x: anchors.mouth.x + art.faceShift + anchors.mouth.bias + art.mouthShift,
    },
    marking: anchors.marking,
    accessory: anchors.accessory,
  };
}

/**
 * Minimum WCAG contrast between an outer body tone and the avatar's own
 * background-shape fill. Below this the silhouette edge dissolves into the
 * canvas, most visibly on palettes whose canvas hue matches the body tone.
 */
const SILHOUETTE_CANVAS_CONTRAST = 1.75;

function relativeLuminance(color: string): number {
  const channels = color.slice(1).match(/../g)!.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

/** Lightens a tone toward white; the pale counterpart of tonalEdge. */
function tonalTint(fill: string, whiteAmount: number): string {
  const channels = fill.slice(1).match(/../g)!.map((channel) => (
    Math.round(Number.parseInt(channel, 16) * (1 - whiteAmount) + 255 * whiteAmount)
  ));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Keeps a silhouette-bearing tone readable against the avatar's own canvas.
 * Palette canvas tones sit close to the mid palette tones, so a body drawn in
 * an unguarded mid tone can dissolve into the frame. Nudge the tone away from
 * the canvas — lighter tones tint toward white, darker tones shade toward ink —
 * until the outer edge stays visible on every palette.
 */
function canvasSafeTone(tone: string, palette: Palette): string {
  if (contrastRatio(tone, palette.canvas) >= SILHOUETTE_CANVAS_CONTRAST) return tone;
  const lighten = relativeLuminance(tone) >= relativeLuminance(palette.canvas);
  for (let amount = 0.06; amount <= 0.9; amount += 0.06) {
    const candidate = lighten ? tonalTint(tone, amount) : tonalEdge(tone, palette.ink, amount);
    if (contrastRatio(candidate, palette.canvas) >= SILHOUETTE_CANVAS_CONTRAST) return candidate;
  }
  return lighten ? tonalTint(tone, 0.9) : palette.ink;
}

function resolveCoat(coat: CrittersParams['coat'], palette: Palette): CoatColors {
  switch (coat) {
    case 'classic':
      return {
        base: canvasSafeTone(palette.primary, palette),
        inner: palette.secondary,
        panel: palette.secondary,
        strongMark: palette.canvas,
        externalMark: tonalEdge(palette.primary, palette.ink, 0.42),
      };
    case 'light':
      return {
        base: canvasSafeTone(palette.secondary, palette),
        inner: palette.primary,
        panel: canvasSafeTone(palette.primary, palette),
        strongMark: palette.primary,
        externalMark: tonalEdge(palette.primary, palette.ink, 0.42),
      };
    case 'warm':
      return {
        base: canvasSafeTone(palette.accent, palette),
        inner: palette.secondary,
        panel: palette.secondary,
        strongMark: tonalEdge(palette.accent, palette.ink, 0.38),
        externalMark: tonalEdge(palette.accent, palette.ink, 0.38),
      };
    default:
      return invalidOption('coat', coat);
  }
}

function renderSpecies(
  species: CrittersParams['species'],
  colors: CoatColors,
  palette: Palette,
  art: CritterArt,
): FaceLayout {
  const headStyle = `fill="${colors.base}"`;
  const innerStyle = `fill="${colors.inner}"`;
  const panelStyle = `fill="${colors.panel}"`;
  const softMark = tonalEdge(colors.base, palette.ink, 0.42);
  function faceLayout(
    drawing: LegacySpeciesDrawing,
    variation: CritterArt,
  ): FaceLayout;
  function faceLayout(
    definitionSpecies: SpeciesName,
    drawing: SpeciesDrawing,
    variation: CritterArt,
  ): FaceLayout;
  function faceLayout(
    speciesOrDrawing: SpeciesName | LegacySpeciesDrawing,
    drawingOrVariation: SpeciesDrawing | CritterArt,
    variation?: CritterArt,
  ): FaceLayout {
    if (typeof speciesOrDrawing === 'string') {
      return createFaceLayout(
        speciesOrDrawing,
        drawingOrVariation as SpeciesDrawing,
        variation!,
      );
    }
    return createFaceLayout(
      species,
      { behind: '', foreground: '', ...speciesOrDrawing },
      drawingOrVariation as CritterArt,
    );
  }

  switch (species) {
    case 'cat': {
      const leftEar = earGroup(
        `<path d="M25 39L29 14L43 30Z" ${headStyle}/>`,
        'left', 31, 29, art,
      );
      const rightEar = earGroup(
        `<path d="M57 30L71 14L75 39Z" ${headStyle}/>`,
        'right', 69, 29, art,
      );
      const leftInnerEar = earGroup(
        `<path d="M29 30L32 20L39 30Z" ${innerStyle}/>`,
        'left', 31, 29, art,
      );
      const rightInnerEar = earGroup(
        `<path d="M61 30L68 20L71 30Z" ${innerStyle}/>`,
        'right', 69, 29, art,
      );
      return faceLayout({
        silhouette: `${leftEar}${rightEar}<path d="M25 44Q25 28 39 22Q50 17 61 22Q75 28 75 44L72 65Q68 79 50 82Q32 79 28 65Z" ${headStyle}/>${leftInnerEar}${rightInnerEar}`,
        muzzle: `<ellipse cx="43" cy="62" rx="10" ry="9" ${panelStyle}/><ellipse cx="57" cy="62" rx="10" ry="9" ${panelStyle}/>`,
        nose: `<path d="M46 58Q50 55 54 58Q52 62 50 62Q48 62 46 58Z" fill="${palette.ink}"/>`,
        details: `<path d="M35 62L24 59M35 66L23 67M65 62L76 59M65 66L77 67" fill="none" stroke="${palette.ink}" stroke-width="1.45" stroke-linecap="round" opacity="0.78"/>`,
      }, art);
    }

    case 'dog': {
      const leftEar = earGroup(
        `<path d="M34 30Q19 22 16 39Q14 57 26 69Q33 68 38 57L39 35Z" fill="${colors.externalMark}"/>`,
        'left', 30, 38, art,
      );
      const rightEar = earGroup(
        `<path d="M66 30Q81 22 84 39Q86 57 74 69Q67 68 62 57L61 35Z" fill="${colors.externalMark}"/>`,
        'right', 70, 38, art,
      );
      const leftInnerEar = earGroup(
        `<path d="M30 32Q22 30 21 41Q20 53 27 59Q31 55 33 47L34 35Z" ${innerStyle}/>`,
        'left', 30, 38, art,
      );
      const rightInnerEar = earGroup(
        `<path d="M70 32Q78 30 79 41Q80 53 73 59Q69 55 67 47L66 35Z" ${innerStyle}/>`,
        'right', 70, 38, art,
      );
      return faceLayout({
        silhouette: `
          ${leftEar}${rightEar}
          <path d="M28 25Q50 17 72 25Q79 35 76 57Q74 79 50 82Q26 79 24 57Q21 35 28 25Z" ${headStyle}/>
          ${leftInnerEar}${rightInnerEar}
        `,
        muzzle: `<ellipse cx="50" cy="62" rx="16" ry="13" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="57" rx="5.5" ry="4.2" fill="${palette.ink}"/>`,
        details: `<path d="M50 60V64" fill="none" stroke="${palette.ink}" stroke-width="1.5" stroke-linecap="round"/>`,
      }, art);
    }

    case 'fox':
      return faceLayout({
        silhouette: `
          <path d="M20 39L27 10L45 30ZM55 30L73 10L80 39Z" ${headStyle}/>
          <path d="M23 41Q27 24 43 21Q50 18 57 21Q73 24 77 41Q76 60 66 72Q58 82 50 85Q42 82 34 72Q24 60 23 41Z" ${headStyle}/>
          <path d="M27 31L31 17L41 31ZM59 31L69 17L73 31Z" ${innerStyle}/>
        `,
        muzzle: `<path d="M30 59Q41 52 50 61Q59 52 70 59Q65 76 50 82Q35 76 30 59Z" ${panelStyle}/>`,
        nose: `<path d="M46 60Q50 57 54 60Q52 64 50 64Q48 64 46 60Z" fill="${palette.ink}"/>`,
        details: `<path d="M36 66L26 64M64 66L74 64" fill="none" stroke="${palette.ink}" stroke-width="1.45" stroke-linecap="round" opacity="0.72"/>`,
      }, art);

    case 'bear': {
      const leftEar = earGroup(
        `<circle cx="26" cy="33" r="12.5" ${headStyle}/>`,
        'left', 26, 33, art,
      );
      const rightEar = earGroup(
        `<circle cx="74" cy="33" r="12.5" ${headStyle}/>`,
        'right', 74, 33, art,
      );
      const leftInnerEar = earGroup(
        `<circle cx="26" cy="32" r="6" ${innerStyle}/>`,
        'left', 26, 33, art,
      );
      const rightInnerEar = earGroup(
        `<circle cx="74" cy="32" r="6" ${innerStyle}/>`,
        'right', 74, 33, art,
      );
      return faceLayout({
        silhouette: `${leftEar}${rightEar}<path d="M25 45Q25 25 40 21Q50 18 60 21Q75 25 75 45L74 65Q72 82 50 86Q28 82 26 65Z" ${headStyle}/>${leftInnerEar}${rightInnerEar}`,
        muzzle: `<ellipse cx="50" cy="63" rx="15" ry="13" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="58" rx="5" ry="4" fill="${palette.ink}"/>`,
        details: '',
      }, art);
    }

    case 'rabbit':
      return faceLayout({
        silhouette: `
          <path d="M30 40Q25 20 30 7Q35 4 41 8Q45 22 42 39Z" ${headStyle}/>
          <path d="M58 39Q55 22 59 8Q65 4 70 7Q75 20 70 40Z" ${headStyle}/>
          <ellipse cx="50" cy="57" rx="26" ry="29" ${headStyle}/>
          <path d="M33 34Q30 20 34 11Q38 12 39 34ZM61 34Q61 15 66 11Q70 20 67 35Z" ${innerStyle}/>
        `,
        muzzle: `<ellipse cx="43" cy="64" rx="9" ry="10" ${panelStyle}/><ellipse cx="57" cy="64" rx="9" ry="10" ${panelStyle}/>`,
        nose: `<path d="M46 59Q50 56 54 59Q52 63 50 63Q48 63 46 59Z" fill="${palette.ink}"/>`,
        details: `<path d="M50 63V67" fill="none" stroke="${palette.ink}" stroke-width="1.5" stroke-linecap="round"/>`,
      }, art);

    case 'raccoon': {
      const leftEar = earGroup(
        `<circle cx="29" cy="30" r="10.5" fill="${colors.externalMark}"/>`,
        'left', 29, 30, art,
      );
      const rightEar = earGroup(
        `<circle cx="71" cy="30" r="10.5" fill="${colors.externalMark}"/>`,
        'right', 71, 30, art,
      );
      const leftInnerEar = earGroup(
        `<circle cx="29" cy="27.5" r="4.8" ${innerStyle}/>`,
        'left', 29, 30, art,
      );
      const rightInnerEar = earGroup(
        `<circle cx="71" cy="27.5" r="4.8" ${innerStyle}/>`,
        'right', 71, 30, art,
      );
      return faceLayout({
        silhouette: `
          ${leftEar}${rightEar}
          <path d="M24 43Q25 27 40 23Q50 19 60 23Q75 27 76 43L73 65Q68 81 50 83Q32 81 27 65Z" ${headStyle}/>
          ${leftInnerEar}${rightInnerEar}
          <path d="M28 45Q37 36 50 43Q63 36 72 45Q68 60 50 59Q32 60 28 45Z" fill="${softMark}"/>
          <ellipse cx="40.5" cy="49" rx="7" ry="6" ${panelStyle}/><ellipse cx="59.5" cy="49" rx="7" ry="6" ${panelStyle}/>
        `,
        muzzle: `<ellipse cx="50" cy="64" rx="14" ry="12" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="59" rx="4.8" ry="3.8" fill="${palette.ink}"/>`,
        details: '',
      }, art);
    }

    case 'panda': {
      const leftEar = earGroup(
        `<circle cx="29" cy="28" r="10.5" fill="${colors.externalMark}"/>`,
        'left', 29, 28, art,
      );
      const rightEar = earGroup(
        `<circle cx="71" cy="28" r="10.5" fill="${colors.externalMark}"/>`,
        'right', 71, 28, art,
      );
      return faceLayout({
        silhouette: `${leftEar}${rightEar}<circle cx="50" cy="54" r="30" ${headStyle}/><ellipse cx="39" cy="49" rx="9" ry="11" fill="${softMark}" transform="rotate(18 39 49)"/><ellipse cx="61" cy="49" rx="9" ry="11" fill="${softMark}" transform="rotate(-18 61 49)"/><ellipse cx="40.5" cy="49" rx="5.5" ry="5" ${panelStyle}/><ellipse cx="59.5" cy="49" rx="5.5" ry="5" ${panelStyle}/>`,
        muzzle: `<ellipse cx="50" cy="65" rx="14" ry="12" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="60" rx="5" ry="4" fill="${palette.ink}"/>`,
        details: '',
      }, art);
    }

    case 'tiger': {
      const leftEar = earGroup(
        `<path d="M20 40Q18 24 27 13Q31 10 35 15Q42 22 43 33L39 42Z" fill="${colors.externalMark}"/>`,
        'left', 29, 29, art,
      );
      const rightEar = earGroup(
        `<path d="M80 40Q82 24 73 13Q69 10 65 15Q58 22 57 33L61 42Z" fill="${colors.externalMark}"/>`,
        'right', 71, 29, art,
      );
      const leftInnerEar = earGroup(
        `<path d="M25 34Q24 24 29 18Q33 17 38 25L39 34Z" ${innerStyle}/>`,
        'left', 29, 29, art,
      );
      const rightInnerEar = earGroup(
        `<path d="M75 34Q76 24 71 18Q67 17 62 25L61 34Z" ${innerStyle}/>`,
        'right', 71, 29, art,
      );
      return faceLayout({
        silhouette: `${leftEar}${rightEar}<path d="M21 45Q21 27 37 21Q50 17 63 21Q79 27 79 45L76 66Q72 82 62 85Q50 89 38 85Q28 82 24 66Z" ${headStyle}/>${leftInnerEar}${rightInnerEar}<path d="M28 48L39 52M26 57L38 58M72 48L61 52M74 57L62 58" fill="none" stroke="${colors.strongMark}" stroke-width="1.8" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="43" cy="63" rx="10" ry="9" ${panelStyle}/><ellipse cx="57" cy="63" rx="10" ry="9" ${panelStyle}/>`,
        nose: `<path d="M46 59Q50 56 54 59Q52 63 50 63Q48 63 46 59Z" fill="${palette.ink}"/>`,
        details: `<path d="M35 64L24 62M65 64L76 62" fill="none" stroke="${palette.ink}" stroke-width="1.45" stroke-linecap="round" opacity="0.72"/>`,
      }, art);
    }

    case 'deer':
      return faceLayout({
        silhouette: `
          <path d="M35 29Q29 20 30 10M31 18L24 13M31 20L39 13M65 29Q71 20 70 10M69 18L76 13M69 20L61 13" fill="none" stroke="${colors.externalMark}" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M40 31Q27 18 16 27Q21 41 40 43M60 31Q73 18 84 27Q79 41 60 43" ${headStyle}/>
          <path d="M31 31Q50 18 69 31L67 61Q64 78 50 85Q36 78 33 61Z" ${headStyle}/>
          <path d="M22 28Q30 27 38 36M78 28Q70 27 62 36" fill="none" stroke="${colors.inner}" stroke-width="4" stroke-linecap="round"/>
        `,
        muzzle: `<ellipse cx="50" cy="67" rx="14" ry="12" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="62" rx="4.5" ry="3.6" fill="${palette.ink}"/>`,
        details: '',
      }, art);

    case 'koala':
      return faceLayout({
        silhouette: `
          <circle cx="22" cy="42" r="16" ${headStyle}/><circle cx="78" cy="42" r="16" ${headStyle}/>
          <path d="M29 31Q50 17 71 31Q79 46 73 66Q68 82 50 83Q32 82 27 66Q21 46 29 31Z" ${headStyle}/>
          <circle cx="22" cy="42" r="9" ${innerStyle}/><circle cx="78" cy="42" r="9" ${innerStyle}/>
        `,
        muzzle: `<ellipse cx="50" cy="65" rx="14" ry="13" ${panelStyle}/>`,
        nose: `<ellipse cx="50" cy="58" rx="7" ry="9" fill="${palette.ink}"/>`,
        details: '',
      }, art);

    case 'elephant':
      return faceLayout(species, {
        behind: `
          <path d="M31 35Q16 21 10 39Q9 63 30 72Q38 61 37 43Z" fill="${colors.externalMark}"/>
          <path d="M69 35Q84 21 90 39Q91 63 70 72Q62 61 63 43Z" fill="${colors.externalMark}"/>
        `,
        silhouette: `<path d="M29 31Q50 17 71 31Q79 47 72 67Q66 80 58 80Q59 91 50 92Q41 91 42 80Q34 80 28 67Q21 47 29 31Z" ${headStyle}/><path d="M18 40Q19 32 28 34Q31 50 27 62Q19 57 18 40ZM82 40Q81 32 72 34Q69 50 73 62Q81 57 82 40Z" ${innerStyle}/>` ,
        foreground: `<path d="M46 57Q50 53 54 57L55 82Q55 89 50 91Q45 89 45 82Z" ${panelStyle}/><path d="M47 81Q50 84 53 81" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<ellipse cx="50" cy="57" rx="4.6" ry="3.5" fill="${palette.ink}"/>`,
        details: `<path d="M31 55Q36 59 40 60M69 55Q64 59 60 60" fill="none" stroke="${softMark}" stroke-width="1.45" stroke-linecap="round"/>`,
      }, art);

    case 'owl':
      return faceLayout(species, {
        behind: `<path d="M22 29L30 13L40 27Q50 20 60 27L70 13L78 29Q86 44 78 67Q69 85 50 88Q31 85 22 67Q14 44 22 29Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M25 35Q34 20 50 27Q66 20 75 35L73 67Q65 80 50 84Q35 80 27 67Z" ${headStyle}/><path d="M27 39Q38 29 50 39Q62 29 73 39Q70 59 50 62Q30 59 27 39Z" ${innerStyle}/>` ,
        foreground: `<ellipse cx="39" cy="48" rx="12" ry="13" ${panelStyle}/><ellipse cx="61" cy="48" rx="12" ry="13" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<path d="M46 56L50 63L54 56Q50 53 46 56Z" fill="${palette.accent}"/>`,
        details: `<path d="M31 70Q39 75 45 72M69 70Q61 75 55 72" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>`,
      }, art);

    case 'dolphin':
      return faceLayout(species, {
        behind: `
          <path data-cue="fluke" d="M28 47Q15 40 7 32Q12 42 17 49Q12 55 9 63Q20 60 28 55Z" fill="${colors.externalMark}"/>
          <path data-cue="dorsal-fin" d="M38 30Q35 15 46 9Q48 20 58 30Z" fill="${colors.externalMark}"/>
          <path data-cue="pectoral-fin" d="M57 58Q46 66 44 79Q57 74 66 61Z" fill="${colors.externalMark}"/>
        `,
        silhouette: `<path data-cue="arched-body" d="M26 47Q31 27 50 22Q68 18 76 31Q79 37 79 41L93 45Q97 47 93 49L79 52Q73 63 58 66Q40 68 30 59Q23 53 26 47Z" ${headStyle}/>` ,
        foreground: `
          <path data-cue="belly" d="M26 51Q35 61 50 63Q66 65 79 51L78 55Q70 66 53 67Q37 66 28 57Z" ${panelStyle}/>
          <path data-cue="lower-beak" d="M79 47L93 45Q97 47 93 49L79 52Q82 49 79 47Z" ${panelStyle}/>
          <path data-cue="beak" d="M78 44Q85 48 92 45" fill="none" stroke="${softMark}" stroke-width="1.35" stroke-linecap="round"/>
          <path data-cue="blowhole" d="M52 23Q56 20 60 23" fill="none" stroke="${softMark}" stroke-width="1.6" stroke-linecap="round"/>
          <path d="M31 41Q40 27 56 24" fill="none" stroke="${colors.inner}" stroke-width="2.4" stroke-linecap="round"/>
        ` ,
        muzzle: '',
        nose: '',
        details: `<path d="M29 52Q23 51 19 54" fill="none" stroke="${softMark}" stroke-width="1.35" stroke-linecap="round"/>`,
      }, art);

    case 'turtle':
      return faceLayout(species, {
        behind: `<ellipse cx="50" cy="58" rx="37" ry="29" fill="${colors.externalMark}"/><path d="M20 58Q9 52 9 63Q15 72 27 68M80 58Q91 52 91 63Q85 72 73 68M31 78Q24 86 34 89M69 78Q76 86 66 89" fill="${colors.externalMark}"/>`,
        silhouette: `<ellipse cx="50" cy="53" rx="25" ry="28" ${headStyle}/><path d="M28 48Q50 30 72 48L68 75Q50 84 32 75Z" ${innerStyle}/>` ,
        foreground: `<path d="M38 39L50 31L62 39L68 53L61 70L50 78L39 70L32 53Z" fill="none" stroke="${softMark}" stroke-width="1.45" stroke-linejoin="round"/><path d="M32 53H68M50 31V78" fill="none" stroke="${softMark}" stroke-width="1.25"/>`,
        muzzle: `<ellipse cx="50" cy="64" rx="13" ry="11" ${panelStyle}/>` ,
        nose: `<ellipse cx="50" cy="60" rx="3.5" ry="2.7" fill="${palette.ink}"/>`,
        details: '',
      }, art);

    case 'parrot':
      return faceLayout(species, {
        behind: `<path d="M25 45Q13 51 19 75Q29 83 37 67M75 45Q87 51 81 75Q71 83 63 67" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M28 28Q39 16 50 25Q61 16 72 28Q80 45 70 68Q62 82 50 84Q38 82 30 68Q20 45 28 28Z" ${headStyle}/><path d="M30 41Q38 28 50 36Q62 28 70 41Q68 58 50 61Q32 58 30 41Z" ${innerStyle}/>` ,
        foreground: `<path d="M38 56Q50 47 62 56L58 68Q50 75 42 68Z" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<path d="M42 57Q50 50 58 57Q57 67 50 70Q43 67 42 57Z" fill="${palette.accent}"/><path d="M46 61Q50 58 54 61" fill="none" stroke="${softMark}" stroke-width="1.2" stroke-linecap="round"/>`,
        details: `<path d="M30 69Q36 75 41 77M70 69Q64 75 59 77" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'pufferfish':
      return faceLayout(species, {
        behind: `<path d="M50 10L55 24L65 14L67 29L81 23L76 37L91 39L78 49L89 59L74 61L78 76L64 70L59 85L50 73L41 85L36 70L22 76L26 61L11 59L22 49L9 39L24 37L19 23L33 29L35 14L45 24Z" fill="${colors.externalMark}"/>`,
        silhouette: `<circle cx="50" cy="50" r="31" ${headStyle}/><path d="M23 50Q14 43 14 54Q20 62 29 59M77 50Q86 43 86 54Q80 62 71 59" ${innerStyle}/>` ,
        foreground: `<ellipse cx="50" cy="62" rx="16" ry="12" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="50" cy="58" r="3" fill="${palette.ink}"/>`,
        details: `<path d="M31 35L36 39M69 35L64 39M30 68L36 64M70 68L64 64" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>`,
      }, art);

    case 'butterfly':
      return faceLayout(species, {
        behind: `<path d="M45 37Q32 12 14 20Q8 38 30 49Q9 56 18 78Q36 84 46 60ZM55 37Q68 12 86 20Q92 38 70 49Q91 56 82 78Q64 84 54 60Z" fill="${colors.externalMark}"/><path d="M42 39Q28 23 20 28Q22 41 39 49M58 39Q72 23 80 28Q78 41 61 49" fill="none" stroke="${colors.inner}" stroke-width="4" stroke-linecap="round"/>`,
        silhouette: `<ellipse cx="50" cy="50" rx="10" ry="24" ${headStyle}/><circle cx="50" cy="34" r="10" ${headStyle}/>` ,
        foreground: `<path d="M46 27Q39 16 35 20M54 27Q61 16 65 20" fill="none" stroke="${softMark}" stroke-width="1.6" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="49" rx="8" ry="9" ${panelStyle}/>` ,
        nose: `<circle cx="50" cy="48" r="2.3" fill="${palette.ink}"/>`,
        details: `<path d="M47 62L44 76M53 62L56 76" fill="none" stroke="${softMark}" stroke-width="1.45" stroke-linecap="round"/>`,
      }, art);

    case 'frog':
      return faceLayout(species, {
        behind: `<circle cx="34" cy="39" r="15" fill="${colors.externalMark}"/><circle cx="66" cy="39" r="15" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M22 48Q25 25 50 28Q75 25 78 48L75 69Q68 83 50 85Q32 83 25 69Z" ${headStyle}/><circle cx="34" cy="41" r="11" ${headStyle}/><circle cx="66" cy="41" r="11" ${headStyle}/>` ,
        foreground: `<ellipse cx="50" cy="65" rx="22" ry="15" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="45" cy="58" r="1.8" fill="${palette.ink}"/><circle cx="55" cy="58" r="1.8" fill="${palette.ink}"/>`,
        details: `<path d="M29 72Q36 78 41 78M71 72Q64 78 59 78" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'lion':
      return faceLayout(species, {
        behind: `<path d="M50 9L59 18L72 14L76 27L88 33L81 45L88 58L76 66L72 80L59 78L50 90L41 78L28 80L24 66L12 58L19 45L12 33L24 27L28 14L41 18Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M26 39Q30 21 50 21Q70 21 74 39L72 65Q67 81 50 84Q33 81 28 65Z" ${headStyle}/><circle cx="31" cy="35" r="8" ${innerStyle}/><circle cx="69" cy="35" r="8" ${innerStyle}/>` ,
        foreground: '',
        muzzle: `<ellipse cx="43" cy="63" rx="10" ry="9" ${panelStyle}/><ellipse cx="57" cy="63" rx="10" ry="9" ${panelStyle}/>` ,
        nose: `<path d="M45 58Q50 54 55 58Q53 63 50 63Q47 63 45 58Z" fill="${palette.ink}"/>`,
        details: `<path d="M35 66L25 64M65 66L75 64" fill="none" stroke="${palette.ink}" stroke-width="1.35" stroke-linecap="round" opacity="0.7"/>`,
      }, art);

    case 'toucan': {
      // Side profile: the oversized beak is the identity, but it grows out of
      // a full head — both eyes sit on the pale face patch beside the beak
      // base, never on the beak itself. On the warm coat the wing already
      // wears the guarded accent, so the beak swaps to the primary. Both beak
      // tones stay canvas-safe because the beak tip leaves the body.
      const warmBase = canvasSafeTone(palette.accent, palette);
      const beakColor = colors.base === warmBase
        ? canvasSafeTone(palette.primary, palette)
        : warmBase;
      const beakEdge = canvasSafeTone(tonalEdge(beakColor, palette.ink, 0.45), palette);
      return faceLayout(species, {
        behind: `<path data-cue="tail" d="M26 64Q13 70 12 82Q25 84 33 75Z" fill="${colors.externalMark}"/>`,
        silhouette: `
          <ellipse cx="40" cy="62" rx="22" ry="20" fill="${colors.externalMark}"/>
          <circle cx="54" cy="40" r="17" fill="${colors.externalMark}"/>
          <path d="M41 33Q52 24 64 31Q69 42 62 51Q51 57 42 50Q37 41 41 33Z" ${panelStyle}/>
          <path d="M45 52Q57 49 64 55Q65 65 56 69Q46 68 43 60Q42 55 45 52Z" ${panelStyle}/>
          <ellipse cx="34" cy="63" rx="11" ry="13" ${headStyle} transform="rotate(-12 34 63)"/>
          <path d="M29 56Q25 64 28 72" fill="none" stroke="${colors.inner}" stroke-width="1.8" stroke-linecap="round"/>
        `,
        foreground: `
          <path d="M62 30Q82 24 93 35Q97 40 93 45Q87 52 66 53Q60 44 62 30Z" fill="${beakColor}"/>
          <path d="M81 30Q90 34 93 38Q95 42 91 45Q86 49 79 48Q84 39 81 30Z" fill="${beakEdge}"/>
          <path d="M63 33Q64 42 68 50" fill="none" stroke="${colors.inner}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
          <path d="M66 33Q78 28 89 36" fill="none" stroke="${colors.inner}" stroke-width="1.8" stroke-linecap="round" opacity="0.8"/>
        `,
        muzzle: '',
        nose: `<ellipse cx="70" cy="37" rx="1.5" ry="1.1" fill="${palette.ink}"/>`,
        details: '',
      }, art);
    }

    case 'seal':
      return faceLayout(species, {
        behind: `<path d="M29 65Q13 68 13 82Q27 84 38 75M71 65Q87 68 87 82Q73 84 62 75" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M28 35Q34 20 50 22Q66 20 72 35L75 61Q72 80 50 86Q28 80 25 61Z" ${headStyle}/>` ,
        foreground: '',
        muzzle: `<ellipse cx="42" cy="63" rx="11" ry="9" ${panelStyle}/><ellipse cx="58" cy="63" rx="11" ry="9" ${panelStyle}/>` ,
        nose: `<path d="M45 58Q50 54 55 58Q53 63 50 63Q47 63 45 58Z" fill="${palette.ink}"/>`,
        details: `<path d="M36 64L23 61M36 68L22 69M64 64L77 61M64 68L78 69" fill="none" stroke="${palette.ink}" stroke-width="1.35" stroke-linecap="round" opacity="0.7"/>`,
      }, art);

    case 'chameleon':
      return faceLayout(species, {
        behind: `
          <path data-cue="tail-spiral" d="M58 74Q74 52 88 57Q99 63 95 77Q90 90 75 89Q63 87 64 76Q65 67 74 67Q82 67 82 75Q82 81 76 81" fill="none" stroke="${colors.externalMark}" stroke-width="8" stroke-linecap="round"/>
          <path data-cue="foot" d="M34 80Q28 87 35 91Q42 90 41 82Z" fill="${colors.externalMark}"/>
          <path data-cue="foot" d="M66 80Q72 87 65 91Q58 90 59 82Z" fill="${colors.externalMark}"/>
        `,
        silhouette: `
          <path data-cue="casque" d="M40 32Q35 11 50 5Q65 11 60 32Q50 26 40 32Z" ${headStyle}/>
          <path d="M32 44Q35 28 50 26Q65 28 68 44L72 64Q67 82 50 86Q33 82 28 64Z" ${headStyle}/>
          <circle data-cue="eye-turret" cx="37" cy="45" r="10" ${headStyle}/>
          <circle data-cue="eye-turret" cx="63" cy="45" r="10" ${headStyle}/>
        ` ,
        foreground: `
          <circle cx="37" cy="45" r="6.8" ${innerStyle}/>
          <circle cx="63" cy="45" r="6.8" ${innerStyle}/>
          <path data-cue="belly" d="M34 60Q50 52 66 60Q63 76 50 80Q37 76 34 60Z" ${panelStyle}/>
          <path data-cue="casque-ridge" d="M50 9V25" fill="none" stroke="${softMark}" stroke-width="1.45" stroke-linecap="round"/>
          <path data-cue="casque-rim" d="M41 29Q50 24 59 29" fill="none" stroke="${softMark}" stroke-width="1.45" stroke-linecap="round"/>
          <path data-cue="flank-stripes" d="M33 52Q31 61 34 70M67 52Q69 61 66 70" fill="none" stroke="${colors.inner}" stroke-width="2.2" stroke-linecap="round"/>
        `,
        muzzle: '',
        nose: `<circle cx="46" cy="56" r="1.7" fill="${palette.ink}"/><circle cx="54" cy="56" r="1.7" fill="${palette.ink}"/>`,
        details: `<path d="M32 70Q38 75 44 76M68 70Q62 75 56 76" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'octopus':
      return faceLayout(species, {
        behind: `<path d="M27 62Q11 68 19 83Q27 91 36 75Q28 89 41 91Q49 89 48 74Q48 91 57 91Q69 88 62 74Q72 90 81 82Q88 68 72 62Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M24 50Q23 22 50 17Q77 22 76 50L72 68Q62 78 50 79Q38 78 28 68Z" ${headStyle}/>` ,
        foreground: `<path d="M31 34Q50 25 69 34" fill="none" stroke="${colors.inner}" stroke-width="4" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="61" rx="16" ry="12" ${panelStyle}/>` ,
        nose: `<circle cx="50" cy="57" r="2.6" fill="${palette.ink}"/>`,
        details: `<circle cx="30" cy="74" r="2" fill="${colors.inner}"/><circle cx="40" cy="80" r="2" fill="${colors.inner}"/><circle cx="60" cy="80" r="2" fill="${colors.inner}"/><circle cx="70" cy="74" r="2" fill="${colors.inner}"/>`,
      }, art);

    case 'giraffe':
      return faceLayout(species, {
        behind: `<path d="M35 29L31 12M65 29L69 12" fill="none" stroke="${colors.externalMark}" stroke-width="5" stroke-linecap="round"/><circle cx="31" cy="10" r="5" fill="${colors.externalMark}"/><circle cx="69" cy="10" r="5" fill="${colors.externalMark}"/><path d="M38 31Q25 18 16 28Q23 40 39 41M62 31Q75 18 84 28Q77 40 61 41" ${headStyle}/>` ,
        silhouette: `<path d="M34 29Q50 19 66 29L65 61Q62 72 58 76L60 91H40L42 76Q38 72 35 61Z" ${headStyle}/>` ,
        foreground: `<path d="M40 32Q50 26 60 32" fill="none" stroke="${colors.inner}" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="57" r="4" fill="${colors.strongMark}"/><circle cx="63" cy="38" r="3.5" fill="${colors.strongMark}"/><circle cx="56" cy="76" r="4" fill="${colors.strongMark}"/>`,
        muzzle: `<ellipse cx="50" cy="64" rx="14" ry="12" ${panelStyle}/>` ,
        nose: `<circle cx="44" cy="62" r="2" fill="${palette.ink}"/><circle cx="56" cy="62" r="2" fill="${palette.ink}"/>`,
        details: '',
      }, art);

    case 'shark':
      return faceLayout(species, {
        behind: `<path d="M43 31Q50 10 59 31L61 39Z" fill="${colors.externalMark}"/><path d="M29 58Q12 57 10 69Q22 77 37 68M71 58Q88 57 90 69Q78 77 63 68" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M24 41Q30 22 50 21Q70 22 76 41L74 64Q68 80 50 84Q32 80 26 64Z" ${headStyle}/><path d="M29 58Q50 48 71 58Q68 76 50 80Q32 76 29 58Z" ${panelStyle}/>` ,
        foreground: `<path d="M34 65Q50 77 66 65" fill="none" stroke="${palette.ink}" stroke-width="1.4" stroke-linecap="round"/><path d="M40 70L43 74L46 70M54 70L57 74L60 70" fill="${palette.canvas}" stroke="none"/>`,
        muzzle: '',
        nose: `<circle cx="50" cy="58" r="2.6" fill="${palette.ink}"/>`,
        details: `<path d="M29 51L23 48M71 51L77 48" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'axolotl':
      return faceLayout(species, {
        behind: `<path d="M31 37L18 18M29 43L12 35M30 50L13 54M69 37L82 18M71 43L88 35M70 50L87 54" fill="none" stroke="${colors.externalMark}" stroke-width="7" stroke-linecap="round"/><path d="M18 18L13 11M18 18L24 11M12 35L5 31M12 35L8 42M13 54L7 58M13 54L11 47M82 18L76 11M82 18L87 11M88 35L95 31M88 35L92 42M87 54L93 58M87 54L89 47" fill="none" stroke="${colors.inner}" stroke-width="3" stroke-linecap="round"/>`,
        silhouette: `<path d="M27 35Q34 19 50 20Q66 19 73 35L72 65Q66 80 50 83Q34 80 28 65Z" ${headStyle}/>` ,
        foreground: `<ellipse cx="50" cy="63" rx="16" ry="12" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="50" cy="58" r="2.4" fill="${palette.ink}"/>`,
        details: `<path d="M31 69Q38 75 43 75M69 69Q62 75 57 75" fill="none" stroke="${softMark}" stroke-width="1.35" stroke-linecap="round"/>`,
      }, art);

    case 'eagle':
      return faceLayout(species, {
        behind: `<path d="M22 34Q29 17 50 20Q71 17 78 34L74 61Q68 79 50 85Q32 79 26 61Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M26 37Q34 22 50 25Q66 22 74 37L70 57Q63 69 50 71Q37 69 30 57Z" ${headStyle}/><path d="M27 61L35 57L39 67L46 62L50 73L54 62L61 67L65 57L73 61Q68 81 50 86Q32 81 27 61Z" ${panelStyle}/>` ,
        foreground: `<path d="M30 39Q40 31 48 39M70 39Q60 31 52 39" fill="none" stroke="${softMark}" stroke-width="2.2" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<path d="M43 55Q50 48 57 55Q54 66 50 69Q46 66 43 55Z" fill="${palette.accent}"/>`,
        details: '',
      }, art);

    case 'zebra':
      return faceLayout(species, {
        behind: `<path d="M38 32Q26 18 18 29Q24 42 39 43M62 32Q74 18 82 29Q76 42 61 43" ${headStyle}/><path d="M42 31L43 11L50 19L57 10L58 31Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M34 28Q50 19 66 28L68 58Q65 77 50 85Q35 77 32 58Z" ${headStyle}/>` ,
        foreground: `<path d="M43 23L47 37M55 22L52 38M34 43L44 48M66 43L56 48M34 55L44 57M66 55L56 57" fill="none" stroke="${colors.strongMark}" stroke-width="3" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="67" rx="14" ry="12" ${panelStyle}/>` ,
        nose: `<ellipse cx="50" cy="63" rx="4.4" ry="3.4" fill="${palette.ink}"/>`,
        details: '',
      }, art);

    case 'crab':
      return faceLayout(species, {
        behind: `
          <path d="M30 66L21 74M36 71L30 81M45 74L42 84M70 66L79 74M64 71L70 81M55 74L58 84" fill="none" stroke="${colors.externalMark}" stroke-width="4.5" stroke-linecap="round"/>
          <path d="M32 52Q21 47 16 38M68 52Q79 47 84 38" fill="none" stroke="${colors.externalMark}" stroke-width="7" stroke-linecap="round"/>
          <path d="M17 40Q8 38 8 29Q8 20 15 21L17 28L21 21Q28 22 27 30Q26 38 17 40Z" fill="${colors.externalMark}"/>
          <path d="M83 40Q92 38 92 29Q92 20 85 21L83 28L79 21Q72 22 73 30Q74 38 83 40Z" fill="${colors.externalMark}"/>
        `,
        silhouette: `
          <path d="M22 52Q26 36 50 34Q74 36 78 52L74 68Q64 78 50 78Q36 78 26 68Z" ${headStyle}/>
          <path d="M41 42L36 31M59 42L64 31" fill="none" stroke="${colors.base}" stroke-width="6" stroke-linecap="round"/>
          <circle cx="35" cy="29" r="6.5" ${panelStyle}/><circle cx="65" cy="29" r="6.5" ${panelStyle}/>
        `,
        foreground: `<path d="M31 51Q50 42 69 51" fill="none" stroke="${colors.inner}" stroke-width="2.4" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="62" rx="15" ry="11" ${panelStyle}/>`,
        nose: `<circle cx="50" cy="56" r="2.2" fill="${palette.ink}"/>`,
        details: `<path d="M26 60Q22 62 20 66M74 60Q78 62 80 66" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'crocodile':
      return faceLayout(species, {
        behind: `<path d="M23 41L27 30L33 40ZM45 35L50 23L55 35ZM67 40L73 30L77 41Z" fill="${colors.externalMark}" stroke="${colors.externalMark}" stroke-width="2.4" stroke-linejoin="round"/>`,
        silhouette: `<path d="M27 52Q24 40 32 36Q33 28 39 28Q45 28 45 36Q50 33 55 36Q55 28 61 28Q67 28 68 36Q76 40 73 52L71 66Q67 81 50 83Q33 81 29 66Z" ${headStyle}/><path d="M25 54Q50 47 75 54L72 68Q67 81 50 83Q33 81 28 68Z" ${panelStyle}/>` ,
        foreground: `<path d="M28 70L31.5 62L35 70M65 70L68.5 62L72 70" fill="${colors.strongMark}" stroke="${colors.strongMark}" stroke-width="1.4" stroke-linejoin="round"/>`,
        muzzle: '',
        nose: `<ellipse cx="44" cy="57" rx="2.3" ry="1.9" fill="${palette.ink}"/><ellipse cx="56" cy="57" rx="2.3" ry="1.9" fill="${palette.ink}"/>`,
        details: `<path d="M34 38Q39 35 44 38M56 38Q61 35 66 38M27 64Q50 73 73 64" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>`,
      }, art);

    case 'penguin':
      return faceLayout(species, {
        behind: `<path d="M28 52Q13 57 18 77Q28 83 38 69M72 52Q87 57 82 77Q72 83 62 69" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M29 31Q36 17 50 18Q64 17 71 31Q79 48 72 70Q66 84 50 87Q34 84 28 70Q21 48 29 31Z" fill="${colors.externalMark}"/><path d="M33 38Q40 26 50 34Q60 26 67 38L67 66Q61 80 50 82Q39 80 33 66Z" ${panelStyle}/>` ,
        foreground: `<path d="M42 56Q50 48 58 56L50 64Z" fill="${palette.accent}"/>`,
        muzzle: '',
        nose: `<circle cx="50" cy="56" r="2" fill="${palette.ink}"/>`,
        details: `<path d="M39 84L31 89M61 84L69 89" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>`,
      }, art);

    case 'whale':
      return faceLayout(species, {
        behind: `<path data-cue="flipper" d="M28 57Q12 55 7 66Q19 76 35 68M72 57Q88 55 93 66Q81 76 65 68" fill="${colors.externalMark}"/><path data-cue="flukes" d="M44 76Q30 78 26 90Q41 91 50 82Q59 91 74 90Q70 78 56 76Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path data-cue="broad-body" d="M20 47Q22 24 50 19Q78 24 80 47L76 65Q68 79 56 80Q50 85 44 80Q32 79 24 65Z" ${headStyle}/>` ,
        foreground: `<path d="M28 59Q50 50 72 59Q67 74 56 77Q50 81 44 77Q33 74 28 59Z" ${panelStyle}/><ellipse data-cue="blowhole" cx="50" cy="31" rx="3.4" ry="1.8" fill="${softMark}"/>`,
        muzzle: '',
        nose: '',
        details: `<path d="M24 56Q18 53 14 56M76 56Q82 53 86 56" fill="none" stroke="${softMark}" stroke-width="1.35" stroke-linecap="round"/>`,
      }, art);

    case 'mouse':
      return faceLayout(species, {
        behind: `<circle cx="26" cy="32" r="15" fill="${colors.externalMark}"/><circle cx="74" cy="32" r="15" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M27 39Q32 22 50 22Q68 22 73 39L71 63Q65 80 50 85Q35 80 29 63Z" ${headStyle}/><circle cx="26" cy="32" r="8" ${innerStyle}/><circle cx="74" cy="32" r="8" ${innerStyle}/>` ,
        foreground: `<path d="M39 61Q50 51 61 61Q57 76 50 81Q43 76 39 61Z" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="50" cy="59" r="4" fill="${palette.ink}"/>`,
        details: `<path d="M39 64L24 60M39 68L23 69M61 64L76 60M61 68L77 69" fill="none" stroke="${palette.ink}" stroke-width="1.25" stroke-linecap="round" opacity="0.68"/>`,
      }, art);

    case 'duck':
      return faceLayout(species, {
        behind: `<path d="M27 57Q14 63 18 78Q29 83 39 70M73 57Q86 63 82 78Q71 83 61 70" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M28 31Q37 18 50 21Q63 18 72 31Q79 48 71 68Q64 82 50 84Q36 82 29 68Q21 48 28 31Z" ${headStyle}/>` ,
        foreground: `<path d="M34 57Q50 46 66 57Q63 68 50 70Q37 68 34 57Z" fill="${palette.accent}"/><path d="M39 58H61" stroke="${softMark}" stroke-width="1.2" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<circle cx="50" cy="57" r="2" fill="${palette.ink}"/>`,
        details: `<path d="M34 73Q40 79 45 79M66 73Q60 79 55 79" fill="none" stroke="${colors.inner}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'salamander':
      return faceLayout(species, {
        behind: `
          <path data-cue="limb" d="M62 35Q68 27 71 20" fill="none" stroke="${colors.externalMark}" stroke-width="6.5" stroke-linecap="round"/>
          <path data-cue="limb" d="M66 59Q70 67 73 74" fill="none" stroke="${colors.externalMark}" stroke-width="6.5" stroke-linecap="round"/>
          <path data-cue="limb" d="M34 42Q27 36 22 30" fill="none" stroke="${colors.externalMark}" stroke-width="6.5" stroke-linecap="round"/>
          <path data-cue="limb" d="M37 56Q31 63 26 70" fill="none" stroke="${colors.externalMark}" stroke-width="6.5" stroke-linecap="round"/>
          <circle cx="72" cy="18" r="3.8" fill="${colors.inner}"/>
          <circle cx="74" cy="76" r="3.8" fill="${colors.inner}"/>
          <circle cx="21" cy="28" r="3.8" fill="${colors.inner}"/>
          <circle cx="25" cy="72" r="3.8" fill="${colors.inner}"/>
          <path data-cue="tail" d="M40 39Q22 43 8 61Q18 55 36 57Z" ${headStyle}/>
        `,
        silhouette: `<path d="M85 47Q87 37 77 32Q64 26 51 30Q37 34 26 42Q22 50 27 57Q40 60 51 63Q64 69 76 64Q85 58 85 47Z" ${headStyle}/>` ,
        foreground: `<ellipse cx="66" cy="56" rx="14" ry="9" ${panelStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="80" cy="45" r="1.4" fill="${softMark}"/>`,
        details: `<g fill="${colors.strongMark}"><circle cx="70" cy="35" r="2.6"/><circle cx="58" cy="33" r="2.5"/><circle cx="46" cy="37" r="2.4"/><circle cx="34" cy="44" r="2.3"/><circle cx="23" cy="52" r="2.1"/><circle cx="14" cy="58" r="1.8"/></g>`,
      }, art);

    case 'manta-ray':
      return faceLayout(species, {
        behind: `<path data-cue="diamond-wings" d="M50 21Q27 17 5 39Q16 62 40 70Q50 75 60 70Q84 62 95 39Q73 17 50 21Z" fill="${colors.externalMark}"/><path data-cue="tail" d="M46 65Q48 81 50 94Q52 81 54 65Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M50 25Q31 22 12 40Q25 58 43 63Q50 68 57 63Q75 58 88 40Q69 22 50 25Z" ${headStyle}/><path d="M47 59Q49 72 50 83Q51 72 53 59Z" ${headStyle}/>` ,
        foreground: `<path d="M27 43Q50 29 73 43Q67 62 50 67Q33 62 27 43Z" ${panelStyle}/><path data-cue="cephalic-lobe" d="M43 31Q36 21 31 27Q33 37 43 40Z" ${innerStyle}/><path data-cue="cephalic-lobe" d="M57 31Q64 21 69 27Q67 37 57 40Z" ${innerStyle}/>` ,
        muzzle: '',
        nose: `<circle cx="50" cy="55" r="2.1" fill="${palette.ink}"/>`,
        details: `<path d="M20 44Q13 41 10 44M80 44Q87 41 90 44" fill="none" stroke="${softMark}" stroke-width="1.3" stroke-linecap="round"/>`,
      }, art);

    case 'snail':
      return faceLayout(species, {
        behind: `<circle cx="63" cy="58" r="26" fill="${colors.externalMark}"/><path d="M63 42Q77 43 77 57Q77 70 64 70Q53 70 53 60Q53 51 62 51Q69 51 69 58Q69 63 64 63" fill="none" stroke="${colors.inner}" stroke-width="4" stroke-linecap="round"/>`,
        silhouette: `<path d="M18 68Q20 49 38 48Q55 49 60 68Q72 72 84 68Q86 79 74 83H28Q17 81 18 68Z" ${headStyle}/><path d="M35 49L32 31M47 49L50 31" fill="none" stroke="${colors.base}" stroke-width="5" stroke-linecap="round"/>` ,
        foreground: `<circle cx="32" cy="30" r="6" ${innerStyle}/><circle cx="50" cy="30" r="6" ${innerStyle}/>` ,
        muzzle: `<ellipse cx="43" cy="58" rx="14" ry="10" ${panelStyle}/>` ,
        nose: `<circle cx="43" cy="54" r="2.2" fill="${palette.ink}"/>`,
        details: `<path d="M27 75H73" fill="none" stroke="${softMark}" stroke-width="1.3" stroke-linecap="round"/>`,
      }, art);

    case 'chicken':
      return faceLayout(species, {
        behind: `<path d="M39 28Q34 13 44 12Q50 17 49 27Q51 10 59 13Q66 20 59 31Z" fill="${colors.externalMark}"/><path d="M25 58Q13 64 19 79Q31 84 39 70M75 58Q87 64 81 79Q69 84 61 70" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M29 32Q38 19 50 23Q62 19 71 32Q78 49 71 68Q64 81 50 84Q36 81 29 68Q22 49 29 32Z" ${headStyle}/>` ,
        foreground: `<path d="M42 57Q50 50 58 57L50 64Z" fill="${palette.accent}"/><path d="M46 65Q50 74 54 65" fill="${colors.externalMark}"/>`,
        muzzle: '',
        nose: `<circle cx="50" cy="57" r="2" fill="${palette.ink}"/>`,
        details: `<path d="M34 72Q40 78 45 79M66 72Q60 78 55 79" fill="none" stroke="${colors.inner}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'anglerfish':
      return faceLayout(species, {
        behind: `<path d="M64 35Q67 15 78 17Q85 20 81 27" fill="none" stroke="${colors.externalMark}" stroke-width="3" stroke-linecap="round"/><circle cx="81" cy="25" r="7" fill="${colors.inner}"/><path d="M27 55Q12 48 10 61Q18 72 34 66M73 55Q88 48 90 61Q82 72 66 66" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M22 42Q30 22 50 23Q70 22 78 42L75 66Q67 82 50 84Q33 82 25 66Z" ${headStyle}/><path d="M27 60Q50 48 73 60Q69 78 50 81Q31 78 27 60Z" ${panelStyle}/>` ,
        foreground: `<path d="M34 66Q50 77 66 66" fill="none" stroke="${palette.ink}" stroke-width="1.5" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<circle cx="50" cy="58" r="2.4" fill="${palette.ink}"/>`,
        details: `<circle cx="31" cy="51" r="2.2" fill="${colors.strongMark}"/><circle cx="69" cy="53" r="2.2" fill="${colors.strongMark}"/>`,
      }, art);

    case 'iguana':
      return faceLayout(species, {
        behind: `<path d="M30 34L31 18L40 29L47 12L53 29L62 15L66 33L77 25L72 41Z" fill="${colors.externalMark}"/><path d="M70 65Q88 66 87 80Q79 88 68 78" fill="none" stroke="${colors.externalMark}" stroke-width="7" stroke-linecap="round"/>`,
        silhouette: `<path d="M25 39Q32 22 50 23Q68 22 75 39L72 66Q65 81 50 84Q35 81 28 66Z" ${headStyle}/><path d="M32 57Q50 48 68 57Q64 74 50 79Q36 74 32 57Z" ${panelStyle}/>` ,
        foreground: `<path d="M29 43Q37 35 45 38M71 43Q63 35 55 38" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<circle cx="44" cy="58" r="2" fill="${palette.ink}"/><circle cx="56" cy="58" r="2" fill="${palette.ink}"/>`,
        details: `<circle cx="34" cy="68" r="2.2" fill="${colors.strongMark}"/><circle cx="66" cy="68" r="2.2" fill="${colors.strongMark}"/>`,
      }, art);

    case 'pig':
      return faceLayout(species, {
        behind: `<path d="M35 34Q22 19 17 29Q19 43 36 45M65 34Q78 19 83 29Q81 43 64 45" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M25 40Q29 22 50 21Q71 22 75 40L73 66Q68 82 50 85Q32 82 27 66Z" ${headStyle}/><path d="M24 31Q27 24 33 29L36 40M76 31Q73 24 67 29L64 40" fill="none" stroke="${colors.inner}" stroke-width="3" stroke-linecap="round"/>` ,
        foreground: '',
        muzzle: `<ellipse cx="50" cy="64" rx="16" ry="12" ${panelStyle}/>` ,
        nose: `<ellipse cx="50" cy="61" rx="9" ry="6.5" fill="${colors.inner}"/><circle cx="46" cy="61" r="1.8" fill="${palette.ink}"/><circle cx="54" cy="61" r="1.8" fill="${palette.ink}"/>`,
        details: `<path d="M34 70Q40 76 44 77M66 70Q60 76 56 77" fill="none" stroke="${softMark}" stroke-width="1.35" stroke-linecap="round"/>`,
      }, art);

    case 'peacock':
      return faceLayout(species, {
        behind: `<path d="M50 68Q23 82 11 62Q9 42 26 29Q34 16 50 29Q66 16 74 29Q91 42 89 62Q77 82 50 68Z" fill="${colors.externalMark}"/><g fill="${colors.inner}"><circle cx="25" cy="47" r="6"/><circle cx="38" cy="35" r="6"/><circle cx="62" cy="35" r="6"/><circle cx="75" cy="47" r="6"/><circle cx="50" cy="27" r="6"/></g>`,
        silhouette: `<path d="M36 36Q40 22 50 24Q60 22 64 36L62 65Q59 80 50 84Q41 80 38 65Z" ${headStyle}/>` ,
        foreground: `<path d="M42 25Q37 13 32 17M50 23Q50 10 50 9M58 25Q63 13 68 17" fill="none" stroke="${colors.inner}" stroke-width="2.2" stroke-linecap="round"/><circle cx="32" cy="17" r="3" fill="${palette.accent}"/><circle cx="50" cy="9" r="3" fill="${palette.accent}"/><circle cx="68" cy="17" r="3" fill="${palette.accent}"/>`,
        muzzle: `<ellipse cx="50" cy="61" rx="11" ry="10" ${panelStyle}/>` ,
        nose: `<path d="M45 56L50 64L55 56Q50 52 45 56Z" fill="${palette.accent}"/>`,
        details: '',
      }, art);

    case 'gecko':
      return faceLayout(species, {
        behind: `
          <path d="M36 72Q17 77 14 88Q14 97 25 96Q33 94 31 85" fill="none" stroke="${colors.externalMark}" stroke-width="8" stroke-linecap="round"/>
          <path d="M30 57Q18 59 13 67M70 57Q82 59 87 67M38 77Q31 85 33 92M62 77Q69 85 67 92" fill="none" stroke="${colors.externalMark}" stroke-width="5.5" stroke-linecap="round"/>
          <g fill="${colors.inner}"><circle cx="9" cy="63" r="2.2"/><circle cx="7.5" cy="68.5" r="2.2"/><circle cx="11.5" cy="72" r="2.2"/><circle cx="91" cy="63" r="2.2"/><circle cx="92.5" cy="68.5" r="2.2"/><circle cx="88.5" cy="72" r="2.2"/><circle cx="28" cy="91" r="2.2"/><circle cx="32" cy="96" r="2.2"/><circle cx="37" cy="94" r="2.2"/><circle cx="72" cy="91" r="2.2"/><circle cx="68" cy="96" r="2.2"/><circle cx="63" cy="94" r="2.2"/></g>
        `,
        silhouette: `<path d="M27 40Q31 23 50 22Q69 23 73 40Q76 51 70 61Q63 75 50 78Q37 75 30 61Q24 51 27 40Z" ${headStyle}/>` ,
        foreground: `
          <ellipse cx="39" cy="46" rx="10" ry="9" ${innerStyle}/>
          <ellipse cx="61" cy="46" rx="10" ry="9" ${innerStyle}/>
          <path d="M31 43Q39 36 47 43M53 43Q61 36 69 43" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="33" cy="32" r="2.4" fill="${colors.inner}"/><circle cx="67" cy="32" r="2.4" fill="${colors.inner}"/><circle cx="50" cy="27" r="2" fill="${colors.inner}"/>
        `,
        muzzle: `<ellipse cx="50" cy="64" rx="15" ry="11" ${panelStyle}/>` ,
        nose: `<circle cx="45" cy="59" r="1.8" fill="${palette.ink}"/><circle cx="55" cy="59" r="1.8" fill="${palette.ink}"/>`,
        details: `<circle cx="33" cy="62" r="2.2" fill="${colors.strongMark}"/><circle cx="67" cy="62" r="2.2" fill="${colors.strongMark}"/>`,
      }, art);

    case 'bee':
      return faceLayout(species, {
        behind: `<ellipse cx="32" cy="47" rx="18" ry="25" fill="${colors.inner}" transform="rotate(-24 32 47)"/><ellipse cx="68" cy="47" rx="18" ry="25" fill="${colors.inner}" transform="rotate(24 68 47)"/>`,
        silhouette: `<ellipse cx="50" cy="53" rx="22" ry="31" ${headStyle}/><circle cx="50" cy="32" r="16" ${headStyle}/>` ,
        foreground: `<path d="M42 27Q35 16 31 21M58 27Q65 16 69 21" fill="none" stroke="${softMark}" stroke-width="1.6" stroke-linecap="round"/><path d="M29 52H71M31 63H69M36 74H64" fill="none" stroke="${colors.strongMark}" stroke-width="5" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="52" rx="12" ry="10" ${panelStyle}/>` ,
        nose: `<circle cx="50" cy="49" r="2.3" fill="${palette.ink}"/>`,
        details: `<path d="M39 81L35 88M61 81L65 88" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);

    case 'alpaca': {
      const leftEar = earGroup(
        `<path d="M37 27Q28 12 21 18Q22 31 35 35Z" ${headStyle}/>`,
        'left', 34, 30, art,
      );
      const rightEar = earGroup(
        `<path d="M63 27Q72 12 79 18Q78 31 65 35Z" ${headStyle}/>`,
        'right', 66, 30, art,
      );
      const leftInnerEar = earGroup(
        `<path d="M33 26Q28 17 24 20Q25 29 33 31Z" ${innerStyle}/>`,
        'left', 34, 30, art,
      );
      const rightInnerEar = earGroup(
        `<path d="M67 26Q72 17 76 20Q75 29 67 31Z" ${innerStyle}/>`,
        'right', 66, 30, art,
      );
      return faceLayout(species, {
        behind: '',
        silhouette: `
          <path d="M41 56Q39 74 37 90Q41 93 45 90Q48 94 50 91Q52 94 55 90Q59 93 63 90Q61 74 59 56Q55 61 50 61Q45 61 41 56Z" ${headStyle}/>
          ${leftEar}${rightEar}
          <path d="M32 40Q30 25 42 22Q50 19 58 22Q70 25 68 40L66 56Q62 68 50 69Q38 68 34 56Z" ${headStyle}/>
          ${leftInnerEar}${rightInnerEar}
          <path d="M34 31Q35 21 42 25Q44 15 50 21Q56 15 58 25Q65 21 66 31Q61 36 50 34Q39 36 34 31Z" ${innerStyle}/>
        `,
        foreground: `<path d="M44 64Q42 75 43 86" fill="none" stroke="${colors.inner}" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`,
        muzzle: `<ellipse cx="50" cy="61" rx="12" ry="10" ${panelStyle}/>`,
        nose: `<path d="M46 57Q50 54 54 57Q52 61 50 61Q48 61 46 57Z" fill="${palette.ink}"/>`,
        details: `<path d="M50 61V64" fill="none" stroke="${palette.ink}" stroke-width="1.4" stroke-linecap="round"/>`,
      }, art);
    }

    case 'jellyfish':
      return faceLayout(species, {
        behind: `<path d="M31 64Q23 74 29 88M42 65Q35 78 42 91M58 65Q65 78 58 91M69 64Q77 74 71 88" fill="none" stroke="${colors.externalMark}" stroke-width="6" stroke-linecap="round"/>`,
        silhouette: `<path d="M20 53Q21 22 50 18Q79 22 80 53L74 64Q68 58 62 64Q56 58 50 64Q44 58 38 64Q32 58 26 64Z" ${headStyle}/>` ,
        foreground: `<path d="M27 40Q50 27 73 40" fill="none" stroke="${colors.inner}" stroke-width="3" stroke-linecap="round"/>`,
        muzzle: `<ellipse cx="50" cy="54" rx="15" ry="10" ${panelStyle}/>` ,
        nose: `<circle cx="50" cy="51" r="2.2" fill="${palette.ink}"/>`,
        details: `<circle cx="31" cy="48" r="2" fill="${colors.strongMark}"/><circle cx="69" cy="48" r="2" fill="${colors.strongMark}"/>`,
      }, art);

    case 'bat':
      return faceLayout(species, {
        behind: `<path d="M31 53Q15 40 8 48Q15 54 10 65Q20 64 22 76Q31 69 40 72M69 53Q85 40 92 48Q85 54 90 65Q80 64 78 76Q69 69 60 72" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M30 40L25 13L43 31Q50 24 57 31L75 13L70 40L72 64Q65 79 50 83Q35 79 28 64Z" ${headStyle}/><path d="M31 34L29 21L40 34ZM60 34L71 21L69 34Z" ${innerStyle}/>` ,
        foreground: '',
        muzzle: `<ellipse cx="43" cy="63" rx="9" ry="9" ${panelStyle}/><ellipse cx="57" cy="63" rx="9" ry="9" ${panelStyle}/>` ,
        nose: `<path d="M46 58Q50 55 54 58Q52 62 50 62Q48 62 46 58Z" fill="${palette.ink}"/>`,
        details: `<path d="M43 72L46 77L49 72M51 72L54 77L57 72" fill="${palette.canvas}"/>`,
      }, art);

    case 'clownfish':
      return faceLayout(species, {
        behind: `<path data-cue="tail-fin" d="M25 47Q12 30 6 38Q12 49 6 61Q16 69 28 58Z" fill="${colors.externalMark}"/><path data-cue="fin" d="M45 29Q51 14 61 26L62 34ZM46 69Q52 84 62 72L62 64Z" fill="${colors.externalMark}"/>`,
        silhouette: `<path d="M20 48Q29 25 57 23Q77 25 84 43Q88 48 84 53Q77 71 57 75Q30 74 20 48Z" ${headStyle}/>` ,
        foreground: `<path data-cue="authored-band" d="M34 30Q39 27 45 26Q40 48 45 70Q39 69 34 66Q29 49 34 30Z" ${panelStyle}/><path data-cue="authored-band" d="M58 23Q65 23 70 27Q65 48 70 68Q64 72 58 73Q52 48 58 23Z" ${panelStyle}/><path d="M25 39Q31 44 31 53Q28 58 24 59" fill="none" stroke="${colors.inner}" stroke-width="2.2" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<circle cx="77" cy="50" r="1.1" fill="${softMark}"/>`,
        details: `<path d="M21 49Q15 47 11 50" fill="none" stroke="${softMark}" stroke-width="1.3" stroke-linecap="round"/>`,
      }, art);

    case 'toad':
      return faceLayout(species, {
        behind: `<path d="M28 66Q12 70 14 84Q27 92 41 77M72 66Q88 70 86 84Q73 92 59 77" fill="${colors.externalMark}"/>`,
        silhouette: `<path data-cue="squat-body" d="M16 53Q18 39 29 35Q32 25 42 34Q50 29 58 34Q68 25 71 35Q82 39 84 53L79 70Q69 84 50 86Q31 84 21 70Z" ${headStyle}/>` ,
        foreground: `<path d="M31 64Q50 57 69 64Q66 77 50 80Q34 77 31 64Z" ${panelStyle}/><circle data-cue="wart" cx="24" cy="51" r="2.8" fill="${colors.strongMark}"/><circle data-cue="wart" cx="76" cy="52" r="2.5" fill="${colors.strongMark}"/><circle data-cue="wart" cx="30" cy="42" r="2.2" fill="${colors.strongMark}"/><circle data-cue="wart" cx="70" cy="41" r="2.3" fill="${colors.strongMark}"/><circle data-cue="wart" cx="35" cy="70" r="2" fill="${colors.strongMark}"/><circle data-cue="wart" cx="66" cy="72" r="1.9" fill="${colors.strongMark}"/>`,
        muzzle: '',
        nose: `<circle cx="44" cy="59" r="1.8" fill="${palette.ink}"/><circle cx="56" cy="59" r="1.8" fill="${palette.ink}"/>`,
        details: `<path d="M20 63Q15 65 12 69M80 63Q85 65 88 69" fill="none" stroke="${softMark}" stroke-width="1.3" stroke-linecap="round"/>`,
      }, art);

    case 'snake':
      return faceLayout(species, {
        behind: `
          <path data-cue="coil" d="M24 82Q21 66 37 63Q50 60 63 63Q79 66 76 82Q73 92 50 93Q27 92 24 82Z" fill="${colors.base}"/>
          <path d="M31 74Q50 68 69 74" fill="none" stroke="${softMark}" stroke-width="1.5" stroke-linecap="round"/>
          <path data-cue="tail" d="M36 67Q24 71 19 81Q16 88 23 89" fill="none" stroke="${colors.base}" stroke-width="5.5" stroke-linecap="round"/>
          <path data-cue="tail-ridge" d="M33 70Q25 74 22 82" fill="none" stroke="${softMark}" stroke-width="1.4" stroke-linecap="round"/>
        `,
        silhouette: `<path d="M35 27Q38 14 50 16Q62 14 65 27Q67 40 60 46L59 57Q58 69 50 71Q42 69 41 57L40 46Q33 40 35 27Z" ${headStyle}/><path d="M41 50Q50 44 59 50Q60 63 50 67Q40 63 41 50Z" ${panelStyle}/>` ,
        foreground: `<path d="M50 69Q51 72.5 50 74.5M50 74.5L46.5 77.5M50 74.5L53.5 77.5" fill="none" stroke="${palette.accent}" stroke-width="1.6" stroke-linecap="round"/>`,
        muzzle: '',
        nose: `<circle cx="45.5" cy="55" r="1.4" fill="${palette.ink}" opacity="0.55"/><circle cx="54.5" cy="55" r="1.4" fill="${palette.ink}" opacity="0.55"/>`,
        details: `<path d="M39 30Q50 24 61 30" fill="none" stroke="${colors.inner}" stroke-width="2" stroke-linecap="round"/>`,
      }, art);

    default:
      return invalidOption('species', species);
  }
}

function renderMarking(
  marking: CrittersParams['marking'],
  face: FaceLayout,
  colors: CoatColors,
  ink: string,
): string {
  const center = (face.eyes[0].x + face.eyes[1].x) / 2;
  const shiftX = center - 50;
  const anchors = face.marking;

  switch (marking) {
    case 'none':
      return '';
    case 'blaze':
      return `<path d="M${center - anchors.blazeWidth} ${anchors.blazeTopY}Q${center} ${anchors.blazeTopY - 4} ${center + anchors.blazeWidth} ${anchors.blazeTopY}L${center + anchors.blazeWidth * 0.62} ${anchors.blazeBottomY}Q${center} ${anchors.blazeBottomY + 4} ${center - anchors.blazeWidth * 0.62} ${anchors.blazeBottomY}Z" fill="${colors.strongMark}" opacity="0.9"/>`;
    case 'eye-patch':
      return `<ellipse cx="${anchors.patchX + shiftX}" cy="${anchors.patchY}" rx="${anchors.patchRx}" ry="${anchors.patchRy}" fill="${colors.panel}" stroke="${tonalEdge(colors.panel, ink, 0.34)}" stroke-width="1.25" transform="rotate(${anchors.patchAngle} ${anchors.patchX + shiftX} ${anchors.patchY})"/>`;
    case 'freckles':
      return `<g fill="${ink}" opacity="0.68"><circle cx="${center - anchors.cheekSpread * 0.62}" cy="${anchors.cheekY}" r="1.35"/><circle cx="${center - anchors.cheekSpread * 0.34}" cy="${anchors.cheekY + 2}" r="1.2"/><circle cx="${center + anchors.cheekSpread * 0.34}" cy="${anchors.cheekY + 2}" r="1.2"/><circle cx="${center + anchors.cheekSpread * 0.62}" cy="${anchors.cheekY}" r="1.35"/></g>`;
    case 'forehead-stripes':
      return `<path d="M${center - anchors.foreheadSpread} ${anchors.foreheadY}L${center - anchors.foreheadSpread * 0.58} ${anchors.foreheadY + 7}M${center} ${anchors.foreheadY - 2}V${anchors.foreheadY + 7}M${center + anchors.foreheadSpread} ${anchors.foreheadY}L${center + anchors.foreheadSpread * 0.58} ${anchors.foreheadY + 7}" fill="none" stroke="${colors.strongMark}" stroke-width="2.2" stroke-linecap="round"/>`;
    case 'cheek-spots':
      return `<circle cx="${center - anchors.cheekSpread}" cy="${anchors.cheekY}" r="${anchors.cheekRadius}" fill="${colors.strongMark}" opacity="0.78"/><circle cx="${center + anchors.cheekSpread}" cy="${anchors.cheekY}" r="${anchors.cheekRadius}" fill="${colors.strongMark}" opacity="0.78"/>`;
    default:
      return invalidOption('marking', marking);
  }
}

function renderExpression(
  expression: CrittersParams['expression'],
  face: FaceLayout,
  ink: string,
): string {
  const [left, right] = face.eyes;
  const mouth = face.mouth;
  const openEye = (
    eye: EyeAnchor,
    radiusScale = 1,
  ): string => `<ellipse cx="${eye.x}" cy="${eye.y}" rx="${eye.rx * radiusScale}" ry="${eye.ry * radiusScale}" fill="${ink}" transform="rotate(${eye.angle} ${eye.x} ${eye.y})"/>`;
  const openEyes = `${openEye(left)}${openEye(right)}`;
  const closedEye = (
    eye: EyeAnchor,
    bend: number,
  ): string => {
    const halfWidth = Math.max(3.4, eye.rx + 1.65);
    return `<path d="M${eye.x - halfWidth} ${eye.y}Q${eye.x} ${eye.y + bend} ${eye.x + halfWidth} ${eye.y}" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round" transform="rotate(${eye.angle} ${eye.x} ${eye.y})"/>`;
  };
  const mouthCurve = (width: number, depth: number, y = mouth.y): string => (
    `<path d="M${mouth.x - width / 2} ${y}Q${mouth.x} ${y + depth} ${mouth.x + width / 2} ${y}" fill="none" stroke="${ink}" stroke-width="1.9" stroke-linecap="round"/>`
  );

  switch (expression) {
    case 'calm':
      return `${openEyes}${mouthCurve(mouth.width * 0.78, 1)}`;
    case 'soft-smile':
      return `${openEyes}${mouthCurve(mouth.width, mouth.depth, mouth.y - 1)}`;
    case 'content':
      return `${closedEye(left, 2.8)}${closedEye(right, 2.8)}${mouthCurve(mouth.width * 0.86, Math.max(2.7, mouth.depth - 1), mouth.y - 1)}`;
    case 'curious':
      return `${openEye(left, 0.92)}${openEye(right, 1.2)}<ellipse cx="${mouth.x}" cy="${mouth.y + 1}" rx="${Math.max(1.7, mouth.width * 0.2)}" ry="2.3" fill="${ink}"/>`;
    case 'sleepy':
      return `${closedEye({ ...left, y: left.y + 1 }, -2.1)}${closedEye({ ...right, y: right.y + 1 }, -2.1)}${mouthCurve(Math.max(5.5, mouth.width * 0.62), 0)}`;
    default:
      return invalidOption('expression', expression);
  }
}

function renderAccessory(
  accessory: CrittersParams['accessory'],
  face: FaceLayout,
  accent: string,
  ink: string,
): string {
  const [left, right] = face.eyes;
  const edge = tonalEdge(accent, ink, 0.38);
  const neckCenter = face.accessory.x;
  const neckLeft = neckCenter - face.accessory.width / 2;
  const neckRight = neckCenter + face.accessory.width / 2;
  const scarfLeft = neckLeft - 2;
  const scarfRight = neckRight + 2;
  const accessoryY = face.accessory.y;
  const orientNeckwear = (content: string): string => (
    face.accessory.angle === 0
      ? content
      : `<g transform="rotate(${face.accessory.angle} ${neckCenter} ${accessoryY})">${content}</g>`
  );

  switch (accessory) {
    case 'none':
      return '';
    case 'collar':
      return orientNeckwear(`<path d="M${neckLeft} ${accessoryY}Q${neckCenter} ${accessoryY + 4} ${neckRight} ${accessoryY}L${neckRight - 1.5} ${accessoryY + 5.5}Q${neckCenter} ${accessoryY + 9} ${neckLeft + 1.5} ${accessoryY + 5.5}Z" fill="${accent}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/><circle cx="${neckCenter}" cy="${accessoryY + 6.2}" r="2.3" fill="${ink}"/>`);
    case 'bandana':
      return orientNeckwear(`<path d="M${scarfLeft} ${accessoryY}Q${neckCenter} ${accessoryY + 4.8} ${scarfRight} ${accessoryY}L${scarfRight - 3} ${accessoryY + 7.2}Q${neckCenter} ${accessoryY + 10} ${scarfLeft + 3} ${accessoryY + 7.2}Z" fill="${accent}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/><path d="M${scarfRight - 5} ${accessoryY + 5.8}L${scarfRight + 2} ${accessoryY + 11.5}L${scarfRight - 8} ${accessoryY + 10.2}Z" fill="${accent}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/>`);
    case 'round-glasses':
      {
        const radius = 7.4 * face.accessory.glassesScale;
        const bridgeY = (left.y + right.y) / 2;
        return `<ellipse cx="${left.x}" cy="${left.y}" rx="${radius}" ry="${radius * 0.94}" fill="none" stroke="${edge}" stroke-width="1.5"/><ellipse cx="${right.x}" cy="${right.y}" rx="${radius}" ry="${radius * 0.94}" fill="none" stroke="${edge}" stroke-width="1.5"/><path d="M${left.x + radius} ${left.y}Q${(left.x + right.x) / 2} ${bridgeY - 2} ${right.x - radius} ${right.y}" fill="none" stroke="${edge}" stroke-width="1.5" stroke-linecap="round"/>`;
      }
    case 'leaf': {
      const leaf = face.accessory.leaf;
      return `<g transform="translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(${leaf.scale})"><path d="M0 10Q2 -2 14 0Q12 12 3 15Q0 15 0 10Z" fill="${accent}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/><path d="M3 12L11 3" fill="none" stroke="${edge}" stroke-width="1.1" stroke-linecap="round"/></g>`;
    }
    default:
      return invalidOption('accessory', accessory);
  }
}

const speciesFitTransforms = new Map<SpeciesName, string>();

function fitCritterArtwork(
  species: SpeciesName,
  face: FaceLayout,
  colors: CoatColors,
  palette: Palette,
  artwork: string,
): string {
  let transform = speciesFitTransforms.get(species);
  if (!transform) {
    const accessoryColor = palette.accent;
    // Fit against the union of every secondary option once per species. The
    // emitted SVG contains only the requested option, while its base portrait
    // keeps exactly the same scale and center across coats, expressions,
    // markings, accessories, palettes, and host frames.
    const envelope = [
      face.behind,
      face.silhouette,
      face.foreground,
      face.muzzle,
      face.nose,
      face.details,
      ...schema.marking.options.map((marking) => (
        renderMarking(marking, face, colors, palette.ink)
      )),
      ...schema.expression.options.map((expression) => (
        renderExpression(expression, face, palette.ink)
      )),
      ...schema.accessory.options.map((accessory) => (
        renderAccessory(accessory, face, accessoryColor, palette.ink)
      )),
    ].join('');
    const fittedEnvelope = fitToCircle(envelope, { size: 100, padding: 6 });
    const match = fittedEnvelope.match(/^<g transform="([^"]+)">/);
    if (!match) throw new Error(`Unable to fit Critters species: ${species}`);
    transform = match[1]!;
    speciesFitTransforms.set(species, transform);
  }
  return `<g transform="${transform}">${artwork}</g>`;
}

export function generate(params: CrittersParams): string {
  const palette = palettes[params.palette as PaletteName];
  if (!palette) invalidOption('palette', params.palette);
  if (!schema.backgroundShape.options.some((shape) => shape === params.backgroundShape)) {
    invalidOption('backgroundShape', params.backgroundShape);
  }

  const colors = resolveCoat(params.coat, palette);
  const art = resolveArt(params);
  const face = renderSpecies(params.species, colors, palette, art);
  const accessoryColor = params.coat === 'warm' ? palette.primary : palette.accent;
  const accessory = renderAccessory(
    params.accessory,
    face,
    accessoryColor,
    palette.ink,
  );
  const accessoryGroup = `<g data-part="accessory" data-accessory="${params.accessory}">${accessory}</g>`;
  const bodyGroup = `<g data-part="species-body" data-species="${params.species}">${face.behind}${face.silhouette}${face.foreground}${face.muzzle}</g>`;
  const markingGroup = `<g data-part="marking" data-marking="${params.marking}">${renderMarking(params.marking, face, colors, palette.ink)}</g>`;
  const expressionGroup = `<g data-part="expression" data-expression="${params.expression}">${renderExpression(params.expression, face, palette.ink)}</g>`;
  const detailGroup = `<g data-part="species-details">${face.nose}${face.details}</g>`;
  const artwork = [
    params.accessory === 'leaf' ? accessoryGroup : '',
    bodyGroup,
    markingGroup,
    expressionGroup,
    detailGroup,
    params.accessory === 'leaf' ? '' : accessoryGroup,
  ].join('');
  const content = fitCritterArtwork(
    params.species,
    face,
    colors,
    palette,
    artwork,
  );

  return renderAvatarFrame(content, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<CrittersParams> = {},
): CrittersParams {
  const species = traits.species ?? random.pick('species', schema.species.options);
  const definition = speciesById[species];
  const marking = traits.marking ?? random.weightedPick(
    `marking:${species}`,
    definition.naturalMarkings,
  );
  const accessoryChoices = definition.naturalAccessories.filter(([accessory]) => (
    accessory !== 'round-glasses' || marking !== 'eye-patch'
  ));

  return {
    backgroundShape: random.weightedPick('background-shape', [
      ['circle', 5],
      ['rounded', 4],
      ['square', 1],
    ] as const),
    palette: random.pick('palette', schema.palette.options),
    species,
    coat: traits.coat ?? random.weightedPick('coat', [
      ['classic', 5],
      ['light', 3],
      ['warm', 2],
    ] as const),
    expression: traits.expression ?? random.weightedPick('expression', [
      ['calm', 25],
      ['soft-smile', 32],
      ['content', 24],
      ['curious', 8],
      ['sleepy', 11],
    ] as const),
    marking,
    accessory: traits.accessory ?? random.weightedPick(
      `accessory:${species}`,
      accessoryChoices,
    ),
  };
}

export const critters: InternalTheme<typeof schema, 'animal', typeof baseTypeParam> = {
  name: 'Critters',
  description: 'Clean editorial animal portraits with calm expressions and bold silhouettes.',
  kind: 'animal',
  baseTypeParam,
  schema,
  generate,
  randomize,
};

/** Internal structural hooks for exhaustive artwork invariant tests. */
export const __test = { speciesDefinitions };
