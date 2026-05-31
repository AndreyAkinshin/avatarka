import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  plantType: {
    type: 'select',
    default: 'cactus',
    options: [
      'cactus', 'sunflower', 'rose', 'tulip', 'venus-flytrap',
      'bonsai', 'mushroom', 'fern', 'bamboo', 'succulent',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#4CAF50',
  },
  secondaryColor: {
    type: 'color',
    default: '#81C784',
  },
  potColor: {
    type: 'color',
    default: '#8D6E63',
  },
  bloomColor: {
    type: 'color',
    default: '#E91E63',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    default: '#F1F8E9',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'shy', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'thorns'],
  },
} as const satisfies ParamSchema;

export type PlantsParams = ParamsFromSchema<typeof schema>;

type Expression = PlantsParams['expression'];

// --- Shared helpers ---

function generatePlantEyes(
  expression: Expression,
  eyeColor: string,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  size: number
): string {
  const s = size;
  const pupilS = s * 0.45;
  const highlightS = s * 0.25;

  switch (expression) {
    case 'happy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx1 - 1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'shy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1 - 1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2 - 1}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx1 - 1.5}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1.5}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
        <ellipse cx="${cx1 + s * 1.2}" cy="${cy1 + s * 0.6}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${cx2 - s * 1.2}" cy="${cy2 + s * 0.6}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
      `;
    case 'surprised':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx1 - 1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'sleepy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <path d="M${cx1 - s},${cy1 - s * 0.3} Q${cx1},${cy1 - s * 0.8} ${cx1 + s},${cy1 - s * 0.3}" fill="white" stroke="none"/>
        <path d="M${cx2 - s},${cy2 - s * 0.3} Q${cx2},${cy2 - s * 0.8} ${cx2 + s},${cy2 - s * 0.3}" fill="white" stroke="none"/>
      `;
    default:
      return '';
  }
}

function generatePlantMouth(
  expression: Expression,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 4} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;
    case 'shy':
      return `
        <path d="M${cx - 2},${cy + 1} Q${cx},${cy + 3} ${cx + 2},${cy + 1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;
    case 'surprised':
      return `
        <ellipse cx="${cx}" cy="${cy + 2}" rx="2" ry="2.5" fill="#5D4037" opacity="0.7"/>
      `;
    case 'sleepy':
      return `
        <path d="M${cx - 2},${cy + 1} L${cx + 2},${cy + 1}" stroke="#5D4037" stroke-width="0.7" fill="none" stroke-linecap="round"/>
      `;
    default:
      return '';
  }
}

function generatePlantPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: PlantsParams['pattern']
): string {
  const dark = darkenColor(primaryColor, 30);

  switch (pattern) {
    case 'spots':
      return `
        <circle cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" r="${rx * 0.08}" fill="${dark}" opacity="0.3"/>
        <circle cx="${cx + rx * 0.35}" cy="${cy - ry * 0.15}" r="${rx * 0.06}" fill="${dark}" opacity="0.3"/>
        <circle cx="${cx - rx * 0.1}" cy="${cy + ry * 0.25}" r="${rx * 0.07}" fill="${dark}" opacity="0.3"/>
        <circle cx="${cx + rx * 0.4}" cy="${cy + ry * 0.2}" r="${rx * 0.05}" fill="${dark}" opacity="0.3"/>
      `;
    case 'stripes':
      return `
        <path d="M${cx - rx * 0.7},${cy - ry * 0.25} Q${cx},${cy - ry * 0.35} ${cx + rx * 0.7},${cy - ry * 0.25}" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${cx - rx * 0.8},${cy + ry * 0.05} Q${cx},${cy - ry * 0.05} ${cx + rx * 0.8},${cy + ry * 0.05}" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.3"/>
        <path d="M${cx - rx * 0.7},${cy + ry * 0.3} Q${cx},${cy + ry * 0.2} ${cx + rx * 0.7},${cy + ry * 0.3}" stroke="${dark}" stroke-width="1.2" fill="none" opacity="0.3"/>
      `;
    case 'thorns': {
      const light = lightenColor(primaryColor, 15);
      return `
        <path d="M${cx - rx * 0.6},${cy - ry * 0.1} L${cx - rx * 0.8},${cy - ry * 0.2}" stroke="${light}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${cx + rx * 0.6},${cy - ry * 0.15} L${cx + rx * 0.8},${cy - ry * 0.25}" stroke="${light}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${cx - rx * 0.5},${cy + ry * 0.2} L${cx - rx * 0.7},${cy + ry * 0.15}" stroke="${light}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M${cx + rx * 0.5},${cy + ry * 0.25} L${cx + rx * 0.7},${cy + ry * 0.2}" stroke="${light}" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
      `;
    }
    default:
      return '';
  }
}

function generatePot(
  potColor: string,
  cx: number,
  top: number,
  width: number,
  height: number
): string {
  const dark = darkenColor(potColor, 20);
  const light = lightenColor(potColor, 12);
  const rimH = height * 0.18;
  const halfW = width / 2;
  const bottomHalfW = halfW * 0.75;
  return `
    <rect x="${cx - halfW - 2}" y="${top}" width="${width + 4}" height="${rimH}" rx="2" fill="${dark}"/>
    <path d="M${cx - halfW},${top + rimH} L${cx - bottomHalfW},${top + height} L${cx + bottomHalfW},${top + height} L${cx + halfW},${top + rimH} Z" fill="${potColor}"/>
    <path d="M${cx - halfW + 2},${top + rimH + 2} L${cx - halfW + 2},${top + height * 0.6}" stroke="${light}" stroke-width="1.5" fill="none" opacity="0.3" stroke-linecap="round"/>
  `;
}

// --- Plant generators ---

function generateCactus(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Pot
  const pot = generatePot(potColor, 50, 68, 28, 18);

  // Main body
  const body = `
    <ellipse cx="50" cy="50" rx="12" ry="22" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <ellipse cx="50" cy="50" rx="8" ry="18" fill="${secondaryColor}" opacity="0.15"/>
  `;

  // Arms
  const arms = `
    <path d="M38,48 Q28,48 28,38 Q28,30 32,30" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M62,44 Q72,44 72,34 Q72,26 68,26" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Spines
  const spines = `
    <g stroke="${darkenColor(primaryColor, 35)}" stroke-width="0.6" stroke-linecap="round" opacity="0.5">
      <line x1="44" y1="34" x2="40" y2="32"/>
      <line x1="56" y1="36" x2="60" y2="34"/>
      <line x1="43" y1="46" x2="39" y2="46"/>
      <line x1="57" y1="50" x2="61" y2="50"/>
      <line x1="44" y1="58" x2="40" y2="60"/>
      <line x1="56" y1="56" x2="60" y2="58"/>
    </g>
  `;

  // Small flower on top
  const flower = `
    <circle cx="50" cy="28" r="4" fill="${bloomColor}"/>
    <circle cx="46" cy="27" r="2.5" fill="${bloomColor}" opacity="0.8"/>
    <circle cx="54" cy="27" r="2.5" fill="${bloomColor}" opacity="0.8"/>
    <circle cx="50" cy="25" r="2.5" fill="${bloomColor}" opacity="0.8"/>
    <circle cx="50" cy="28" r="1.5" fill="${lightenColor(bloomColor, 25)}"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 45, 44, 55, 44, 3);
  const mouth = generatePlantMouth(expression, 50, 50);
  const pat = generatePlantPattern(primaryColor, 50, 50, 12, 22, pattern);

  return pot + body + arms + spines + pat + flower + eyes + mouth;
}

function generateSunflower(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Pot
  const pot = generatePot(potColor, 50, 76, 24, 14);

  // Thick stem
  const stem = `
    <rect x="47" y="42" width="6" height="36" rx="3" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Leaves on stem
  const leaves = `
    <path d="M47,58 Q36,52 32,56 Q36,60 47,58 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
    <path d="M53,64 Q64,58 68,62 Q64,66 53,64 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
  `;

  // Large flower head - petals
  const petalColor = bloomColor;
  const petalDark = darkenColor(bloomColor, 15);
  const petals = `
    <g>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(45, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(90, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(135, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(180, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(225, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(270, 50, 30)"/>
      <ellipse cx="50" cy="20" rx="4" ry="10" fill="${petalColor}" stroke="${petalDark}" stroke-width="0.3" transform="rotate(315, 50, 30)"/>
    </g>
  `;

  // Flower center (face area)
  const center = `
    <circle cx="50" cy="30" r="10" fill="${darkenColor(primaryColor, 10)}"/>
    <circle cx="50" cy="30" r="8" fill="${primaryColor}"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 46, 28, 54, 28, 2.5);
  const mouth = generatePlantMouth(expression, 50, 33);
  const pat = generatePlantPattern(primaryColor, 50, 30, 8, 8, pattern);

  return pot + stem + leaves + petals + center + pat + eyes + mouth;
}

function generateRose(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const bloomDark = darkenColor(bloomColor, 15);
  const bloomLight = lightenColor(bloomColor, 15);

  // Pot
  const pot = generatePot(potColor, 50, 76, 24, 14);

  // Thorny stem
  const stem = `
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M48,54 L45,52" stroke="${darkenColor(primaryColor, 30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M52,60 L55,58" stroke="${darkenColor(primaryColor, 30)}" stroke-width="1" stroke-linecap="round"/>
    <path d="M48,66 L45,64" stroke="${darkenColor(primaryColor, 30)}" stroke-width="1" stroke-linecap="round"/>
  `;

  // Leaves
  const leaves = `
    <path d="M48,56 Q38,50 34,54 Q38,58 48,56 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
    <path d="M52,68 Q62,62 66,66 Q62,70 52,68 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
  `;

  // Spiral petal layers
  const petals = `
    <circle cx="50" cy="28" r="14" fill="${bloomColor}"/>
    <path d="M40,24 Q44,16 50,18 Q56,16 60,24 Q58,20 50,22 Q42,20 40,24 Z" fill="${bloomDark}" opacity="0.5"/>
    <path d="M42,32 Q46,38 50,36 Q54,38 58,32 Q56,34 50,33 Q44,34 42,32 Z" fill="${bloomDark}" opacity="0.4"/>
    <path d="M38,28 Q40,22 44,24 Q42,28 38,28 Z" fill="${bloomLight}" opacity="0.5"/>
    <path d="M62,28 Q60,22 56,24 Q58,28 62,28 Z" fill="${bloomLight}" opacity="0.5"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 45, 26, 55, 26, 2.5);
  const mouth = generatePlantMouth(expression, 50, 32);
  const pat = generatePlantPattern(bloomColor, 50, 28, 14, 14, pattern);

  return pot + stem + leaves + petals + pat + eyes + mouth;
}

function generateTulip(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const bloomDark = darkenColor(bloomColor, 15);

  // Pot
  const pot = generatePot(potColor, 50, 76, 26, 14);

  // Smooth stem
  const stem = `
    <rect x="48" y="42" width="4" height="36" rx="2" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Wide leaves
  const leaves = `
    <path d="M48,60 Q34,50 30,58 Q34,64 48,60 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
    <path d="M52,66 Q66,56 70,64 Q66,70 52,66 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4"/>
  `;

  // Cup-shaped flower
  const flower = `
    <path d="M36,32 Q38,14 50,12 Q62,14 64,32 Q58,36 50,38 Q42,36 36,32 Z" fill="${bloomColor}" stroke="${bloomDark}" stroke-width="0.5"/>
    <path d="M40,30 Q42,18 50,16" stroke="${lightenColor(bloomColor, 18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M60,30 Q58,18 50,16" stroke="${lightenColor(bloomColor, 18)}" stroke-width="1.5" fill="none" opacity="0.4" stroke-linecap="round"/>
    <path d="M42,32 Q50,38 58,32" fill="${darkenColor(bloomColor, 10)}" opacity="0.3"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 45, 24, 55, 24, 2.5);
  const mouth = generatePlantMouth(expression, 50, 30);
  const pat = generatePlantPattern(bloomColor, 50, 24, 14, 12, pattern);

  return pot + stem + leaves + flower + pat + eyes + mouth;
}

function generateVenusFlytrap(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Pot
  const pot = generatePot(potColor, 50, 72, 28, 16);

  // Multiple stems from pot
  const stems = `
    <path d="M44,72 Q40,56 38,44" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M50,72 Q50,52 50,38" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <path d="M56,72 Q60,56 62,44" fill="none" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
  `;

  // Main trap (open, with teeth) - the face
  const trap = `
    <path d="M36,38 Q50,28 64,38" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M36,38 Q50,48 64,38" fill="${secondaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Teeth along edges
  const teeth = `
    <g fill="white" stroke="${dark}" stroke-width="0.3">
      <path d="M38,38 L40,34 L42,38"/>
      <path d="M44,38 L46,33 L48,38"/>
      <path d="M50,38 L52,32 L54,38"/>
      <path d="M56,38 L58,33 L60,38"/>
      <path d="M38,38 L40,42 L42,38"/>
      <path d="M44,38 L46,43 L48,38"/>
      <path d="M50,38 L52,44 L54,38"/>
      <path d="M56,38 L58,43 L60,38"/>
    </g>
  `;

  // Inner markings (reddish)
  const inner = `
    <ellipse cx="50" cy="34" rx="10" ry="3" fill="${bloomColor}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="10" ry="3" fill="${bloomColor}" opacity="0.3"/>
  `;

  // Small side traps
  const sideTraps = `
    <path d="M30,44 Q38,38 38,44 Q38,50 30,44 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M70,44 Q62,38 62,44 Q62,50 70,44 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 45, 34, 55, 34, 2.5);
  const mouth = generatePlantMouth(expression, 50, 39);
  const pat = generatePlantPattern(primaryColor, 50, 38, 14, 8, pattern);

  return pot + stems + sideTraps + trap + inner + teeth + pat + eyes + mouth;
}

function generateBonsai(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const trunkColor = '#6D4C41';
  const trunkDark = darkenColor(trunkColor, 20);

  // Pot (wider, shallow)
  const pot = generatePot(potColor, 50, 72, 34, 14);

  // Thick curved trunk
  const trunk = `
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${trunkColor}" stroke-width="6" stroke-linecap="round"/>
    <path d="M50,72 Q44,62 42,54 Q40,46 44,40 Q46,36 50,34" fill="none" stroke="${trunkDark}" stroke-width="6" stroke-linecap="round" opacity="0.15"/>
  `;

  // Branches
  const branches = `
    <path d="M44,50 Q36,46 32,48" fill="none" stroke="${trunkColor}" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M46,42 Q54,38 58,40" fill="none" stroke="${trunkColor}" stroke-width="2.5" stroke-linecap="round"/>
  `;

  // Cloud-shaped canopy clusters
  const canopy = `
    <g>
      <ellipse cx="50" cy="26" rx="16" ry="10" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
      <ellipse cx="42" cy="28" rx="10" ry="8" fill="${primaryColor}"/>
      <ellipse cx="58" cy="28" rx="10" ry="8" fill="${primaryColor}"/>
      <ellipse cx="50" cy="22" rx="12" ry="7" fill="${secondaryColor}" opacity="0.2"/>
      <ellipse cx="32" cy="44" rx="10" ry="7" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
      <ellipse cx="58" cy="36" rx="10" ry="7" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    </g>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 45, 24, 55, 24, 3);
  const mouth = generatePlantMouth(expression, 50, 30);
  const pat = generatePlantPattern(primaryColor, 50, 26, 16, 10, pattern);

  return pot + trunk + branches + canopy + pat + eyes + mouth;
}

function generateMushroom(params: PlantsParams): string {
  const { primaryColor, secondaryColor, bloomColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Thick stipe
  const stipe = `
    <rect x="43" y="52" width="14" height="30" rx="5" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.5"/>
    <rect x="45" y="54" width="4" height="26" rx="2" fill="white" opacity="0.15"/>
  `;

  // Large spotted cap
  const cap = `
    <path d="M22,52 Q22,20 50,16 Q78,20 78,52 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M26,50 Q26,24 50,20 Q74,24 74,50" fill="${lightenColor(primaryColor, 8)}" opacity="0.15"/>
  `;

  // Spots on cap
  const spots = `
    <circle cx="38" cy="32" r="4" fill="${bloomColor}" opacity="0.6"/>
    <circle cx="56" cy="28" r="5" fill="${bloomColor}" opacity="0.6"/>
    <circle cx="46" cy="22" r="3" fill="${bloomColor}" opacity="0.6"/>
    <circle cx="64" cy="38" r="3.5" fill="${bloomColor}" opacity="0.6"/>
    <circle cx="34" cy="44" r="3" fill="${bloomColor}" opacity="0.6"/>
    <circle cx="60" cy="46" r="2.5" fill="${bloomColor}" opacity="0.6"/>
  `;

  // Cap underside (gills)
  const gills = `
    <path d="M30,52 Q50,58 70,52" fill="${darkenColor(secondaryColor, 10)}" opacity="0.3"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 44, 38, 56, 38, 3.5);
  const mouth = generatePlantMouth(expression, 50, 46);
  const pat = generatePlantPattern(primaryColor, 50, 36, 22, 18, pattern);

  return stipe + gills + cap + spots + pat + eyes + mouth;
}

function generateFern(params: PlantsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Central fiddlehead (the face)
  const fiddlehead = `
    <path d="M50,80 Q50,60 50,44 Q50,34 54,28 Q58,24 56,20 Q52,18 48,22" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="48" cy="22" r="6" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <circle cx="48" cy="22" r="4" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Spiraling fronds
  const fronds = `
    <g>
      <path d="M50,70 Q34,62 26,66" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M26,66 Q28,62 32,64" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M30,65 Q28,60 24,62" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-linecap="round"/>

      <path d="M50,64 Q66,56 74,60" fill="none" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M74,60 Q72,56 68,58" fill="none" stroke="${primaryColor}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M70,59 Q72,54 76,56" fill="none" stroke="${primaryColor}" stroke-width="1" stroke-linecap="round"/>

      <path d="M50,56 Q38,48 30,52" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M30,52 Q32,48 36,50" fill="none" stroke="${secondaryColor}" stroke-width="1.2" stroke-linecap="round"/>

      <path d="M50,50 Q62,42 70,46" fill="none" stroke="${secondaryColor}" stroke-width="2" stroke-linecap="round"/>
      <path d="M70,46 Q68,42 64,44" fill="none" stroke="${secondaryColor}" stroke-width="1.2" stroke-linecap="round"/>
    </g>
  `;

  // Small leaflets
  const leaflets = `
    <g opacity="0.5">
      <ellipse cx="28" cy="65" rx="3" ry="1.5" fill="${primaryColor}" transform="rotate(-20, 28, 65)"/>
      <ellipse cx="72" cy="59" rx="3" ry="1.5" fill="${primaryColor}" transform="rotate(20, 72, 59)"/>
      <ellipse cx="32" cy="51" rx="2.5" ry="1.2" fill="${secondaryColor}" transform="rotate(-15, 32, 51)"/>
      <ellipse cx="68" cy="45" rx="2.5" ry="1.2" fill="${secondaryColor}" transform="rotate(15, 68, 45)"/>
    </g>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 44, 20, 52, 20, 2);
  const mouth = generatePlantMouth(expression, 48, 25);
  const pat = generatePlantPattern(primaryColor, 48, 22, 6, 6, pattern);

  return fronds + leaflets + fiddlehead + pat + eyes + mouth;
}

function generateBamboo(params: PlantsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Segmented culm (main stalk)
  const culm = `
    <rect x="46" y="14" width="8" height="70" rx="4" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Nodes (segment joints)
  const nodes = `
    <g>
      <rect x="44" y="26" width="12" height="2" rx="1" fill="${dark}" opacity="0.4"/>
      <rect x="44" y="42" width="12" height="2" rx="1" fill="${dark}" opacity="0.4"/>
      <rect x="44" y="58" width="12" height="2" rx="1" fill="${dark}" opacity="0.4"/>
      <rect x="44" y="72" width="12" height="2" rx="1" fill="${dark}" opacity="0.4"/>
    </g>
  `;

  // Thin leaves
  const leaves = `
    <g>
      <path d="M46,28 Q34,22 28,24 Q34,28 46,28 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.3"/>
      <path d="M46,24 Q36,16 30,18 Q36,22 46,24 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.3"/>
      <path d="M54,44 Q66,38 72,40 Q66,44 54,44 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.3"/>
      <path d="M54,40 Q64,32 70,34 Q64,38 54,40 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.3"/>
      <path d="M46,60 Q34,54 28,56 Q34,60 46,60 Z" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.3"/>
    </g>
  `;

  // Side shoots
  const shoots = `
    <rect x="36" y="56" width="4" height="28" rx="2" fill="${lightenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.3" opacity="0.6"/>
    <rect x="60" y="40" width="4" height="28" rx="2" fill="${lightenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.3" opacity="0.6"/>
  `;

  // Face on main culm
  const faceBg = `
    <ellipse cx="50" cy="36" rx="6" ry="5" fill="${lightenColor(primaryColor, 12)}" opacity="0.3"/>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 47, 34, 53, 34, 2);
  const mouth = generatePlantMouth(expression, 50, 39);
  const pat = generatePlantPattern(primaryColor, 50, 50, 4, 30, pattern);

  return shoots + culm + nodes + leaves + faceBg + pat + eyes + mouth;
}

function generateSucculent(params: PlantsParams): string {
  const { primaryColor, secondaryColor, potColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const light = lightenColor(primaryColor, 12);

  // Pot (small, compact)
  const pot = generatePot(potColor, 50, 64, 26, 16);

  // Rosette of thick fleshy leaves
  const outerLeaves = `
    <g>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5" transform="rotate(0, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5" transform="rotate(60, 50, 50)"/>
      <ellipse cx="50" cy="60" rx="18" ry="6" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5" transform="rotate(120, 50, 50)"/>
    </g>
  `;

  const middleLeaves = `
    <g>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4" transform="rotate(30, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4" transform="rotate(90, 50, 48)"/>
      <ellipse cx="50" cy="56" rx="13" ry="5" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 15)}" stroke-width="0.4" transform="rotate(150, 50, 48)"/>
    </g>
  `;

  // Center rosette (face area)
  const center = `
    <circle cx="50" cy="46" r="10" fill="${light}"/>
    <circle cx="50" cy="46" r="8" fill="${primaryColor}" opacity="0.3"/>
  `;

  // Leaf tips with slight color variation
  const tips = `
    <g opacity="0.3">
      <circle cx="32" cy="50" r="2" fill="${lightenColor(primaryColor, 20)}"/>
      <circle cx="68" cy="50" r="2" fill="${lightenColor(primaryColor, 20)}"/>
      <circle cx="50" cy="34" r="2" fill="${lightenColor(primaryColor, 20)}"/>
      <circle cx="38" cy="60" r="1.5" fill="${lightenColor(secondaryColor, 15)}"/>
      <circle cx="62" cy="60" r="1.5" fill="${lightenColor(secondaryColor, 15)}"/>
    </g>
  `;

  const eyes = generatePlantEyes(expression, eyeColor, 46, 44, 54, 44, 2.5);
  const mouth = generatePlantMouth(expression, 50, 50);
  const pat = generatePlantPattern(primaryColor, 50, 46, 10, 10, pattern);

  return pot + outerLeaves + middleLeaves + center + tips + pat + eyes + mouth;
}

export function generate(params: PlantsParams): string {
  const { backgroundShape, plantType, backgroundColor } = params;

  let creature: string;
  switch (plantType) {
    case 'cactus':
      creature = generateCactus(params);
      break;
    case 'sunflower':
      creature = generateSunflower(params);
      break;
    case 'rose':
      creature = generateRose(params);
      break;
    case 'tulip':
      creature = generateTulip(params);
      break;
    case 'venus-flytrap':
      creature = generateVenusFlytrap(params);
      break;
    case 'bonsai':
      creature = generateBonsai(params);
      break;
    case 'mushroom':
      creature = generateMushroom(params);
      break;
    case 'fern':
      creature = generateFern(params);
      break;
    case 'bamboo':
      creature = generateBamboo(params);
      break;
    case 'succulent':
      creature = generateSucculent(params);
      break;
    default:
      creature = generateCactus(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): PlantsParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const plantTypes = [
    'cactus', 'sunflower', 'rose', 'tulip', 'venus-flytrap',
    'bonsai', 'mushroom', 'fern', 'bamboo', 'succulent',
  ] as const;
  const expressions = ['happy', 'shy', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'spots', 'stripes', 'thorns'] as const;

  const primaryColors = [
    '#4CAF50', '#388E3C', '#2E7D32', '#1B5E20',
    '#43A047', '#66BB6A', '#558B2F', '#33691E',
    '#00695C', '#00796B', '#2E7D32', '#1B5E20',
    '#689F38', '#7CB342', '#8BC34A', '#9CCC65',
  ];

  const secondaryColors = [
    '#81C784', '#A5D6A7', '#C8E6C9', '#DCEDC8',
    '#B2DFDB', '#AED581', '#E6EE9C', '#C5E1A5',
  ];

  const potColors = [
    '#8D6E63', '#795548', '#6D4C41', '#A1887F',
    '#BCAAA4', '#5D4037', '#757575', '#D7CCC8',
  ];

  const bloomColors = [
    '#E91E63', '#F44336', '#FF5722', '#FF9800',
    '#FFC107', '#9C27B0', '#E040FB', '#FF6F00',
  ];

  const backgroundColors = [
    '#F1F8E9', '#E8F5E9', '#C8E6C9', '#DCEDC8',
    '#FFF8E1', '#FFF3E0', '#EFEBE9', '#F5F5F5',
    '#E0F2F1', '#E8EAF6', '#FBE9E7', '#F9FBE7',
  ];

  const eyeColors = [
    '#1a1a1a', '#3E2723', '#1B5E20', '#212121', '#33691E',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    plantType: randomPick(plantTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    potColor: randomPick(potColors, rng),
    bloomColor: randomPick(bloomColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
  };
}

export const plants: Theme<typeof schema> = {
  name: 'Plants',
  schema,
  shapeParam: 'plantType',
  generate,
  randomize,
};
