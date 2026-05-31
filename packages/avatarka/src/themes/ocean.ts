import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  creatureType: {
    type: 'select',
    default: 'octopus',
    options: ['octopus', 'fish', 'jellyfish', 'crab', 'whale', 'seahorse', 'pufferfish', 'turtle', 'shark', 'starfish'],
  },
  primaryColor: {
    type: 'color',
    default: '#3498db',
  },
  secondaryColor: {
    type: 'color',
    default: '#ecf0f1',
  },
  eyeColor: {
    type: 'color',
    default: '#2c3e50',
  },
  backgroundColor: {
    type: 'color',
    default: '#1a5276',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'neutral', 'surprised', 'grumpy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'scales'],
  },
} as const satisfies ParamSchema;

export type OceanParams = ParamsFromSchema<typeof schema>;

type Expression = OceanParams['expression'];

function generateEyes(
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
    case 'neutral':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2}" r="${pupilS}" fill="${eyeColor}"/>
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
    case 'grumpy':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <line x1="${cx1 - s}" y1="${cy1 - s}" x2="${cx1 + s}" y2="${cy1 - s * 0.5}" stroke="${eyeColor}" stroke-width="2"/>
        <line x1="${cx2 + s}" y1="${cy2 - s}" x2="${cx2 - s}" y2="${cy2 - s * 0.5}" stroke="${eyeColor}" stroke-width="2"/>
      `;
    default:
      return '';
  }
}

function generateMouth(
  expression: Expression,
  color: string,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `<path d="M${cx - 6},${cy} Q${cx},${cy + 6} ${cx + 6},${cy}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'neutral':
      return `<line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
    case 'surprised':
      return `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="4" fill="${color}"/>`;
    case 'grumpy':
      return `<path d="M${cx - 6},${cy + 3} Q${cx},${cy - 3} ${cx + 6},${cy + 3}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function generatePattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: OceanParams['pattern']
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
      const patternId = `ocean-scales-${cx}-${cy}`;
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

// --- Creature generators ---

function generateOctopus(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Dome head
  const head = `
    <ellipse cx="50" cy="38" rx="24" ry="22" fill="${primaryColor}"/>
    <ellipse cx="50" cy="42" rx="16" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // 6 tentacles with suction cups
  const tentacles = `
    <path d="M30,50 Q22,65 18,80 Q16,88 22,85" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M36,52 Q30,70 28,85 Q26,92 32,90" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M44,54 Q42,72 40,88 Q39,94 44,92" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M56,54 Q58,72 60,88 Q61,94 56,92" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M64,52 Q70,70 72,85 Q74,92 68,90" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M70,50 Q78,65 82,80 Q84,88 78,85" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `;

  // Suction cups
  const cups = `
    <circle cx="22" cy="70" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="20" cy="78" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="30" cy="74" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="29" cy="82" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="70" cy="74" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="71" cy="82" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="78" cy="70" r="1.5" fill="${dark}" opacity="0.5"/>
    <circle cx="80" cy="78" r="1.5" fill="${dark}" opacity="0.5"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 40, 36, 60, 36, 5);
  const mouth = generateMouth(expression, dark, 50, 48);
  const pat = generatePattern(primaryColor, 50, 38, 24, 22, pattern);

  return tentacles + cups + head + pat + eyes + mouth;
}

function generateFish(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Tail fin
  const tail = `
    <path d="M15,50 L5,38 L5,62 Z" fill="${dark}"/>
  `;

  // Body
  const body = `
    <ellipse cx="45" cy="50" rx="30" ry="18" fill="${primaryColor}"/>
    <ellipse cx="45" cy="55" rx="22" ry="10" fill="${secondaryColor}" opacity="0.4"/>
  `;

  // Dorsal fin
  const dorsal = `
    <path d="M35,32 Q45,22 55,32" fill="${dark}"/>
  `;

  // Pectoral fin
  const pectoral = `
    <path d="M38,55 Q32,65 28,68 Q36,62 40,58" fill="${dark}" opacity="0.7"/>
  `;

  // Fish has one visible eye (side view)
  const eye = `
    <circle cx="58" cy="46" r="5" fill="white"/>
    <circle cx="58" cy="${expression === 'happy' ? 47 : 46}" r="${expression === 'surprised' ? 2 : 3}" fill="${eyeColor}"/>
    ${expression === 'happy' ? `<circle cx="57" cy="45" r="1.3" fill="white"/>` : ''}
    ${expression === 'grumpy' ? `<line x1="54" y1="41" x2="62" y2="43" stroke="${eyeColor}" stroke-width="1.5"/>` : ''}
  `;

  const mouth = generateMouth(expression, dark, 68, 52);
  const pat = generatePattern(primaryColor, 45, 50, 30, 18, pattern);

  return tail + body + dorsal + pectoral + pat + eye + mouth;
}

function generateJellyfish(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const light = lightenColor(primaryColor, 30);

  // Bell (semi-transparent dome)
  const bell = `
    <path d="M20,48 Q20,20 50,18 Q80,20 80,48 Z" fill="${primaryColor}" opacity="0.7"/>
    <path d="M25,46 Q25,26 50,24 Q75,26 75,46 Z" fill="${light}" opacity="0.3"/>
  `;

  // Inner bell glow
  const glow = `
    <ellipse cx="50" cy="35" rx="14" ry="10" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Wavy trailing tentacles
  const tentacles = `
    <path d="M28,48 Q26,58 30,68 Q34,78 30,88" stroke="${primaryColor}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M38,48 Q35,60 38,72 Q41,82 37,92" stroke="${primaryColor}" stroke-width="2.5" fill="none" opacity="0.5" stroke-linecap="round"/>
    <path d="M50,48 Q48,62 50,74 Q52,84 50,94" stroke="${primaryColor}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
    <path d="M62,48 Q65,60 62,72 Q59,82 63,92" stroke="${primaryColor}" stroke-width="2.5" fill="none" opacity="0.5" stroke-linecap="round"/>
    <path d="M72,48 Q74,58 70,68 Q66,78 70,88" stroke="${primaryColor}" stroke-width="2.5" fill="none" opacity="0.6" stroke-linecap="round"/>
  `;

  // Frilly edge
  const frill = `
    <path d="M20,48 Q25,52 30,48 Q35,44 40,48 Q45,52 50,48 Q55,44 60,48 Q65,52 70,48 Q75,44 80,48" stroke="${primaryColor}" stroke-width="2" fill="none" opacity="0.8"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 42, 36, 58, 36, 4);
  const mouth = generateMouth(expression, darkenColor(primaryColor, 25), 50, 44);
  const pat = generatePattern(primaryColor, 50, 34, 22, 16, pattern);

  return tentacles + bell + glow + frill + pat + eyes + mouth;
}

function generateCrab(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Body (wide ellipse)
  const body = `
    <ellipse cx="50" cy="55" rx="28" ry="18" fill="${primaryColor}"/>
    <ellipse cx="50" cy="58" rx="18" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Claws
  const claws = `
    <path d="M22,55 L12,42 L8,48 Q6,44 10,40 Q16,36 18,42 L22,48" fill="${primaryColor}" stroke="${dark}" stroke-width="1"/>
    <path d="M78,55 L88,42 L92,48 Q94,44 90,40 Q84,36 82,42 L78,48" fill="${primaryColor}" stroke="${dark}" stroke-width="1"/>
  `;

  // Legs (3 per side)
  const legs = `
    <line x1="28" y1="62" x2="16" y2="72" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="34" y1="66" x2="24" y2="78" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="40" y1="68" x2="32" y2="82" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="72" y1="62" x2="84" y2="72" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="66" y1="66" x2="76" y2="78" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="60" y1="68" x2="68" y2="82" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
  `;

  // Eye stalks
  const stalks = `
    <line x1="38" y1="42" x2="34" y2="30" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
    <line x1="62" y1="42" x2="66" y2="30" stroke="${primaryColor}" stroke-width="3" stroke-linecap="round"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 34, 28, 66, 28, 4);
  const mouth = generateMouth(expression, dark, 50, 60);
  const pat = generatePattern(primaryColor, 50, 55, 28, 18, pattern);

  return legs + body + pat + claws + stalks + eyes + mouth;
}

function generateWhale(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Large oval body
  const body = `
    <ellipse cx="50" cy="52" rx="36" ry="26" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="28" ry="16" fill="${secondaryColor}" opacity="0.5"/>
  `;

  // Tail flukes
  const tail = `
    <path d="M14,52 Q6,40 4,32 Q10,38 14,42" fill="${dark}"/>
    <path d="M14,52 Q6,64 4,72 Q10,66 14,62" fill="${dark}"/>
  `;

  // Small pectoral fin
  const fin = `
    <path d="M42,65 Q36,75 30,78 Q38,72 42,68" fill="${dark}" opacity="0.6"/>
  `;

  // Spout for happy expression
  const spout = expression === 'happy'
    ? `
      <path d="M62,26 Q60,18 56,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M62,26 Q64,18 68,12" stroke="#87ceeb" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
      <circle cx="54" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
      <circle cx="70" cy="10" r="1.5" fill="#87ceeb" opacity="0.4"/>
    `
    : '';

  // Whale eye (side view - one eye)
  const eye = `
    <circle cx="68" cy="48" r="5" fill="white"/>
    <circle cx="68" cy="${expression === 'happy' ? 49 : 48}" r="${expression === 'surprised' ? 2 : 3}" fill="${eyeColor}"/>
    ${expression === 'happy' ? `<circle cx="67" cy="47" r="1.3" fill="white"/>` : ''}
    ${expression === 'grumpy' ? `<line x1="64" y1="43" x2="72" y2="45" stroke="${eyeColor}" stroke-width="1.5"/>` : ''}
  `;

  const mouth = generateMouth(expression, dark, 74, 56);
  const pat = generatePattern(primaryColor, 50, 50, 36, 26, pattern);

  return tail + body + fin + pat + eye + mouth + spout;
}

function generateSeahorse(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // S-curved body
  const body = `
    <path d="M50,16 Q62,16 62,28 Q62,40 50,44 Q38,48 38,60 Q38,72 50,76 Q54,78 52,84 Q48,90 44,88 Q38,84 40,78" fill="${primaryColor}" stroke="${dark}" stroke-width="1"/>
  `;

  // Belly
  const belly = `
    <path d="M52,20 Q58,20 58,30 Q58,38 50,42 Q44,46 44,56 Q44,66 50,70" fill="${secondaryColor}" opacity="0.3" stroke="none"/>
  `;

  // Snout
  const snout = `
    <path d="M50,16 Q50,12 56,10 Q60,10 60,14" fill="${primaryColor}" stroke="${dark}" stroke-width="1"/>
  `;

  // Dorsal fin ridge
  const fin = `
    <path d="M62,28 Q68,32 66,38 Q64,42 58,42" fill="${light}" opacity="0.6" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Crown spikes
  const crown = `
    <line x1="48" y1="16" x2="46" y2="10" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="52" y1="14" x2="52" y2="8" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="56" y1="16" x2="58" y2="10" stroke="${dark}" stroke-width="1.5" stroke-linecap="round"/>
  `;

  // Seahorse has one visible eye (side view)
  const eye = `
    <circle cx="56" cy="24" r="4" fill="white"/>
    <circle cx="56" cy="${expression === 'happy' ? 25 : 24}" r="${expression === 'surprised' ? 1.5 : 2.2}" fill="${eyeColor}"/>
    ${expression === 'happy' ? `<circle cx="55" cy="23" r="1" fill="white"/>` : ''}
    ${expression === 'grumpy' ? `<line x1="53" y1="20" x2="59" y2="22" stroke="${eyeColor}" stroke-width="1.2"/>` : ''}
  `;

  const mouth = generateMouth(expression, dark, 58, 12);
  const pat = generatePattern(primaryColor, 50, 44, 14, 28, pattern);

  return body + belly + snout + fin + crown + pat + eye + mouth;
}

function generatePufferfish(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Perfect circle body
  const body = `
    <circle cx="50" cy="50" r="28" fill="${primaryColor}"/>
    <circle cx="50" cy="56" r="18" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Radiating spikes (trig loop - 16 spikes)
  let spikes = '';
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16;
    const x1 = 50 + Math.cos(angle) * 28;
    const y1 = 50 + Math.sin(angle) * 28;
    const x2 = 50 + Math.cos(angle) * 34;
    const y2 = 50 + Math.sin(angle) * 34;
    spikes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${dark}" stroke-width="2" stroke-linecap="round"/>`;
  }

  // Small tail fin
  const tail = `
    <path d="M22,50 L12,42 L14,50 L12,58 Z" fill="${dark}" opacity="0.7"/>
  `;

  // Small pectoral fins
  const fins = `
    <ellipse cx="38" cy="62" rx="5" ry="3" fill="${dark}" opacity="0.5" transform="rotate(-20, 38, 62)"/>
    <ellipse cx="62" cy="62" rx="5" ry="3" fill="${dark}" opacity="0.5" transform="rotate(20, 62, 62)"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 40, 44, 60, 44, 5.5);
  const mouth = generateMouth(expression, dark, 50, 58);
  const pat = generatePattern(primaryColor, 50, 50, 28, 28, pattern);

  return spikes + tail + body + fins + pat + eyes + mouth;
}

function generateTurtle(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression } = params;
  const shellDark = darkenColor(primaryColor, 15);

  // Shell (dome)
  const shell = `
    <ellipse cx="50" cy="52" rx="30" ry="24" fill="${primaryColor}"/>
  `;

  // Hexagonal shell pattern (built-in, ignores pattern param)
  const shellPattern = `
    <path d="M50,32 L65,40 L65,56 L50,64 L35,56 L35,40 Z" fill="none" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="50" y1="32" x2="50" y2="28" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="65" y1="40" x2="74" y2="36" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="65" y1="56" x2="74" y2="60" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="50" y1="64" x2="50" y2="70" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="35" y1="56" x2="26" y2="60" stroke="${shellDark}" stroke-width="1.5"/>
    <line x1="35" y1="40" x2="26" y2="36" stroke="${shellDark}" stroke-width="1.5"/>
  `;

  // Head peeking out
  const head = `
    <ellipse cx="50" cy="28" rx="10" ry="8" fill="${secondaryColor}"/>
  `;

  // Legs peeking out
  const legs = `
    <ellipse cx="26" cy="46" rx="6" ry="4" fill="${secondaryColor}" transform="rotate(-30, 26, 46)"/>
    <ellipse cx="74" cy="46" rx="6" ry="4" fill="${secondaryColor}" transform="rotate(30, 74, 46)"/>
    <ellipse cx="28" cy="64" rx="6" ry="4" fill="${secondaryColor}" transform="rotate(20, 28, 64)"/>
    <ellipse cx="72" cy="64" rx="6" ry="4" fill="${secondaryColor}" transform="rotate(-20, 72, 64)"/>
  `;

  // Small tail
  const tail = `
    <path d="M50,76 L50,82 L48,80" fill="${secondaryColor}"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 46, 26, 54, 26, 3);
  const mouth = generateMouth(expression, darkenColor(secondaryColor, 40), 50, 33);

  return legs + tail + shell + shellPattern + head + eyes + mouth;
}

function generateShark(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Elongated body
  const body = `
    <path d="M15,50 Q10,44 20,40 Q35,32 60,34 Q80,36 88,50 Q80,64 60,66 Q35,68 20,60 Q10,56 15,50 Z" fill="${primaryColor}"/>
  `;

  // Belly (counter-shaded)
  const belly = `
    <path d="M20,54 Q35,62 60,62 Q78,60 85,52 Q78,58 60,60 Q35,60 20,54 Z" fill="${secondaryColor}" opacity="0.5"/>
  `;

  // Prominent dorsal fin
  const dorsal = `
    <path d="M45,34 L50,14 L58,34" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Tail fin
  const tail = `
    <path d="M15,50 L4,36 L10,48 L4,62 Z" fill="${dark}"/>
  `;

  // Pectoral fin
  const pectoral = `
    <path d="M40,58 Q34,68 28,72 Q36,66 40,60" fill="${dark}" opacity="0.6"/>
  `;

  // Teeth (visible for grumpy/happy)
  const teeth = expression === 'grumpy' || expression === 'happy'
    ? `
      <path d="M78,52 L80,54 L82,52 L84,54 L86,52" stroke="white" stroke-width="1" fill="none"/>
    `
    : '';

  // Gill slits
  const gills = `
    <line x1="65" y1="44" x2="65" y2="50" stroke="${dark}" stroke-width="1" opacity="0.4"/>
    <line x1="68" y1="44" x2="68" y2="50" stroke="${dark}" stroke-width="1" opacity="0.4"/>
    <line x1="71" y1="44" x2="71" y2="50" stroke="${dark}" stroke-width="1" opacity="0.4"/>
  `;

  // Shark eye (side view)
  const eye = `
    <circle cx="76" cy="44" r="4" fill="white"/>
    <circle cx="76" cy="${expression === 'happy' ? 45 : 44}" r="${expression === 'surprised' ? 1.5 : 2.5}" fill="${eyeColor}"/>
    ${expression === 'happy' ? `<circle cx="75" cy="43" r="1" fill="white"/>` : ''}
    ${expression === 'grumpy' ? `<line x1="73" y1="40" x2="79" y2="41" stroke="${eyeColor}" stroke-width="1.5"/>` : ''}
  `;

  const mouth = generateMouth(expression, dark, 82, 52);
  const pat = generatePattern(primaryColor, 48, 48, 32, 16, pattern);

  return tail + body + belly + dorsal + pectoral + gills + pat + eye + teeth + mouth;
}

function generateStarfish(params: OceanParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // 5-point star with rounded arm tips (bezier)
  const cx = 50;
  const cy = 50;
  const outerR = 32;
  const innerR = 14;
  let starPath = 'M';

  for (let i = 0; i < 5; i++) {
    // Outer point
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const ox = cx + Math.cos(outerAngle) * outerR;
    const oy = cy + Math.sin(outerAngle) * outerR;

    // Inner point (between outer points)
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const ix = cx + Math.cos(innerAngle) * innerR;
    const iy = cy + Math.sin(innerAngle) * innerR;

    // Control points for rounded tips
    const prevInnerAngle = ((i * 72 - 36) - 90) * (Math.PI / 180);
    const pix = cx + Math.cos(prevInnerAngle) * innerR;
    const piy = cy + Math.sin(prevInnerAngle) * innerR;

    if (i === 0) {
      starPath += `${pix.toFixed(1)},${piy.toFixed(1)} `;
    }
    starPath += `Q${ox.toFixed(1)},${oy.toFixed(1)} ${ix.toFixed(1)},${iy.toFixed(1)} `;
  }
  starPath += 'Z';

  const star = `<path d="${starPath}" fill="${primaryColor}"/>`;

  // Central disc
  const disc = `
    <circle cx="${cx}" cy="${cy}" r="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Bumps on arms
  const bumps = `
    <circle cx="50" cy="22" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="50" cy="26" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="76" cy="42" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="73" cy="44" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="66" cy="72" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="63" cy="70" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="34" cy="72" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="37" cy="70" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="24" cy="42" r="1.5" fill="${dark}" opacity="0.4"/>
    <circle cx="27" cy="44" r="1.5" fill="${dark}" opacity="0.4"/>
  `;

  const eyes = generateEyes(expression, eyeColor, 46, 46, 54, 46, 3.5);
  const mouth = generateMouth(expression, dark, 50, 54);
  const pat = generatePattern(primaryColor, cx, cy, 20, 20, pattern);

  return star + disc + bumps + pat + eyes + mouth;
}

export function generate(params: OceanParams): string {
  const { backgroundShape, creatureType, backgroundColor } = params;

  let creature: string;
  switch (creatureType) {
    case 'octopus':
      creature = generateOctopus(params);
      break;
    case 'fish':
      creature = generateFish(params);
      break;
    case 'jellyfish':
      creature = generateJellyfish(params);
      break;
    case 'crab':
      creature = generateCrab(params);
      break;
    case 'whale':
      creature = generateWhale(params);
      break;
    case 'seahorse':
      creature = generateSeahorse(params);
      break;
    case 'pufferfish':
      creature = generatePufferfish(params);
      break;
    case 'turtle':
      creature = generateTurtle(params);
      break;
    case 'shark':
      creature = generateShark(params);
      break;
    case 'starfish':
      creature = generateStarfish(params);
      break;
    default:
      creature = generateOctopus(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): OceanParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const creatureTypes = ['octopus', 'fish', 'jellyfish', 'crab', 'whale', 'seahorse', 'pufferfish', 'turtle', 'shark', 'starfish'] as const;
  const expressions = ['happy', 'neutral', 'surprised', 'grumpy'] as const;
  const patterns = ['none', 'spots', 'stripes', 'scales'] as const;

  const primaryColors = [
    '#3498db', '#2980b9', '#1abc9c', '#16a085',
    '#e74c3c', '#e67e22', '#f39c12', '#9b59b6',
    '#2ecc71', '#27ae60', '#00bcd4', '#0097a7',
    '#ff7043', '#ff5252', '#7e57c2', '#26c6da',
  ];

  const secondaryColors = [
    '#ecf0f1', '#ffffff', '#fdf2e9', '#fef9e7',
    '#eaf2f8', '#e8f8f5', '#f5eef8', '#fdebd0',
  ];

  const backgroundColors = [
    '#1a5276', '#154360', '#0e3d5c', '#1b4f72',
    '#0b3d6e', '#163a5f', '#0a2e4d', '#1c3f60',
    '#0d4f6e', '#103d55', '#0c2d48', '#12394f',
  ];

  const eyeColors = [
    '#2c3e50', '#ffffff', '#f1c40f', '#27ae60', '#1a3c6e',
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
  };
}

export const ocean: Theme<typeof schema> = {
  name: 'Ocean',
  schema,
  shapeParam: 'creatureType',
  generate,
  randomize,
};
