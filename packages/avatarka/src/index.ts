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
  DinosaurParams,
  MythicalParams,
  InsectsParams,
  BirdsParams,
} from './themes';

// Export themes
export { themes };

// Export PRNG utilities for advanced users
export { createRng, Rng } from './prng';

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
 * Algorithm:
 * - Exactly 1 avatar from the 'people' theme
 * - Round-robin theme distribution for maximum theme spread
 * - No two avatars share the same value for any field, except exempt
 *   values ('none', 'no') which represent absence of a feature
 * - Colors are adjusted (lighten/darken) to avoid exact duplicates
 * - Graceful degradation when all options for a field are exhausted
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
  const usedValues = new Map<string, Set<string | number>>();

  type Slot = { theme: ThemeName; shapeValue: string };
  type SchemaDef = { type: string; options?: readonly string[]; min?: number; max?: number; step?: number };

  function isExempt(value: string | number): boolean {
    return value === 'none' || value === 'no';
  }

  function markUsed(field: string, value: string | number): void {
    if (isExempt(value)) return;
    let set = usedValues.get(field);
    if (!set) {
      set = new Set();
      usedValues.set(field, set);
    }
    set.add(value);
  }

  function isUsed(field: string, value: string | number): boolean {
    if (isExempt(value)) return false;
    return usedValues.get(field)?.has(value) ?? false;
  }

  function pickUnusedOption(field: string, opts: readonly string[]): string {
    const available = opts.filter(v => !isUsed(field, v));
    if (available.length > 0) return available[rng.uniformInt(0, available.length)]!;
    return opts[rng.uniformInt(0, opts.length)]!;
  }

  function pickUnusedNumber(field: string, min: number, max: number, step: number): number {
    const values: number[] = [];
    for (let v = min; v <= max; v += step) values.push(v);
    const available = values.filter(v => !isUsed(field, v));
    if (available.length > 0) return available[rng.uniformInt(0, available.length)]!;
    return values[rng.uniformInt(0, values.length)]!;
  }

  function adjustColor(field: string, base: string): string {
    if (!isUsed(field, base)) return base;
    const num = parseInt(base.slice(1), 16);
    for (let attempt = 0; attempt < 10; attempt++) {
      const shift = rng.uniformInt(5, 41);
      const sign = rng.uniformBool() ? 1 : -1;
      const r = Math.max(0, Math.min(255, (num >> 16) + sign * shift));
      const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + sign * shift));
      const b = Math.max(0, Math.min(255, (num & 0xff) + sign * shift));
      const adjusted = `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
      if (!isUsed(field, adjusted)) return adjusted;
    }
    // Last resort: random hex color
    const r = rng.uniformInt(0, 256);
    const g = rng.uniformInt(0, 256);
    const b = rng.uniformInt(0, 256);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  function generateConstrained(themeName: ThemeName, shapeValue: string): Record<string, string | number> {
    const themeObj = themes[themeName];
    const schema = themeObj.schema as Record<string, SchemaDef>;
    const shapeField = themeObj.shapeParam as string;

    // Start from theme's curated randomize output to preserve aesthetic
    const params = themeObj.randomize(rng) as Record<string, string | number>;
    params[shapeField] = shapeValue;
    markUsed(shapeField, shapeValue);

    for (const [field, def] of Object.entries(schema)) {
      if (field === shapeField) continue;

      if (def.type === 'select' && def.options) {
        params[field] = pickUnusedOption(field, def.options);
      } else if (def.type === 'color') {
        params[field] = adjustColor(field, params[field] as string);
      } else if (def.type === 'number') {
        params[field] = pickUnusedNumber(field, def.min ?? 0, def.max ?? 10, def.step ?? 1);
      }

      markUsed(field, params[field]!);
    }

    return params;
  }

  // --- Step 1: Plan theme + shape distribution ---

  const allThemeNames = getThemeNames();
  const nonPeopleThemes = rng.shuffle(allThemeNames.filter(t => t !== 'people'));

  // Build per-theme shuffled shape queues
  const themeShapeQueues = new Map<ThemeName, string[]>();
  for (const name of nonPeopleThemes) {
    const themeObj = themes[name];
    const shapeField = themeObj.shapeParam as string;
    const shapeDef = (themeObj.schema as Record<string, SchemaDef>)[shapeField];
    if (shapeDef?.type === 'select' && shapeDef.options) {
      themeShapeQueues.set(name, rng.shuffle([...shapeDef.options]));
    }
  }

  // Round-robin pick slots to maximize theme spread
  const slots: Slot[] = [];
  const needed = count - 1;
  let anyPicked = true;
  while (slots.length < needed && anyPicked) {
    anyPicked = false;
    for (const name of nonPeopleThemes) {
      if (slots.length >= needed) break;
      const queue = themeShapeQueues.get(name);
      if (!queue || queue.length === 0) continue;
      slots.push({ theme: name, shapeValue: queue.pop()! });
      anyPicked = true;
    }
  }

  // If count exceeds all unique shape slots, fill with random theme+shape pairs
  while (slots.length < needed) {
    const t = nonPeopleThemes[rng.uniformInt(0, nonPeopleThemes.length)]!;
    const themeObj = themes[t];
    const shapeDef = (themeObj.schema as Record<string, SchemaDef>)[themeObj.shapeParam as string];
    if (shapeDef?.options) {
      slots.push({ theme: t, shapeValue: shapeDef.options[rng.uniformInt(0, shapeDef.options.length)]! });
    }
  }

  // --- Step 2: Generate people avatar ---

  const items: GalleryItem[] = [];

  if (allThemeNames.includes('people' as ThemeName)) {
    const peopleTheme = themes['people' as ThemeName];
    const shapeDef = (peopleTheme.schema as Record<string, SchemaDef>)[peopleTheme.shapeParam as string];
    const shapeValue = shapeDef?.options
      ? shapeDef.options[rng.uniformInt(0, shapeDef.options.length)]!
      : 'bob';

    const params = generateConstrained('people' as ThemeName, shapeValue);
    applyGalleryOptions(params, options);
    items.push({
      theme: 'people' as ThemeName,
      params,
      svg: generateAvatar('people' as ThemeName, params as ThemeParams<'people'>),
    });
  }

  // --- Step 3: Generate non-people avatars ---

  for (const slot of slots) {
    const params = generateConstrained(slot.theme, slot.shapeValue);
    applyGalleryOptions(params, options);
    items.push({
      theme: slot.theme,
      params,
      svg: generateAvatar(slot.theme, params as ThemeParams<typeof slot.theme>),
    });
  }

  // --- Step 4: Shuffle final order ---

  return rng.shuffle(items);
}

function applyGalleryOptions(
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
