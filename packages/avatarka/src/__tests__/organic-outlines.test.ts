import { describe, expect, it } from 'vitest';
import { generateAvatar, getDefaultParams, getTheme } from '../core';
import { tonalEdge } from '../internal/art';
import { paletteNames, palettes } from '../palettes';
import { __test as fitTest } from '../fit';
import type { ThemeName } from '../core';

const organicThemes = ['critters', 'oddlings', 'orbs'] as const;
const { collectPoints } = fitTest;

function avatarContent(svg: string): string {
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  return inner.replace(/<(?:circle|rect)\b[^>]*\/>/, '');
}

function avatarRadius(svg: string): number {
  const { points, pad } = collectPoints(avatarContent(svg));
  return Math.max(
    ...points.map((point) => Math.hypot(point.x - 50, point.y - 50)),
  ) + pad;
}

function withoutHexColors(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

function relativeLuminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)!.map((channel) => {
    const value = Number.parseInt(channel, 16) / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}

function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05)
    / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

function optionsFor(theme: ThemeName): readonly [string, readonly string[]][] {
  return Object.entries(getTheme(theme).schema).flatMap(([name, definition]) => (
    definition.type === 'select' ? [[name, definition.options] as const] : []
  ));
}

function inkStrokeWidths(svg: string, ink: string): readonly number[] {
  return (svg.match(/<[^>]+>/g) ?? [])
    .filter((tag) => tag.includes(`stroke="${ink}"`))
    .map((tag) => Number(tag.match(/stroke-width="([\d.]+)"/)?.[1] ?? 0));
}

describe('organic theme contours', () => {
  it.each(organicThemes)('%s covers every select option without a heavy ink contour', (theme) => {
    const defaults = getDefaultParams(theme);
    const maximumInkWidth = theme === 'orbs' ? 2 : theme === 'critters' ? 1.9 : 1.8;

    for (const paletteName of paletteNames) {
      const ink = palettes[paletteName].ink;

      for (const [name, options] of optionsFor(theme)) {
        for (const option of options) {
          const svg = generateAvatar(theme, {
            ...defaults,
            palette: paletteName,
            [name]: option,
          } as never);

          expect(svg, `${theme}/${paletteName}/${name}/${option}`)
            .not.toContain('stroke-opacity');
          for (const width of inkStrokeWidths(svg, ink)) {
            expect(width, `${theme}/${paletteName}/${name}/${option}`)
              .toBeLessThanOrEqual(maximumInkWidth);
          }
        }
      }
    }
  });

  it('leaves the large organic silhouettes unoutlined', () => {
    const critter = generateAvatar('critters', {
      ...getDefaultParams('critters'),
      species: 'cat',
      marking: 'none',
      accessory: 'none',
    });
    const oddling = generateAvatar('oddlings', {
      ...getDefaultParams('oddlings'),
      bodyShape: 'bean',
      feature: 'none',
      pattern: 'plain',
    });
    const orbs = generateAvatar('orbs', {
      ...getDefaultParams('orbs'),
      orbShape: 'pebble',
    });

    expect(critter.match(/<path d="M25 44Q25 28[^>]+>/)?.[0])
      .not.toContain('stroke=');
    expect(oddling.match(/<path d="M57 18C74 22[^>]+>/)?.[0])
      .not.toContain('stroke=');
    expect(orbs.match(/<path d="M20 40C24 26[^>]+>/)?.[0])
      .not.toContain('stroke=');
  });

  it('uses solid fill-derived edges for overlap-critical details', () => {
    const coast = palettes.coast;
    const critter = generateAvatar('critters', {
      ...getDefaultParams('critters'),
      accessory: 'collar',
    });
    const oddling = generateAvatar('oddlings', {
      ...getDefaultParams('oddlings'),
      feature: 'horn',
    });

    expect(critter).toContain(
      `stroke="${tonalEdge(coast.accent, coast.ink, 0.38)}" stroke-width="1.2"`,
    );
    expect(oddling).toContain(
      `stroke="${tonalEdge(coast.accent, coast.ink, 0.42)}" stroke-width="1.4"`,
    );
    expect(oddling).not.toContain(`stroke="${coast.canvas}"`);
  });

  it('keeps Critters external ears and antlers distinct from every canvas', () => {
    const defaults = getDefaultParams('critters');
    const externallyExposed = ['dog', 'raccoon', 'panda', 'tiger', 'deer'] as const;

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      for (const coat of getTheme('critters').schema.coat.options) {
        const externalMark = coat === 'classic'
          ? tonalEdge(palette.primary, palette.ink, 0.42)
          : coat === 'light'
            ? tonalEdge(palette.primary, palette.ink, 0.42)
            : tonalEdge(palette.accent, palette.ink, 0.38);

        expect(
          contrastRatio(externalMark, palette.canvas),
          `${paletteName}/${coat}`,
        ).toBeGreaterThanOrEqual(1.3);

        for (const species of externallyExposed) {
          const svg = generateAvatar('critters', {
            ...defaults,
            palette: paletteName,
            coat,
            species,
            accessory: 'none',
            marking: 'none',
          });
          expect(svg, `${paletteName}/${coat}/${species}`).toContain(externalMark);
        }
      }
    }
  });

  it('draws Critters ear interiors after the head and tucks leaves behind them', () => {
    const defaults = getDefaultParams('critters');
    const layers = [
      ['cat', 'M25 44Q25 28', 'M29 30L32 20'],
      ['dog', 'M28 25Q50 17', 'M30 32Q22 30'],
      ['fox', 'M23 41Q27 24', 'M27 31L31 17'],
      ['bear', 'M25 45Q25 25', 'cx="26" cy="32" r="6"'],
      ['rabbit', 'cx="50" cy="57" rx="26"', 'M33 34Q30 20'],
      ['raccoon', 'M24 43Q25 27', 'cx="29" cy="27.5" r="4.8"'],
      ['tiger', 'M21 45Q21 27', 'M25 34Q24 24'],
      ['deer', 'M31 31Q50 18', 'M22 28Q30 27'],
      ['koala', 'M29 31Q50 17', 'cx="22" cy="42" r="9"'],
    ] as const;

    for (const [species, headNeedle, earNeedle] of layers) {
      const svg = generateAvatar('critters', {
        ...defaults,
        species,
        accessory: 'none',
        marking: 'none',
      });
      expect(svg.indexOf(earNeedle), species).toBeGreaterThan(svg.indexOf(headNeedle));
    }

    const leafDog = generateAvatar('critters', {
      ...defaults,
      species: 'dog',
      accessory: 'leaf',
      marking: 'none',
    });
    expect(leafDog.indexOf('M75 29Q78 17')).toBeLessThan(
      leafDog.indexOf('M66 30Q81 22'),
    );

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      const lightCat = generateAvatar('critters', {
        ...defaults,
        species: 'cat',
        coat: 'light',
        accessory: 'none',
        marking: 'none',
        palette: paletteName,
      });
      const earInterior = 'M29 30L32 20L39 30Z';
      expect(lightCat, `${paletteName}/light/ear-interior`).toContain(
        `<path d="${earInterior}" fill="${palette.primary}"/>`,
      );
      expect(lightCat, `${paletteName}/light/ear-interior`).not.toContain(
        `<path d="${earInterior}" fill="${palette.canvas}"/>`,
      );
    }
  });

  it('sizes Critters neckwear per species instead of using one oversized strap', () => {
    const defaults = getDefaultParams('critters');
    const neckWidths = {
      cat: 34,
      dog: 38,
      fox: 28,
      bear: 42,
      rabbit: 42,
      raccoon: 38,
      panda: 44,
      tiger: 48,
      deer: 26,
      koala: 40,
    } as const;

    const accessoryWidth = (svg: string): number => {
      const accessoryPath = (svg.match(/<path\b[^>]+>/g) ?? []).find((tag) => (
        tag.includes('stroke-width="1.2"') && tag.includes('Q50')
      ));
      const match = accessoryPath?.match(
        /d="M([\d.]+) [\d.]+Q50 [\d.]+ ([\d.]+) [\d.]+L/,
      );
      expect(match).toBeDefined();
      return Number(match![2]) - Number(match![1]);
    };

    for (const species of Object.keys(neckWidths) as Array<keyof typeof neckWidths>) {
      const neckWidth = neckWidths[species];
      const params = {
        ...defaults,
        species,
        marking: 'none',
      } as const;
      expect(accessoryWidth(generateAvatar('critters', {
        ...params,
        accessory: 'collar',
      })), `${species}/collar`).toBe(neckWidth);
      expect(accessoryWidth(generateAvatar('critters', {
        ...params,
        accessory: 'bandana',
      })), `${species}/bandana`).toBe(neckWidth + 4);
    }
  });

  it('fits every Critters coat and accessory across all presentation options', () => {
    const defaults = getDefaultParams('critters');
    const crittersSchema = getTheme('critters').schema;

    for (const species of crittersSchema.species.options) {
      for (const coat of crittersSchema.coat.options) {
        for (const accessory of crittersSchema.accessory.options) {
          let canonicalGeometry = '';
          for (const palette of paletteNames) {
            for (const backgroundShape of crittersSchema.backgroundShape.options) {
              const svg = generateAvatar('critters', {
                ...defaults,
                species,
                coat,
                accessory,
                palette,
                backgroundShape,
              });
              const label = [
                species,
                coat,
                accessory,
                palette,
                backgroundShape,
              ].join('/');

              expect(svg, label).not.toContain('clip-path');
              expect(avatarRadius(svg), label).toBeLessThanOrEqual(44.1);

              const geometry = withoutHexColors(avatarContent(svg));
              if (canonicalGeometry === '') canonicalGeometry = geometry;
              else expect(geometry, label).toBe(canonicalGeometry);
            }
          }
        }
      }
    }
  }, 30_000);
});
