import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { darkenColor, lightenColor, randomColor, randomPick, randomInt, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  bodyColor: {
    type: 'color',
    default: '#95a5a6',
  },
  accentColor: {
    type: 'color',
    default: '#3498db',
  },
  eyeColor: {
    type: 'color',
    default: '#e74c3c',
  },
  backgroundColor: {
    type: 'color',
    default: '#2c3e50',
  },
  headShape: {
    type: 'select',
    default: 'square',
    options: ['square', 'round', 'tall', 'wide', 'hexagon', 'dome'],
  },
  antennaStyle: {
    type: 'select',
    default: 'single',
    options: ['single', 'double', 'none', 'dish', 'bunny', 'lightning'],
  },
  eyeStyle: {
    type: 'select',
    default: 'round',
    options: ['round', 'visor', 'led', 'camera', 'cyclops', 'angry', 'happy'],
  },
  mouthStyle: {
    type: 'select',
    default: 'grille',
    options: ['grille', 'speaker', 'smile', 'none', 'zigzag', 'dots', 'rectangle'],
  },
  hasPanel: {
    type: 'select',
    default: 'no',
    options: ['yes', 'no'],
  },
  panelLights: {
    type: 'number',
    default: 3,
    min: 1,
    max: 5,
  },
} as const satisfies ParamSchema;

export type RobotParams = ParamsFromSchema<typeof schema>;

function generateAntenna(params: RobotParams): string {
  const { accentColor, antennaStyle, headShape } = params;
  const darkAccent = darkenColor(accentColor, 30);
  const lightAccent = lightenColor(accentColor, 40);

  const baseY = headShape === 'tall' ? 8 : headShape === 'round' || headShape === 'dome' ? 15 : headShape === 'hexagon' ? 12 : 18;

  switch (antennaStyle) {
    case 'single':
      return `
        <line x1="50" y1="${baseY}" x2="50" y2="${baseY - 12}" stroke="${accentColor}" stroke-width="3"/>
        <circle cx="50" cy="${baseY - 14}" r="4" fill="${accentColor}"/>
        <circle cx="50" cy="${baseY - 14}" r="2" fill="${lightAccent}"/>
      `;
    case 'double':
      return `
        <line x1="35" y1="${baseY}" x2="35" y2="${baseY - 10}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="35" cy="${baseY - 12}" r="3" fill="${accentColor}"/>
        <line x1="65" y1="${baseY}" x2="65" y2="${baseY - 10}" stroke="${accentColor}" stroke-width="2"/>
        <circle cx="65" cy="${baseY - 12}" r="3" fill="${accentColor}"/>
      `;
    case 'dish':
      return `
        <line x1="50" y1="${baseY}" x2="50" y2="${baseY - 8}" stroke="${accentColor}" stroke-width="3"/>
        <ellipse cx="50" cy="${baseY - 10}" rx="12" ry="5" fill="${accentColor}"/>
        <ellipse cx="50" cy="${baseY - 11}" rx="8" ry="3" fill="${darkAccent}"/>
      `;
    case 'bunny':
      return `
        <ellipse cx="38" cy="${baseY - 4}" rx="4" ry="9" fill="${accentColor}"/>
        <ellipse cx="38" cy="${baseY - 4}" rx="2.5" ry="6" fill="${lightAccent}" opacity="0.5"/>
        <ellipse cx="62" cy="${baseY - 4}" rx="4" ry="9" fill="${accentColor}"/>
        <ellipse cx="62" cy="${baseY - 4}" rx="2.5" ry="6" fill="${lightAccent}" opacity="0.5"/>
      `;
    case 'lightning':
      return `
        <path d="M45,${baseY - 15} L50,${baseY - 8} L45,${baseY - 8} L50,${baseY}" fill="${accentColor}"/>
        <path d="M55,${baseY - 15} L50,${baseY - 8} L55,${baseY - 8} L50,${baseY}" fill="${accentColor}" transform="scale(-1,1) translate(-100,0)"/>
      `;
    default:
      return '';
  }
}

function generateHead(params: RobotParams): string {
  const { bodyColor, headShape } = params;
  const darkBody = darkenColor(bodyColor, 25);
  const lightBody = lightenColor(bodyColor, 30);

  switch (headShape) {
    case 'square':
      return `
        <rect x="18" y="18" width="64" height="64" rx="8" fill="${bodyColor}"/>
        <rect x="22" y="22" width="56" height="56" rx="6" fill="${darkBody}" opacity="0.3"/>
        <rect x="22" y="22" width="56" height="8" fill="${lightBody}" opacity="0.5"/>
      `;
    case 'round':
      return `
        <circle cx="50" cy="50" r="38" fill="${bodyColor}"/>
        <circle cx="50" cy="50" r="32" fill="${darkBody}" opacity="0.3"/>
        <ellipse cx="50" cy="35" rx="25" ry="10" fill="${lightBody}" opacity="0.5"/>
      `;
    case 'tall':
      return `
        <rect x="22" y="8" width="56" height="80" rx="10" fill="${bodyColor}"/>
        <rect x="26" y="12" width="48" height="72" rx="8" fill="${darkBody}" opacity="0.3"/>
        <rect x="26" y="12" width="48" height="10" fill="${lightBody}" opacity="0.5"/>
      `;
    case 'wide':
      return `
        <rect x="8" y="28" width="84" height="52" rx="8" fill="${bodyColor}"/>
        <rect x="12" y="32" width="76" height="44" rx="6" fill="${darkBody}" opacity="0.3"/>
        <rect x="12" y="32" width="76" height="8" fill="${lightBody}" opacity="0.5"/>
      `;
    case 'hexagon':
      return `
        <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="${bodyColor}"/>
        <polygon points="50,15 80,33 80,67 50,85 20,67 20,33" fill="${darkBody}" opacity="0.3"/>
        <polygon points="50,15 80,33 80,40 50,25 20,40 20,33" fill="${lightBody}" opacity="0.5"/>
      `;
    case 'dome':
      return `
        <path d="M15,60 L15,45 Q15,10 50,10 Q85,10 85,45 L85,60 Q85,85 50,85 Q15,85 15,60" fill="${bodyColor}"/>
        <path d="M20,58 L20,45 Q20,18 50,18 Q80,18 80,45 L80,58 Q80,78 50,78 Q20,78 20,58" fill="${darkBody}" opacity="0.3"/>
        <ellipse cx="50" cy="30" rx="25" ry="12" fill="${lightBody}" opacity="0.5"/>
      `;
    default:
      return '';
  }
}

function generateEyes(params: RobotParams): string {
  const { eyeColor, eyeStyle, headShape } = params;
  const lightEye = lightenColor(eyeColor, 40);

  const eyeY = headShape === 'tall' ? 35 : headShape === 'wide' ? 48 : headShape === 'hexagon' ? 45 : headShape === 'dome' ? 40 : 42;

  switch (eyeStyle) {
    case 'round':
      return `
        <circle cx="35" cy="${eyeY}" r="10" fill="#1a1a2e"/>
        <circle cx="65" cy="${eyeY}" r="10" fill="#1a1a2e"/>
        <circle cx="35" cy="${eyeY}" r="6" fill="${eyeColor}"/>
        <circle cx="65" cy="${eyeY}" r="6" fill="${eyeColor}"/>
        <circle cx="33" cy="${eyeY - 2}" r="2" fill="${lightEye}"/>
        <circle cx="63" cy="${eyeY - 2}" r="2" fill="${lightEye}"/>
      `;
    case 'visor':
      return `
        <rect x="22" y="${eyeY - 8}" width="56" height="16" rx="4" fill="#1a1a2e"/>
        <rect x="25" y="${eyeY - 5}" width="50" height="10" rx="2" fill="${eyeColor}" opacity="0.8"/>
        <rect x="25" y="${eyeY - 5}" width="50" height="3" fill="${lightEye}" opacity="0.5"/>
      `;
    case 'led':
      return `
        <rect x="28" y="${eyeY - 6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="60" y="${eyeY - 6}" width="12" height="12" rx="2" fill="#1a1a2e"/>
        <rect x="30" y="${eyeY - 4}" width="8" height="8" fill="${eyeColor}"/>
        <rect x="62" y="${eyeY - 4}" width="8" height="8" fill="${eyeColor}"/>
        <rect x="30" y="${eyeY - 4}" width="8" height="2" fill="${lightEye}"/>
        <rect x="62" y="${eyeY - 4}" width="8" height="2" fill="${lightEye}"/>
      `;
    case 'camera':
      return `
        <circle cx="35" cy="${eyeY}" r="12" fill="#1a1a2e"/>
        <circle cx="65" cy="${eyeY}" r="12" fill="#1a1a2e"/>
        <circle cx="35" cy="${eyeY}" r="8" fill="#2c3e50"/>
        <circle cx="65" cy="${eyeY}" r="8" fill="#2c3e50"/>
        <circle cx="35" cy="${eyeY}" r="4" fill="${eyeColor}"/>
        <circle cx="65" cy="${eyeY}" r="4" fill="${eyeColor}"/>
        <circle cx="33" cy="${eyeY - 2}" r="1.5" fill="white" opacity="0.8"/>
        <circle cx="63" cy="${eyeY - 2}" r="1.5" fill="white" opacity="0.8"/>
      `;
    case 'cyclops':
      return `
        <circle cx="50" cy="${eyeY}" r="15" fill="#1a1a2e"/>
        <circle cx="50" cy="${eyeY}" r="10" fill="${eyeColor}"/>
        <circle cx="50" cy="${eyeY}" r="5" fill="#1a1a2e"/>
        <circle cx="47" cy="${eyeY - 3}" r="3" fill="${lightEye}"/>
      `;
    case 'angry':
      return `
        <polygon points="25,${eyeY - 5} 45,${eyeY - 10} 45,${eyeY + 5} 25,${eyeY + 5}" fill="#1a1a2e"/>
        <polygon points="75,${eyeY - 5} 55,${eyeY - 10} 55,${eyeY + 5} 75,${eyeY + 5}" fill="#1a1a2e"/>
        <circle cx="35" cy="${eyeY}" r="5" fill="${eyeColor}"/>
        <circle cx="65" cy="${eyeY}" r="5" fill="${eyeColor}"/>
      `;
    case 'happy':
      return `
        <path d="M25,${eyeY} Q35,${eyeY - 12} 45,${eyeY}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <path d="M55,${eyeY} Q65,${eyeY - 12} 75,${eyeY}" stroke="#1a1a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
        <circle cx="35" cy="${eyeY - 3}" r="3" fill="${eyeColor}"/>
        <circle cx="65" cy="${eyeY - 3}" r="3" fill="${eyeColor}"/>
      `;
    default:
      return '';
  }
}

function generateMouth(params: RobotParams): string {
  const { accentColor, mouthStyle, headShape } = params;
  const darkAccent = darkenColor(accentColor, 20);

  const mouthY = headShape === 'tall' ? 65 : headShape === 'wide' ? 65 : headShape === 'hexagon' ? 68 : headShape === 'dome' ? 62 : 65;

  switch (mouthStyle) {
    case 'grille':
      return `
        <rect x="32" y="${mouthY}" width="36" height="12" rx="2" fill="#1a1a2e"/>
        <line x1="35" y1="${mouthY + 2}" x2="35" y2="${mouthY + 10}" stroke="${accentColor}" stroke-width="2"/>
        <line x1="42" y1="${mouthY + 2}" x2="42" y2="${mouthY + 10}" stroke="${accentColor}" stroke-width="2"/>
        <line x1="50" y1="${mouthY + 2}" x2="50" y2="${mouthY + 10}" stroke="${accentColor}" stroke-width="2"/>
        <line x1="58" y1="${mouthY + 2}" x2="58" y2="${mouthY + 10}" stroke="${accentColor}" stroke-width="2"/>
        <line x1="65" y1="${mouthY + 2}" x2="65" y2="${mouthY + 10}" stroke="${accentColor}" stroke-width="2"/>
      `;
    case 'speaker':
      return `
        <circle cx="50" cy="${mouthY + 6}" r="10" fill="#1a1a2e"/>
        <circle cx="50" cy="${mouthY + 6}" r="7" fill="${darkAccent}"/>
        <circle cx="50" cy="${mouthY + 6}" r="3" fill="${accentColor}"/>
      `;
    case 'smile':
      return `
        <path d="M35,${mouthY + 2} Q50,${mouthY + 15} 65,${mouthY + 2}" stroke="${accentColor}" stroke-width="3" fill="none" stroke-linecap="round"/>
      `;
    case 'zigzag':
      return `
        <path d="M30,${mouthY + 5} L38,${mouthY} L46,${mouthY + 10} L54,${mouthY} L62,${mouthY + 10} L70,${mouthY + 5}" stroke="${accentColor}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    case 'dots':
      return `
        <circle cx="35" cy="${mouthY + 6}" r="4" fill="${accentColor}"/>
        <circle cx="50" cy="${mouthY + 6}" r="4" fill="${accentColor}"/>
        <circle cx="65" cy="${mouthY + 6}" r="4" fill="${accentColor}"/>
      `;
    case 'rectangle':
      return `
        <rect x="35" y="${mouthY}" width="30" height="10" rx="2" fill="#1a1a2e"/>
        <rect x="38" y="${mouthY + 2}" width="24" height="6" fill="${accentColor}"/>
      `;
    default:
      return '';
  }
}

function generateDetails(params: RobotParams): string {
  const { bodyColor, accentColor, headShape, hasPanel, panelLights } = params;
  const darkBody = darkenColor(bodyColor, 30);
  const lightAccent = lightenColor(accentColor, 30);

  // Bolts/rivets positions based on head shape
  let bolts = '';
  if (headShape === 'square') {
    bolts = `
      <circle cx="25" cy="25" r="3" fill="${darkBody}"/>
      <circle cx="75" cy="25" r="3" fill="${darkBody}"/>
      <circle cx="25" cy="75" r="3" fill="${darkBody}"/>
      <circle cx="75" cy="75" r="3" fill="${darkBody}"/>
    `;
  } else if (headShape === 'tall') {
    bolts = `
      <circle cx="30" cy="15" r="3" fill="${darkBody}"/>
      <circle cx="70" cy="15" r="3" fill="${darkBody}"/>
      <circle cx="30" cy="80" r="3" fill="${darkBody}"/>
      <circle cx="70" cy="80" r="3" fill="${darkBody}"/>
    `;
  } else if (headShape === 'wide') {
    bolts = `
      <circle cx="15" cy="35" r="3" fill="${darkBody}"/>
      <circle cx="85" cy="35" r="3" fill="${darkBody}"/>
      <circle cx="15" cy="70" r="3" fill="${darkBody}"/>
      <circle cx="85" cy="70" r="3" fill="${darkBody}"/>
    `;
  } else if (headShape === 'hexagon' || headShape === 'dome') {
    bolts = `
      <circle cx="30" cy="35" r="3" fill="${darkBody}"/>
      <circle cx="70" cy="35" r="3" fill="${darkBody}"/>
    `;
  }

  // Panel with lights
  let panel = '';
  if (hasPanel === 'yes') {
    const panelY = headShape === 'tall' ? 75 : headShape === 'dome' ? 68 : 78;
    panel = `<rect x="30" y="${panelY}" width="40" height="8" rx="2" fill="${darkBody}"/>`;
    const lightSpacing = 36 / (panelLights + 1);
    for (let i = 1; i <= panelLights; i++) {
      const lightX = 32 + lightSpacing * i;
      const colors = [accentColor, lightAccent, '#2ecc71', '#e74c3c', '#f39c12'];
      panel += `<circle cx="${lightX}" cy="${panelY + 4}" r="2" fill="${colors[(i - 1) % colors.length]}"/>`;
    }
  }

  return bolts + panel;
}

function generateEars(params: RobotParams): string {
  const { bodyColor, accentColor, headShape } = params;
  const darkBody = darkenColor(bodyColor, 30);

  if (headShape === 'wide' || headShape === 'hexagon') {
    return '';
  }

  const earY = headShape === 'tall' ? 40 : headShape === 'round' || headShape === 'dome' ? 48 : 45;

  return `
    <rect x="5" y="${earY - 8}" width="10" height="16" rx="2" fill="${bodyColor}"/>
    <rect x="85" y="${earY - 8}" width="10" height="16" rx="2" fill="${bodyColor}"/>
    <rect x="7" y="${earY - 6}" width="6" height="12" rx="1" fill="${darkBody}" opacity="0.5"/>
    <rect x="87" y="${earY - 6}" width="6" height="12" rx="1" fill="${darkBody}" opacity="0.5"/>
    <circle cx="10" cy="${earY}" r="2" fill="${accentColor}"/>
    <circle cx="90" cy="${earY}" r="2" fill="${accentColor}"/>
  `;
}

// Scale factor to ensure robot fits within the circular background
const ROBOT_SCALE = 0.85;

export function generate(params: RobotParams): string {
  const { backgroundShape, backgroundColor } = params;

  const innerContent = `
    ${generateAntenna(params)}
    ${generateEars(params)}
    ${generateHead(params)}
    ${generateEyes(params)}
    ${generateMouth(params)}
    ${generateDetails(params)}
  `;

  // Apply scale transform centered at (50, 50) to fit within circle
  const content = `
    <g transform="translate(50, 50) scale(${ROBOT_SCALE}) translate(-50, -50)">
      ${innerContent}
    </g>
  `;

  return wrapSvgWithShape(content, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): RobotParams {
  const bgShapes = ['circle', 'rounded', 'square'] as const;
  const headShapes = ['square', 'round', 'tall', 'wide', 'hexagon', 'dome'] as const;
  const antennaStyles = ['single', 'double', 'none', 'dish', 'bunny', 'lightning'] as const;
  const eyeStyles = ['round', 'visor', 'led', 'camera', 'cyclops', 'angry', 'happy'] as const;
  const mouthStyles = ['grille', 'speaker', 'smile', 'none', 'zigzag', 'dots', 'rectangle'] as const;
  const yesNo = ['yes', 'no'] as const;

  // Metallic colors for body - more variety
  const bodyColors = [
    '#95a5a6', '#7f8c8d', '#bdc3c7', '#34495e',
    '#5d6d7e', '#aab7b8', '#839192', '#616a6b',
    '#2c3e50', '#1abc9c', '#e74c3c', '#9b59b6',
    '#f39c12', '#d35400', '#c0392b', '#8e44ad',
  ];

  return {
    backgroundShape: randomPick(bgShapes, rng),
    bodyColor: randomPick(bodyColors, rng),
    accentColor: randomColor(rng),
    eyeColor: randomColor(rng),
    backgroundColor: randomColor(rng),
    headShape: randomPick(headShapes, rng),
    antennaStyle: randomPick(antennaStyles, rng),
    eyeStyle: randomPick(eyeStyles, rng),
    mouthStyle: randomPick(mouthStyles, rng),
    hasPanel: randomPick(yesNo, rng),
    panelLights: randomInt(1, 5, rng),
  };
}

export const robots: Theme<typeof schema> = {
  name: 'Robots',
  schema,
  generate,
  randomize,
};
