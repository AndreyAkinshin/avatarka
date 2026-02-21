import { createRng } from './prng';
import { themes, type ThemeName, type ThemeParams } from './themes';

// Re-export types
export type {
  ParamSchema,
  ParamDefinition,
  ColorParam,
  NumberParam,
  SelectParam,
  ParamsFromSchema,
  Theme,
  AvatarParams,
} from './types';

export type {
  ThemeName,
  ThemeMap,
  ThemeParams,
  ThemeParamsMap,
  PeopleParams,
  AnimalParams,
  MonsterParams,
  RobotParams,
  AliensParams,
  OceanParams,
} from './themes';

// Export themes
export { themes };

// Export PRNG utilities for advanced users
export { createRng, mulberry32, stringToSeed } from './prng';

// Export utility functions
export {
  hslToHex,
  randomColor,
  randomPastelColor,
  darkenColor,
  lightenColor,
} from './utils';

/**
 * Generate an SVG avatar string for the given theme and parameters
 *
 * @param theme - The theme name to use
 * @param params - The parameters for the avatar (must match theme schema)
 * @returns SVG string
 *
 * @example
 * ```ts
 * const svg = generateAvatar('monsters', {
 *   bodyColor: '#9b59b6',
 *   eyeColor: '#ffffff',
 *   mouthColor: '#c0392b',
 *   bodyShape: 'round',
 *   eyeCount: 2,
 *   hasHorns: 'spikes',
 *   hasTeeth: 'yes',
 *   expression: 'happy',
 * });
 * ```
 */
export function generateAvatar<T extends ThemeName>(
  theme: T,
  params: ThemeParams<T>
): string {
  const themeObj = themes[theme];
  if (!themeObj) {
    throw new Error(`Unknown theme: ${theme}`);
  }
  return (themeObj.generate as (p: ThemeParams<T>) => string)(params);
}

/**
 * Generate random parameters for a theme, optionally with a seed for determinism
 *
 * @param theme - The theme name to generate parameters for
 * @param seed - Optional seed (string or number) for deterministic generation
 * @returns Parameters object suitable for the theme
 *
 * @example
 * ```ts
 * // Random each time
 * const params1 = generateParams('monsters');
 *
 * // Deterministic based on seed
 * const params2 = generateParams('monsters', 'user@email.com');
 * const params3 = generateParams('monsters', 'user@email.com');
 * // params2 and params3 will be identical
 * ```
 */
export function generateParams<T extends ThemeName>(
  theme: T,
  seed?: string | number
): ThemeParams<T> {
  const themeObj = themes[theme];
  if (!themeObj) {
    throw new Error(`Unknown theme: ${theme}`);
  }

  const rng = createRng(seed);
  return themeObj.randomize(rng) as ThemeParams<T>;
}

/**
 * Get the default parameters for a theme (from schema defaults)
 *
 * @param theme - The theme name
 * @returns Default parameters object
 */
export function getDefaultParams<T extends ThemeName>(theme: T): ThemeParams<T> {
  const themeObj = themes[theme];
  if (!themeObj) {
    throw new Error(`Unknown theme: ${theme}`);
  }

  const defaults: Record<string, string | number> = {};
  for (const [key, def] of Object.entries(themeObj.schema)) {
    defaults[key] = def.default;
  }
  return defaults as ThemeParams<T>;
}

/**
 * Convenience function to generate a random avatar SVG in one call
 *
 * @param theme - The theme name
 * @param seed - Optional seed for determinism
 * @returns SVG string
 *
 * @example
 * ```ts
 * const svg = randomAvatar('animals', 'unique-user-id');
 * ```
 */
export function randomAvatar(
  theme: ThemeName,
  seed?: string | number
): string {
  const params = generateParams(theme, seed);
  return generateAvatar(theme, params);
}

/**
 * Get list of available theme names
 */
export function getThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}

/**
 * Get theme metadata (name and schema)
 */
export function getTheme<T extends ThemeName>(theme: T) {
  const themeObj = themes[theme];
  if (!themeObj) {
    throw new Error(`Unknown theme: ${theme}`);
  }
  return {
    name: themeObj.name,
    schema: themeObj.schema,
  } as { name: string; schema: (typeof themes)[T]['schema'] };
}

/**
 * A single gallery item: theme + params + pre-rendered SVG
 */
export interface GalleryItem {
  theme: ThemeName;
  params: Record<string, string | number>;
  svg: string;
}

export interface GenerateGalleryOptions {
  /** Force background shape for all items (e.g. 'circle') */
  backgroundShape?: string;
  /** Force transparent background for all items */
  transparentBackground?: boolean;
}

/**
 * Generate a diverse gallery of N avatars with guaranteed visual variety.
 *
 * Rules:
 * - Exactly 1 avatar from the 'people' theme
 * - No two avatars share the same (theme, shape) combination
 * - If count exceeds available unique shapes, remaining slots are filled randomly
 *
 * @param count - Number of avatars to generate
 * @param seed - Optional seed for deterministic generation
 * @param options - Additional options
 * @returns Array of gallery items
 */
export function generateGallery(
  count: number,
  seed?: string | number,
  options?: GenerateGalleryOptions,
): GalleryItem[] {
  if (count <= 0) return [];

  const rng = createRng(seed);
  const themeNames = getThemeNames();

  // Build pool of all (theme, shapeValue) pairs
  type ShapeSlot = { theme: ThemeName; shapeParam: string; shapeValue: string };
  const peopleSlots: ShapeSlot[] = [];
  const otherSlots: ShapeSlot[] = [];

  for (const name of themeNames) {
    const themeObj = themes[name];
    const paramName = themeObj.shapeParam as string;
    const paramDef = (themeObj.schema as Record<string, { type: string; options?: string[] }>)[paramName];
    if (!paramDef || paramDef.type !== 'select' || !paramDef.options) continue;

    const slots = name === 'people' ? peopleSlots : otherSlots;
    for (const opt of paramDef.options) {
      slots.push({ theme: name, shapeParam: paramName, shapeValue: opt });
    }
  }

  // Fisher-Yates shuffle using our RNG
  function shuffle<U>(arr: U[]): U[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i]!;
      a[i] = a[j]!;
      a[j] = tmp;
    }
    return a;
  }

  // Pick exactly 1 people slot
  const shuffledPeople = shuffle(peopleSlots);
  const pickedPeople = shuffledPeople.length > 0 ? shuffledPeople[0]! : undefined;

  // Pick up to (count - 1) unique non-people slots
  const shuffledOther = shuffle(otherSlots);
  const needed = count - 1;
  const pickedOther = shuffledOther.slice(0, Math.min(needed, shuffledOther.length));

  // Combine and shuffle order
  const allSlots: ShapeSlot[] = shuffle(
    pickedPeople ? [pickedPeople, ...pickedOther] : [...pickedOther],
  );

  // If we still need more items, fill with random avatars
  const extra = count - allSlots.length;
  const extraItems: GalleryItem[] = [];
  if (extra > 0) {
    for (let i = 0; i < extra; i++) {
      const t = themeNames[Math.floor(rng() * themeNames.length)]!;
      const params = generateParams(t);
      applyOptions(params as Record<string, string | number>, options);
      extraItems.push({
        theme: t,
        params: params as Record<string, string | number>,
        svg: generateAvatar(t, params),
      });
    }
  }

  // Generate params for each picked slot, forcing the shape value
  const items: GalleryItem[] = allSlots.map((slot) => {
    const themeObj = themes[slot.theme];
    const params = themeObj.randomize(rng) as Record<string, string | number>;
    params[slot.shapeParam] = slot.shapeValue;
    applyOptions(params, options);
    return {
      theme: slot.theme,
      params,
      svg: generateAvatar(slot.theme, params as ThemeParams<typeof slot.theme>),
    };
  });

  return [...items, ...extraItems];
}

function applyOptions(
  params: Record<string, string | number>,
  options?: GenerateGalleryOptions,
): void {
  if (options?.backgroundShape) {
    params.backgroundShape = options.backgroundShape;
  }
  if (options?.transparentBackground) {
    params.backgroundColor = 'none';
  }
}

// PNG Generation (Browser-only)

/**
 * Options for PNG generation
 */
export interface PngOptions {
  /** Output size in pixels (width and height). Default: 256 */
  size?: number;
}

/**
 * Convert an SVG string to a PNG Blob using the Canvas API.
 *
 * **Browser-only**: This function requires a browser environment with Canvas support.
 * It will throw an error if called in Node.js.
 *
 * @param svg - The SVG string to convert
 * @param options - PNG output options
 * @returns Promise resolving to a PNG Blob
 *
 * @example
 * ```ts
 * const svg = generateAvatar('monsters', params);
 * const blob = await svgToPng(svg, { size: 512 });
 *
 * // Download the PNG
 * const url = URL.createObjectURL(blob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'avatar.png';
 * a.click();
 * URL.revokeObjectURL(url);
 * ```
 */
export function svgToPng(svg: string, options?: PngOptions): Promise<Blob> {
  if (typeof document === 'undefined') {
    throw new Error(
      'svgToPng requires a browser environment (Canvas API). ' +
        'This function cannot be used in Node.js.'
    );
  }

  const { size = 256 } = options ?? {};

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas 2D context'));
      return;
    }

    const img = new Image();

    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to PNG blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG into image'));
    };

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    img.src = URL.createObjectURL(svgBlob);
  });
}

/**
 * Convert an SVG string to a PNG data URL using the Canvas API.
 *
 * **Browser-only**: This function requires a browser environment with Canvas support.
 * It will throw an error if called in Node.js.
 *
 * @param svg - The SVG string to convert
 * @param options - PNG output options
 * @returns Promise resolving to a data URL string (e.g., "data:image/png;base64,...")
 *
 * @example
 * ```ts
 * const svg = generateAvatar('animals', params);
 * const dataUrl = await svgToPngDataUrl(svg, { size: 128 });
 *
 * // Use in an img element
 * const img = document.createElement('img');
 * img.src = dataUrl;
 * ```
 */
export async function svgToPngDataUrl(
  svg: string,
  options?: PngOptions
): Promise<string> {
  const blob = await svgToPng(svg, options);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read blob as data URL'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read blob'));
    };
    reader.readAsDataURL(blob);
  });
}
