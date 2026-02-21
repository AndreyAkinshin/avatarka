import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, randomColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

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
    default: 'bob',
    options: ['bob', 'long', 'curly', 'bald', 'mohawk', 'ponytail'],
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
    case 'bob':
      // Wide panels (16 units each side) to avoid sidelock appearance.
      // Rendered on top of face so bangs are visible over the forehead.
      return `
        <path d="M14,38 C12,14 28,-2 50,-2 C72,-2 88,14 86,38 L86,72 C86,78 80,80 70,76 L70,40 C64,28 56,22 50,20 C44,22 36,28 30,40 L30,76 C20,80 14,78 14,72 Z" fill="${hairColor}"/>
        <path d="M20,40 C20,26 32,14 50,14 C68,14 80,26 80,40 C72,36 62,40 50,37 C38,40 28,36 20,40 Z" fill="${hairColor}"/>
      `;
    case 'long':
      return `
        <path d="M14,36 C12,12 28,-2 50,-2 C72,-2 88,12 86,36 L86,80 C86,94 78,98 72,90 C68,84 66,56 64,40 C60,28 56,22 50,20 C44,22 40,28 36,40 C34,56 32,84 28,90 C22,98 14,94 14,80 Z" fill="${hairColor}"/>
      `;
    case 'curly':
      return `
        <path d="M14,44 C10,32 14,20 26,14 C34,6 42,2 50,2 C58,2 66,6 74,14 C86,20 90,32 86,44 C82,36 68,34 50,34 C32,34 18,36 14,44 Z" fill="${hairColor}"/>
        <circle cx="14" cy="36" r="10" fill="${hairColor}"/>
        <circle cx="86" cy="36" r="10" fill="${hairColor}"/>
        <circle cx="22" cy="18" r="10" fill="${hairColor}"/>
        <circle cx="78" cy="18" r="10" fill="${hairColor}"/>
        <circle cx="36" cy="8" r="10" fill="${hairColor}"/>
        <circle cx="64" cy="8" r="10" fill="${hairColor}"/>
        <circle cx="50" cy="4" r="10" fill="${hairColor}"/>
      `;
    case 'bald':
      return `
        <circle cx="44" cy="21" r="1.5" fill="${hairColor}" opacity="0.3"/>
        <circle cx="50" cy="19" r="1.5" fill="${hairColor}" opacity="0.35"/>
        <circle cx="56" cy="21" r="1.5" fill="${hairColor}" opacity="0.3"/>
        <circle cx="35" cy="27" r="1.5" fill="${hairColor}" opacity="0.25"/>
        <circle cx="43" cy="25" r="1.5" fill="${hairColor}" opacity="0.3"/>
        <circle cx="57" cy="25" r="1.5" fill="${hairColor}" opacity="0.3"/>
        <circle cx="65" cy="27" r="1.5" fill="${hairColor}" opacity="0.25"/>
        <circle cx="32" cy="33" r="1.5" fill="${hairColor}" opacity="0.2"/>
        <circle cx="41" cy="31" r="1.5" fill="${hairColor}" opacity="0.25"/>
        <circle cx="59" cy="31" r="1.5" fill="${hairColor}" opacity="0.25"/>
        <circle cx="68" cy="33" r="1.5" fill="${hairColor}" opacity="0.2"/>
      `;
    case 'mohawk':
      return `
        <path d="M40,36 L40,18 L38,4 L44,14 L50,-2 L56,14 L62,4 L60,18 L60,36 Z" fill="${hairColor}"/>
        <path d="M44,36 L44,20 L50,4 L56,20 L56,36 Z" fill="${darkHair}"/>
      `;
    case 'ponytail':
      return `
        <path d="M24,36 C24,20 36,10 50,10 C64,10 76,20 76,36 C68,28 60,26 50,26 C40,26 32,28 24,36 Z" fill="${hairColor}"/>
        <ellipse cx="50" cy="6" rx="9" ry="10" fill="${hairColor}"/>
        <circle cx="50" cy="14" r="3.5" fill="${darkHair}"/>
      `;
    default:
      return '';
  }
}

function generateEyes(params: PeopleParams): string {
  const { eyeColor, expression, hairColor } = params;
  const eyebrowColor = darkenColor(hairColor, 35);

  let eyes = '';
  switch (expression) {
    case 'happy':
      eyes = `
        <ellipse cx="38" cy="50" rx="6" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="6" ry="6" fill="white"/>
        <circle cx="38" cy="51" r="3.2" fill="${eyeColor}"/>
        <circle cx="62" cy="51" r="3.2" fill="${eyeColor}"/>
        <circle cx="38" cy="51" r="1.6" fill="#2c3e50"/>
        <circle cx="62" cy="51" r="1.6" fill="#2c3e50"/>
        <path d="M32,47 Q38,45 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,45 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;
      break;
    case 'neutral':
      eyes = `
        <ellipse cx="38" cy="50" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="50" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="50" r="2.8" fill="${eyeColor}"/>
        <circle cx="62" cy="50" r="2.8" fill="${eyeColor}"/>
        <circle cx="38" cy="50" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="50" r="1.4" fill="#2c3e50"/>
      `;
      break;
    case 'sad':
      eyes = `
        <ellipse cx="38" cy="52" rx="5.5" ry="6" fill="white"/>
        <ellipse cx="62" cy="52" rx="5.5" ry="6" fill="white"/>
        <circle cx="38" cy="53" r="2.8" fill="${eyeColor}"/>
        <circle cx="62" cy="53" r="2.8" fill="${eyeColor}"/>
        <circle cx="38" cy="53" r="1.4" fill="#2c3e50"/>
        <circle cx="62" cy="53" r="1.4" fill="#2c3e50"/>
        <path d="M32,47 Q38,48 44,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
        <path d="M56,47 Q62,48 68,47" stroke="#2c3e50" stroke-width="1" fill="none"/>
      `;
      break;
    case 'surprised':
      eyes = `
        <ellipse cx="38" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <ellipse cx="62" cy="48" rx="6.5" ry="7.5" fill="white"/>
        <circle cx="38" cy="48" r="3.5" fill="${eyeColor}"/>
        <circle cx="62" cy="48" r="3.5" fill="${eyeColor}"/>
        <circle cx="38" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="62" cy="48" r="1.8" fill="#2c3e50"/>
        <circle cx="36.5" cy="46.5" r="1.4" fill="white"/>
        <circle cx="60.5" cy="46.5" r="1.4" fill="white"/>
      `;
      break;
  }

  // Eyebrows
  const eyebrows = expression === 'sad'
    ? `
      <path d="M30,44 Q38,41 46,44" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,41 54,44" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `
    : expression === 'surprised'
      ? `
      <path d="M30,40 Q38,36 46,40" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,40 Q62,36 54,40" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `
      : `
      <path d="M30,44 Q38,42 46,44" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M70,44 Q62,42 54,44" stroke="${eyebrowColor}" stroke-width="2" stroke-linecap="round" fill="none"/>
    `;

  return eyes + eyebrows;
}

function generateNoseAndMouth(params: PeopleParams): string {
  const { skinColor, expression } = params;
  const darkSkin = darkenColor(skinColor, 30);
  const mouthColor = darkenColor(skinColor, 25);

  const nose = `<path d="M50,55 L47,68 Q50,70 53,68 L50,55" stroke="${darkSkin}" stroke-width="1.4" fill="none"/>`;

  let mouth = '';
  switch (expression) {
    case 'happy':
      mouth = `<path d="M42,78 Q50,82 58,78" stroke="${mouthColor}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      break;
    case 'neutral':
      mouth = `<path d="M42,80 Q50,80 58,80" stroke="${mouthColor}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      break;
    case 'sad':
      mouth = `<path d="M42,82 Q50,79 58,82" stroke="${mouthColor}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      break;
    case 'surprised':
      mouth = `<ellipse cx="50" cy="80" rx="4" ry="5.5" fill="none" stroke="${mouthColor}" stroke-width="2"/>`;
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

  // Long hair renders behind the face; other styles (including bob with bangs) render on top
  const hairBehindFace = hairStyle === 'long';
  const innerContent = `
    ${hairBehindFace ? generateHair(params) : ''}
    ${generateEars(params)}
    ${generateFace(params)}
    ${!hairBehindFace ? generateHair(params) : ''}
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
  const hairStyles = ['bob', 'long', 'curly', 'bald', 'mohawk', 'ponytail'] as const;
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
