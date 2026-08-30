import { describe, expect, it } from 'vitest';
import {
  createAvatar,
  generateGallery,
  getBaseTypeCatalog,
  themeNames,
  type GeneratedAvatar,
  type ThemeName,
} from '../index';
import {
  createBaseTypeSchedule,
  createGalleryCandidateSeeds,
  FOLKS_GALLERY_CANDIDATE_POOL_SIZE,
  GALLERY_CANDIDATE_POOL_SIZE,
  selectGalleryCandidate,
} from '../internal/gallery';
import { createAvatarRandom } from '../internal/random';
import type { AvatarRandom } from '../internal/types';

function fakeRandom(
  sample: AvatarRandom['sample'],
  shuffle: AvatarRandom['shuffle'],
): AvatarRandom {
  return {
    pick<Value>(_key: string, _values: readonly Value[]): Value {
      throw new Error('Unexpected pick');
    },
    weightedPick<Value>(
      _key: string,
      _values: readonly (readonly [Value, number])[],
    ): Value {
      throw new Error('Unexpected weighted pick');
    },
    int(): number {
      throw new Error('Unexpected int');
    },
    bool(): boolean {
      throw new Error('Unexpected bool');
    },
    sample,
    shuffle,
  };
}

function baseTypeValues(
  theme: ThemeName,
  gallery: readonly GeneratedAvatar[],
): string[] {
  const { param } = getBaseTypeCatalog(theme);
  return gallery
    .filter((item) => item.theme === theme)
    .map((item) => (
      item.params as Readonly<Record<string, string | number>>
    )[param] as string);
}

function expectBalancedSchedule(
  values: readonly string[],
  catalog: readonly string[],
): void {
  const expectedFullBlock = [...catalog].sort();
  const counts = new Map(catalog.map((value) => [value, 0]));

  for (let offset = 0; offset < values.length; offset += catalog.length) {
    const block = values.slice(offset, offset + catalog.length);
    expect(new Set(block).size, `repeated value in block at ${offset}`)
      .toBe(block.length);
    expect(block.every((value) => counts.has(value))).toBe(true);
    if (block.length === catalog.length) {
      expect([...block].sort()).toEqual(expectedFullBlock);
    }
    if (offset > 0 && block.length > 1) {
      expect(block[0], `cycle boundary at ${offset}`).not.toBe(values[offset - 1]);
    }
    for (const value of block) counts.set(value, counts.get(value)! + 1);
  }

  const frequencies = [...counts.values()];
  expect(Math.max(...frequencies) - Math.min(...frequencies))
    .toBeLessThanOrEqual(1);
}

describe('deterministic gallery base-type scheduling', () => {
  it('uses exactly the fixed candidate window and never probes past it', () => {
    const calls: Array<readonly [string, number, number]> = [];
    const random = fakeRandom(
      <Value>(): Value[] => {
        throw new Error('Unexpected sample');
      },
      <Value>(): Value[] => {
        throw new Error('Unexpected shuffle');
      },
    );
    random.int = (key, min, max) => {
      calls.push([key, min, max]);
      return calls.length;
    };

    expect(createGalleryCandidateSeeds(7, 3, random)).toEqual([1, 2, 3]);
    expect(calls).toEqual([
      ['item-seed:7:0', 0, 0x7fffffff],
      ['item-seed:7:1', 0, 0x7fffffff],
      ['item-seed:7:2', 0, 0x7fffffff],
    ]);
  });

  it('handles a forced all-collision window deterministically without fallback', () => {
    const candidates = Object.freeze([
      Object.freeze({ id: 'first', signature: 'used-a', score: 8 }),
      Object.freeze({ id: 'best', signature: 'used-b', score: 2 }),
      Object.freeze({ id: 'tie-later', signature: 'used-a', score: 2 }),
    ]);
    const used = new Set(['used-a', 'used-b']);

    expect(selectGalleryCandidate(candidates, used).id).toBe('best');
    expect(selectGalleryCandidate(candidates, used).id).toBe('best');
    expect(candidates.map(({ id }) => id)).toEqual(['first', 'best', 'tie-later']);

    const withFresh = [
      ...candidates,
      { id: 'fresh', signature: 'new', score: 100 },
    ] as const;
    expect(selectGalleryCandidate(withFresh, used).id).toBe('fresh');
  });

  it('uses sample only for membership and a separate shuffle for canonical-set order', () => {
    const catalog = Object.freeze(['a', 'b', 'c', 'd'] as const);
    const calls: Array<{
      readonly operation: 'sample' | 'shuffle';
      readonly key: string;
      readonly values: readonly string[];
      readonly count?: number;
    }> = [];
    const random = fakeRandom(
      <Value>(key: string, values: readonly Value[], count: number): Value[] => {
        calls.push({ operation: 'sample', key, values: values as readonly string[], count });
        return [...values.slice(0, count)].reverse();
      },
      <Value>(key: string, values: readonly Value[]): Value[] => {
        calls.push({ operation: 'shuffle', key, values: values as readonly string[] });
        return key.endsWith(':0') ? [...values].reverse() : [...values];
      },
    );

    expect(createBaseTypeSchedule('test', catalog, 6, random)).toEqual([
      'd', 'c', 'b', 'a',
      // The second shuffle starts with the prior cycle's final member. The
      // deterministic rotation removes that avoidable boundary repeat.
      'b', 'a',
    ]);
    expect(catalog).toEqual(['a', 'b', 'c', 'd']);
    expect(calls).toEqual([
      {
        operation: 'sample',
        key: 'base-type-members:test:0',
        values: ['a', 'b', 'c', 'd'],
        count: 4,
      },
      {
        operation: 'shuffle',
        key: 'base-type-order:test:0',
        values: ['a', 'b', 'c', 'd'],
      },
      {
        operation: 'sample',
        key: 'base-type-members:test:1',
        values: ['a', 'b', 'c', 'd'],
        count: 2,
      },
      {
        operation: 'shuffle',
        key: 'base-type-order:test:1',
        // Sampling returned b,a; membership is intentionally restored to the
        // catalog's canonical order before the independent order stream.
        values: ['a', 'b'],
      },
    ]);
  });

  it('rejects malformed sample or shuffle output instead of silently filling a cycle', () => {
    const duplicateSample = fakeRandom(
      <Value>(_key: string, values: readonly Value[]): Value[] => [
        values[0]!,
        values[0]!,
      ],
      <Value>(_key: string, values: readonly Value[]): Value[] => [...values],
    );
    expect(() => createBaseTypeSchedule('broken-sample', ['a', 'b'], 2, duplicateSample))
      .toThrow('Invalid base-type sample for broken-sample cycle 0');

    const incompleteOrder = fakeRandom(
      <Value>(_key: string, values: readonly Value[], count: number): Value[] => (
        [...values.slice(0, count)]
      ),
      <Value>(_key: string, values: readonly Value[]): Value[] => values.slice(1),
    );
    expect(() => createBaseTypeSchedule('broken-order', ['a', 'b'], 2, incompleteOrder))
      .toThrow('Invalid base-type order for broken-order cycle 0');
  });

  it('keeps named member and order streams deterministic after unrelated call order', () => {
    const catalog = ['a', 'b', 'c', 'd', 'e'] as const;
    const direct = createBaseTypeSchedule(
      'named',
      catalog,
      12,
      createAvatarRandom('named-schedule'),
    );
    const reordered = createAvatarRandom('named-schedule');
    reordered.shuffle('unrelated-order', catalog);
    reordered.sample('unrelated-members', catalog, 3);
    reordered.sample('base-type-members:named:2', catalog, 2);
    reordered.shuffle('base-type-order:named:0', catalog);

    expect(createBaseTypeSchedule('named', catalog, 12, reordered)).toEqual(direct);
  });

  it.each(themeNames)(
    'adapts no-repeat cycles to the current %s catalog length',
    (theme) => {
      const catalog = getBaseTypeCatalog(theme);
      const length = catalog.values.length;
      const counts = [...new Set([
        0,
        1,
        length - 1,
        length + 1,
      ])].sort((left, right) => left - right);

      for (const count of counts) {
        const seed = `base-cycle:${theme}:${count}`;
        const gallery = generateGallery(count, seed, {
          themes: [theme],
          palette: 'coast',
          backgroundShape: 'rounded',
        });
        const values = baseTypeValues(theme, gallery);
        const galleryRandom = createAvatarRandom(seed, 'default:gallery');
        const candidatePoolSize = theme === 'folks'
          ? FOLKS_GALLERY_CANDIDATE_POOL_SIZE
          : GALLERY_CANDIDATE_POOL_SIZE;

        expect(gallery).toHaveLength(count);
        expectBalancedSchedule(values, catalog.values);
        for (const [index, item] of gallery.entries()) {
          const traits = item.recipe.traits as Readonly<Record<string, string>>;
          expect(Object.keys(traits)).toEqual([catalog.param]);
          expect(traits[catalog.param]).toBe(
            (item.params as Readonly<Record<string, string | number>>)[catalog.param],
          );
          expect(Array.from(
            { length: candidatePoolSize },
            (_, attempt) => galleryRandom.int(
              `item-seed:${index}:${attempt}`,
              0,
              0x7fffffff,
            ),
          )).toContain(item.recipe.seed);
          expect(createAvatar(item.recipe)).toEqual(item);
        }
      }
    },
  );

  it.each(themeNames)(
    'enforces the final 25/50/100 no-repeat contract for %s',
    (theme) => {
      const catalog = getBaseTypeCatalog(theme);
      expect(catalog.values).toHaveLength(50);

      const gallery25 = generateGallery(25, `final-cycle:${theme}:25`, {
        themes: [theme],
      });
      const gallery50 = generateGallery(50, `final-cycle:${theme}:50`, {
        themes: [theme],
      });
      const gallery100 = generateGallery(100, `final-cycle:${theme}:100`, {
        themes: [theme],
      });
      const values25 = baseTypeValues(theme, gallery25);
      const values50 = baseTypeValues(theme, gallery50);
      const values100 = baseTypeValues(theme, gallery100);

      expect(new Set(values25).size).toBe(25);
      expect([...values50].sort()).toEqual([...catalog.values].sort());
      expect(new Set(values50).size).toBe(50);
      expectBalancedSchedule(values100, catalog.values);

      const frequencies = new Map<string, number>(
        catalog.values.map((value) => [value, 0]),
      );
      for (const value of values100) {
        frequencies.set(value, frequencies.get(value)! + 1);
      }
      expect(new Set(frequencies.values())).toEqual(new Set([2]));
    },
  );

  it.each([
    ['two themes', ['folks', 'snacks'] as const, 100],
    ['three themes', ['adventurers', 'critters', 'orbs'] as const, 150],
    ['all eight themes at the public limit', themeNames, 1000],
  ] as const)(
    'tracks base-type cycles independently in %s',
    (_label, themes, count) => {
      const gallery = generateGallery(count, `mixed-cycles:${themes.length}`, {
        themes,
        palette: 'mono',
      });
      const firstRound = gallery.slice(0, themes.length).map(({ theme }) => theme);

      expect(new Set(firstRound)).toEqual(new Set(themes));
      for (let offset = 0; offset < gallery.length; offset += themes.length) {
        expect(gallery.slice(offset, offset + themes.length).map(({ theme }) => theme))
          .toEqual(firstRound);
      }
      for (const theme of themes) {
        expectBalancedSchedule(
          baseTypeValues(theme, gallery),
          getBaseTypeCatalog(theme).values,
        );
      }
    },
  );

  it('keeps caller theme order and duplicates irrelevant to the seeded schedule', () => {
    const canonical = generateGallery(96, 'canonical-schedule-set', {
      themes: ['folks', 'snacks', 'orbs'],
    });
    const reordered = generateGallery(96, 'canonical-schedule-set', {
      themes: ['orbs', 'folks', 'orbs', 'snacks', 'folks'],
    });

    expect(reordered).toEqual(canonical);
  });

  it('uses every theme-qualified base identity exactly once in a 400-item mix', () => {
    const gallery = generateGallery(400, 'final-qualified-base-cycle', {
      themes: themeNames,
      palette: 'coast',
    });
    const expected = themeNames.flatMap((theme) => {
      const catalog = getBaseTypeCatalog(theme);
      return catalog.values.map((value) => `${theme}:${value}`);
    });
    const actual = gallery.map((item) => {
      const { param } = getBaseTypeCatalog(item.theme);
      const value = (
        item.params as Readonly<Record<string, string | number>>
      )[param];
      return `${item.theme}:${String(value)}`;
    });

    expect(expected).toHaveLength(400);
    expect(actual).toHaveLength(400);
    expect(new Set(actual).size).toBe(400);
    expect([...actual].sort()).toEqual([...expected].sort());
    for (const theme of themeNames) {
      expect([...baseTypeValues(theme, gallery)].sort()).toEqual(
        [...getBaseTypeCatalog(theme).values].sort(),
      );
    }
  });

  it('keeps every item from an unseeded gallery independently replayable', () => {
    const first = generateGallery(24, {
      themes: ['folks', 'snacks', 'orbs'],
      namespace: 'unseeded-gallery',
    });
    const second = generateGallery(24, {
      themes: ['folks', 'snacks', 'orbs'],
      namespace: 'unseeded-gallery',
    });

    expect(first.map(({ recipe }) => recipe.seed))
      .not.toEqual(second.map(({ recipe }) => recipe.seed));
    for (const item of [...first, ...second]) {
      expect(createAvatar(item.recipe)).toEqual(item);
    }
  });

  it('keeps a 1000-item schedule balanced with strictly bounded candidate seeds', () => {
    const seed = 'bounded-gallery-performance';
    const namespace = 'bounded-gallery';
    const started = performance.now();
    const gallery = generateGallery(1000, seed, {
      themes: ['folks'],
      namespace,
      backgroundShape: 'square',
    });
    const elapsed = performance.now() - started;
    const catalog = getBaseTypeCatalog('folks');
    const values = baseTypeValues('folks', gallery);
    const counts = new Map<string, number>(
      catalog.values.map((value) => [value, 0]),
    );
    const galleryRandom = createAvatarRandom(seed, `${namespace}:gallery`);

    expectBalancedSchedule(values, catalog.values);
    for (const value of values) counts.set(value, counts.get(value)! + 1);
    expect(new Set(counts.values())).toEqual(new Set([20]));
    for (const [index, item] of gallery.entries()) {
      const boundedSeeds = Array.from(
        { length: FOLKS_GALLERY_CANDIDATE_POOL_SIZE },
        (_, attempt) => galleryRandom.int(
          `item-seed:${index}:${attempt}`,
          0,
          0x7fffffff,
        ),
      );
      expect(boundedSeeds).toContain(item.recipe.seed);
    }
    expect(GALLERY_CANDIDATE_POOL_SIZE).toBe(10);
    expect(elapsed).toBeLessThan(2_500);
  });
});
