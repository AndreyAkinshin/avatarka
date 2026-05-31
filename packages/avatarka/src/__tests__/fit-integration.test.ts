import { describe, it, expect } from 'vitest';
import { themes, type ThemeName, type ThemeParams } from '../themes';
import { generateParams, getDefaultParams, generateAvatar } from '../index';
import { __test } from '../fit';

const { collectPoints } = __test;

const SIZE = 100;
const CENTER = SIZE / 2;
const PADDING = 4;
const R = SIZE / 2 - PADDING; // 46

/** Strip the <svg> wrapper and the leading background shape, leaving the fitted content group. */
function contentOf(svg: string): string {
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  // The first self-closing <circle>/<rect> is the background shape added by wrapSvgWithShape.
  return inner.replace(/<(?:circle|rect)\b[^>]*\/>/, '');
}

function maxRadius(content: string): number {
  const { points } = collectPoints(content);
  let max = 0;
  for (const p of points) {
    const d = Math.hypot(p.x - CENTER, p.y - CENTER);
    if (d > max) max = d;
  }
  return max;
}

const themeNames = Object.keys(themes) as ThemeName[];
const seeds = ['default', 'test-user-123', 'john@example.com', 'a@b.com', 'seed-1', 'seed-2', 'qqq', 'zzz'];

describe('fit-to-circle: content fits the target circle for every theme', () => {
  it.each(themeNames)('%s never overflows and fills the circle (random seeds)', (theme) => {
    for (const seed of seeds) {
      const params = seed === 'default' ? getDefaultParams(theme) : generateParams(theme, seed);
      const svg = generateAvatar(theme, params);
      const max = maxRadius(contentOf(svg));
      // Hard guarantee: never overflows the padded circle (also catches geometry the parser might miss).
      expect(max, `${theme}/${seed} overflows: max=${max.toFixed(2)} > R=${R}`).toBeLessThanOrEqual(R + 0.15);
      // Sanity: the avatar actually fills the circle (not scaled to a tiny subset).
      expect(max, `${theme}/${seed} suspiciously small: max=${max.toFixed(2)}`).toBeGreaterThan(R - 8);
    }
  });

  // Exhaustively cover every creature/shape value (random seeds may not hit them all).
  it.each(themeNames)('%s fits for every shape value', (theme) => {
    const t = themes[theme];
    const shapeParam = t.shapeParam as string;
    const shapeDef = (t.schema as Record<string, { type: string; options?: readonly string[] }>)[shapeParam];
    const defaults = getDefaultParams(theme) as Record<string, string | number>;
    const options = shapeDef?.type === 'select' && shapeDef.options ? shapeDef.options : [String(defaults[shapeParam])];
    for (const opt of options) {
      const params = { ...defaults, [shapeParam]: opt };
      const svg = generateAvatar(theme, params as ThemeParams<typeof theme>);
      const max = maxRadius(contentOf(svg));
      expect(max, `${theme}/${shapeParam}=${opt} overflows: max=${max.toFixed(2)} > R=${R}`).toBeLessThanOrEqual(R + 0.15);
      expect(max, `${theme}/${shapeParam}=${opt} suspiciously small: max=${max.toFixed(2)}`).toBeGreaterThan(R - 8);
    }
  });
});
