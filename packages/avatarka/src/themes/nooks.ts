import { fitToCircle } from '../fit';
import type { ParamSchema, ParamsFromSchema } from '../types';
import { getPalette, paletteNames, type Palette } from '../palettes';
import {
  createArtVariation,
  renderAvatarFrame,
  tonalEdge,
  type ArtVariation,
} from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';

const expressionOptions = ['calm', 'soft-smile', 'content', 'curious', 'sleepy'] as const;
const windowStyleOptions = ['square', 'round', 'arched', 'shuttered'] as const;
const materialOptions = ['wood', 'brick', 'plaster', 'canvas', 'glass'] as const;
const accentOptions = ['none', 'chimney', 'flag', 'awning', 'flower-box', 'sign'] as const;

type WindowStyle = (typeof windowStyleOptions)[number];
type Material = (typeof materialOptions)[number];
type Accent = (typeof accentOptions)[number];

/** Ordered product catalog and compatibility source of truth for Nooks. */
const dwellingDefinitions = [
  { id: 'cabin', label: 'Cabin', materials: ['wood', 'plaster', 'brick'], windows: ['square', 'round', 'arched', 'shuttered'], accents: ['none', 'chimney', 'flag', 'flower-box', 'sign'] },
  { id: 'townhouse', label: 'Townhouse', materials: ['brick', 'plaster', 'wood'], windows: ['square', 'arched', 'shuttered'], accents: ['none', 'chimney', 'awning', 'flower-box', 'sign'] },
  { id: 'lighthouse', label: 'Lighthouse', materials: ['plaster', 'brick'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'tent', label: 'Tent', materials: ['canvas'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'camper', label: 'Camper', materials: ['plaster', 'canvas'], windows: ['square', 'round', 'arched'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'windmill', label: 'Windmill', materials: ['wood', 'brick', 'plaster'], windows: ['round', 'arched'], accents: ['none', 'flag', 'flower-box'] },
  { id: 'greenhouse', label: 'Greenhouse', materials: ['glass'], windows: ['square', 'round', 'arched'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'tower', label: 'Tower', materials: ['brick', 'plaster'], windows: ['square', 'arched', 'shuttered'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'houseboat', label: 'Houseboat', materials: ['wood', 'plaster'], windows: ['square', 'round', 'arched'], accents: ['none', 'chimney', 'flag', 'flower-box', 'sign'] },
  { id: 'storefront', label: 'Storefront', materials: ['brick', 'plaster', 'glass', 'wood'], windows: ['square', 'round', 'arched'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'cottage', label: 'Cottage', materials: ['plaster', 'wood', 'brick'], windows: ['round', 'arched', 'shuttered'], accents: ['none', 'chimney', 'flower-box', 'sign'] },
  { id: 'treehouse', label: 'Treehouse', materials: ['wood'], windows: ['square', 'round', 'shuttered'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'stilt-house', label: 'Stilt house', materials: ['wood', 'plaster'], windows: ['square', 'round'], accents: ['none', 'flag', 'awning', 'sign'] },
  { id: 'hillside-home', label: 'Hillside home', materials: ['plaster', 'brick', 'wood'], windows: ['round', 'arched'], accents: ['none', 'chimney', 'flower-box', 'sign'] },
  { id: 'snow-dome', label: 'Snow dome', materials: ['plaster', 'glass'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'yurt', label: 'Yurt', materials: ['canvas'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'adobe-home', label: 'Adobe home', materials: ['plaster', 'brick'], windows: ['square', 'arched'], accents: ['none', 'chimney', 'awning', 'flower-box', 'sign'] },
  { id: 'tea-house', label: 'Tea house', materials: ['wood', 'plaster'], windows: ['square', 'shuttered'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'cliff-home', label: 'Cliff home', materials: ['brick', 'plaster'], windows: ['round', 'arched'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'bridge-house', label: 'Bridge house', materials: ['brick', 'wood', 'plaster'], windows: ['arched', 'square'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'observatory', label: 'Observatory', materials: ['plaster', 'brick', 'glass'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'library', label: 'Library', materials: ['brick', 'plaster', 'wood'], windows: ['arched', 'shuttered'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'bakery', label: 'Bakery', materials: ['brick', 'plaster', 'wood'], windows: ['round', 'arched', 'shuttered'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'bathhouse', label: 'Bathhouse', materials: ['wood', 'plaster', 'brick'], windows: ['round', 'arched'], accents: ['none', 'chimney', 'flower-box', 'sign'] },
  { id: 'train-station', label: 'Train station', materials: ['brick', 'plaster', 'wood'], windows: ['arched', 'square'], accents: ['none', 'flag', 'awning', 'flower-box', 'sign'] },
  { id: 'firehouse', label: 'Firehouse', materials: ['brick', 'plaster'], windows: ['square', 'arched'], accents: ['none', 'sign'] },
  { id: 'workshop', label: 'Workshop', materials: ['wood', 'brick', 'plaster'], windows: ['square', 'shuttered'], accents: ['none', 'chimney', 'awning', 'sign'] },
  { id: 'theater', label: 'Theater', materials: ['plaster', 'brick', 'wood'], windows: ['arched', 'round'], accents: ['none', 'flag', 'awning', 'sign'] },
  { id: 'barn', label: 'Barn', materials: ['wood', 'brick'], windows: ['square', 'round'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'boathouse', label: 'Boathouse', materials: ['wood', 'plaster'], windows: ['round', 'square'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'caravan', label: 'Caravan', materials: ['wood', 'plaster', 'canvas'], windows: ['round', 'arched', 'shuttered'], accents: ['none', 'awning', 'flower-box', 'sign'] },
  { id: 'water-tower-home', label: 'Water tower home', materials: ['wood', 'plaster'], windows: ['round', 'square'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'caboose-home', label: 'Caboose home', materials: ['wood', 'plaster'], windows: ['square', 'arched'], accents: ['none', 'chimney', 'flag', 'sign'] },
  { id: 'space-capsule', label: 'Space capsule', materials: ['plaster', 'glass'], windows: ['round', 'square'], accents: ['none', 'sign'] },
  { id: 'airship-cabin', label: 'Airship cabin', materials: ['wood', 'plaster', 'glass'], windows: ['round', 'arched'], accents: ['none', 'flag', 'sign'] },
  { id: 'silo-home', label: 'Silo home', materials: ['wood', 'brick', 'plaster'], windows: ['round', 'arched'], accents: ['none', 'chimney', 'flag', 'sign'] },
  { id: 'submarine-nook', label: 'Submarine nook', materials: ['plaster', 'glass'], windows: ['round'], accents: ['none', 'flag', 'sign'] },
  { id: 'cable-car', label: 'Cable car', materials: ['wood', 'plaster', 'glass'], windows: ['square', 'round'], accents: ['none', 'flag', 'flower-box', 'sign'] },
  { id: 'rocket-house', label: 'Rocket house', materials: ['plaster', 'glass'], windows: ['round', 'arched'], accents: ['none', 'sign'] },
  { id: 'moon-base', label: 'Moon base', materials: ['plaster', 'glass'], windows: ['round', 'square'], accents: ['none', 'flag'] },
  { id: 'mushroom-house', label: 'Mushroom house', materials: ['plaster', 'wood'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'acorn-house', label: 'Acorn house', materials: ['wood'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'teapot-house', label: 'Teapot house', materials: ['plaster', 'wood'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'boot-house', label: 'Boot house', materials: ['wood', 'plaster'], windows: ['square', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'pumpkin-house', label: 'Pumpkin house', materials: ['plaster', 'wood'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'lantern-house', label: 'Lantern house', materials: ['plaster', 'glass'], windows: ['square', 'arched'], accents: ['none', 'sign'] },
  { id: 'shell-house', label: 'Shell house', materials: ['plaster', 'glass'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'beehive-home', label: 'Beehive home', materials: ['wood', 'plaster'], windows: ['round', 'arched'], accents: ['none', 'flower-box', 'sign'] },
  { id: 'cloud-home', label: 'Cloud home', materials: ['plaster', 'glass', 'canvas'], windows: ['round'], accents: ['none', 'sign'] },
  { id: 'tree-stump-home', label: 'Tree stump home', materials: ['wood'], windows: ['round', 'arched', 'shuttered'], accents: ['none', 'chimney', 'flower-box', 'sign'] },
] as const satisfies readonly {
  readonly id: string;
  readonly label: string;
  readonly materials: readonly Material[];
  readonly windows: readonly WindowStyle[];
  readonly accents: readonly Accent[];
}[];

type Dwelling = (typeof dwellingDefinitions)[number]['id'];
const dwellingOptions = Object.freeze(
  dwellingDefinitions.map(({ id }) => id),
) as readonly Dwelling[];

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: backgroundShapeNames,
  },
  palette: {
    type: 'select',
    default: 'grove',
    options: paletteNames,
  },
  dwelling: {
    type: 'select',
    default: 'cabin',
    options: dwellingOptions,
  },
  expression: {
    type: 'select',
    default: 'soft-smile',
    options: expressionOptions,
  },
  windowStyle: {
    type: 'select',
    default: 'arched',
    options: windowStyleOptions,
  },
  material: {
    type: 'select',
    default: 'wood',
    options: materialOptions,
  },
  accent: {
    type: 'select',
    default: 'chimney',
    options: accentOptions,
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'dwelling' as const;

export type NooksParams = ParamsFromSchema<typeof schema>;

interface FaceLayout {
  leftX: number;
  rightX: number;
  eyeY: number;
  eyeWidth: number;
  eyeHeight: number;
  mouthX: number;
  mouthY: number;
  mouthWidth: number;
  mouthHeight: number;
  mouthKind: 'door' | 'gate' | 'tent' | 'hatch' | 'shop';
}

interface SurfaceLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AccentLayout {
  roofX: number;
  roofY: number;
  sideX: number;
  sideY: number;
  frontY: number;
  scale: number;
}

interface NookLayout {
  behind: string;
  body: string;
  front: string;
  face: FaceLayout;
  surface: SurfaceLayout;
  accent: AccentLayout;
}

interface NookArt {
  tilt: number;
  contour: number;
  leftEyeScale: number;
  rightEyeScale: number;
  eyeSkew: number;
  gazeX: number;
  gazeY: number;
  mouthShiftX: number;
  materialShift: number;
  accentOnLeft: boolean;
}

interface AccentLayers {
  behind: string;
  front: string;
}

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Nooks ${param}: ${String(value)}`);
}

function assertNooksParams(params: NooksParams): void {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    throw new Error('Invalid Nooks parameters');
  }

  const values = params as Record<string, unknown>;
  for (const [key, definition] of Object.entries(schema)) {
    const value = values[key];
    if (
      typeof value !== 'string'
      || !(definition.options as readonly string[]).includes(value)
    ) {
      invalidOption(key, value);
    }
  }
  for (const key of Object.keys(values)) {
    if (!(key in schema)) throw new Error(`Unknown Nooks parameter: ${key}`);
  }
}

function resolveNookArt(variation: ArtVariation): NookArt {
  return {
    tilt: variation.number('dwelling-tilt', -0.8, 0.8),
    contour: variation.number('contour', -0.9, 0.9),
    leftEyeScale: variation.number('left-window-scale', 0.94, 1.06),
    rightEyeScale: variation.number('right-window-scale', 0.94, 1.06),
    eyeSkew: variation.number('window-skew', -0.55, 0.55),
    gazeX: variation.number('gaze-x', -0.7, 0.7),
    gazeY: variation.number('gaze-y', -0.4, 0.5),
    mouthShiftX: variation.number('door-shift-x', -0.75, 0.75),
    materialShift: variation.number('material-shift', -0.8, 0.8),
    accentOnLeft: variation.bool('accent-side'),
  };
}

function renderDwelling(
  dwelling: Dwelling,
  palette: Palette,
  art: NookArt,
): NookLayout {
  const primaryEdge = tonalEdge(palette.primary, palette.ink, 0.32);
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.32);
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.32);
  const outline = `stroke="${primaryEdge}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
  const secondaryOutline = `stroke="${secondaryEdge}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
  const accentOutline = `stroke="${accentEdge}" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"`;
  const fineOutline = `stroke="${secondaryEdge}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"`;
  const contour = art.contour;

  switch (dwelling) {
    case 'cabin':
      return {
        behind: '',
        body: `
          <path d="M20 47Q33 28 ${50 + contour} 15Q67 29 81 47V82H20Z" fill="${palette.primary}" ${outline}/>
          <path d="M24 46Q36 31 ${50 + contour} 20Q64 31 77 46L73 51Q61 38 50 30Q39 39 27 51Z" fill="${palette.secondary}"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 61.5, eyeY: 52, eyeWidth: 12, eyeHeight: 12.5, mouthX: 50, mouthY: 70, mouthWidth: 14, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 27, y: 45, width: 47, height: 32 },
        accent: { roofX: 65, roofY: 22, sideX: 77, sideY: 42, frontY: 61, scale: 1 },
      };

    case 'townhouse':
      return {
        behind: '',
        body: `
          <path d="M30 29V23H38V${18 + contour}H63V23H71V84H30Z" fill="${palette.primary}" ${outline}/>
          <path d="M30 29H71V36H30Z" fill="${palette.secondary}"/>
        `,
        front: '',
        face: { leftX: 39.5, rightX: 61.5, eyeY: 49, eyeWidth: 11.5, eyeHeight: 12.5, mouthX: 50.5, mouthY: 70, mouthWidth: 14, mouthHeight: 18, mouthKind: 'door' },
        surface: { x: 33, y: 38, width: 35, height: 39 },
        accent: { roofX: 63, roofY: 17, sideX: 73, sideY: 36, frontY: 61, scale: 0.86 },
      };

    case 'lighthouse':
      return {
        behind: '',
        body: `
          <path d="M35 23Q50 11 66 23L67 25V36H63L69 85H31L39 36H34V25Z" fill="${palette.primary}" ${outline}/>
          <path d="M37 25Q37 22 40 22H61Q64 22 64 25V34H37Z" fill="${palette.secondary}"/>
          <circle cx="50.5" cy="28.5" r="5" fill="${palette.accent}" opacity="0.82"/>
          <path d="M34 63H66L68 75H32Z" fill="${palette.accent}" opacity="0.62"/>
        `,
        front: '',
        face: { leftX: 43, rightX: 58.5, eyeY: 49, eyeWidth: 9.5, eyeHeight: 11, mouthX: 50.5, mouthY: 71, mouthWidth: 12, mouthHeight: 17, mouthKind: 'gate' },
        surface: { x: 36, y: 39, width: 29, height: 40 },
        accent: { roofX: 59, roofY: 15, sideX: 66, sideY: 29, frontY: 57, scale: 0.78 },
      };

    case 'tent':
      return {
        behind: '',
        body: `
          <path d="M${50 + contour} 18L84 81H20Z" fill="${palette.primary}" ${outline}/>
          <path d="M23 78L${49 + contour} 24L50 81H21Z" fill="${palette.secondary}" opacity="0.62"/>
        `,
        front: '',
        face: { leftX: 39.5, rightX: 60.5, eyeY: 51, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50, mouthY: 68.5, mouthWidth: 14, mouthHeight: 15, mouthKind: 'tent' },
        surface: { x: 29, y: 39, width: 42, height: 35 },
        accent: { roofX: 50, roofY: 16, sideX: 75, sideY: 59, frontY: 62, scale: 0.88 },
      };

    case 'camper':
      return {
        behind: `
          <circle cx="31" cy="78" r="8" fill="${tonalEdge(palette.primary, palette.ink, 0.56)}"/>
          <circle cx="70" cy="78" r="8" fill="${tonalEdge(palette.primary, palette.ink, 0.56)}"/>
        `,
        body: `
          <path d="M17 43Q17 34 26 32H68Q82 32 84 48V74H17Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 61Q49 65 83 60V74H17Z" fill="${palette.accent}" opacity="0.72"/>
          <path d="M25 32Q45 ${28 + contour} 67 32" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 34.5, rightX: 56, eyeY: 48, eyeWidth: 13.5, eyeHeight: 12.5, mouthX: 45.5, mouthY: 64, mouthWidth: 15, mouthHeight: 11, mouthKind: 'hatch' },
        surface: { x: 22, y: 38, width: 56, height: 31 },
        accent: { roofX: 62, roofY: 30, sideX: 79, sideY: 40, frontY: 59, scale: 0.86 },
      };

    case 'windmill':
      return {
        behind: '',
        body: `
          <path d="M31 84L38 38Q50 18 62 38L69 84Z" fill="${palette.primary}" ${outline}/>
          <path d="M35 38Q50 20 65 38Z" fill="${palette.accent}"/>
          <path d="M47 40Q34 29 18 17Q15 15 18 22Q28 36 45 45Z" fill="${palette.secondary}"/>
          <path d="M53 40Q66 28 82 16Q85 14 82 22Q72 36 55 45Z" fill="${palette.secondary}"/>
          <path d="M54 44Q67 55 84 69Q87 72 80 69Q65 61 49 47Z" fill="${palette.secondary}"/>
          <path d="M46 44Q34 56 18 72Q15 75 18 68Q27 54 51 41Z" fill="${palette.secondary}"/>
          <circle cx="50" cy="42" r="5.5" fill="${palette.secondary}" ${fineOutline}/>
        `,
        front: '',
        face: { leftX: 42, rightX: 58, eyeY: 54, eyeWidth: 9.5, eyeHeight: 10.5, mouthX: 50, mouthY: 71, mouthWidth: 13, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 36, y: 45, width: 29, height: 34 },
        accent: { roofX: 58, roofY: 26, sideX: 64, sideY: 39, frontY: 61, scale: 0.72 },
      };

    case 'greenhouse':
      return {
        behind: '',
        body: `
          <path d="M22 44L36 24H64L79 44V83H22Z" fill="${palette.secondary}" fill-opacity="0.8" ${secondaryOutline}/>
          <path d="M25 77Q38 68 50 76Q63 67 76 77V82H25Z" fill="${palette.primary}" opacity="0.72"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62, eyeY: 53, eyeWidth: 12.5, eyeHeight: 12.5, mouthX: 50.5, mouthY: 69, mouthWidth: 14, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 27, y: 44, width: 47, height: 34 },
        accent: { roofX: 59, roofY: 23, sideX: 77, sideY: 43, frontY: 62, scale: 0.88 },
      };

    case 'tower':
      return {
        behind: '',
        body: `
          <path d="M31 40Q29.5 62 26.5 84H74.5Q71.5 62 70 40Z" fill="${palette.primary}" ${outline}/>
          <path d="M${50 + contour} 12L78 38Q50 42 23 38Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M35 40.5V45.5M66 40.5V45.5" fill="none" stroke="${secondaryEdge}" stroke-width="3.4" stroke-linecap="round"/>
          <path d="M30 47H71" fill="none" stroke="${primaryEdge}" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
          <path d="M46 51V46.5Q46 42.5 50.5 42.5Q55 42.5 55 46.5V51Z" fill="${palette.secondary}" ${fineOutline}/>
          <path d="M44.5 51.5H56.5" fill="none" stroke="${secondaryEdge}" stroke-width="1.7" stroke-linecap="round"/>
          <path d="M24 78H77V85H24Z" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 59, eyeWidth: 11.5, eyeHeight: 11.5, mouthX: 50.5, mouthY: 76, mouthWidth: 14.5, mouthHeight: 14, mouthKind: 'gate' },
        surface: { x: 32, y: 58, width: 37, height: 18 },
        accent: { roofX: 56, roofY: 17, sideX: 74, sideY: 44, frontY: 66, scale: 0.78 },
      };

    case 'houseboat':
      return {
        behind: `<path d="M14 83Q31 78 48 83T86 83" fill="none" stroke="${palette.secondary}" stroke-width="4.5" stroke-linecap="round"/>`,
        body: `
          <path d="M18 67H28V38Q49 ${31 + contour} 72 38V67H84L76 82H27Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 67H84L76 82H27Z" fill="${palette.accent}"/>
          <path d="M23 39Q49 27 78 39" fill="none" stroke="${palette.secondary}" stroke-width="5.5" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 39.5, rightX: 61.5, eyeY: 50, eyeWidth: 12, eyeHeight: 11.5, mouthX: 50.5, mouthY: 63, mouthWidth: 17, mouthHeight: 10, mouthKind: 'hatch' },
        surface: { x: 31, y: 40, width: 38, height: 27 },
        accent: { roofX: 64, roofY: 32, sideX: 73, sideY: 40, frontY: 60, scale: 0.84 },
      };

    case 'storefront':
      return {
        behind: '',
        body: `
          <path d="M22 27H79V84H22Z" fill="${palette.primary}" ${outline}/>
          <path d="M22 35H79V47H22Z" fill="${palette.secondary}"/>
          <path d="M23 47H78V57Q72 62 66 57Q60 62 54 57Q48 62 42 57Q35 62 29 57Q24 61 23 56Z" fill="${palette.accent}"/>
        `,
        front: '',
        face: { leftX: 36.5, rightX: 63.5, eyeY: 66, eyeWidth: 14, eyeHeight: 11.5, mouthX: 50, mouthY: 77, mouthWidth: 14, mouthHeight: 11, mouthKind: 'shop' },
        surface: { x: 27, y: 58, width: 47, height: 20 },
        accent: { roofX: 65, roofY: 25, sideX: 78, sideY: 36, frontY: 66, scale: 0.88 },
      };

    case 'cottage':
      return {
        behind: '',
        body: `
          <path d="M17 48Q28 37 38 34Q43 23 ${53 + contour} 18Q68 27 72 40Q80 43 84 49V83H17Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 49Q31 37 42 36Q46 27 ${53 + contour} 22Q66 31 70 43Q77 44 82 50L78 55Q69 49 65 47Q61 35 53 30Q46 36 44 43Q32 43 22 56Z" fill="${palette.secondary}"/>
        `,
        front: `<path d="M20 79Q50 75 82 79V84H20Z" fill="${palette.accent}" opacity="0.38"/>`,
        face: { leftX: 38.5, rightX: 62, eyeY: 54, eyeWidth: 12, eyeHeight: 12, mouthX: 50.5, mouthY: 71, mouthWidth: 14, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 25, y: 47, width: 51, height: 32 },
        accent: { roofX: 66, roofY: 27, sideX: 78, sideY: 48, frontY: 63, scale: 0.88 },
      };

    case 'treehouse':
      return {
        behind: `
          <path d="M43 84Q48 66 46 54Q39 50 27 53Q35 46 46 46Q49 34 52 22Q56 37 55 47Q66 42 77 47Q65 49 56 55Q55 69 61 84Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M25 31Q34 18 49 24Q59 12 72 25Q84 29 79 42Q66 47 53 41Q40 47 27 41Q19 38 25 31Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        body: `
          <path d="M22 42L35 29H67L80 42V70H22Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 69H84L80 75H22Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M26 42L38 33H64L76 42Z" fill="${palette.secondary}"/>
        `,
        front: `<path d="M50 75V84M29 75L24 82M72 75L78 82" fill="none" stroke="${secondaryEdge}" stroke-width="3.8" stroke-linecap="round"/>`,
        face: { leftX: 39, rightX: 62, eyeY: 50, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50.5, mouthY: 63, mouthWidth: 13.5, mouthHeight: 13, mouthKind: 'hatch' },
        surface: { x: 27, y: 43, width: 47, height: 24 },
        accent: { roofX: 65, roofY: 28, sideX: 77, sideY: 43, frontY: 59, scale: 0.78 },
      };

    case 'stilt-house':
      return {
        behind: `
          <path data-cue="stable-stilt" d="M24 63H34L28 88H18Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-cue="stable-stilt" d="M67 63H77L83 88H73Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-cue="cross-brace" d="M24 75L36 87M76 75L65 87" fill="none" stroke="${secondaryEdge}" stroke-width="2.5" stroke-linecap="round"/>
          <path data-cue="waterline" d="M9 88Q25 84 41 88T74 88T92 87" fill="none" stroke="${secondaryEdge}" stroke-width="3" stroke-linecap="round"/>
        `,
        body: `
          <path d="M19 37L35 24H67L82 37V67H19Z" fill="${palette.primary}" ${outline}/>
          <path d="M15 39L34 20H68L86 39L81 44L65 30H37L21 44Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-cue="raised-deck" d="M14 64H87V71H14Z" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        front: '',
        face: { leftX: 38, rightX: 63, eyeY: 47, eyeWidth: 12.5, eyeHeight: 11.5, mouthX: 50.5, mouthY: 59, mouthWidth: 15, mouthHeight: 12, mouthKind: 'hatch' },
        surface: { x: 25, y: 40, width: 51, height: 24 },
        accent: { roofX: 66, roofY: 22, sideX: 79, sideY: 39, frontY: 55, scale: 0.84 },
      };

    case 'hillside-home':
      return {
        behind: `<path d="M10 72Q17 43 44 37Q68 28 90 54V84H10Z" fill="${palette.secondary}" ${secondaryOutline}/>` ,
        body: `
          <path d="M19 75Q23 46 50 41Q77 45 82 75V84H19Z" fill="${palette.primary}" ${outline}/>
          <path d="M16 52Q34 32 53 38Q72 34 86 52Q70 46 54 47Q34 43 16 52Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 58, eyeWidth: 12, eyeHeight: 11, mouthX: 50.5, mouthY: 75, mouthWidth: 15, mouthHeight: 16, mouthKind: 'door' },
        surface: { x: 27, y: 50, width: 47, height: 30 },
        accent: { roofX: 65, roofY: 39, sideX: 79, sideY: 53, frontY: 68, scale: 0.8 },
      };

    case 'snow-dome':
      return {
        behind: `<path d="M14 82Q50 76 86 82" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>`,
        body: `
          <path d="M18 75Q20 31 50 24Q80 31 83 75V83H18Z" fill="${palette.primary}" ${outline}/>
          <path d="M23 56Q50 49 78 56M31 37Q50 43 69 37M35 75Q34 62 50 61Q66 62 66 75" fill="none" stroke="${palette.secondary}" stroke-width="2.2" stroke-linecap="round" opacity="0.72"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 61.5, eyeY: 50, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50, mouthY: 69, mouthWidth: 15, mouthHeight: 17, mouthKind: 'gate' },
        surface: { x: 27, y: 37, width: 47, height: 40 },
        accent: { roofX: 62, roofY: 27, sideX: 79, sideY: 53, frontY: 64, scale: 0.78 },
      };

    case 'yurt':
      return {
        behind: '',
        body: `
          <path d="M17 49Q28 34 50 31Q72 34 84 49L79 82H21Z" fill="${palette.primary}" ${outline}/>
          <path d="M16 49Q31 27 50 26Q70 27 85 49L78 53Q65 39 50 37Q35 39 23 54Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M31 34Q50 29 69 34" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
        `,
        front: `<path d="M22 76Q50 72 79 76" fill="none" stroke="${secondaryEdge}" stroke-width="2" stroke-linecap="round"/>`,
        face: { leftX: 38, rightX: 62, eyeY: 55, eyeWidth: 12, eyeHeight: 10.5, mouthX: 50, mouthY: 70, mouthWidth: 14, mouthHeight: 16, mouthKind: 'tent' },
        surface: { x: 25, y: 49, width: 50, height: 29 },
        accent: { roofX: 64, roofY: 29, sideX: 79, sideY: 51, frontY: 65, scale: 0.82 },
      };

    case 'adobe-home':
      return {
        behind: '',
        body: `
          <path d="M19 44H29V31H49V24H70V39H81V84H19Z" fill="${palette.primary}" ${outline}/>
          <path d="M19 44H29V37H49V31H70V45H81V52H19Z" fill="${palette.secondary}" opacity="0.72"/>
          <path d="M29 31Q38 ${29 + contour} 49 31M49 24Q59 ${22 + contour} 70 24" fill="none" stroke="${primaryEdge}" stroke-width="1.5"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62, eyeY: 55, eyeWidth: 12, eyeHeight: 12, mouthX: 50, mouthY: 71.5, mouthWidth: 14, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 25, y: 46, width: 51, height: 34 },
        accent: { roofX: 64, roofY: 23, sideX: 79, sideY: 43, frontY: 65, scale: 0.85 },
      };

    case 'tea-house':
      return {
        behind: `<path d="M27 47V82M74 47V82" fill="none" stroke="${secondaryEdge}" stroke-width="5" stroke-linecap="round"/>`,
        body: `
          <path d="M22 43H79V83H22Z" fill="${palette.primary}" ${outline}/>
          <path d="M12 44Q31 35 42 25Q50 34 59 25Q70 36 89 43Q70 48 51 42Q32 48 12 44Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M25 55H76" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 58.5, eyeWidth: 12.5, eyeHeight: 11.5, mouthX: 50.5, mouthY: 74, mouthWidth: 14, mouthHeight: 16, mouthKind: 'door' },
        surface: { x: 27, y: 50, width: 47, height: 30 },
        accent: { roofX: 63, roofY: 27, sideX: 78, sideY: 47, frontY: 67, scale: 0.82 },
      };

    case 'cliff-home':
      return {
        behind: `<path d="M13 80Q13 43 25 23Q38 13 47 25Q51 39 43 49Q52 66 45 84H13Z" fill="${palette.secondary}" ${secondaryOutline}/>` ,
        body: `
          <path d="M29 46Q48 27 77 38Q86 51 82 84H26Q23 62 29 46Z" fill="${palette.primary}" ${outline}/>
          <path d="M25 47Q41 33 55 35Q69 30 80 40" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
        `,
        front: `<path d="M24 78Q48 73 82 78V84H25Z" fill="${palette.secondary}" opacity="0.45"/>`,
        face: { leftX: 47, rightX: 68, eyeY: 53, eyeWidth: 10.5, eyeHeight: 11, mouthX: 57.5, mouthY: 70, mouthWidth: 13.5, mouthHeight: 17, mouthKind: 'gate' },
        surface: { x: 38, y: 42, width: 39, height: 37 },
        accent: { roofX: 65, roofY: 32, sideX: 79, sideY: 44, frontY: 64, scale: 0.76 },
      };

    case 'bridge-house':
      return {
        behind: `<path d="M12 81Q18 61 33 61Q50 61 55 81M45 81Q51 59 68 59Q83 59 89 81" fill="none" stroke="${secondaryEdge}" stroke-width="8" stroke-linecap="round"/>`,
        body: `
          <path d="M19 39L34 27H68L82 39V65H19Z" fill="${palette.primary}" ${outline}/>
          <path d="M13 66H88V75H13Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M18 40L33 24H69L84 40L79 44L66 31H36L23 45Z" fill="${palette.secondary}"/>
        `,
        front: '',
        face: { leftX: 38, rightX: 63, eyeY: 47, eyeWidth: 12, eyeHeight: 10.5, mouthX: 50.5, mouthY: 60, mouthWidth: 14, mouthHeight: 12, mouthKind: 'hatch' },
        surface: { x: 25, y: 40, width: 51, height: 22 },
        accent: { roofX: 65, roofY: 24, sideX: 80, sideY: 40, frontY: 57, scale: 0.8 },
      };

    case 'observatory':
      return {
        behind: '',
        body: `
          <path d="M24 47Q27 19 50 16Q73 19 77 47V84H24Z" fill="${palette.primary}" ${outline}/>
          <path d="M23 47Q27 18 50 15Q73 18 78 47Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M50 17L58 46H49Z" fill="${palette.accent}" opacity="0.78"/>
          <path d="M23 47H78" fill="none" stroke="${secondaryEdge}" stroke-width="4"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 57, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50.5, mouthY: 74, mouthWidth: 14, mouthHeight: 17, mouthKind: 'hatch' },
        surface: { x: 29, y: 49, width: 43, height: 31 },
        accent: { roofX: 63, roofY: 19, sideX: 75, sideY: 46, frontY: 68, scale: 0.76 },
      };

    case 'library':
      return {
        behind: '',
        body: `
          <path d="M21 42H80V84H21Z" fill="${palette.primary}" ${outline}/>
          <path d="M16 42L50 20L85 42Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M25 47H76M28 47V80M73 47V80" fill="none" stroke="${palette.accent}" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M18 80H83V85H18Z" fill="${palette.secondary}"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 55, eyeWidth: 11.5, eyeHeight: 12, mouthX: 50.5, mouthY: 72, mouthWidth: 15, mouthHeight: 17, mouthKind: 'gate' },
        surface: { x: 29, y: 47, width: 43, height: 32 },
        accent: { roofX: 64, roofY: 25, sideX: 78, sideY: 44, frontY: 66, scale: 0.82 },
      };

    case 'bakery':
      return {
        behind: '',
        body: `
          <path d="M20 39Q31 25 50 24Q69 25 81 39V84H20Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 43Q29 29 50 28Q71 29 83 43L78 48Q68 39 50 38Q33 39 23 48Z" fill="${palette.secondary}"/>
          <path d="M25 49Q31 43 37 49T49 49T61 49T73 49T79 49V56H25Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        front: `<path d="M43 31Q50 25 57 31" fill="none" stroke="${accentEdge}" stroke-width="2.2" stroke-linecap="round"/>`,
        face: { leftX: 38, rightX: 62, eyeY: 60, eyeWidth: 11.5, eyeHeight: 10.5, mouthX: 50, mouthY: 75, mouthWidth: 14, mouthHeight: 15, mouthKind: 'shop' },
        surface: { x: 27, y: 56, width: 47, height: 24 },
        accent: { roofX: 64, roofY: 26, sideX: 79, sideY: 45, frontY: 67, scale: 0.82 },
      };

    case 'bathhouse':
      return {
        behind: `
          <path d="M34 28Q28 21 35 15M50 26Q44 19 51 12M66 28Q60 21 67 15" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round" opacity="0.78"/>
        `,
        body: `
          <path d="M20 43H81V84H20Z" fill="${palette.primary}" ${outline}/>
          <path d="M14 43Q31 35 43 24Q50 31 58 24Q70 35 87 43Q68 48 51 42Q32 48 14 43Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M25 52H76" fill="none" stroke="${palette.accent}" stroke-width="3.4" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 58, eyeWidth: 12, eyeHeight: 11, mouthX: 50.5, mouthY: 74, mouthWidth: 15, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 27, y: 49, width: 47, height: 31 },
        accent: { roofX: 64, roofY: 27, sideX: 78, sideY: 47, frontY: 67, scale: 0.8 },
      };

    case 'train-station':
      return {
        behind: '',
        body: `
          <path d="M17 42H84V84H17Z" fill="${palette.primary}" ${outline}/>
          <path d="M11 42L30 27H71L90 42L85 47H16Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <circle cx="50.5" cy="34" r="7" fill="${palette.accent}" ${accentOutline}/>
          <path d="M50.5 30V34L54 36" fill="none" stroke="${palette.ink}" stroke-width="1.7" stroke-linecap="round"/>
        `,
        front: `<path d="M14 80H87" fill="none" stroke="${secondaryEdge}" stroke-width="5" stroke-linecap="round"/>`,
        face: { leftX: 36.5, rightX: 64.5, eyeY: 55, eyeWidth: 13.5, eyeHeight: 11, mouthX: 50.5, mouthY: 70, mouthWidth: 16, mouthHeight: 17, mouthKind: 'gate' },
        surface: { x: 23, y: 47, width: 55, height: 32 },
        accent: { roofX: 68, roofY: 26, sideX: 82, sideY: 43, frontY: 65, scale: 0.82 },
      };

    case 'firehouse':
      return {
        behind: '',
        body: `
          <path data-cue="stepped-hose-tower" d="M18 41H32V27H39V18H62V27H69V41H83V84H18Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 41H83V48H18Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-cue="fire-bell" d="M42 34H59L56.5 30Q56 23 50.5 22Q45 23 44.5 30Z" fill="${palette.accent}" ${accentOutline}/>
          <circle cx="50.5" cy="34" r="2.2" fill="${accentEdge}"/>
          <path data-cue="apparatus-bay" d="M29 84V65Q29 56 50.5 56Q72 56 72 65V84Z" fill="${palette.accent}" fill-opacity="0.48" stroke="${accentEdge}" stroke-width="1.7" stroke-linejoin="round"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 49, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50.5, mouthY: 70, mouthWidth: 27, mouthHeight: 22, mouthKind: 'shop' },
        surface: { x: 23, y: 45, width: 55, height: 34 },
        accent: { roofX: 67, roofY: 17, sideX: 79, sideY: 42, frontY: 64, scale: 0.76 },
      };

    case 'workshop':
      return {
        behind: '',
        body: `
          <path d="M18 39L31 27L43 39L56 24L69 39L82 29V84H18Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 39L31 27L43 39L56 24L69 39L82 29V45L69 52L56 38L44 52L31 40L18 50Z" fill="${palette.secondary}" opacity="0.76"/>
        `,
        front: `<path d="M27 79H75" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>`,
        face: { leftX: 38.5, rightX: 62.5, eyeY: 56, eyeWidth: 12, eyeHeight: 11.5, mouthX: 50.5, mouthY: 72, mouthWidth: 15, mouthHeight: 16, mouthKind: 'shop' },
        surface: { x: 25, y: 47, width: 51, height: 32 },
        accent: { roofX: 66, roofY: 27, sideX: 79, sideY: 42, frontY: 66, scale: 0.82 },
      };

    case 'theater':
      return {
        behind: '',
        body: `
          <path d="M20 37H81V84H20Z" fill="${palette.primary}" ${outline}/>
          <path d="M15 37L50 19L86 37Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M24 43H77L72 54H29Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M28 55Q34 68 28 80M73 55Q67 68 73 80" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 59, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50.5, mouthY: 74, mouthWidth: 16, mouthHeight: 15, mouthKind: 'shop' },
        surface: { x: 29, y: 52, width: 43, height: 28 },
        accent: { roofX: 64, roofY: 22, sideX: 78, sideY: 40, frontY: 65, scale: 0.8 },
      };

    case 'barn':
      return {
        behind: '',
        body: `
          <path d="M18 47L28 26H40L50 18L61 26H73L83 47V84H18Z" fill="${palette.primary}" ${outline}/>
          <path d="M17 47L27 23H39L50 15L62 23H74L84 47L78 51L69 31H59L50 24L42 31H32L23 52Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M31 59H70V84H31Z" fill="${palette.accent}" opacity="0.5"/>
        `,
        front: `<path d="M32 61L69 83M69 61L32 83" fill="none" stroke="${secondaryEdge}" stroke-width="2.3" opacity="0.72"/>`,
        face: { leftX: 39.5, rightX: 61.5, eyeY: 52, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50.5, mouthY: 71, mouthWidth: 24, mouthHeight: 22, mouthKind: 'shop' },
        surface: { x: 25, y: 48, width: 51, height: 32 },
        accent: { roofX: 65, roofY: 22, sideX: 80, sideY: 45, frontY: 64, scale: 0.8 },
      };

    case 'boathouse':
      return {
        behind: `<path d="M12 83Q29 77 46 83T88 82" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>`,
        body: `
          <path d="M21 43L37 28H65L81 43V78H21Z" fill="${palette.primary}" ${outline}/>
          <path d="M15 45L35 24H67L87 45L81 49L63 33H39L22 50Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M17 77H85L77 84H25Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 52, eyeWidth: 12, eyeHeight: 11, mouthX: 50.5, mouthY: 68, mouthWidth: 17, mouthHeight: 16, mouthKind: 'gate' },
        surface: { x: 27, y: 45, width: 47, height: 29 },
        accent: { roofX: 65, roofY: 25, sideX: 79, sideY: 44, frontY: 62, scale: 0.8 },
      };

    case 'caravan':
      return {
        behind: `
          <circle cx="30" cy="78" r="8" fill="${primaryEdge}"/>
          <circle cx="72" cy="78" r="8" fill="${primaryEdge}"/>
        `,
        body: `
          <path d="M15 47Q17 29 35 26H67Q83 29 85 47V75H15Z" fill="${palette.primary}" ${outline}/>
          <path d="M18 48Q20 34 36 32H65Q79 34 82 48" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>
          <path d="M16 67H84V75H16Z" fill="${palette.accent}" opacity="0.72"/>
        `,
        front: '',
        face: { leftX: 36.5, rightX: 63, eyeY: 49, eyeWidth: 13, eyeHeight: 12, mouthX: 50, mouthY: 64, mouthWidth: 15, mouthHeight: 13, mouthKind: 'hatch' },
        surface: { x: 22, y: 38, width: 56, height: 29 },
        accent: { roofX: 65, roofY: 28, sideX: 81, sideY: 43, frontY: 61, scale: 0.82 },
      };

    case 'water-tower-home':
      return {
        behind: `
          <path d="M35 61L27 85M65 61L74 85M33 72H68M29 82H72" fill="none" stroke="${secondaryEdge}" stroke-width="3.6" stroke-linecap="round"/>
        `,
        body: `
          <path d="M25 26Q50 18 76 26L72 59Q50 68 29 59Z" fill="${palette.primary}" ${outline}/>
          <path d="M24 27Q50 15 77 27L72 33Q50 27 29 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M28 53Q50 59 73 52" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 39.5, rightX: 61.5, eyeY: 40, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50.5, mouthY: 54, mouthWidth: 13, mouthHeight: 13, mouthKind: 'hatch' },
        surface: { x: 31, y: 31, width: 39, height: 27 },
        accent: { roofX: 64, roofY: 20, sideX: 74, sideY: 35, frontY: 49, scale: 0.74 },
      };

    case 'caboose-home':
      return {
        behind: `
          <circle cx="29" cy="78" r="7" fill="${primaryEdge}"/>
          <circle cx="72" cy="78" r="7" fill="${primaryEdge}"/>
        `,
        body: `
          <path d="M14 43H87V75H14Z" fill="${palette.primary}" ${outline}/>
          <path d="M34 32H67L72 43H29Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M18 65H83V75H18Z" fill="${palette.accent}" opacity="0.7"/>
          <path d="M10 47H18M83 47H91" stroke="${secondaryEdge}" stroke-width="4" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 36, rightX: 64, eyeY: 51, eyeWidth: 13, eyeHeight: 10.5, mouthX: 50, mouthY: 64, mouthWidth: 15, mouthHeight: 12, mouthKind: 'hatch' },
        surface: { x: 21, y: 46, width: 58, height: 23 },
        accent: { roofX: 63, roofY: 30, sideX: 84, sideY: 44, frontY: 61, scale: 0.78 },
      };

    case 'space-capsule':
      return {
        behind: `<path d="M33 69L24 83M67 69L77 83M20 84H31M70 84H81" fill="none" stroke="${secondaryEdge}" stroke-width="4" stroke-linecap="round"/>`,
        body: `
          <path d="M29 33Q33 17 50 13Q67 17 72 33L68 72Q50 80 32 72Z" fill="${palette.primary}" ${outline}/>
          <path d="M30 34Q50 25 71 34L68 44Q50 37 32 44Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M33 67Q50 73 68 67" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 40, rightX: 60.5, eyeY: 40, eyeWidth: 10.5, eyeHeight: 10.5, mouthX: 50.5, mouthY: 58, mouthWidth: 13, mouthHeight: 14, mouthKind: 'hatch' },
        surface: { x: 34, y: 36, width: 33, height: 31 },
        accent: { roofX: 61, roofY: 16, sideX: 70, sideY: 34, frontY: 54, scale: 0.7 },
      };

    case 'airship-cabin':
      return {
        behind: `
          <path d="M12 34Q17 13 50 12Q83 13 89 34Q82 52 50 53Q18 52 12 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M21 25Q50 17 80 25M21 42Q50 49 80 42" fill="none" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
          <path d="M34 48L30 59M67 48L71 59" stroke="${secondaryEdge}" stroke-width="2.4"/>
        `,
        body: `
          <path d="M23 58Q50 48 78 58L73 80H28Z" fill="${palette.primary}" ${outline}/>
          <path d="M20 58Q50 45 81 58L77 64Q50 55 24 64Z" fill="${palette.accent}" ${accentOutline}/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 63, eyeWidth: 11, eyeHeight: 9.5, mouthX: 50.5, mouthY: 75, mouthWidth: 14, mouthHeight: 10, mouthKind: 'hatch' },
        surface: { x: 30, y: 58, width: 42, height: 19 },
        accent: { roofX: 65, roofY: 49, sideX: 75, sideY: 59, frontY: 70, scale: 0.7 },
      };

    case 'silo-home':
      return {
        behind: '',
        body: `
          <path d="M29 35Q32 16 50 14Q69 16 72 35V84H29Z" fill="${palette.primary}" ${outline}/>
          <path d="M28 35Q31 15 50 12Q70 15 73 35Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M30 49H71M30 68H71" fill="none" stroke="${palette.accent}" stroke-width="2.5" opacity="0.62"/>
        `,
        front: '',
        face: { leftX: 40.5, rightX: 60.5, eyeY: 48, eyeWidth: 10.5, eyeHeight: 11, mouthX: 50.5, mouthY: 69, mouthWidth: 13, mouthHeight: 18, mouthKind: 'door' },
        surface: { x: 34, y: 38, width: 33, height: 42 },
        accent: { roofX: 62, roofY: 16, sideX: 70, sideY: 38, frontY: 62, scale: 0.72 },
      };

    case 'submarine-nook':
      return {
        behind: `
          <path d="M17 48L6 38Q2 47 14 55ZM17 66L6 76Q2 67 14 59Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M3.5 50Q6.5 53.5 3.5 57Q6.5 60.5 3.5 64Q0.5 60.5 3.5 57Q0.5 53.5 3.5 50Z" fill="${palette.accent}"/>
        `,
        body: `
          <path d="M42 40V27Q42 21 48 21H58Q64 21 64 27V40Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M53 21V9H62" fill="none" stroke="${secondaryEdge}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M28 40H72Q88 40 88 57Q88 74 72 74H28Q12 74 12 57Q12 40 28 40Z" fill="${palette.primary}" ${outline}/>
          <path d="M16 46Q50 40 84 46" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="21" cy="57" r="3" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.4"/>
          <circle cx="79" cy="57" r="3" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.4"/>
        `,
        front: '',
        face: { leftX: 38, rightX: 62, eyeY: 53, eyeWidth: 11, eyeHeight: 11, mouthX: 50, mouthY: 66, mouthWidth: 14, mouthHeight: 10, mouthKind: 'hatch' },
        surface: { x: 26, y: 46, width: 48, height: 22 },
        accent: { roofX: 61, roofY: 13, sideX: 85, sideY: 49, frontY: 60, scale: 0.74 },
      };

    case 'cable-car':
      return {
        behind: `
          <path d="M8 18Q49 12 92 18" fill="none" stroke="${secondaryEdge}" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M50 16V31M43 21L50 31L57 21" fill="none" stroke="${secondaryEdge}" stroke-width="3" stroke-linecap="round"/>
        `,
        body: `
          <path d="M20 31Q50 26 81 31V76Q50 84 20 76Z" fill="${palette.primary}" ${outline}/>
          <path d="M23 35Q50 30 78 35V48Q50 43 23 48Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M22 69Q50 75 79 69V77Q50 85 22 77Z" fill="${palette.accent}" opacity="0.7"/>
        `,
        front: '',
        face: { leftX: 37.5, rightX: 63, eyeY: 47, eyeWidth: 12.5, eyeHeight: 10.5, mouthX: 50.5, mouthY: 64, mouthWidth: 15, mouthHeight: 13, mouthKind: 'hatch' },
        surface: { x: 26, y: 39, width: 49, height: 31 },
        accent: { roofX: 64, roofY: 27, sideX: 78, sideY: 38, frontY: 60, scale: 0.76 },
      };

    case 'rocket-house':
      return {
        behind: `
          <path d="M34 67L22 81L37 79M67 67L80 81L64 79" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M44 77Q50 91 57 77" fill="${palette.accent}" ${accentOutline}/>
        `,
        body: `
          <path d="M33 68Q31 38 50 11Q70 38 68 68L61 81H40Z" fill="${palette.primary}" ${outline}/>
          <path d="M38 31Q50 13 63 32Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M37 64Q50 70 65 64" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 42, rightX: 58.5, eyeY: 43, eyeWidth: 9.5, eyeHeight: 10.5, mouthX: 50.5, mouthY: 60, mouthWidth: 12, mouthHeight: 14, mouthKind: 'hatch' },
        surface: { x: 37, y: 35, width: 27, height: 36 },
        accent: { roofX: 58, roofY: 17, sideX: 67, sideY: 38, frontY: 56, scale: 0.66 },
      };

    case 'moon-base':
      return {
        behind: `
          <path data-cue="lunar-ground" d="M7 83Q25 78 43 83T78 83T94 82" fill="none" stroke="${secondaryEdge}" stroke-width="4.5" stroke-linecap="round"/>
          <path data-cue="airlock-module" d="M8 57H21V76H8Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path data-cue="solar-array" d="M80 46H95V70H80Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M87.5 47V69M81 58H94" fill="none" stroke="${accentEdge}" stroke-width="1.5" stroke-linecap="round"/>
        `,
        body: `
          <path data-cue="faceted-habitat" d="M18 50L28 32H72L82 50V78H18Z" fill="${palette.primary}" ${outline}/>
          <path data-cue="pressure-roof" d="M28 32H72L78 43H22Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M24 77H76" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 61, eyeY: 53, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50, mouthY: 69, mouthWidth: 14, mouthHeight: 14, mouthKind: 'hatch' },
        surface: { x: 24, y: 43, width: 52, height: 32 },
        accent: { roofX: 84, roofY: 57, sideX: 84, sideY: 57, frontY: 64, scale: 0.68 },
      };

    case 'mushroom-house':
      return {
        behind: '',
        body: `
          <path d="M34 42Q36 25 50 24Q64 25 67 42L73 83H28Z" fill="${palette.primary}" ${outline}/>
          <path d="M10 43Q15 15 50 11Q85 15 91 43Q78 53 64 47Q50 56 37 47Q24 53 10 43Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <circle cx="29" cy="30" r="5" fill="${palette.accent}" opacity="0.72"/>
          <circle cx="67" cy="25" r="4" fill="${palette.accent}" opacity="0.72"/>
        `,
        front: '',
        face: { leftX: 41, rightX: 59.5, eyeY: 52, eyeWidth: 10, eyeHeight: 10.5, mouthX: 50.5, mouthY: 70, mouthWidth: 13, mouthHeight: 18, mouthKind: 'door' },
        surface: { x: 35, y: 45, width: 31, height: 34 },
        accent: { roofX: 65, roofY: 17, sideX: 71, sideY: 43, frontY: 64, scale: 0.68 },
      };

    case 'acorn-house':
      return {
        behind: `<path d="M50 17Q55 8 64 9" fill="none" stroke="${secondaryEdge}" stroke-width="4" stroke-linecap="round"/>`,
        body: `
          <path d="M24 42Q24 20 50 17Q77 20 77 42Q78 68 50 84Q22 68 24 42Z" fill="${palette.primary}" ${outline}/>
          <path d="M20 41Q21 18 50 15Q80 18 81 41Q66 35 50 39Q35 35 20 41Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M29 25L38 37M47 19L52 37M67 24L61 37" stroke="${palette.accent}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 61, eyeY: 49, eyeWidth: 11, eyeHeight: 11, mouthX: 50, mouthY: 67, mouthWidth: 13.5, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 29, y: 39, width: 42, height: 36 },
        accent: { roofX: 64, roofY: 17, sideX: 76, sideY: 41, frontY: 61, scale: 0.74 },
      };

    case 'teapot-house':
      return {
        behind: `
          <path d="M25 45Q7 43 10 62Q13 78 29 69" fill="none" stroke="${secondaryEdge}" stroke-width="7" stroke-linecap="round"/>
          <path d="M72 40Q86 33 91 25Q93 39 76 51" fill="${palette.secondary}" ${secondaryOutline}/>
        `,
        body: `
          <path d="M24 38Q50 28 76 38Q84 61 70 80H31Q17 61 24 38Z" fill="${palette.primary}" ${outline}/>
          <path d="M28 33H72L68 40H32Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M43 27Q50 21 58 27" fill="none" stroke="${secondaryEdge}" stroke-width="5" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 49, eyeWidth: 11, eyeHeight: 11, mouthX: 50.5, mouthY: 66, mouthWidth: 14, mouthHeight: 15, mouthKind: 'hatch' },
        surface: { x: 29, y: 40, width: 43, height: 34 },
        accent: { roofX: 63, roofY: 29, sideX: 76, sideY: 43, frontY: 60, scale: 0.74 },
      };

    case 'boot-house':
      return {
        behind: '',
        body: `
          <path d="M31 15H63L61 51Q69 62 84 67Q90 71 86 83H21Q17 73 25 67Q33 60 31 15Z" fill="${palette.primary}" ${outline}/>
          <path d="M28 15H66V27H29Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M25 68Q48 74 85 69" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M36 30H58M35 38H58" fill="none" stroke="${palette.secondary}" stroke-width="2.2" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 40, rightX: 58, eyeY: 49, eyeWidth: 9.5, eyeHeight: 10.5, mouthX: 49, mouthY: 65, mouthWidth: 13, mouthHeight: 15, mouthKind: 'door' },
        surface: { x: 33, y: 28, width: 28, height: 45 },
        accent: { roofX: 57, roofY: 14, sideX: 72, sideY: 55, frontY: 60, scale: 0.7 },
      };

    case 'pumpkin-house':
      return {
        behind: `<path d="M48 22Q48 11 58 10" fill="none" stroke="${secondaryEdge}" stroke-width="5" stroke-linecap="round"/>`,
        body: `
          <path d="M14 53Q16 25 36 24Q44 18 50 26Q58 18 66 24Q86 25 88 53Q86 81 66 82Q57 88 50 80Q43 88 35 82Q16 81 14 53Z" fill="${palette.primary}" ${outline}/>
          <path d="M34 26Q25 51 35 80M50 26Q43 52 50 80M66 25Q76 52 66 80" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
        `,
        front: '',
        face: { leftX: 37.5, rightX: 62.5, eyeY: 48, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50, mouthY: 66, mouthWidth: 14, mouthHeight: 16, mouthKind: 'door' },
        surface: { x: 24, y: 34, width: 52, height: 40 },
        accent: { roofX: 62, roofY: 18, sideX: 81, sideY: 43, frontY: 61, scale: 0.76 },
      };

    case 'lantern-house':
      return {
        behind: `<path d="M34 25Q34 10 50 8Q67 10 67 25" fill="none" stroke="${secondaryEdge}" stroke-width="4" stroke-linecap="round"/>`,
        body: `
          <path d="M27 28H74L80 78H21Z" fill="${palette.primary}" ${outline}/>
          <path d="M31 34H70L74 69H27Z" fill="${palette.secondary}" fill-opacity="0.82" ${secondaryOutline}/>
          <path d="M25 27H76L71 20H31ZM20 78H81L75 85H26Z" fill="${palette.accent}" ${accentOutline}/>
          <path d="M32 36L28 68M69 36L73 68" fill="none" stroke="${primaryEdge}" stroke-width="2.5"/>
        `,
        front: '',
        face: { leftX: 40, rightX: 61, eyeY: 48, eyeWidth: 10.5, eyeHeight: 11, mouthX: 50.5, mouthY: 64, mouthWidth: 13, mouthHeight: 14, mouthKind: 'hatch' },
        surface: { x: 30, y: 36, width: 41, height: 34 },
        accent: { roofX: 63, roofY: 18, sideX: 74, sideY: 34, frontY: 59, scale: 0.72 },
      };

    case 'shell-house':
      return {
        behind: '',
        body: `
          <path d="M25 80Q10 73 14 53Q9 30 32 19Q38 10 47 15Q60 9 74 22Q92 38 87 60Q91 73 80 80Z" fill="${palette.primary}" ${outline}/>
          <path d="M63 80Q60 67 72 63Q85 61 87 72Q87 78 83 80Z" fill="${tonalEdge(palette.primary, palette.ink, 0.52)}" ${outline}/>
          <path d="M17 55Q7 29 29 17Q51 7 67 22M24 48Q17 31 31 23Q45 16 56 26M31 40Q31 32 39 32Q46 32 46 38Q45 43 40 42" fill="none" stroke="${palette.secondary}" stroke-width="4.2" stroke-linecap="round"/>
        `,
        front: '',
        face: { leftX: 36.5, rightX: 57.5, eyeY: 54, eyeWidth: 10.5, eyeHeight: 11, mouthX: 73.5, mouthY: 73, mouthWidth: 11, mouthHeight: 13, mouthKind: 'door' },
        surface: { x: 24, y: 30, width: 36, height: 24 },
        accent: { roofX: 60, roofY: 16, sideX: 85, sideY: 40, frontY: 64, scale: 0.7 },
      };

    case 'beehive-home':
      return {
        behind: '',
        body: `
          <path d="M24 82Q21 71 28 64Q50 58 73 64Q80 71 77 82Z" fill="${palette.primary}" ${outline}/>
          <path d="M28 67Q25 56 32 49Q50 43 69 49Q76 56 73 67Q50 61 28 67Z" fill="${palette.primary}" ${outline}/>
          <path d="M33 52Q31 42 38 36Q50 31 63 36Q70 42 68 52Q50 46 33 52Z" fill="${palette.primary}" ${outline}/>
          <path d="M40 38Q39 29 45 25Q${50 + contour} 22 56 25Q62 29 61 38Q50 33 40 38Z" fill="${palette.primary}" ${outline}/>
          <path d="M45 26Q${50 + contour} 15 56 26" fill="none" stroke="${primaryEdge}" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M42 82V75Q42 67 50 67Q58 67 58 75V82Z" fill="${tonalEdge(palette.primary, palette.ink, 0.55)}"/>
        `,
        front: '',
        face: { leftX: 39, rightX: 62, eyeY: 55, eyeWidth: 11, eyeHeight: 10.5, mouthX: 50, mouthY: 74, mouthWidth: 12, mouthHeight: 13, mouthKind: 'gate' },
        surface: { x: 32, y: 42, width: 37, height: 28 },
        accent: { roofX: 62, roofY: 19, sideX: 77, sideY: 44, frontY: 63, scale: 0.74 },
      };

    case 'cloud-home':
      return {
        behind: `<path d="M10 34Q7 26 15 24Q17 15 26 17Q33 11 39 19Q46 20 44 28Q42 34 33 35Q19 39 10 34Z" fill="${palette.secondary}" opacity="0.55"/>`,
        body: `
          <path d="M20 76Q12 74 14 64Q6 54 18 48Q16 34 32 33Q37 19 ${52 + contour} 23Q66 15 74 27Q89 28 87 42Q96 50 89 60Q93 72 80 76Q50 81 20 76Z" fill="${palette.primary}" ${outline}/>
          <path d="M27 47Q33 37 44 41M57 37Q64 29 74 36" fill="none" stroke="${palette.secondary}" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
        `,
        front: '',
        face: { leftX: 38.5, rightX: 62.5, eyeY: 51, eyeWidth: 11.5, eyeHeight: 10.5, mouthX: 50.5, mouthY: 67, mouthWidth: 14, mouthHeight: 15, mouthKind: 'door' },
        surface: { x: 27, y: 42, width: 48, height: 27 },
        accent: { roofX: 65, roofY: 24, sideX: 84, sideY: 42, frontY: 60, scale: 0.74 },
      };

    case 'tree-stump-home':
      return {
        behind: `
          <path d="M27 78L14 86M41 82L35 90M60 82L66 90M74 78L87 85" fill="none" stroke="${secondaryEdge}" stroke-width="6" stroke-linecap="round"/>
        `,
        body: `
          <path d="M${25 - contour} 34Q${20 - contour} 58 ${24.5} 76Q${24} 83 ${30} 85.5Q${36} 88 ${43} 86.5Q50 ${88 + contour * 0.5} ${57} 86.5Q${64} 88 ${70} 85.5Q${76} 83 ${75.5} 76Q${80 + contour} 58 ${75 + contour} 34Q50 43 ${25 - contour} 34Z" fill="${palette.primary}" ${outline}/>
          <g transform="rotate(${contour * 1.2} 50 34)">
            <path d="M25 34A25 7.5 0 1 0 75 34A25 7.5 0 1 0 25 34Z" fill="${palette.secondary}" ${secondaryOutline}/>
            <ellipse cx="50" cy="34" rx="16.5" ry="4.8" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.5)}" stroke-width="1.5"/>
            <ellipse cx="50" cy="34" rx="8.5" ry="2.5" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.5)}" stroke-width="1.5"/>
          </g>
          <path d="M30 47Q27 59 30.5 73M70 47Q73 59 69.5 73" fill="none" stroke="${primaryEdge}" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>
          <ellipse cx="63.5" cy="62" rx="3.1" ry="4.1" fill="${primaryEdge}" opacity="0.55"/>
        `,
        front: `<path d="M18 83Q17.4 78 18.8 76.4L14.6 76.4Q14 69.4 20 67.8Q26 69.4 25.4 76.4L21.2 76.4Q22.6 78 22 83Z" fill="${palette.accent}" ${accentOutline}/>`,
        face: { leftX: 39, rightX: 62, eyeY: 51.5, eyeWidth: 11.5, eyeHeight: 11, mouthX: 50.5, mouthY: 70.5, mouthWidth: 14, mouthHeight: 17, mouthKind: 'door' },
        surface: { x: 31, y: 42, width: 38, height: 38 },
        accent: { roofX: 64, roofY: 19, sideX: 77, sideY: 40, frontY: 62, scale: 0.72 },
      };
  }
}

function renderMaterial(
  material: NooksParams['material'],
  layout: NookLayout,
  palette: Palette,
  art: NookArt,
  dwelling: Dwelling,
): string {
  const { x, y, width, height } = layout.surface;
  const left = x + 3;
  const right = x + width - 3;
  const top = y + 3;
  const lower = y + height - 4;
  const middleY = y + height * 0.52 + art.materialShift;
  const detail = palette.secondary;

  switch (material) {
    case 'wood':
      return `<path d="M${left} ${middleY - 5}Q${x + width * 0.48} ${middleY - 6} ${right} ${middleY - 5}M${left + 2} ${middleY + 6}Q${x + width * 0.55} ${middleY + 7} ${right - 1} ${middleY + 5}" fill="none" stroke="${detail}" stroke-width="1.6" stroke-linecap="round" opacity="0.56"/>`;
    case 'brick':
      return `<path d="M${left} ${middleY - 5}H${x + width * 0.42}M${x + width * 0.58} ${middleY - 5}H${right}M${left + 5} ${middleY + 6}H${x + width * 0.55}M${x + width * 0.72} ${middleY + 6}H${right - 2}" fill="none" stroke="${detail}" stroke-width="1.7" stroke-linecap="round" opacity="0.58"/>`;
    case 'plaster':
      return `<path d="M${left + 1} ${middleY - 4}Q${left + 8} ${middleY - 8} ${left + 14} ${middleY - 3}Q${left + 9} ${middleY + 2} ${left + 2} ${middleY + 1}Z" fill="${detail}" opacity="0.28"/>`;
    case 'canvas':
      return `<path d="M${x + width * 0.23} ${top + 1}Q${x + width * 0.27} ${middleY} ${x + width * 0.22} ${lower}" fill="none" stroke="${detail}" stroke-width="1.6" stroke-linecap="round" opacity="0.58"/>`;
    case 'glass':
      return dwelling === 'greenhouse'
        ? ''
        : `<path d="M${left + 2} ${top + 8}L${left + 9} ${top + 1}" fill="none" stroke="${palette.canvas}" stroke-width="2.8" stroke-linecap="round" opacity="0.52"/>`;
  }
}

function windowShape(
  style: NooksParams['windowStyle'],
  side: 'left' | 'right',
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  palette: Palette,
): string {
  const left = x - width / 2;
  const top = y - height / 2;
  const outline = `stroke="${tonalEdge(fill, palette.ink, 0.34)}" stroke-width="1.55" stroke-linejoin="round"`;

  switch (style) {
    case 'square':
      return `<rect x="${left}" y="${top}" width="${width}" height="${height}" rx="${Math.min(width, height) * 0.34}" fill="${fill}" ${outline}/>`;
    case 'round':
      return `<ellipse cx="${x}" cy="${y}" rx="${width / 2}" ry="${height / 2}" fill="${fill}" ${outline}/>`;
    case 'arched':
      return `<path d="M${left} ${y + height / 2}V${y - 0.5}Q${left} ${top} ${x} ${top}Q${left + width} ${top} ${left + width} ${y - 0.5}V${y + height / 2}Z" fill="${fill}" ${outline}/>`;
    case 'shuttered':
      const shutterX = side === 'left' ? left - 4.1 : left + width + 1.1;
      return `
        <rect x="${left}" y="${top}" width="${width}" height="${height}" rx="${Math.min(width, height) * 0.32}" fill="${fill}" ${outline}/>
        <rect x="${shutterX}" y="${top + 1}" width="3" height="${height - 2}" rx="1.5" fill="${palette.accent}"/>
      `;
  }
}

function renderWindows(
  params: NooksParams,
  layout: NookLayout,
  palette: Palette,
  art: NookArt,
): string {
  const face = layout.face;
  const leftY = face.eyeY - art.eyeSkew / 2;
  const rightY = face.eyeY + art.eyeSkew / 2;
  const curious = params.expression === 'curious';
  const leftWidth = face.eyeWidth * art.leftEyeScale * (curious ? 1.08 : 1);
  const rightWidth = face.eyeWidth * art.rightEyeScale * (curious ? 0.9 : 1);
  const leftHeight = face.eyeHeight * art.leftEyeScale;
  const rightHeight = face.eyeHeight * art.rightEyeScale;
  const windowFill = palette.secondary;
  const frames = `
    ${windowShape(params.windowStyle, 'left', face.leftX, leftY, leftWidth, leftHeight, windowFill, palette)}
    ${windowShape(params.windowStyle, 'right', face.rightX, rightY, rightWidth, rightHeight, windowFill, palette)}
  `;

  if (params.expression === 'sleepy') {
    return `${frames}
      <path d="M${face.leftX - leftWidth * 0.29} ${leftY + 0.5}Q${face.leftX} ${leftY + 3} ${face.leftX + leftWidth * 0.29} ${leftY + 0.5}M${face.rightX - rightWidth * 0.29} ${rightY + 0.5}Q${face.rightX} ${rightY + 3} ${face.rightX + rightWidth * 0.29} ${rightY + 0.5}" fill="none" stroke="${palette.ink}" stroke-width="2.2" stroke-linecap="round"/>
    `;
  }

  const pupilRadius = params.expression === 'content' ? 2.15 : 2.45;
  const gazeScale = params.expression === 'calm' ? 0.55 : 1;
  const leftPupilX = face.leftX + art.gazeX * gazeScale;
  const leftPupilY = leftY + art.gazeY * gazeScale;
  const rightPupilX = face.rightX + art.gazeX * gazeScale;
  const rightPupilY = rightY + art.gazeY * gazeScale;
  return `${frames}
    <circle cx="${leftPupilX}" cy="${leftPupilY}" r="${pupilRadius}" fill="${palette.ink}"/>
    <circle cx="${rightPupilX}" cy="${rightPupilY}" r="${pupilRadius}" fill="${palette.ink}"/>
  `;
}

function renderDoor(
  params: NooksParams,
  layout: NookLayout,
  palette: Palette,
  art: NookArt,
): string {
  const { mouthX, mouthY, mouthWidth, mouthHeight, mouthKind } = layout.face;
  const x = mouthX + art.mouthShiftX;
  const left = x - mouthWidth / 2;
  const top = mouthY - mouthHeight / 2;
  const fill = params.expression === 'curious' ? palette.accent : palette.secondary;
  const outline = `stroke="${tonalEdge(fill, palette.ink, 0.34)}" stroke-width="1.55" stroke-linejoin="round" stroke-linecap="round"`;
  let doorway: string;

  switch (mouthKind) {
    case 'door':
      doorway = `<path d="M${left} ${mouthY + mouthHeight / 2}V${top + 4}Q${left} ${top} ${x} ${top}Q${left + mouthWidth} ${top} ${left + mouthWidth} ${top + 4}V${mouthY + mouthHeight / 2}Z" fill="${fill}" ${outline}/>`;
      break;
    case 'gate':
      doorway = `<path d="M${left} ${mouthY + mouthHeight / 2}V${top + 6}Q${x} ${top - 3} ${left + mouthWidth} ${top + 6}V${mouthY + mouthHeight / 2}Z" fill="${fill}" ${outline}/>`;
      break;
    case 'tent':
      doorway = `<path d="M${left} ${mouthY + mouthHeight / 2}Q${x - 4} ${top + 4} ${x} ${top}Q${x + 4} ${top + 4} ${left + mouthWidth} ${mouthY + mouthHeight / 2}Z" fill="${fill}" ${outline}/>`;
      break;
    case 'hatch':
      doorway = `<rect x="${left}" y="${top + mouthHeight * 0.18}" width="${mouthWidth}" height="${mouthHeight * 0.64}" rx="${mouthHeight * 0.3}" fill="${fill}" ${outline}/>`;
      break;
    case 'shop':
      doorway = `<rect x="${left}" y="${top}" width="${mouthWidth}" height="${mouthHeight}" rx="4" fill="${fill}" ${outline}/>`;
      break;
  }

  let expressionLine: string;
  switch (params.expression) {
    case 'calm':
      expressionLine = `<path d="M${x - mouthWidth * 0.24} ${mouthY}H${x + mouthWidth * 0.24}" fill="none" stroke="${palette.ink}" stroke-width="1.8" stroke-linecap="round"/>`;
      break;
    case 'soft-smile':
      expressionLine = `<path d="M${x - mouthWidth * 0.28} ${mouthY - 1}Q${x} ${mouthY + 2.8} ${x + mouthWidth * 0.28} ${mouthY - 1}" fill="none" stroke="${palette.ink}" stroke-width="1.8" stroke-linecap="round"/>`;
      break;
    case 'content':
      expressionLine = `<path d="M${x - mouthWidth * 0.23} ${mouthY - 0.5}Q${x} ${mouthY + 2.3} ${x + mouthWidth * 0.23} ${mouthY - 0.5}" fill="none" stroke="${palette.ink}" stroke-width="2" stroke-linecap="round"/>`;
      break;
    case 'curious':
      expressionLine = `<circle cx="${x + 0.6}" cy="${mouthY}" r="2.25" fill="${palette.ink}"/>`;
      break;
    case 'sleepy':
      expressionLine = `<path d="M${x - mouthWidth * 0.2} ${mouthY + 1}Q${x} ${mouthY - 0.5} ${x + mouthWidth * 0.2} ${mouthY + 1}" fill="none" stroke="${palette.ink}" stroke-width="1.7" stroke-linecap="round"/>`;
      break;
  }

  const apparatusPanels = params.dwelling === 'firehouse'
    ? `<path data-cue="apparatus-panels" d="M${left + 2} ${mouthY - mouthHeight * 0.22}H${left + mouthWidth - 2}M${left + 2} ${mouthY + mouthHeight * 0.2}H${left + mouthWidth - 2}" fill="none" stroke="${tonalEdge(fill, palette.ink, 0.52)}" stroke-width="1.15" stroke-linecap="round" opacity="0.72"/>`
    : '';

  return `${doorway}${apparatusPanels}${expressionLine}`;
}

function renderAccent(
  params: NooksParams,
  layout: NookLayout,
  palette: Palette,
  art: NookArt,
): AccentLayers {
  if (params.accent === 'none') return { behind: '', front: '' };

  const { roofX, roofY, sideX, sideY, frontY, scale } = layout.accent;
  const direction = art.accentOnLeft ? -1 : 1;
  const mirroredRoofX = art.accentOnLeft ? 100 - roofX : roofX;
  const mirroredSideX = art.accentOnLeft ? 100 - sideX : sideX;
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.34);
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.34);
  const outline = `stroke="${accentEdge}" stroke-width="${1.7 * scale}" stroke-linejoin="round" stroke-linecap="round"`;
  const secondaryOutline = `stroke="${secondaryEdge}" stroke-width="${1.7 * scale}" stroke-linejoin="round" stroke-linecap="round"`;

  switch (params.accent) {
    case 'chimney':
      return {
        behind: `<path d="M${mirroredRoofX - 4 * scale} ${roofY + 10 * scale}V${roofY - 3 * scale}H${mirroredRoofX + 4 * scale}V${roofY + 10 * scale}Z" fill="${palette.accent}" ${outline}/>`,
        front: '',
      };
    case 'flag':
      return {
        behind: `
          <path d="M${mirroredRoofX} ${roofY + 8 * scale}V${roofY - 13 * scale}" fill="none" stroke="${accentEdge}" stroke-width="${1.6 * scale}" stroke-linecap="round"/>
          <path d="M${mirroredRoofX} ${roofY - 12 * scale}L${mirroredRoofX + direction * 13 * scale} ${roofY - 8 * scale}L${mirroredRoofX} ${roofY - 3 * scale}Z" fill="${palette.accent}" ${outline}/>
        `,
        front: '',
      };
    case 'awning':
      return {
        behind: '',
        front: `<path d="M${layout.surface.x + 3} ${frontY - 5 * scale}Q50 ${frontY - 9 * scale} ${layout.surface.x + layout.surface.width - 3} ${frontY - 5 * scale}L${layout.surface.x + layout.surface.width - 7} ${frontY + 2 * scale}Q50 ${frontY - 1 * scale} ${layout.surface.x + 7} ${frontY + 2 * scale}Z" fill="${palette.accent}" ${outline}/>` ,
      };
    case 'flower-box':
      return {
        behind: '',
        front: `
          <path d="M${layout.face.leftX - 6 * scale} ${layout.face.eyeY + 8 * scale}H${layout.face.rightX + 6 * scale}L${layout.face.rightX + 4 * scale} ${layout.face.eyeY + 12 * scale}H${layout.face.leftX - 4 * scale}Z" fill="${palette.secondary}" ${secondaryOutline}/>
          <path d="M${layout.face.leftX - 2 * scale} ${layout.face.eyeY + 7.5 * scale}Q${(layout.face.leftX + layout.face.rightX) / 2} ${layout.face.eyeY + 2.5 * scale} ${layout.face.rightX + 2 * scale} ${layout.face.eyeY + 7.5 * scale}" fill="none" stroke="${palette.accent}" stroke-width="${3.4 * scale}" stroke-linecap="round"/>
        `,
      };
    case 'sign':
      return {
        behind: '',
        front: `
          <path d="M${mirroredSideX} ${sideY - 5 * scale}V${sideY + 4 * scale}Q${mirroredSideX} ${sideY + 7 * scale} ${mirroredSideX - direction * 5 * scale} ${sideY + 7 * scale}" fill="none" stroke="${accentEdge}" stroke-width="${1.6 * scale}" stroke-linecap="round"/>
          <circle cx="${mirroredSideX - direction * 9 * scale}" cy="${sideY + 7 * scale}" r="${6 * scale}" fill="${palette.accent}" ${outline}/>
        `,
      };
  }
}

export function generate(params: NooksParams): string {
  assertNooksParams(params);
  const palette = getPalette(params.palette);
  const variation = createArtVariation('nooks', params);
  const art = resolveNookArt(variation);
  const layout = renderDwelling(params.dwelling, palette, art);
  const accent = renderAccent(params, layout, palette, art);
  const content = `
    <g transform="rotate(${art.tilt} 50 52)">
      ${layout.behind}
      ${accent.behind}
      ${layout.body}
      ${renderMaterial(params.material, layout, palette, art, params.dwelling)}
      ${accent.front}
      ${layout.front}
      ${renderWindows(params, layout, palette, art)}
      ${renderDoor(params, layout, palette, art)}
    </g>
  `;

  return renderAvatarFrame(
    fitToCircle(content, { size: 100, padding: 5 }),
    params.palette,
    params.backgroundShape,
    { clipContent: false },
  );
}

function getDwellingDefinition(dwelling: Dwelling): (typeof dwellingDefinitions)[number] {
  const definition = dwellingDefinitions.find(({ id }) => id === dwelling);
  if (!definition) return invalidOption('dwelling', dwelling);
  return definition;
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<NooksParams> = {},
): NooksParams {
  const dwelling = traits.dwelling ?? random.pick('dwelling', schema.dwelling.options);
  const definition = getDwellingDefinition(dwelling);
  return {
    backgroundShape: traits.backgroundShape ?? random.weightedPick('background-shape', [
      ['circle', 5],
      ['rounded', 4],
      ['square', 1],
    ]),
    palette: traits.palette ?? random.pick('palette', schema.palette.options),
    dwelling,
    expression: traits.expression ?? random.weightedPick('expression', [
      ['calm', 3],
      ['soft-smile', 5],
      ['content', 4],
      ['curious', 3],
      ['sleepy', 2],
    ]),
    windowStyle: traits.windowStyle ?? random.pick(
      `window-style:${dwelling}`,
      definition.windows as readonly WindowStyle[],
    ),
    material: traits.material ?? random.pick(
      `material:${dwelling}`,
      definition.materials as readonly Material[],
    ),
    accent: traits.accent ?? random.weightedPick(
      `accent:${dwelling}`,
      (definition.accents as readonly Accent[]).map(
        (accent) => [accent, accent === 'none' ? 3 : 1] as const,
      ),
    ),
  };
}

export const nooks: InternalTheme<typeof schema, 'place', typeof baseTypeParam> = {
  name: 'Nooks',
  description: 'Tiny places with warm architectural faces and a sense of home.',
  kind: 'place',
  baseTypeParam,
  schema,
  generate,
  randomize,
};

export const __test = { dwellingDefinitions };
