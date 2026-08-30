import { palettes, type PaletteName } from '../palettes';
import type { BackgroundShape } from './types';

type ArtParams = Record<string, string | number>;

export interface ArtVariation {
  /** Stable value in [0, 1), scoped to one named drawing decision. */
  unit(key: string): number;
  /** Stable, compactly rounded value in the requested range. */
  number(key: string, min: number, max: number): number;
  /** Stable inclusive integer in the requested range. */
  int(key: string, min: number, max: number): number;
  bool(key: string, probability?: number): boolean;
  pick<T>(key: string, values: readonly T[]): T;
}

const ART_HASH_OFFSET = 0x811c9dc5;
const ART_HASH_PRIME = 0x01000193;
const OPAQUE_HEX_COLOR = /^#[\da-f]{6}$/i;

function parseHexChannels(color: string): readonly [number, number, number] {
  if (!OPAQUE_HEX_COLOR.test(color)) {
    throw new Error(`Invalid opaque hex color: ${color}`);
  }
  return [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ];
}

/**
 * Builds a solid, fill-related contour instead of applying one universal dark
 * ink to every object. Solid RGB output keeps the exported SVG identical over
 * every host surface; translucent strokes would composite differently on each
 * side of an overlapping edge.
 */
export function tonalEdge(
  fill: string,
  ink: string,
  inkAmount = 0.38,
): string {
  if (!Number.isFinite(inkAmount) || inkAmount < 0 || inkAmount > 1) {
    throw new RangeError(`Invalid tonal edge ink amount: ${inkAmount}`);
  }
  const fillChannels = parseHexChannels(fill);
  const inkChannels = parseHexChannels(ink);
  const channels = fillChannels.map((channel, index) => (
    Math.round(channel * (1 - inkAmount) + inkChannels[index]! * inkAmount)
  ));
  return `#${channels.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function artHash(value: string): number {
  let hash = ART_HASH_OFFSET;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, ART_HASH_PRIME);
  }
  return hash >>> 0;
}

/**
 * Creates small deterministic drawing decisions from an identity's semantic
 * params. Palette and frame are deliberately excluded: recoloring an avatar
 * must never move its features or change its silhouette.
 *
 * These values are intentionally not public schema fields. They act like the
 * natural hand variation an illustrator introduces while drawing the same
 * visual language repeatedly, without making the user manage dozens of tiny
 * controls or weakening reproducibility.
 */
export function createArtVariation(
  namespace: string,
  params: object,
): ArtVariation {
  const identity = Object.entries(params as ArtParams)
    .filter(([key]) => key !== 'palette' && key !== 'backgroundShape')
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0));
  const seed = `avatarka-art-v1:${namespace}:${JSON.stringify(identity)}`;
  const unit = (key: string): number => (
    (artHash(`${seed}:${key}`) + 0.5) / 0x100000000
  );

  return {
    unit,
    number(key, min, max) {
      const value = min + unit(key) * (max - min);
      return Math.round(value * 1000) / 1000;
    },
    int(key, min, max) {
      if (max < min) throw new Error(`Invalid art variation range for ${key}: ${min}..${max}`);
      return min + Math.floor(unit(key) * (max - min + 1));
    },
    bool(key, probability = 0.5) {
      return unit(key) < Math.max(0, Math.min(1, probability));
    },
    pick<T>(key: string, values: readonly T[]): T {
      if (values.length === 0) throw new Error(`Cannot pick an empty art variation: ${key}`);
      return values[Math.floor(unit(key) * values.length)]!;
    },
  };
}

interface FrameOptions {
  /** Disable the fallback crop when content already fits the frame geometrically. */
  clipContent?: boolean;
}

export function renderAvatarFrame(
  content: string,
  paletteName: PaletteName,
  backgroundShape: BackgroundShape,
  options: FrameOptions = {},
): string {
  const palette = palettes[paletteName];
  const clipContent = options.clipContent ?? true;

  let background: string;
  let contentClip = '';
  switch (backgroundShape) {
    case 'circle':
      background = `<circle cx="50" cy="50" r="50" fill="${palette.canvas}"/>`;
      if (clipContent) contentClip = ' style="clip-path:circle(50% at 50% 50%)"';
      break;
    case 'rounded':
      background = `<rect width="100" height="100" rx="22" fill="${palette.canvas}"/>`;
      if (clipContent) contentClip = ' style="clip-path:inset(0 round 22%)"';
      break;
    case 'square':
      background = `<rect width="100" height="100" fill="${palette.canvas}"/>`;
      break;
  }

  // CSS basic shapes on a <g> use that group's changing object bounding box,
  // which can move or shrink the apparent frame. Apply the fallback clip to a
  // fixed 100x100 nested viewport instead, so circle/rounded always means the
  // actual avatar canvas. Themes with geometrically fitted art keep a plain
  // group and do not pay for a clip at all.
  const framedContent = contentClip
    ? `<svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100"${contentClip}>${content}</svg>`
    : `<g>${content}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    ${background}
    ${framedContent}
  </svg>`;
}
