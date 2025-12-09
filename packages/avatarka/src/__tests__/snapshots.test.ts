import { describe, it, expect } from 'vitest';
import { themes, type ThemeName } from '../themes';
import { createRng, mulberry32, stringToSeed } from '../prng';
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
  it('stringToSeed produces consistent hashes', () => {
    const testCases = [
      'hello',
      'world',
      'test-user@example.com',
      '12345',
      'avatarka',
      '',
      'a',
      'emoji😀test',
    ];

    const results = testCases.map((input) => ({
      input,
      hash: stringToSeed(input),
    }));

    expect(results).toMatchSnapshot();
  });

  it('mulberry32 produces consistent sequence', () => {
    const rng = mulberry32(42);

    const sequence = Array.from({ length: 20 }, () => rng());

    expect(sequence).toMatchSnapshot();
  });

  it('createRng with string seed produces consistent params', () => {
    const rng = createRng('snapshot-seed');

    // Generate 10 random values
    const values = Array.from({ length: 10 }, () => rng());

    expect(values).toMatchSnapshot();
  });
});

describe('generateParams determinism', () => {
  it.each(themeNames)('%s params are deterministic with seed', (themeName) => {
    const params = generateParams(themeName, 'deterministic-test-seed');

    expect(params).toMatchSnapshot();
  });
});
