import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  creatureType: {
    type: 'select',
    default: 'dragon',
    options: [
      'dragon', 'unicorn', 'phoenix', 'griffin', 'yeti',
      'cerberus', 'kitsune', 'minotaur', 'fairy', 'hydra',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#7b2d8e',
  },
  secondaryColor: {
    type: 'color',
    default: '#f0e6ff',
  },
  eyeColor: {
    type: 'color',
    default: '#ffd700',
  },
  backgroundColor: {
    type: 'color',
    default: '#1a0a2e',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'majestic', 'surprised', 'mysterious'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'scales'],
  },
  magic: {
    type: 'select',
    default: 'none',
    options: ['none', 'sparkles', 'runes', 'orbs'],
  },
} as const satisfies ParamSchema;

export type MythicalParams = ParamsFromSchema<typeof schema>;

type Expression = MythicalParams['expression'];

// --- Shared helpers ---

function generateMythicalEyes(
  expression: Expression,
  eyeColor: string,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  size: number
): string {
  const s = size;
  const pupilS = s * 0.5;
  const highlightS = s * 0.3;

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
    case 'majestic':
      return `
        <ellipse cx="${cx1}" cy="${cy1}" rx="${s}" ry="${s * 0.75}" fill="white"/>
        <ellipse cx="${cx2}" cy="${cy2}" rx="${s}" ry="${s * 0.75}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2}" r="${pupilS}" fill="${eyeColor}"/>
        <line x1="${cx1 - s}" y1="${cy1 - s * 0.9}" x2="${cx1 + s}" y2="${cy1 - s * 0.7}" stroke="${eyeColor}" stroke-width="1.5" opacity="0.6"/>
        <line x1="${cx2 + s}" y1="${cy2 - s * 0.9}" x2="${cx2 - s}" y2="${cy2 - s * 0.7}" stroke="${eyeColor}" stroke-width="1.5" opacity="0.6"/>
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
    case 'mysterious':
      return `
        <ellipse cx="${cx1}" cy="${cy1}" rx="${s}" ry="${s * 0.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${cx2}" cy="${cy2}" rx="${s}" ry="${s * 0.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${cx1}" cy="${cy1}" rx="${pupilS}" ry="${pupilS * 0.6}" fill="${eyeColor}"/>
        <ellipse cx="${cx2}" cy="${cy2}" rx="${pupilS}" ry="${pupilS * 0.6}" fill="${eyeColor}"/>
      `;
    default:
      return '';
  }
}

function generateSingleMythicalEye(
  expression: Expression,
  eyeColor: string,
  cx: number,
  cy: number,
  size: number
): string {
  const s = size;
  const pupilS = s * 0.5;
  const highlightS = s * 0.3;

  switch (expression) {
    case 'happy':
      return `
        <circle cx="${cx}" cy="${cy}" r="${s}" fill="white"/>
        <circle cx="${cx}" cy="${cy + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx - 1}" cy="${cy - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'majestic':
      return `
        <ellipse cx="${cx}" cy="${cy}" rx="${s}" ry="${s * 0.75}" fill="white"/>
        <circle cx="${cx}" cy="${cy}" r="${pupilS}" fill="${eyeColor}"/>
        <line x1="${cx - s}" y1="${cy - s * 0.9}" x2="${cx + s}" y2="${cy - s * 0.7}" stroke="${eyeColor}" stroke-width="1.5" opacity="0.6"/>
      `;
    case 'surprised':
      return `
        <circle cx="${cx}" cy="${cy}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx}" cy="${cy}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx - 1}" cy="${cy - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'mysterious':
      return `
        <ellipse cx="${cx}" cy="${cy}" rx="${s}" ry="${s * 0.5}" fill="white" opacity="0.9"/>
        <ellipse cx="${cx}" cy="${cy}" rx="${pupilS}" ry="${pupilS * 0.6}" fill="${eyeColor}"/>
      `;
    default:
      return '';
  }
}

function generateMythicalMouth(
  expression: Expression,
  color: string,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `<path d="M${cx - 6},${cy} Q${cx},${cy + 6} ${cx + 6},${cy}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'majestic':
      return `<path d="M${cx - 4},${cy} Q${cx},${cy + 2} ${cx + 4},${cy - 1}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'surprised':
      return `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="4" fill="${color}"/>`;
    case 'mysterious':
      return `<line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function generateMythicalPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: MythicalParams['pattern']
): string {
  const dark = darkenColor(primaryColor, 30);

  switch (pattern) {
    case 'spots':
      return `
        <circle cx="${cx - rx * 0.4}" cy="${cy - ry * 0.2}" r="${rx * 0.08}" fill="${dark}" opacity="0.4"/>
        <circle cx="${cx + rx * 0.3}" cy="${cy - ry * 0.3}" r="${rx * 0.06}" fill="${dark}" opacity="0.4"/>
        <circle cx="${cx - rx * 0.1}" cy="${cy + ry * 0.3}" r="${rx * 0.07}" fill="${dark}" opacity="0.4"/>
        <circle cx="${cx + rx * 0.5}" cy="${cy + ry * 0.1}" r="${rx * 0.06}" fill="${dark}" opacity="0.4"/>
        <circle cx="${cx - rx * 0.5}" cy="${cy + ry * 0.15}" r="${rx * 0.05}" fill="${dark}" opacity="0.4"/>
        <circle cx="${cx + rx * 0.15}" cy="${cy - ry * 0.5}" r="${rx * 0.05}" fill="${dark}" opacity="0.4"/>
      `;
    case 'stripes':
      return `
        <path d="M${cx - rx * 0.7},${cy - ry * 0.3} Q${cx},${cy - ry * 0.4} ${cx + rx * 0.7},${cy - ry * 0.3}" stroke="${dark}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${cx - rx * 0.8},${cy} Q${cx},${cy - ry * 0.1} ${cx + rx * 0.8},${cy}" stroke="${dark}" stroke-width="2" fill="none" opacity="0.4"/>
        <path d="M${cx - rx * 0.7},${cy + ry * 0.3} Q${cx},${cy + ry * 0.2} ${cx + rx * 0.7},${cy + ry * 0.3}" stroke="${dark}" stroke-width="2" fill="none" opacity="0.4"/>
      `;
    case 'scales': {
      const patternId = `myth-scales-${cx}-${cy}`;
      return `
        <defs>
          <pattern id="${patternId}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${dark}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.85}" ry="${ry * 0.85}" fill="url(#${patternId})"/>
      `;
    }
    default:
      return '';
  }
}

function generateMagic(magic: MythicalParams['magic'], eyeColor: string): string {
  switch (magic) {
    case 'sparkles':
      return `
        <g opacity="0.7">
          <polygon points="82,14 83,17 86,17 84,19 85,22 82,20 79,22 80,19 78,17 81,17" fill="white"/>
          <polygon points="16,22 17,24 19,24 17.5,25.5 18,28 16,26.5 14,28 14.5,25.5 13,24 15,24" fill="${eyeColor}" opacity="0.8"/>
          <polygon points="76,78 77,80 79,80 77.5,81.5 78,84 76,82.5 74,84 74.5,81.5 73,80 75,80" fill="white" opacity="0.6"/>
          <polygon points="20,72 21,74 23,74 21.5,75 22,77 20,76 18,77 18.5,75 17,74 19,74" fill="${eyeColor}" opacity="0.5"/>
          <polygon points="88,50 89,52 91,52 89.5,53 90,55 88,54 86,55 86.5,53 85,52 87,52" fill="white" opacity="0.6"/>
        </g>
      `;
    case 'runes':
      return `
        <g opacity="0.3" stroke="${eyeColor}" stroke-width="1" fill="none">
          <circle cx="12" cy="14" r="3"/>
          <line x1="12" y1="11" x2="12" y2="17"/>
          <line x1="9" y1="14" x2="15" y2="14"/>
          <polygon points="86,80 89,86 83,86"/>
          <path d="M14,82 L16,78 L18,82 L14,82 M16,78 L16,74"/>
          <path d="M82,16 L84,12 L86,16 L84,12 L82,14 L86,14"/>
        </g>
      `;
    case 'orbs':
      return `
        <g>
          <circle cx="14" cy="18" r="5" fill="${eyeColor}" opacity="0.15"/>
          <circle cx="14" cy="18" r="3" fill="${eyeColor}" opacity="0.25"/>
          <circle cx="14" cy="18" r="1.5" fill="white" opacity="0.3"/>
          <circle cx="84" cy="78" r="4" fill="${eyeColor}" opacity="0.15"/>
          <circle cx="84" cy="78" r="2.5" fill="${eyeColor}" opacity="0.25"/>
          <circle cx="84" cy="78" r="1" fill="white" opacity="0.3"/>
          <circle cx="86" cy="22" r="3" fill="${eyeColor}" opacity="0.12"/>
          <circle cx="86" cy="22" r="2" fill="${eyeColor}" opacity="0.2"/>
          <circle cx="86" cy="22" r="0.8" fill="white" opacity="0.3"/>
          <circle cx="18" cy="80" r="3.5" fill="${eyeColor}" opacity="0.12"/>
          <circle cx="18" cy="80" r="2" fill="${eyeColor}" opacity="0.2"/>
          <circle cx="18" cy="80" r="0.8" fill="white" opacity="0.3"/>
        </g>
      `;
    default:
      return '';
  }
}

// --- Creature generators ---

function generateDragon(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  const body = `
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  const head = `
    <ellipse cx="50" cy="34" rx="18" ry="16" fill="${primaryColor}"/>
    <ellipse cx="50" cy="30" rx="14" ry="10" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  const horns = `
    <path d="M38,24 Q34,14 30,10" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,24 Q66,14 70,10" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  const wings = `
    <path d="M34,50 L10,32 L16,42 L8,38 L18,48 L14,44 L26,52" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5" opacity="0.8"/>
    <path d="M66,50 L90,32 L84,42 L92,38 L82,48 L86,44 L74,52" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5" opacity="0.8"/>
  `;

  const legs = `
    <rect x="38" y="76" width="8" height="10" rx="3" fill="${dark}"/>
    <rect x="54" y="76" width="8" height="10" rx="3" fill="${dark}"/>
  `;

  const tail = `
    <path d="M50,78 Q36,84 26,80 Q20,76 18,72" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M18,72 L14,68 L20,72 L16,74" fill="${dark}"/>
  `;

  const nostrils = `
    <circle cx="45" cy="40" r="1" fill="${dark}"/>
    <circle cx="55" cy="40" r="1" fill="${dark}"/>
  `;

  // Small flame near mouth for majestic expression
  const flame = expression === 'majestic'
    ? `<path d="M56,44 Q60,40 58,36 Q62,40 60,44" fill="#ff6b35" opacity="0.6"/>`
    : '';

  const eyes = generateMythicalEyes(expression, eyeColor, 42, 30, 58, 30, 5);
  const mouth = generateMythicalMouth(expression, dark, 50, 44);
  const pat = generateMythicalPattern(primaryColor, 50, 34, 18, 16, pattern);

  return tail + legs + body + wings + head + horns + pat + nostrils + eyes + mouth + flame;
}

function generateUnicorn(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  const body = `
    <ellipse cx="50" cy="66" rx="16" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="70" rx="10" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  const head = `
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="36" rx="12" ry="8" fill="${light}" opacity="0.2"/>
  `;

  // Spiral horn
  const horn = `
    <path d="M50,24 L48,8 L52,8 Z" fill="#ffd700"/>
    <path d="M49,22 Q50,18 51,14 Q50,16 49,18" stroke="#e6c200" stroke-width="0.5" fill="none"/>
    <path d="M49,16 Q50,12 51,10" stroke="#e6c200" stroke-width="0.5" fill="none"/>
  `;

  // Flowing mane
  const mane = `
    <path d="M36,28 Q30,34 28,44 Q26,52 30,58" stroke="#ff69b4" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M38,26 Q34,32 32,40 Q30,48 34,56" stroke="#9b59b6" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M64,28 Q70,34 72,44 Q74,52 70,58" stroke="#3498db" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M62,26 Q66,32 68,40 Q70,48 66,56" stroke="#2ecc71" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
  `;

  const ears = `
    <path d="M38,26 Q36,18 40,22" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M62,26 Q64,18 60,22" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  const legs = `
    <rect x="38" y="80" width="7" height="12" rx="3" fill="${dark}"/>
    <rect x="55" y="80" width="7" height="12" rx="3" fill="${dark}"/>
  `;

  const tail = `
    <path d="M42,82 Q32,88 26,84" stroke="#ff69b4" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M42,82 Q34,90 28,88" stroke="#9b59b6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 43, 36, 57, 36, 4.5);
  const mouth = generateMythicalMouth(expression, dark, 50, 46);
  const pat = generateMythicalPattern(primaryColor, 50, 38, 16, 14, pattern);

  return tail + legs + body + mane + head + ears + horn + pat + eyes + mouth;
}

function generatePhoenix(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 30);

  const body = `
    <ellipse cx="50" cy="52" rx="12" ry="16" fill="${primaryColor}"/>
    <ellipse cx="50" cy="56" rx="8" ry="8" fill="${secondaryColor}" opacity="0.3"/>
  `;

  const head = `
    <ellipse cx="50" cy="30" rx="10" ry="9" fill="${primaryColor}"/>
  `;

  // Fiery crest
  const crest = `
    <path d="M46,22 Q44,12 48,8 Q50,14 52,8 Q56,12 54,22" fill="#ff6b35" opacity="0.8"/>
    <path d="M48,20 Q49,14 50,10 Q51,14 52,20" fill="#ffd700" opacity="0.6"/>
  `;

  // Spread fire wings
  const wings = `
    <path d="M38,44 L8,28 L14,38 L4,32 L16,42 L10,40 L28,48" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M62,44 L92,28 L86,38 L96,32 L84,42 L90,40 L72,48" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M38,44 L8,28 L14,38" fill="${light}" opacity="0.3"/>
    <path d="M62,44 L92,28 L86,38" fill="${light}" opacity="0.3"/>
  `;

  // Long tail feathers
  const tail = `
    <path d="M46,66 Q38,78 30,90 Q28,94 32,92" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50,68 Q50,80 50,92 Q50,96 52,94" stroke="#ff6b35" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M54,66 Q62,78 70,90 Q72,94 68,92" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  // Wing glow
  const wingGlow = `
    <path d="M12,32 L6,28 L10,36" fill="#ffd700" opacity="0.4"/>
    <path d="M88,32 L94,28 L90,36" fill="#ffd700" opacity="0.4"/>
  `;

  // Small beak
  const beak = `
    <polygon points="50,36 47,39 50,38 53,39" fill="${dark}"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 46, 28, 54, 28, 3.5);
  const mouth = generateMythicalMouth(expression, dark, 50, 38);
  const pat = generateMythicalPattern(primaryColor, 50, 52, 12, 16, pattern);

  return tail + wingGlow + body + wings + head + crest + beak + pat + eyes + mouth;
}

function generateGriffin(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // Lion body (side view)
  const body = `
    <ellipse cx="44" cy="56" rx="24" ry="16" fill="${primaryColor}"/>
    <ellipse cx="44" cy="62" rx="16" ry="8" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Eagle head
  const head = `
    <ellipse cx="76" cy="38" rx="12" ry="10" fill="${light}"/>
  `;

  // Neck
  const neck = `
    <path d="M62,48 Q70,42 74,40" stroke="${primaryColor}" stroke-width="12" fill="none" stroke-linecap="round"/>
  `;

  // Beak
  const beak = `
    <polygon points="86,38 92,40 86,42" fill="#e6a800"/>
  `;

  // Eagle tuft feathers on head
  const tuft = `
    <path d="M72,30 Q70,22 74,18" stroke="${light}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M76,28 Q76,20 78,16" stroke="${light}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Wings folded on back
  const wing = `
    <path d="M32,42 Q28,32 34,24 Q42,20 50,28 Q54,34 50,44" fill="${light}" stroke="${dark}" stroke-width="0.5" opacity="0.7"/>
    <line x1="36" y1="28" x2="42" y2="40" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="42" y1="26" x2="46" y2="38" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
  `;

  // Lion tail with tuft
  const tail = `
    <path d="M20,56 Q10,52 6,48" stroke="${primaryColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <ellipse cx="5" cy="46" rx="4" ry="3" fill="${dark}" transform="rotate(-20, 5, 46)"/>
  `;

  // Legs (front eagle talons, back lion paws)
  const legs = `
    <path d="M60,68 L62,78 L58,78 L60,78 L64,78" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M54,68 L54,78 L50,78 L54,78 L56,78" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <rect x="28" y="68" width="8" height="10" rx="3" fill="${dark}"/>
    <rect x="38" y="68" width="8" height="10" rx="3" fill="${dark}"/>
  `;

  const eye = generateSingleMythicalEye(expression, eyeColor, 80, 36, 4);
  const mouth = generateMythicalMouth(expression, dark, 88, 42);
  const pat = generateMythicalPattern(primaryColor, 44, 56, 24, 16, pattern);

  return tail + legs + body + wing + neck + head + tuft + beak + pat + eye + mouth;
}

function generateYeti(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const light = lightenColor(primaryColor, 25);

  // Big round fluffy body with overlapping fuzzy ellipses
  const body = `
    <ellipse cx="50" cy="58" rx="26" ry="28" fill="${primaryColor}"/>
    <ellipse cx="42" cy="50" rx="14" ry="12" fill="${light}" opacity="0.3"/>
    <ellipse cx="58" cy="50" rx="14" ry="12" fill="${light}" opacity="0.3"/>
    <ellipse cx="50" cy="42" rx="16" ry="10" fill="${light}" opacity="0.25"/>
    <ellipse cx="44" cy="62" rx="12" ry="10" fill="${light}" opacity="0.2"/>
    <ellipse cx="56" cy="62" rx="12" ry="10" fill="${light}" opacity="0.2"/>
  `;

  // Belly area
  const belly = `
    <ellipse cx="50" cy="64" rx="14" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Small face peeking from fur
  const face = `
    <ellipse cx="50" cy="38" rx="12" ry="10" fill="${darkenColor(primaryColor, 10)}"/>
  `;

  // Short arms
  const arms = `
    <path d="M28,52 Q22,56 20,62" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M72,52 Q78,56 80,62" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `;

  // Thick legs
  const legs = `
    <rect x="34" y="80" width="10" height="10" rx="4" fill="${dark}"/>
    <rect x="56" y="80" width="10" height="10" rx="4" fill="${dark}"/>
  `;

  // Fuzzy edge tufts
  const tufts = `
    <ellipse cx="30" cy="44" rx="5" ry="4" fill="${light}" opacity="0.4" transform="rotate(-20, 30, 44)"/>
    <ellipse cx="70" cy="44" rx="5" ry="4" fill="${light}" opacity="0.4" transform="rotate(20, 70, 44)"/>
    <ellipse cx="50" cy="28" rx="6" ry="3" fill="${light}" opacity="0.4"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 44, 36, 56, 36, 4);
  const mouth = generateMythicalMouth(expression, dark, 50, 44);
  const pat = generateMythicalPattern(primaryColor, 50, 58, 26, 28, pattern);

  return legs + body + belly + tufts + arms + face + pat + eyes + mouth;
}

function generateCerberus(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Shared body
  const body = `
    <ellipse cx="50" cy="68" rx="20" ry="18" fill="${primaryColor}"/>
    <ellipse cx="50" cy="72" rx="14" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Center head (largest)
  const centerHead = `
    <ellipse cx="50" cy="34" rx="14" ry="12" fill="${primaryColor}"/>
  `;

  // Left head (angled)
  const leftHead = `
    <ellipse cx="26" cy="38" rx="11" ry="10" fill="${primaryColor}" transform="rotate(-10, 26, 38)"/>
  `;

  // Right head (angled)
  const rightHead = `
    <ellipse cx="74" cy="38" rx="11" ry="10" fill="${primaryColor}" transform="rotate(10, 74, 38)"/>
  `;

  // Necks
  const necks = `
    <path d="M50,46 L50,52" stroke="${primaryColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M30,46 Q36,52 40,56" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M70,46 Q64,52 60,56" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `;

  // Ears
  const ears = `
    <path d="M42,24 Q40,16 44,20" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M58,24 Q60,16 56,20" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M18,30 Q16,22 20,26" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M34,30 Q36,22 32,26" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M66,30 Q64,22 68,26" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M82,30 Q84,22 80,26" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Noses
  const noses = `
    <ellipse cx="50" cy="38" rx="3" ry="2" fill="${dark}"/>
    <ellipse cx="26" cy="42" rx="2.5" ry="1.8" fill="${dark}"/>
    <ellipse cx="74" cy="42" rx="2.5" ry="1.8" fill="${dark}"/>
  `;

  // Legs
  const legs = `
    <rect x="34" y="80" width="8" height="10" rx="3" fill="${dark}"/>
    <rect x="58" y="80" width="8" height="10" rx="3" fill="${dark}"/>
  `;

  // Tail
  const tail = `
    <path d="M50,82 Q42,90 36,88 Q32,86 34,82" stroke="${primaryColor}" stroke-width="4" fill="none" stroke-linecap="round"/>
  `;

  // Eyes for all 3 heads
  const centerEyes = generateMythicalEyes(expression, eyeColor, 44, 32, 56, 32, 4);
  const leftEyes = generateMythicalEyes(expression, eyeColor, 21, 36, 31, 36, 3);
  const rightEyes = generateMythicalEyes(expression, eyeColor, 69, 36, 79, 36, 3);

  // Mouths for all 3 heads
  const centerMouth = generateMythicalMouth(expression, dark, 50, 42);
  const leftMouth = generateMythicalMouth(expression, dark, 26, 46);
  const rightMouth = generateMythicalMouth(expression, dark, 74, 46);

  const pat = generateMythicalPattern(primaryColor, 50, 68, 20, 18, pattern);

  return tail + legs + body + necks + leftHead + rightHead + centerHead + ears + noses + pat + centerEyes + leftEyes + rightEyes + centerMouth + leftMouth + rightMouth;
}

function generateKitsune(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  const body = `
    <ellipse cx="50" cy="62" rx="16" ry="18" fill="${primaryColor}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Fox face
  const head = `
    <ellipse cx="50" cy="36" rx="16" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="40" rx="10" ry="7" fill="${secondaryColor}" opacity="0.4"/>
  `;

  // Large pointed ears
  const ears = `
    <path d="M36,28 L28,10 L40,24" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M64,28 L72,10 L60,24" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M36,26 L30,14 L39,24" fill="${light}" opacity="0.4"/>
    <path d="M64,26 L70,14 L61,24" fill="${light}" opacity="0.4"/>
  `;

  // Fox nose
  const nose = `
    <ellipse cx="50" cy="42" rx="3" ry="2" fill="${dark}"/>
  `;

  // 3 flowing tails
  const tails = `
    <path d="M42,76 Q28,80 20,74 Q14,68 18,62" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M50,78 Q48,88 42,92 Q36,94 34,90" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M58,76 Q72,80 80,74 Q86,68 82,62" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="17" cy="60" r="3" fill="white" opacity="0.4"/>
    <circle cx="33" cy="89" r="3" fill="white" opacity="0.4"/>
    <circle cx="83" cy="60" r="3" fill="white" opacity="0.4"/>
  `;

  // Legs
  const legs = `
    <rect x="38" y="76" width="7" height="10" rx="3" fill="${dark}"/>
    <rect x="55" y="76" width="7" height="10" rx="3" fill="${dark}"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 42, 34, 58, 34, 4.5);
  const mouth = generateMythicalMouth(expression, dark, 50, 46);
  const pat = generateMythicalPattern(primaryColor, 50, 36, 16, 14, pattern);

  return tails + legs + body + head + ears + nose + pat + eyes + mouth;
}

function generateMinotaur(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Muscular body
  const body = `
    <ellipse cx="50" cy="64" rx="18" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="68" rx="12" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Bull head
  const head = `
    <ellipse cx="50" cy="34" rx="16" ry="14" fill="${primaryColor}"/>
  `;

  // Large curved horns
  const horns = `
    <path d="M36,26 Q28,18 24,24 Q22,28 26,30" stroke="${darkenColor('#d4a017', 20)}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M64,26 Q72,18 76,24 Q78,28 74,30" stroke="${darkenColor('#d4a017', 20)}" stroke-width="4" fill="none" stroke-linecap="round"/>
  `;

  // Wide nostrils and nose ring
  const snout = `
    <ellipse cx="50" cy="40" rx="8" ry="5" fill="${darkenColor(primaryColor, 10)}" opacity="0.5"/>
    <circle cx="46" cy="41" r="1.5" fill="${dark}"/>
    <circle cx="54" cy="41" r="1.5" fill="${dark}"/>
    <path d="M46,44 Q50,48 54,44" stroke="#c0a030" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Muscular shoulders
  const shoulders = `
    <ellipse cx="34" cy="54" rx="8" ry="6" fill="${primaryColor}" opacity="0.6"/>
    <ellipse cx="66" cy="54" rx="8" ry="6" fill="${primaryColor}" opacity="0.6"/>
  `;

  // Arms
  const arms = `
    <path d="M32,56 Q26,62 24,70" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M68,56 Q74,62 76,70" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `;

  // Legs
  const legs = `
    <rect x="36" y="80" width="9" height="12" rx="4" fill="${dark}"/>
    <rect x="55" y="80" width="9" height="12" rx="4" fill="${dark}"/>
  `;

  // Ears
  const ears = `
    <ellipse cx="34" cy="30" rx="5" ry="3" fill="${primaryColor}" transform="rotate(-20, 34, 30)"/>
    <ellipse cx="66" cy="30" rx="5" ry="3" fill="${primaryColor}" transform="rotate(20, 66, 30)"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 42, 32, 58, 32, 4.5);
  const mouth = generateMythicalMouth(expression, dark, 50, 46);
  const pat = generateMythicalPattern(primaryColor, 50, 64, 18, 20, pattern);

  return legs + body + shoulders + arms + head + ears + horns + snout + pat + eyes + mouth;
}

function generateFairy(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 30);

  // Tiny body
  const body = `
    <ellipse cx="50" cy="58" rx="8" ry="12" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="5" ry="6" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head (large relative to body for chibi)
  const head = `
    <circle cx="50" cy="38" r="12" fill="${lightenColor(primaryColor, 40)}"/>
  `;

  // Large butterfly wings (translucent)
  const wings = `
    <path d="M42,48 Q20,28 16,40 Q12,52 38,56" fill="${primaryColor}" opacity="0.4" stroke="${light}" stroke-width="0.5"/>
    <path d="M42,52 Q18,58 16,68 Q14,78 40,62" fill="${primaryColor}" opacity="0.35" stroke="${light}" stroke-width="0.5"/>
    <path d="M58,48 Q80,28 84,40 Q88,52 62,56" fill="${primaryColor}" opacity="0.4" stroke="${light}" stroke-width="0.5"/>
    <path d="M58,52 Q82,58 84,68 Q86,78 60,62" fill="${primaryColor}" opacity="0.35" stroke="${light}" stroke-width="0.5"/>
  `;

  // Wing vein details
  const wingVeins = `
    <path d="M42,48 Q28,36 22,42" stroke="${light}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M42,52 Q26,60 24,68" stroke="${light}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,48 Q72,36 78,42" stroke="${light}" stroke-width="0.5" fill="none" opacity="0.5"/>
    <path d="M58,52 Q74,60 76,68" stroke="${light}" stroke-width="0.5" fill="none" opacity="0.5"/>
  `;

  // Hair
  const hair = `
    <path d="M40,30 Q38,22 42,28" fill="${dark}" opacity="0.4"/>
    <path d="M60,30 Q62,22 58,28" fill="${dark}" opacity="0.4"/>
    <path d="M44,28 Q44,20 48,26" fill="${dark}" opacity="0.3"/>
    <path d="M56,28 Q56,20 52,26" fill="${dark}" opacity="0.3"/>
  `;

  // Tiny legs
  const legs = `
    <line x1="46" y1="68" x2="44" y2="76" stroke="${dark}" stroke-width="2" stroke-linecap="round"/>
    <line x1="54" y1="68" x2="56" y2="76" stroke="${dark}" stroke-width="2" stroke-linecap="round"/>
  `;

  const eyes = generateMythicalEyes(expression, eyeColor, 45, 36, 55, 36, 3.5);
  const mouth = generateMythicalMouth(expression, dark, 50, 44);
  const pat = generateMythicalPattern(primaryColor, 50, 58, 8, 12, pattern);

  return legs + wings + wingVeins + body + head + hair + pat + eyes + mouth;
}

function generateHydra(params: MythicalParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;

  // Serpentine body
  const body = `
    <ellipse cx="50" cy="70" rx="18" ry="16" fill="${primaryColor}"/>
    <ellipse cx="50" cy="74" rx="12" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Center head (slightly larger, looking forward)
  const centerHead = `
    <ellipse cx="50" cy="28" rx="10" ry="8" fill="${primaryColor}"/>
  `;

  // Left head (angled left)
  const leftHead = `
    <ellipse cx="24" cy="32" rx="9" ry="7" fill="${primaryColor}" transform="rotate(-15, 24, 32)"/>
  `;

  // Right head (angled right)
  const rightHead = `
    <ellipse cx="76" cy="32" rx="9" ry="7" fill="${primaryColor}" transform="rotate(15, 76, 32)"/>
  `;

  // Long necks from body to heads
  const necks = `
    <path d="M50,36 Q50,46 50,56" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M28,38 Q32,48 40,56" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M72,38 Q68,48 60,56" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `;

  // Forked tongues
  const tongues = `
    <path d="M50,36 L50,39 L48,41 M50,39 L52,41" stroke="#ff4444" stroke-width="0.8" fill="none"/>
    <path d="M24,40 L23,43 L21,45 M23,43 L25,45" stroke="#ff4444" stroke-width="0.8" fill="none"/>
    <path d="M76,40 L77,43 L75,45 M77,43 L79,45" stroke="#ff4444" stroke-width="0.8" fill="none"/>
  `;

  // Small slit eyes for snake heads
  const centerEyes = generateMythicalEyes(expression, eyeColor, 45, 26, 55, 26, 3.5);
  const leftEyes = generateMythicalEyes(expression, eyeColor, 20, 30, 28, 30, 2.8);
  const rightEyes = generateMythicalEyes(expression, eyeColor, 72, 30, 80, 30, 2.8);

  // Tail
  const tail = `
    <path d="M44,82 Q36,90 28,88 Q22,86 20,80" stroke="${primaryColor}" stroke-width="5" fill="none" stroke-linecap="round"/>
  `;

  const pat = generateMythicalPattern(primaryColor, 50, 70, 18, 16, pattern);

  return tail + body + necks + leftHead + rightHead + centerHead + tongues + pat + centerEyes + leftEyes + rightEyes;
}

// Scale factors per creature type
const mythicalScaleFactors: Record<string, number> = {
  dragon: 0.75,
  unicorn: 0.78,
  phoenix: 0.72,
  griffin: 0.76,
  yeti: 0.80,
  cerberus: 0.72,
  kitsune: 0.76,
  minotaur: 0.80,
  fairy: 0.75,
  hydra: 0.72,
};

export function generate(params: MythicalParams): string {
  const { backgroundShape, creatureType, backgroundColor, eyeColor, magic: magicType } = params;

  let creature: string;
  switch (creatureType) {
    case 'dragon':
      creature = generateDragon(params);
      break;
    case 'unicorn':
      creature = generateUnicorn(params);
      break;
    case 'phoenix':
      creature = generatePhoenix(params);
      break;
    case 'griffin':
      creature = generateGriffin(params);
      break;
    case 'yeti':
      creature = generateYeti(params);
      break;
    case 'cerberus':
      creature = generateCerberus(params);
      break;
    case 'kitsune':
      creature = generateKitsune(params);
      break;
    case 'minotaur':
      creature = generateMinotaur(params);
      break;
    case 'fairy':
      creature = generateFairy(params);
      break;
    case 'hydra':
      creature = generateHydra(params);
      break;
    default:
      creature = generateDragon(params);
  }

  const scale = mythicalScaleFactors[creatureType] ?? 0.76;
  const scaledCreature = `<g transform="translate(50, 50) scale(${scale}) translate(-50, -50)">${creature}</g>`;

  const magic = generateMagic(magicType, eyeColor);

  return wrapSvgWithShape(scaledCreature + magic, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): MythicalParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const creatureTypes = [
    'dragon', 'unicorn', 'phoenix', 'griffin', 'yeti',
    'cerberus', 'kitsune', 'minotaur', 'fairy', 'hydra',
  ] as const;
  const expressions = ['happy', 'majestic', 'surprised', 'mysterious'] as const;
  const patterns = ['none', 'spots', 'stripes', 'scales'] as const;
  const magicOptions = ['none', 'sparkles', 'runes', 'orbs'] as const;

  const primaryColors = [
    '#7b2d8e', '#5b1d6e', '#4a0e6e', '#8e44ad',
    '#c0392b', '#e74c3c', '#1a6b3c', '#2ecc71',
    '#2c3e80', '#3498db', '#c79c2a', '#d4a017',
    '#708090', '#4a4a4a', '#8b1a1a', '#2d5016',
  ];

  const secondaryColors = [
    '#f0e6ff', '#ffe6f0', '#e6fff0', '#fff8e1',
    '#e6f0ff', '#ffffff', '#fce4ec', '#f3e5f5',
  ];

  const backgroundColors = [
    '#1a0a2e', '#0d1b2a', '#1b0a2e', '#2a0a1b',
    '#0a1e2e', '#1e0a2e', '#0a2e1a', '#2e1a0a',
    '#161625', '#1a1a2e', '#0f0f23', '#1e1025',
  ];

  const eyeColors = [
    '#ffd700', '#ff6b6b', '#00ffaa', '#6bb5ff', '#ff69b4',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    creatureType: randomPick(creatureTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
    magic: randomPick(magicOptions, rng),
  };
}

export const mythical: Theme<typeof schema> = {
  name: 'Mythical',
  schema,
  shapeParam: 'creatureType',
  generate,
  randomize,
};
