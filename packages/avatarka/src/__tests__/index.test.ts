import { describe, it, expect } from 'vitest';
import {
  generateAvatar,
  generateParams,
  getDefaultParams,
  randomAvatar,
  getThemeNames,
  getTheme,
  themes,
} from '../index';

describe('generateAvatar', () => {
  it('generates SVG for valid theme and params', () => {
    const params = getDefaultParams('geometric');
    const svg = generateAvatar('geometric', params);

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('throws error for unknown theme', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => generateAvatar('nonexistent', {})).toThrow('Unknown theme: nonexistent');
  });

  it('generates consistent structure for same params', () => {
    const params = getDefaultParams('monsters');
    const svg1 = generateAvatar('monsters', params);
    const svg2 = generateAvatar('monsters', params);

    // Normalize clip IDs for comparison (now deterministic hashes based on content)
    const normalizeClipIds = (svg: string) =>
      svg.replace(/clip-(?:circle|rounded|square)-[a-f0-9]+/g, 'clip-normalized');

    expect(normalizeClipIds(svg1)).toBe(normalizeClipIds(svg2));
  });

  it('works with all themes', () => {
    const themeNames = getThemeNames();

    for (const themeName of themeNames) {
      const params = getDefaultParams(themeName);
      const svg = generateAvatar(themeName, params);

      expect(svg).toContain('<svg');
    }
  });
});

describe('generateParams', () => {
  it('generates params for theme', () => {
    const params = generateParams('animals');

    expect(typeof params).toBe('object');
    expect(Object.keys(params).length).toBeGreaterThan(0);
  });

  it('generates deterministic params with seed', () => {
    const params1 = generateParams('robots', 'user@email.com');
    const params2 = generateParams('robots', 'user@email.com');

    expect(params1).toEqual(params2);
  });

  it('generates different params with different seeds', () => {
    const params1 = generateParams('geometric', 'seed1');
    const params2 = generateParams('geometric', 'seed2');

    expect(params1).not.toEqual(params2);
  });

  it('accepts numeric seed', () => {
    const params1 = generateParams('people', 12345);
    const params2 = generateParams('people', 12345);

    expect(params1).toEqual(params2);
  });

  it('throws error for unknown theme', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => generateParams('nonexistent')).toThrow('Unknown theme: nonexistent');
  });
});

describe('getDefaultParams', () => {
  it('returns params with default values from schema', () => {
    const params = getDefaultParams('geometric');
    const schema = themes.geometric.schema;

    for (const [key, def] of Object.entries(schema)) {
      expect((params as Record<string, string | number>)[key]).toBe(def.default);
    }
  });

  it('returns object with all schema keys', () => {
    const params = getDefaultParams('monsters');
    const schema = themes.monsters.schema;
    const schemaKeys = Object.keys(schema);

    expect(Object.keys(params).sort()).toEqual(schemaKeys.sort());
  });

  it('works for all themes', () => {
    const themeNames = getThemeNames();

    for (const themeName of themeNames) {
      const params = getDefaultParams(themeName);
      expect(typeof params).toBe('object');
      expect(Object.keys(params).length).toBeGreaterThan(0);
    }
  });

  it('throws error for unknown theme', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => getDefaultParams('nonexistent')).toThrow('Unknown theme: nonexistent');
  });
});

describe('randomAvatar', () => {
  it('generates SVG directly', () => {
    const svg = randomAvatar('animals');

    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('is deterministic with seed', () => {
    const svg1 = randomAvatar('geometric', 'unique-id');
    const svg2 = randomAvatar('geometric', 'unique-id');

    // Normalize clip IDs for comparison (now deterministic hashes based on content)
    const normalizeClipIds = (svg: string) =>
      svg.replace(/clip-(?:circle|rounded|square)-[a-f0-9]+/g, 'clip-normalized');

    expect(normalizeClipIds(svg1)).toBe(normalizeClipIds(svg2));
  });

  it('produces different results with different seeds', () => {
    const svg1 = randomAvatar('monsters', 'seed-a');
    const svg2 = randomAvatar('monsters', 'seed-b');

    expect(svg1).not.toBe(svg2);
  });

  it('works without seed', () => {
    const svg = randomAvatar('robots');

    expect(svg).toContain('<svg');
  });

  it('throws error for unknown theme', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => randomAvatar('nonexistent')).toThrow('Unknown theme: nonexistent');
  });
});

describe('getThemeNames', () => {
  it('returns array of theme names', () => {
    const names = getThemeNames();

    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  it('includes expected themes', () => {
    const names = getThemeNames();

    expect(names).toContain('people');
    expect(names).toContain('animals');
    expect(names).toContain('monsters');
    expect(names).toContain('robots');
    expect(names).toContain('aliens');
    expect(names).toContain('geometric');
  });

  it('returns same keys as themes object', () => {
    const names = getThemeNames();
    const themeKeys = Object.keys(themes);

    expect(names.sort()).toEqual(themeKeys.sort());
  });
});

describe('getTheme', () => {
  it('returns theme metadata', () => {
    const theme = getTheme('geometric');

    expect(theme).toHaveProperty('name');
    expect(theme).toHaveProperty('schema');
    expect(theme.name).toBe('Geometric');
  });

  it('returns schema with param definitions', () => {
    const theme = getTheme('monsters');

    expect(typeof theme.schema).toBe('object');
    expect(Object.keys(theme.schema).length).toBeGreaterThan(0);

    for (const paramDef of Object.values(theme.schema)) {
      expect(paramDef).toHaveProperty('type');
      expect(paramDef).toHaveProperty('default');
    }
  });

  it('throws error for unknown theme', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => getTheme('nonexistent')).toThrow('Unknown theme: nonexistent');
  });
});

describe('exports', () => {
  it('exports themes object', () => {
    expect(themes).toBeDefined();
    expect(typeof themes).toBe('object');
  });

  it('exports PRNG utilities', async () => {
    const { createRng, mulberry32, stringToSeed } = await import('../index');

    expect(typeof createRng).toBe('function');
    expect(typeof mulberry32).toBe('function');
    expect(typeof stringToSeed).toBe('function');
  });

  it('exports color utilities', async () => {
    const { hslToHex, randomColor, randomPastelColor, darkenColor, lightenColor } =
      await import('../index');

    expect(typeof hslToHex).toBe('function');
    expect(typeof randomColor).toBe('function');
    expect(typeof randomPastelColor).toBe('function');
    expect(typeof darkenColor).toBe('function');
    expect(typeof lightenColor).toBe('function');
  });
});
