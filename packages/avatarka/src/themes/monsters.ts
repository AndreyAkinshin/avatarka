import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import {
  darkenColor,
  lightenColor,
  randomColor,
  randomInt,
  randomPick,
  wrapSvgWithShape,
  type BackgroundShape,
} from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  backgroundColor: {
    type: 'color',
    default: '#e8f4f8',
  },
  bodyColor: {
    type: 'color',
    default: '#9b59b6',
  },
  eyeColor: {
    type: 'color',
    default: '#ffffff',
  },
  mouthColor: {
    type: 'color',
    default: '#c0392b',
  },
  bodyShape: {
    type: 'select',
    default: 'round',
    options: ['round', 'square', 'blob', 'tall'],
  },
  eyeCount: {
    type: 'number',
    default: 2,
    min: 1,
    max: 5,
  },
  hasHorns: {
    type: 'select',
    default: 'spikes',
    options: ['no', 'spikes', 'curved', 'antlers'],
  },
  hasTeeth: {
    type: 'select',
    default: 'yes',
    options: ['yes', 'no'],
  },
  expression: {
    type: 'select',
    default: 'happy',
    options: ['happy', 'angry', 'surprised', 'silly'],
  },
} as const satisfies ParamSchema;

export type MonsterParams = ParamsFromSchema<typeof schema>;

function generateBody(params: MonsterParams): string {
  const { bodyColor, bodyShape } = params;
  const darkBody = darkenColor(bodyColor, 30);

  switch (bodyShape) {
    case 'round':
      return `
        <ellipse cx="50" cy="55" rx="35" ry="38" fill="${bodyColor}"/>
        <ellipse cx="50" cy="58" rx="30" ry="32" fill="${darkBody}" opacity="0.3"/>
      `;
    case 'square':
      return `
        <rect x="15" y="20" width="70" height="70" rx="10" fill="${bodyColor}"/>
        <rect x="20" y="25" width="60" height="60" rx="8" fill="${darkBody}" opacity="0.3"/>
      `;
    case 'blob':
      return `
        <path d="M20,50 Q10,30 30,20 Q50,10 70,20 Q90,30 80,50 Q90,70 70,80 Q50,95 30,80 Q10,70 20,50" fill="${bodyColor}"/>
        <path d="M25,50 Q15,32 32,23 Q50,15 68,23 Q85,32 77,50 Q85,68 68,77 Q50,88 32,77 Q15,68 25,50" fill="${darkBody}" opacity="0.3"/>
      `;
    case 'tall':
      return `
        <ellipse cx="50" cy="50" rx="25" ry="42" fill="${bodyColor}"/>
        <ellipse cx="50" cy="52" rx="20" ry="36" fill="${darkBody}" opacity="0.3"/>
      `;
    default:
      return `<circle cx="50" cy="55" r="35" fill="${bodyColor}"/>`;
  }
}

function generateEyes(params: MonsterParams): string {
  const { eyeColor, eyeCount, expression, bodyShape } = params;
  const eyes: string[] = [];

  const baseY = bodyShape === 'tall' ? 35 : 40;
  const spacing = 60 / (eyeCount + 1);
  const eyeSize = Math.max(6, 12 - eyeCount);

  for (let i = 0; i < eyeCount; i++) {
    const x = 20 + spacing * (i + 1);
    const y = baseY + (i % 2) * 5;

    // Eye white
    eyes.push(`<ellipse cx="${x}" cy="${y}" rx="${eyeSize}" ry="${eyeSize + 2}" fill="${eyeColor}"/>`);

    // Pupil
    let pupilOffsetY = 0;
    let pupilOffsetX = 0;
    switch (expression) {
      case 'angry':
        pupilOffsetY = 2;
        break;
      case 'surprised':
        pupilOffsetY = -1;
        break;
      case 'silly':
        pupilOffsetX = i % 2 === 0 ? 2 : -2;
        pupilOffsetY = i % 2 === 0 ? 2 : -2;
        break;
    }

    eyes.push(`<circle cx="${x + pupilOffsetX}" cy="${y + pupilOffsetY}" r="${eyeSize / 2}" fill="#2c3e50"/>`);
    eyes.push(`<circle cx="${x + pupilOffsetX - 1}" cy="${y + pupilOffsetY - 1}" r="${eyeSize / 5}" fill="#ffffff"/>`);

    // Angry eyebrows
    if (expression === 'angry') {
      const browY = y - eyeSize - 3;
      const browTilt = i < eyeCount / 2 ? 3 : -3;
      eyes.push(`<line x1="${x - eyeSize}" y1="${browY + browTilt}" x2="${x + eyeSize}" y2="${browY - browTilt}" stroke="#2c3e50" stroke-width="2" stroke-linecap="round"/>`);
    }
  }

  return eyes.join('');
}

function generateMouth(params: MonsterParams): string {
  const { mouthColor, expression, hasTeeth, bodyShape } = params;
  const y = bodyShape === 'tall' ? 65 : 70;

  let mouth = '';

  switch (expression) {
    case 'happy':
      mouth = `<path d="M30,${y} Q50,${y + 15} 70,${y}" fill="none" stroke="${mouthColor}" stroke-width="4" stroke-linecap="round"/>`;
      if (hasTeeth === 'yes') {
        mouth += `
          <rect x="38" y="${y - 2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="48" y="${y - 2}" width="6" height="8" fill="white" rx="1"/>
          <rect x="58" y="${y - 2}" width="6" height="8" fill="white" rx="1"/>
        `;
      }
      break;
    case 'angry':
      mouth = `<path d="M30,${y + 5} Q50,${y - 5} 70,${y + 5}" fill="none" stroke="${mouthColor}" stroke-width="4" stroke-linecap="round"/>`;
      if (hasTeeth === 'yes') {
        mouth += `
          <polygon points="35,${y + 3} 38,${y + 10} 41,${y + 3}" fill="white"/>
          <polygon points="47,${y + 1} 50,${y + 8} 53,${y + 1}" fill="white"/>
          <polygon points="59,${y + 3} 62,${y + 10} 65,${y + 3}" fill="white"/>
        `;
      }
      break;
    case 'surprised':
      mouth = `<ellipse cx="50" cy="${y + 5}" rx="10" ry="12" fill="${mouthColor}"/>`;
      break;
    case 'silly':
      mouth = `<path d="M30,${y} Q40,${y + 10} 50,${y} Q60,${y - 10} 70,${y}" fill="none" stroke="${mouthColor}" stroke-width="4" stroke-linecap="round"/>`;
      if (hasTeeth === 'yes') {
        mouth += `<rect x="45" y="${y - 8}" width="10" height="12" fill="white" rx="2"/>`;
      }
      break;
  }

  return mouth;
}

function generateHorns(params: MonsterParams): string {
  const { bodyColor, hasHorns, bodyShape } = params;

  if (hasHorns === 'no') return '';

  const hornColor = darkenColor(bodyColor, 45);
  const hornHighlight = lightenColor(bodyColor, 12);

  const isTall = bodyShape === 'tall';
  const headTopY =
    bodyShape === 'tall'
      ? 8
      : bodyShape === 'square'
        ? 20
        : bodyShape === 'round'
          ? 17
          : 10;
  const baseY = headTopY + 4;
  const spread = isTall ? 10 : 16;
  const leftX = 50 - spread;
  const rightX = 50 + spread;

  switch (hasHorns) {
    case 'spikes': {
      const spikeHeight = isTall ? 13 : 15;
      const spikeWidth = isTall ? 10 : 12;
      const spikeYOffset = 2;
      const spikeBottom = baseY + 6 + spikeYOffset;
      const spikeTop = baseY - spikeHeight + spikeYOffset;
      const half = spikeWidth / 2;
      const innerHalf = spikeWidth / 4;

      return `
        <polygon points="${leftX - half},${spikeBottom} ${leftX},${spikeTop} ${leftX + half},${spikeBottom}" fill="${hornColor}"/>
        <polygon points="${leftX - innerHalf},${spikeBottom - 1} ${leftX},${spikeTop + 3} ${leftX + innerHalf},${spikeBottom - 1}" fill="${hornHighlight}" opacity="0.7"/>
        <polygon points="${rightX - half},${spikeBottom} ${rightX},${spikeTop} ${rightX + half},${spikeBottom}" fill="${hornColor}"/>
        <polygon points="${rightX - innerHalf},${spikeBottom - 1} ${rightX},${spikeTop + 3} ${rightX + innerHalf},${spikeBottom - 1}" fill="${hornHighlight}" opacity="0.7"/>
      `;
    }
    case 'curved': {
      const curveHeight = isTall ? 9 : 11;
      const curveOut = isTall ? 8 : 10;
      const curveIn = isTall ? 4 : 6;
      const curveBottom = baseY + 5;
      const strokeWidth = isTall ? 5 : 6;
      const highlightWidth = strokeWidth - 2;

      const leftPath = `M ${leftX - 2},${curveBottom} C ${leftX - curveOut},${baseY + 2} ${leftX - curveOut},${baseY - curveHeight} ${leftX + curveIn},${baseY - curveHeight + 2}`;
      const rightPath = `M ${rightX + 2},${curveBottom} C ${rightX + curveOut},${baseY + 2} ${rightX + curveOut},${baseY - curveHeight} ${rightX - curveIn},${baseY - curveHeight + 2}`;

      return `
        <path d="${leftPath}" fill="none" stroke="${hornColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${rightPath}" fill="none" stroke="${hornColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${leftPath}" fill="none" stroke="${hornHighlight}" stroke-width="${highlightWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${rightPath}" fill="none" stroke="${hornHighlight}" stroke-width="${highlightWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `;
    }
    case 'antlers': {
      const antlerHeight = isTall ? 8 : 10;
      const antlerOut = isTall ? 8 : 10;
      const branch = isTall ? 5 : 6;
      const strokeWidth = isTall ? 3 : 4;
      const highlightWidth = strokeWidth - 1;

      const leftPath = [
        `M ${leftX},${baseY + 6} L ${leftX - 4},${baseY - 4} L ${leftX - antlerOut},${baseY - antlerHeight}`,
        `M ${leftX - 4},${baseY - 2} L ${leftX - 4 - branch},${baseY - 2}`,
        `M ${leftX - 6},${baseY - 6} L ${leftX - 6 - branch},${baseY - 6}`,
      ].join(' ');
      const rightPath = [
        `M ${rightX},${baseY + 6} L ${rightX + 4},${baseY - 4} L ${rightX + antlerOut},${baseY - antlerHeight}`,
        `M ${rightX + 4},${baseY - 2} L ${rightX + 4 + branch},${baseY - 2}`,
        `M ${rightX + 6},${baseY - 6} L ${rightX + 6 + branch},${baseY - 6}`,
      ].join(' ');

      return `
        <path d="${leftPath}" fill="none" stroke="${hornColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${rightPath}" fill="none" stroke="${hornColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${leftPath}" fill="none" stroke="${hornHighlight}" stroke-width="${highlightWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
        <path d="${rightPath}" fill="none" stroke="${hornHighlight}" stroke-width="${highlightWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>
      `;
    }
    default:
      return '';
  }
}

// Scale factor to ensure monster fits within the circular background
const MONSTER_SCALE = 0.88;

export function generate(params: MonsterParams): string {
  const { backgroundShape, backgroundColor } = params;

  const content = `
    ${generateHorns(params)}
    ${generateBody(params)}
    ${generateEyes(params)}
    ${generateMouth(params)}
  `;

  // Apply scale transform centered at (50, 50) to fit within circle
  const scaledContent = `<g transform="translate(50, 50) scale(${MONSTER_SCALE}) translate(-50, -50)">${content}</g>`;

  return wrapSvgWithShape(scaledContent, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): MonsterParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const bodyShapes = ['round', 'square', 'blob', 'tall'] as const;
  const expressions = ['happy', 'angry', 'surprised', 'silly'] as const;
  const hornTypes = ['no', 'spikes', 'curved', 'antlers'] as const;
  const yesNo = ['yes', 'no'] as const;

  return {
    backgroundShape: randomPick(bgShapes, rng),
    backgroundColor: randomColor(rng),
    bodyColor: randomColor(rng),
    eyeColor: '#ffffff',
    mouthColor: randomColor(rng),
    bodyShape: randomPick(bodyShapes, rng),
    eyeCount: randomInt(1, 5, rng),
    hasHorns: randomPick(hornTypes, rng),
    hasTeeth: randomPick(yesNo, rng),
    expression: randomPick(expressions, rng),
  };
}

export const monsters: Theme<typeof schema> = {
  name: 'Monsters',
  schema,
  generate,
  randomize,
};
