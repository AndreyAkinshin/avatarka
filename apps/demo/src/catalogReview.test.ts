import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  createAvatar,
  getBaseTypeCatalog,
  paletteNames,
  themeNames,
  type ThemeName,
} from 'avatarka';
import type { AvatarGalleryRequest } from 'avatarka-react';
import { describe, expect, it } from 'vitest';
import { generateCatalogReview } from './catalogReview';

function requestFor(theme: ThemeName, seed: string): AvatarGalleryRequest {
  return {
    theme,
    count: getBaseTypeCatalog(theme).values.length,
    seed,
    namespace: 'catalog-test',
    backgroundShape: 'circle',
  };
}

function semanticParams(params: object): Record<string, string | number> {
  return Object.fromEntries(Object.entries(params).filter(([param]) => (
    param !== 'palette' && param !== 'backgroundShape'
  )));
}

function normalizedSvg(svg: string): string {
  return svg.replace(/#[0-9a-f]{6}/gi, '#color');
}

function paletteCounts(gallery: readonly ReturnType<typeof createAvatar>[]): number[] {
  return paletteNames.map((palette) => (
    gallery.filter((item) => item.params.palette === palette).length
  ));
}

describe('development catalog review corpus', () => {
  it('renders every current base type once in exact schema order', () => {
    for (const theme of themeNames) {
      const catalog = getBaseTypeCatalog(theme);
      const gallery = generateCatalogReview(requestFor(theme, 'catalog-order'));

      expect(gallery).toHaveLength(catalog.values.length);
      expect(gallery.map((item) => (
        (item.params as unknown as Record<string, string>)[catalog.param]
      ))).toEqual(catalog.values);
      expect(gallery.map((item) => item.recipe.namespace)).toEqual(
        catalog.values.map((_, index) => `catalog-test:gallery-item:${index}`),
      );
      expect(gallery.map((item) => item.recipe.traits)).toEqual(
        catalog.values.map((value) => ({ [catalog.param]: value })),
      );
    }
  });

  it('changes secondary generation while preserving base order and namespaces', () => {
    for (const theme of themeNames) {
      const catalog = getBaseTypeCatalog(theme);
      const first = generateCatalogReview(requestFor(theme, 'catalog-first'));
      const second = generateCatalogReview(requestFor(theme, 'catalog-second'));
      const baseValues = (gallery: typeof first) => gallery.map((item) => (
        (item.params as unknown as Record<string, string>)[catalog.param]
      ));

      expect(baseValues(second)).toEqual(baseValues(first));
      expect(second.map((item) => item.recipe.namespace)).toEqual(
        first.map((item) => item.recipe.namespace),
      );
      expect(second.map((item) => semanticParams(item.params))).not.toEqual(
        first.map((item) => semanticParams(item.params)),
      );
    }
  });

  it('balances all six mixed palettes at eight or nine items for every theme', () => {
    for (const theme of themeNames) {
      const request = requestFor(theme, 'catalog-balanced-palettes');
      const gallery = generateCatalogReview(request);
      const replay = generateCatalogReview(request);

      expect(paletteCounts(gallery).sort((left, right) => left - right)).toEqual([
        8, 8, 8, 8, 9, 9,
      ]);
      expect(replay).toEqual(gallery);
      expect(gallery.every((item) => item.recipe.palette === item.params.palette)).toBe(true);
    }
  });

  it('keeps palette scheduling independent from semantic and drawing variation', () => {
    for (const theme of themeNames) {
      const gallery = generateCatalogReview(requestFor(theme, 'catalog-palette-only'));
      const natural = gallery.map((item) => {
        const { palette: _palette, ...recipe } = item.recipe;
        return createAvatar(recipe);
      });
      const coast = gallery.map((item) => createAvatar({
        ...item.recipe,
        palette: 'coast',
      }));

      expect(gallery.map((item) => semanticParams(item.params))).toEqual(
        natural.map((item) => semanticParams(item.params)),
      );
      expect(gallery.map((item) => normalizedSvg(item.svg))).toEqual(
        natural.map((item) => normalizedSvg(item.svg)),
      );
      expect(coast.map((item) => semanticParams(item.params))).toEqual(
        gallery.map((item) => semanticParams(item.params)),
      );
      expect(coast.map((item) => normalizedSvg(item.svg))).toEqual(
        gallery.map((item) => normalizedSvg(item.svg)),
      );
      expect(coast.some((item, index) => item.svg !== gallery[index]!.svg)).toBe(true);
    }
  });

  it('reshuffles a balanced palette assignment for a new generation seed', () => {
    for (const theme of themeNames) {
      const request = requestFor(theme, 'catalog-palette-generation');
      const first = generateCatalogReview(request);
      const secondRequest = {
        ...request,
        seed: 'string:catalog-palette-generation:generation:1',
      };
      const second = generateCatalogReview(secondRequest);

      expect(second.map((item) => item.params.palette)).not.toEqual(
        first.map((item) => item.params.palette),
      );
      expect(paletteCounts(second).sort((left, right) => left - right)).toEqual([
        8, 8, 8, 8, 9, 9,
      ]);
      expect(generateCatalogReview(secondRequest)).toEqual(second);
    }
  });

  it('rejects count mismatches instead of probing Picker loader validation', () => {
    expect(() => generateCatalogReview({
      ...requestFor('folks', 'wrong-count'),
      count: 25,
    })).toThrow('expected 50 folks base types, got 25');
  });

  it('keeps schema order and semantic traits stable when the frame changes', () => {
    for (const theme of themeNames) {
      const circleRequest = requestFor(theme, 'catalog-frame');
      const circle = generateCatalogReview(circleRequest);
      const square = generateCatalogReview({
        ...circleRequest,
        backgroundShape: 'square',
      });

      expect(square.map((item) => semanticParams(item.params))).toEqual(
        circle.map((item) => semanticParams(item.params)),
      );
      expect(square.map((item) => item.params.palette)).toEqual(
        circle.map((item) => item.params.palette),
      );
      expect(square.map((item) => item.recipe.namespace)).toEqual(
        circle.map((item) => item.recipe.namespace),
      );
      expect(square.every((item) => item.params.backgroundShape === 'square')).toBe(true);
    }
  });

  it('does not route catalog order through gallery sampling', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'apps/demo/src/catalogReview.ts'),
      'utf8',
    );

    expect(source).not.toMatch(/\bgenerateGallery\b/);
    expect(source).not.toMatch(/\.sample\s*\(/);
    expect(source).toContain("paletteScheduleSeed(request, 'remainder')");
    expect(source).toContain("paletteScheduleSeed(request, 'assignment')");
    expect(source).toContain('new Rng(');
    expect(source.match(/\.shuffle\s*\(/g)).toHaveLength(2);
  });

  it('keeps the palette scheduler inside the audited development-only chunk', () => {
    const audit = readFileSync(
      resolve(process.cwd(), 'apps/demo/scripts/check-production.mjs'),
      'utf8',
    );
    const packageJson = JSON.parse(readFileSync(
      resolve(process.cwd(), 'apps/demo/package.json'),
      'utf8',
    )) as { devDependencies?: Record<string, string> };

    expect(audit).toContain('catalog-review:balanced-palette-schedule:v1');
    expect(packageJson.devDependencies?.pragmastat).toBe('10.0.5');
  });

  it('keeps the development review surface on ten visual columns', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'apps/demo/src/catalogReview.css'),
      'utf8',
    );

    expect(css).toContain('grid-template-columns: repeat(10, minmax(0, 1fr))');
  });
});
