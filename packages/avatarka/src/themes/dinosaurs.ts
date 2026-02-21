import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  dinosaurType: {
    type: 'select',
    default: 'trex',
    options: [
      'trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'pterodactyl',
      'ankylosaurus', 'velociraptor', 'parasaurolophus', 'spinosaurus', 'pachycephalosaurus',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#6b8e23',
  },
  secondaryColor: {
    type: 'color',
    default: '#f5e6c8',
  },
  eyeColor: {
    type: 'color',
    default: '#2c3e50',
  },
  backgroundColor: {
    type: 'color',
    default: '#8b7355',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'fierce', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'plates'],
  },
  hasPlants: {
    type: 'select',
    default: 'yes',
    options: ['yes', 'no'],
  },
} as const satisfies ParamSchema;

export type DinosaurParams = ParamsFromSchema<typeof schema>;

type Expression = DinosaurParams['expression'];

// --- Shared helpers ---

function generateDinoEyes(
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
    case 'fierce':
      return `
        <circle cx="${cx1}" cy="${cy1}" r="${s}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${s}" fill="white"/>
        <circle cx="${cx1}" cy="${cy1 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <circle cx="${cx2}" cy="${cy2 + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <line x1="${cx1 - s}" y1="${cy1 - s}" x2="${cx1 + s}" y2="${cy1 - s * 0.4}" stroke="${eyeColor}" stroke-width="2"/>
        <line x1="${cx2 + s}" y1="${cy2 - s}" x2="${cx2 - s}" y2="${cy2 - s * 0.4}" stroke="${eyeColor}" stroke-width="2"/>
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

function generateSingleDinoEye(
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
    case 'fierce':
      return `
        <circle cx="${cx}" cy="${cy}" r="${s}" fill="white"/>
        <circle cx="${cx}" cy="${cy + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <line x1="${cx - s}" y1="${cy - s}" x2="${cx + s}" y2="${cy - s * 0.4}" stroke="${eyeColor}" stroke-width="1.5"/>
      `;
    case 'surprised':
      return `
        <circle cx="${cx}" cy="${cy}" r="${s * 1.2}" fill="white"/>
        <circle cx="${cx}" cy="${cy}" r="${pupilS * 0.7}" fill="${eyeColor}"/>
        <circle cx="${cx - 1}" cy="${cy - 1}" r="${highlightS}" fill="white"/>
      `;
    case 'sleepy':
      return `
        <circle cx="${cx}" cy="${cy}" r="${s}" fill="white"/>
        <circle cx="${cx}" cy="${cy + 1}" r="${pupilS}" fill="${eyeColor}"/>
        <path d="M${cx - s},${cy - s * 0.3} Q${cx},${cy - s * 0.8} ${cx + s},${cy - s * 0.3}" fill="white" stroke="none"/>
      `;
    default:
      return '';
  }
}

function generateDinoMouth(
  expression: Expression,
  color: string,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `<path d="M${cx - 6},${cy} Q${cx},${cy + 6} ${cx + 6},${cy}" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
    case 'fierce':
      return `
        <path d="M${cx - 7},${cy} Q${cx},${cy + 4} ${cx + 7},${cy}" fill="${color}"/>
        <polygon points="${cx - 4},${cy} ${cx - 3},${cy + 3} ${cx - 2},${cy}" fill="white"/>
        <polygon points="${cx - 1},${cy} ${cx},${cy + 3} ${cx + 1},${cy}" fill="white"/>
        <polygon points="${cx + 2},${cy} ${cx + 3},${cy + 3} ${cx + 4},${cy}" fill="white"/>
      `;
    case 'surprised':
      return `<ellipse cx="${cx}" cy="${cy}" rx="3" ry="4" fill="${color}"/>`;
    case 'sleepy':
      return `<line x1="${cx - 4}" y1="${cy}" x2="${cx + 4}" y2="${cy}" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>`;
    default:
      return '';
  }
}

function generateDinoPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: DinosaurParams['pattern']
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
    case 'plates': {
      const patternId = `dino-plates-${cx}-${cy}`;
      return `
        <defs>
          <pattern id="${patternId}" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0,8 L4,2 L8,8" fill="${dark}" opacity="0.2"/>
          </pattern>
        </defs>
        <ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.85}" ry="${ry * 0.85}" fill="url(#${patternId})"/>
      `;
    }
    default:
      return '';
  }
}

function generatePlants(): string {
  return `
    <g opacity="0.3">
      <path d="M8,92 Q10,82 6,75" stroke="#2d5016" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="5" cy="76" rx="3" ry="2" fill="#4a7c28" transform="rotate(-30, 5, 76)"/>
      <ellipse cx="8" cy="80" rx="3" ry="2" fill="#4a7c28" transform="rotate(20, 8, 80)"/>
      <ellipse cx="6" cy="84" rx="2.5" ry="1.8" fill="#3d6b22" transform="rotate(-15, 6, 84)"/>
      <path d="M92,92 Q90,82 94,75" stroke="#2d5016" stroke-width="1.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="95" cy="76" rx="3" ry="2" fill="#4a7c28" transform="rotate(30, 95, 76)"/>
      <ellipse cx="92" cy="80" rx="3" ry="2" fill="#4a7c28" transform="rotate(-20, 92, 80)"/>
      <ellipse cx="94" cy="84" rx="2.5" ry="1.8" fill="#3d6b22" transform="rotate(15, 94, 84)"/>
      <ellipse cx="85" cy="12" rx="4" ry="2" fill="#4a7c28" opacity="0.7" transform="rotate(-40, 85, 12)"/>
    </g>
  `;
}

// --- Dinosaur generators ---

function generateTrex(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Body
  const body = `
    <ellipse cx="50" cy="62" rx="16" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="66" rx="10" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head (oversized for chibi look)
  const head = `
    <ellipse cx="50" cy="34" rx="20" ry="17" fill="${primaryColor}"/>
    <ellipse cx="50" cy="30" rx="16" ry="10" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  // Jaw
  const jaw = `
    <ellipse cx="50" cy="42" rx="14" ry="6" fill="${dark}" opacity="0.15"/>
  `;

  // Tiny arms
  const arms = `
    <path d="M38,56 Q34,58 33,62" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M62,56 Q66,58 67,62" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  // Stubby legs
  const legs = `
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${dark}"/>
  `;

  // Short tail
  const tail = `
    <path d="M50,78 Q36,82 28,76 Q24,73 26,70" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
  `;

  // Nostrils
  const nostrils = `
    <circle cx="45" cy="40" r="1" fill="${dark}"/>
    <circle cx="55" cy="40" r="1" fill="${dark}"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 42, 30, 58, 30, 5);
  const mouth = generateDinoMouth(expression, dark, 50, 46);
  const pat = generateDinoPattern(primaryColor, 50, 34, 20, 17, pattern);

  return tail + legs + body + arms + head + jaw + pat + nostrils + eyes + mouth;
}

function generateTriceratops(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // Frill (decorative crown behind head)
  const frill = `
    <path d="M14,38 Q12,22 24,14 Q34,8 50,6 Q66,8 76,14 Q88,22 86,38 Z" fill="${light}" stroke="${dark}" stroke-width="1.5"/>
    <circle cx="26" cy="20" r="3" fill="${dark}" opacity="0.2"/>
    <circle cx="50" cy="14" r="3" fill="${dark}" opacity="0.2"/>
    <circle cx="74" cy="20" r="3" fill="${dark}" opacity="0.2"/>
  `;

  // Head
  const head = `
    <ellipse cx="50" cy="46" rx="22" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="52" rx="14" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Horns (two above eyes, one on nose)
  const horns = `
    <polygon points="38,34 36,18 40,32" fill="${light}" stroke="${dark}" stroke-width="0.5"/>
    <polygon points="62,34 64,18 60,32" fill="${light}" stroke="${dark}" stroke-width="0.5"/>
    <polygon points="50,54 50,48 52,53" fill="${light}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Partial body below
  const body = `
    <ellipse cx="50" cy="72" rx="18" ry="14" fill="${primaryColor}"/>
    <ellipse cx="50" cy="76" rx="12" ry="8" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Stubby legs
  const legs = `
    <rect x="34" y="80" width="8" height="10" rx="3" fill="${dark}"/>
    <rect x="58" y="80" width="8" height="10" rx="3" fill="${dark}"/>
  `;

  // Beak-like snout
  const beak = `
    <path d="M42,58 Q50,64 58,58" fill="${dark}" opacity="0.15"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 40, 40, 60, 40, 5);
  const mouth = generateDinoMouth(expression, dark, 50, 60);
  const pat = generateDinoPattern(primaryColor, 50, 46, 22, 20, pattern);

  return legs + body + frill + head + beak + pat + horns + eyes + mouth;
}

function generateStegosaurus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 25);

  // Body (side view, humped back)
  const body = `
    <ellipse cx="48" cy="58" rx="30" ry="16" fill="${primaryColor}"/>
    <ellipse cx="48" cy="64" rx="22" ry="8" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Small head held low
  const head = `
    <ellipse cx="82" cy="56" rx="10" ry="8" fill="${primaryColor}"/>
    <ellipse cx="85" cy="58" rx="5" ry="4" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Neck connecting body to head
  const neck = `
    <path d="M72,52 Q78,50 82,52" fill="${primaryColor}" stroke="${primaryColor}" stroke-width="10"/>
  `;

  // Back plates (diamond shapes along spine)
  const plates = `
    <polygon points="30,42 34,28 38,42" fill="${light}" stroke="${dark}" stroke-width="1"/>
    <polygon points="38,42 43,24 48,42" fill="${light}" stroke="${dark}" stroke-width="1"/>
    <polygon points="46,42 52,26 58,42" fill="${light}" stroke="${dark}" stroke-width="1"/>
    <polygon points="54,42 59,30 64,42" fill="${light}" stroke="${dark}" stroke-width="1"/>
    <polygon points="62,44 66,34 70,44" fill="${light}" stroke="${dark}" stroke-width="1"/>
  `;

  // Tail with thagomizer spikes
  const tail = `
    <path d="M18,58 Q8,56 4,52" stroke="${primaryColor}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <line x1="6" y1="52" x2="2" y2="44" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="8" y1="54" x2="2" y2="50" stroke="${dark}" stroke-width="2.5" stroke-linecap="round"/>
  `;

  // Stubby legs
  const legs = `
    <rect x="32" y="70" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="42" y="70" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="58" y="70" width="7" height="10" rx="3" fill="${dark}"/>
    <rect x="68" y="70" width="7" height="10" rx="3" fill="${dark}"/>
  `;

  // Single eye (side view)
  const eye = generateSingleDinoEye(expression, eyeColor, 85, 54, 3.5);
  const mouth = generateDinoMouth(expression, dark, 90, 60);
  const pat = generateDinoPattern(primaryColor, 48, 58, 30, 16, pattern);

  return tail + legs + body + neck + head + plates + pat + eye + mouth;
}

function generateBrachiosaurus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Large round body (sits low)
  const body = `
    <ellipse cx="52" cy="72" rx="24" ry="18" fill="${primaryColor}"/>
    <ellipse cx="52" cy="78" rx="16" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Long neck (S-curve rising from body)
  const neck = `
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${primaryColor}" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M60,58 Q62,40 56,26 Q52,18 48,14" stroke="${lightenColor(primaryColor, 10)}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
  `;

  // Tiny head at top
  const head = `
    <ellipse cx="46" cy="12" rx="10" ry="7" fill="${primaryColor}"/>
    <ellipse cx="44" cy="14" rx="6" ry="4" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Nostrils on top of head
  const nostrils = `
    <circle cx="42" cy="8" r="1.2" fill="${dark}"/>
    <circle cx="48" cy="8" r="1.2" fill="${dark}"/>
  `;

  // Column-like legs
  const legs = `
    <rect x="34" y="84" width="9" height="14" rx="4" fill="${dark}"/>
    <rect x="48" y="84" width="9" height="14" rx="4" fill="${dark}"/>
    <rect x="62" y="84" width="9" height="14" rx="4" fill="${dark}"/>
  `;

  // Short tail
  const tail = `
    <path d="M30,68 Q20,64 14,68" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 42, 11, 52, 11, 3);
  const mouth = generateDinoMouth(expression, dark, 46, 17);
  const pat = generateDinoPattern(primaryColor, 52, 72, 24, 18, pattern);

  return tail + legs + body + neck + head + pat + nostrils + eyes + mouth;
}

function generatePterodactyl(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // Wings spread wide
  const wings = `
    <path d="M50,44 L8,30 L12,48 L26,46 L38,48 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M50,44 L92,30 L88,48 L74,46 L62,48 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M50,44 L8,30 L12,48" fill="${light}" opacity="0.2"/>
    <path d="M50,44 L92,30 L88,48" fill="${light}" opacity="0.2"/>
  `;

  // Wing membrane lines
  const membrane = `
    <line x1="50" y1="44" x2="16" y2="36" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="24" y2="40" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="84" y2="36" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="44" x2="76" y2="40" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
  `;

  // Small body
  const body = `
    <ellipse cx="50" cy="52" rx="10" ry="12" fill="${primaryColor}"/>
    <ellipse cx="50" cy="56" rx="6" ry="6" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head with crest
  const head = `
    <ellipse cx="50" cy="32" rx="8" ry="7" fill="${primaryColor}"/>
  `;

  // Pointed crest trailing backward
  const crest = `
    <path d="M52,26 Q58,20 66,18 Q60,24 54,28" fill="${light}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Small beak
  const beak = `
    <polygon points="50,36 46,39 50,38 54,39" fill="${dark}"/>
  `;

  // Tiny dangling feet
  const feet = `
    <path d="M46,64 L44,72 L42,71 L44,72 L46,71" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M54,64 L56,72 L58,71 L56,72 L54,71" stroke="${dark}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 46, 30, 54, 30, 3.5);
  const mouth = generateDinoMouth(expression, dark, 50, 38);
  const pat = generateDinoPattern(primaryColor, 50, 52, 10, 12, pattern);

  return wings + membrane + feet + body + head + crest + beak + pat + eyes + mouth;
}

function generateAnkylosaurus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);

  // Wide armored body (side view)
  const body = `
    <ellipse cx="50" cy="52" rx="32" ry="18" fill="${primaryColor}"/>
    <ellipse cx="50" cy="60" rx="22" ry="8" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Armor bumps across back
  const armor = `
    <circle cx="34" cy="40" r="3" fill="${dark}" opacity="0.3"/>
    <circle cx="44" cy="38" r="3.5" fill="${dark}" opacity="0.3"/>
    <circle cx="55" cy="38" r="3.5" fill="${dark}" opacity="0.3"/>
    <circle cx="65" cy="40" r="3" fill="${dark}" opacity="0.3"/>
    <circle cx="38" cy="48" r="2.5" fill="${dark}" opacity="0.25"/>
    <circle cx="50" cy="46" r="3" fill="${dark}" opacity="0.25"/>
    <circle cx="62" cy="48" r="2.5" fill="${dark}" opacity="0.25"/>
  `;

  // Small head peeking from front
  const head = `
    <ellipse cx="84" cy="52" rx="10" ry="9" fill="${primaryColor}"/>
    <circle cx="86" cy="50" r="2" fill="${dark}" opacity="0.15"/>
    <circle cx="90" cy="52" r="2" fill="${dark}" opacity="0.15"/>
  `;

  // Small horn nubs on head
  const horns = `
    <circle cx="80" cy="44" r="2" fill="${dark}" opacity="0.4"/>
    <circle cx="88" cy="44" r="2" fill="${dark}" opacity="0.4"/>
  `;

  // Club tail
  const tail = `
    <path d="M18,52 Q10,52 6,50" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <ellipse cx="4" cy="50" rx="5" ry="4" fill="${dark}"/>
  `;

  // Very short, wide legs
  const legs = `
    <rect x="30" y="66" width="9" height="10" rx="3" fill="${dark}"/>
    <rect x="44" y="66" width="9" height="10" rx="3" fill="${dark}"/>
    <rect x="58" y="66" width="9" height="10" rx="3" fill="${dark}"/>
    <rect x="70" y="66" width="9" height="10" rx="3" fill="${dark}"/>
  `;

  // Single eye (side view)
  const eye = generateSingleDinoEye(expression, eyeColor, 88, 50, 3.5);
  const mouth = generateDinoMouth(expression, dark, 92, 56);
  const pat = generateDinoPattern(primaryColor, 50, 52, 32, 18, pattern);

  return tail + legs + body + armor + pat + head + horns + eye + mouth;
}

function generateVelociraptor(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // Sleek body (side view, horizontal)
  const body = `
    <ellipse cx="46" cy="52" rx="20" ry="14" fill="${primaryColor}"/>
    <ellipse cx="46" cy="58" rx="12" ry="6" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head (narrower, forward-pointing)
  const head = `
    <ellipse cx="74" cy="38" rx="12" ry="9" fill="${primaryColor}"/>
    <ellipse cx="78" cy="40" rx="6" ry="5" fill="${secondaryColor}" opacity="0.2"/>
  `;

  // Curved neck
  const neck = `
    <path d="M62,46 Q68,42 72,40" stroke="${primaryColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `;

  // Snout detail
  const snout = `
    <circle cx="82" cy="36" r="1" fill="${dark}"/>
  `;

  // Small feathered arms
  const arms = `
    <path d="M56,48 Q60,52 58,56" stroke="${primaryColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M58,54 L56,56 L60,56 L58,54" fill="${light}" opacity="0.6"/>
  `;

  // Bent legs in running pose with killer claw
  const legs = `
    <path d="M40,62 L36,72 L32,80" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M32,80 L28,78" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M36,72 L33,68" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M52,62 L50,72 L46,80" stroke="${dark}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M46,80 L42,78" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M50,72 L47,68" stroke="${dark}" stroke-width="2" fill="none" stroke-linecap="round"/>
  `;

  // Long tail for balance
  const tail = `
    <path d="M26,52 Q14,48 6,44 Q2,42 4,40" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `;

  // Feather tufts on tail tip and arms
  const feathers = `
    <path d="M4,40 L2,36 L6,38 L4,34 L8,38" fill="${light}" opacity="0.5"/>
  `;

  // Single eye (side view)
  const eye = generateSingleDinoEye(expression, eyeColor, 78, 36, 4);
  const mouth = generateDinoMouth(expression, dark, 84, 42);
  const pat = generateDinoPattern(primaryColor, 46, 52, 20, 14, pattern);

  return tail + feathers + legs + body + arms + neck + head + snout + pat + eye + mouth;
}

function generateParasaurolophus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 15);

  // Body (front-facing, upright)
  const body = `
    <ellipse cx="50" cy="66" rx="18" ry="20" fill="${primaryColor}"/>
    <ellipse cx="50" cy="72" rx="12" ry="12" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Head with duck-bill
  const head = `
    <ellipse cx="50" cy="38" rx="16" ry="14" fill="${primaryColor}"/>
  `;

  // Tubular crest sweeping backward
  const crest = `
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${light}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M54,28 Q58,20 66,12 Q70,8 72,10" stroke="${dark}" stroke-width="1" fill="none" opacity="0.3"/>
  `;

  // Wide duck-bill mouth area
  const bill = `
    <ellipse cx="50" cy="48" rx="12" ry="5" fill="${light}" opacity="0.3"/>
  `;

  // Legs
  const legs = `
    <rect x="38" y="82" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="54" y="82" width="8" height="12" rx="3" fill="${dark}"/>
  `;

  // Short tail (visible behind body)
  const tail = `
    <path d="M36,72 Q28,76 22,74" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `;

  // Small arms
  const arms = `
    <path d="M34,60 Q30,64 28,68" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M66,60 Q70,64 72,68" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 43, 34, 57, 34, 4.5);
  const mouth = generateDinoMouth(expression, dark, 50, 50);
  const pat = generateDinoPattern(primaryColor, 50, 38, 16, 14, pattern);

  return tail + legs + body + arms + head + crest + bill + pat + eyes + mouth;
}

function generateSpinosaurus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 25);

  // Elongated body (side view)
  const body = `
    <ellipse cx="48" cy="58" rx="28" ry="14" fill="${primaryColor}"/>
    <ellipse cx="48" cy="64" rx="20" ry="6" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Tall dorsal sail
  const sail = `
    <path d="M28,44 Q32,16 42,12 Q50,10 58,14 Q66,18 70,44" fill="${light}" stroke="${dark}" stroke-width="1"/>
    <line x1="36" y1="18" x2="38" y2="44" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="50" y1="12" x2="50" y2="44" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
    <line x1="62" y1="20" x2="60" y2="44" stroke="${dark}" stroke-width="0.5" opacity="0.3"/>
  `;

  // Crocodilian head (elongated snout)
  const head = `
    <ellipse cx="82" cy="52" rx="14" ry="8" fill="${primaryColor}"/>
    <ellipse cx="90" cy="54" rx="6" ry="4" fill="${dark}" opacity="0.1"/>
  `;

  // Neck
  const neck = `
    <path d="M72,52 Q76,50 80,50" stroke="${primaryColor}" stroke-width="10" fill="none" stroke-linecap="round"/>
  `;

  // Nostrils at snout tip
  const nostrils = `
    <circle cx="92" cy="50" r="1" fill="${dark}"/>
  `;

  // Legs
  const legs = `
    <rect x="32" y="68" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="44" y="68" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="56" y="68" width="7" height="10" rx="3" fill="${dark}"/>
    <rect x="66" y="68" width="7" height="10" rx="3" fill="${dark}"/>
  `;

  // Tail
  const tail = `
    <path d="M20,58 Q10,56 4,54" stroke="${primaryColor}" stroke-width="7" fill="none" stroke-linecap="round"/>
  `;

  // Single eye (side view)
  const eye = generateSingleDinoEye(expression, eyeColor, 86, 50, 3.5);
  const mouth = generateDinoMouth(expression, dark, 94, 56);
  const pat = generateDinoPattern(primaryColor, 48, 58, 28, 14, pattern);

  return tail + legs + body + sail + neck + head + pat + nostrils + eye + mouth;
}

function generatePachycephalosaurus(params: DinosaurParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 25);
  const light = lightenColor(primaryColor, 20);

  // Dome head (oversized helmet)
  const dome = `
    <ellipse cx="50" cy="24" rx="18" ry="14" fill="${light}"/>
    <ellipse cx="50" cy="22" rx="14" ry="10" fill="${lightenColor(primaryColor, 35)}" opacity="0.3"/>
  `;

  // Bumpy ring around dome
  const bumps = `
    <circle cx="34" cy="30" r="2" fill="${dark}" opacity="0.3"/>
    <circle cx="38" cy="26" r="2" fill="${dark}" opacity="0.3"/>
    <circle cx="44" cy="24" r="1.5" fill="${dark}" opacity="0.3"/>
    <circle cx="56" cy="24" r="1.5" fill="${dark}" opacity="0.3"/>
    <circle cx="62" cy="26" r="2" fill="${dark}" opacity="0.3"/>
    <circle cx="66" cy="30" r="2" fill="${dark}" opacity="0.3"/>
  `;

  // Face area below dome
  const face = `
    <ellipse cx="50" cy="40" rx="14" ry="10" fill="${primaryColor}"/>
  `;

  // Body (upright, bipedal)
  const body = `
    <ellipse cx="50" cy="62" rx="16" ry="18" fill="${primaryColor}"/>
    <ellipse cx="50" cy="66" rx="10" ry="10" fill="${secondaryColor}" opacity="0.3"/>
  `;

  // Small arms (T-Rex style)
  const arms = `
    <path d="M36,56 Q32,60 30,64" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M64,56 Q68,60 70,64" stroke="${primaryColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
  `;

  // Legs
  const legs = `
    <rect x="38" y="76" width="8" height="12" rx="3" fill="${dark}"/>
    <rect x="54" y="76" width="8" height="12" rx="3" fill="${dark}"/>
  `;

  // Tail
  const tail = `
    <path d="M42,74 Q32,80 24,78 Q20,76 22,72" stroke="${primaryColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
  `;

  const eyes = generateDinoEyes(expression, eyeColor, 44, 38, 56, 38, 4);
  const mouth = generateDinoMouth(expression, dark, 50, 48);
  const pat = generateDinoPattern(primaryColor, 50, 62, 16, 18, pattern);

  return tail + legs + body + arms + face + dome + bumps + pat + eyes + mouth;
}

// Scale factors per dinosaur type
const dinoScaleFactors: Record<string, number> = {
  trex: 0.82,
  triceratops: 0.75,
  stegosaurus: 0.78,
  brachiosaurus: 0.72,
  pterodactyl: 0.70,
  ankylosaurus: 0.75,
  velociraptor: 0.78,
  parasaurolophus: 0.76,
  spinosaurus: 0.74,
  pachycephalosaurus: 0.80,
};

export function generate(params: DinosaurParams): string {
  const { backgroundShape, dinosaurType, backgroundColor, hasPlants } = params;

  let creature: string;
  switch (dinosaurType) {
    case 'trex':
      creature = generateTrex(params);
      break;
    case 'triceratops':
      creature = generateTriceratops(params);
      break;
    case 'stegosaurus':
      creature = generateStegosaurus(params);
      break;
    case 'brachiosaurus':
      creature = generateBrachiosaurus(params);
      break;
    case 'pterodactyl':
      creature = generatePterodactyl(params);
      break;
    case 'ankylosaurus':
      creature = generateAnkylosaurus(params);
      break;
    case 'velociraptor':
      creature = generateVelociraptor(params);
      break;
    case 'parasaurolophus':
      creature = generateParasaurolophus(params);
      break;
    case 'spinosaurus':
      creature = generateSpinosaurus(params);
      break;
    case 'pachycephalosaurus':
      creature = generatePachycephalosaurus(params);
      break;
    default:
      creature = generateTrex(params);
  }

  const scale = dinoScaleFactors[dinosaurType] ?? 0.78;
  const scaledCreature = `<g transform="translate(50, 50) scale(${scale}) translate(-50, -50)">${creature}</g>`;

  const plants = hasPlants === 'yes' ? generatePlants() : '';

  return wrapSvgWithShape(scaledCreature + plants, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): DinosaurParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const dinosaurTypes = [
    'trex', 'triceratops', 'stegosaurus', 'brachiosaurus', 'pterodactyl',
    'ankylosaurus', 'velociraptor', 'parasaurolophus', 'spinosaurus', 'pachycephalosaurus',
  ] as const;
  const expressions = ['happy', 'fierce', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'spots', 'stripes', 'plates'] as const;
  const plantOptions = ['yes', 'no'] as const;

  const primaryColors = [
    '#6b8e23', '#556b2f', '#8fbc8f', '#228b22',
    '#cd853f', '#8b6914', '#a0522d', '#b8860b',
    '#708090', '#4682b4', '#6a5acd', '#9370db',
    '#c75b39', '#d4a574', '#7b6843', '#9caf88',
  ];

  const secondaryColors = [
    '#f5e6c8', '#fdf2e9', '#fef9e7', '#e8f5e9',
    '#fff8e1', '#ffffff', '#f0e68c', '#ffe4c4',
  ];

  const backgroundColors = [
    '#8b7355', '#6b4226', '#556b2f', '#2e4a1e',
    '#8b4513', '#a0785a', '#5c4033', '#3e6b48',
    '#7a6652', '#4a6741', '#9e8c6c', '#6e5c3b',
  ];

  const eyeColors = [
    '#2c3e50', '#f1c40f', '#e67e22', '#27ae60', '#c0392b',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    dinosaurType: randomPick(dinosaurTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
    hasPlants: randomPick(plantOptions, rng),
  };
}

export const dinosaurs: Theme<typeof schema> = {
  name: 'Dinosaurs',
  schema,
  shapeParam: 'dinosaurType',
  generate,
  randomize,
};
