import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { randomColor, randomInt, randomPick, wrapSvgWithShape, type BackgroundShape } from '../utils';

export const schema = {
  backgroundShape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'rounded', 'square'],
  },
  backgroundColor: {
    type: 'color',
    default: '#3498db',
  },
  primaryColor: {
    type: 'color',
    default: '#e74c3c',
  },
  secondaryColor: {
    type: 'color',
    default: '#f39c12',
  },
  pattern: {
    type: 'select',
    default: 'triangles',
    options: ['triangles', 'circles', 'squares', 'hexagons', 'mixed'],
  },
  complexity: {
    type: 'number',
    default: 5,
    min: 3,
    max: 10,
  },
  rotation: {
    type: 'number',
    default: 0,
    min: 0,
    max: 360,
    step: 15,
  },
} as const satisfies ParamSchema;

export type GeometricParams = ParamsFromSchema<typeof schema>;

function generateTriangles(params: GeometricParams): string {
  const { primaryColor, secondaryColor, complexity } = params;
  const shapes: string[] = [];
  const colors = [primaryColor, secondaryColor];

  for (let i = 0; i < complexity; i++) {
    const x1 = 15 + (i * 70) / complexity;
    const y1 = 25 + ((i % 3) * 18);
    const x2 = x1 + 22;
    const y2 = y1 + 28;
    const x3 = x1 - 8;
    const y3 = y1 + 28;
    const color = colors[i % 2];
    shapes.push(`<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${color}" opacity="0.8"/>`);
  }

  return shapes.join('');
}

function generateCircles(params: GeometricParams): string {
  const { primaryColor, secondaryColor, complexity } = params;
  const shapes: string[] = [];
  const colors = [primaryColor, secondaryColor];

  for (let i = 0; i < complexity; i++) {
    const cx = 20 + (i * 60) / complexity;
    const cy = 30 + ((i % 3) * 20);
    const r = 10 + (i % 4) * 5;
    const color = colors[i % 2];
    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.7"/>`);
  }

  return shapes.join('');
}

function generateSquares(params: GeometricParams): string {
  const { primaryColor, secondaryColor, complexity } = params;
  const shapes: string[] = [];
  const colors = [primaryColor, secondaryColor];

  for (let i = 0; i < complexity; i++) {
    const x = 10 + (i * 70) / complexity;
    const y = 20 + ((i % 3) * 20);
    const size = 15 + (i % 3) * 5;
    const color = colors[i % 2];
    const rotation = (i * 15) % 45;
    shapes.push(`<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${color}" opacity="0.75" transform="rotate(${rotation} ${x + size / 2} ${y + size / 2})"/>`);
  }

  return shapes.join('');
}

function generateHexagons(params: GeometricParams): string {
  const { primaryColor, secondaryColor, complexity } = params;
  const shapes: string[] = [];
  const colors = [primaryColor, secondaryColor];

  for (let i = 0; i < complexity; i++) {
    const cx = 25 + (i * 50) / complexity;
    const cy = 35 + ((i % 3) * 15);
    const r = 12 + (i % 3) * 4;
    const color = colors[i % 2];

    // Generate hexagon points
    const points: string[] = [];
    for (let j = 0; j < 6; j++) {
      const angle = (Math.PI / 3) * j - Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }

    shapes.push(`<polygon points="${points.join(' ')}" fill="${color}" opacity="0.75"/>`);
  }

  return shapes.join('');
}

function generateMixed(params: GeometricParams): string {
  const { primaryColor, secondaryColor, complexity } = params;
  const shapes: string[] = [];
  const colors = [primaryColor, secondaryColor];

  for (let i = 0; i < complexity; i++) {
    const shapeType = i % 4;
    const color = colors[i % 2];
    const x = 15 + (i * 65) / complexity;
    const y = 25 + ((i % 3) * 20);

    switch (shapeType) {
      case 0:
        shapes.push(`<circle cx="${x}" cy="${y}" r="${10 + (i % 3) * 3}" fill="${color}" opacity="0.7"/>`);
        break;
      case 1:
        shapes.push(`<rect x="${x - 8}" y="${y - 8}" width="16" height="16" fill="${color}" opacity="0.75"/>`);
        break;
      case 2:
        shapes.push(`<polygon points="${x},${y - 12} ${x + 12},${y + 8} ${x - 12},${y + 8}" fill="${color}" opacity="0.8"/>`);
        break;
      case 3:
        shapes.push(`<ellipse cx="${x}" cy="${y}" rx="14" ry="8" fill="${color}" opacity="0.7"/>`);
        break;
    }
  }

  return shapes.join('');
}

// Scale factor to ensure rotated patterns fit within the circular background
const GEOMETRIC_SCALE = 0.7;

export function generate(params: GeometricParams): string {
  const { backgroundShape, backgroundColor, pattern, rotation } = params;

  let shapes: string;
  switch (pattern) {
    case 'triangles':
      shapes = generateTriangles(params);
      break;
    case 'circles':
      shapes = generateCircles(params);
      break;
    case 'squares':
      shapes = generateSquares(params);
      break;
    case 'hexagons':
      shapes = generateHexagons(params);
      break;
    case 'mixed':
    default:
      shapes = generateMixed(params);
      break;
  }

  // Apply scale transform centered at (50, 50) to fit within circle, then apply rotation
  const content = `
    <g transform="translate(50, 50) scale(${GEOMETRIC_SCALE}) translate(-50, -50)">
      <g transform="rotate(${rotation} 50 50)">
        ${shapes}
      </g>
    </g>
  `;

  return wrapSvgWithShape(content, backgroundShape as BackgroundShape, backgroundColor);
}

export function randomize(rng: () => number): GeometricParams {
  const patterns = ['triangles', 'circles', 'squares', 'hexagons', 'mixed'] as const;
  const shapes = ['circle', 'rounded', 'square'] as const;

  return {
    backgroundShape: randomPick(shapes, rng),
    backgroundColor: randomColor(rng),
    primaryColor: randomColor(rng),
    secondaryColor: randomColor(rng),
    pattern: randomPick(patterns, rng),
    complexity: randomInt(3, 10, rng),
    rotation: randomInt(0, 24, rng) * 15,
  };
}

export const geometric: Theme<typeof schema> = {
  name: 'Geometric',
  schema,
  generate,
  randomize,
};
