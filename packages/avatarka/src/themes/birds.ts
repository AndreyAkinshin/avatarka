import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  birdType: {
    type: 'select',
    default: 'parrot',
    options: [
      'parrot', 'owl', 'penguin', 'flamingo', 'eagle',
      'toucan', 'peacock', 'hummingbird', 'robin', 'crow',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#43A047',
  },
  secondaryColor: {
    type: 'color',
    default: '#FFF9C4',
  },
  crestColor: {
    type: 'color',
    default: '#F44336',
  },
  eyeColor: {
    type: 'color',
    default: '#212121',
  },
  backgroundColor: {
    type: 'color',
    default: '#E3F2FD',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'proud', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'feathers'],
  },
  decoration: {
    type: 'select',
    default: 'none',
    options: ['none', 'branches', 'clouds', 'feathers'],
  },
} as const satisfies ParamSchema;

export type BirdsParams = ParamsFromSchema<typeof schema>;

type Expression = BirdsParams['expression'];

// --- Shared helpers ---

function generateBirdEyes(
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
    case 'proud':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2}" r="${pupilS}" fill="${eyeColor}"/>
        <path d="M${cx1 - s},${cy1 - s * 0.6} L${cx1 + s},${cy1 - s * 0.2}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${cx2 - s},${cy2 - s * 0.2} L${cx2 + s},${cy2 - s * 0.6}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <circle cx="${cx1 - 1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2 - 1}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
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

function generateBirdBeak(
  expression: Expression,
  color: string,
  cx: number,
  cy: number
): string {
  const dark = darkenColor(color, 20);
  switch (expression) {
    case 'happy':
      return `
        <path d="M${cx - 4},${cy} L${cx},${cy + 5} L${cx + 4},${cy}" fill="${color}" stroke="${dark}" stroke-width="0.6"/>
      `;
    case 'proud':
      return `
        <path d="M${cx - 4},${cy} L${cx},${cy + 4} L${cx + 4},${cy}" fill="${color}" stroke="${dark}" stroke-width="0.6"/>
      `;
    case 'surprised':
      return `
        <path d="M${cx - 5},${cy} L${cx},${cy + 7} L${cx + 5},${cy}" fill="${color}" stroke="${dark}" stroke-width="0.6"/>
      `;
    case 'sleepy':
      return `
        <path d="M${cx - 3},${cy} L${cx},${cy + 3} L${cx + 3},${cy}" fill="${color}" stroke="${dark}" stroke-width="0.6"/>
      `;
    default:
      return '';
  }
}

function generateBirdPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: BirdsParams['pattern']
): string {
  const dark = darkenColor(primaryColor, 30);

  switch (pattern) {
    case 'spots':
      return `
        <circle cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" r="${rx * 0.08}" fill="${dark}" opacity="0.35"/>
        <circle cx="${cx + rx * 0.35}" cy="${cy - ry * 0.15}" r="${rx * 0.06}" fill="${dark}" opacity="0.35"/>
        <circle cx="${cx - rx * 0.1}" cy="${cy + ry * 0.25}" r="${rx * 0.07}" fill="${dark}" opacity="0.35"/>
        <circle cx="${cx + rx * 0.4}" cy="${cy + ry * 0.2}" r="${rx * 0.05}" fill="${dark}" opacity="0.35"/>
      `;
    case 'stripes':
      return `
        <path d="M${cx - rx * 0.7},${cy - ry * 0.25} Q${cx},${cy - ry * 0.35} ${cx + rx * 0.7},${cy - ry * 0.25}" stroke="${dark}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${cx - rx * 0.8},${cy + ry * 0.05} Q${cx},${cy - ry * 0.05} ${cx + rx * 0.8},${cy + ry * 0.05}" stroke="${dark}" stroke-width="1.5" fill="none" opacity="0.35"/>
        <path d="M${cx - rx * 0.7},${cy + ry * 0.3} Q${cx},${cy + ry * 0.2} ${cx + rx * 0.7},${cy + ry * 0.3}" stroke="${dark}" stroke-width="1.5" fill="none" opacity="0.35"/>
      `;
    case 'feathers': {
      const light = lightenColor(primaryColor, 15);
      return `
        <path d="M${cx - rx * 0.4},${cy - ry * 0.3} Q${cx - rx * 0.2},${cy - ry * 0.4} ${cx},${cy - ry * 0.3}" stroke="${light}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${cx},${cy - ry * 0.2} Q${cx + rx * 0.2},${cy - ry * 0.3} ${cx + rx * 0.4},${cy - ry * 0.2}" stroke="${light}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${cx - rx * 0.35},${cy + ry * 0.1} Q${cx - rx * 0.15},${cy} ${cx + rx * 0.05},${cy + ry * 0.1}" stroke="${light}" stroke-width="1" fill="none" opacity="0.4"/>
        <path d="M${cx + rx * 0.05},${cy + ry * 0.2} Q${cx + rx * 0.25},${cy + ry * 0.1} ${cx + rx * 0.4},${cy + ry * 0.2}" stroke="${light}" stroke-width="1" fill="none" opacity="0.4"/>
      `;
    }
    default:
      return '';
  }
}

function generateDecoration(decoration: BirdsParams['decoration']): string {
  switch (decoration) {
    case 'branches':
      return `
        <g opacity="0.3">
          <path d="M8,88 Q10,78 14,72" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M14,72 Q18,68 22,70" stroke="#5D4037" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <path d="M12,76 Q8,74 6,70" stroke="#5D4037" stroke-width="1.2" fill="none" stroke-linecap="round"/>
          <ellipse cx="23" cy="69" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(-10, 23, 69)"/>
          <ellipse cx="5" cy="69" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(20, 5, 69)"/>
          <path d="M86,92 Q88,82 84,76" stroke="#5D4037" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M84,76 Q80,72 76,74" stroke="#5D4037" stroke-width="1.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="75" cy="73" rx="3" ry="1.5" fill="#4a8c28" transform="rotate(15, 75, 73)"/>
          <path d="M88,12 Q90,8 94,6" stroke="#5D4037" stroke-width="1" fill="none" stroke-linecap="round"/>
          <ellipse cx="94" cy="5" rx="2.5" ry="1.2" fill="#4a8c28" transform="rotate(-20, 94, 5)"/>
        </g>
      `;
    case 'clouds':
      return `
        <g opacity="0.2">
          <ellipse cx="14" cy="14" rx="8" ry="4" fill="white"/>
          <ellipse cx="10" cy="13" rx="5" ry="3" fill="white"/>
          <ellipse cx="18" cy="13" rx="5" ry="3" fill="white"/>
          <ellipse cx="82" cy="10" rx="6" ry="3" fill="white"/>
          <ellipse cx="78" cy="9" rx="4" ry="2.5" fill="white"/>
          <ellipse cx="86" cy="9" rx="4" ry="2.5" fill="white"/>
          <ellipse cx="88" cy="88" rx="7" ry="3.5" fill="white"/>
          <ellipse cx="84" cy="87" rx="4.5" ry="2.5" fill="white"/>
          <ellipse cx="92" cy="87" rx="4.5" ry="2.5" fill="white"/>
        </g>
      `;
    case 'feathers':
      return `
        <g opacity="0.25">
          <path d="M10,84 Q12,78 16,76 Q12,80 14,86 Q10,82 10,84 Z" fill="#8D6E63"/>
          <path d="M10,84 L13,80" stroke="#6D4C41" stroke-width="0.5" fill="none"/>
          <path d="M86,12 Q88,6 92,4 Q88,8 90,14 Q86,10 86,12 Z" fill="#78909C"/>
          <path d="M86,12 L89,8" stroke="#546E7A" stroke-width="0.5" fill="none"/>
          <path d="M84,90 Q86,84 90,82 Q86,86 88,92 Q84,88 84,90 Z" fill="#A1887F"/>
          <path d="M84,90 L87,86" stroke="#6D4C41" stroke-width="0.5" fill="none"/>
          <path d="M12,16 Q14,10 18,8 Q14,12 16,18 Q12,14 12,16 Z" fill="#90A4AE"/>
          <path d="M12,16 L15,12" stroke="#607D8B" stroke-width="0.5" fill="none"/>
        </g>
      `;
    default:
      return '';
  }
}

// --- Bird generators ---

function generateParrot(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Body
  const body = `
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${secondaryColor}" opacity="0.4"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="32" r="14" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="9" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Crest feathers
  const crest = `
    <path d="M44,20 Q40,8 36,4" stroke="${crestColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,18 Q50,6 52,2" stroke="${crestColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,20 Q60,8 64,4" stroke="${crestColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="4" r="2" fill="${crestColor}"/>
    <circle cx="52" cy="2" r="2" fill="${crestColor}"/>
    <circle cx="64" cy="4" r="2" fill="${crestColor}"/>
  `;

  // Curved beak
  const beak = generateBirdBeak(expression, '#FF8F00', 50, 42);

  // Wings
  const wings = `
    <path d="M34,48 Q22,42 18,52 Q16,60 28,62" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M66,48 Q78,42 82,52 Q84,60 72,62" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Long tail feathers
  const tail = `
    <path d="M44,76 Q38,88 34,96" stroke="${primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,90 50,98" stroke="${darkenColor(primaryColor, 10)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q62,88 66,96" stroke="${primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `;

  // Feet
  const feet = `
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 44, 30, 56, 30, 4);
  const pat = generateBirdPattern(primaryColor, 50, 58, 16, 20, pattern);

  return tail + wings + body + pat + head + crest + beak + feet + eyes;
}

function generateOwl(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Compact round body
  const body = `
    <ellipse cx="50" cy="60" rx="18" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="64" rx="14" ry="14" fill="${secondaryColor}" opacity="0.4"/>
  `;

  // Wide round head
  const head = `
    <circle cx="50" cy="34" r="18" fill="${primaryColor}"/>
  `;

  // Ear tufts
  const earTufts = `
    <path d="M34,22 Q30,10 28,4" stroke="${crestColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,22 Q70,10 72,4" stroke="${crestColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  // Facial disc
  const facialDisc = `
    <circle cx="42" cy="32" r="9" fill="${lightenColor(primaryColor, 20)}" opacity="0.3"/>
    <circle cx="58" cy="32" r="9" fill="${lightenColor(primaryColor, 20)}" opacity="0.3"/>
  `;

  // Large forward-facing eyes
  const eyes = generateBirdEyes(expression, eyeColor, 42, 32, 58, 32, 5.5);

  // Small hooked beak
  const beak = generateBirdBeak(expression, '#FF8F00', 50, 42);

  // Small wings tucked at sides
  const wings = `
    <path d="M32,50 Q20,48 18,58 Q16,66 26,66" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M68,50 Q80,48 82,58 Q84,66 74,66" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Feet with talons
  const feet = `
    <path d="M42,78 L38,84 M42,78 L42,84 M42,78 L46,84" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,78 L54,84 M58,78 L58,84 M58,78 L62,84" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  const pat = generateBirdPattern(primaryColor, 50, 60, 18, 20, pattern);

  return wings + body + pat + head + earTufts + facialDisc + eyes + beak + feet;
}

function generatePenguin(params: BirdsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Upright oval body (black)
  const body = `
    <ellipse cx="50" cy="54" rx="18" ry="24" fill="${primaryColor}"/>
  `;

  // White belly (tuxedo)
  const belly = `
    <ellipse cx="50" cy="58" rx="12" ry="18" fill="${secondaryColor}"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="28" r="14" fill="${primaryColor}"/>
  `;

  // White face patch
  const facePatch = `
    <circle cx="50" cy="30" r="9" fill="${secondaryColor}" opacity="0.6"/>
  `;

  // Small flippers
  const flippers = `
    <path d="M32,46 Q22,50 20,60 Q20,66 26,64" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M68,46 Q78,50 80,60 Q80,66 74,64" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Orange beak
  const beak = generateBirdBeak(expression, '#FF6F00', 50, 38);

  // Orange feet
  const feet = `
    <path d="M40,76 L34,82 L44,82 Z" fill="#FF6F00"/>
    <path d="M60,76 L56,82 L66,82 Z" fill="#FF6F00"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 44, 28, 56, 28, 3.5);
  const pat = generateBirdPattern(primaryColor, 50, 54, 18, 24, pattern);

  return flippers + body + belly + pat + head + facePatch + eyes + beak + feet;
}

function generateFlamingo(params: BirdsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // S-shaped neck
  const neck = `
    <path d="M50,40 Q42,28 44,18 Q46,10 50,8 Q54,10 56,18 Q58,28 50,40" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Body
  const body = `
    <ellipse cx="50" cy="52" rx="18" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="54" rx="14" ry="10" fill="${lightenColor(primaryColor, 10)}" opacity="0.3"/>
  `;

  // Head (small at top of neck)
  const head = `
    <circle cx="50" cy="10" r="8" fill="${primaryColor}"/>
  `;

  // Downturned beak
  const beak = `
    <path d="M46,14 L42,18 Q44,20 48,18 Z" fill="#212121" stroke="${darkenColor('#212121', 20)}" stroke-width="0.4"/>
    <path d="M54,14 L58,18 Q56,20 52,18 Z" fill="#212121" stroke="${darkenColor('#212121', 20)}" stroke-width="0.4"/>
  `;

  // Wing
  const wing = `
    <path d="M34,46 Q26,40 22,48 Q20,54 30,56" fill="${darkenColor(primaryColor, 12)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M66,46 Q74,40 78,48 Q80,54 70,56" fill="${darkenColor(primaryColor, 12)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Long thin legs
  const legs = `
    <line x1="44" y1="64" x2="40" y2="86" stroke="${dark}" stroke-width="2" stroke-linecap="round"/>
    <line x1="56" y1="64" x2="60" y2="86" stroke="${dark}" stroke-width="2" stroke-linecap="round"/>
    <path d="M36,86 L40,86 L44,86" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,86 L60,86 L64,86" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Tail tuft
  const tail = `
    <path d="M50,64 Q44,70 40,68" stroke="${secondaryColor}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M50,64 Q56,70 60,68" stroke="${secondaryColor}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 46, 8, 54, 8, 2.5);
  const pat = generateBirdPattern(primaryColor, 50, 52, 18, 14, pattern);

  return legs + tail + wing + body + pat + neck + head + eyes + beak;
}

function generateEagle(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Broad body
  const body = `
    <ellipse cx="50" cy="56" rx="20" ry="22" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="14" ry="14" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head with fierce brow ridge
  const head = `
    <circle cx="50" cy="30" r="14" fill="${crestColor}"/>
    <circle cx="50" cy="28" r="9" fill="${lightenColor(crestColor, 10)}" opacity="0.15"/>
  `;

  // Brow ridges
  const brows = `
    <path d="M38,24 L44,26" stroke="${darkenColor(crestColor, 30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M62,24 L56,26" stroke="${darkenColor(crestColor, 30)}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Hooked beak
  const beak = `
    <path d="M47,36 L50,44 L53,36" fill="#FFB300" stroke="${darkenColor('#FFB300', 20)}" stroke-width="0.6"/>
    <path d="M49,40 Q50,42 51,40" stroke="${darkenColor('#FFB300', 30)}" stroke-width="0.4" fill="none"/>
  `;

  // Broad wings
  const wings = `
    <path d="M30,46 Q14,36 10,44 Q8,52 22,56" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M70,46 Q86,36 90,44 Q92,52 78,56" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Talons
  const talons = `
    <path d="M40,76 L36,82 M40,76 L40,84 M40,76 L44,82" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M60,76 L56,82 M60,76 L60,84 M60,76 L64,82" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Tail feathers
  const tail = `
    <path d="M42,76 Q38,84 34,88" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,86 50,90" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q62,84 66,88" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 44, 28, 56, 28, 4);
  const pat = generateBirdPattern(primaryColor, 50, 56, 20, 22, pattern);

  return tail + wings + body + pat + head + brows + eyes + beak + talons;
}

function generateToucan(params: BirdsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Compact body
  const body = `
    <ellipse cx="50" cy="58" rx="16" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="62" rx="12" ry="14" fill="${secondaryColor}" opacity="0.35"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="32" r="13" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="8" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Oversized colorful beak
  const beak = `
    <path d="M56,30 Q74,28 78,34 Q80,38 74,40 Q68,42 56,38 Z" fill="#FF6F00" stroke="${darkenColor('#FF6F00', 20)}" stroke-width="0.8"/>
    <path d="M62,32 Q72,30 76,34" fill="none" stroke="#FFCA28" stroke-width="1.5" opacity="0.5"/>
    <path d="M74,38 Q72,40 66,40" fill="none" stroke="#E65100" stroke-width="1" opacity="0.4"/>
    <circle cx="76" cy="34" r="1" fill="#212121"/>
  `;

  // Small wings
  const wings = `
    <path d="M34,50 Q24,46 20,54 Q18,60 28,60" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M66,50 Q76,46 80,54 Q82,60 72,60" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Tail
  const tail = `
    <path d="M46,76 Q42,86 40,92" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,76 Q58,86 60,92" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Feet
  const feet = `
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Small eye (toucan-specific, near beak)
  const eyes = generateBirdEyes(expression, eyeColor, 46, 30, 52, 30, 3);
  const pat = generateBirdPattern(primaryColor, 50, 58, 16, 20, pattern);

  return tail + wings + body + pat + head + beak + eyes + feet;
}

function generatePeacock(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Fan-shaped tail with eye-spots
  const tailFan = `
    <path d="M50,50 Q20,10 10,20" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q16,18 12,30" stroke="${lightenColor(primaryColor, 10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q14,26 14,40" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q80,10 90,20" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q84,18 88,30" stroke="${lightenColor(primaryColor, 10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q86,26 86,40" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,50 Q50,6 50,14" stroke="${lightenColor(primaryColor, 15)}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Eye-spots on tail
  const eyeSpots = `
    <circle cx="12" cy="22" r="4" fill="${secondaryColor}"/>
    <circle cx="12" cy="22" r="2" fill="${primaryColor}"/>
    <circle cx="14" cy="32" r="3.5" fill="${secondaryColor}"/>
    <circle cx="14" cy="32" r="1.8" fill="${primaryColor}"/>
    <circle cx="16" cy="42" r="3" fill="${secondaryColor}"/>
    <circle cx="16" cy="42" r="1.5" fill="${primaryColor}"/>
    <circle cx="88" cy="22" r="4" fill="${secondaryColor}"/>
    <circle cx="88" cy="22" r="2" fill="${primaryColor}"/>
    <circle cx="86" cy="32" r="3.5" fill="${secondaryColor}"/>
    <circle cx="86" cy="32" r="1.8" fill="${primaryColor}"/>
    <circle cx="84" cy="42" r="3" fill="${secondaryColor}"/>
    <circle cx="84" cy="42" r="1.5" fill="${primaryColor}"/>
    <circle cx="50" cy="16" r="3.5" fill="${secondaryColor}"/>
    <circle cx="50" cy="16" r="1.8" fill="${primaryColor}"/>
  `;

  // Small body
  const body = `
    <ellipse cx="50" cy="64" rx="14" ry="16" fill="${primaryColor}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head with thin neck
  const neck = `
    <rect x="47" y="44" width="6" height="10" rx="3" fill="${primaryColor}"/>
  `;

  const head = `
    <circle cx="50" cy="42" r="10" fill="${primaryColor}"/>
  `;

  // Small crest on top
  const crest = `
    <path d="M48,34 Q46,26 44,22" stroke="${crestColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="44" cy="22" r="1.5" fill="${crestColor}"/>
    <path d="M50,33 Q50,25 50,20" stroke="${crestColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="20" r="1.5" fill="${crestColor}"/>
    <path d="M52,34 Q54,26 56,22" stroke="${crestColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="56" cy="22" r="1.5" fill="${crestColor}"/>
  `;

  // Beak
  const beak = generateBirdBeak(expression, '#FF8F00', 50, 48);

  // Feet
  const feet = `
    <path d="M44,78 L40,86 M44,78 L44,86 M44,78 L48,86" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M56,78 L52,86 M56,78 L56,86 M56,78 L60,86" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 45, 40, 55, 40, 3.5);
  const pat = generateBirdPattern(primaryColor, 50, 64, 14, 16, pattern);

  return tailFan + eyeSpots + body + pat + neck + head + crest + eyes + beak + feet;
}

function generateHummingbird(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Tiny body
  const body = `
    <ellipse cx="50" cy="50" rx="10" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="52" rx="7" ry="9" fill="${secondaryColor}" opacity="0.35"/>
  `;

  // Head with iridescent patch
  const head = `
    <circle cx="50" cy="32" r="10" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="6" fill="${crestColor}" opacity="0.4"/>
  `;

  // Long thin beak
  const beak = `
    <line x1="50" y1="38" x2="50" y2="52" stroke="#424242" stroke-width="1.5" stroke-linecap="round" opacity="0"/>
    <path d="M50,38 L48,50 L50,52 L52,50 Z" fill="#616161" stroke="${darkenColor('#616161', 20)}" stroke-width="0.4"/>
  `;

  // Rapid-wing blur effect
  const wingGradId = 'hbird-wing-grad';
  const wings = `
    <defs>
      <linearGradient id="${wingGradId}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${lightenColor(primaryColor, 20)}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${lightenColor(primaryColor, 20)}" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <ellipse cx="28" cy="40" rx="16" ry="6" fill="url(#${wingGradId})" transform="rotate(-20, 28, 40)"/>
    <ellipse cx="72" cy="40" rx="16" ry="6" fill="url(#${wingGradId})" transform="rotate(20, 72, 40)"/>
    <ellipse cx="30" cy="44" rx="14" ry="4" fill="${lightenColor(primaryColor, 15)}" opacity="0.25" transform="rotate(10, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="14" ry="4" fill="${lightenColor(primaryColor, 15)}" opacity="0.25" transform="rotate(-10, 70, 44)"/>
  `;

  // Tiny tail
  const tail = `
    <path d="M46,62 Q40,70 36,74" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,62 Q60,70 64,74" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Tiny feet
  const feet = `
    <line x1="46" y1="62" x2="44" y2="68" stroke="${dark}" stroke-width="1" stroke-linecap="round"/>
    <line x1="54" y1="62" x2="56" y2="68" stroke="${dark}" stroke-width="1" stroke-linecap="round"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 46, 30, 54, 30, 3);
  const pat = generateBirdPattern(primaryColor, 50, 50, 10, 14, pattern);

  return tail + wings + body + pat + head + eyes + beak + feet;
}

function generateRobin(params: BirdsParams): string {
  const { primaryColor, secondaryColor, crestColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Round plump body
  const body = `
    <ellipse cx="50" cy="56" rx="18" ry="20" fill="${primaryColor}"/>
  `;

  // Red breast patch
  const breastPatch = `
    <ellipse cx="50" cy="58" rx="12" ry="14" fill="${crestColor}" opacity="0.7"/>
    <ellipse cx="50" cy="60" rx="8" ry="10" fill="${lightenColor(crestColor, 15)}" opacity="0.3"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="32" r="13" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="8" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Small beak
  const beak = generateBirdBeak(expression, '#FF8F00', 50, 42);

  // Wings
  const wings = `
    <path d="M32,48 Q22,44 18,52 Q16,58 26,58" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M68,48 Q78,44 82,52 Q84,58 74,58" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Tail
  const tail = `
    <path d="M44,74 Q40,82 38,86" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M56,74 Q60,82 62,86" stroke="${primaryColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Feet
  const feet = `
    <path d="M42,74 L38,80 M42,74 L42,80 M42,74 L46,80" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,74 L54,80 M58,74 L58,80 M58,74 L62,80" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Belly highlight
  const belly = `
    <ellipse cx="50" cy="68" rx="10" ry="6" fill="${secondaryColor}" opacity="0.4"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 44, 30, 56, 30, 3.5);
  const pat = generateBirdPattern(primaryColor, 50, 56, 18, 20, pattern);

  return tail + wings + body + breastPatch + belly + pat + head + eyes + beak + feet;
}

function generateCrow(params: BirdsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const sheen = lightenColor(primaryColor, 18);

  // Sleek body
  const body = `
    <ellipse cx="50" cy="56" rx="16" ry="22" fill="${primaryColor}"/>
  `;

  // Glossy sheen
  const glossSheen = `
    <ellipse cx="44" cy="50" rx="5" ry="10" fill="${sheen}" opacity="0.12" transform="rotate(-10, 44, 50)"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="30" r="13" fill="${primaryColor}"/>
    <circle cx="50" cy="28" r="8" fill="${sheen}" opacity="0.1"/>
  `;

  // Strong beak
  const beak = `
    <path d="M50,38 L46,46 L50,48 L54,46 Z" fill="#37474F" stroke="${darkenColor('#37474F', 20)}" stroke-width="0.6"/>
  `;

  // Wings
  const wings = `
    <path d="M34,46 Q18,40 14,50 Q12,58 24,60" fill="${darkenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.6"/>
    <path d="M66,46 Q82,40 86,50 Q88,58 76,60" fill="${darkenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Wing edge detail
  const wingEdge = `
    <path d="M14,50 L18,54 L22,52" stroke="${dark}" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M86,50 L82,54 L78,52" stroke="${dark}" stroke-width="0.8" fill="none" opacity="0.4"/>
  `;

  // Tail
  const tail = `
    <path d="M44,76 Q40,86 36,90" stroke="${primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q50,88 50,92" stroke="${darkenColor(primaryColor, 8)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M56,76 Q60,86 64,90" stroke="${primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  `;

  // Feet
  const feet = `
    <path d="M42,76 L38,82 M42,76 L42,82 M42,76 L46,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,76 L54,82 M58,76 L58,82 M58,76 L62,82" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Intelligent gaze - extra highlight in eyes
  const extraGaze = `
    <circle cx="44" cy="27" r="1" fill="${secondaryColor}" opacity="0.3"/>
    <circle cx="56" cy="27" r="1" fill="${secondaryColor}" opacity="0.3"/>
  `;

  const eyes = generateBirdEyes(expression, eyeColor, 44, 28, 56, 28, 3.5);
  const pat = generateBirdPattern(primaryColor, 50, 56, 16, 22, pattern);

  return tail + wings + wingEdge + body + glossSheen + pat + head + eyes + extraGaze + beak + feet;
}

// Scale factors per bird type
const birdScaleFactors: Record<string, number> = {
  parrot: 0.78,
  owl: 0.78,
  penguin: 0.78,
  flamingo: 0.74,
  eagle: 0.76,
  toucan: 0.78,
  peacock: 0.72,
  hummingbird: 0.82,
  robin: 0.80,
  crow: 0.76,
};

export function generate(params: BirdsParams): string {
  const { backgroundShape, birdType, backgroundColor, decoration } = params;

  let creature: string;
  switch (birdType) {
    case 'parrot':
      creature = generateParrot(params);
      break;
    case 'owl':
      creature = generateOwl(params);
      break;
    case 'penguin':
      creature = generatePenguin(params);
      break;
    case 'flamingo':
      creature = generateFlamingo(params);
      break;
    case 'eagle':
      creature = generateEagle(params);
      break;
    case 'toucan':
      creature = generateToucan(params);
      break;
    case 'peacock':
      creature = generatePeacock(params);
      break;
    case 'hummingbird':
      creature = generateHummingbird(params);
      break;
    case 'robin':
      creature = generateRobin(params);
      break;
    case 'crow':
      creature = generateCrow(params);
      break;
    default:
      creature = generateParrot(params);
  }

  const scale = birdScaleFactors[birdType] ?? 0.78;
  const scaledCreature = `<g transform="translate(50, 50) scale(${scale}) translate(-50, -50)">${creature}</g>`;

  const decor = generateDecoration(decoration);

  return wrapSvgWithShape(scaledCreature + decor, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): BirdsParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const birdTypes = [
    'parrot', 'owl', 'penguin', 'flamingo', 'eagle',
    'toucan', 'peacock', 'hummingbird', 'robin', 'crow',
  ] as const;
  const expressions = ['happy', 'proud', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'spots', 'stripes', 'feathers'] as const;
  const decorations = ['none', 'branches', 'clouds', 'feathers'] as const;

  const primaryColors = [
    '#43A047', '#388E3C', '#2E7D32', '#1B5E20',
    '#5D4037', '#3E2723', '#212121', '#37474F',
    '#D32F2F', '#E53935', '#1565C0', '#1976D2',
    '#F57F17', '#E65100', '#4E342E', '#EC407A',
  ];

  const secondaryColors = [
    '#FFF9C4', '#FFFFFF', '#F5F5F5', '#FFE0B2',
    '#FFECB3', '#E0F7FA', '#FFF3E0', '#FFCC80',
  ];

  const crestColors = [
    '#F44336', '#FF5722', '#FF9800', '#FFC107',
    '#2196F3', '#E91E63', '#FF6F00', '#FFAB00',
  ];

  const backgroundColors = [
    '#E3F2FD', '#BBDEFB', '#B3E5FC', '#E0F7FA',
    '#E8F5E9', '#C8E6C9', '#FFF8E1', '#FFF3E0',
    '#FCE4EC', '#F3E5F5', '#FFFDE7', '#FBE9E7',
  ];

  const eyeColors = [
    '#212121', '#3E2723', '#DAA520', '#FF8F00', '#E65100',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    birdType: randomPick(birdTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    crestColor: randomPick(crestColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
    decoration: randomPick(decorations, rng),
  };
}

export const birds: Theme<typeof schema> = {
  name: 'Birds',
  schema,
  shapeParam: 'birdType',
  generate,
  randomize,
};
