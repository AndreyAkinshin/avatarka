import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  gemType: {
    type: 'select',
    default: 'diamond',
    options: [
      'diamond', 'ruby', 'emerald', 'sapphire', 'amethyst',
      'opal', 'topaz', 'pearl', 'crystal', 'geode',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#B3E5FC',
  },
  secondaryColor: {
    type: 'color',
    default: '#E1F5FE',
  },
  facetColor: {
    type: 'color',
    default: '#FFFFFF',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    default: '#1A237E',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'dazzled', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'facets', 'inclusions', 'shimmer'],
  },
} as const satisfies ParamSchema;

export type GemsParams = ParamsFromSchema<typeof schema>;

type Expression = GemsParams['expression'];

// --- Shared helpers ---

function generateGemEyes(
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
    case 'dazzled':
      // Star-shaped eyes for a gem-struck look
      return `
        <g fill="${eyeColor}">
          <path d="M${cx1},${cy1 - s} L${cx1 + s * 0.35},${cy1 - s * 0.35} L${cx1 + s},${cy1} L${cx1 + s * 0.35},${cy1 + s * 0.35} L${cx1},${cy1 + s} L${cx1 - s * 0.35},${cy1 + s * 0.35} L${cx1 - s},${cy1} L${cx1 - s * 0.35},${cy1 - s * 0.35} Z"/>
          <path d="M${cx2},${cy2 - s} L${cx2 + s * 0.35},${cy2 - s * 0.35} L${cx2 + s},${cy2} L${cx2 + s * 0.35},${cy2 + s * 0.35} L${cx2},${cy2 + s} L${cx2 - s * 0.35},${cy2 + s * 0.35} L${cx2 - s},${cy2} L${cx2 - s * 0.35},${cy2 - s * 0.35} Z"/>
        </g>
        <circle cx="${cx1}" cy="${cy1}" r="${highlightS}" fill="white"/>
        <circle cx="${cx2}" cy="${cy2}" r="${highlightS}" fill="white"/>
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

function generateGemMouth(
  expression: Expression,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 4} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;
    case 'dazzled':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 5} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="${cx}" cy="${cy + 3}" rx="1.5" ry="2" fill="#E57373" opacity="0.7"/>
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

function generateGemPattern(
  facetColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: GemsParams['pattern']
): string {
  switch (pattern) {
    case 'facets':
      return `
        <g opacity="0.2" stroke="${facetColor}" stroke-width="0.8" fill="none" stroke-linecap="round">
          <line x1="${cx}" y1="${cy - ry * 0.4}" x2="${cx - rx * 0.3}" y2="${cy + ry * 0.2}"/>
          <line x1="${cx}" y1="${cy - ry * 0.4}" x2="${cx + rx * 0.3}" y2="${cy + ry * 0.2}"/>
          <line x1="${cx - rx * 0.3}" y1="${cy + ry * 0.2}" x2="${cx + rx * 0.3}" y2="${cy + ry * 0.2}"/>
          <line x1="${cx - rx * 0.5}" y1="${cy - ry * 0.1}" x2="${cx + rx * 0.5}" y2="${cy - ry * 0.1}"/>
        </g>
      `;
    case 'inclusions':
      return `
        <g opacity="0.15">
          <circle cx="${cx - rx * 0.2}" cy="${cy - ry * 0.15}" r="1.5" fill="${facetColor}"/>
          <circle cx="${cx + rx * 0.25}" cy="${cy + ry * 0.1}" r="1" fill="${facetColor}"/>
          <ellipse cx="${cx + rx * 0.1}" cy="${cy - ry * 0.25}" rx="2" ry="0.8" fill="${facetColor}" transform="rotate(30, ${cx + rx * 0.1}, ${cy - ry * 0.25})"/>
          <circle cx="${cx - rx * 0.3}" cy="${cy + ry * 0.2}" r="0.8" fill="${facetColor}"/>
        </g>
      `;
    case 'shimmer':
      return `
        <g opacity="0.12">
          <path d="M${cx - rx * 0.4},${cy - ry * 0.3} Q${cx - rx * 0.2},${cy - ry * 0.1} ${cx},${cy - ry * 0.3} Q${cx + rx * 0.2},${cy - ry * 0.5} ${cx + rx * 0.4},${cy - ry * 0.3}" stroke="${facetColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
          <path d="M${cx - rx * 0.3},${cy + ry * 0.1} Q${cx},${cy - ry * 0.05} ${cx + rx * 0.3},${cy + ry * 0.1}" stroke="${facetColor}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        </g>
      `;
    default:
      return '';
  }
}

// --- Gem generators ---

function generateDiamond(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Crown (upper trapezoid)
  const crown = `
    <polygon points="38,38 62,38 72,52 28,52" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Table (top flat face)
  const table = `
    <polygon points="42,38 58,38 54,44 46,44" fill="${lightenColor(primaryColor, 15)}" opacity="0.4"/>
  `;

  // Pavilion (inverted triangle below)
  const pavilion = `
    <polygon points="28,52 72,52 50,76" fill="${darkenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Facet lines on crown
  const facetLines = `
    <g stroke="${facetColor}" stroke-width="0.5" opacity="0.3">
      <line x1="46" y1="44" x2="28" y2="52"/>
      <line x1="54" y1="44" x2="72" y2="52"/>
      <line x1="50" y1="38" x2="50" y2="44"/>
    </g>
  `;

  // Pavilion facet lines
  const pavilionFacets = `
    <g stroke="${facetColor}" stroke-width="0.4" opacity="0.2">
      <line x1="38" y1="52" x2="50" y2="76"/>
      <line x1="62" y1="52" x2="50" y2="76"/>
      <line x1="50" y1="52" x2="50" y2="76"/>
    </g>
  `;

  // Highlight
  const highlight = `
    <polygon points="42,40 48,40 46,46 40,46" fill="${secondaryColor}" opacity="0.2"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateGemMouth(expression, 50, 54);
  const pat = generateGemPattern(facetColor, 50, 50, 20, 16, pattern);

  return crown + table + pavilion + facetLines + pavilionFacets + highlight + pat + eyes + mouth;
}

function generateRuby(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Oval cabochon body
  const body = `
    <ellipse cx="50" cy="50" rx="20" ry="18" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Inner glow highlight
  const glow = `
    <ellipse cx="50" cy="50" rx="16" ry="14" fill="${lightenColor(primaryColor, 10)}" opacity="0.15"/>
    <ellipse cx="44" cy="44" rx="8" ry="6" fill="${secondaryColor}" opacity="0.15"/>
  `;

  // Star highlight (asterism)
  const star = `
    <g stroke="${facetColor}" stroke-width="0.6" opacity="0.2" stroke-linecap="round">
      <line x1="50" y1="36" x2="50" y2="64"/>
      <line x1="36" y1="44" x2="64" y2="56"/>
      <line x1="36" y1="56" x2="64" y2="44"/>
    </g>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateGemMouth(expression, 50, 54);
  const pat = generateGemPattern(facetColor, 50, 50, 18, 16, pattern);

  return body + glow + star + pat + eyes + mouth;
}

function generateEmerald(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Emerald cut — rectangle with clipped corners
  const body = `
    <polygon points="36,34 64,34 70,40 70,60 64,66 36,66 30,60 30,40" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Step-cut facet lines (horizontal)
  const steps = `
    <g stroke="${facetColor}" stroke-width="0.5" opacity="0.2">
      <line x1="34" y1="40" x2="66" y2="40"/>
      <line x1="32" y1="46" x2="68" y2="46"/>
      <line x1="32" y1="54" x2="68" y2="54"/>
      <line x1="34" y1="60" x2="66" y2="60"/>
    </g>
  `;

  // Corner facet lines
  const corners = `
    <g stroke="${facetColor}" stroke-width="0.4" opacity="0.15">
      <line x1="36" y1="34" x2="30" y2="40"/>
      <line x1="64" y1="34" x2="70" y2="40"/>
      <line x1="36" y1="66" x2="30" y2="60"/>
      <line x1="64" y1="66" x2="70" y2="60"/>
    </g>
  `;

  // Highlight
  const highlight = `
    <rect x="34" y="36" width="12" height="8" rx="1" fill="${secondaryColor}" opacity="0.12"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateGemMouth(expression, 50, 54);
  const pat = generateGemPattern(facetColor, 50, 50, 18, 14, pattern);

  return body + steps + corners + highlight + pat + eyes + mouth;
}

function generateSapphire(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Pear/teardrop shape
  const body = `
    <path d="M50,26 Q68,36 68,56 Q68,72 50,74 Q32,72 32,56 Q32,36 50,26 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Refraction highlights
  const refraction = `
    <path d="M42,36 Q48,32 50,38 Q52,32 58,36" fill="${facetColor}" opacity="0.15"/>
    <ellipse cx="44" cy="46" rx="5" ry="8" fill="${secondaryColor}" opacity="0.1"/>
  `;

  // Facet lines
  const facetLines = `
    <g stroke="${facetColor}" stroke-width="0.4" opacity="0.2" stroke-linecap="round">
      <line x1="50" y1="28" x2="42" y2="50"/>
      <line x1="50" y1="28" x2="58" y2="50"/>
      <line x1="42" y1="50" x2="50" y2="72"/>
      <line x1="58" y1="50" x2="50" y2="72"/>
    </g>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateGemMouth(expression, 50, 56);
  const pat = generateGemPattern(facetColor, 50, 50, 16, 20, pattern);

  return body + refraction + facetLines + pat + eyes + mouth;
}

function generateAmethyst(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Cluster of hexagonal crystal prisms pointing up
  const crystals = `
    <polygon points="40,74 34,74 28,54 34,30 40,30 46,54" fill="${darkenColor(primaryColor, 12)}" stroke="${dark}" stroke-width="0.5"/>
    <polygon points="54,74 48,74 42,48 48,24 54,24 60,48" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <polygon points="66,74 60,74 54,52 60,32 66,32 72,52" fill="${darkenColor(primaryColor, 6)}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Top facets (pointed tips)
  const tips = `
    <polygon points="34,30 40,30 37,22" fill="${lightenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.4"/>
    <polygon points="48,24 54,24 51,16" fill="${lightenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.4"/>
    <polygon points="60,32 66,32 63,24" fill="${lightenColor(primaryColor, 8)}" stroke="${dark}" stroke-width="0.4"/>
  `;

  // Vertical facet lines
  const facetLines = `
    <g stroke="${facetColor}" stroke-width="0.4" opacity="0.2">
      <line x1="37" y1="30" x2="37" y2="74"/>
      <line x1="51" y1="24" x2="51" y2="74"/>
      <line x1="63" y1="32" x2="63" y2="74"/>
    </g>
  `;

  // Highlight on center crystal
  const highlight = `
    <polygon points="48,28 52,28 54,40 48,40" fill="${secondaryColor}" opacity="0.12"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 52, 56, 52, 2.5);
  const mouth = generateGemMouth(expression, 50, 58);
  const pat = generateGemPattern(facetColor, 50, 50, 18, 20, pattern);

  return crystals + tips + facetLines + highlight + pat + eyes + mouth;
}

function generateOpal(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 15);

  // Rounded cabochon stone
  const body = `
    <ellipse cx="50" cy="52" rx="22" ry="18" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Iridescent color patches (play-of-color)
  const patches = `
    <g opacity="0.2">
      <ellipse cx="40" cy="46" rx="6" ry="4" fill="#81D4FA" transform="rotate(-15, 40, 46)"/>
      <ellipse cx="56" cy="44" rx="5" ry="3.5" fill="#CE93D8" transform="rotate(20, 56, 44)"/>
      <ellipse cx="46" cy="56" rx="7" ry="4" fill="#A5D6A7" transform="rotate(10, 46, 56)"/>
      <ellipse cx="58" cy="56" rx="5" ry="3" fill="#FFE082" transform="rotate(-10, 58, 56)"/>
      <ellipse cx="42" cy="50" rx="4" ry="3" fill="#F48FB1" transform="rotate(5, 42, 50)"/>
    </g>
  `;

  // Pearlescent sheen highlight
  const sheen = `
    <ellipse cx="44" cy="44" rx="10" ry="6" fill="${secondaryColor}" opacity="0.15"/>
    <ellipse cx="42" cy="42" rx="4" ry="2.5" fill="${facetColor}" opacity="0.15"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 50, 56, 50, 2.5);
  const mouth = generateGemMouth(expression, 50, 56);
  const pat = generateGemPattern(facetColor, 50, 52, 20, 16, pattern);

  return body + patches + sheen + pat + eyes + mouth;
}

function generateTopaz(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Elongated octagon
  const body = `
    <polygon points="42,28 58,28 68,36 68,64 58,72 42,72 32,64 32,36" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Facet lines
  const facetLines = `
    <g stroke="${facetColor}" stroke-width="0.5" opacity="0.2">
      <line x1="50" y1="28" x2="50" y2="72"/>
      <line x1="32" y1="50" x2="68" y2="50"/>
      <line x1="42" y1="28" x2="32" y2="36"/>
      <line x1="58" y1="28" x2="68" y2="36"/>
      <line x1="42" y1="72" x2="32" y2="64"/>
      <line x1="58" y1="72" x2="68" y2="64"/>
    </g>
  `;

  // Central highlight
  const highlight = `
    <polygon points="44,32 56,32 62,38 62,48 56,52 44,52 38,48 38,38" fill="${secondaryColor}" opacity="0.12"/>
    <ellipse cx="46" cy="40" rx="5" ry="4" fill="${facetColor}" opacity="0.1"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateGemMouth(expression, 50, 54);
  const pat = generateGemPattern(facetColor, 50, 50, 16, 20, pattern);

  return body + facetLines + highlight + pat + eyes + mouth;
}

function generatePearl(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 12);

  // Shell base below
  const shell = `
    <path d="M24,68 Q26,58 36,54 Q50,50 64,54 Q74,58 76,68 Q50,76 24,68 Z" fill="#D7CCC8" stroke="${darkenColor('#D7CCC8', 15)}" stroke-width="0.5"/>
    <g stroke="#BCAAA4" stroke-width="0.4" opacity="0.3" fill="none" stroke-linecap="round">
      <path d="M30,66 Q50,56 70,66"/>
      <path d="M32,64 Q50,58 68,64"/>
      <path d="M36,60 Q50,56 64,60"/>
    </g>
  `;

  // Pearl sphere
  const sphere = `
    <circle cx="50" cy="42" r="20" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
  `;

  // Pearlescent sheen
  const sheen = `
    <ellipse cx="44" cy="34" rx="10" ry="8" fill="${secondaryColor}" opacity="0.2"/>
    <circle cx="42" cy="32" r="4" fill="${facetColor}" opacity="0.25"/>
    <circle cx="40" cy="30" r="1.5" fill="white" opacity="0.4"/>
  `;

  // Subtle gradient band
  const band = `
    <ellipse cx="50" cy="50" rx="18" ry="4" fill="${dark}" opacity="0.06"/>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 40, 56, 40, 2.5);
  const mouth = generateGemMouth(expression, 50, 48);
  const pat = generateGemPattern(facetColor, 50, 42, 18, 18, pattern);

  return shell + sphere + sheen + band + pat + eyes + mouth;
}

function generateCrystal(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Single hexagonal prism
  const body = `
    <polygon points="40,72 32,68 32,36 40,32 50,32 58,36 58,68 50,72" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Right face (darker for 3D effect)
  const rightFace = `
    <polygon points="50,72 58,68 58,36 50,32" fill="${darkenColor(primaryColor, 15)}" stroke="${dark}" stroke-width="0.4"/>
  `;

  // Pointed tip
  const tip = `
    <polygon points="40,32 50,32 50,20 45,18 40,20" fill="${lightenColor(primaryColor, 12)}" stroke="${dark}" stroke-width="0.5"/>
    <polygon points="50,32 58,36 56,22 50,20" fill="${primaryColor}" stroke="${dark}" stroke-width="0.4"/>
  `;

  // Vertical highlight edge
  const highlight = `
    <line x1="45" y1="20" x2="45" y2="72" stroke="${secondaryColor}" stroke-width="1.5" opacity="0.12"/>
    <polygon points="34" y1="38" width="6" height="12" fill="${facetColor}" opacity="0.08"/>
  `;

  // Edge facet lines
  const facetLines = `
    <g stroke="${facetColor}" stroke-width="0.4" opacity="0.15">
      <line x1="36" y1="40" x2="36" y2="66"/>
      <line x1="54" y1="38" x2="54" y2="68"/>
    </g>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 40, 48, 52, 48, 2.5);
  const mouth = generateGemMouth(expression, 46, 54);
  const pat = generateGemPattern(facetColor, 45, 50, 12, 18, pattern);

  return body + rightFace + tip + highlight + facetLines + pat + eyes + mouth;
}

function generateGeode(params: GemsParams): string {
  const { primaryColor, secondaryColor, facetColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);
  const rockColor = '#78909C';
  const rockDark = darkenColor(rockColor, 20);

  // Rough exterior (left half of split geode)
  const exterior = `
    <path d="M22,30 Q18,40 20,56 Q22,72 30,76 Q42,78 50,74 L50,26 Q40,24 30,26 Z" fill="${rockColor}" stroke="${rockDark}" stroke-width="0.6"/>
    <path d="M78,30 Q82,40 80,56 Q78,72 70,76 Q58,78 50,74 L50,26 Q60,24 70,26 Z" fill="${darkenColor(rockColor, 8)}" stroke="${rockDark}" stroke-width="0.6"/>
  `;

  // Rough texture dots on exterior
  const texture = `
    <g opacity="0.2">
      <circle cx="28" cy="40" r="2" fill="${rockDark}"/>
      <circle cx="24" cy="56" r="1.5" fill="${rockDark}"/>
      <circle cx="32" cy="68" r="1.8" fill="${rockDark}"/>
      <circle cx="72" cy="42" r="1.8" fill="${rockDark}"/>
      <circle cx="76" cy="58" r="1.5" fill="${rockDark}"/>
      <circle cx="68" cy="70" r="2" fill="${rockDark}"/>
    </g>
  `;

  // Crystal interior (center)
  const interior = `
    <path d="M38,32 Q50,28 62,32 L62,68 Q50,72 38,68 Z" fill="${primaryColor}" opacity="0.6"/>
  `;

  // Crystal formations inside
  const crystals = `
    <g>
      <polygon points="42,66 44,66 44,48 42,50" fill="${primaryColor}" stroke="${dark}" stroke-width="0.3"/>
      <polygon points="48,68 50,68 50,42 48,44" fill="${lightenColor(primaryColor, 10)}" stroke="${dark}" stroke-width="0.3"/>
      <polygon points="54,66 56,66 56,46 54,48" fill="${primaryColor}" stroke="${dark}" stroke-width="0.3"/>
      <polygon points="46,64 48,64 48,52 46,54" fill="${darkenColor(primaryColor, 8)}" stroke="${dark}" stroke-width="0.3"/>
      <polygon points="52,66 54,66 54,50 52,52" fill="${lightenColor(primaryColor, 6)}" stroke="${dark}" stroke-width="0.3"/>
    </g>
  `;

  // Crystal tips sparkle
  const sparkle = `
    <g fill="${secondaryColor}" opacity="0.3">
      <circle cx="43" cy="48" r="1"/>
      <circle cx="49" cy="42" r="1.2"/>
      <circle cx="55" cy="46" r="1"/>
    </g>
  `;

  const eyes = generateGemEyes(expression, eyeColor, 44, 54, 56, 54, 2.5);
  const mouth = generateGemMouth(expression, 50, 60);
  const pat = generateGemPattern(facetColor, 50, 54, 12, 14, pattern);

  return exterior + texture + interior + crystals + sparkle + pat + eyes + mouth;
}

export function generate(params: GemsParams): string {
  const { backgroundShape, gemType, backgroundColor } = params;

  let creature: string;
  switch (gemType) {
    case 'diamond':
      creature = generateDiamond(params);
      break;
    case 'ruby':
      creature = generateRuby(params);
      break;
    case 'emerald':
      creature = generateEmerald(params);
      break;
    case 'sapphire':
      creature = generateSapphire(params);
      break;
    case 'amethyst':
      creature = generateAmethyst(params);
      break;
    case 'opal':
      creature = generateOpal(params);
      break;
    case 'topaz':
      creature = generateTopaz(params);
      break;
    case 'pearl':
      creature = generatePearl(params);
      break;
    case 'crystal':
      creature = generateCrystal(params);
      break;
    case 'geode':
      creature = generateGeode(params);
      break;
    default:
      creature = generateDiamond(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): GemsParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const gemTypes = [
    'diamond', 'ruby', 'emerald', 'sapphire', 'amethyst',
    'opal', 'topaz', 'pearl', 'crystal', 'geode',
  ] as const;
  const expressions = ['happy', 'dazzled', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'facets', 'inclusions', 'shimmer'] as const;

  const primaryColors = [
    '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6',
    '#EF5350', '#E53935', '#C62828', '#B71C1C',
    '#66BB6A', '#43A047', '#2E7D32', '#1B5E20',
    '#42A5F5', '#1E88E5', '#1565C0', '#0D47A1',
  ];

  const secondaryColors = [
    '#E1F5FE', '#FFCDD2', '#C8E6C9', '#BBDEFB',
    '#F3E5F5', '#FFF9C4', '#B2EBF2', '#F5F5F5',
  ];

  const facetColors = [
    '#FFFFFF', '#E0E0E0', '#B3E5FC', '#F8BBD0',
    '#FFE082', '#C5CAE9', '#B0BEC5', '#F5F5F5',
  ];

  const backgroundColors = [
    '#1A237E', '#263238', '#311B92', '#004D40',
    '#880E4F', '#3E2723', '#F3E5F5', '#E8EAF6',
    '#E1F5FE', '#FFF8E1', '#FCE4EC', '#ECEFF1',
  ];

  const eyeColors = [
    '#1a1a1a', '#3E2723', '#212121', '#4E342E', '#263238',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    gemType: randomPick(gemTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    facetColor: randomPick(facetColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
  };
}

export const gems: Theme<typeof schema> = {
  name: 'Gems',
  schema,
  shapeParam: 'gemType',
  generate,
  randomize,
};
