import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  getDefaultParams,
  getTheme,
  paletteNames,
  palettes,
  type AdventurersParams,
  type PaletteName,
  type FolksParams,
} from '../index';
import { tonalEdge } from '../internal/art';
import { __test as fitTest } from '../fit';

type PeopleTheme = 'folks' | 'adventurers';
type SkinTone = FolksParams['skinTone'];

interface SkinPigments {
  readonly base: string;
  readonly pupil: string;
}

interface StrokeRecord {
  readonly color: string;
  readonly width: number;
}

const skinTones = [
  'porcelain',
  'peach',
  'sand',
  'honey',
  'copper',
  'umber',
  'deep',
] as const satisfies readonly SkinTone[];

const pigments = {
  folks: {
    porcelain: { base: '#f4d9ce', pupil: '#3f2924' },
    peach: { base: '#edc4ae', pupil: '#3f2924' },
    sand: { base: '#dca982', pupil: '#3b2721' },
    honey: { base: '#c88b5b', pupil: '#34221d' },
    copper: { base: '#a86643', pupil: '#291a16' },
    umber: { base: '#85543c', pupil: '#2b1a16' },
    deep: { base: '#684236', pupil: '#211310' },
  },
  adventurers: {
    porcelain: { base: '#f4d9ce', pupil: '#211512' },
    peach: { base: '#edc4ae', pupil: '#211512' },
    sand: { base: '#dca982', pupil: '#1d1310' },
    honey: { base: '#c88b5b', pupil: '#1b110f' },
    copper: { base: '#a86643', pupil: '#170f0d' },
    umber: { base: '#85543c', pupil: '#160d0b' },
    deep: { base: '#684236', pupil: '#120a09' },
  },
} as const satisfies Record<PeopleTheme, Record<SkinTone, SkinPigments>>;

const peopleCases = (['folks', 'adventurers'] as const).flatMap((theme) => (
  skinTones.flatMap((skinTone) => (
    paletteNames.map((palette) => ({ theme, skinTone, palette }))
  ))
));
const { collectPoints } = fitTest;

function featureAmount(skinTone: SkinTone): number {
  if (skinTone === 'deep') return 0.72;
  if (skinTone === 'umber') return 0.62;
  return 0.54;
}

function maximumPeopleStroke(skinTone: SkinTone): number {
  if (skinTone === 'deep') return 2.1;
  if (skinTone === 'umber') return 1.96;
  return 1.75;
}

function renderPeople(
  theme: PeopleTheme,
  skinTone: SkinTone,
  palette: PaletteName,
): string {
  if (theme === 'folks') {
    const params: FolksParams = {
      ...getDefaultParams('folks'),
      palette,
      skinTone,
      hairStyle: 'bald',
      eyeStyle: 'soft',
      mouthStyle: 'soft-smile',
      topStyle: 'collar',
      accessory: 'soft-glasses',
    };
    return generateAvatar('folks', params);
  }

  const params: AdventurersParams = {
    ...getDefaultParams('adventurers'),
    palette,
    skinTone,
    archetype: 'deep-sea-diver',
    expression: 'soft-smile',
    faceGear: 'goggles',
    insignia: 'none',
  };
  return generateAvatar('adventurers', params);
}

function withoutHexColors(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

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

function fitScale(svg: string): number {
  const value = svg.match(/translate\(50 50\) scale\(([\d.]+)\)/)?.[1];
  if (value === undefined) throw new Error('Missing Adventurers fit transform');
  return Number(value);
}

function parseSvg(svg: string): Document {
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

function countAttribute(svg: string, name: string, value: string): number {
  return svg.split(`${name}="${value}"`).length - 1;
}

function collectStrokes(svg: string): StrokeRecord[] {
  return (svg.match(/<[^>]+>/g) ?? []).flatMap((tag) => {
    const color = tag.match(/\bstroke="(#[\da-f]{6})"/i)?.[1];
    const width = tag.match(/\bstroke-width="([\d.]+)"/i)?.[1];
    return color && width
      ? [{ color: color.toLowerCase(), width: Number(width) }]
      : [];
  });
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

function skinColors(theme: PeopleTheme, skinTone: SkinTone): {
  readonly edge: string;
  readonly feature: string;
  readonly pupil: string;
} {
  const { base, pupil } = pigments[theme][skinTone];
  return {
    edge: tonalEdge(base, pupil, 0.28),
    feature: tonalEdge(base, pupil, featureAmount(skinTone)),
    pupil,
  };
}

function paletteContourColors(theme: PeopleTheme, palette: PaletteName): ReadonlySet<string> {
  const colors = palettes[palette];
  if (theme === 'folks') {
    return new Set([
      tonalEdge(colors.primary, colors.ink, 0.34),
      tonalEdge(colors.accent, colors.ink, 0.46),
    ]);
  }
  return new Set([
    tonalEdge(colors.primary, colors.ink, 0.36),
    tonalEdge(colors.secondary, colors.ink, 0.36),
    tonalEdge(colors.accent, colors.ink, 0.36),
    tonalEdge(colors.accent, colors.ink, 0.42),
    tonalEdge(colors.secondary, colors.ink, 0.52),
  ]);
}

describe('people theme tonal outlines', () => {
  it.each(peopleCases)(
    'keeps $theme/$skinTone contours tonal on the $palette palette',
    ({ theme, skinTone, palette }) => {
      const svg = renderPeople(theme, skinTone, palette);
      const skin = pigments[theme][skinTone];
      const { edge, feature, pupil } = skinColors(theme, skinTone);
      const strokes = collectStrokes(svg);
      const skinStrokes = strokes.filter(({ color }) => (
        color === edge || color === feature
      ));
      const paletteStrokes = strokes.filter(({ color }) => (
        paletteContourColors(theme, palette).has(color)
      ));

      expect(edge).toMatch(/^#[\da-f]{6}$/);
      expect(feature).toMatch(/^#[\da-f]{6}$/);
      expect(edge).not.toBe(skin.base);
      expect(feature).not.toBe(skin.base);
      expect(edge).not.toBe(pupil);
      expect(feature).not.toBe(pupil);
      expect(svg).toContain(`fill="${skin.base}" stroke="${edge}"`);
      expect(svg).toContain(`stroke="${feature}"`);

      // The darkest pigment remains a pupil fill, never a structural contour.
      expect(countAttribute(svg, 'fill', pupil)).toBe(2);
      expect(countAttribute(svg, 'stroke', pupil)).toBe(0);
      expect(countAttribute(svg, 'stroke', palettes[palette].ink)).toBe(0);

      expect(skinStrokes.length).toBeGreaterThanOrEqual(3);
      expect(Math.max(...skinStrokes.map(({ width }) => width)))
        .toBeLessThanOrEqual(maximumPeopleStroke(skinTone));
      expect(paletteStrokes.length).toBeGreaterThanOrEqual(2);
      expect(Math.max(...paletteStrokes.map(({ width }) => width))).toBeLessThanOrEqual(1.6);
      expect(Math.max(...strokes.map(({ width }) => width)))
        .toBeLessThanOrEqual(maximumPeopleStroke(skinTone));
    },
  );

  it.each((['folks', 'adventurers'] as const).flatMap((theme) => (
    skinTones.map((skinTone) => ({ theme, skinTone }))
  )))(
    'keeps $theme/$skinTone geometry identical across palettes',
    ({ theme, skinTone }) => {
      const geometries = paletteNames.map((palette) => (
        withoutHexColors(renderPeople(theme, skinTone, palette))
      ));
      expect(geometries.every((geometry) => geometry === geometries[0])).toBe(true);
    },
  );

  it('caps every Adventurers archetype and face-gear tonal contour', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurers = getTheme('adventurers').schema;
    const skinTone = 'deep';
    const { edge, feature, pupil } = skinColors('adventurers', skinTone);

    for (const palette of paletteNames) {
      const contourColors = paletteContourColors('adventurers', palette);
      for (const archetype of adventurers.archetype.options) {
        for (const faceGear of adventurers.faceGear.options) {
          const svg = generateAvatar('adventurers', {
            ...defaults,
            palette,
            skinTone,
            archetype,
            faceGear,
          });
          const strokes = collectStrokes(svg);
          const skinStrokes = strokes.filter(({ color }) => (
            color === edge || color === feature
          ));
          const tonalStrokes = strokes.filter(({ color }) => contourColors.has(color));

          expect(countAttribute(svg, 'stroke', pupil)).toBe(0);
          expect(countAttribute(svg, 'stroke', palettes[palette].ink)).toBe(0);
          expect(skinStrokes.length).toBeGreaterThanOrEqual(2);
          expect(Math.max(...skinStrokes.map(({ width }) => width)))
            .toBeLessThanOrEqual(maximumPeopleStroke(skinTone));
          expect(tonalStrokes.length).toBeGreaterThan(0);
          expect(Math.max(...tonalStrokes.map(({ width }) => width))).toBeLessThanOrEqual(1.6);
        }
      }
    }
  });

  it('keeps every Adventurers role geometry stable across palettes and frames', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurers = getTheme('adventurers').schema;

    for (const archetype of adventurers.archetype.options) {
      for (const skinTone of ['sand', 'umber', 'deep'] as const) {
        const canonical = withoutHexColors(avatarContent(generateAvatar('adventurers', {
          ...defaults,
          archetype,
          skinTone,
          palette: 'coast',
          backgroundShape: 'circle',
        })));

        for (const palette of paletteNames) {
          for (const backgroundShape of adventurers.backgroundShape.options) {
            const svg = generateAvatar('adventurers', {
              ...defaults,
              archetype,
              skinTone,
              palette,
              backgroundShape,
            });
            expect(
              withoutHexColors(avatarContent(svg)),
              `${archetype}/${skinTone}/${palette}/${backgroundShape}`,
            ).toBe(canonical);
            expect(svg).not.toContain('data-facial-stroke-width');
          }
        }
      }
    }
  });

  it('authors sparse, role-specific cues for the surfer and ghost hunter', () => {
    const defaults = getDefaultParams('adventurers');
    const expectedCues = {
      surfer: [
        'surfboard',
        'board-stringer',
        'board-fin',
        'wave',
      ],
      'ghost-hunter': [
        'capture-pack',
        'containment-window',
        'ghost-signal',
        'ghost-signal-eyes',
        'spectral-detector',
        'detector-signal',
      ],
    } as const;

    for (const [archetype, cues] of Object.entries(expectedCues)) {
      const document = parseSvg(generateAvatar('adventurers', {
        ...defaults,
        archetype: archetype as AdventurersParams['archetype'],
        skinTone: 'deep',
        expression: 'focused',
        faceGear: 'none',
        insignia: 'none',
      }));

      expect(document.querySelector('parsererror'), archetype).toBeNull();
      for (const cue of cues) {
        expect(document.querySelectorAll(`[data-cue="${cue}"]`).length, `${archetype}/${cue}`)
          .toBe(1);
      }
    }

    const surfer = parseSvg(generateAvatar('adventurers', {
      ...defaults,
      archetype: 'surfer',
      faceGear: 'none',
      insignia: 'none',
    }));
    const ghostHunter = parseSvg(generateAvatar('adventurers', {
      ...defaults,
      archetype: 'ghost-hunter',
      faceGear: 'none',
      insignia: 'none',
    }));

    expect(surfer.querySelector('[data-cue="wave"]')?.getAttribute('d')?.match(/M/g))
      .toHaveLength(2);
    expect(ghostHunter.querySelector('[data-cue="containment-window"]')?.tagName)
      .toBe('circle');
    expect(ghostHunter.querySelector('[data-cue="ghost-signal"]')?.getAttribute('d'))
      .toMatch(/Q.*L.*Z/);
  });

  it('keeps both role cues large, fitted, and accessory-safe across presentation', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurers = getTheme('adventurers').schema;
    const focusRoles = [
      { archetype: 'surfer', faceGear: ['none', 'round-glasses'] },
      { archetype: 'ghost-hunter', faceGear: ['none', 'round-glasses', 'goggles'] },
    ] as const;

    for (const { archetype, faceGear } of focusRoles) {
      for (const skinTone of ['umber', 'deep'] as const) {
        for (const gear of faceGear) {
          for (const palette of paletteNames) {
            for (const backgroundShape of adventurers.backgroundShape.options) {
              const label = `${archetype}/${skinTone}/${gear}/${palette}/${backgroundShape}`;
              const svg = generateAvatar('adventurers', {
                ...defaults,
                archetype,
                skinTone,
                expression: 'focused',
                faceGear: gear,
                insignia: 'star',
                palette,
                backgroundShape,
              });

              expect(avatarRadius(svg), label).toBeLessThanOrEqual(46.1);
              expect(fitScale(svg), label).toBeGreaterThanOrEqual(0.9);
              expect(svg, label).not.toContain('clip-path');
              expect(svg, label).not.toMatch(/stroke="(?:#fff(?:fff)?|#000(?:000)?|white|black)"/i);
            }
          }
        }
      }
    }
  });

  it('keeps every role face readable on all seven skin tones', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurers = getTheme('adventurers').schema;

    for (const archetype of adventurers.archetype.options) {
      for (const skinTone of skinTones) {
        const svg = generateAvatar('adventurers', {
          ...defaults,
          archetype,
          skinTone,
          expression: 'soft-smile',
          faceGear: 'none',
        });
        const { edge, feature, pupil } = skinColors('adventurers', skinTone);
        const label = `${archetype}/${skinTone}`;

        expect(countAttribute(svg, 'fill', pigments.adventurers[skinTone].base), label)
          .toBeGreaterThanOrEqual(1);
        expect(countAttribute(svg, 'fill', pupil), label).toBe(2);
        expect(countAttribute(svg, 'stroke', edge), label).toBeGreaterThanOrEqual(1);
        expect(countAttribute(svg, 'stroke', feature), label).toBeGreaterThanOrEqual(2);
        expect(svg, label).not.toMatch(/stroke="(?:#fff(?:fff)?|white)"/i);
        expect(contrastRatio(edge, pigments.adventurers[skinTone].base), label)
          .toBeGreaterThanOrEqual(1.3);
        expect(contrastRatio(feature, pigments.adventurers[skinTone].base), label)
          .toBeGreaterThanOrEqual(1.55);
        expect(contrastRatio(pupil, '#f3e6de'), label).toBeGreaterThan(14);
      }
    }
  });

  it.each((['folks', 'adventurers'] as const).flatMap((theme) => (
    (['umber', 'deep'] as const).map((skinTone) => ({ theme, skinTone }))
  )))(
    'keeps $theme/$skinTone facial curves legible at the 24px raster scale',
    ({ theme, skinTone }) => {
      const svg = renderPeople(theme, skinTone, 'coast');
      const { base, pupil } = pigments[theme][skinTone];
      const feature = tonalEdge(base, pupil, featureAmount(skinTone));
      const previousFeature = tonalEdge(base, pupil, 0.46);
      const featureStrokes = collectStrokes(svg).filter(({ color }) => color === feature);
      const widestPhysicalStroke = Math.max(
        ...featureStrokes.map(({ width }) => width * 24 / 100),
      );

      // This is a raster survival budget for avatar artwork, not a text/WCAG
      // threshold. The key curves approach half a physical pixel at 24px while
      // the pigment remains tonal rather than becoming a black or white halo.
      expect(contrastRatio(feature, base)).toBeGreaterThanOrEqual(1.75);
      expect(contrastRatio(feature, base) - contrastRatio(previousFeature, base))
        .toBeGreaterThanOrEqual(0.15);
      expect(widestPhysicalStroke).toBeGreaterThanOrEqual(
        skinTone === 'deep' ? 0.485 : 0.45,
      );
      expect(feature).not.toBe(pupil);
      expect(svg).not.toMatch(/stroke="(?:#fff(?:fff)?|#000(?:000)?|white|black)"/i);
    },
  );

  it('replaces integrated face equipment when explicit gear is rendered', () => {
    const defaults = getDefaultParams('adventurers');
    const masked = generateAvatar('adventurers', {
      ...defaults,
      archetype: 'masked-hero',
      faceGear: 'none',
    });
    const maskedWithGlasses = generateAvatar('adventurers', {
      ...defaults,
      archetype: 'masked-hero',
      faceGear: 'round-glasses',
    });
    const artificer = generateAvatar('adventurers', {
      ...defaults,
      archetype: 'artificer',
      faceGear: 'none',
    });
    const artificerWithGoggles = generateAvatar('adventurers', {
      ...defaults,
      archetype: 'artificer',
      faceGear: 'goggles',
    });

    expect(masked).toContain('M35 44Q42 39 50 44');
    expect(maskedWithGlasses).not.toContain('M35 44Q42 39 50 44');
    expect(maskedWithGlasses.match(/r="6\.7"/g)).toHaveLength(2);
    expect(artificer).toContain('cy="34" r="7"');
    expect(artificerWithGoggles).not.toContain('cy="34" r="7"');
    expect(artificerWithGoggles).toContain('stroke-linejoin="round"');
  });

  it('keeps all fifty role silhouettes distinct and deliberately low-density', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurers = getTheme('adventurers').schema;
    const silhouettes = new Set<string>();

    for (const archetype of adventurers.archetype.options) {
      for (const faceGear of adventurers.faceGear.options) {
        for (const insignia of adventurers.insignia.options) {
          const svg = generateAvatar('adventurers', {
            ...defaults,
            archetype,
            faceGear,
            insignia,
          });
          const elementCount = svg.match(/<(?:path|circle|ellipse|rect)\b/g)?.length ?? 0;
          expect(elementCount, `${archetype}/${faceGear}/${insignia}`)
            .toBeLessThanOrEqual(20);
        }
      }

      silhouettes.add(withoutHexColors(avatarContent(generateAvatar('adventurers', {
        ...defaults,
        archetype,
        expression: 'calm',
        faceGear: 'none',
        insignia: 'none',
      }))));
    }

    expect(silhouettes.size).toBe(adventurers.archetype.options.length);
    expect(silhouettes.size).toBe(50);
  });
});
