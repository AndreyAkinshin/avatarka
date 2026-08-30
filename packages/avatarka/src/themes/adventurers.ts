import { fitToCircle } from '../fit';
import type { ParamSchema, ParamsFromSchema } from '../types';
import { getPalette, paletteNames, type Palette } from '../palettes';
import { createArtVariation, renderAvatarFrame, tonalEdge } from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';

const faceGearOptions = ['none', 'round-glasses', 'goggles', 'clear-visor', 'monocle'] as const;
type FaceGear = (typeof faceGearOptions)[number];

type BadgeProfile = 'center' | 'shifted' | 'quiet' | 'low';

/**
 * The ordered role registry is the Adventurers catalog source of truth. Keep
 * broad role identity here and small seeded drawing variation in the renderer:
 * palette and frame choices must never select a different silhouette.
 */
const archetypeDefinitions = [
  { id: 'astronaut', label: 'Astronaut', badge: 'center', faceGear: ['none', 'clear-visor', 'round-glasses', 'goggles'] },
  { id: 'deep-sea-diver', label: 'Deep-sea diver', badge: 'center', faceGear: ['none', 'clear-visor', 'goggles', 'round-glasses'] },
  { id: 'knight', label: 'Knight', badge: 'center', faceGear: ['none', 'clear-visor', 'round-glasses', 'monocle'] },
  { id: 'aviator', label: 'Aviator', badge: 'center', faceGear: ['goggles', 'none', 'round-glasses', 'clear-visor'] },
  { id: 'racer', label: 'Racer', badge: 'center', faceGear: ['clear-visor', 'none', 'goggles'] },
  { id: 'mountaineer', label: 'Mountaineer', badge: 'center', faceGear: ['none', 'goggles', 'round-glasses', 'clear-visor'] },
  { id: 'sailor', label: 'Sailor', badge: 'center', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'ranger', label: 'Ranger', badge: 'center', faceGear: ['none', 'round-glasses', 'goggles', 'monocle'] },
  { id: 'mage', label: 'Mage', badge: 'center', faceGear: ['none', 'round-glasses', 'monocle', 'goggles'] },
  { id: 'alchemist', label: 'Alchemist', badge: 'shifted', faceGear: ['none', 'goggles', 'round-glasses', 'monocle', 'clear-visor'] },
  { id: 'archaeologist', label: 'Archaeologist', badge: 'center', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'polar-explorer', label: 'Polar explorer', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'spelunker', label: 'Spelunker', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'storm-chaser', label: 'Storm chaser', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'volcanologist', label: 'Volcanologist', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor', 'round-glasses'] },
  { id: 'cartographer', label: 'Cartographer', badge: 'shifted', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'field-naturalist', label: 'Field naturalist', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles'] },
  { id: 'rock-climber', label: 'Rock climber', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'wildland-firefighter', label: 'Wildland firefighter', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'dog-sled-musher', label: 'Dog-sled musher', badge: 'center', faceGear: ['none', 'goggles', 'round-glasses'] },
  { id: 'parachutist', label: 'Parachutist', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'kayaker', label: 'Kayaker', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'surfer', label: 'Surfer', badge: 'center', faceGear: ['none', 'round-glasses'] },
  { id: 'falconer', label: 'Falconer', badge: 'shifted', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'pirate', label: 'Pirate', badge: 'center', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'samurai', label: 'Samurai', badge: 'quiet', faceGear: ['none'] },
  { id: 'musketeer', label: 'Musketeer', badge: 'center', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'viking', label: 'Viking', badge: 'shifted', faceGear: ['none', 'round-glasses'] },
  { id: 'gladiator', label: 'Gladiator', badge: 'shifted', faceGear: ['none', 'clear-visor'] },
  { id: 'martial-artist', label: 'Martial artist', badge: 'shifted', faceGear: ['none', 'round-glasses'] },
  { id: 'archer', label: 'Archer', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles'] },
  { id: 'druid', label: 'Druid', badge: 'center', faceGear: ['none', 'round-glasses'] },
  { id: 'bard', label: 'Bard', badge: 'shifted', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'rogue', label: 'Rogue', badge: 'shifted', faceGear: ['none', 'goggles', 'monocle'] },
  { id: 'oracle', label: 'Oracle', badge: 'center', faceGear: ['none', 'round-glasses'] },
  { id: 'artificer', label: 'Artificer', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles'] },
  { id: 'dragon-rider', label: 'Dragon rider', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'healer', label: 'Healer', badge: 'shifted', faceGear: ['none', 'round-glasses'] },
  { id: 'ninja', label: 'Ninja', badge: 'quiet', faceGear: ['none'] },
  { id: 'masked-hero', label: 'Masked hero', badge: 'center', faceGear: ['none'] },
  { id: 'jetpack-pilot', label: 'Jetpack pilot', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'exobiologist', label: 'Exobiologist', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles'] },
  { id: 'ghost-hunter', label: 'Ghost hunter', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles'] },
  { id: 'asteroid-miner', label: 'Asteroid miner', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'mech-pilot', label: 'Mech pilot', badge: 'center', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'time-traveler', label: 'Time traveler', badge: 'shifted', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'star-navigator', label: 'Star navigator', badge: 'shifted', faceGear: ['none', 'round-glasses', 'monocle'] },
  { id: 'portal-scout', label: 'Portal scout', badge: 'shifted', faceGear: ['none', 'goggles', 'clear-visor'] },
  { id: 'jester', label: 'Jester', badge: 'low', faceGear: ['none', 'round-glasses'] },
  { id: 'monster-hunter', label: 'Monster hunter', badge: 'shifted', faceGear: ['none', 'round-glasses', 'goggles', 'monocle'] },
] as const satisfies readonly {
  readonly id: string;
  readonly label: string;
  readonly badge: BadgeProfile;
  readonly faceGear: readonly FaceGear[];
}[];

type Archetype = (typeof archetypeDefinitions)[number]['id'];
const archetypeOptions = Object.freeze(
  archetypeDefinitions.map(({ id }) => id),
) as readonly Archetype[];

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
  archetype: {
    type: 'select',
    default: 'astronaut',
    options: archetypeOptions,
  },
  skinTone: {
    type: 'select',
    default: 'sand',
    options: ['porcelain', 'peach', 'sand', 'honey', 'copper', 'umber', 'deep'],
  },
  expression: {
    type: 'select',
    default: 'soft-smile',
    options: ['calm', 'soft-smile', 'content', 'focused', 'curious', 'sleepy'],
  },
  faceGear: {
    type: 'select',
    default: 'none',
    options: faceGearOptions,
  },
  insignia: {
    type: 'select',
    default: 'none',
    options: ['none', 'dot', 'stripe', 'chevron', 'star'],
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'archetype' as const;

export type AdventurersParams = ParamsFromSchema<typeof schema>;

interface SkinPigments {
  base: string;
  pupil: string;
}

interface SkinColors extends SkinPigments {
  edge: string;
  feature: string;
  featureStrokeScale: number;
  featureStrokeFloor: number;
}

interface FaceAnchor {
  x: number;
  eyeY: number;
  eyeGap: number;
  eyeRx: number;
  eyeRy: number;
  mouthY: number;
  mouthWidth: number;
  gearTop: number;
  gearBottom: number;
  gearWidth: number;
}

interface InsigniaAnchor {
  x: number;
  y: number;
  scale: number;
  rotation?: number;
}

interface AdventurerLayout {
  behind: string;
  body: string;
  head: string;
  details: string;
  face: FaceAnchor;
  insignia: InsigniaAnchor;
}

interface AdventurerArt {
  poseTilt: number;
  poseShiftY: number;
  faceShiftX: number;
  eyeSkew: number;
  leftEyeScale: number;
  rightEyeScale: number;
  gazeX: number;
  mouthShiftX: number;
  mouthShiftY: number;
  badgeTilt: number;
  badgeShiftX: number;
  badgeShiftY: number;
  badgeScaleX: number;
  badgeScaleY: number;
  badgeVariant: boolean;
  detailOnLeft: boolean;
}

type WeightedOptions<T> = readonly (readonly [T, number])[];

const skinTones = {
  porcelain: {
    base: '#f4d9ce', pupil: '#211512',
  },
  peach: {
    base: '#edc4ae', pupil: '#211512',
  },
  sand: {
    base: '#dca982', pupil: '#1d1310',
  },
  honey: {
    base: '#c88b5b', pupil: '#1b110f',
  },
  copper: {
    base: '#a86643', pupil: '#170f0d',
  },
  umber: {
    base: '#85543c', pupil: '#160d0b',
  },
  deep: {
    base: '#684236', pupil: '#120a09',
  },
} as const satisfies Record<AdventurersParams['skinTone'], SkinPigments>;

// A warm off-white keeps open eyes readable on every skin tone without the
// sticker-like white halo that pure paper colors create at small sizes.
const eyePaper = '#f3e6de';

function facialFeatureStyle(skinTone: AdventurersParams['skinTone']): {
  readonly amount: number;
  readonly strokeScale: number;
  readonly strokeFloor: number;
} {
  switch (skinTone) {
    case 'deep':
      return { amount: 0.72, strokeScale: 1.2, strokeFloor: 1.7 };
    case 'umber':
      return { amount: 0.62, strokeScale: 1.12, strokeFloor: 1.55 };
    default:
      return { amount: 0.54, strokeScale: 1, strokeFloor: 0 };
  }
}

function facialStrokeAttributes(skin: SkinColors, width: number): string {
  const renderedWidth = Math.round(
    Math.max(width * skin.featureStrokeScale, skin.featureStrokeFloor) * 100,
  ) / 100;
  if (renderedWidth === width) return `stroke-width="${width}"`;

  // fitToCircle must keep measuring the established role silhouette. Resolve
  // the slightly heavier facial paint only after fitting so a skin-tone change
  // cannot rescale or move the authored character geometry.
  return `stroke-width="${width}" data-facial-stroke-width="${renderedWidth}"`;
}

function resolveFacialStrokeWidths(svg: string): string {
  return svg.replace(
    /stroke-width="[\d.]+" data-facial-stroke-width="([\d.]+)"/g,
    'stroke-width="$1"',
  );
}

function invalidOption(param: string, value: unknown): never {
  throw new Error(`Invalid Adventurers ${param}: ${String(value)}`);
}

function assertAdventurersParams(params: AdventurersParams): void {
  if (!params || typeof params !== 'object' || Array.isArray(params)) {
    throw new Error('Invalid Adventurers parameters');
  }

  const values = params as Record<string, unknown>;
  for (const [key, definition] of Object.entries(schema)) {
    if (!Object.prototype.hasOwnProperty.call(values, key)) {
      invalidOption(key, undefined);
    }
    const value = values[key];
    if (typeof value !== 'string' || !(definition.options as readonly string[]).includes(value)) {
      invalidOption(key, value);
    }
  }
  for (const key of Object.keys(values)) {
    if (!(key in schema)) throw new Error(`Unknown Adventurers parameter: ${key}`);
  }
}

function resolveArt(params: AdventurersParams): AdventurerArt {
  const art = createArtVariation('adventurers', params);
  return {
    poseTilt: art.number('pose-tilt', -1.15, 1.15),
    poseShiftY: art.number('pose-shift-y', -0.35, 0.45),
    faceShiftX: art.number('face-shift-x', -0.55, 0.55),
    eyeSkew: art.number('eye-skew', -0.3, 0.3),
    leftEyeScale: art.number('left-eye-scale', 0.95, 1.05),
    rightEyeScale: art.number('right-eye-scale', 0.95, 1.05),
    gazeX: art.number('gaze-x', -0.55, 0.55),
    mouthShiftX: art.number('mouth-shift-x', -0.45, 0.45),
    mouthShiftY: art.number('mouth-shift-y', -0.35, 0.35),
    badgeTilt: art.number('badge-tilt', -2.5, 2.5),
    badgeShiftX: art.number('badge-shift-x', -0.45, 0.45),
    badgeShiftY: art.number('badge-shift-y', -0.35, 0.35),
    badgeScaleX: art.number('badge-scale-x', 0.94, 1.06),
    badgeScaleY: art.number('badge-scale-y', 0.94, 1.06),
    badgeVariant: art.bool('badge-variant'),
    detailOnLeft: art.bool('detail-side'),
  };
}

function faceAnchor(
  x: number,
  eyeY: number,
  eyeGap: number,
  mouthY: number,
  gearTop: number,
  gearBottom: number,
  gearWidth: number,
  art: AdventurerArt,
  eyeRx = 3.8,
  eyeRy = 3.1,
  mouthWidth = 11,
): FaceAnchor {
  return {
    x: x + art.faceShiftX,
    eyeY,
    eyeGap,
    eyeRx,
    eyeRy,
    mouthY,
    mouthWidth,
    gearTop,
    gearBottom,
    gearWidth,
  };
}

/**
 * Adventurers intentionally uses the same visual hierarchy as the other
 * mature themes: one outer silhouette, one generous face and a small number of
 * broad color masses. Role cues stay large enough to read at favicon sizes.
 */
function renderArchetype(
  archetype: Archetype,
  palette: Palette,
  skin: SkinColors,
  art: AdventurerArt,
  faceGear: FaceGear,
): AdventurerLayout {
  const outline = (fill: string, width = 1.5): string => (
    `stroke="${tonalEdge(fill, palette.ink, 0.36)}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"`
  );
  const skinOutline = `stroke="${skin.edge}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"`;
  const bust = (fill: string): string => (
    `<path d="M17 82Q22 73 38 70Q50 68 62 70Q78 73 83 82Q80 91 67 94Q58 97 50 97Q42 97 33 94Q20 91 17 82Z" fill="${fill}" ${outline(fill)}/>`
  );
  const body = (fill: string, wide = false): string => (
    wide
      ? `<path d="M24 80Q34 71 50 71Q66 71 76 80L74 92Q63 97 50 97Q37 97 26 92Z" fill="${fill}" ${outline(fill)}/>`
      : `<path d="M29 77Q50 85 71 77L73 91Q62 96 50 96Q38 96 27 91Z" fill="${fill}" ${outline(fill)}/>`
  );
  const ovalHead = (y = 49, rx = 22.5, ry = 25.5): string => (
    `<ellipse cx="50" cy="${y}" rx="${rx}" ry="${ry}" fill="${skin.base}" ${skinOutline}/>`
  );
  const standardFace = (
    eyeY = 48.5,
    mouthY = 64,
    x = 50,
    eyeGap = 18.5,
  ): FaceAnchor => faceAnchor(x, eyeY, eyeGap, mouthY, 32, 73, 42, art, 4.1, 3.25, 11.2);
  const badge = (profile: BadgeProfile = 'center'): InsigniaAnchor => {
    switch (profile) {
      case 'shifted':
        return { x: art.detailOnLeft ? 58 : 42, y: 87, scale: 0.64 };
      case 'low':
        return { x: 50, y: 90, scale: 0.6 };
      case 'quiet':
        return { x: 50, y: 88, scale: 0.58 };
      case 'center':
        return { x: 50, y: 87, scale: 0.68 };
      default:
        return invalidOption('badge profile', profile);
    }
  };

  switch (archetype) {
    case 'astronaut':
      return {
        behind: `
          ${bust(palette.primary)}
          <circle cx="50" cy="45" r="31" fill="${palette.secondary}" ${outline(palette.secondary)}/>
        `,
        body: `<path d="M32 76Q50 84 68 76L70 90Q60 95 50 95Q40 95 30 90Z" fill="${palette.accent}"/>`,
        head: `<ellipse cx="50" cy="47" rx="23" ry="25" fill="${skin.base}" ${skinOutline}/>`,
        details: '',
        face: faceAnchor(50, 45, 18.5, 61, 27, 68, 43, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };

    case 'deep-sea-diver':
      return {
        behind: `
          ${bust(palette.primary)}
          <circle cx="50" cy="45" r="31" fill="${palette.accent}" ${outline(palette.accent)}/>
        `,
        body: `<path d="M30 77Q50 85 70 77L72 91Q61 96 50 96Q39 96 28 91Z" fill="${palette.secondary}"/>`,
        head: `<circle cx="50" cy="46" r="22.5" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <circle cx="50" cy="46" r="25.5" fill="none" stroke="${tonalEdge(palette.accent, palette.ink, 0.42)}" stroke-width="1.6"/>
          <path d="M20 37H25V55H20Q15 46 20 37ZM80 37H75V55H80Q85 46 80 37Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
        `,
        face: faceAnchor(50, 44.5, 18, 59.5, 27, 66, 41, art, 4.05, 3.25, 11),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };

    case 'knight':
      return {
        behind: `
          ${bust(palette.secondary)}
          <path d="M50 8Q68 13 75 29L72 66Q63 77 50 81Q37 77 28 66L25 29Q32 13 50 8Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: `<path d="M30 77Q50 85 70 77L72 91Q61 96 50 96Q39 96 28 91Z" fill="${palette.accent}"/>`,
        head: `<path d="M29 32Q50 18 71 32L69 57Q66 72 50 78Q34 72 31 57Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M28 29L35 34L34 60L41 70L34 75L26 65ZM72 29L65 34L66 60L59 70L66 75L74 65Z" fill="${palette.primary}"/>
          <path d="M34 27Q50 17 66 27L63 34Q50 28 37 34Z" fill="${palette.accent}"/>
        `,
        face: faceAnchor(50, 45, 18, 61, 31, 69, 38, art, 4.05, 3.25, 11),
        insignia: { x: 50, y: 87, scale: 0.72 },
      };

    case 'aviator': {
      const scarf = art.detailOnLeft
        ? `<path d="M36 72Q22 78 12 69Q25 69 32 59L43 69Z" fill="${palette.accent}" ${outline(palette.accent)}/>`
        : `<path d="M64 72Q78 78 88 69Q75 69 68 59L57 69Z" fill="${palette.accent}" ${outline(palette.accent)}/>`;
      return {
        behind: `${scarf}${bust(palette.primary)}`,
        body: `<path d="M31 76Q50 85 69 76L72 91Q61 96 50 96Q39 96 28 91Z" fill="${palette.secondary}"/>`,
        head: `<ellipse cx="50" cy="48" rx="23" ry="25.5" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M28 34Q29 15 50 13Q71 15 72 34Q61 27 50 28Q39 27 28 34Z" fill="${palette.accent}" ${outline(palette.accent)}/>
          <path d="M29 34Q50 26 71 34" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
        `,
        face: faceAnchor(50, 47, 18.5, 63, 29, 70, 42, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };
    }

    case 'racer':
      return {
        behind: `
          ${bust(palette.secondary)}
          <path d="M50 9Q70 10 79 30L76 62L66 76H34L24 62L21 30Q30 10 50 9Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: `<path d="M30 76Q50 84 70 76L72 91Q61 96 50 96Q39 96 28 91Z" fill="${palette.accent}"/>`,
        head: `<path d="M29 32Q50 18 71 32L69 57Q66 72 50 78Q34 72 31 57Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M26 30Q50 16 74 30L69 38Q50 29 31 38Z" fill="${palette.accent}"/>
          <path d="M25 34L26 62L36 73L40 66L33 57L33 38ZM75 34L74 62L64 73L60 66L67 57L67 38Z" fill="${palette.primary}"/>
        `,
        face: faceAnchor(50, 45, 18, 61, 30, 68, 38, art, 4.05, 3.25, 11),
        insignia: { x: 50, y: 87, scale: 0.7 },
      };

    case 'mountaineer':
      return {
        behind: `
          <path d="M17 84Q10 70 17 55Q22 50 30 54L34 81ZM83 84Q90 70 83 55Q78 50 70 54L66 81Z" fill="${palette.accent}" ${outline(palette.accent)}/>
          ${bust(palette.primary)}
        `,
        body: `<path d="M30 77Q50 85 70 77L72 91Q61 96 50 96Q39 96 28 91Z" fill="${palette.secondary}"/>`,
        head: `<circle cx="50" cy="49" r="23.5" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M30 32Q31 14 50 12Q69 14 70 32Q50 25 30 32Z" fill="${palette.accent}" ${outline(palette.accent)}/>
          <path d="M29 31Q50 24 71 31L69 37Q50 31 31 37Z" fill="${palette.secondary}"/>
          <circle cx="50" cy="10" r="4.5" fill="${palette.secondary}"/>
        `,
        face: faceAnchor(50, 48.5, 18.5, 64, 32, 71, 42, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };

    case 'sailor':
      return {
        behind: bust(palette.primary),
        body: `<path d="M29 77L50 94L71 77Q75 85 72 91Q61 96 50 96Q39 96 28 91Q25 85 29 77Z" fill="${palette.secondary}"/>`,
        head: `<path d="M28 34Q50 20 72 34L69 59Q65 75 50 80Q35 75 31 59Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M31 27Q33 12 50 11Q67 12 69 27Q50 23 31 27Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path d="M24 28Q50 20 76 28L72 36Q50 30 28 36Z" fill="${palette.secondary}"/>
        `,
        face: faceAnchor(50, 47, 19, 63, 32, 72, 42, art, 4.2, 3.3, 11.5),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };

    case 'ranger':
      return {
        behind: bust(palette.secondary),
        body: `<path d="M28 76Q50 87 72 76L74 91Q62 96 50 96Q38 96 26 91Z" fill="${palette.primary}"/>`,
        head: `<ellipse cx="50" cy="50" rx="23" ry="25.5" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M31 29L34 10Q50 5 66 10L69 29Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M13 30Q32 22 50 25Q68 22 87 30Q73 39 50 36Q27 39 13 30Z" fill="${palette.primary}"/>
          <path d="M${art.detailOnLeft ? 31 : 69} 20Q${art.detailOnLeft ? 20 : 80} 10 ${art.detailOnLeft ? 19 : 81} 25" fill="${palette.accent}"/>
        `,
        face: faceAnchor(50, 49, 18.5, 65, 34, 73, 42, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 87, scale: 0.68 },
      };

    case 'mage':
      return {
        behind: bust(palette.primary),
        body: `<path d="M27 77Q50 88 73 77L74 91Q62 96 50 96Q38 96 26 91Z" fill="${palette.secondary}"/>`,
        head: `<path d="M28 39Q50 24 72 39L69 61Q65 77 50 82Q35 77 31 61Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M21 38Q32 23 38 6Q53 10 62 24Q68 17 79 18Q72 31 68 39Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M12 39Q31 29 50 32Q69 29 88 39Q73 48 50 44Q27 48 12 39Z" fill="${palette.primary}"/>
          <path d="M18 39Q50 31 82 39" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
        `,
        face: faceAnchor(50, 52, 18.5, 67.5, 38, 76, 42, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 88, scale: 0.68 },
      };

    case 'alchemist': {
      const bottleX = art.detailOnLeft ? 23 : 77;
      return {
        behind: `
          ${bust(palette.primary)}
          <path d="M22 76L23 40Q24 20 39 14Q50 9 61 14Q76 20 77 40L78 76L65 70H35Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
        `,
        body: `<path d="M28 77Q50 87 72 77L74 91Q62 96 50 96Q38 96 26 91Z" fill="${palette.accent}"/>`,
        head: `<path d="M28 37Q50 22 72 37L69 60Q65 76 50 81Q35 76 31 60Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M27 36Q50 17 73 36L68 43Q50 30 32 43Z" fill="${palette.secondary}"/>
          <path d="M${bottleX - 5} 73L${bottleX - 2.5} 62V57H${bottleX + 2.5}V62L${bottleX + 5} 73Q${bottleX + 4} 79 ${bottleX} 80Q${bottleX - 4} 79 ${bottleX - 5} 73Z" fill="${palette.accent}" ${outline(palette.accent)}/>
        `,
        face: faceAnchor(50, 48, 18.5, 64, 35, 73, 42, art, 4.15, 3.3, 11.5),
        insignia: { x: 50, y: 88, scale: 0.68 },
      };
    }

    case 'archaeologist': {
      const toolX = art.detailOnLeft ? 22 : 78;
      const mirror = art.detailOnLeft ? 1 : -1;
      return {
        behind: `
          <g transform="translate(${toolX} 55) scale(${mirror} 1)">
            <path d="M0 28L5 -10" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.4)}" stroke-width="3" stroke-linecap="round"/>
            <path d="M2 -13Q8 -18 11 -12Q7 -5 4 -4Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
          </g>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M30 31Q33 15 50 14Q67 15 70 31L65 35Q50 29 35 35Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M18 34Q34 27 50 29Q66 27 82 34Q69 41 50 38Q31 41 18 34Z" fill="${palette.primary}" ${outline(palette.primary, 1.25)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };
    }

    case 'polar-explorer':
      return {
        behind: `
          ${bust(palette.secondary)}
          <path d="M50 12Q72 12 80 35L76 69Q66 82 50 84Q34 82 24 69L20 35Q28 12 50 12Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M27 31Q34 18 50 18Q66 18 73 31Q79 43 72 64Q64 76 50 78Q36 76 28 64Q21 43 27 31Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.2)}/>
        `,
        body: body(palette.primary, true),
        head: `<ellipse cx="50" cy="50" rx="20.5" ry="24" fill="${skin.base}" ${skinOutline}/>`,
        details: `<path d="M31 72Q50 80 69 72" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>`,
        face: standardFace(49, 64, 50, 17.5),
        insignia: badge('center'),
      };

    case 'spelunker':
      return {
        behind: bust(palette.secondary),
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M27 35Q28 16 50 13Q72 16 73 35Q50 27 27 35Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M25 35Q50 28 75 35" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
          <circle cx="50" cy="17" r="7" fill="${palette.accent}" ${outline(palette.accent, 1.25)}/>
          <circle cx="50" cy="17" r="3" fill="${tonalEdge(palette.accent, palette.ink, 0.52)}"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };

    case 'storm-chaser': {
      const sensorX = art.detailOnLeft ? 77 : 23;
      return {
        behind: `
          <path d="M${sensorX} 78L${sensorX} 27" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.42)}" stroke-width="3" stroke-linecap="round"/>
          <path d="M${sensorX - 5} 31L${sensorX} 20L${sensorX + 5} 31Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
          ${bust(palette.secondary)}
          <path d="M24 69Q18 35 34 18Q47 8 63 16Q76 28 77 61L67 76Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: body(palette.primary),
        head: `<path d="M30 36Q47 20 68 31L71 58Q67 73 50 79Q34 74 30 59Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `<path d="M27 36Q45 18 69 29L66 36Q48 28 32 42Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.2)}/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'volcanologist':
      return {
        behind: `${bust(palette.secondary)}<path d="M20 76Q17 48 30 25L38 34L34 78ZM80 76Q83 48 70 25L62 34L66 78Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M27 32Q30 15 50 12Q70 15 73 32L68 36Q50 29 32 36Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path d="M23 34Q50 26 77 34" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <rect x="22" y="57" width="9" height="13" rx="4" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
          <rect x="69" y="57" width="9" height="13" rx="4" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
        `,
        face: standardFace(48, 63),
        insignia: badge('center'),
      };

    case 'cartographer': {
      const compassX = art.detailOnLeft ? 68 : 32;
      return {
        behind: `
          <path d="M19 77V34Q19 27 25 27H31V78Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path d="M81 77V34Q81 27 75 27H69V78Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          ${bust(palette.primary)}
        `,
        body: body(palette.secondary),
        head: ovalHead(49),
        details: `
          <path d="M31 31Q50 17 69 31L66 37Q50 29 34 37Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <circle cx="${compassX}" cy="84" r="7" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
          <path d="M${compassX} 79L${compassX + 2} 84L${compassX} 89L${compassX - 2} 84Z" fill="${tonalEdge(palette.accent, palette.ink, 0.48)}"/>
        `,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'field-naturalist': {
      const lensEdge = tonalEdge(palette.accent, palette.ink, 0.45);
      return {
        behind: bust(palette.secondary),
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M30 30Q34 13 50 12Q66 13 70 30Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path d="M19 33Q34 27 50 28Q66 27 81 33Q69 39 50 37Q31 39 19 33Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.2)}/>
          <g transform="translate(50 82)"><circle cx="-7" cy="0" r="6" fill="${palette.accent}" stroke="${lensEdge}" stroke-width="1.2"/><circle cx="7" cy="0" r="6" fill="${palette.accent}" stroke="${lensEdge}" stroke-width="1.2"/><path d="M-1 0H1" stroke="${lensEdge}" stroke-width="2"/></g>
        `,
        face: standardFace(48.5, 64),
        insignia: badge('shifted'),
      };
    }

    case 'rock-climber': {
      const ropeSide = art.detailOnLeft ? -1 : 1;
      return {
        behind: `
          <path d="M${50 + 29 * ropeSide} 78Q${50 + 39 * ropeSide} 56 ${50 + 25 * ropeSide} 38Q${50 + 17 * ropeSide} 28 ${50 + 13 * ropeSide} 18" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M27 34Q30 15 50 13Q70 15 73 34Q50 28 27 34Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M26 35Q50 28 74 35" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>
          <rect x="45" y="13" width="10" height="5" rx="2.5" fill="${palette.secondary}"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'wildland-firefighter': {
      const radioX = art.detailOnLeft ? 27 : 73;
      return {
        behind: `${bust(palette.secondary)}<path d="M25 37Q20 53 25 76L34 80V38ZM75 37Q80 53 75 76L66 80V38Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M25 31Q31 15 50 13Q69 15 75 31L70 36Q50 29 30 36Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path d="M17 33Q50 25 83 33" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
          <rect x="${radioX - 4}" y="76" width="8" height="13" rx="2" fill="${palette.accent}" ${outline(palette.accent, 1)}/>
          <path d="M${radioX} 76V70" stroke="${tonalEdge(palette.accent, palette.ink, 0.45)}" stroke-width="1.5" stroke-linecap="round"/>
        `,
        face: standardFace(49, 64),
        insignia: badge('center'),
      };
    }

    case 'dog-sled-musher':
      return {
        behind: `${bust(palette.primary)}<path d="M18 86L37 68M82 86L63 68" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>`,
        body: body(palette.secondary, true),
        head: ovalHead(50),
        details: `
          <path d="M29 31Q33 15 50 14Q67 15 71 31L67 39Q50 31 33 39Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M30 29L24 37L27 56L35 49L35 31ZM70 29L76 37L73 56L65 49L65 31Z" fill="${palette.primary}" ${outline(palette.primary, 1.2)}/>
          <path d="M28 73Q50 82 72 73" fill="none" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };

    case 'parachutist':
      return {
        behind: `
          <path d="M12 13Q50 -2 88 13L75 31M12 13L25 31M25 31L34 80M75 31L66 80" fill="none" stroke="${palette.accent}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `<path d="M27 34Q29 14 50 12Q71 14 73 34L67 40Q50 31 33 40Z" fill="${palette.secondary}" ${outline(palette.secondary)}/><path d="M25 37Q50 27 75 37" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };

    case 'kayaker': {
      const flip = art.detailOnLeft ? 1 : -1;
      return {
        behind: `
          <g transform="translate(50 50) scale(${flip} 1) rotate(-12)">
            <path data-cue="paddle-shaft" d="M-37 14L37 14" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.42)}" stroke-width="3.2" stroke-linecap="round"/>
            <path data-cue="paddle-blade-low" d="M-33 10.5Q-44 9 -43.5 14Q-44 19 -33 17.5Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
            <path data-cue="paddle-blade-high" d="M33 10.5Q44 9 43.5 14Q44 19 33 17.5Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
          </g>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: `<ellipse cx="50" cy="50" rx="20.5" ry="24" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path data-cue="helmet-shell" d="M25 41Q27 13 50 11Q73 13 75 41L73 55L67 51L69 45Q50 31 31 45L33 51L27 55Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
          <path data-cue="helmet-brim" d="M26 39Q50 30 74 39" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>
          <path data-cue="life-vest" d="M30 74L42 80L39 87L27 81ZM70 74L58 80L61 87L73 81Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
        `,
        face: standardFace(49.5, 64.5, 50, 17.5),
        insignia: badge('shifted'),
      };
    }

    case 'surfer': {
      const boardTransform = art.detailOnLeft
        ? ''
        : 'transform="translate(100 0) scale(-1 1)"';
      const waveColor = tonalEdge(palette.secondary, palette.ink, 0.28);
      return {
        behind: `
          <g ${boardTransform}>
            <path data-cue="surfboard" d="M20 81Q16 68 17 51Q18 31 25 17Q34 31 34 51Q34 70 28 83Q24 88 20 81Z" fill="${palette.accent}" ${outline(palette.accent)}/>
            <path data-cue="board-stringer" d="M25 23Q25 50 24 80" fill="none" stroke="${palette.secondary}" stroke-width="2.1" stroke-linecap="round"/>
            <path data-cue="board-fin" d="M24 70L32 75L25 80Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.05)}/>
          </g>
          ${bust(palette.secondary)}
          <g ${boardTransform}><path data-cue="wave" d="M62 79Q69 72 76 79Q82 86 87 78M68 84Q75 78 82 83" fill="none" stroke="${waveColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></g>
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M28 36Q28 18 41 14Q52 5 68 15Q63 17 61 23Q72 21 76 31Q67 28 63 35Q50 26 28 36Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };
    }

    case 'falconer': {
      const wingLeft = art.detailOnLeft;
      const sx = wingLeft ? 1 : -1;
      return {
        behind: `
          <g transform="translate(${wingLeft ? 13 : 87} 26) scale(${sx} 1)"><path d="M0 49Q2 15 15 0Q19 13 16 24Q26 13 31 14Q29 29 18 38Q29 32 34 35Q24 48 0 49Z" fill="${palette.accent}" ${outline(palette.accent)}/></g>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `<path d="M29 32Q34 16 50 15Q66 16 71 32L66 37Q50 30 34 37Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'pirate':
      return {
        behind: `${bust(palette.secondary)}<path d="M24 88L30 69L42 77L50 72L58 77L70 69L76 88Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M21 32Q29 21 36 14Q50 20 64 14Q71 21 79 32Q66 38 50 33Q34 38 21 32Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M30 29Q50 19 70 29" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };

    case 'samurai':
      return {
        behind: `${bust(palette.secondary)}<path d="M22 36L28 72L39 81V37ZM78 36L72 72L61 81V37Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M27 34Q30 16 50 13Q70 16 73 34L68 40Q50 31 32 40Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M32 27Q50 36 68 27" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M34 22Q50 4 66 22Q57 17 50 25Q43 17 34 22Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
        `,
        face: standardFace(49, 64),
        insignia: badge('quiet'),
      };

    case 'musketeer': {
      const featherSide = art.detailOnLeft ? -1 : 1;
      return {
        behind: bust(palette.secondary),
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M28 30Q33 14 50 14Q67 14 72 30Q50 25 28 30Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M12 33Q31 24 50 28Q69 24 88 33Q71 42 50 37Q29 42 12 33Z" fill="${palette.primary}" ${outline(palette.primary, 1.25)}/>
          <path d="M${50 + 9 * featherSide} 21Q${50 + 19 * featherSide} 3 ${50 + 29 * featherSide} 9Q${50 + 23 * featherSide} 22 ${50 + 13 * featherSide} 29Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };
    }

    case 'viking': {
      const shieldX = art.detailOnLeft ? 18 : 82;
      return {
        behind: `<circle cx="${shieldX}" cy="66" r="18" fill="${palette.accent}" ${outline(palette.accent)}/>${bust(palette.secondary)}`,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M27 35Q30 15 50 13Q70 15 73 35L68 39Q50 31 32 39Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M26 35Q50 27 74 35" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M50 17V42" fill="none" stroke="${tonalEdge(palette.primary, palette.ink, 0.46)}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'gladiator':
      return {
        behind: `${bust(palette.secondary)}<path d="M65 71Q79 69 84 82L75 92L61 82Z" fill="${palette.accent}" ${outline(palette.accent)}/><path d="M50 8Q68 13 75 29L72 66Q63 77 50 81Q37 77 28 66L25 29Q32 13 50 8Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        body: body(palette.primary),
        head: `<path d="M29 32Q50 18 71 32L69 57Q66 72 50 78Q34 72 31 57Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `
          <path d="M28 30L35 35L34 60L41 69L34 74L26 64ZM72 30L65 35L66 60L59 69L66 74L74 64Z" fill="${palette.primary}" ${outline(palette.primary, 1.1)}/>
          <path d="M32 29Q50 20 68 29L65 36Q50 31 35 36Z" fill="${palette.accent}"/>
          <path d="M33 20Q50 -8 67 20L63 25Q50 3 37 25Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>
          <path d="M41 9L40 4M50 6V1.5M59 9L60 4" fill="none" stroke="${tonalEdge(palette.accent, palette.ink, 0.4)}" stroke-width="2" stroke-linecap="round"/>
        `,
        face: faceAnchor(50, 45, 18, 61, 31, 69, 38, art, 4.05, 3.25, 11),
        insignia: badge('shifted'),
      };

    case 'martial-artist': {
      const tailSide = art.detailOnLeft ? -1 : 1;
      return {
        behind: `<path d="M${50 + 24 * tailSide} 25Q${50 + 40 * tailSide} 39 ${50 + 34 * tailSide} 58Q${50 + 30 * tailSide} 42 ${50 + 17 * tailSide} 34Z" fill="${palette.accent}" ${outline(palette.accent, 1.15)}/><path d="M${50 - 34 * tailSide} 90L${50 - 26 * tailSide} 10" stroke="${tonalEdge(palette.secondary, palette.ink, 0.45)}" stroke-width="4" stroke-linecap="round"/>${bust(palette.secondary)}`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `<path d="M27 35Q50 27 73 35" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>`,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'archer': {
      const quiverX = art.detailOnLeft ? 76 : 24;
      const arrowDirection = art.detailOnLeft ? 1 : -1;
      return {
        behind: `
          <path d="M${quiverX - 5} 74L${quiverX + 5} 74L${quiverX + 2} 90H${quiverX - 2}Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.1)}/>
          <path d="M${quiverX - 3 * arrowDirection} 75L${quiverX + 2 * arrowDirection} 24M${quiverX + 2 * arrowDirection} 75L${quiverX + 7 * arrowDirection} 29M${quiverX + 6 * arrowDirection} 76L${quiverX + 11 * arrowDirection} 35" fill="none" stroke="${tonalEdge(palette.accent, palette.ink, 0.43)}" stroke-width="2" stroke-linecap="round"/>
          <path d="M${quiverX + 2 * arrowDirection} 24L${quiverX - 3 * arrowDirection} 31L${quiverX + 1 * arrowDirection} 33ZM${quiverX + 7 * arrowDirection} 29L${quiverX + 2 * arrowDirection} 36L${quiverX + 6 * arrowDirection} 38ZM${quiverX + 11 * arrowDirection} 35L${quiverX + 6 * arrowDirection} 42L${quiverX + 10 * arrowDirection} 44Z" fill="${palette.accent}"/>
          ${bust(palette.secondary)}
          <path d="M24 68Q19 34 36 16Q50 7 64 16Q81 34 76 68L67 78H33Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: body(palette.secondary),
        head: `<ellipse cx="50" cy="50" rx="20.5" ry="24.5" fill="${skin.base}" ${skinOutline}/>`,
        details: `<path d="M29 38Q50 24 71 38" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>`,
        face: standardFace(49.5, 64.5, 50, 17.5),
        insignia: badge('shifted'),
      };
    }

    case 'druid': {
      const branchEdge = tonalEdge(palette.primary, palette.ink, 0.45);
      return {
        behind: `${bust(palette.secondary)}<path d="M23 83Q17 63 29 50Q32 68 43 76ZM77 83Q83 63 71 50Q68 68 57 76Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M32 33L29 15M29 21L22 14M29 23L37 12M68 33L71 15M71 21L78 14M71 23L63 12" fill="none" stroke="${branchEdge}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M27 34Q50 27 73 34" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };
    }

    case 'bard': {
      const luteX = art.detailOnLeft ? 78 : 22;
      return {
        behind: `
          <path d="M${luteX} 84Q${luteX + (art.detailOnLeft ? 12 : -12)} 70 ${luteX} 58Q${luteX - (art.detailOnLeft ? 8 : -8)} 69 ${luteX} 84Z" fill="${palette.accent}" ${outline(palette.accent)}/>
          <path d="M${luteX} 60L${luteX - (art.detailOnLeft ? 9 : -9)} 20" stroke="${tonalEdge(palette.accent, palette.ink, 0.45)}" stroke-width="4" stroke-linecap="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M29 31Q35 16 50 15Q65 16 71 31L66 36Q50 29 34 36Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M${art.detailOnLeft ? 58 : 42} 24Q${art.detailOnLeft ? 72 : 28} 7 ${art.detailOnLeft ? 80 : 20} 15Q${art.detailOnLeft ? 72 : 28} 27 ${art.detailOnLeft ? 61 : 39} 31Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'rogue': {
      const daggerX = art.detailOnLeft ? 76 : 24;
      return {
        behind: `
          <path d="M${daggerX} 87L${daggerX + (art.detailOnLeft ? 5 : -5)} 60" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M${daggerX - 6} 65H${daggerX + 6}" stroke="${tonalEdge(palette.accent, palette.ink, 0.45)}" stroke-width="3" stroke-linecap="round"/>
          ${bust(palette.secondary)}
          <path d="M23 69Q20 34 38 15Q54 6 70 22Q81 37 76 69L66 79H32Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: body(palette.secondary),
        head: `<path d="M31 37Q48 22 69 34L70 59Q65 75 50 79Q34 74 30 59Z" fill="${skin.base}" ${skinOutline}/>`,
        details: `<path d="M27 39Q46 20 70 32L67 39Q50 30 32 45Z" fill="${palette.accent}" ${outline(palette.accent, 1.15)}/>`,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'oracle':
      return {
        behind: `<path d="M30 27Q36 7 54 8Q67 9 73 21Q59 15 50 24Q41 33 30 27Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>${bust(palette.secondary)}`,
        body: body(palette.primary),
        head: ovalHead(51),
        details: `
          <path d="M28 36Q50 25 72 36" fill="none" stroke="${palette.secondary}" stroke-width="4" stroke-linecap="round"/>
          <path d="M30 68Q50 78 70 68L66 79Q50 85 34 79Z" fill="${palette.secondary}" fill-opacity="0.78" ${outline(palette.secondary, 1.05)}/>
        `,
        face: standardFace(49.5, 64),
        insignia: badge('center'),
      };

    case 'artificer': {
      const toolX = art.detailOnLeft ? 78 : 22;
      const raisedLens = faceGear === 'none'
        ? `<circle cx="${art.detailOnLeft ? 63 : 37}" cy="34" r="7" fill="${palette.secondary}" fill-opacity="0.12" stroke="${tonalEdge(palette.secondary, palette.ink, 0.5)}" stroke-width="1.4"/><path d="M${art.detailOnLeft ? 67 : 33} 29L${art.detailOnLeft ? 72 : 28} 23" stroke="${tonalEdge(palette.secondary, palette.ink, 0.5)}" stroke-width="1.5" stroke-linecap="round"/>`
        : '';
      return {
        behind: `
          <path d="M${toolX} 87L${toolX} 25Q${toolX + (art.detailOnLeft ? 9 : -9)} 18 ${toolX + (art.detailOnLeft ? 11 : -11)} 29Q${toolX + (art.detailOnLeft ? 8 : -8)} 37 ${toolX} 34" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `<path d="M29 32Q35 16 50 15Q65 16 71 32L66 37Q50 29 34 37Z" fill="${palette.primary}" ${outline(palette.primary)}/>${raisedLens}`,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'dragon-rider': {
      const wingLeft = art.detailOnLeft;
      const wingX = wingLeft ? 15 : 85;
      const wingScale = wingLeft ? 1 : -1;
      return {
        behind: `
          <g transform="translate(${wingX} 28) scale(${wingScale} 1)"><path d="M0 54Q2 17 16 0L18 23L34 12L28 36L41 34Q30 52 0 54Z" fill="${palette.accent}" ${outline(palette.accent)}/></g>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M27 35Q31 15 50 13Q69 15 73 35L67 40Q50 31 33 40Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M32 23L22 13L29 31M68 23L78 13L71 31" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'healer': {
      const staffX = art.detailOnLeft ? 79 : 21;
      return {
        behind: `
          <path d="M${staffX} 89V28Q${staffX} 17 ${staffX + (art.detailOnLeft ? -8 : 8)} 17Q${staffX + (art.detailOnLeft ? -15 : 15)} 17 ${staffX + (art.detailOnLeft ? -14 : 14)} 26" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M29 35Q50 25 71 35" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M36 31Q27 23 31 17Q40 18 43 29ZM64 31Q73 23 69 17Q60 18 57 29Z" fill="${palette.primary}" ${outline(palette.primary, 1.05)}/>
        `,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    case 'ninja': {
      const tailSide = art.detailOnLeft ? -1 : 1;
      return {
        behind: `<path d="M${50 + 24 * tailSide} 29Q${50 + 39 * tailSide} 39 ${50 + 34 * tailSide} 53L${50 + 15 * tailSide} 36Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>${bust(palette.secondary)}`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `<path d="M25 34Q50 25 75 34" fill="none" stroke="${palette.accent}" stroke-width="6" stroke-linecap="round"/><path d="M29 33Q34 17 50 16Q66 17 71 33Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        face: standardFace(50, 65),
        insignia: badge('quiet'),
      };
    }

    case 'masked-hero': {
      const capeSide = art.detailOnLeft ? -1 : 1;
      const integratedMask = faceGear === 'none'
        ? `<path d="M35 44Q42 39 50 44Q58 39 65 44L62 54Q56 57 50 52Q44 57 38 54Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>`
        : '';
      return {
        behind: `<path d="M${50 + 8 * capeSide} 64Q${50 + 37 * capeSide} 68 ${50 + 32 * capeSide} 94Q${50 + 11 * capeSide} 89 ${50 - 4 * capeSide} 72Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>${bust(palette.primary)}`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `<path d="M29 34Q50 22 71 34" fill="none" stroke="${palette.primary}" stroke-width="4" stroke-linecap="round"/>${integratedMask}`,
        face: standardFace(50, 65),
        insignia: badge('center'),
      };
    }

    case 'jetpack-pilot':
      return {
        behind: `
          <rect x="14" y="39" width="18" height="45" rx="8" fill="${palette.accent}" ${outline(palette.accent)}/>
          <rect x="68" y="39" width="18" height="45" rx="8" fill="${palette.accent}" ${outline(palette.accent)}/>
          <path d="M19 84L23 94L28 84M72 84L77 94L81 84" fill="${palette.secondary}" ${outline(palette.secondary, 1.1)}/>
          ${bust(palette.secondary)}
          <path d="M24 67Q20 32 36 16Q50 7 64 16Q80 32 76 67L67 77H33Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: body(palette.primary),
        head: `<ellipse cx="50" cy="49" rx="20.5" ry="24" fill="${skin.base}" ${skinOutline}/>`,
        details: `<path d="M29 37Q50 24 71 37" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>`,
        face: standardFace(49, 64, 50, 17.5),
        insignia: badge('center'),
      };

    case 'exobiologist': {
      const jarX = art.detailOnLeft ? 24 : 76;
      const antX = art.detailOnLeft ? 67 : 33;
      const antTipX = art.detailOnLeft ? 72 : 28;
      const lidEdge = tonalEdge(palette.secondary, palette.ink, 0.42);
      const creatureEdge = tonalEdge(palette.accent, palette.ink, 0.46);
      return {
        behind: `
          <path d="M24 74L25 42Q26 20 40 14Q50 9 60 14Q74 20 75 42L76 74L64 69H36Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path data-cue="hood-opening" d="M27 36Q50 15 73 36L68 43Q50 30 32 43Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path data-cue="scanner-antenna" d="M${antX - 1.3} 21.5L${antTipX - 2.2} 12.5A2.8 2.8 0 1 1 ${antTipX + 2.2} 12.5L${antX + 1.3} 21.5Z" fill="${palette.accent}" ${outline(palette.accent, 1)}/>
          <g data-cue="specimen-jar">
            <rect x="${jarX - 9}" y="53" width="18" height="28" rx="7.5" fill="${palette.secondary}" ${outline(palette.secondary)}/>
            <path d="M${jarX - 5.5} 70A5.5 5 0 1 1 ${jarX + 5.5} 70A5.5 5 0 1 1 ${jarX - 5.5} 70ZM${jarX - 3} 66L${jarX - 4} 61.5M${jarX + 3} 66L${jarX + 4} 61.5M${jarX - 4} 60.8H${jarX - 3.9}M${jarX + 3.9} 60.8H${jarX + 4}" fill="${palette.accent}" stroke="${creatureEdge}" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="${jarX - 10}" y="47.5" width="20" height="7" rx="3.5" fill="${lidEdge}" ${outline(lidEdge, 1)}/>
          </g>
        `,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'ghost-hunter': {
      const packX = art.detailOnLeft ? 77 : 23;
      const detectorX = art.detailOnLeft ? 29 : 59;
      const packEdge = tonalEdge(palette.accent, palette.ink, 0.46);
      return {
        behind: `
          <path data-cue="capture-pack" d="M${packX - 8} 38H${packX + 6}Q${packX + 10} 42 ${packX + 10} 48V75Q${packX + 10} 81 ${packX + 4} 82H${packX - 8}Z" fill="${palette.accent}" ${outline(palette.accent)}/>
          <circle data-cue="containment-window" cx="${packX}" cy="58" r="5.5" fill="${palette.primary}" stroke="${packEdge}" stroke-width="1.3"/>
          <path data-cue="ghost-signal" d="M${packX - 9} 35V27Q${packX - 9} 14 ${packX} 12Q${packX + 9} 14 ${packX + 9} 27V35L${packX + 5} 32L${packX + 2} 36L${packX - 2} 32L${packX - 5} 36Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.05)}/>
          <path data-cue="ghost-signal-eyes" d="M${packX - 3.5} 24H${packX - 2.5}M${packX + 2.5} 24H${packX + 3.5}" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.52)}" stroke-width="1.55" stroke-linecap="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `<rect data-cue="spectral-detector" x="${detectorX}" y="76" width="12" height="15" rx="3" fill="${palette.accent}" ${outline(palette.accent, 1)}/><path data-cue="detector-signal" d="M${detectorX + 3} 85Q${detectorX + 6} 78 ${detectorX + 9} 85M${detectorX + 4.5} 85Q${detectorX + 6} 82 ${detectorX + 7.5} 85" fill="none" stroke="${packEdge}" stroke-width="1.35" stroke-linecap="round"/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'asteroid-miner': {
      const drillLeft = art.detailOnLeft;
      const drillX = drillLeft ? 18 : 82;
      const drillTip = drillLeft ? 5 : 95;
      return {
        behind: `<path d="M${drillX} 68L${drillTip} 78L${drillX} 87Z" fill="${palette.accent}" ${outline(palette.accent)}/><rect x="${drillLeft ? 18 : 70}" y="67" width="12" height="20" rx="4" fill="${palette.secondary}" ${outline(palette.secondary)}/>${bust(palette.secondary)}`,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M25 36Q28 13 50 10Q72 13 75 36L69 42Q50 30 31 42Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M25 36Q50 26 75 36" fill="none" stroke="${palette.accent}" stroke-width="4" stroke-linecap="round"/>
          <path d="M34 21H66" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: standardFace(49, 64),
        insignia: badge('center'),
      };
    }

    case 'mech-pilot':
      return {
        behind: `
          <path d="M21 84Q18 72 27 68L35 74L33 87ZM79 84Q82 72 73 68L65 74L67 87Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path data-cue="helmet-shell" d="M26 41Q27 15 50 12Q73 15 74 41L69 47Q50 33 31 47Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path data-cue="hud-crest" d="M50 14V29" fill="none" stroke="${palette.accent}" stroke-width="3" stroke-linecap="round"/>
          <path data-cue="helmet-brow" d="M29 43Q50 32 71 43" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>
          <path data-cue="ear-pods" d="M26 44L21 48V59L28 63ZM74 44L79 48V59L72 63Z" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/>
          <path data-cue="chin-strap" d="M27 61Q33 76 50 78Q67 76 73 61" fill="none" stroke="${tonalEdge(palette.secondary, palette.ink, 0.3)}" stroke-width="3" stroke-linecap="round"/>
        `,
        face: standardFace(49, 64),
        insignia: badge('center'),
      };

    case 'time-traveler': {
      const tickColor = tonalEdge(palette.accent, palette.ink, 0.46);
      return {
        behind: `
          <circle cx="50" cy="47" r="33" fill="none" stroke="${palette.accent}" stroke-width="5"/>
          <path d="M21 30A33 33 0 0 1 50 14" fill="none" stroke="${palette.secondary}" stroke-width="5" stroke-linecap="round"/>
          <path d="M50 5V11M50 83V89M8 47H14M86 47H92" fill="none" stroke="${tickColor}" stroke-width="3" stroke-linecap="round"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `
          <path d="M27 38Q28 14 50 12Q72 14 73 38L69 47Q67 30 50 29Q33 30 31 47Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <path d="M30 71Q50 80 70 71L72 83Q50 91 28 83Z" fill="${palette.secondary}" ${outline(palette.secondary)}/>
        `,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'star-navigator': {
      const sextantX = art.detailOnLeft ? 76 : 24;
      const starX = art.detailOnLeft ? 82 : 18;
      return {
        behind: `
          <path d="M${sextantX} 73A24 24 0 0 ${art.detailOnLeft ? 0 : 1} ${sextantX} 25L${sextantX} 73ZM${sextantX} 73L${sextantX + (art.detailOnLeft ? -17 : 17)} 42" fill="none" stroke="${palette.accent}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M${starX} 9L${starX + 2} 15L${starX + 8} 18L${starX + 2} 21L${starX} 27L${starX - 2} 21L${starX - 8} 18L${starX - 2} 15Z" fill="${palette.secondary}" ${outline(palette.secondary, 1.05)}/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `<path d="M30 32Q50 18 70 32L66 38Q50 29 34 38Z" fill="${palette.primary}" ${outline(palette.primary)}/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'portal-scout': {
      const beaconX = art.detailOnLeft ? 67 : 33;
      return {
        behind: `
          <path d="M18 78V24Q18 15 27 15H34M82 78V24Q82 15 73 15H66" fill="none" stroke="${palette.accent}" stroke-width="5" stroke-linecap="round"/>
          <path d="M25 22Q50 5 75 22" fill="none" stroke="${palette.secondary}" stroke-width="3" stroke-linecap="round" stroke-dasharray="11 7"/>
          ${bust(palette.secondary)}
        `,
        body: body(palette.primary),
        head: ovalHead(49),
        details: `<circle cx="${beaconX}" cy="77" r="6" fill="${palette.accent}" ${outline(palette.accent, 1.1)}/><path d="M${beaconX} 71V64" stroke="${tonalEdge(palette.accent, palette.ink, 0.45)}" stroke-width="2" stroke-linecap="round"/>`,
        face: standardFace(49, 64),
        insignia: badge('shifted'),
      };
    }

    case 'jester':
      return {
        behind: `${bust(palette.secondary)}<path d="M25 76L31 68L38 75L44 68L50 75L56 68L62 75L69 68L75 76L70 87H30Z" fill="${palette.accent}" ${outline(palette.accent, 1.2)}/>`,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `
          <path d="M27 34Q26 14 40 9Q48 18 50 31Q52 18 60 9Q74 14 73 34Q61 27 50 34Q39 27 27 34Z" fill="${palette.primary}" ${outline(palette.primary)}/>
          <circle cx="39" cy="9" r="4" fill="${palette.accent}"/><circle cx="61" cy="9" r="4" fill="${palette.accent}"/>
        `,
        face: standardFace(50, 65),
        insignia: badge('low'),
      };

    case 'monster-hunter': {
      const weaponSide = art.detailOnLeft ? -1 : 1;
      return {
        behind: `
          <g transform="translate(${50 + 27 * weaponSide} 55) scale(${weaponSide} 1)"><path d="M0 34L0 -25" stroke="${tonalEdge(palette.accent, palette.ink, 0.48)}" stroke-width="3" stroke-linecap="round"/><path d="M-14 -15Q0 -26 14 -15M-14 -15L0 -4L14 -15" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></g>
          ${bust(palette.secondary)}
          <path d="M24 89L30 65L43 76L50 68L57 76L70 65L76 89Z" fill="${palette.primary}" ${outline(palette.primary)}/>
        `,
        body: body(palette.primary),
        head: ovalHead(50),
        details: `<path d="M29 33Q34 16 50 14Q66 16 71 33L66 39Q50 30 34 39Z" fill="${palette.secondary}" ${outline(palette.secondary)}/><path d="M28 35Q50 27 72 35" fill="none" stroke="${palette.accent}" stroke-width="3.5" stroke-linecap="round"/>`,
        face: standardFace(50, 65),
        insignia: badge('shifted'),
      };
    }

    default:
      return invalidOption('archetype', archetype);
  }
}

function renderEyes(
  expression: AdventurersParams['expression'],
  face: FaceAnchor,
  skin: SkinColors,
  art: AdventurerArt,
): string {
  const left = face.x - face.eyeGap / 2;
  const right = face.x + face.eyeGap / 2;
  const leftY = face.eyeY + art.eyeSkew;
  const rightY = face.eyeY - art.eyeSkew;
  const openEye = (
    x: number,
    y: number,
    scale: number,
    gaze = art.gazeX,
  ): string => `
    <ellipse cx="${x}" cy="${y}" rx="${face.eyeRx * scale}" ry="${face.eyeRy * scale}" fill="${eyePaper}"/>
    <circle cx="${x + gaze}" cy="${y + 0.15}" r="${2.15 * scale}" fill="${skin.pupil}"/>
  `;
  const softEye = (
    x: number,
    y: number,
    scale: number,
    gaze = art.gazeX,
  ): string => `
    <ellipse cx="${x}" cy="${y}" rx="${face.eyeRx * scale * 0.67}" ry="${face.eyeRy * scale}" fill="${skin.pupil}"/>
    <circle cx="${x - 0.7 + gaze}" cy="${y - 0.8}" r="${0.7 * scale}" fill="${eyePaper}"/>
  `;
  const closedEye = (x: number, y: number, bend: number): string => (
    `<path d="M${x - 4.4} ${y}Q${x} ${y + bend} ${x + 4.4} ${y}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.75)} stroke-linecap="round"/>`
  );
  const brows = (focused = false): string => {
    const y = face.eyeY - 7;
    const inner = focused ? 1.8 : 0;
    return `<path d="M${left - 4} ${y - inner}Q${left} ${y - 2.2} ${left + 4} ${y + inner}M${right - 4} ${y + inner}Q${right} ${y - 2.2} ${right + 4} ${y - inner}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.65)} stroke-linecap="round"/>`;
  };

  switch (expression) {
    case 'calm':
    case 'soft-smile':
      return `${softEye(left, leftY, art.leftEyeScale)}${softEye(right, rightY, art.rightEyeScale)}`;
    case 'content':
      return `${closedEye(left, leftY, 2.7)}${closedEye(right, rightY, 2.7)}`;
    case 'focused':
      return `${brows(true)}${softEye(left, leftY + 0.6, art.leftEyeScale, art.gazeX * 0.45)}${softEye(right, rightY + 0.6, art.rightEyeScale, art.gazeX * 0.45)}`;
    case 'curious':
      return `${brows()}${openEye(left, leftY, art.leftEyeScale * 0.92, -0.35)}${openEye(right, rightY - 0.2, art.rightEyeScale * 1.15, 0.35)}`;
    case 'sleepy':
      return `${closedEye(left, leftY + 0.8, -1.6)}${closedEye(right, rightY + 0.8, -1.6)}`;
    default:
      return invalidOption('expression', expression);
  }
}

function renderMouth(
  expression: AdventurersParams['expression'],
  face: FaceAnchor,
  skin: SkinColors,
  art: AdventurerArt,
): string {
  const x = face.x + art.mouthShiftX;
  const y = face.mouthY + art.mouthShiftY;
  const half = face.mouthWidth / 2;
  switch (expression) {
    case 'calm':
      return `<path d="M${x - half * 0.62} ${y}Q${x} ${y + 0.8} ${x + half * 0.62} ${y}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.65)} stroke-linecap="round"/>`;
    case 'soft-smile':
      return `<path d="M${x - half} ${y - 0.5}Q${x} ${y + 4} ${x + half} ${y - 0.5}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.75)} stroke-linecap="round"/>`;
    case 'content':
      return `<path d="M${x - half * 0.9} ${y - 0.5}Q${x} ${y + 4.5} ${x + half * 0.9} ${y - 0.5}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.75)} stroke-linecap="round"/>`;
    case 'focused':
      return `<path d="M${x - half * 0.58} ${y}Q${x} ${y - 0.7} ${x + half * 0.58} ${y}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.7)} stroke-linecap="round"/>`;
    case 'curious':
      return `<ellipse cx="${x}" cy="${y + 1}" rx="2.4" ry="3" fill="${skin.pupil}"/>`;
    case 'sleepy':
      return `<path d="M${x - half * 0.5} ${y}Q${x} ${y + 0.5} ${x + half * 0.5} ${y}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.65)} stroke-linecap="round"/>`;
    default:
      return invalidOption('expression', expression);
  }
}

function renderFace(
  expression: AdventurersParams['expression'],
  face: FaceAnchor,
  skin: SkinColors,
  art: AdventurerArt,
): string {
  const noseX = face.x + art.mouthShiftX * 0.35;
  const noseY = face.eyeY + (face.mouthY - face.eyeY) * 0.52;
  return `
    ${renderEyes(expression, face, skin, art)}
    <path d="M${noseX} ${noseY - 2}Q${noseX - 2.4} ${noseY + 3.5} ${noseX + 1.2} ${noseY + 4}" fill="none" stroke="${skin.feature}" ${facialStrokeAttributes(skin, 1.35)} stroke-linecap="round" opacity="0.78"/>
    ${renderMouth(expression, face, skin, art)}
  `;
}

function renderFaceGear(
  gear: FaceGear,
  face: FaceAnchor,
  palette: Palette,
): string {
  const left = face.x - face.eyeGap / 2;
  const right = face.x + face.eyeGap / 2;
  const gearEdge = tonalEdge(palette.secondary, palette.ink, 0.52);
  switch (gear) {
    case 'none':
      return '';
    case 'round-glasses':
      return `
        <path d="M${left + 6.7} ${face.eyeY}Q${face.x} ${face.eyeY - 1.8} ${right - 6.7} ${face.eyeY}" fill="none" stroke="${gearEdge}" stroke-width="1.55" stroke-linecap="round"/>
        <circle cx="${left}" cy="${face.eyeY}" r="6.7" fill="none" stroke="${gearEdge}" stroke-width="1.55"/>
        <circle cx="${right}" cy="${face.eyeY}" r="6.7" fill="none" stroke="${gearEdge}" stroke-width="1.55"/>
      `;
    case 'goggles':
      return `<path d="M${left - 6.8} ${face.eyeY - 4.2}Q${left} ${face.eyeY - 6.5} ${left + 6.8} ${face.eyeY - 4.2}L${left + 5.7} ${face.eyeY + 4.2}Q${left} ${face.eyeY + 6.2} ${left - 5.7} ${face.eyeY + 4.2}ZM${right - 6.8} ${face.eyeY - 4.2}Q${right} ${face.eyeY - 6.5} ${right + 6.8} ${face.eyeY - 4.2}L${right + 5.7} ${face.eyeY + 4.2}Q${right} ${face.eyeY + 6.2} ${right - 5.7} ${face.eyeY + 4.2}ZM${left + 6.2} ${face.eyeY}Q${face.x} ${face.eyeY - 1.8} ${right - 6.2} ${face.eyeY}" fill="none" stroke="${gearEdge}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'clear-visor': {
      const x = face.x - face.gearWidth / 2;
      const height = face.gearBottom - face.gearTop;
      return `<rect x="${x}" y="${face.gearTop}" width="${face.gearWidth}" height="${height}" rx="${Math.min(11, height * 0.3)}" fill="${palette.secondary}" fill-opacity="0.1" stroke="${gearEdge}" stroke-width="1.55"/>`;
    }
    case 'monocle':
      return `
        <circle cx="${right}" cy="${face.eyeY}" r="6.8" fill="${palette.secondary}" fill-opacity="0.08" stroke="${gearEdge}" stroke-width="1.55"/>
        <path d="M${right + 5} ${face.eyeY + 4.6}Q${right + 8.6} ${face.eyeY + 11.8} ${right + 6.8} ${face.mouthY + 8}" fill="none" stroke="${gearEdge}" stroke-width="1.4" stroke-linecap="round"/>
      `;
    default:
      return invalidOption('faceGear', gear);
  }
}

function renderInsignia(
  insignia: AdventurersParams['insignia'],
  anchor: InsigniaAnchor,
  palette: Palette,
  art: AdventurerArt,
): string {
  const rotation = (anchor.rotation ?? 0) + art.badgeTilt;
  const transform = `translate(${anchor.x + art.badgeShiftX} ${anchor.y + art.badgeShiftY}) rotate(${rotation}) scale(${anchor.scale}) scale(${art.badgeScaleX} ${art.badgeScaleY})`;
  const arc = art.badgeVariant ? 0.9 : -0.65;

  switch (insignia) {
    case 'none':
      return '';
    case 'dot':
      return `<g transform="${transform}"><path d="M0 -4.6C2.7 -4.5 4.45 -2.2 4.25 .3C4 2.85 2 4.45 -.45 4.3C-2.9 4.15 -4.45 2.1 -4.25 -.35C-4.05 -2.8 -2.05 -4.45 0 -4.6Z" fill="${palette.accent}"/></g>`;
    case 'stripe':
      return `<g transform="${transform}"><path d="M-8 0Q0 ${arc} 8 0" fill="none" stroke="${palette.accent}" stroke-width="3.7" stroke-linecap="round"/></g>`;
    case 'chevron':
      return `<g transform="${transform}"><path d="M-8 -3Q-4 .25 0 3.8Q4 .15 8 -3.2" fill="none" stroke="${palette.accent}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    case 'star': {
      const star = art.badgeVariant
        ? 'M0 -8C.9 -4.15 1.55 -2.2 2.5 -1.45C3.45 -.65 5.15 -.1 8 .15C4.8 1 3.1 1.6 2.25 2.5C1.35 3.45 .8 5.15 .15 8C-.7 4.85 -1.25 3.25 -2.2 2.35C-3.15 1.45 -4.9 .85 -8 .05C-4.85 -.6 -3.15 -1.2 -2.25 -2.15C-1.3 -3.15 -.8 -4.85 0 -8Z'
        : 'M0 -7.8L2.2 -2.55L7.7 -1.85L3.6 1.75L4.8 7L-.15 4.15L-5.1 6.8L-3.65 1.55L-7.85 -2.15L-2.25 -2.55Z';
      return `<g transform="${transform}"><path d="${star}" fill="${palette.accent}"/></g>`;
    }
    default:
      return invalidOption('insignia', insignia);
  }
}

export function generate(params: AdventurersParams): string {
  assertAdventurersParams(params);
  const palette = getPalette(params.palette);
  const pigments = skinTones[params.skinTone];
  const featureStyle = facialFeatureStyle(params.skinTone);
  const skin: SkinColors = {
    ...pigments,
    edge: tonalEdge(pigments.base, pigments.pupil, 0.28),
    feature: tonalEdge(pigments.base, pigments.pupil, featureStyle.amount),
    featureStrokeScale: featureStyle.strokeScale,
    featureStrokeFloor: featureStyle.strokeFloor,
  };
  const art = resolveArt(params);
  const layout = renderArchetype(params.archetype, palette, skin, art, params.faceGear);
  const artwork = `
    <g transform="translate(0 ${art.poseShiftY}) rotate(${art.poseTilt} 50 54)">
      ${layout.behind}
      ${layout.body}
      ${layout.head}
      ${layout.details}
      ${renderInsignia(params.insignia, layout.insignia, palette, art)}
      ${renderFace(params.expression, layout.face, skin, art)}
      ${renderFaceGear(params.faceGear, layout.face, palette)}
    </g>
  `;
  const content = resolveFacialStrokeWidths(
    fitToCircle(artwork, { size: 100, padding: 5 }),
  );

  return renderAvatarFrame(content, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

function getArchetypeDefinition(archetype: Archetype): (typeof archetypeDefinitions)[number] {
  const definition = archetypeDefinitions.find(({ id }) => id === archetype);
  if (!definition) return invalidOption('archetype', archetype);
  return definition;
}

function faceGearWeights(archetype: Archetype): WeightedOptions<FaceGear> {
  const { faceGear } = getArchetypeDefinition(archetype);
  return faceGear.map((gear, index) => [
    gear,
    gear === 'none' ? (index === 0 ? 7 : 4) : (index === 0 ? 5 : index === 1 ? 3 : 1),
  ] as const);
}

const BADGES_BY_PROFILE: Record<BadgeProfile, WeightedOptions<AdventurersParams['insignia']>> = {
  center: [['none', 58], ['dot', 11], ['stripe', 13], ['chevron', 12], ['star', 6]],
  shifted: [['none', 66], ['dot', 10], ['stripe', 10], ['chevron', 9], ['star', 5]],
  quiet: [['none', 82], ['dot', 7], ['stripe', 5], ['chevron', 4], ['star', 2]],
  low: [['none', 70], ['dot', 9], ['stripe', 9], ['chevron', 8], ['star', 4]],
};

export function randomize(
  random: AvatarRandom,
  traits: Partial<AdventurersParams> = {},
): AdventurersParams {
  const archetype = traits.archetype ?? random.pick('archetype', schema.archetype.options);
  const definition = getArchetypeDefinition(archetype);
  return {
    backgroundShape: traits.backgroundShape ?? random.weightedPick('background-shape', [
      ['circle', 5],
      ['rounded', 4],
      ['square', 1],
    ] as const),
    palette: traits.palette ?? random.pick('palette', schema.palette.options),
    archetype,
    // Keep standalone portraits natural while leaving enough of every tone in
    // gallery candidate pools for the gallery-level balance scorer to work.
    skinTone: traits.skinTone ?? random.weightedPick('skin-tone', [
      ['porcelain', 5],
      ['peach', 5],
      ['sand', 5],
      ['honey', 5],
      ['copper', 4],
      ['umber', 4],
      ['deep', 4],
    ] as const),
    expression: traits.expression ?? random.weightedPick('expression', [
      ['calm', 20],
      ['soft-smile', 30],
      ['content', 20],
      ['focused', 14],
      ['curious', 8],
      ['sleepy', 8],
    ] as const),
    faceGear: traits.faceGear ?? random.weightedPick(
      `face-gear:${archetype}`,
      faceGearWeights(archetype),
    ),
    insignia: traits.insignia ?? random.weightedPick(
      `insignia:${archetype}`,
      BADGES_BY_PROFILE[definition.badge],
    ),
  };
}

export const adventurers: InternalTheme<typeof schema, 'person', typeof baseTypeParam> = {
  name: 'Adventurers',
  description: 'Expressive identity portraits shaped by bold roles, gear, and hand-drawn silhouettes.',
  kind: 'person',
  baseTypeParam,
  schema,
  generate,
  randomize,
};
