import { describe, it, expect } from 'vitest';
import { themes, type ThemeName } from '../themes';
import { createRng } from '../prng';

const themeNames = Object.keys(themes) as ThemeName[];

describe('themes', () => {
  describe.each(themeNames)('%s theme', (themeName) => {
    const theme = themes[themeName];

    it('has required properties', () => {
      expect(theme).toHaveProperty('name');
      expect(theme).toHaveProperty('schema');
      expect(theme).toHaveProperty('generate');
      expect(theme).toHaveProperty('randomize');
    });

    it('has a display name', () => {
      expect(typeof theme.name).toBe('string');
      expect(theme.name.length).toBeGreaterThan(0);
    });

    it('has a valid schema', () => {
      expect(typeof theme.schema).toBe('object');

      for (const [, paramDef] of Object.entries(theme.schema)) {
        expect(paramDef).toHaveProperty('type');
        expect(paramDef).toHaveProperty('default');

        if (paramDef.type === 'color') {
          expect(typeof paramDef.default).toBe('string');
          expect(paramDef.default).toMatch(/^#[0-9a-f]{6}$/i);
        } else if (paramDef.type === 'number') {
          expect(typeof paramDef.default).toBe('number');
          expect(paramDef).toHaveProperty('min');
          expect(paramDef).toHaveProperty('max');
          expect(paramDef.default).toBeGreaterThanOrEqual(paramDef.min);
          expect(paramDef.default).toBeLessThanOrEqual(paramDef.max);
        } else if (paramDef.type === 'select') {
          expect(Array.isArray(paramDef.options)).toBe(true);
          expect(paramDef.options.length).toBeGreaterThan(0);
          expect(paramDef.options).toContain(paramDef.default);
        }
      }
    });

    it('generates valid SVG', () => {
      const rng = createRng('test-svg');
      const params = theme.randomize(rng);
      // Type assertion needed because theme is dynamically looked up
      const svg = (theme.generate as (p: typeof params) => string)(params);

      expect(svg).toContain('<svg');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('</svg>');
    });

    it('generates SVG with viewBox', () => {
      const rng = createRng('viewbox-test');
      const params = theme.randomize(rng);
      // Type assertion needed because theme is dynamically looked up
      const svg = (theme.generate as (p: typeof params) => string)(params);

      expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
    });

    it('randomize produces valid params', () => {
      const rng = createRng('params-test');
      const params = theme.randomize(rng);

      for (const [paramName, paramDef] of Object.entries(theme.schema)) {
        expect(params).toHaveProperty(paramName);
        const value = params[paramName as keyof typeof params];

        if (paramDef.type === 'color') {
          expect(typeof value).toBe('string');
          expect(value).toMatch(/^#[0-9a-f]{6}$/i);
        } else if (paramDef.type === 'number') {
          expect(typeof value).toBe('number');
          expect(value).toBeGreaterThanOrEqual(paramDef.min);
          expect(value).toBeLessThanOrEqual(paramDef.max);
        } else if (paramDef.type === 'select') {
          expect(paramDef.options).toContain(value);
        }
      }
    });

    it('randomize is deterministic with same seed', () => {
      const rng1 = createRng('deterministic');
      const rng2 = createRng('deterministic');

      const params1 = theme.randomize(rng1);
      const params2 = theme.randomize(rng2);

      expect(params1).toEqual(params2);
    });

    it('randomize produces different results with different seeds', () => {
      const rng1 = createRng('seed-a');
      const rng2 = createRng('seed-b');

      const params1 = theme.randomize(rng1);
      const params2 = theme.randomize(rng2);

      expect(params1).not.toEqual(params2);
    });

    it('generate produces consistent structure', () => {
      const rng = createRng('gen-test');
      const params = theme.randomize(rng);
      // Type assertion needed because theme is dynamically looked up
      const generate = theme.generate as (p: typeof params) => string;

      const svg1 = generate(params);
      const svg2 = generate(params);

      // Normalize clip IDs for comparison (now deterministic based on content hash)
      const normalizeClipIds = (svg: string) =>
        svg.replace(/clip-(?:circle|rounded|square)-[a-f0-9]+/g, 'clip-normalized');

      expect(normalizeClipIds(svg1)).toBe(normalizeClipIds(svg2));
    });

    it('generates non-empty content', () => {
      const rng = createRng('content-test');
      const params = theme.randomize(rng);
      // Type assertion needed because theme is dynamically looked up
      const svg = (theme.generate as (p: typeof params) => string)(params);

      // SVG should have meaningful content (more than just the wrapper)
      expect(svg.length).toBeGreaterThan(100);
    });
  });
});

describe('theme registry', () => {
  it('contains expected themes', () => {
    expect(themes).toHaveProperty('people');
    expect(themes).toHaveProperty('animals');
    expect(themes).toHaveProperty('monsters');
    expect(themes).toHaveProperty('robots');
    expect(themes).toHaveProperty('aliens');
    expect(themes).toHaveProperty('geometric');
  });

  it('has at least 5 themes', () => {
    expect(Object.keys(themes).length).toBeGreaterThanOrEqual(5);
  });
});
