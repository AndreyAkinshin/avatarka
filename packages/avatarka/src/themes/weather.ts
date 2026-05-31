import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, fitToCircle, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  weatherType: {
    type: 'select',
    default: 'sun',
    options: [
      'sun', 'cloud', 'raindrop', 'snowflake', 'lightning',
      'tornado', 'rainbow', 'moon', 'star', 'comet',
    ],
  },
  primaryColor: {
    type: 'color',
    default: '#FFD54F',
  },
  secondaryColor: {
    type: 'color',
    default: '#FFF9C4',
  },
  glowColor: {
    type: 'color',
    default: '#FF8F00',
  },
  precipitationColor: {
    type: 'color',
    default: '#90CAF9',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a1a',
  },
  backgroundColor: {
    type: 'color',
    default: '#E3F2FD',
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'breezy', 'surprised', 'sleepy'],
  },
  pattern: {
    type: 'select',
    default: 'none',
    options: ['none', 'swirls', 'dots', 'stripes'],
  },
} as const satisfies ParamSchema;

export type WeatherParams = ParamsFromSchema<typeof schema>;

type Expression = WeatherParams['expression'];

// --- Shared helpers ---

function generateWeatherEyes(
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
    case 'breezy':
      return `
        <path d="M${cx1 - s},${cy1} Q${cx1},${cy1 - s * 1.2} ${cx1 + s},${cy1}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <path d="M${cx2 - s},${cy2} Q${cx2},${cy2 - s * 1.2} ${cx2 + s},${cy2}" stroke="${eyeColor}" stroke-width="1.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="${cx1 + s * 1.2}" cy="${cy1 + s * 0.4}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
        <ellipse cx="${cx2 - s * 1.2}" cy="${cy2 + s * 0.4}" rx="${s * 0.6}" ry="${s * 0.3}" fill="#FFB6C1" opacity="0.4"/>
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

function generateWeatherMouth(
  expression: Expression,
  cx: number,
  cy: number
): string {
  switch (expression) {
    case 'happy':
      return `
        <path d="M${cx - 3},${cy} Q${cx},${cy + 4} ${cx + 3},${cy}" stroke="#5D4037" stroke-width="0.8" fill="none" stroke-linecap="round"/>
      `;
    case 'breezy':
      return `
        <ellipse cx="${cx + 4}" cy="${cy + 1}" rx="2.5" ry="2" fill="#5D4037" opacity="0.6"/>
        <path d="M${cx + 6},${cy} Q${cx + 10},${cy + 1} ${cx + 12},${cy - 1}" stroke="#90CAF9" stroke-width="0.8" fill="none" opacity="0.4" stroke-linecap="round"/>
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

function generateWeatherPattern(
  primaryColor: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  pattern: WeatherParams['pattern']
): string {
  const dark = darkenColor(primaryColor, 30);

  switch (pattern) {
    case 'swirls':
      return `
        <g opacity="0.2">
          <path d="M${cx - rx * 0.3},${cy - ry * 0.2} Q${cx - rx * 0.1},${cy - ry * 0.4} ${cx + rx * 0.1},${cy - ry * 0.2} Q${cx + rx * 0.2},${cy} ${cx},${cy + ry * 0.1}" stroke="${dark}" stroke-width="1" fill="none" stroke-linecap="round"/>
          <path d="M${cx + rx * 0.2},${cy + ry * 0.1} Q${cx + rx * 0.4},${cy - ry * 0.1} ${cx + rx * 0.3},${cy + ry * 0.3}" stroke="${dark}" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        </g>
      `;
    case 'dots':
      return `
        <g opacity="0.2">
          <circle cx="${cx - rx * 0.3}" cy="${cy - ry * 0.2}" r="1.2" fill="${dark}"/>
          <circle cx="${cx + rx * 0.25}" cy="${cy - ry * 0.15}" r="1" fill="${dark}"/>
          <circle cx="${cx - rx * 0.1}" cy="${cy + ry * 0.2}" r="1.3" fill="${dark}"/>
          <circle cx="${cx + rx * 0.35}" cy="${cy + ry * 0.1}" r="0.9" fill="${dark}"/>
        </g>
      `;
    case 'stripes':
      return `
        <g opacity="0.15" stroke="${dark}" stroke-width="1" stroke-linecap="round">
          <line x1="${cx - rx * 0.4}" y1="${cy - ry * 0.25}" x2="${cx + rx * 0.4}" y2="${cy - ry * 0.25}"/>
          <line x1="${cx - rx * 0.35}" y1="${cy}" x2="${cx + rx * 0.35}" y2="${cy}"/>
          <line x1="${cx - rx * 0.3}" y1="${cy + ry * 0.25}" x2="${cx + rx * 0.3}" y2="${cy + ry * 0.25}"/>
        </g>
      `;
    default:
      return '';
  }
}

// --- Weather generators ---

function generateSun(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Rays (8 triangular rays around the sun)
  const rays = `
    <g fill="${secondaryColor}" opacity="0.6">
      <polygon points="50,10 46,22 54,22"/>
      <polygon points="50,90 46,78 54,78"/>
      <polygon points="10,50 22,46 22,54"/>
      <polygon points="90,50 78,46 78,54"/>
      <polygon points="22,22 30,28 28,30"/>
      <polygon points="78,22 72,28 70,30"/>
      <polygon points="22,78 28,70 30,72"/>
      <polygon points="78,78 70,72 72,70"/>
    </g>
  `;

  // Sun body
  const body = `
    <circle cx="50" cy="50" r="18" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <circle cx="46" cy="44" r="5" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 54);
  const pat = generateWeatherPattern(primaryColor, 50, 50, 16, 16, pattern);

  return rays + body + pat + eyes + mouth;
}

function generateCloud(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 15);

  // Cloud body from overlapping circles with flat bottom
  const body = `
    <rect x="26" y="52" width="48" height="14" rx="7" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <circle cx="36" cy="46" r="14" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <circle cx="54" cy="42" r="16" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <circle cx="66" cy="50" r="12" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <rect x="26" y="50" width="48" height="16" fill="${primaryColor}"/>
  `;

  // Highlight
  const highlight = `
    <circle cx="38" cy="42" r="4" fill="${lightenColor(secondaryColor, 10)}" opacity="0.2"/>
    <circle cx="56" cy="38" r="5" fill="${lightenColor(secondaryColor, 10)}" opacity="0.15"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 42, 52, 58, 52, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 58);
  const pat = generateWeatherPattern(primaryColor, 50, 50, 22, 14, pattern);

  return body + highlight + pat + eyes + mouth;
}

function generateRaindrop(params: WeatherParams): string {
  const { primaryColor, secondaryColor, glowColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Teardrop shape
  const body = `
    <path d="M50,18 Q38,40 38,56 Q38,72 50,72 Q62,72 62,56 Q62,40 50,18 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
  `;

  // Side highlight
  const highlight = `
    <path d="M44,36 Q42,48 44,58 Q46,64 50,66" fill="${lightenColor(secondaryColor, 10)}" opacity="0.2" stroke="none"/>
  `;

  // Subtle glow at bottom
  const glow = `
    <ellipse cx="50" cy="62" rx="8" ry="4" fill="${glowColor}" opacity="0.1"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 45, 50, 55, 50, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 56);
  const pat = generateWeatherPattern(primaryColor, 50, 50, 10, 18, pattern);

  return glow + body + highlight + pat + eyes + mouth;
}

function generateSnowflake(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Six arms with branches
  const arms = `
    <g stroke="${primaryColor}" stroke-width="2" stroke-linecap="round" fill="none">
      <line x1="50" y1="24" x2="50" y2="76"/>
      <line x1="27.5" y1="37" x2="72.5" y2="63"/>
      <line x1="27.5" y1="63" x2="72.5" y2="37"/>
    </g>
    <g stroke="${secondaryColor}" stroke-width="1.2" stroke-linecap="round" fill="none">
      <line x1="50" y1="30" x2="44" y2="34"/>
      <line x1="50" y1="30" x2="56" y2="34"/>
      <line x1="50" y1="70" x2="44" y2="66"/>
      <line x1="50" y1="70" x2="56" y2="66"/>
      <line x1="33" y1="40" x2="33" y2="46"/>
      <line x1="33" y1="40" x2="39" y2="38"/>
      <line x1="67" y1="60" x2="67" y2="54"/>
      <line x1="67" y1="60" x2="61" y2="62"/>
      <line x1="33" y1="60" x2="39" y2="62"/>
      <line x1="33" y1="60" x2="33" y2="54"/>
      <line x1="67" y1="40" x2="61" y2="38"/>
      <line x1="67" y1="40" x2="67" y2="46"/>
    </g>
  `;

  // Center hub
  const center = `
    <circle cx="50" cy="50" r="10" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <circle cx="48" cy="47" r="3" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 46, 48, 54, 48, 2);
  const mouth = generateWeatherMouth(expression, 50, 53);
  const pat = generateWeatherPattern(primaryColor, 50, 50, 8, 8, pattern);

  return arms + center + pat + eyes + mouth;
}

function generateLightning(params: WeatherParams): string {
  const { primaryColor, secondaryColor, glowColor, eyeColor, expression, pattern } = params;

  // Small cloud on top
  const cloud = `
    <circle cx="42" cy="26" r="8" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <circle cx="54" cy="24" r="10" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <circle cx="62" cy="28" r="7" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <rect x="36" y="28" width="30" height="8" fill="${secondaryColor}"/>
  `;

  // Electric glow behind bolt
  const glow = `
    <path d="M54,34 L44,52 L52,52 L42,74" stroke="${glowColor}" stroke-width="6" fill="none" opacity="0.15" stroke-linecap="round" stroke-linejoin="round"/>
  `;

  // Zigzag bolt
  const bolt = `
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${primaryColor}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M54,34 L44,52 L52,52 L42,74" fill="none" stroke="${lightenColor(primaryColor, 20)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 44, 56, 54, 56, 2.5);
  const mouth = generateWeatherMouth(expression, 49, 62);
  const pat = generateWeatherPattern(primaryColor, 48, 54, 10, 16, pattern);

  return cloud + glow + bolt + pat + eyes + mouth;
}

function generateTornado(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Funnel cone from spiral-like curved lines
  const funnel = `
    <path d="M28,28 Q50,24 72,28 Q68,36 62,38 Q50,34 38,38 Q32,36 28,28 Z" fill="${primaryColor}" stroke="${dark}" stroke-width="0.5"/>
    <path d="M34,38 Q50,34 66,38 Q62,46 58,48 Q50,44 42,48 Q38,46 34,38 Z" fill="${darkenColor(primaryColor, 8)}" stroke="${dark}" stroke-width="0.4"/>
    <path d="M38,48 Q50,44 62,48 Q58,56 56,58 Q50,54 44,58 Q40,56 38,48 Z" fill="${darkenColor(primaryColor, 16)}" stroke="${dark}" stroke-width="0.4"/>
    <path d="M42,58 Q50,54 58,58 Q56,66 54,68 Q50,64 46,68 Q44,66 42,58 Z" fill="${darkenColor(primaryColor, 24)}" stroke="${dark}" stroke-width="0.3"/>
    <path d="M44,68 Q50,64 56,68 Q54,76 52,78 Q50,74 48,78 Q46,76 44,68 Z" fill="${darkenColor(primaryColor, 32)}" stroke="${dark}" stroke-width="0.3"/>
  `;

  // Highlight streaks
  const highlights = `
    <g opacity="0.15">
      <path d="M32,30 Q50,26 68,30" stroke="${lightenColor(secondaryColor, 10)}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M38,40 Q50,36 62,40" stroke="${lightenColor(secondaryColor, 10)}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    </g>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 44, 34, 56, 34, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 40);
  const pat = generateWeatherPattern(primaryColor, 50, 36, 18, 8, pattern);

  return funnel + highlights + pat + eyes + mouth;
}

function generateRainbow(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;

  // Small clouds at ends
  const leftCloud = `
    <circle cx="20" cy="62" r="8" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <circle cx="28" cy="60" r="6" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <rect x="16" y="62" width="16" height="6" fill="${secondaryColor}"/>
  `;
  const rightCloud = `
    <circle cx="80" cy="62" r="8" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <circle cx="72" cy="60" r="6" fill="${secondaryColor}" stroke="${darkenColor(secondaryColor, 10)}" stroke-width="0.4"/>
    <rect x="68" y="62" width="16" height="6" fill="${secondaryColor}"/>
  `;

  // Multi-color arc bands
  const arcColors = ['#EF5350', '#FF9800', '#FFEB3B', '#66BB6A', '#42A5F5', '#AB47BC'];
  let arcs = '';
  for (let i = 0; i < arcColors.length; i++) {
    const r = 34 - i * 3;
    arcs += `<path d="M${50 - r},64 A${r},${r} 0 0,1 ${50 + r},64" stroke="${arcColors[i]}" stroke-width="3" fill="none" opacity="0.7"/>`;
  }

  // Primary color overlay on main arc
  const mainArc = `
    <path d="M18,64 A32,32 0 0,1 82,64" stroke="${primaryColor}" stroke-width="1.5" fill="none" opacity="0.2"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 44, 48, 56, 48, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 54);
  const pat = generateWeatherPattern(primaryColor, 50, 46, 20, 14, pattern);

  return leftCloud + rightCloud + arcs + mainArc + pat + eyes + mouth;
}

function generateMoon(params: WeatherParams): string {
  const { primaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 15);

  // Crescent via clipping
  const crescent = `
    <defs>
      <clipPath id="moon-clip">
        <circle cx="50" cy="50" r="22"/>
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="22" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <g clip-path="url(#moon-clip)">
      <circle cx="62" cy="40" r="18" fill="${darkenColor(primaryColor, 10)}" opacity="0.3"/>
    </g>
  `;

  // Craters
  const craters = `
    <g opacity="0.15">
      <circle cx="42" cy="46" r="3" fill="${dark}"/>
      <circle cx="48" cy="58" r="2.5" fill="${dark}"/>
      <circle cx="38" cy="56" r="1.8" fill="${dark}"/>
    </g>
  `;

  // Highlight
  const highlight = `
    <circle cx="44" cy="42" r="4" fill="${lightenColor(primaryColor, 15)}" opacity="0.15"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 42, 50, 52, 50, 2.5);
  const mouth = generateWeatherMouth(expression, 47, 56);
  const pat = generateWeatherPattern(primaryColor, 46, 52, 14, 14, pattern);

  return crescent + craters + highlight + pat + eyes + mouth;
}

function generateStar(params: WeatherParams): string {
  const { primaryColor, secondaryColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Five-pointed star
  const starPoints: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180);
    const ox = 50 + 24 * Math.cos(outerAngle);
    const oy = 50 + 24 * Math.sin(outerAngle);
    const ix = 50 + 10 * Math.cos(innerAngle);
    const iy = 50 + 10 * Math.sin(innerAngle);
    starPoints.push(`${ox},${oy}`, `${ix},${iy}`);
  }

  const body = `
    <polygon points="${starPoints.join(' ')}" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6" stroke-linejoin="round"/>
  `;

  // Inner highlight
  const highlight = `
    <circle cx="48" cy="46" r="5" fill="${lightenColor(secondaryColor, 10)}" opacity="0.15"/>
  `;

  // Twinkle highlights at tips
  const twinkles = `
    <g fill="white" opacity="0.4">
      <circle cx="50" cy="26" r="1.5"/>
      <circle cx="73" cy="41" r="1.2"/>
      <circle cx="26" cy="41" r="1"/>
    </g>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 45, 48, 55, 48, 2.5);
  const mouth = generateWeatherMouth(expression, 50, 54);
  const pat = generateWeatherPattern(primaryColor, 50, 50, 10, 10, pattern);

  return body + highlight + twinkles + pat + eyes + mouth;
}

function generateComet(params: WeatherParams): string {
  const { primaryColor, secondaryColor, glowColor, precipitationColor, eyeColor, expression, pattern } = params;
  const dark = darkenColor(primaryColor, 20);

  // Tail (long particle trail going left/up)
  const tail = `
    <g opacity="0.4">
      <path d="M50,50 Q30,42 10,36" stroke="${secondaryColor}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.3"/>
      <path d="M50,50 Q32,44 14,40" stroke="${precipitationColor}" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.4"/>
      <path d="M50,50 Q34,46 18,44" stroke="${lightenColor(secondaryColor, 15)}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    </g>
  `;

  // Glow
  const glow = `
    <circle cx="54" cy="50" r="18" fill="${glowColor}" opacity="0.12"/>
  `;

  // Round head
  const head = `
    <circle cx="54" cy="50" r="14" fill="${primaryColor}" stroke="${dark}" stroke-width="0.6"/>
    <circle cx="50" cy="46" r="4" fill="${lightenColor(primaryColor, 15)}" opacity="0.2"/>
  `;

  const eyes = generateWeatherEyes(expression, eyeColor, 50, 48, 58, 48, 2.5);
  const mouth = generateWeatherMouth(expression, 54, 54);
  const pat = generateWeatherPattern(primaryColor, 54, 50, 12, 12, pattern);

  return tail + glow + head + pat + eyes + mouth;
}

export function generate(params: WeatherParams): string {
  const { backgroundShape, weatherType, backgroundColor } = params;

  let creature: string;
  switch (weatherType) {
    case 'sun':
      creature = generateSun(params);
      break;
    case 'cloud':
      creature = generateCloud(params);
      break;
    case 'raindrop':
      creature = generateRaindrop(params);
      break;
    case 'snowflake':
      creature = generateSnowflake(params);
      break;
    case 'lightning':
      creature = generateLightning(params);
      break;
    case 'tornado':
      creature = generateTornado(params);
      break;
    case 'rainbow':
      creature = generateRainbow(params);
      break;
    case 'moon':
      creature = generateMoon(params);
      break;
    case 'star':
      creature = generateStar(params);
      break;
    case 'comet':
      creature = generateComet(params);
      break;
    default:
      creature = generateSun(params);
  }

  const scaledCreature = fitToCircle(creature);

  return wrapSvgWithShape(scaledCreature, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: Rng): WeatherParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const weatherTypes = [
    'sun', 'cloud', 'raindrop', 'snowflake', 'lightning',
    'tornado', 'rainbow', 'moon', 'star', 'comet',
  ] as const;
  const expressions = ['happy', 'breezy', 'surprised', 'sleepy'] as const;
  const patterns = ['none', 'swirls', 'dots', 'stripes'] as const;

  const primaryColors = [
    '#FFD54F', '#FFC107', '#FFB300', '#FF8F00',
    '#90CAF9', '#64B5F6', '#42A5F5', '#BBDEFB',
    '#B0BEC5', '#CFD8DC', '#ECEFF1', '#FFFFFF',
    '#CE93D8', '#B39DDB', '#81D4FA', '#A5D6A7',
  ];

  const secondaryColors = [
    '#FFF9C4', '#FFFDE7', '#E3F2FD', '#E8EAF6',
    '#F3E5F5', '#FFFFFF', '#FFF8E1', '#E0F7FA',
  ];

  const glowColors = [
    '#FF8F00', '#FFD54F', '#2979FF', '#B0BEC5',
    '#FFF9C4', '#FF6F00', '#448AFF', '#E0E0E0',
  ];

  const precipitationColors = [
    '#90CAF9', '#64B5F6', '#BBDEFB', '#E3F2FD',
    '#FFFFFF', '#B0BEC5', '#FFF9C4', '#CFD8DC',
  ];

  const backgroundColors = [
    '#E3F2FD', '#BBDEFB', '#E1F5FE', '#E8EAF6',
    '#FCE4EC', '#FFF8E1', '#E0F7FA', '#F3E5F5',
    '#1A237E', '#263238', '#37474F', '#ECEFF1',
  ];

  const eyeColors = [
    '#1a1a1a', '#3E2723', '#212121', '#4E342E', '#263238',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    weatherType: randomPick(weatherTypes, rng),
    primaryColor: randomPick(primaryColors, rng),
    secondaryColor: randomPick(secondaryColors, rng),
    glowColor: randomPick(glowColors, rng),
    precipitationColor: randomPick(precipitationColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    expression: randomPick(expressions, rng),
    pattern: randomPick(patterns, rng),
  };
}

export const weather: Theme<typeof schema> = {
  name: 'Weather',
  schema,
  shapeParam: 'weatherType',
  generate,
  randomize,
};
