import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  skinColor: {
    type: 'color',
    default: '#7ed321',
  },
  eyeColor: {
    type: 'color',
    default: '#1a1a2e',
  },
  backgroundColor: {
    type: 'color',
    default: '#0a0a23',
  },
  headShape: {
    type: 'select',
    default: 'classic',
    options: ['classic', 'bulbous', 'elongated', 'triangular', 'squid'],
  },
  eyeStyle: {
    type: 'select',
    default: 'large',
    options: ['large', 'wrap', 'compound', 'multiple', 'glowing'],
  },
  antennae: {
    type: 'select',
    default: 'none',
    options: ['none', 'straight', 'curved', 'bulbs', 'feelers'],
  },
  mouthStyle: {
    type: 'select',
    default: 'slit',
    options: ['slit', 'none', 'small', 'tentacles', 'beak'],
  },
  markings: {
    type: 'select',
    default: 'none',
    options: ['none', 'spots', 'stripes', 'glow', 'scales'],
  },
} as const satisfies ParamSchema;

export type AliensParams = ParamsFromSchema<typeof schema>;

function generateHead(params: AliensParams): string {
  const { skinColor, headShape } = params;
  const darkSkin = darkenColor(skinColor, 20);
  const lightSkin = lightenColor(skinColor, 20);

  switch (headShape) {
    case 'classic':
      // Grey alien style - large cranium, small chin
      return `
        <ellipse cx="50" cy="45" rx="28" ry="32" fill="${skinColor}"/>
        <ellipse cx="50" cy="70" rx="12" ry="16" fill="${skinColor}"/>
        <ellipse cx="50" cy="42" rx="24" ry="26" fill="${lightSkin}" opacity="0.3"/>
      `;
    case 'bulbous':
      // Big brain look
      return `
        <ellipse cx="50" cy="50" rx="32" ry="34" fill="${skinColor}"/>
        <ellipse cx="38" cy="38" rx="12" ry="14" fill="${lightSkin}" opacity="0.3"/>
        <ellipse cx="62" cy="38" rx="12" ry="14" fill="${lightSkin}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="16" ry="12" fill="${lightSkin}" opacity="0.2"/>
      `;
    case 'elongated':
      // Tall head
      return `
        <ellipse cx="50" cy="52" rx="20" ry="36" fill="${skinColor}"/>
        <ellipse cx="50" cy="45" rx="16" ry="28" fill="${lightSkin}" opacity="0.2"/>
        <path d="M35,62 Q50,90 65,62" fill="${darkSkin}" opacity="0.2"/>
      `;
    case 'triangular':
      // Inverted triangle
      return `
        <path d="M50,18 L78,70 Q50,88 22,70 Z" fill="${skinColor}"/>
        <path d="M50,24 L70,62 Q50,75 30,62 Z" fill="${lightSkin}" opacity="0.2"/>
      `;
    case 'squid':
      // Cthulhu-esque
      return `
        <ellipse cx="50" cy="40" rx="28" ry="24" fill="${skinColor}"/>
        <ellipse cx="50" cy="36" rx="22" ry="18" fill="${lightSkin}" opacity="0.2"/>
        <path d="M28,52 Q24,70 28,80" stroke="${skinColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M40,56 Q37,74 40,84" stroke="${skinColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M50,58 Q50,76 50,86" stroke="${skinColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M60,56 Q63,74 60,84" stroke="${skinColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M72,52 Q76,70 72,80" stroke="${skinColor}" stroke-width="6" fill="none" stroke-linecap="round"/>
      `;
    default:
      return '';
  }
}

function generateEyes(params: AliensParams): string {
  const { eyeColor, eyeStyle } = params;
  const glowColor = lightenColor(eyeColor, 40);

  switch (eyeStyle) {
    case 'large':
      // Classic alien eyes
      return `
        <ellipse cx="38" cy="48" rx="10" ry="14" fill="${eyeColor}"/>
        <ellipse cx="62" cy="48" rx="10" ry="14" fill="${eyeColor}"/>
        <ellipse cx="36" cy="44" rx="3" ry="5" fill="${glowColor}" opacity="0.6"/>
        <ellipse cx="60" cy="44" rx="3" ry="5" fill="${glowColor}" opacity="0.6"/>
      `;
    case 'wrap':
      // Wraparound visor-like eyes
      return `
        <path d="M22,48 Q50,40 78,48 Q50,60 22,48" fill="${eyeColor}"/>
        <path d="M26,48 Q50,42 74,48" stroke="${glowColor}" stroke-width="2" fill="none" opacity="0.5"/>
      `;
    case 'compound':
      // Insect-like
      return `
        <ellipse cx="38" cy="48" rx="12" ry="14" fill="${eyeColor}"/>
        <ellipse cx="62" cy="48" rx="12" ry="14" fill="${eyeColor}"/>
        <circle cx="34" cy="44" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="38" cy="42" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="42" cy="44" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="35" cy="48" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="41" cy="48" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="58" cy="44" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="62" cy="42" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="66" cy="44" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="59" cy="48" r="2.5" fill="${glowColor}" opacity="0.4"/>
        <circle cx="65" cy="48" r="2.5" fill="${glowColor}" opacity="0.4"/>
      `;
    case 'multiple':
      // Three eyes
      return `
        <ellipse cx="34" cy="50" rx="7" ry="10" fill="${eyeColor}"/>
        <ellipse cx="50" cy="44" rx="8" ry="11" fill="${eyeColor}"/>
        <ellipse cx="66" cy="50" rx="7" ry="10" fill="${eyeColor}"/>
        <ellipse cx="32" cy="47" rx="2" ry="3" fill="${glowColor}" opacity="0.6"/>
        <ellipse cx="48" cy="41" rx="2" ry="3" fill="${glowColor}" opacity="0.6"/>
        <ellipse cx="64" cy="47" rx="2" ry="3" fill="${glowColor}" opacity="0.6"/>
      `;
    case 'glowing':
      // Glowing eyes with no visible pupil
      return `
        <ellipse cx="38" cy="48" rx="8" ry="11" fill="${eyeColor}"/>
        <ellipse cx="62" cy="48" rx="8" ry="11" fill="${eyeColor}"/>
        <ellipse cx="38" cy="48" rx="5" ry="7" fill="${glowColor}"/>
        <ellipse cx="62" cy="48" rx="5" ry="7" fill="${glowColor}"/>
        <ellipse cx="38" cy="48" rx="2" ry="4" fill="white" opacity="0.8"/>
        <ellipse cx="62" cy="48" rx="2" ry="4" fill="white" opacity="0.8"/>
      `;
    default:
      return '';
  }
}

function generateAntennae(params: AliensParams): string {
  const { skinColor, antennae } = params;
  const lightSkin = lightenColor(skinColor, 30);

  switch (antennae) {
    case 'straight':
      return `
        <line x1="38" y1="22" x2="32" y2="8" stroke="${skinColor}" stroke-width="3" stroke-linecap="round"/>
        <line x1="62" y1="22" x2="68" y2="8" stroke="${skinColor}" stroke-width="3" stroke-linecap="round"/>
      `;
    case 'curved':
      return `
        <path d="M38,22 Q28,12 22,14" stroke="${skinColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M62,22 Q72,12 78,14" stroke="${skinColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
    case 'bulbs':
      return `
        <line x1="38" y1="22" x2="30" y2="10" stroke="${skinColor}" stroke-width="2"/>
        <line x1="62" y1="22" x2="70" y2="10" stroke="${skinColor}" stroke-width="2"/>
        <circle cx="30" cy="10" r="4" fill="${lightSkin}"/>
        <circle cx="70" cy="10" r="4" fill="${lightSkin}"/>
        <circle cx="30" cy="10" r="1.5" fill="white" opacity="0.6"/>
        <circle cx="70" cy="10" r="1.5" fill="white" opacity="0.6"/>
      `;
    case 'feelers':
      return `
        <path d="M40,20 Q32,10 24,12" stroke="${skinColor}" stroke-width="2" fill="none"/>
        <path d="M38,22 Q26,14 18,18" stroke="${skinColor}" stroke-width="2" fill="none"/>
        <path d="M60,20 Q68,10 76,12" stroke="${skinColor}" stroke-width="2" fill="none"/>
        <path d="M62,22 Q74,14 82,18" stroke="${skinColor}" stroke-width="2" fill="none"/>
      `;
    default:
      return '';
  }
}

function generateMouth(params: AliensParams): string {
  const { skinColor, mouthStyle } = params;
  const darkSkin = darkenColor(skinColor, 40);

  switch (mouthStyle) {
    case 'slit':
      return `<line x1="44" y1="68" x2="56" y2="68" stroke="${darkSkin}" stroke-width="2" stroke-linecap="round"/>`;
    case 'small':
      return `<ellipse cx="50" cy="68" rx="3" ry="2.5" fill="${darkSkin}"/>`;
    case 'tentacles':
      return `
        <path d="M42,66 Q40,74 38,78" stroke="${skinColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M47,68 Q46,76 44,82" stroke="${skinColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M53,68 Q54,76 56,82" stroke="${skinColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M58,66 Q60,74 62,78" stroke="${skinColor}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      `;
    case 'beak':
      return `
        <path d="M46,64 L50,76 L54,64 Z" fill="${darkSkin}"/>
      `;
    default:
      return '';
  }
}

function generateMarkings(params: AliensParams): string {
  const { skinColor, markings } = params;
  const darkSkin = darkenColor(skinColor, 25);
  const lightSkin = lightenColor(skinColor, 40);

  switch (markings) {
    case 'spots':
      return `
        <circle cx="28" cy="40" r="3" fill="${darkSkin}" opacity="0.5"/>
        <circle cx="72" cy="40" r="3" fill="${darkSkin}" opacity="0.5"/>
        <circle cx="32" cy="56" r="2.5" fill="${darkSkin}" opacity="0.5"/>
        <circle cx="68" cy="56" r="2.5" fill="${darkSkin}" opacity="0.5"/>
        <circle cx="25" cy="52" r="2" fill="${darkSkin}" opacity="0.5"/>
        <circle cx="75" cy="52" r="2" fill="${darkSkin}" opacity="0.5"/>
      `;
    case 'stripes':
      return `
        <path d="M30,36 Q50,32 70,36" stroke="${darkSkin}" stroke-width="2.5" fill="none" opacity="0.4"/>
        <path d="M26,48 Q50,44 74,48" stroke="${darkSkin}" stroke-width="2.5" fill="none" opacity="0.4"/>
        <path d="M30,60 Q50,56 70,60" stroke="${darkSkin}" stroke-width="2.5" fill="none" opacity="0.4"/>
      `;
    case 'glow':
      return `
        <ellipse cx="50" cy="50" rx="20" ry="16" fill="${lightSkin}" opacity="0.3"/>
        <ellipse cx="50" cy="50" rx="12" ry="10" fill="${lightSkin}" opacity="0.3"/>
      `;
    case 'scales':
      return `
        <pattern id="scales" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,4 Q4,0 8,4 Q4,8 0,4" fill="${darkSkin}" opacity="0.2"/>
        </pattern>
        <ellipse cx="50" cy="50" rx="24" ry="28" fill="url(#scales)"/>
      `;
    default:
      return '';
  }
}

export function generate(params: AliensParams): string {
  const { backgroundShape, backgroundColor } = params;

  const content = `
    ${generateAntennae(params)}
    ${generateHead(params)}
    ${generateMarkings(params)}
    ${generateEyes(params)}
    ${generateMouth(params)}
  `;

  return wrapSvgWithShape(content, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): AliensParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const headShapes = ['classic', 'bulbous', 'elongated', 'triangular', 'squid'] as const;
  const eyeStyles = ['large', 'wrap', 'compound', 'multiple', 'glowing'] as const;
  const antennaeOptions = ['none', 'straight', 'curved', 'bulbs', 'feelers'] as const;
  const mouthStyles = ['slit', 'none', 'small', 'tentacles', 'beak'] as const;
  const markingsOptions = ['none', 'spots', 'stripes', 'glow', 'scales'] as const;

  // Alien skin colors - greens, blues, purples, grays
  const skinColors = [
    '#7ed321', '#4a9c2d', '#2ecc71', '#1abc9c',
    '#3498db', '#9b59b6', '#8e44ad', '#6c5ce7',
    '#a0a0a0', '#7f8c8d', '#95a5a6', '#bdc3c7',
    '#e74c3c', '#f39c12', '#00cec9',
  ];

  // Eye colors - often dark or glowing
  const eyeColors = [
    '#1a1a2e', '#0f0f1a', '#2c3e50', '#000000',
    '#e74c3c', '#f1c40f', '#9b59b6', '#00ff00',
  ];

  // Background - space/dark themes
  const backgroundColors = [
    '#0a0a23', '#1a1a2e', '#16213e', '#0f3460',
    '#1b1b2f', '#2c2c54', '#40407a', '#000000',
    '#1e272e', '#2f3640',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    skinColor: randomPick(skinColors, rng),
    eyeColor: randomPick(eyeColors, rng),
    backgroundColor: randomPick(backgroundColors, rng),
    headShape: randomPick(headShapes, rng),
    eyeStyle: randomPick(eyeStyles, rng),
    antennae: randomPick(antennaeOptions, rng),
    mouthStyle: randomPick(mouthStyles, rng),
    markings: randomPick(markingsOptions, rng),
  };
}

export const aliens: Theme<typeof schema> = {
  name: 'Aliens',
  schema,
  generate,
  randomize,
};
