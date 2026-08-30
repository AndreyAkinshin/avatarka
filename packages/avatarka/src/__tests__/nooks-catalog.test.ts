import { describe, expect, it } from 'vitest';
import {
  createAvatar,
  generateAvatar,
  generateGallery,
  generateParams,
  getDefaultParams,
  getTheme,
  type NooksParams,
} from '../core';
import { paletteNames, palettes } from '../palettes';
import { __test } from '../themes/nooks';

const nooksSchema = getTheme('nooks').schema;

function artworkGeometry(svg: string): string {
  const artworkStart = svg.indexOf('    <g><g');
  expect(artworkStart).toBeGreaterThan(0);
  return svg.slice(artworkStart).replace(/#[\da-f]{6}/gi, '#color');
}

function structuralCommandSkeleton(svg: string): string {
  return [...svg.matchAll(/<path d="([^"]+)"/g)]
    .map((match) => match[1]!.replace(/-?\d+(?:\.\d+)?/g, 'n'))
    .join('|');
}

function primitiveCount(svg: string): number {
  return svg.match(/<(?:path|rect|circle|ellipse|polygon|line|polyline)\b/g)?.length ?? 0;
}

function parseSvg(svg: string): Document {
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

describe('Nooks 50 catalog', () => {
  it('keeps fifty unique primary dwellings and exactly one windmill', () => {
    const dwellings = nooksSchema.dwelling.options;

    expect(dwellings).toHaveLength(50);
    expect(new Set(dwellings).size).toBe(50);
    expect(dwellings.filter((dwelling) => dwelling === 'windmill')).toEqual(['windmill']);
  });

  it('uses a dedicated structural silhouette for every dwelling', () => {
    const defaults = getDefaultParams('nooks');
    const silhouettes = nooksSchema.dwelling.options.map((dwelling) => ({
      dwelling,
      skeleton: structuralCommandSkeleton(generateAvatar('nooks', {
        ...defaults,
        dwelling,
        expression: 'soft-smile',
        windowStyle: 'round',
        material: 'plaster',
        accent: 'none',
      })),
    }));

    for (const silhouette of silhouettes) {
      expect(silhouette.skeleton, silhouette.dwelling).not.toBe('');
    }
    expect(new Set(silhouettes.map(({ skeleton }) => skeleton)).size).toBe(50);

    for (let left = 0; left < silhouettes.length; left++) {
      for (let right = left + 1; right < silhouettes.length; right++) {
        const leftSilhouette = silhouettes[left]!;
        const rightSilhouette = silhouettes[right]!;
        expect(
          leftSilhouette.skeleton,
          `${leftSilhouette.dwelling}/${rightSilhouette.dwelling}`,
        ).not.toBe(rightSilhouette.skeleton);
      }
    }
  });

  it('authors sparse structural cues for the three previously ambiguous dwellings', () => {
    const defaults = getDefaultParams('nooks');
    const expectedCues = {
      firehouse: {
        'stepped-hose-tower': 1,
        'fire-bell': 1,
        'apparatus-bay': 1,
        'apparatus-panels': 1,
      },
      'moon-base': {
        'faceted-habitat': 1,
        'pressure-roof': 1,
        'airlock-module': 1,
        'solar-array': 1,
        'lunar-ground': 1,
      },
      'stilt-house': {
        'stable-stilt': 2,
        'cross-brace': 1,
        'raised-deck': 1,
        waterline: 1,
      },
    } as const;

    for (const [dwelling, cues] of Object.entries(expectedCues)) {
      const document = parseSvg(generateAvatar('nooks', {
        ...defaults,
        dwelling: dwelling as NooksParams['dwelling'],
        material: 'plaster',
        windowStyle: 'round',
        accent: 'none',
      }));

      expect(document.querySelector('parsererror'), dwelling).toBeNull();
      for (const [cue, count] of Object.entries(cues)) {
        expect(
          document.querySelectorAll(`[data-cue="${cue}"]`).length,
          `${dwelling}/${cue}`,
        ).toBe(count);
      }
    }

    const moonHabitat = parseSvg(generateAvatar('nooks', {
      ...defaults,
      dwelling: 'moon-base',
      accent: 'none',
    })).querySelector('[data-cue="faceted-habitat"]');
    expect(moonHabitat?.getAttribute('d')).not.toMatch(/[QCA]/);

    const stilts = parseSvg(generateAvatar('nooks', {
      ...defaults,
      dwelling: 'stilt-house',
      accent: 'none',
    })).querySelectorAll('[data-cue="stable-stilt"]');
    for (const stilt of stilts) {
      expect(stilt.getAttribute('d')).toMatch(/Z$/);
      expect(stilt.getAttribute('fill')).not.toBe('none');
    }
  });

  it('keeps flags for contextual landmarks while removing them from off-theme homes', () => {
    const definitions = new Map(
      __test.dwellingDefinitions.map((definition) => [definition.id, definition]),
    );
    const withoutNaturalFlags = [
      'firehouse',
      'space-capsule',
      'rocket-house',
      'acorn-house',
      'lantern-house',
      'shell-house',
      'cloud-home',
    ] as const;
    const contextualFlags = [
      'lighthouse',
      'tent',
      'tower',
      'houseboat',
      'treehouse',
      'stilt-house',
      'snow-dome',
      'train-station',
      'caboose-home',
      'airship-cabin',
      'submarine-nook',
      'moon-base',
    ] as const;

    for (const dwelling of withoutNaturalFlags) {
      expect(definitions.get(dwelling)?.accents, dwelling).not.toContain('flag');
    }
    for (const dwelling of contextualFlags) {
      expect(definitions.get(dwelling)?.accents, dwelling).toContain('flag');
    }
  });

  it('keeps two window-eyes and a door-mouth visible in every palette and frame', () => {
    const defaults = getDefaultParams('nooks');

    for (const dwelling of nooksSchema.dwelling.options) {
      for (const palette of paletteNames) {
        const pigments = palettes[palette];
        for (const backgroundShape of nooksSchema.backgroundShape.options) {
          const svg = generateAvatar('nooks', {
            ...defaults,
            dwelling,
            palette,
            backgroundShape,
            expression: 'soft-smile',
            windowStyle: 'round',
            accent: 'none',
          });
          const label = `${dwelling}/${palette}/${backgroundShape}`;
          const windows = svg.match(
            new RegExp(`<ellipse[^>]+fill="${pigments.secondary}"[^>]*/>`, 'g'),
          ) ?? [];
          const pupils = svg.match(
            new RegExp(`<circle[^>]+fill="${pigments.ink}"[^>]*/>`, 'g'),
          ) ?? [];

          expect(windows, `${label}: window-eyes`).toHaveLength(2);
          expect(pupils, `${label}: pupils`).toHaveLength(2);
          expect(svg, `${label}: mouth`).toContain(
            `stroke="${pigments.ink}" stroke-width="1.8" stroke-linecap="round"`,
          );
        }
      }
    }
  });

  it('keeps every dwelling artwork geometrically stable across palettes and frames', () => {
    const defaults = getDefaultParams('nooks');

    for (const dwelling of nooksSchema.dwelling.options) {
      const reference = artworkGeometry(generateAvatar('nooks', {
        ...defaults,
        dwelling,
        palette: 'coast',
        backgroundShape: 'circle',
      }));

      for (const palette of paletteNames) {
        for (const backgroundShape of nooksSchema.backgroundShape.options) {
          expect(
            artworkGeometry(generateAvatar('nooks', {
              ...defaults,
              dwelling,
              palette,
              backgroundShape,
            })),
            `${dwelling}/${palette}/${backgroundShape}`,
          ).toBe(reference);
        }
      }
    }
  });

  it('honors every primary and secondary trait override', () => {
    const expected = {
      expression: 'sleepy',
      windowStyle: 'shuttered',
      material: 'glass',
      accent: 'awning',
    } as const;

    for (const dwelling of nooksSchema.dwelling.options) {
      const params = generateParams('nooks', `nooks-overrides:${dwelling}`, {
        traits: { dwelling, ...expected },
      });

      expect(params).toMatchObject({ dwelling, ...expected });
    }
  });

  it('honors every dwelling override and balances a full gallery catalog', () => {
    const dwellings = nooksSchema.dwelling.options;

    for (const dwelling of dwellings) {
      expect(createAvatar('nooks', `nooks-primary:${dwelling}`, {
        traits: { dwelling },
      }).params.dwelling).toBe(dwelling);
    }

    const gallery = generateGallery(100, 'nooks-full-catalog', {
      themes: ['nooks'],
      palette: 'coast',
      backgroundShape: 'circle',
    });
    const counts = new Map(dwellings.map((dwelling) => [dwelling, 0]));
    for (const avatar of gallery) {
      counts.set(avatar.params.dwelling, counts.get(avatar.params.dwelling)! + 1);
    }

    expect([...counts.keys()]).toEqual(dwellings);
    expect([...counts.values()]).toEqual(dwellings.map(() => 2));
  });

  it('keeps detail density bounded for every role and secondary option', () => {
    const defaults = getDefaultParams('nooks');
    let maximum = { count: 0, label: '' };

    for (const dwelling of nooksSchema.dwelling.options) {
      for (const windowStyle of nooksSchema.windowStyle.options) {
        for (const material of nooksSchema.material.options) {
          for (const accent of nooksSchema.accent.options) {
            const count = primitiveCount(generateAvatar('nooks', {
              ...defaults,
              dwelling,
              windowStyle,
              material,
              accent,
            }));
            if (count > maximum.count) {
              maximum = {
                count,
                label: `${dwelling}/${windowStyle}/${material}/${accent}`,
              };
            }
          }
        }
      }
    }

    expect(maximum.count, maximum.label).toBeLessThanOrEqual(20);
  });

  it('keeps all complete parameter combinations renderable', () => {
    const defaults = getDefaultParams('nooks');
    const combinations: readonly NooksParams[] = nooksSchema.dwelling.options.flatMap(
      (dwelling) => nooksSchema.material.options.flatMap(
        (material) => nooksSchema.accent.options.map((accent) => ({
          ...defaults,
          dwelling,
          material,
          accent,
        })),
      ),
    );

    for (const params of combinations) {
      const svg = generateAvatar('nooks', params);
      expect(svg, `${params.dwelling}/${params.material}/${params.accent}`)
        .toMatch(/^<svg[^>]+>[\s\S]+<\/svg>$/);
    }
  });
});
