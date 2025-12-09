/**
 * Utility functions for SVG generation
 */

/**
 * Converts HSL values to hex color string
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generates a random color using the provided RNG
 */
export function randomColor(rng: () => number): string {
  const h = Math.floor(rng() * 360);
  const s = 50 + Math.floor(rng() * 40); // 50-90%
  const l = 40 + Math.floor(rng() * 30); // 40-70%
  return hslToHex(h, s, l);
}

/**
 * Generates a random pastel color
 */
export function randomPastelColor(rng: () => number): string {
  const h = Math.floor(rng() * 360);
  const s = 40 + Math.floor(rng() * 30); // 40-70%
  const l = 70 + Math.floor(rng() * 20); // 70-90%
  return hslToHex(h, s, l);
}

/**
 * Generates a darker variant of a hex color
 */
export function darkenColor(hex: string, amount: number = 20): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Generates a lighter variant of a hex color
 */
export function lightenColor(hex: string, amount: number = 20): string {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + amount);
  const b = Math.min(255, (num & 0x0000ff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Pick a random item from an array
 */
export function randomPick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

/**
 * Generate a random integer in range [min, max]
 */
export function randomInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Generate a random float in range [min, max]
 */
export function randomFloat(min: number, max: number, rng: () => number): number {
  return rng() * (max - min) + min;
}

/**
 * SVG wrapper helper
 */
export function wrapSvg(content: string, size: number = 100): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${content}</svg>`;
}

export type BackgroundShape = 'circle' | 'rounded' | 'square';

/**
 * Generate a deterministic hash from a string.
 * Uses a simple djb2 hash algorithm.
 */
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  // Convert to unsigned 32-bit integer and then to hex
  return (hash >>> 0).toString(16);
}

/**
 * Generate a deterministic clip path ID based on inputs.
 * Same inputs will always produce the same ID for deterministic SVG output.
 */
function generateDeterministicClipId(shape: BackgroundShape, color: string, content: string): string {
  const hash = hashString(`${shape}:${color}:${content}`);
  return `clip-${shape}-${hash}`;
}

/**
 * Generate background shape with optional clipping
 */
export function generateBackgroundShape(
  shape: BackgroundShape,
  color: string,
  size: number = 100,
  contentHash: string = ''
): { background: string; clipPath: string; clipId: string } {
  // Generate deterministic ID based on inputs for consistent SVG output
  const clipId = generateDeterministicClipId(shape, color, contentHash);

  let background: string;
  let clipPath: string;

  switch (shape) {
    case 'circle':
      background = `<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="${color}"/>`;
      clipPath = `<clipPath id="${clipId}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></clipPath>`;
      break;
    case 'rounded':
      background = `<rect width="${size}" height="${size}" rx="15" fill="${color}"/>`;
      clipPath = `<clipPath id="${clipId}"><rect width="${size}" height="${size}" rx="15"/></clipPath>`;
      break;
    case 'square':
    default:
      background = `<rect width="${size}" height="${size}" fill="${color}"/>`;
      clipPath = `<clipPath id="${clipId}"><rect width="${size}" height="${size}"/></clipPath>`;
      break;
  }

  return { background, clipPath, clipId };
}

/**
 * Wrap content in an SVG with background shape.
 *
 * Content is placed on top of the background shape without clipping,
 * allowing elements like ears or antennas to extend beyond the shape boundary.
 */
export function wrapSvgWithShape(
  content: string,
  shape: BackgroundShape,
  backgroundColor: string,
  size: number = 100
): string {
  const { background } = generateBackgroundShape(shape, backgroundColor, size, content);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    ${background}
    <g>${content}</g>
  </svg>`;
}
