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

const faceStyleNames = ['soft-smile', 'content', 'quiet', 'sleepy', 'curious'] as const;
const accentPositionNames = ['upper-left', 'upper-right', 'side', 'base', 'halo'] as const;

type FaceStyleName = (typeof faceStyleNames)[number];
type AccentPositionName = (typeof accentPositionNames)[number];
type ColorRole = 'primary' | 'secondary' | 'accent';
type FaceFieldKind = 'circle' | 'oval' | 'rounded' | 'diamond' | 'lens' | 'drop';
type WeightedAccents = readonly (readonly [AccentPositionName, number])[];

interface FaceField {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: FaceFieldKind;
  tilt: number;
}

interface OrbBounds {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

interface OrbShapeDefinition<TId extends string = string> {
  id: TId;
  label: string;
  topology: string;
  faceField: FaceField;
  bounds: OrbBounds;
  colorRole: ColorRole;
  negativeSpaces: 0 | 1 | 2;
  bandTopology: boolean;
  naturalAccents: WeightedAccents;
}

type FaceTuple = readonly [number, number, number, number, FaceFieldKind, number?];
type BoundsTuple = readonly [number, number, number, number];

const balancedAccents = [
  ['upper-left', 4], ['upper-right', 4], ['side', 3], ['base', 3], ['halo', 2],
] as const satisfies WeightedAccents;
const wideAccents = [
  ['upper-left', 5], ['upper-right', 5], ['halo', 3], ['base', 2], ['side', 1],
] as const satisfies WeightedAccents;
const tallAccents = [
  ['side', 5], ['base', 4], ['halo', 3], ['upper-left', 2], ['upper-right', 2],
] as const satisfies WeightedAccents;
const groundedAccents = [
  ['upper-left', 4], ['upper-right', 4], ['side', 4], ['halo', 3], ['base', 1],
] as const satisfies WeightedAccents;
const haloAccents = [
  ['halo', 5], ['base', 4], ['upper-left', 3], ['upper-right', 3], ['side', 2],
] as const satisfies WeightedAccents;

function defineOrb<const TId extends string>(
  id: TId,
  label: string,
  topology: string,
  faceTuple: FaceTuple,
  boundsTuple: BoundsTuple,
  colorRole: ColorRole,
  negativeSpaces: 0 | 1 | 2,
  bandTopology: boolean,
  naturalAccents: WeightedAccents,
): OrbShapeDefinition<TId> {
  return {
    id,
    label,
    topology,
    faceField: {
      x: faceTuple[0],
      y: faceTuple[1],
      width: faceTuple[2],
      height: faceTuple[3],
      kind: faceTuple[4],
      tilt: faceTuple[5] ?? 0,
    },
    bounds: {
      top: boundsTuple[0],
      bottom: boundsTuple[1],
      left: boundsTuple[2],
      right: boundsTuple[3],
    },
    colorRole,
    negativeSpaces,
    bandTopology,
    naturalAccents,
  };
}

/** Canonical 5×10 order and exhaustive metadata source for the Orbs schema. */
const orbShapeDefinitions = [
  defineOrb('round', 'Round', 'single circular badge', [50, 52, 38, 34, 'circle'], [20, 82, 20, 80], 'primary', 0, false, balancedAccents),
  defineOrb('pebble', 'Pebble', 'low asymmetric flat-bottom stone', [48, 58, 34, 27, 'oval', -2], [20, 82, 16, 85], 'secondary', 0, false, balancedAccents),
  defineOrb('arch', 'Arch', 'solid domed gateway block', [50, 57, 34, 27, 'oval'], [18, 84, 20, 80], 'primary', 0, false, groundedAccents),
  defineOrb('drop', 'Drop', 'pointed water drop', [50, 58, 34, 31, 'drop'], [9, 87, 20, 80], 'accent', 0, false, tallAccents),
  defineOrb('bean', 'Bean', 'deep-waisted kidney bean', [39, 61, 29, 25, 'oval', -11], [14, 90, 14, 84], 'secondary', 0, false, balancedAccents),
  defineOrb('crescent', 'Crescent', 'open lunar crescent band', [34, 52, 27, 27, 'circle', -4], [10, 90, 14, 94], 'accent', 1, false, haloAccents),
  defineOrb('lens', 'Lens', 'wide pointed optical lens', [50, 51, 35, 24, 'lens'], [22, 80, 6, 94], 'primary', 0, false, wideAccents),
  defineOrb('orbit', 'Orbit', 'tilted elliptical orbital ring', [50, 50, 29, 27, 'circle'], [12, 88, 7, 93], 'secondary', 1, true, haloAccents),
  defineOrb('spiral', 'Spiral', 'single inward winding band', [64, 62, 26, 24, 'circle', 2], [12, 88, 10, 90], 'accent', 1, true, wideAccents),
  defineOrb('portal', 'Portal', 'hollow rounded portal', [50, 51, 28, 24, 'oval'], [9, 91, 13, 87], 'primary', 1, false, haloAccents),

  defineOrb('wave', 'Wave', 'single curling breaker over a broad swell', [48, 78, 30, 22, 'oval', -2], [13, 92, 5, 95], 'secondary', 0, false, wideAccents),
  defineOrb('flame', 'Flame', 'swept double-tip flame', [48, 59, 31, 29, 'drop', 1], [6, 92, 14, 84], 'accent', 0, false, tallAccents),
  defineOrb('comet', 'Comet', 'round comet with swept tail', [70, 49, 28, 26, 'circle', 1], [16, 84, 6, 94], 'primary', 0, false, wideAccents),
  defineOrb('ribbon', 'Ribbon', 'folded awareness ribbon loop', [50, 59, 24, 21, 'diamond'], [8, 92, 14, 86], 'secondary', 1, true, tallAccents),
  defineOrb('infinity', 'Infinity', 'continuous double-loop band', [50, 50, 24, 21, 'diamond'], [24, 77, 5, 95], 'accent', 2, true, wideAccents),
  defineOrb('knot', 'Knot', 'three-lobed woven knot', [50, 50, 27, 25, 'circle'], [8, 92, 8, 92], 'primary', 2, true, haloAccents),
  defineOrb('bolt', 'Bolt', 'broad angular lightning bolt', [48, 51, 25, 23, 'diamond', -5], [4, 96, 14, 86], 'accent', 0, false, tallAccents),
  defineOrb('fan', 'Fan', 'open five-panel hand fan', [50, 62, 32, 25, 'oval'], [9, 89, 7, 93], 'secondary', 0, false, groundedAccents),
  defineOrb('fold', 'Fold', 'rectangular paper tile with oversized folded corner', [47, 58, 31, 26, 'rounded', -1], [17, 89, 14, 87], 'primary', 0, false, balancedAccents),
  defineOrb('sail', 'Sail', 'curved sail above a keel', [59, 48, 28, 25, 'oval', -3], [9, 91, 11, 89], 'secondary', 0, false, groundedAccents),

  defineOrb('heart', 'Heart', 'cleft geometric heart', [50, 48, 33, 28, 'circle'], [12, 91, 10, 90], 'accent', 0, false, haloAccents),
  defineOrb('star', 'Star', 'crisp five-point star', [50, 50, 30, 27, 'circle'], [6, 94, 6, 94], 'primary', 0, false, haloAccents),
  defineOrb('clover', 'Clover', 'four-leaf clover mark', [50, 51, 28, 26, 'circle'], [7, 93, 7, 93], 'secondary', 0, false, haloAccents),
  defineOrb('rainbow', 'Rainbow', 'double-band rainbow rising from a cloud bank', [50, 70, 24, 21, 'circle'], [7, 88, 6, 94], 'accent', 1, true, groundedAccents),
  defineOrb('crown', 'Crown', 'five-tip royal crown', [50, 59, 34, 27, 'rounded'], [8, 90, 9, 91], 'primary', 0, false, groundedAccents),
  defineOrb('quote', 'Quote', 'paired typographic quotation marks with swept tails', [28, 22, 24, 21, 'circle'], [6, 81, 6, 95], 'secondary', 0, false, balancedAccents),
  defineOrb('speech-bubble', 'Speech bubble', 'rounded dialogue bubble with tail', [48, 46, 36, 28, 'rounded'], [15, 86, 7, 93], 'primary', 0, false, groundedAccents),
  defineOrb('keyhole', 'Keyhole', 'round keyhole with tapered stem', [50, 32, 27, 25, 'circle'], [7, 93, 23, 77], 'accent', 0, false, tallAccents),
  defineOrb('tag', 'Tag', 'angled price tag with punched eye', [57, 51, 34, 27, 'rounded', 2], [13, 87, 7, 93], 'secondary', 1, false, balancedAccents),
  defineOrb('bookmark', 'Bookmark', 'notched vertical bookmark', [50, 42, 32, 28, 'rounded'], [7, 93, 23, 77], 'primary', 0, false, tallAccents),

  defineOrb('puzzle', 'Puzzle', 'asymmetric jigsaw tile with two tabs and one socket', [58, 56, 26, 23, 'rounded'], [4, 84, 15, 97], 'accent', 0, false, haloAccents),
  defineOrb('medal', 'Medal', 'ribboned circular medal', [50, 62, 34, 31, 'circle'], [5, 93, 19, 81], 'primary', 0, false, tallAccents),
  defineOrb('ticket', 'Ticket', 'admission ticket with perforated stub', [50, 51, 39, 27, 'rounded'], [20, 82, 5, 95], 'secondary', 0, false, wideAccents),
  defineOrb('anchor', 'Anchor', 'broad nautical anchor', [50, 37, 27, 24, 'circle'], [6, 94, 7, 93], 'accent', 1, false, tallAccents),
  defineOrb('flag', 'Flag', 'single waving pennant', [57, 43, 34, 26, 'rounded', -2], [7, 91, 13, 89], 'primary', 0, false, groundedAccents),
  defineOrb('crystal', 'Crystal', 'six-face crystal gem', [50, 50, 29, 27, 'diamond'], [5, 95, 14, 86], 'secondary', 0, false, haloAccents),
  defineOrb('scroll', 'Scroll', 'wavy parchment sheet with asymmetric curled ends', [50, 52, 31, 26, 'oval', -1], [9, 92, 4, 94], 'primary', 0, false, balancedAccents),
  defineOrb('leaf', 'Leaf', 'single veined leaf mark', [47, 48, 31, 26, 'oval', -8], [6, 94, 11, 89], 'accent', 0, false, haloAccents),
  defineOrb('sunrise', 'Sunrise', 'rising half-sun horizon', [50, 62, 36, 25, 'oval'], [7, 91, 1, 99], 'secondary', 0, false, groundedAccents),
  defineOrb('mountain', 'Mountain', 'paired mountain peaks', [48, 57, 30, 25, 'diamond', -2], [9, 90, 5, 95], 'primary', 0, false, groundedAccents),

  defineOrb('arrow', 'Arrow', 'bold rounded forward arrow with inner chevron', [60, 51, 26, 22, 'diamond'], [20, 82, 4, 96], 'accent', 0, false, wideAccents),
  defineOrb('paper-plane', 'Paper plane', 'folded paper plane mark', [55, 45, 27, 23, 'diamond', -6], [10, 90, 5, 95], 'secondary', 0, false, wideAccents),
  defineOrb('kite', 'Kite', 'diamond kite with ribbon tail', [50, 41, 28, 25, 'diamond'], [5, 96, 12, 88], 'primary', 0, false, tallAccents),
  defineOrb('umbrella', 'Umbrella', 'domed umbrella with hooked handle', [50, 37, 32, 24, 'oval'], [8, 98, 5, 95], 'accent', 0, false, groundedAccents),
  defineOrb('music-note', 'Music note', 'single beamed music note', [38, 76, 24, 21, 'circle', -2], [6, 94, 9, 85], 'secondary', 0, false, tallAccents),
  defineOrb('pawn', 'Pawn', 'classic game pawn', [50, 57, 34, 28, 'rounded'], [7, 93, 17, 83], 'primary', 0, false, tallAccents),
  defineOrb('trophy', 'Trophy', 'handled winner cup', [50, 44, 31, 26, 'rounded'], [6, 94, 9, 91], 'accent', 0, false, tallAccents),
  defineOrb('bowtie', 'Bowtie', 'pinched twin-lobe bowtie', [50, 51, 28, 24, 'circle'], [21, 81, 5, 95], 'secondary', 0, false, wideAccents),
  defineOrb('ampersand', 'Ampersand', 'looped ampersand band', [47, 73, 24, 21, 'oval', -8], [6, 95, 13, 90], 'primary', 2, true, haloAccents),
  defineOrb('at-sign', 'At sign', 'circular at-sign band', [50, 51, 29, 26, 'circle'], [6, 94, 6, 94], 'accent', 2, true, haloAccents),
] as const satisfies readonly OrbShapeDefinition[];

type OrbShapeName = (typeof orbShapeDefinitions)[number]['id'];

function orderedOrbShapeIds<const TDefinitions extends readonly OrbShapeDefinition[]>(
  definitions: TDefinitions,
): { readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'] } {
  return definitions.map((definition) => definition.id) as {
    readonly [TIndex in keyof TDefinitions]: TDefinitions[TIndex]['id'];
  };
}

export const orbShapeNames = orderedOrbShapeIds(orbShapeDefinitions);

export const schema = {
  backgroundShape: { type: 'select', default: 'circle', options: backgroundShapeNames },
  palette: { type: 'select', default: 'coast', options: paletteNames },
  orbShape: { type: 'select', default: 'round', options: orbShapeNames },
  faceStyle: { type: 'select', default: 'soft-smile', options: faceStyleNames },
  accentPosition: { type: 'select', default: 'upper-left', options: accentPositionNames },
} as const satisfies ParamSchema;

export const baseTypeParam = 'orbShape' as const;
export type OrbsParams = ParamsFromSchema<typeof schema>;

const orbShapeById = Object.fromEntries(
  orbShapeDefinitions.map((definition) => [definition.id, definition]),
) as Record<OrbShapeName, OrbShapeDefinition<OrbShapeName>>;

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Orbs ${param}: ${String(value)}`);
}

function resolveOrbPalette(definition: OrbShapeDefinition, base: Palette): Palette {
  switch (definition.colorRole) {
    case 'primary': return base;
    case 'secondary': return { ...base, primary: base.secondary, secondary: base.primary };
    case 'accent': return { ...base, primary: base.accent, accent: base.primary };
  }
}

function renderBody(shape: OrbShapeName, color: string, detail: string): string {
  switch (shape) {
    case 'round':
      return `<circle cx="50" cy="52" r="30" fill="${color}"/>`;
    case 'pebble':
      return `<path d="M20 40C24 26 38 19 57 20C75 21 85 33 85 49C86 67 72 79 52 82C31 84 16 73 16 57C16 50 17 45 20 40Z" fill="${color}"/>`;
    case 'arch':
      return `<path d="M20 82V49Q20 18 50 18Q80 18 80 49V82Q65 85 50 84Q35 85 20 82Z" fill="${color}"/>`;
    case 'drop':
      return `<path d="M50 9Q80 42 80 62Q80 87 50 87Q20 87 20 62Q20 42 50 9Z" fill="${color}"/>`;
    case 'bean':
      return `<path d="M59 14C77 15 86 27 84 42C82 53 71 59 60 55C68 63 70 73 64 82C54 94 34 90 22 77C9 63 14 40 27 26C36 17 48 12 59 14Z" fill="${color}"/>`;
    case 'crescent':
      return `<path d="M54 10A40 40 0 1 0 54 90A40 40 0 1 0 54 10ZM68 22Q47 29 45 50Q44 72 67 79Q84 67 84 50Q84 33 68 22Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'lens':
      return `<path d="M6 51Q25 22 50 22Q75 22 94 51Q75 80 50 80Q25 80 6 51Z" fill="${color}"/>`;
    case 'orbit':
      return `<ellipse cx="50" cy="50" rx="43" ry="25" fill="none" stroke="${color}" stroke-width="13" transform="rotate(-18 50 50)"/>`;
    case 'spiral':
      return `<path d="M84 71Q70 89 43 84Q14 79 12 52Q10 23 38 14Q68 5 86 29Q98 48 83 65Q69 80 48 72Q32 66 34 50Q35 36 50 32Q64 29 70 39Q77 50 68 59Q60 66 52 61" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'portal':
      return `<path d="M13 91V45Q13 9 50 9Q87 9 87 45V91H65V46Q65 29 50 29Q35 29 35 46V91Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'wave':
      return `<path d="M5 81C19 75 25 62 27 47C30 28 44 15 61 14C78 13 91 25 95 41C84 34 73 35 65 42C57 48 56 58 62 65C68 72 79 74 89 69C80 86 61 94 42 92C25 91 12 87 5 81Z" fill="${color}"/><path d="M49 50C56 35 70 29 83 36C72 35 63 40 60 49C58 56 61 62 68 66C57 64 51 59 49 50Z" fill="${detail}"/>`;
    case 'flame':
      return `<path d="M55 6Q76 27 65 45Q82 38 84 61Q87 84 63 92Q39 98 21 79Q6 61 25 39Q26 56 42 58Q32 34 55 6Z" fill="${color}"/>`;
    case 'comet':
      return `<path d="M7 69Q27 22 67 21Q46 31 43 48Q39 66 57 81Q28 86 7 69Z" fill="${color}"/><circle cx="70" cy="49" r="25" fill="${color}"/>`;
    case 'ribbon':
      return `<path d="M50 9Q75 9 76 32Q77 48 61 58L78 91H57L47 68L35 92H14L32 57Q23 47 24 33Q25 9 50 9ZM50 25Q40 25 40 35Q40 44 50 49Q60 44 60 35Q60 25 50 25Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'infinity':
      return `<path d="M50 50Q36 24 21 28Q5 33 8 51Q11 69 28 71Q41 72 50 50Q59 28 72 29Q89 30 92 49Q95 67 79 72Q64 76 50 50Z" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'knot':
      return `<path d="M50 13Q72 4 82 23Q91 41 73 52Q93 64 82 82Q71 99 50 87Q29 99 18 82Q7 64 27 52Q9 41 18 23Q28 4 50 13ZM50 33Q39 24 32 32Q25 40 38 48Q50 54 62 48Q75 40 68 32Q61 24 50 33ZM50 60Q37 55 30 66Q27 76 39 78Q50 82 61 78Q73 76 70 66Q63 55 50 60Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'bolt':
      return `<path d="M55 4L18 55H43L28 96L83 39H57L72 4Z" fill="${color}"/>`;
    case 'fan':
      return `<path d="M50 89L7 54Q5 31 25 27Q30 7 47 23Q59 3 68 25Q89 13 90 38Q99 52 88 66Z" fill="${color}"/><path d="M50 85L26 34M50 85L47 29M50 85L68 31M50 85L86 44" fill="none" stroke="${detail}" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'fold':
      return `<path d="M21 17H60L88 45V82Q88 89 81 89H21Q14 89 14 82V24Q14 17 21 17Z" fill="${color}"/><path d="M60 17H82Q88 17 88 23V45Q73 33 60 17ZM57.5 19.5Q71.5 35 86 47.5Q70.5 37.5 55.8 21.8Z" fill="${detail}"/>`;
    case 'sail':
      return `<path d="M51 9Q78 28 83 68L52 62Z" fill="${color}"/><path d="M45 19L45 67L14 67Q25 37 45 19ZM12 74Q50 68 88 74L78 91H24Z" fill="${color}"/>`;
    case 'heart':
      return `<path d="M50 91Q7 65 11 36Q14 13 36 14Q49 15 50 30Q51 15 64 14Q86 13 89 36Q93 65 50 91Z" fill="${color}"/>`;
    case 'star':
      return `<path d="M50 6L61 35L92 35L67 54L76 94L50 70L24 94L33 54L8 35L39 35Z" fill="${color}"/>`;
    case 'clover':
      return `<path d="M50 43Q34 3 13 19Q-2 39 39 50Q-2 61 13 81Q34 97 50 57Q66 97 87 81Q102 61 61 50Q102 39 87 19Q66 3 50 43Z" fill="${color}"/>`;
    case 'rainbow':
      return `<path d="M13 92Q6 92 6 86V51C7 23 24 7 50 7C76 7 93 23 94 51V86Q94 92 87 92ZM30 92V52C30 38 38 29 50 29C62 29 70 38 70 52V80Q68 62 61 65Q55 67 50 74Q45 67 39 65Q32 62 30 80Z" fill="${color}" fill-rule="evenodd"/><path d="M18 88V52C18 31 30 18 50 18C70 18 82 31 82 52V88" fill="none" stroke="${detail}" stroke-width="7" stroke-linecap="round"/>`;
    case 'crown':
      return `<path d="M9 23L30 38L40 9L50 35L62 7L70 38L92 22L83 82Q50 94 17 82Z" fill="${color}"/>`;
    case 'quote':
      return `<path d="M42 19C42 26 40 29.5 36 30.5C35 38 32 47 26 55C22 60 17 62 13 62.5Q9.5 63.5 11 66C15 61 17.5 54 18.5 46C19.2 40 19.5 36 20 33C13.5 28.5 13 22 16 16.5C18.5 10 24 7.5 29.5 7.5C36 7.5 42 12 42 19Z" fill="${color}"/><path d="M88 19C88 26 86 29.5 82 30.5C81 38 78 47 72 55C68 60 63 62 59 62.5Q55.5 63.5 57 66C61 61 63.5 54 64.5 46C65.2 40 65.5 36 66 33C59.5 28.5 59 22 62 16.5C64.5 10 70 7.5 75.5 7.5C82 7.5 88 12 88 19Z" fill="${color}"/>`;
    case 'speech-bubble':
      return `<path d="M8 19Q8 15 13 15H87Q92 15 92 20V67Q92 72 87 72H59L39 88L42 72H13Q8 72 8 67Z" fill="${color}"/>`;
    case 'keyhole':
      return `<path d="M42 74L38.7 43.5A20 20 0 1 1 61.3 43.5L58 74Q50 78 42 74Z" fill="${color}"/>`;
    case 'tag':
      return `<path d="M7 36L35 8H88Q93 8 93 13V78Q93 84 87 84H35L7 56ZM28 31A8 8 0 1 0 28 47A8 8 0 1 0 28 31Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'bookmark':
      return `<path d="M23 7H77V93L50 75L23 93Z" fill="${color}"/>`;
    case 'puzzle':
      return `<path d="M15 20H37C34 10 40 4 50 4C60 4 66 10 63 20H83V39C92 36 97 42 97 50C97 58 92 64 83 62V84H15V62C25 65 32 59 32 50C32 41 25 35 15 38Z" fill="${color}"/>`;
    case 'medal':
      return `<path d="M25 5H47L54 29L42 38ZM75 5H53L46 29L58 38Z" fill="${color}"/><circle cx="50" cy="62" r="31" fill="${color}"/>`;
    case 'ticket':
      return `<path d="M5 21H95V39A12 12 0 0 0 95 63V82H5V63A12 12 0 0 0 5 39Z" fill="${color}"/><path d="M76 27V76" fill="none" stroke="${detail}" stroke-width="2" stroke-dasharray="0.6 4.6" stroke-linecap="round"/>`;
    case 'anchor':
      return `<path d="M42 7Q50 0 58 7Q65 15 58 23V61Q69 58 77 48L68 43L93 38L91 66L83 57Q74 79 58 83V94H42V83Q26 79 17 57L9 66L7 38L32 43L23 48Q31 58 42 61V23Q35 15 42 7ZM50 8A7 7 0 1 0 50 22A7 7 0 1 0 50 8Z" fill="${color}" fill-rule="evenodd"/>`;
    case 'flag':
      return `<path d="M14 7H26V91H14ZM26 13Q46 4 60 13Q75 22 89 11V60Q72 72 57 61Q43 51 26 61Z" fill="${color}"/>`;
    case 'crystal':
      return `<path d="M50 5L86 27L78 75L50 95L22 75L14 27Z" fill="${color}"/><path d="M50 5L50 35L14 27L50 35L86 27L50 35L78 75L50 95L50 35L22 75Z" fill="${detail}" opacity="0.3"/>`;
    case 'scroll':
      return `<path d="M20 12C31 9 65 13 77 10C88 8 94 15 92 25C90 35 82 39 74 36L77 75C79 85 72 92 61 90C49 88 34 93 21 90C10 88 4 80 8 71C11 63 18 60 26 64L24 31C18 35 10 33 6 27C1 18 9 9 20 12Z" fill="${color}"/><path d="M74 17C85 14 88 27 78 30M25 82C14 85 11 72 21 68M35 42C45 39 57 43 68 40M35 55C45 52 57 56 68 53" fill="none" stroke="${detail}" stroke-width="1.8" stroke-linecap="round"/>`;
    case 'leaf':
      return `<path d="M11 67Q17 23 88 6Q88 73 44 90Q21 96 11 67Z" fill="${color}"/><path d="M20 80Q48 50 78 22M43 54L38 34M55 43L70 45" fill="none" stroke="${detail}" stroke-width="1.7" stroke-linecap="round"/>`;
    case 'sunrise':
      return `<path d="M5 79H95V91H5ZM15 72Q18 38 50 37Q82 38 85 72ZM12 55L4 49L11 39L20 48ZM29 34L24 20L37 16L42 31ZM50 30V7H62V31ZM72 35L79 19L91 25L83 43ZM86 58L94 49L99 60L91 68Z" fill="${color}"/>`;
    case 'mountain':
      return `<path d="M5 88L35 26L47 45L61 9L95 88Z" fill="${color}"/><path d="M53 29L61 9L72 36L64 31L59 39Z" fill="${detail}" opacity="0.42"/>`;
    case 'arrow':
      return `<path d="M20 36H50Q60 34 61 25L90 47Q96 51 90 55L61 77Q60 68 50 66H20C11 66 6 60 6 51C6 42 11 36 20 36Z" fill="${color}"/><path d="M78 43L88 51L78 59" fill="none" stroke="${detail}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'paper-plane':
      return `<path d="M5 36L95 10L66 90L48 58L25 76L31 51Z" fill="${color}"/><path d="M31 51L95 10L48 58" fill="${detail}" opacity="0.36"/>`;
    case 'kite':
      return `<path d="M50 5L88 40L50 78L12 40Z" fill="${color}"/><path d="M50 77Q35 84 50 88Q65 92 50 96" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round"/>`;
    case 'umbrella':
      return `<path d="M5 49Q12 10 50 9Q88 10 95 49Q84 40 73 49Q62 39 50 49Q38 39 27 49Q16 40 5 49ZM45 47H56V75Q56 87 66 87Q76 87 76 77H87Q87 97 66 97Q45 97 45 75Z" fill="${color}"/>`;
    case 'music-note':
      return `<path d="M45 6L88 13V26L45 19Z" fill="${color}"/><path d="M45 14H54V78H45Z" fill="${color}"/><path d="M79 20H88V66H79Z" fill="${color}"/><ellipse cx="72" cy="66" rx="14" ry="10.5" transform="rotate(-18 72 66)" fill="${color}"/><ellipse cx="37" cy="78" rx="17" ry="13" transform="rotate(-18 37 78)" fill="${color}"/>`;
    case 'pawn':
      return `<path d="M50 7Q65 7 66 21Q67 32 58 37Q70 46 68 62L80 84Q83 93 72 93H28Q17 93 20 84L32 62Q30 46 42 37Q33 32 34 21Q35 7 50 7Z" fill="${color}"/>`;
    case 'trophy':
      return `<path d="M25 7H75V17H91V37Q88 57 69 58Q64 70 56 73V82H73V94H27V82H44V73Q36 70 31 58Q12 57 9 37V17H25ZM25 27H19V35Q20 45 28 47ZM75 27V47Q83 45 81 27Z" fill="${color}"/>`;
    case 'bowtie':
      return `<path d="M47 37Q27 18 5 26Q18 50 5 74Q27 82 47 63Q50 60 53 63Q73 82 95 74Q82 50 95 26Q73 18 53 37Q50 40 47 37Z" fill="${color}"/>`;
    case 'ampersand':
      return `<path d="M55 43Q32 44 29 30Q27 9 46 10Q65 9 63 28Q61 43 48 45L34 60Q16 74 30 88Q46 98 61 90Q76 80 68 62Q62 50 50 46" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M52 48L86 90" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round"/>`;
    case 'at-sign':
      return `<path d="M69 70Q57 82 41 76Q24 70 23 51Q22 30 40 21Q61 10 77 25Q91 38 86 58Q83 72 72 73Q61 74 62 61V35H48Q36 35 34 49Q33 63 45 66Q57 68 62 57" fill="none" stroke="${color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    default:
      return invalidOption('orbShape', shape);
  }
}

function renderFaceField(definition: OrbShapeDefinition, color: string): string {
  const { x, y, width, height, kind, tilt } = definition.faceField;
  const rx = width / 2;
  const ry = height / 2;
  const transform = tilt === 0 ? '' : ` transform="rotate(${tilt} ${x} ${y})"`;

  switch (kind) {
    case 'circle':
    case 'oval':
      return `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${color}"${transform}/>`;
    case 'rounded':
      return `<rect x="${x - rx}" y="${y - ry}" width="${width}" height="${height}" rx="${Math.min(8, ry * 0.55)}" fill="${color}"${transform}/>`;
    case 'diamond':
      return `<path d="M${x} ${y - ry}Q${x + rx * 0.15} ${y - ry * 0.86} ${x + rx} ${y}Q${x + rx * 0.84} ${y + ry * 0.16} ${x} ${y + ry}Q${x - rx * 0.15} ${y + ry * 0.86} ${x - rx} ${y}Q${x - rx * 0.84} ${y - ry * 0.16} ${x} ${y - ry}Z" fill="${color}"${transform}/>`;
    case 'lens':
      return `<path d="M${x - rx} ${y}Q${x} ${y - ry} ${x + rx} ${y}Q${x} ${y + ry} ${x - rx} ${y}Z" fill="${color}"${transform}/>`;
    case 'drop':
      return `<path d="M${x} ${y - ry}Q${x + rx} ${y - ry * 0.1} ${x + rx * 0.88} ${y + ry * 0.45}Q${x + rx * 0.55} ${y + ry} ${x} ${y + ry}Q${x - rx * 0.55} ${y + ry} ${x - rx * 0.88} ${y + ry * 0.45}Q${x - rx} ${y - ry * 0.1} ${x} ${y - ry}Z" fill="${color}"${transform}/>`;
  }
}

function renderAccent(position: AccentPositionName, color: string): string {
  switch (position) {
    case 'upper-left':
      return `<path d="M14 45Q10 24 27 14Q44 6 53 24Q54 38 41 47Q25 55 14 45Z" fill="${color}"/>`;
    case 'upper-right':
      return `<path d="M86 45Q90 24 73 14Q56 6 47 24Q46 38 59 47Q75 55 86 45Z" fill="${color}"/>`;
    case 'side':
      return `<path d="M71 25Q91 28 94 50Q95 73 75 83Q64 73 67 56Q70 41 71 25Z" fill="${color}"/>`;
    case 'base':
      return `<path d="M18 69Q50 57 82 69Q91 81 77 90Q50 98 23 90Q9 81 18 69Z" fill="${color}"/>`;
    case 'halo':
      return `<circle cx="50" cy="50" r="42" fill="${color}"/>`;
    default:
      return invalidOption('accentPosition', position);
  }
}

interface OrbArt {
  faceTilt: number;
  faceShiftX: number;
  faceShiftY: number;
  gazeX: number;
  gazeY: number;
  direction: -1 | 1;
}

function resolveOrbArt(definition: OrbShapeDefinition, variation: ArtVariation): OrbArt {
  return {
    faceTilt: definition.faceField.tilt + variation.number('face-tilt', -0.65, 0.65),
    faceShiftX: variation.number('face-x', -0.28, 0.28),
    faceShiftY: variation.number('face-y', -0.24, 0.24),
    gazeX: variation.number('gaze-x', -0.35, 0.35),
    gazeY: variation.number('gaze-y', -0.25, 0.25),
    direction: variation.bool('gesture-direction') ? 1 : -1,
  };
}

function openEyes(
  x: number,
  y: number,
  scale: number,
  ink: string,
  art: OrbArt,
  curious = false,
): string {
  const leftRadius = (curious && art.direction < 0 ? 2.8 : 2.2) * scale;
  const rightRadius = (curious && art.direction > 0 ? 2.8 : 2.2) * scale;
  const eyeY = y - 2.7 * scale;
  const gap = 7.2 * scale;
  return `<circle cx="${x - gap + art.gazeX}" cy="${eyeY + art.gazeY}" r="${leftRadius}" fill="${ink}"/><circle cx="${x + gap + art.gazeX}" cy="${eyeY + art.gazeY}" r="${rightRadius}" fill="${ink}"/>`;
}

function closedEyes(
  x: number,
  y: number,
  scale: number,
  ink: string,
  relaxed = false,
): string {
  const eyeY = y - 2.3 * scale;
  const gap = 7.2 * scale;
  const half = 3.7 * scale;
  const bend = (relaxed ? 1.7 : -1.15) * scale;
  return `<path d="M${x - gap - half} ${eyeY}Q${x - gap} ${eyeY + bend} ${x - gap + half} ${eyeY}" fill="none" stroke="${ink}" stroke-width="${1.75 * scale}" stroke-linecap="round"/><path d="M${x + gap - half} ${eyeY}Q${x + gap} ${eyeY + bend} ${x + gap + half} ${eyeY}" fill="none" stroke="${ink}" stroke-width="${1.75 * scale}" stroke-linecap="round"/>`;
}

function smile(
  x: number,
  y: number,
  width: number,
  depth: number,
  scale: number,
  ink: string,
): string {
  return `<path d="M${x - width * scale / 2} ${y}Q${x} ${y + depth * scale} ${x + width * scale / 2} ${y}" fill="none" stroke="${ink}" stroke-width="${1.8 * scale}" stroke-linecap="round"/>`;
}

function renderFace(
  style: FaceStyleName,
  definition: OrbShapeDefinition,
  ink: string,
  art: OrbArt,
): string {
  const field = definition.faceField;
  const scale = Math.max(0.68, Math.min(1, field.width / 36, field.height / 30));
  const x = field.x + art.faceShiftX;
  const y = field.y + art.faceShiftY;
  let eyes: string;
  let mouth: string;

  switch (style) {
    case 'soft-smile':
      eyes = openEyes(x, y, scale, ink, art);
      mouth = smile(x, y + 5.2 * scale, 13.5, 4.6, scale, ink);
      break;
    case 'content':
      eyes = closedEyes(x, y, scale, ink, true);
      mouth = smile(x, y + 5.3 * scale, 11, 3.4, scale, ink);
      break;
    case 'quiet':
      eyes = openEyes(x, y, scale, ink, art);
      mouth = `<path d="M${x - 4.5 * scale} ${y + 5.8 * scale}Q${x} ${y + 6.4 * scale} ${x + 4.5 * scale} ${y + 5.8 * scale}" fill="none" stroke="${ink}" stroke-width="${1.8 * scale}" stroke-linecap="round"/>`;
      break;
    case 'sleepy':
      eyes = closedEyes(x, y, scale, ink);
      mouth = smile(x, y + 5.8 * scale, 8.5, 2.2, scale, ink);
      break;
    case 'curious':
      eyes = openEyes(x, y, scale, ink, art, true);
      mouth = `<ellipse cx="${x + art.direction * scale}" cy="${y + 5.6 * scale}" rx="${2 * scale}" ry="${2.4 * scale}" fill="${ink}"/>`;
      break;
    default:
      return invalidOption('faceStyle', style);
  }

  return `<g data-part="face" data-face-style="${style}" transform="rotate(${art.faceTilt} ${x} ${y})"><g data-part="eyes">${eyes}</g><g data-part="mouth">${mouth}</g></g>`;
}

const orbFitTransforms = new Map<OrbShapeName, string>();

function fitOrbArtwork(
  definition: OrbShapeDefinition<OrbShapeName>,
  palette: Palette,
  art: OrbArt,
  artwork: string,
): string {
  let transform = orbFitTransforms.get(definition.id);
  if (!transform) {
    const detail = tonalEdge(palette.primary, palette.ink, 0.3);
    const envelope = [
      renderBody(definition.id, palette.primary, detail),
      renderFaceField(definition, palette.secondary),
      ...accentPositionNames.map((position) => renderAccent(position, palette.accent)),
      ...faceStyleNames.map((style) => renderFace(style, definition, palette.ink, art)),
    ].join('');
    const fittedEnvelope = fitToCircle(envelope, { size: 100, padding: 7 });
    const match = fittedEnvelope.match(/^<g transform="([^"]+)">/);
    if (!match) throw new Error(`Unable to fit Orbs shape: ${definition.id}`);
    transform = match[1]!;
    orbFitTransforms.set(definition.id, transform);
  }
  return `<g data-part="artwork" transform="${transform}">${artwork}</g>`;
}

export function generate(params: OrbsParams): string {
  const basePalette = palettes[params.palette];
  if (!basePalette) invalidOption('palette', params.palette);
  if (!schema.backgroundShape.options.some((shape) => shape === params.backgroundShape)) {
    invalidOption('backgroundShape', params.backgroundShape);
  }
  const definition = orbShapeById[params.orbShape];
  if (!definition) invalidOption('orbShape', params.orbShape);
  if (!faceStyleNames.some((style) => style === params.faceStyle)) {
    invalidOption('faceStyle', params.faceStyle);
  }
  if (!accentPositionNames.some((position) => position === params.accentPosition)) {
    invalidOption('accentPosition', params.accentPosition);
  }

  // Base-only variation keeps the symbol and local face anchors independent
  // from secondary traits and all presentation controls.
  const art = resolveOrbArt(
    definition,
    createArtVariation('orbs', { orbShape: params.orbShape }),
  );
  const palette = resolveOrbPalette(definition, basePalette);
  const detail = tonalEdge(palette.primary, palette.ink, 0.3);
  const artwork = [
    `<g data-part="accent" data-accent-position="${params.accentPosition}">${renderAccent(params.accentPosition, palette.accent)}</g>`,
    `<g data-part="body" data-orb-shape="${params.orbShape}" data-topology="${definition.topology}" data-negative-spaces="${definition.negativeSpaces}">${renderBody(params.orbShape, palette.primary, detail)}</g>`,
    `<g data-part="face-field">${renderFaceField(definition, palette.secondary)}</g>`,
    renderFace(params.faceStyle, definition, palette.ink, art),
  ].join('');
  const content = fitOrbArtwork(definition, palette, art, artwork);

  return renderAvatarFrame(content, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<OrbsParams> = {},
): OrbsParams {
  const orbShape = traits.orbShape ?? random.pick('orbShape', schema.orbShape.options);
  const definition = orbShapeById[orbShape];

  return {
    backgroundShape: random.weightedPick('backgroundShape', [
      ['circle', 5], ['rounded', 3], ['square', 1],
    ] as const),
    palette: random.pick('palette', schema.palette.options),
    orbShape,
    faceStyle: traits.faceStyle ?? random.weightedPick('faceStyle', [
      ['soft-smile', 5], ['content', 5], ['quiet', 4], ['sleepy', 3], ['curious', 1],
    ] as const),
    accentPosition: traits.accentPosition ?? random.weightedPick(
      `accentPosition:${orbShape}`,
      definition.naturalAccents,
    ),
  };
}

export const orbs: InternalTheme<typeof schema, 'anonymous', typeof baseTypeParam> = {
  name: 'Orbs',
  description: 'Calm, friendly identities built from bold shapes and gentle expressions.',
  kind: 'anonymous',
  baseTypeParam,
  schema,
  generate,
  randomize,
};

/** Internal structural hooks for exhaustive artwork invariant tests. */
export const __test = {
  orbShapeDefinitions,
  renderAccent,
  renderBody,
  renderFaceField,
};
