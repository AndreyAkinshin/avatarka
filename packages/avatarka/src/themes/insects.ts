import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  insectType: {
    type: 'select',
    default: 'butterfly',
    options: [
      'butterfly', 'bee', 'ladybug', 'ant', 'beetle',
      'dragonfly', 'caterpillar', 'firefly', 'mantis', 'spider',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#4CAF50',
  },
  secondaryColor: {
    type: 'color',
    default: '#FFC107',
  },
  wingColor: {
    type: 'color',
    default: '#81D4FA',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    default: '#E8F5E9',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'curious', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'gradient'],
  },
} as const satisfies ParamSchema;

export type InsectsParams = ParamsFromSchema<typeof schema>;

type Expression = InsectsParams['expression'];

// --- Shared helpers ---

function generateInsectEyes(
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
    case 'curious':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s * 1.15}" fill="white"/>
        <circle cx="${cx1 + 1}" cy="${cy1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2 + 1}" cy="${cy2}" r="${pupilS * 1.1}" fill="${eyeColor}"/>
        <circle cx="${cx1}" cy="${cy1 - 1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2 - 1}" r="${highlightS}" fill="white"/>
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

function generateInsectMouth(
  expression: Expression,
  color: string,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `<path d="M${cx - 4},${cy} Q${cx},${cy + 4} ${cx + 4},${cy}" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    case 'curious':
      return `<ellipse cx="${cx + 2}" cy="${cy}" rx="2" ry="2.5" fill="${color}"/>`;
    case 'surprised':
      return `<ellipse cx="${cx}" cy="${cy}" rx="2.5" ry="3.5" fill="${color}"/>`;
    case 'sleepy':
      return `<line x1="${cx - 3}" y1="${cy}" x2="${cx + 3}" y2="${cy}" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function generateInsectAntennae(
  color: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  height: number
): string {
  return `
    <path d="M${x1},${y1} Q${x1 - 6},${y1 - height} ${x1 - 10},${y1 - height - 4}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${x1 - 10}" cy="${y1 - height - 4}" r="2" fill="${color}"/>
    <path d="M${x2},${y2} Q${x2 + 6},${y2 - height} ${x2 + 10},${y2 - height - 4}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="${x2 + 10}" cy="${y2 - height - 4}" r="2" fill="${color}"/>
  `;
}

function generateInsectPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: InsectsParams['pattern']
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
    case 'gradient': {
      const gradId = `insect-grad-${cx}-${cy}`;
      return `
        <defs>
          <radialGradient id="${gradId}" cx="40%" cy="40%">
            <stop offset="0%" stop-color="${lightenColor(primaryColor, 20)}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${dark}" stop-opacity="0.15"/>
          </radialGradient>
        </defs>
        <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.85}" ry="${ry * 0.85}" fill="url(#${gradId})"/>
      `;
    }
    default:
      return '';
  }
}

// --- Insect generators ---

function generateButterfly(params: InsectsParams): string {
  const { primaryColor, secondaryColor, wingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Large ornate wings
  const wings = `
    <path d="M50,42 Q22,20 14,34 Q8,46 24,52 Q34,56 50,48" fill="${wingColor}" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.8"/>
    <path d="M50,42 Q78,20 86,34 Q92,46 76,52 Q66,56 50,48" fill="${wingColor}" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.8"/>
    <path d="M50,52 Q28,58 20,68 Q16,76 30,74 Q40,72 50,60" fill="${lightenColor(wingColor, 15)}" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.8"/>
    <path d="M50,52 Q72,58 80,68 Q84,76 70,74 Q60,72 50,60" fill="${lightenColor(wingColor, 15)}" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.8"/>
  `;

  // Wing patterns (circles on wings)
  const wingDecor = `
    <circle cx="30" cy="36" r="5" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="70" cy="36" r="5" fill="${secondaryColor}" opacity="0.6"/>
    <circle cx="28" cy="66" r="3.5" fill="${secondaryColor}" opacity="0.5"/>
    <circle cx="72" cy="66" r="3.5" fill="${secondaryColor}" opacity="0.5"/>
  `;

  // Thin body
  const body = `
    <ellipse cx="50" cy="50" rx="4" ry="16" fill="${primaryColor}"/>
    <ellipse cx="50" cy="50" rx="2.5" ry="14" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Antennae
  const antennae = `
    <path d="M48,36 Q42,22 36,16" stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="36" cy="16" r="2" fill="${dark}"/>
    <path d="M52,36 Q58,22 64,16" stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="64" cy="16" r="2" fill="${dark}"/>
  `;

  const eyes = generateInsectEyes(expression, eyeColor, 46, 40, 54, 40, 3.5);
  const mouth = generateInsectMouth(expression, dark, 50, 48);
  const pat = generateInsectPattern(primaryColor, 50, 50, 4, 16, pattern);

  return wings + wingDecor + body + pat + antennae + eyes + mouth;
}

function generateBee(params: InsectsParams): string {
  const { primaryColor, secondaryColor, wingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Round fuzzy body
  const body = `
    <ellipse cx="50" cy="54" rx="18" ry="20" fill="${primaryColor}"/>
  `;

  // Yellow-black stripes
  const stripes = `
    <path d="M34,46 Q50,42 66,46" stroke="${secondaryColor}" stroke-width="4" fill="none"/>
    <path d="M32,54 Q50,50 68,54" stroke="${secondaryColor}" stroke-width="4" fill="none"/>
    <path d="M34,62 Q50,58 66,62" stroke="${secondaryColor}" stroke-width="4" fill="none"/>
  `;

  // Small wings
  const wings = `
    <ellipse cx="34" cy="38" rx="10" ry="6" fill="${wingColor}" opacity="0.6" transform="rotate(-20, 34, 38)"/>
    <ellipse cx="66" cy="38" rx="10" ry="6" fill="${wingColor}" opacity="0.6" transform="rotate(20, 66, 38)"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="32" r="12" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="8" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  // Stinger
  const stinger = `
    <polygon points="50,74 48,78 52,78" fill="${dark}"/>
  `;

  // Tiny legs
  const legs = `
    <line x1="40" y1="66" x2="34" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="50" y1="68" x2="50" y2="76" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="60" y1="66" x2="66" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  `;

  const antennae = generateInsectAntennae(dark, 44, 22, 56, 22, 10);
  const eyes = generateInsectEyes(expression, eyeColor, 44, 30, 56, 30, 4.5);
  const mouth = generateInsectMouth(expression, dark, 50, 38);
  const pat = generateInsectPattern(primaryColor, 50, 54, 18, 20, pattern);

  return wings + legs + stinger + body + stripes + pat + head + antennae + eyes + mouth;
}

function generateLadybug(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Dome shell
  const shell = `
    <ellipse cx="50" cy="56" rx="24" ry="22" fill="${primaryColor}"/>
    <ellipse cx="50" cy="52" rx="20" ry="16" fill="${lightenColor(primaryColor, 10)}" opacity="0.15"/>
  `;

  // Center line
  const centerLine = `
    <line x1="50" y1="36" x2="50" y2="78" stroke="${dark}" stroke-width="1.5"/>
  `;

  // Dots on shell
  const dots = `
    <circle cx="40" cy="48" r="3.5" fill="${dark}"/>
    <circle cx="60" cy="48" r="3.5" fill="${dark}"/>
    <circle cx="36" cy="60" r="3" fill="${dark}"/>
    <circle cx="64" cy="60" r="3" fill="${dark}"/>
    <circle cx="42" cy="70" r="2.5" fill="${dark}"/>
    <circle cx="58" cy="70" r="2.5" fill="${dark}"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="34" r="10" fill="${dark}"/>
    <circle cx="50" cy="32" r="6" fill="${lightenColor(dark, 15)}" opacity="0.15"/>
  `;

  // Tiny legs
  const legs = `
    <line x1="30" y1="50" x2="22" y2="56" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="28" y1="60" x2="20" y2="64" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="30" y1="70" x2="24" y2="76" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="50" x2="78" y2="56" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="72" y1="60" x2="80" y2="64" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="70" y1="70" x2="76" y2="76" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  `;

  const antennae = generateInsectAntennae(dark, 44, 26, 56, 26, 8);
  const eyes = generateInsectEyes(expression, eyeColor, 45, 32, 55, 32, 3.5);
  const mouth = generateInsectMouth(expression, secondaryColor, 50, 39);
  const pat = generateInsectPattern(primaryColor, 50, 56, 24, 22, pattern);

  return legs + shell + centerLine + dots + pat + head + antennae + eyes + mouth;
}

function generateAnt(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Head (large, front-facing)
  const head = `
    <circle cx="50" cy="28" r="14" fill="${primaryColor}"/>
    <circle cx="50" cy="26" r="9" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Thorax (middle segment)
  const thorax = `
    <ellipse cx="50" cy="50" rx="10" ry="8" fill="${primaryColor}"/>
  `;

  // Abdomen (rear segment)
  const abdomen = `
    <ellipse cx="50" cy="70" rx="14" ry="12" fill="${primaryColor}"/>
    <ellipse cx="50" cy="72" rx="9" ry="8" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Neck connector
  const neck = `
    <rect x="47" y="40" width="6" height="6" rx="2" fill="${dark}" opacity="0.3"/>
  `;

  // Waist connector
  const waist = `
    <rect x="47" y="56" width="6" height="6" rx="2" fill="${dark}" opacity="0.3"/>
  `;

  // Mandibles
  const mandibles = `
    <path d="M42,38 Q38,42 36,40" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,38 Q62,42 64,40" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Long angled legs
  const legs = `
    <path d="M42,46 L28,40 L22,46" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,46 L72,40 L78,46" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,50 L26,52 L22,58" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,50 L74,52 L78,58" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,54 L28,60 L24,68" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L72,60 L76,68" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  const antennae = generateInsectAntennae(dark, 42, 18, 58, 18, 12);
  const eyes = generateInsectEyes(expression, eyeColor, 44, 26, 56, 26, 4);
  const mouth = generateInsectMouth(expression, dark, 50, 36);
  const pat = generateInsectPattern(primaryColor, 50, 70, 14, 12, pattern);

  return legs + abdomen + waist + thorax + neck + head + mandibles + pat + antennae + eyes + mouth;
}

function generateBeetle(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 15);

  // Heavy shell
  const shell = `
    <ellipse cx="50" cy="58" rx="22" ry="24" fill="${primaryColor}"/>
    <ellipse cx="50" cy="54" rx="18" ry="18" fill="${light}" opacity="0.12"/>
  `;

  // Shell line
  const shellLine = `
    <line x1="50" y1="36" x2="50" y2="82" stroke="${dark}" stroke-width="1.2"/>
  `;

  // Head with horn
  const head = `
    <circle cx="50" cy="34" r="12" fill="${dark}"/>
    <circle cx="50" cy="32" r="7" fill="${lightenColor(dark, 12)}" opacity="0.15"/>
  `;

  // Horn
  const horn = `
    <path d="M50,22 Q52,14 50,8" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  // Mandibles
  const mandibles = `
    <path d="M42,40 Q38,44 34,42" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M58,40 Q62,44 66,42" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Sturdy legs
  const legs = `
    <path d="M32,50 L22,44 L18,50" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M68,50 L78,44 L82,50" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30,60 L18,60 L14,66" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M70,60 L82,60 L86,66" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M32,72 L22,76 L20,82" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M68,72 L78,76 L80,82" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Shell sheen
  const sheen = `
    <ellipse cx="42" cy="50" rx="4" ry="8" fill="white" opacity="0.1" transform="rotate(-15, 42, 50)"/>
  `;

  const eyes = generateInsectEyes(expression, eyeColor, 44, 32, 56, 32, 3.5);
  const mouth = generateInsectMouth(expression, secondaryColor, 50, 40);
  const pat = generateInsectPattern(primaryColor, 50, 58, 22, 24, pattern);

  return legs + shell + shellLine + sheen + pat + head + horn + mandibles + eyes + mouth;
}

function generateDragonfly(params: InsectsParams): string {
  const { primaryColor, secondaryColor, wingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // 4 elongated translucent wings
  const wings = `
    <ellipse cx="30" cy="36" rx="18" ry="5" fill="${wingColor}" opacity="0.45" transform="rotate(-15, 30, 36)"/>
    <ellipse cx="70" cy="36" rx="18" ry="5" fill="${wingColor}" opacity="0.45" transform="rotate(15, 70, 36)"/>
    <ellipse cx="32" cy="44" rx="16" ry="4.5" fill="${wingColor}" opacity="0.35" transform="rotate(10, 32, 44)"/>
    <ellipse cx="68" cy="44" rx="16" ry="4.5" fill="${wingColor}" opacity="0.35" transform="rotate(-10, 68, 44)"/>
  `;

  // Wing veins
  const wingVeins = `
    <line x1="20" y1="36" x2="42" y2="34" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.4" opacity="0.5"/>
    <line x1="58" y1="34" x2="80" y2="36" stroke="${darkenColor(wingColor, 20)}" stroke-width="0.4" opacity="0.5"/>
  `;

  // Large head with huge compound eyes
  const head = `
    <circle cx="50" cy="26" r="12" fill="${primaryColor}"/>
  `;

  // Thorax
  const thorax = `
    <ellipse cx="50" cy="42" rx="8" ry="6" fill="${primaryColor}"/>
  `;

  // Long thin abdomen
  const abdomen = `
    <rect x="47" y="48" width="6" height="36" rx="3" fill="${primaryColor}"/>
    <rect x="48" y="50" width="4" height="32" rx="2" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Abdomen segments
  const segments = `
    <line x1="47" y1="56" x2="53" y2="56" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="62" x2="53" y2="62" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="68" x2="53" y2="68" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
    <line x1="47" y1="74" x2="53" y2="74" stroke="${dark}" stroke-width="0.8" opacity="0.3"/>
  `;

  // Tiny legs
  const legs = `
    <line x1="44" y1="42" x2="38" y2="50" stroke="${dark}" stroke-width="1" stroke-linecap="round"/>
    <line x1="56" y1="42" x2="62" y2="50" stroke="${dark}" stroke-width="1" stroke-linecap="round"/>
  `;

  const eyes = generateInsectEyes(expression, eyeColor, 43, 24, 57, 24, 5);
  const mouth = generateInsectMouth(expression, dark, 50, 32);
  const pat = generateInsectPattern(primaryColor, 50, 42, 8, 6, pattern);

  return wings + wingVeins + legs + abdomen + segments + thorax + pat + head + eyes + mouth;
}

function generateCaterpillar(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 15);

  // Segmented wave body (from left to right)
  const body = `
    <circle cx="18" cy="62" r="8" fill="${primaryColor}"/>
    <circle cx="30" cy="58" r="9" fill="${light}"/>
    <circle cx="43" cy="56" r="9.5" fill="${primaryColor}"/>
    <circle cx="56" cy="58" r="9" fill="${light}"/>
    <circle cx="68" cy="62" r="8.5" fill="${primaryColor}"/>
  `;

  // Head (larger, at the right)
  const head = `
    <circle cx="80" cy="56" r="12" fill="${primaryColor}"/>
    <circle cx="80" cy="54" r="8" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Belly highlights
  const bellies = `
    <circle cx="18" cy="64" r="4" fill="${secondaryColor}" opacity="0.3"/>
    <circle cx="30" cy="60" r="5" fill="${secondaryColor}" opacity="0.25"/>
    <circle cx="43" cy="58" r="5" fill="${secondaryColor}" opacity="0.3"/>
    <circle cx="56" cy="60" r="5" fill="${secondaryColor}" opacity="0.25"/>
    <circle cx="68" cy="64" r="4.5" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Tiny feet pairs under each segment
  const feet = `
    <line x1="14" y1="68" x2="12" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="22" y1="68" x2="24" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="65" x2="24" y2="72" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="34" y1="65" x2="36" y2="72" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="39" y1="64" x2="37" y2="70" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="47" y1="64" x2="49" y2="70" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="52" y1="65" x2="50" y2="72" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="60" y1="65" x2="62" y2="72" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="64" y1="68" x2="62" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="72" y1="68" x2="74" y2="74" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  `;

  // Small antennae on head
  const antennae = `
    <path d="M76,46 Q72,38 68,34" stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="68" cy="34" r="1.5" fill="${dark}"/>
    <path d="M84,46 Q88,38 92,34" stroke="${dark}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <circle cx="92" cy="34" r="1.5" fill="${dark}"/>
  `;

  const eyes = generateInsectEyes(expression, eyeColor, 76, 54, 86, 54, 3.5);
  const mouth = generateInsectMouth(expression, dark, 80, 62);
  const pat = generateInsectPattern(primaryColor, 43, 56, 9.5, 9.5, pattern);

  return feet + body + bellies + pat + head + antennae + eyes + mouth;
}

function generateFirefly(params: InsectsParams): string {
  const { primaryColor, secondaryColor, wingColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Glowing abdomen
  const glowId = 'firefly-glow';
  const glow = `
    <defs>
      <radialGradient id="${glowId}" cx="50%" cy="50%">
        <stop offset="0%" stop-color="${secondaryColor}" stop-opacity="0.9"/>
        <stop offset="50%" stop-color="${secondaryColor}" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="${secondaryColor}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="70" r="16" fill="url(#${glowId})"/>
    <ellipse cx="50" cy="68" rx="10" ry="12" fill="${secondaryColor}" opacity="0.7"/>
    <ellipse cx="50" cy="66" rx="6" ry="7" fill="${lightenColor(secondaryColor, 25)}" opacity="0.5"/>
  `;

  // Upper body / thorax
  const thorax = `
    <ellipse cx="50" cy="48" rx="10" ry="10" fill="${primaryColor}"/>
  `;

  // Head
  const head = `
    <circle cx="50" cy="32" r="10" fill="${primaryColor}"/>
    <circle cx="50" cy="30" r="6" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // Small wings
  const wings = `
    <ellipse cx="34" cy="42" rx="12" ry="5" fill="${wingColor}" opacity="0.4" transform="rotate(-25, 34, 42)"/>
    <ellipse cx="66" cy="42" rx="12" ry="5" fill="${wingColor}" opacity="0.4" transform="rotate(25, 66, 42)"/>
  `;

  // Tiny legs
  const legs = `
    <line x1="42" y1="52" x2="36" y2="60" stroke="${dark}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="58" y1="52" x2="64" y2="60" stroke="${dark}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="44" y1="56" x2="38" y2="64" stroke="${dark}" stroke-width="1.2" stroke-linecap="round"/>
    <line x1="56" y1="56" x2="62" y2="64" stroke="${dark}" stroke-width="1.2" stroke-linecap="round"/>
  `;

  const antennae = generateInsectAntennae(dark, 44, 24, 56, 24, 10);
  const eyes = generateInsectEyes(expression, eyeColor, 45, 30, 55, 30, 3.5);
  const mouth = generateInsectMouth(expression, dark, 50, 38);
  const pat = generateInsectPattern(primaryColor, 50, 48, 10, 10, pattern);

  return wings + legs + glow + thorax + pat + head + antennae + eyes + mouth;
}

function generateMantis(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Triangular head
  const head = `
    <path d="M38,24 L50,14 L62,24 Q54,32 50,34 Q46,32 38,24 Z" fill="${primaryColor}"/>
    <path d="M42,22 L50,16 L58,22 Q52,28 50,30 Q48,28 42,22 Z" fill="${lightenColor(primaryColor, 10)}" opacity="0.15"/>
  `;

  // Neck
  const neck = `
    <rect x="47" y="32" width="6" height="8" rx="2" fill="${primaryColor}"/>
  `;

  // Lean thorax
  const thorax = `
    <ellipse cx="50" cy="48" rx="8" ry="10" fill="${primaryColor}"/>
  `;

  // Abdomen
  const abdomen = `
    <ellipse cx="50" cy="70" rx="10" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="72" rx="6" ry="10" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Folded "prayer" arms
  const arms = `
    <path d="M42,42 L30,34 L28,44 L38,46" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M58,42 L70,34 L72,44 L62,46" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28,44 L24,42" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M72,44 L76,42" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Thin legs
  const legs = `
    <path d="M42,54 L30,58 L26,68" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L70,58 L74,68" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M42,62 L32,68 L28,78" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M58,62 L68,68 L72,78" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  // Antennae
  const antennae = `
    <path d="M44,16 Q38,8 32,4" stroke="${dark}" stroke-width="1" fill="none" stroke-linecap="round"/>
    <path d="M56,16 Q62,8 68,4" stroke="${dark}" stroke-width="1" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateInsectEyes(expression, eyeColor, 44, 22, 56, 22, 4);
  const mouth = generateInsectMouth(expression, dark, 50, 30);
  const pat = generateInsectPattern(primaryColor, 50, 70, 10, 14, pattern);

  return legs + abdomen + thorax + neck + head + arms + pat + antennae + eyes + mouth;
}

function generateSpider(params: InsectsParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Round body
  const body = `
    <circle cx="50" cy="54" r="18" fill="${primaryColor}"/>
    <circle cx="50" cy="56" r="12" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Head (cephalothorax, front)
  const head = `
    <circle cx="50" cy="34" r="12" fill="${primaryColor}"/>
    <circle cx="50" cy="32" r="7" fill="${lightenColor(primaryColor, 12)}" opacity="0.15"/>
  `;

  // 8 legs radiating outward
  const legs = `
    <path d="M40,38 L24,24 L16,30" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M60,38 L76,24 L84,30" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,42 L20,38 L12,44" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,42 L80,38 L88,44" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M36,54 L18,56 L10,62" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M64,54 L82,56 L90,62" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38,64 L24,72 L18,80" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62,64 L76,72 L82,80" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  `;

  // Multiple small eyes (spider-like cluster)
  const spiderEyes = (() => {
    // Main pair always expression-based
    const mainEyes = generateInsectEyes(expression, eyeColor, 45, 32, 55, 32, 4);
    // Extra tiny eyes
    const extraEyes = `
      <circle cx="42" cy="28" r="1.5" fill="white"/>
      <circle cx="42" cy="28" r="0.8" fill="${eyeColor}"/>
      <circle cx="58" cy="28" r="1.5" fill="white"/>
      <circle cx="58" cy="28" r="0.8" fill="${eyeColor}"/>
    `;
    return mainEyes + extraEyes;
  })();

  // Fangs
  const fangs = `
    <line x1="46" y1="42" x2="44" y2="47" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="54" y1="42" x2="56" y2="47" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  `;

  const mouth = generateInsectMouth(expression, dark, 50, 40);
  const pat = generateInsectPattern(primaryColor, 50, 54, 18, 18, pattern);

  return legs + body + pat + head + spiderEyes + fangs + mouth;
}

export function generate(params: InsectsParams): string {
  const { backgroundShape, insectType, backgroundColor } = params;

  let creature: string;
  switch (insectType) {
    case 'butterfly':
      creature = generateButterfly(params);
      break;
    case 'bee':
      creature = generateBee(params);
      break;
    case 'ladybug':
      creature = generateLadybug(params);
      break;
    case 'ant':
      creature = generateAnt(params);
      break;
    case 'beetle':
      creature = generateBeetle(params);
      break;
    case 'dragonfly':
      creature = generateDragonfly(params);
      break;
    case 'caterpillar':
      creature = generateCaterpillar(params);
      break;
    case 'firefly':
      creature = generateFirefly(params);
      break;
    case 'mantis':
      creature = generateMantis(params);
      break;
    case 'spider':
      creature = generateSpider(params);
      break;
    default:
      creature = generateButterfly(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): InsectsParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const insectTypes = [
    'butterfly', 'bee', 'ladybug', 'ant', 'beetle',
    'dragonfly', 'caterpillar', 'firefly', 'mantis', 'spider',
  ] as const;
  const expressions = ['happy', 'curious', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'spots', 'stripes', 'gradient'] as const;

  const primaryColors = [
    '#4CAF50', '#388E3C', '#2E7D32', '#1B5E20',
    '#5D4037', '#3E2723', '#212121', '#37474F',
    '#D32F2F', '#E53935', '#1565C0', '#1976D2',
    '#F57F17', '#E65100', '#4E342E', '#33691E',
  ];

  const secondaryColors = [
    '#FFC107', '#FFEB3B', '#FFE0B2', '#FFF9C4',
    '#FFFFFF', '#F5F5F5', '#FFD54F', '#FFCC80',
  ];

  const wingColors = [
    '#81D4FA', '#CE93D8', '#FFAB91', '#80CBC4',
    '#B39DDB', '#EF9A9A', '#A5D6A7', '#FFF59D',
  ];

  const backgroundColors = [
    '#E8F5E9', '#C8E6C9', '#DCEDC8', '#F1F8E9',
    '#FFF8E1', '#FFF3E0', '#E0F2F1', '#F3E5F5',
    '#E8EAF6', '#FCE4EC', '#F9FBE7', '#FFFDE7',
  ];

  const eyeColors = [
    '#1a1a1a', '#8B0000', '#DAA520', '#2E7D32', '#FF8F00',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    insectType: randomPick(insectTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    wingColor: randomPick(wingColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
  };
}

export const insects: Theme<typeof schema> = {
  name: 'Insects',
  schema,
  shapeParam: 'insectType',
  generate,
  randomize,
};
