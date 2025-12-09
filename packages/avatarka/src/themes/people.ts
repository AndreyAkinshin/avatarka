import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  skinColor: {
    type: 'color',
    default: '#f5d0c5',
  },
  hairColor: {
    type: 'color',
    default: '#5d4e37',
  },
  eyeColor: {
    type: 'color',
    default: '#3498db',
  },
  backgroundColor: {
    type: 'color',
    default: '#ecf0f1',
  },
  hairStyle: {
    type: 'select',
    default: 'short',
    options: ['short', 'long', 'curly', 'bald', 'mohawk', 'ponytail'],
  },
  accessory: {
    type: 'select',
    default: 'none',
    options: ['none', 'glasses', 'sunglasses', 'earrings'],
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'neutral', 'sad', 'surprised'],
  },
} as const satisfies ParamSchema;

export type PeopleParams = ParamsFromSchema<typeof schema>;

function generateFace(params: PeopleParams): string {
  const { skinColor } = params;
  const darkSkin = darkenColor(skinColor, 20);

  return `
    <ellipse cx="50" cy="55" rx="32" ry="38" fill="${skinColor}"/>
    <ellipse cx="50" cy="58" rx="28" ry="32" fill="${darkSkin}" opacity="0.1"/>
  `;
}

function generateHair(params: PeopleParams): string {
  const { hairColor, hairStyle } = params;
  const darkHair = darkenColor(hairColor, 30);

  switch (hairStyle) {
    case 'short':
      return `
        <ellipse cx="50" cy="28" rx="30" ry="20" fill="${hairColor}"/>
        <path d="M20,35 Q25,20 50,15 Q75,20 80,35" fill="${hairColor}"/>
        <path d="M25,32 Q30,22 50,18 Q70,22 75,32" fill="${darkHair}" opacity="0.3"/>
      `;
    case 'long':
      return `
        <ellipse cx="50" cy="28" rx="32" ry="22" fill="${hairColor}"/>
        <path d="M18,30 Q18,95 30,95 L30,45 Q25,30 18,30" fill="${hairColor}"/>
        <path d="M82,30 Q82,95 70,95 L70,45 Q75,30 82,30" fill="${hairColor}"/>
        <path d="M20,35 Q25,15 50,12 Q75,15 80,35" fill="${hairColor}"/>
      `;
    case 'curly':
      return `
        <circle cx="30" cy="25" r="12" fill="${hairColor}"/>
        <circle cx="45" cy="18" r="12" fill="${hairColor}"/>
        <circle cx="55" cy="18" r="12" fill="${hairColor}"/>
        <circle cx="70" cy="25" r="12" fill="${hairColor}"/>
        <circle cx="25" cy="35" r="10" fill="${hairColor}"/>
        <circle cx="75" cy="35" r="10" fill="${hairColor}"/>
        <circle cx="38" cy="22" r="10" fill="${darkHair}" opacity="0.3"/>
        <circle cx="62" cy="22" r="10" fill="${darkHair}" opacity="0.3"/>
      `;
    case 'bald':
      return `
        <ellipse cx="50" cy="28" rx="28" ry="15" fill="${lightenColor(params.skinColor, 10)}"/>
      `;
    case 'mohawk':
      return `
        <path d="M45,5 L50,0 L55,5 L55,35 L45,35 Z" fill="${hairColor}"/>
        <rect x="46" y="10" width="8" height="25" fill="${darkHair}" opacity="0.3"/>
      `;
    case 'ponytail':
      return `
        <ellipse cx="50" cy="28" rx="30" ry="20" fill="${hairColor}"/>
        <path d="M20,35 Q25,20 50,15 Q75,20 80,35" fill="${hairColor}"/>
        <ellipse cx="50" cy="8" rx="8" ry="10" fill="${hairColor}"/>
        <ellipse cx="50" cy="8" rx="5" ry="7" fill="${darkHair}" opacity="0.3"/>
      `;
    default:
      return '';
  }
}

function generateEyes(params: PeopleParams): string {
  const { eyeColor, expression } = params;

  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="38" cy="50" rx="7" ry="8" fill="white"/>
        <ellipse cx="62" cy="50" rx="7" ry="8" fill="white"/>
        <circle cx="38" cy="51" r="4" fill="${eyeColor}"/>
        <circle cx="62" cy="51" r="4" fill="${eyeColor}"/>
        <circle cx="38" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="62" cy="51" r="2" fill="#2c3e50"/>
        <circle cx="36" cy="49" r="1.5" fill="white"/>
        <circle cx="60" cy="49" r="1.5" fill="white"/>
      `;
      break;
    case 'neutral':
      eyes = `
        <ellipse cx="38" cy="50" rx="6" ry="7" fill="white"/>
        <ellipse cx="62" cy="50" rx="6" ry="7" fill="white"/>
        <circle cx="38" cy="50" r="3" fill="${eyeColor}"/>
        <circle cx="62" cy="50" r="3" fill="${eyeColor}"/>
        <circle cx="38" cy="50" r="1.5" fill="#2c3e50"/>
        <circle cx="62" cy="50" r="1.5" fill="#2c3e50"/>
      `;
      break;
    case 'sad':
      eyes = `
        <ellipse cx="38" cy="52" rx="6" ry="7" fill="white"/>
        <ellipse cx="62" cy="52" rx="6" ry="7" fill="white"/>
        <circle cx="38" cy="53" r="3" fill="${eyeColor}"/>
        <circle cx="62" cy="53" r="3" fill="${eyeColor}"/>
        <circle cx="38" cy="53" r="1.5" fill="#2c3e50"/>
        <circle cx="62" cy="53" r="1.5" fill="#2c3e50"/>
        <path d="M32,46 Q38,49 44,46" stroke="#2c3e50" stroke-width="1.5" fill="none"/>
        <path d="M56,46 Q62,49 68,46" stroke="#2c3e50" stroke-width="1.5" fill="none"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <ellipse cx="38" cy="48" rx="8" ry="10" fill="white"/>
        <ellipse cx="62" cy="48" rx="8" ry="10" fill="white"/>
        <circle cx="38" cy="48" r="5" fill="${eyeColor}"/>
        <circle cx="62" cy="48" r="5" fill="${eyeColor}"/>
        <circle cx="38" cy="48" r="2.5" fill="#2c3e50"/>
        <circle cx="62" cy="48" r="2.5" fill="#2c3e50"/>
        <circle cx="36" cy="46" r="2" fill="white"/>
        <circle cx="60" cy="46" r="2" fill="white"/>
      `;
      break;
  }

  // Eyebrows
  const eyebrows = expression === 'sad'
    ? `
      <path d="M30,42 Q38,40 44,44" stroke="#5d4e37" stroke-width="2" fill="none"/>
      <path d="M70,42 Q62,40 56,44" stroke="#5d4e37" stroke-width="2" fill="none"/>
    `
    : expression === 'surprised'
      ? `
      <path d="M30,38 Q38,34 44,38" stroke="#5d4e37" stroke-width="2" fill="none"/>
      <path d="M70,38 Q62,34 56,38" stroke="#5d4e37" stroke-width="2" fill="none"/>
    `
      : `
      <path d="M30,44 Q38,42 44,44" stroke="#5d4e37" stroke-width="2" fill="none"/>
      <path d="M70,44 Q62,42 56,44" stroke="#5d4e37" stroke-width="2" fill="none"/>
    `;

  return eyes + eyebrows;
}

function generateNoseAndMouth(params: PeopleParams): string {
  const { skinColor, expression } = params;
  const darkSkin = darkenColor(skinColor, 30);

  const nose = `<path d="M50,55 L47,68 Q50,70 53,68 L50,55" stroke="${darkSkin}" stroke-width="1.5" fill="none"/>`;

  let mouth = '';
  switch (expression) {
    case 'happy':
      mouth = `<path d="M40,78 Q50,86 60,78" stroke="#c0392b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
      break;
    case 'neutral':
      mouth = `<line x1="42" y1="80" x2="58" y2="80" stroke="#c0392b" stroke-width="2.5" stroke-linecap="round"/>`;
      break;
    case 'sad':
      mouth = `<path d="M40,84 Q50,76 60,84" stroke="#c0392b" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
      break;
    case 'surprised':
      mouth = `<ellipse cx="50" cy="82" rx="6" ry="8" fill="#c0392b"/>`;
      break;
  }

  return nose + mouth;
}

function generateAccessory(params: PeopleParams): string {
  const { accessory } = params;

  switch (accessory) {
    case 'glasses':
      return `
        <circle cx="38" cy="50" r="10" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <circle cx="62" cy="50" r="10" fill="none" stroke="#2c3e50" stroke-width="2"/>
        <line x1="48" y1="50" x2="52" y2="50" stroke="#2c3e50" stroke-width="2"/>
        <line x1="28" y1="48" x2="20" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="72" y1="48" x2="80" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;
    case 'sunglasses':
      return `
        <rect x="26" y="44" width="22" height="14" rx="3" fill="#2c3e50"/>
        <rect x="52" y="44" width="22" height="14" rx="3" fill="#2c3e50"/>
        <line x1="48" y1="50" x2="52" y2="50" stroke="#2c3e50" stroke-width="2"/>
        <line x1="26" y1="48" x2="18" y2="46" stroke="#2c3e50" stroke-width="2"/>
        <line x1="74" y1="48" x2="82" y2="46" stroke="#2c3e50" stroke-width="2"/>
      `;
    case 'earrings':
      return `
        <circle cx="18" cy="58" r="3" fill="#f1c40f"/>
        <circle cx="82" cy="58" r="3" fill="#f1c40f"/>
      `;
    default:
      return '';
  }
}

function generateEars(params: PeopleParams): string {
  const { skinColor } = params;
  const darkSkin = darkenColor(skinColor, 15);

  return `
    <ellipse cx="18" cy="55" rx="5" ry="8" fill="${skinColor}"/>
    <ellipse cx="18" cy="55" rx="3" ry="5" fill="${darkSkin}" opacity="0.3"/>
    <ellipse cx="82" cy="55" rx="5" ry="8" fill="${skinColor}"/>
    <ellipse cx="82" cy="55" rx="3" ry="5" fill="${darkSkin}" opacity="0.3"/>
  `;
}

// Scale factor to ensure avatar fits within the circular background
const PEOPLE_SCALE = 0.85;

export function generate(params: PeopleParams): string {
  const { backgroundShape, backgroundColor, hairStyle } = params;

  // Order matters for layering
  const innerContent = `
    ${hairStyle === 'long' ? generateHair(params) : ''}
    ${generateEars(params)}
    ${generateFace(params)}
    ${hairStyle !== 'long' ? generateHair(params) : ''}
    ${generateEyes(params)}
    ${generateNoseAndMouth(params)}
    ${generateAccessory(params)}
  `;

  // Apply scale transform centered at (50, 50) to fit within circle
  const content = `
    <g transform="translate(50, 50) scale(${PEOPLE_SCALE}) translate(-50, -50)">
      ${innerContent}
    </g>
  `;

  return wrapSvgWithShape(content, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): PeopleParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const hairStyles = ['short', 'long', 'curly', 'bald', 'mohawk', 'ponytail'] as const;
  const accessories = ['none', 'glasses', 'sunglasses', 'earrings'] as const;
  const expressions = ['happy', 'neutral', 'sad', 'surprised'] as const;

  // Skin tones
  const skinTones = [
    '#f5d0c5', '#e8beac', '#d4a574', '#c68642',
    '#8d5524', '#6b4423', '#4a3728', '#f9d5b8',
  ];

  // Hair colors
  const hairColors = [
    '#2c1810', '#5d4e37', '#8b4513', '#d2691e',
    '#ffd700', '#ff6347', '#4a0080', '#1a1a2e',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    skinColor: randomPick(skinTones, rng),
    hairColor: randomPick(hairColors, rng),
    eyeColor: randomColor(rng),
    backgroundColor: randomColor(rng),
    hairStyle: randomPick(hairStyles, rng),
    accessory: randomPick(accessories, rng),
    expression: randomPick(expressions, rng),
  };
}

export const people: Theme<typeof schema> = {
  name: 'People',
  schema,
  generate,
  randomize,
};
