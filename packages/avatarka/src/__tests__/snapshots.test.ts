import { describe, it, expect } from 'vitest';
import { themes, type ThemeName } from '../themes';
import { createRng } from '../prng';
import { generateAvatar, generateParams, getDefaultParams } from '../index';

/**
 * Helper to normalize clip IDs for snapshot comparison.
 * Clip IDs are deterministic hashes based on content,
 * but we normalize them for cleaner snapshot diffs.
 */
const normalizeClipIds = (svg: string) =>
  svg.replace(/clip-(?:circle|rounded|square)-[a-f0-9]+/g, 'clip-normalized');

const themeNames = Object.keys(themes) as ThemeName[];

describe('SVG snapshots', () => {
  describe.each(themeNames)('%s theme', (themeName) => {
    it('generates expected SVG with default params', () => {
      const params = getDefaultParams(themeName);
      const svg = generateAvatar(themeName, params);
      const normalized = normalizeClipIds(svg);

      expect(normalized).toMatchSnapshot();
    });

    it('generates expected SVG with seed "test-user-123"', () => {
      const params = generateParams(themeName, 'test-user-123');
      const svg = generateAvatar(themeName, params);
      const normalized = normalizeClipIds(svg);

      expect(normalized).toMatchSnapshot();
    });

    it('generates expected SVG with seed "john@example.com"', () => {
      const params = generateParams(themeName, 'john@example.com');
      const svg = generateAvatar(themeName, params);
      const normalized = normalizeClipIds(svg);

      expect(normalized).toMatchSnapshot();
    });
  });
});

describe('PRNG determinism snapshots', () => {
  it('createRng with string seed produces consistent values', () => {
    const rng = createRng('snapshot-seed');

    const values = Array.from({ length: 10 }, () => rng.uniformFloat());

    expect(values).toMatchSnapshot();
  });
});

describe('generateParams determinism', () => {
  it.each(themeNames)('%s params are deterministic with seed', (themeName) => {
    const params = generateParams(themeName, 'deterministic-test-seed');

    expect(params).toMatchSnapshot();
  });
});
