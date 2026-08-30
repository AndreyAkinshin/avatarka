import { describe, expect, it } from 'vitest';
import { Rng } from 'pragmastat';
import * as avatarka from '../index';
import {
  RECIPE_VERSION,
  backgroundShapeNames,
  type AdventurersParams,
  type AvatarRenderInput,
  type GeneratedAvatar,
  type NooksParams,
  type ThemeName,
  createRecipe,
  generateAvatar,
  generateGallery,
  createAvatar,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  getPalette,
  getTheme,
  paletteNames,
  palettes,
  parseRecipe,
  themeNames,
  themes,
} from '../index';
import { createAvatarRandom } from '../internal/random';
import { createArtVariation, tonalEdge } from '../internal/art';
import { __test as fitTest } from '../fit';

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

function withVisibleSvgWhitespace(avatar: GeneratedAvatar): GeneratedAvatar {
  return {
    ...avatar,
    // Preserve byte-sensitive whitespace in protocol snapshots without adding
    // invisible trailing whitespace to the snapshot source itself.
    svg: avatar.svg.replace(/^[ \t]+$/gm, (line) => line
      .replace(/ /g, '␠')
      .replace(/\t/g, '⇥')),
  };
}

function visualPrimitiveCount(svg: string): number {
  return svg.match(/<(?:path|circle|ellipse|rect|polygon|polyline|line)\b/g)?.length ?? 0;
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

const primaryTraits = {
  folks: 'hairStyle',
  critters: 'species',
  oddlings: 'bodyShape',
  orbs: 'orbShape',
  bots: 'chassis',
  adventurers: 'archetype',
  nooks: 'dwelling',
  snacks: 'snack',
} as const;

const balancedTraits = {
  folks: ['skinTone', 'faceShape', 'topStyle'],
  critters: ['coat', 'expression'],
  oddlings: ['feature', 'pattern', 'eyeArrangement', 'mouthStyle'],
  orbs: ['faceStyle', 'accentPosition'],
  bots: ['eyeSystem', 'sideSensors', 'panel'],
  adventurers: ['skinTone', 'expression'],
  nooks: ['expression', 'windowStyle', 'material'],
  snacks: ['expression', 'finish', 'companion', 'pose'],
} as const;

describe('Avatarka v4 core', () => {
  it('derives solid tonal contours from each fill color', () => {
    expect(tonalEdge('#56bfb1', '#0c1e1c')).toBe('#3a8278');
    expect(tonalEdge('#56BFB1', '#0C1E1C', 0)).toBe('#56bfb1');
    expect(tonalEdge('#56bfb1', '#0c1e1c', 1)).toBe('#0c1e1c');
    expect(() => tonalEdge('#fff', '#0c1e1c')).toThrow('Invalid opaque hex color');
    expect(() => tonalEdge('#56bfb1', '#0c1e1c', 1.01)).toThrow(RangeError);
  });

  it('exposes only the intentional v4 runtime surface', () => {
    expect(Object.keys(avatarka).sort()).toEqual([
      'RECIPE_VERSION',
      'backgroundShapeNames',
      'createAvatar',
      'createRecipe',
      'generateAvatar',
      'generateGallery',
      'generateParams',
      'getBaseTypeCatalog',
      'getDefaultParams',
      'getPalette',
      'getTheme',
      'paletteNames',
      'palettes',
      'parseRecipe',
      'themeNames',
      'themes',
    ]);
  });

  it('keeps internal art variation stable across palettes and frame shapes', () => {
    const first = createArtVariation('folks', {
      palette: 'coast',
      backgroundShape: 'circle',
      faceShape: 'oval',
      hairStyle: 'wave',
      expression: 'soft',
    });
    const recolored = createArtVariation('folks', {
      expression: 'soft',
      hairStyle: 'wave',
      faceShape: 'oval',
      backgroundShape: 'rounded',
      palette: 'mono',
    });

    const sample = (variation: ReturnType<typeof createArtVariation>) => [
      variation.number('tilt', -3, 3),
      variation.number('eye-gap', 16, 21),
      variation.bool('detail', 0.35),
      variation.pick('side', ['left', 'right']),
    ];

    expect(sample(recolored)).toEqual(sample(first));
  });

  it('changes internal art variation when semantic identity traits change', () => {
    const first = createArtVariation('folks', {
      faceShape: 'oval',
      hairStyle: 'wave',
    });
    const second = createArtVariation('folks', {
      faceShape: 'tapered',
      hairStyle: 'wave',
    });

    expect(second.number('tilt', -3, 3)).not.toBe(first.number('tilt', -3, 3));
  });

  it('has an explicit renderer version', () => {
    expect(RECIPE_VERSION).toBe(1);
  });

  it('keeps one canonical catalog order across public APIs', () => {
    const canonicalOrder = [
      'folks',
      'adventurers',
      'critters',
      'oddlings',
      'bots',
      'snacks',
      'nooks',
      'orbs',
    ];

    expect(themeNames).toEqual(canonicalOrder);
    expect(Object.keys(themes)).toEqual(canonicalOrder);
  });

  it('exposes one deeply frozen renderer-free base-type catalog per theme', () => {
    for (const theme of themeNames) {
      const metadata = getTheme(theme);
      const catalog = getBaseTypeCatalog(theme);
      const definition = (metadata.schema as Record<string, {
        readonly type: string;
        readonly options?: readonly string[];
      }>)[catalog.param];

      expect(catalog.param).toBe(primaryTraits[theme]);
      expect(metadata.baseTypeParam).toBe(catalog.param);
      expect(definition?.type).toBe('select');
      expect(catalog.values).toBe(definition?.options);
      expect(Object.isFrozen(catalog)).toBe(true);
      expect(Object.isFrozen(catalog.values)).toBe(true);
      expect(Object.keys(catalog)).toEqual(['param', 'values']);
      expect(catalog).not.toHaveProperty('generate');
      expect(catalog).not.toHaveProperty('randomize');
      expect(metadata).not.toHaveProperty('baseTypeRandomKey');
    }

    expect(() => getBaseTypeCatalog('unknown' as never)).toThrow(
      'Unknown theme: unknown',
    );
  });

  it('keeps exactly fifty base types per theme and 400 qualified identities', () => {
    const qualifiedBaseTypes = themeNames.flatMap((theme) => {
      const values = getBaseTypeCatalog(theme).values;
      expect(values, theme).toHaveLength(50);
      return values.map((value) => `${theme}:${value}`);
    });

    expect(qualifiedBaseTypes).toHaveLength(400);
    expect(new Set(qualifiedBaseTypes).size).toBe(400);
  });

  it('keeps canonical presentation-option orders across every schema', () => {
    expect(backgroundShapeNames).toEqual(['circle', 'rounded', 'square']);
    expect(Object.isFrozen(backgroundShapeNames)).toBe(true);
    for (const theme of themeNames) {
      expect(getTheme(theme).schema.backgroundShape.options)
        .toEqual(backgroundShapeNames);
      expect(getTheme(theme).schema.palette.options).toEqual(paletteNames);
    }
  });

  it('fully retires pre-v4 and pre-rename theme ids', () => {
    const retiredThemes = ['flora', 'cosmos', 'portrait', 'orb'] as const;

    for (const retired of retiredThemes) {
      expect(themeNames).not.toContain(retired as never);
      expect(() => getTheme(retired as never)).toThrow(`Unknown theme: ${retired}`);
      expect(() => createAvatar(retired as never, 'retired-theme'))
        .toThrow(`Unknown theme: ${retired}`);
      expect(() => parseRecipe({
        format: 'avatarka',
        version: 1,
        theme: retired,
        seed: 'retired-theme',
        namespace: 'default',
      })).toThrow(`Unknown theme: ${retired}`);
    }
  });

  it('freezes the public taxonomies of the redesigned character families', () => {
    expect(getTheme('oddlings').schema.pattern.options).toEqual([
      'plain', 'belly', 'dapple', 'swoop', 'blush', 'patch',
    ]);
    expect(getTheme('adventurers').schema.archetype.options).toEqual([
      'astronaut',
      'deep-sea-diver',
      'knight',
      'aviator',
      'racer',
      'mountaineer',
      'sailor',
      'ranger',
      'mage',
      'alchemist',
      'archaeologist',
      'polar-explorer',
      'spelunker',
      'storm-chaser',
      'volcanologist',
      'cartographer',
      'field-naturalist',
      'rock-climber',
      'wildland-firefighter',
      'dog-sled-musher',
      'parachutist',
      'kayaker',
      'surfer',
      'falconer',
      'pirate',
      'samurai',
      'musketeer',
      'viking',
      'gladiator',
      'martial-artist',
      'archer',
      'druid',
      'bard',
      'rogue',
      'oracle',
      'artificer',
      'dragon-rider',
      'healer',
      'ninja',
      'masked-hero',
      'jetpack-pilot',
      'exobiologist',
      'ghost-hunter',
      'asteroid-miner',
      'mech-pilot',
      'time-traveler',
      'star-navigator',
      'portal-scout',
      'jester',
      'monster-hunter',
    ]);
    expect(getTheme('nooks').schema.dwelling.options).toEqual([
      'cabin',
      'townhouse',
      'lighthouse',
      'tent',
      'camper',
      'windmill',
      'greenhouse',
      'tower',
      'houseboat',
      'storefront',
      'cottage',
      'treehouse',
      'stilt-house',
      'hillside-home',
      'snow-dome',
      'yurt',
      'adobe-home',
      'tea-house',
      'cliff-home',
      'bridge-house',
      'observatory',
      'library',
      'bakery',
      'bathhouse',
      'train-station',
      'firehouse',
      'workshop',
      'theater',
      'barn',
      'boathouse',
      'caravan',
      'water-tower-home',
      'caboose-home',
      'space-capsule',
      'airship-cabin',
      'silo-home',
      'submarine-nook',
      'cable-car',
      'rocket-house',
      'moon-base',
      'mushroom-house',
      'acorn-house',
      'teapot-house',
      'boot-house',
      'pumpkin-house',
      'lantern-house',
      'shell-house',
      'beehive-home',
      'cloud-home',
      'tree-stump-home',
    ]);
    expect(getTheme('nooks').schema.dwelling.options).toHaveLength(50);
    expect(getTheme('nooks').schema.dwelling.options.filter(
      (dwelling) => dwelling === 'windmill',
    )).toHaveLength(1);
  });

  it('uses one kebab-case convention for every public select token', () => {
    for (const theme of themeNames) {
      for (const definition of Object.values(getTheme(theme).schema)) {
        if (definition.type !== 'select') continue;
        for (const option of definition.options) {
          expect(option, `${theme}: ${option}`).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
        }
      }
    }
  });

  it.each(themeNames)('renders %s defaults as standalone SVG', (theme) => {
    const input = { theme, params: getDefaultParams(theme) } as AvatarRenderInput;
    const svg = generateAvatar(input);

    expect(svg).toMatch(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
    expect(svg).toContain('viewBox="0 0 100 100"');
    expect(svg).toContain('</svg>');
  });

  it.each(themeNames)('is deterministic for %s', (theme) => {
    const first = generateParams(theme, 'identity-42');
    const second = generateParams(theme, 'identity-42');

    expect(second).toEqual(first);
    expect(createAvatar(theme, 'identity-42').svg)
      .toBe(createAvatar(theme, 'identity-42').svg);
  });

  it('requires an explicit seed for low-level parameter generation', () => {
    expect(() => generateParams('folks', undefined as never)).toThrow(
      'Invalid avatar seed',
    );
    expect(() => generateParams('folks', { palette: 'coast' } as never)).toThrow(
      'Invalid avatar seed',
    );
  });

  it.each(themeNames)('changes only color when recoloring %s', (theme) => {
    const params = generateParams(theme, `palette-geometry-${theme}`);
    const coast = generateAvatar(theme, { ...params, palette: 'coast' } as never);
    const orchid = generateAvatar(theme, { ...params, palette: 'orchid' } as never);
    const mono = generateAvatar(theme, { ...params, palette: 'mono' } as never);

    expect(withoutHexColors(orchid)).toBe(withoutHexColors(coast));
    expect(withoutHexColors(mono)).toBe(withoutHexColors(coast));
  });

  it('supports namespaced identities without changing the public seed', () => {
    const firstSite = generateParams('folks', 'person-42', { namespace: 'site-a' });
    const secondSite = generateParams('folks', 'person-42', { namespace: 'site-b' });

    expect(firstSite).not.toEqual(secondSite);
  });

  it('encodes namespace and seed boundaries without collisions', () => {
    const first = generateParams('orbs', 'x:orbs:string:y', { namespace: 'a' });
    const second = generateParams('orbs', 'y', { namespace: 'a:orbs:string:x' });

    expect(first).not.toEqual(second);
  });

  it('keeps optimized named streams byte-identical for Unicode seeds', () => {
    const cases = [
      { seed: 'idéntity-🦊', namespace: 'сайт/東京', key: 'trait-🌿' },
      { seed: 'quote"\nseed', namespace: 'space\\name', key: 'plain-key' },
      { seed: 42, namespace: 'числа', key: 'palette' },
    ] as const;

    for (const { seed, namespace, key } of cases) {
      const reference = new Rng(JSON.stringify([
        `avatarka:${RECIPE_VERSION}`,
        namespace,
        typeof seed,
        String(seed),
        key,
      ]));
      expect(createAvatarRandom(seed, namespace).int(key, 0, 0x7fffffff)).toBe(
        reference.uniformInt(0, 0x80000000),
      );
    }
  });

  it('keeps every named random operation stable regardless of call order', () => {
    const forward = createAvatarRandom('stream-order', 'сайт/東京');
    const reverse = createAvatarRandom('stream-order', 'сайт/東京');
    const first = {
      pick: forward.pick('pick', ['a', 'b', 'c']),
      weighted: forward.weightedPick('weighted', [['x', 1], ['y', 3]]),
      int: forward.int('int', -10, 10),
      bool: forward.bool('bool', 0.35),
      sample: forward.sample('sample', [1, 2, 3, 4, 5], 3),
      shuffle: forward.shuffle('shuffle', [1, 2, 3, 4]),
    };
    const second = {
      shuffle: reverse.shuffle('shuffle', [1, 2, 3, 4]),
      sample: reverse.sample('sample', [1, 2, 3, 4, 5], 3),
      bool: reverse.bool('bool', 0.35),
      int: reverse.int('int', -10, 10),
      weighted: reverse.weightedPick('weighted', [['x', 1], ['y', 3]]),
      pick: reverse.pick('pick', ['a', 'b', 'c']),
    };

    expect(second).toEqual(first);
  });

  it('samples readonly values deterministically without replacement or mutation', () => {
    const values = Object.freeze(['a', 'b', 'c', 'd', 'e'] as const);
    const before = [...values];
    const reference = new Rng(JSON.stringify([
      `avatarka:${RECIPE_VERSION}`,
      'sample-namespace',
      'string',
      'sample-seed',
      'sample-key',
    ])).sample([...values], 3);
    const first = createAvatarRandom('sample-seed', 'sample-namespace')
      .sample('sample-key', values, 3);
    const second = createAvatarRandom('sample-seed', 'sample-namespace')
      .sample('sample-key', values, 3);

    expect(first).toEqual(reference);
    expect(second).toEqual(first);
    expect(first).toHaveLength(3);
    expect(new Set(first).size).toBe(3);
    expect(values).toEqual(before);
    expect(createAvatarRandom('sample-seed').sample('zero', values, 0)).toEqual([]);
    const complete = createAvatarRandom('sample-seed').sample(
      'complete',
      values,
      values.length,
    );
    expect(complete).toEqual(values);
    expect(complete).not.toBe(values);
  });

  it('strictly validates named sample counts', () => {
    const random = createAvatarRandom('sample-validation');
    const values = Object.freeze(['a', 'b', 'c'] as const);

    for (const count of [
      -1,
      1.5,
      4,
      Number.MAX_SAFE_INTEGER + 1,
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ]) {
      expect(() => random.sample('invalid', values, count)).toThrow(
        new RangeError('Sample count for invalid must be an integer between 0 and 3'),
      );
    }
    expect(random.sample('empty', Object.freeze([]), 0)).toEqual([]);
    expect(() => random.sample('empty', Object.freeze([]), 1)).toThrow(
      new RangeError('Sample count for empty must be an integer between 0 and 0'),
    );
  });

  it('keeps numeric and string seeds in separate identity domains', () => {
    expect(createAvatar('orbs', 42)).not.toEqual(createAvatar('orbs', '42'));
  });

  it('uses independent entropy for rapid unseeded calls', () => {
    const values = Array.from({ length: 100 }, () => (
      createAvatarRandom().int('entropy-probe', 0, 0x7fffffff)
    ));

    expect(new Set(values).size).toBeGreaterThanOrEqual(95);
  });

  it('creates serializable recipes and reproduces typed presentation and traits', () => {
    const recipe = createRecipe('folks', 'person-42', {
      namespace: 'docs',
      palette: 'orchid',
      traits: { accessory: 'round-glasses' },
    });
    const first = createAvatar(recipe);
    const second = createAvatar(JSON.parse(JSON.stringify(recipe)) as typeof recipe);

    expect(recipe).toEqual({
      format: 'avatarka',
      version: 1,
      theme: 'folks',
      seed: 'person-42',
      namespace: 'docs',
      palette: 'orchid',
      traits: { accessory: 'round-glasses' },
    });
    expect(second).toEqual(first);
    expect(first.params.palette).toBe('orchid');
    expect(first.params.accessory).toBe('round-glasses');
  });

  it('derives unset dependent traits from explicit parent traits', () => {
    for (let seed = 0; seed < 64; seed += 1) {
      const folks = createAvatar('folks', seed, {
        traits: { skinTone: 'deep' },
      });
      expect(folks.params.hairColor).not.toBe('espresso');

      const adventurer = createAvatar('adventurers', seed, {
        traits: { archetype: 'racer' },
      });
      expect(['clear-visor', 'none', 'goggles']).toContain(
        adventurer.params.faceGear,
      );

      const critter = createAvatar('critters', seed, {
        traits: { species: 'panda' },
      });
      expect(critter.params.marking).not.toBe('eye-patch');

      const patchedCritter = createAvatar('critters', seed, {
        traits: { species: 'fox', marking: 'eye-patch' },
      });
      expect(patchedCritter.params.accessory).not.toBe('round-glasses');

      const snack = createAvatar('snacks', seed, {
        traits: { snack: 'coffee' },
      });
      expect(['plain', 'drizzle', 'stripes']).toContain(snack.params.finish);
      expect(['none', 'steam', 'pick']).toContain(snack.params.companion);

      const nook = createAvatar('nooks', seed, {
        traits: { dwelling: 'tent' },
      });
      expect(nook.params.material).toBe('canvas');
      expect(['none', 'flag', 'sign']).toContain(nook.params.accent);
    }
  });

  it('preserves explicitly selected dependent traits', () => {
    const avatar = createAvatar('critters', 'explicit-dependencies', {
      traits: {
        species: 'panda',
        marking: 'eye-patch',
        accessory: 'round-glasses',
      },
    });

    expect(avatar.params).toMatchObject({
      species: 'panda',
      marking: 'eye-patch',
      accessory: 'round-glasses',
    });
  });

  it('canonicalizes recipe bytes for equivalent traits and JSON-safe seeds', () => {
    const first = createRecipe('folks', -0, {
      traits: { hairStyle: 'wave', accessory: 'studs' },
    });
    const second = createRecipe('folks', 0, {
      traits: { accessory: 'studs', hairStyle: 'wave' },
    });
    const parsed = parseRecipe(JSON.parse(JSON.stringify({
      ...second,
      traits: { accessory: 'studs', hairStyle: 'wave' },
    })));

    expect(Object.is(first.seed, 0)).toBe(true);
    expect(JSON.stringify(second)).toBe(JSON.stringify(first));
    expect(JSON.stringify(parsed)).toBe(JSON.stringify(first));
    expect(createRecipe('folks', 'empty', { traits: {} })).not.toHaveProperty('traits');
  });

  it('canonicalizes undefined optional trait values to omission', () => {
    const omitted = createRecipe('folks', 'optional-traits');
    const undefinedOnly = createRecipe('folks', 'optional-traits', {
      traits: { hairStyle: undefined },
    });
    const partial = createRecipe('folks', 'optional-traits', {
      traits: { hairStyle: undefined, accessory: 'studs' },
    });

    expect(undefinedOnly).toEqual(omitted);
    expect(partial.traits).toEqual({ accessory: 'studs' });
    expect(generateParams('folks', 'optional-traits', {
      traits: { hairStyle: undefined },
    })).toEqual(generateParams('folks', 'optional-traits'));
    expect(createAvatar(undefinedOnly)).toEqual(createAvatar(omitted));
    expect(parseRecipe({
      ...partial,
      traits: { hairStyle: undefined, accessory: 'studs' },
    })).toEqual(partial);
    expect(() => createRecipe('folks', 'optional-traits', {
      traits: { unknown: undefined } as never,
    })).toThrow('Unknown avatar trait for folks: unknown');
    expect(() => createRecipe('folks', 'optional-traits', {
      traits: { palette: undefined } as never,
    })).toThrow('Presentation field is not an avatar trait: palette');
  });

  it('rejects recipes from unsupported protocols', () => {
    const recipe = createRecipe('orbs', 'person-42');
    expect(() => createAvatar({ ...recipe, version: 2 } as never)).toThrow(
      'Unsupported avatar recipe version',
    );
  });

  it('keeps forced gallery palettes intact instead of rewriting colors', () => {
    const gallery = generateGallery(18, 'team-42', { palette: 'coast' });

    expect(gallery).toHaveLength(18);
    expect(gallery.every((item) => item.params.palette === 'coast')).toBe(true);
    expect(gallery.every((item) => createAvatar(item.recipe).svg === item.svg)).toBe(true);
  });

  it.each(themeNames)('assigns balanced palettes in mixed %s galleries', (theme) => {
    const gallery = generateGallery(25, `mixed-palettes-${theme}`, {
      themes: [theme],
      backgroundShape: 'circle',
    });
    const counts = new Map(paletteNames.map((name) => [name, 0]));

    for (const [index, item] of gallery.entries()) {
      counts.set(item.params.palette, counts.get(item.params.palette)! + 1);
      expect(item.recipe.backgroundShape).toBe('circle');
      expect(item.recipe.palette).toBe(item.params.palette);
      expect(item.recipe.traits).toEqual({
        [primaryTraits[theme]]: (
          item.params as Record<string, string | number>
        )[primaryTraits[theme]],
      });
      expect(createAvatar(item.recipe).svg).toBe(item.svg);
      if (index > 0) {
        expect(item.params.palette).not.toBe(gallery[index - 1]!.params.palette);
      }
      if (index >= 5) {
        expect(item.params.palette).not.toBe(gallery[index - 5]!.params.palette);
      }
    }

    const frequencies = [...counts.values()];
    expect(Math.max(...frequencies) - Math.min(...frequencies)).toBeLessThanOrEqual(1);

    for (const field of balancedTraits[theme] as readonly string[]) {
      const definition = (getTheme(theme).schema as Record<string, {
        options: readonly string[];
      }>)[field]!;
      const traitCounts = new Map(definition.options.map((value) => [value, 0]));
      for (const item of gallery) {
        const value = (item.params as Record<string, string | number>)[field] as string;
        traitCounts.set(value, traitCounts.get(value)! + 1);
      }
      const traitFrequencies = [...traitCounts.values()];
      expect(
        Math.max(...traitFrequencies) - Math.min(...traitFrequencies),
        `${theme}.${field} is visually imbalanced: ${JSON.stringify([...traitCounts])}`,
      ).toBeLessThanOrEqual(5);
    }
  });

  it.each(themeNames)(
    'keeps %s gallery identities stable across presentation choices',
    (theme) => {
      const options = { themes: [theme] } as const;
      const mixed = generateGallery(12, 'presentation-invariant', options);
      const coast = generateGallery(12, 'presentation-invariant', {
        ...options,
        palette: 'coast',
        backgroundShape: 'circle',
      });
      const mono = generateGallery(12, 'presentation-invariant', {
        ...options,
        palette: 'mono',
        backgroundShape: 'rounded',
      });
      const semanticIdentity = (item: GeneratedAvatar) => ({
        seed: item.recipe.seed,
        namespace: item.recipe.namespace,
        traits: Object.fromEntries(Object.entries(item.params).filter(
          ([key]) => key !== 'palette' && key !== 'backgroundShape',
        )),
      });

      expect(mixed.map(semanticIdentity)).toEqual(coast.map(semanticIdentity));
      expect(mixed.map(semanticIdentity)).toEqual(mono.map(semanticIdentity));
      expect(mixed.every((item) => item.recipe.palette === item.params.palette)).toBe(true);
      expect(coast.every((item) => item.recipe.palette === 'coast')).toBe(true);
      expect(mono.every((item) => item.recipe.palette === 'mono')).toBe(true);
    },
  );

  it('pins only the scheduled primary trait while secondary traits stay natural', () => {
    const gallery = generateGallery(24, 'recipe-integrity', {
      palette: 'coast',
      backgroundShape: 'circle',
    });

    for (const item of gallery) {
      const baseTypeParam = primaryTraits[item.theme];
      const recipeTraits = item.recipe.traits as Readonly<Record<string, string>>;
      const naturalParams = generateParams(item.theme, item.recipe.seed, {
        namespace: item.recipe.namespace,
        traits: recipeTraits as never,
      });

      expect(item.recipe.palette).toBe('coast');
      expect(item.recipe.backgroundShape).toBe('circle');
      expect(Object.keys(recipeTraits)).toEqual([baseTypeParam]);
      expect(recipeTraits[baseTypeParam]).toBe(
        (item.params as Record<string, string | number>)[baseTypeParam],
      );
      expect(item.params).toEqual({
        ...naturalParams,
        palette: 'coast',
        backgroundShape: 'circle',
      });
    }
  });

  it('generates byte-identical seeded galleries', () => {
    const first = generateGallery(12, 'gallery-seed', { backgroundShape: 'circle' });
    const second = generateGallery(12, 'gallery-seed', { backgroundShape: 'circle' });

    expect(second).toEqual(first);
  });

  it('treats gallery themes as a canonical set, independent of caller order', () => {
    const first = generateGallery(12, 'gallery-theme-set', {
      themes: ['orbs', 'folks', 'critters'],
    });
    const second = generateGallery(12, 'gallery-theme-set', {
      themes: ['critters', 'orbs', 'folks'],
    });

    expect(second).toEqual(first);
  });

  it('exposes curated palettes', () => {
    expect(paletteNames).toEqual(['coast', 'orchid', 'clay', 'grove', 'sky', 'mono']);
    expect(getPalette('coast')).toBe(palettes.coast);
    for (const palette of Object.values(palettes)) {
      expect(palette).not.toHaveProperty('dark');
    }
  });

  it('keeps one universal palette readable on light and dark surfaces', () => {
    for (const name of paletteNames) {
      const palette = palettes[name];

      expect(contrastRatio(palette.canvas, '#ffffff'), `${name} canvas/light card`).toBeGreaterThanOrEqual(3.55);
      expect(contrastRatio(palette.canvas, '#f9fafb'), `${name} canvas/light preview`).toBeGreaterThanOrEqual(3.4);
      expect(contrastRatio(palette.canvas, '#1f2937'), `${name} canvas/dark card`).toBeGreaterThanOrEqual(3.9);
      expect(contrastRatio(palette.canvas, '#111827'), `${name} canvas/dark preview`).toBeGreaterThanOrEqual(4.75);
      expect(contrastRatio(palette.ink, palette.canvas), `${name} ink/canvas`).toBeGreaterThanOrEqual(4.7);
      expect(contrastRatio(palette.ink, palette.primary), `${name} ink/primary`).toBeGreaterThanOrEqual(6.7);
      expect(contrastRatio(palette.ink, palette.secondary), `${name} ink/secondary`).toBeGreaterThanOrEqual(11);
      expect(contrastRatio(palette.ink, palette.accent), `${name} ink/accent`).toBeGreaterThanOrEqual(6.1);
      expect(contrastRatio(palette.primary, palette.canvas), `${name} primary/canvas`).toBeGreaterThanOrEqual(1.4);
      expect(contrastRatio(palette.secondary, palette.canvas), `${name} secondary/canvas`).toBeGreaterThanOrEqual(2.35);
      expect(contrastRatio(palette.accent, palette.canvas), `${name} accent/canvas`).toBeGreaterThanOrEqual(1.25);
      expect(contrastRatio(palette.primary, palette.secondary), `${name} primary/secondary`).toBeGreaterThanOrEqual(1.45);
    }

    expect(contrastRatio(palettes.mono.primary, palettes.mono.accent))
      .toBeGreaterThanOrEqual(1.1);
  });

  it('never emits the retired near-white dark inks', () => {
    const retiredInks = [
      '#e1efed',
      '#ece9f4',
      '#f3e9e2',
      '#e8ede3',
      '#e6ecf5',
      '#e8ebef',
    ];
    const gallery = generateGallery(96, 'universal-palette-audit');

    for (const item of gallery) {
      for (const ink of retiredInks) expect(item.svg).not.toContain(ink);
    }
  });

  it('rotates harmonious body roles in named Oddlings and Orbs palettes', () => {
    const oddlingDefaults = getDefaultParams('oddlings');
    const orbDefaults = getDefaultParams('orbs');
    const palette = palettes.coast;

    const primaryOddling = generateAvatar('oddlings', {
      ...oddlingDefaults,
      feature: 'none',
      pattern: 'plain',
      bodyShape: 'pebble',
    });
    const softOddling = generateAvatar('oddlings', {
      ...oddlingDefaults,
      feature: 'none',
      pattern: 'plain',
      bodyShape: 'bean',
    });
    const accentOddling = generateAvatar('oddlings', {
      ...oddlingDefaults,
      feature: 'none',
      pattern: 'plain',
      bodyShape: 'sprout',
    });
    expect(primaryOddling).toContain(`M49 20C68 18`);
    expect(primaryOddling).toContain(`fill="${palette.primary}"`);
    expect(softOddling).toContain(`M57 18C74 22`);
    expect(softOddling).toContain(`fill="${palette.secondary}"`);
    expect(accentOddling).toContain(`M50 26C43 28 33`);
    expect(accentOddling).toContain(`fill="${palette.accent}"`);

    const primaryOrb = generateAvatar('orbs', { ...orbDefaults, orbShape: 'round' });
    const softOrb = generateAvatar('orbs', { ...orbDefaults, orbShape: 'pebble' });
    const accentOrb = generateAvatar('orbs', { ...orbDefaults, orbShape: 'drop' });
    expect(primaryOrb).toContain(`<circle cx="50" cy="52" r="30" fill="${palette.primary}"`);
    expect(softOrb).toContain(`M20 40C24 26`);
    expect(softOrb).toContain(`fill="${palette.secondary}"`);
    expect(accentOrb).toContain(`M50 9Q80 42`);
    expect(accentOrb).toContain(`fill="${palette.accent}"`);
  });

  it('preserves theme metadata types', () => {
    expect(getTheme('orbs').schema.orbShape.options).toContain('pebble');
  });

  it('rejects unsafe counts and invalid runtime options', () => {
    for (const count of [-1, 0.1, 1001, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => generateGallery(count)).toThrow(RangeError);
    }
    expect(generateGallery(0)).toEqual([]);
    expect(() => generateGallery(0, 'seed', { themes: [] })).toThrow(
      'Gallery requires at least one theme',
    );
    expect(() => generateGallery(1, 'seed', { palette: 'neon' as never })).toThrow(
      'Unknown palette',
    );
    expect(() => generateGallery(1, 'seed', { backgroundShape: 'star' as never })).toThrow(
      'Unknown background shape',
    );
  });

  it('reads gallery theme arrays densely without dispatching custom iterators', () => {
    const sparse = new Array<ThemeName>(1);
    expect(() => generateGallery(1, 'seed', { themes: sparse })).toThrow(
      'Invalid gallery themes: missing item at index 0',
    );

    const themesWithHostileIterator: ThemeName[] = ['folks'];
    Object.defineProperty(themesWithHostileIterator, Symbol.iterator, {
      configurable: true,
      value: () => {
        throw new Error('custom iterator must not run');
      },
    });

    expect(generateGallery(1, 'seed', {
      themes: themesWithHostileIterator,
    })[0]?.theme).toBe('folks');
    expect(() => generateGallery(1, 'seed', {
      themes: new Array<ThemeName>(1001).fill('folks'),
    })).toThrow('Gallery themes must contain at most 1000 items');
  });

  it('rejects malformed direct params before rendering SVG', () => {
    const defaults = getDefaultParams('folks');
    expect(() => generateAvatar('folks', {
      ...defaults,
      backgroundShape: 'circle" onload="alert(1)',
    } as never)).toThrow('Invalid avatar value for folks.backgroundShape');
    expect(() => generateAvatar('folks', {
      ...defaults,
      skinTone: undefined,
    } as never)).toThrow('Invalid avatar value for folks.skinTone');
  });

  it('rejects accessor properties at public data boundaries without invoking them', () => {
    let reads = 0;
    const getter = () => {
      reads += 1;
      return reads === 1 ? 'coast' : 'invalid';
    };
    const options: Record<string, unknown> = {};
    Object.defineProperty(options, 'palette', {
      enumerable: true,
      get: getter,
    });
    expect(() => createRecipe('folks', 'accessor', options as never)).toThrow(
      'Invalid avatar options for folks: accessor property palette',
    );

    const traits: Record<string, unknown> = {};
    Object.defineProperty(traits, 'hairStyle', {
      enumerable: true,
      get: getter,
    });
    expect(() => parseRecipe({
      ...createRecipe('folks', 'accessor'),
      traits,
    })).toThrow('Invalid avatar traits for folks: accessor property hairStyle');

    const params = getDefaultParams('folks') as Record<string, unknown>;
    Object.defineProperty(params, 'hairStyle', {
      enumerable: true,
      get: getter,
    });
    expect(() => generateAvatar('folks', params as never)).toThrow(
      'Invalid avatar parameters for folks: accessor property hairStyle',
    );

    const galleryOptions: Record<string, unknown> = {};
    Object.defineProperty(galleryOptions, 'namespace', {
      enumerable: true,
      get: getter,
    });
    expect(() => generateGallery(1, 'accessor', galleryOptions as never)).toThrow(
      'Invalid gallery options: accessor property namespace',
    );

    const galleryThemes: ThemeName[] = [];
    Object.defineProperty(galleryThemes, '0', {
      enumerable: true,
      get: getter,
    });
    expect(() => generateGallery(1, 'accessor', {
      themes: galleryThemes,
    })).toThrow('Invalid gallery themes: accessor item at index 0');
    expect(reads).toBe(0);
  });

  it('accepts plain data records from another JavaScript realm', () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    try {
      const foreignWindow = iframe.contentWindow as unknown as {
        JSON: typeof JSON;
      } | null;
      const foreignObject = foreignWindow?.JSON.parse('{}') as unknown;
      const foreignPrototype = foreignObject
        ? Object.getPrototypeOf(foreignObject)
        : undefined;
      if (!foreignPrototype) throw new Error('Expected an iframe object prototype');
      const recipe = Object.assign(
        Object.create(foreignPrototype) as Record<string, unknown>,
        JSON.parse(JSON.stringify(createRecipe('folks', 'foreign-realm'))),
      );
      const params = Object.assign(
        Object.create(foreignPrototype) as Record<string, unknown>,
        getDefaultParams('folks'),
      );

      expect(parseRecipe(recipe)).toEqual(createRecipe('folks', 'foreign-realm'));
      expect(generateAvatar('folks', params as never)).toBe(
        generateAvatar('folks', getDefaultParams('folks')),
      );
    } finally {
      iframe.remove();
    }
  });

  it('rejects prototype keys everywhere a catalog id is accepted', () => {
    for (const hostile of ['__proto__', 'constructor', 'toString']) {
      expect(() => getTheme(hostile as never)).toThrow(`Unknown theme: ${hostile}`);
      expect(() => generateParams(hostile as never, 'seed')).toThrow(
        `Unknown theme: ${hostile}`,
      );
      expect(() => parseRecipe({
        format: 'avatarka',
        version: 1,
        theme: hostile,
        seed: 'seed',
        namespace: 'default',
      })).toThrow(`Unknown theme: ${hostile}`);
    }
    expect(() => getPalette('__proto__' as never)).toThrow('Unknown palette: __proto__');
  });

  it('ignores polluted Object.prototype fields at every object trust boundary', () => {
    const polluted = {
      format: 'avatarka',
      version: 1,
      theme: 'folks',
      seed: 'polluted',
      namespace: 'polluted',
      palette: 'mono',
      params: getDefaultParams('folks'),
    } as const;
    const previous = new Map<PropertyKey, PropertyDescriptor | undefined>();

    try {
      for (const [key, value] of Object.entries(polluted)) {
        previous.set(key, Object.getOwnPropertyDescriptor(Object.prototype, key));
        Object.defineProperty(Object.prototype, key, {
          configurable: true,
          writable: true,
          value,
        });
      }

      expect(() => parseRecipe({})).toThrow('Missing avatar recipe field: format');
      expect(() => generateAvatar({} as never)).toThrow('Invalid avatar render input');
      expect(createRecipe('folks', 'safe', {})).toEqual({
        format: 'avatarka',
        version: 1,
        theme: 'folks',
        seed: 'safe',
        namespace: 'default',
      });
    } finally {
      for (const [key, descriptor] of previous) {
        if (descriptor) Object.defineProperty(Object.prototype, key, descriptor);
        else delete (Object.prototype as Record<PropertyKey, unknown>)[key];
      }
    }
  });

  it('strictly validates untrusted recipes', () => {
    const recipe = createRecipe('folks', 'person-42');

    expect(() => parseRecipe(null)).toThrow('Invalid avatar recipe');
    expect(() => parseRecipe({ ...recipe, format: 'other' })).toThrow(
      'Unknown avatar recipe format',
    );
    expect(() => parseRecipe({ ...recipe, version: 2 })).toThrow(
      'Unsupported avatar recipe version',
    );
    expect(() => parseRecipe({ ...recipe, seed: Number.POSITIVE_INFINITY })).toThrow(
      'Invalid avatar seed',
    );
    expect(() => parseRecipe({ ...recipe, namespace: null })).toThrow(
      'Invalid avatar namespace',
    );
    expect(() => parseRecipe({ ...recipe, surprise: true })).toThrow(
      'Unknown avatar recipe field: surprise',
    );
    expect(parseRecipe({
      ...recipe,
      palette: undefined,
      backgroundShape: undefined,
      traits: undefined,
    })).toEqual(recipe);
    expect(() => parseRecipe({
      ...recipe,
      traits: { palette: 'coast' },
    })).toThrow('Presentation field is not an avatar trait: palette');
    expect(() => parseRecipe({
      ...recipe,
      traits: { species: 'fox' },
    })).toThrow('Unknown avatar trait for folks: species');
    expect(() => parseRecipe({
      ...recipe,
      traits: { hairStyle: 'not-a-style' },
    })).toThrow('Invalid avatar value for folks.hairStyle');
  });

  it('returns isolated immutable metadata, recipes, and generated results', () => {
    expect(Object.isFrozen(themeNames)).toBe(true);
    expect(Object.isFrozen(paletteNames)).toBe(true);
    expect(Object.isFrozen(themes)).toBe(true);
    expect(Object.isFrozen(themes.folks)).toBe(true);
    expect(Object.isFrozen(themes.folks.schema)).toBe(true);
    expect(Object.isFrozen(themes.folks.schema.hairStyle.options)).toBe(true);
    expect(Object.isFrozen(palettes)).toBe(true);
    expect(Object.isFrozen(palettes.coast)).toBe(true);

    const source = {
      format: 'avatarka',
      version: 1,
      theme: 'folks',
      seed: 'immutable',
      namespace: 'test',
      traits: { hairStyle: 'wave' },
    } as const;
    const recipe = parseRecipe(source);
    const avatar = createAvatar(recipe);

    expect(recipe).not.toBe(source);
    expect(recipe.traits).not.toBe(source.traits);
    expect(Object.isFrozen(recipe)).toBe(true);
    expect(Object.isFrozen(recipe.traits)).toBe(true);
    expect(Object.isFrozen(avatar)).toBe(true);
    expect(Object.isFrozen(avatar.params)).toBe(true);
  });

  it('captures entropy in an omitted-seed recipe', () => {
    const avatar = createAvatar('folks');

    expect(typeof avatar.recipe.seed).toBe('string');
    expect(createAvatar(avatar.recipe)).toEqual(avatar);
  });

  it('accepts a correlated generated avatar as direct render input', () => {
    const [avatar] = generateGallery(1, 'correlated-input', {
      themes: ['folks'],
    });

    expect(generateAvatar(avatar!)).toBe(avatar!.svg);
  });

  it('fits the Folks bust geometrically without a clip or halo on deep portraits', () => {
    const svg = generateAvatar('folks', {
      ...getDefaultParams('folks'),
      skinTone: 'deep',
    });

    expect(svg).not.toContain('id=');
    expect(svg).not.toContain('clip-path');
    expect(svg).toContain('fill="#684236"');
    expect(svg).toContain(`stroke="${tonalEdge('#684236', '#211310', 0.28)}"`);
    expect(svg).not.toContain('stroke="#211310"');
    expect(svg).not.toContain('#b87961');
  });

  it('keeps the darkest Folks silhouettes distinct on every universal canvas', () => {
    const cases = [
      {
        skinTone: 'umber',
        hairColor: 'espresso',
        skin: '#85543c',
        ink: '#2b1a16',
        hair: '#4a332a',
      },
      {
        skinTone: 'deep',
        hairColor: 'ink',
        skin: '#684236',
        ink: '#211310',
        hair: '#25282c',
      },
    ] as const;

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      for (const personCase of cases) {
        const edge = tonalEdge(personCase.skin, personCase.ink, 0.28);
        const feature = tonalEdge(
          personCase.skin,
          personCase.ink,
          personCase.skinTone === 'deep' ? 0.72 : 0.62,
        );
        const svg = generateAvatar('folks', {
          ...getDefaultParams('folks'),
          palette: paletteName,
          skinTone: personCase.skinTone,
          hairColor: personCase.hairColor,
          hairStyle: 'coils',
        });

        expect(svg).toContain(`fill="${personCase.skin}"`);
        expect(svg).toContain(`fill="${personCase.hair}"`);
        expect(svg).toContain(`stroke="${edge}"`);
        expect(svg).toContain(`stroke="${feature}"`);
        expect(contrastRatio(personCase.skin, palette.canvas)).toBeGreaterThanOrEqual(1.7);
        expect(contrastRatio(personCase.hair, palette.canvas)).toBeGreaterThanOrEqual(3.1);
        expect(contrastRatio(edge, personCase.skin)).toBeGreaterThanOrEqual(1.25);
        expect(contrastRatio(feature, personCase.skin)).toBeGreaterThanOrEqual(1.75);
        expect(contrastRatio(feature, personCase.skin)).toBeGreaterThan(
          contrastRatio(edge, personCase.skin),
        );
      }
    }
  });

  it('uses natural dark facial lines for the darkest Adventurers skin tones', () => {
    const cases = [
      { skinTone: 'umber', skin: '#85543c', pupil: '#160d0b' },
      { skinTone: 'deep', skin: '#684236', pupil: '#120a09' },
    ] as const;

    for (const adventurerCase of cases) {
      const edge = tonalEdge(adventurerCase.skin, adventurerCase.pupil, 0.28);
      const feature = tonalEdge(
        adventurerCase.skin,
        adventurerCase.pupil,
        adventurerCase.skinTone === 'deep' ? 0.72 : 0.62,
      );
      const svg = generateAvatar('adventurers', {
        ...getDefaultParams('adventurers'),
        skinTone: adventurerCase.skinTone,
      });

      expect(svg).toContain(`fill="${adventurerCase.skin}"`);
      expect(svg).toContain(`stroke="${edge}"`);
      expect(svg).toContain(`stroke="${feature}"`);
      expect(svg).toContain(`fill="${adventurerCase.pupil}"`);
      expect(contrastRatio(edge, adventurerCase.skin)).toBeGreaterThanOrEqual(1.3);
      expect(contrastRatio(feature, adventurerCase.skin)).toBeGreaterThanOrEqual(1.9);
      expect(contrastRatio(feature, adventurerCase.skin)).toBeGreaterThan(
        contrastRatio(edge, adventurerCase.skin),
      );
    }
  });

  it('keeps Folks canvases free of the old inner oval backdrop', () => {
    const svg = generateAvatar('folks', getDefaultParams('folks'));

    expect(svg).not.toContain('M17 88 L17 54');
  });

  it('avoids low-contrast hair matches in generated Folks identities', () => {
    const incompatible = new Set([
      'sand/silver',
      'honey/gold',
      'honey/silver',
      'copper/copper',
      'umber/chestnut',
      'deep/espresso',
    ]);

    for (let index = 0; index < 2_000; index++) {
      const params = generateParams('folks', `folks-contrast-${index}`);
      expect(incompatible.has(`${params.skinTone}/${params.hairColor}`)).toBe(false);
    }
  });

  it('avoids conflicting natural masks, eye patches, and glasses in Critters', () => {
    for (let index = 0; index < 2_000; index++) {
      const params = generateParams('critters', `critter-compatibility-${index}`);
      if (params.species === 'panda' || params.species === 'raccoon') {
        expect(params.marking).not.toBe('eye-patch');
      }
      if (params.marking === 'eye-patch') {
        expect(params.accessory).not.toBe('round-glasses');
      }
    }
  });

  it('keeps Adventurers face gear appropriate to each role', () => {
    const compatibleGear = {
      astronaut: ['none', 'clear-visor', 'round-glasses', 'goggles'],
      'deep-sea-diver': ['none', 'clear-visor', 'goggles', 'round-glasses'],
      knight: ['none', 'clear-visor', 'round-glasses', 'monocle'],
      aviator: ['goggles', 'none', 'round-glasses', 'clear-visor'],
      racer: ['clear-visor', 'none', 'goggles'],
      mountaineer: ['goggles', 'none', 'round-glasses', 'clear-visor'],
      sailor: ['none', 'round-glasses', 'monocle'],
      ranger: ['none', 'round-glasses', 'goggles', 'monocle'],
      mage: ['round-glasses', 'none', 'monocle', 'goggles'],
      alchemist: ['goggles', 'round-glasses', 'monocle', 'none', 'clear-visor'],
      archaeologist: ['none', 'round-glasses', 'monocle'],
      'polar-explorer': ['none', 'goggles', 'clear-visor'],
      spelunker: ['none', 'goggles', 'clear-visor'],
      'storm-chaser': ['none', 'goggles', 'clear-visor'],
      volcanologist: ['none', 'goggles', 'clear-visor', 'round-glasses'],
      cartographer: ['none', 'round-glasses', 'monocle'],
      'field-naturalist': ['none', 'round-glasses', 'goggles'],
      'rock-climber': ['none', 'goggles', 'clear-visor'],
      'wildland-firefighter': ['none', 'goggles', 'clear-visor'],
      'dog-sled-musher': ['none', 'goggles', 'round-glasses'],
      parachutist: ['none', 'goggles', 'clear-visor'],
      kayaker: ['none', 'goggles', 'clear-visor'],
      surfer: ['none', 'round-glasses'],
      falconer: ['none', 'round-glasses', 'monocle'],
      pirate: ['none', 'round-glasses', 'monocle'],
      samurai: ['none'],
      musketeer: ['none', 'round-glasses', 'monocle'],
      viking: ['none', 'round-glasses'],
      gladiator: ['none', 'clear-visor'],
      'martial-artist': ['none', 'round-glasses'],
      archer: ['none', 'round-glasses', 'goggles'],
      druid: ['none', 'round-glasses'],
      bard: ['none', 'round-glasses', 'monocle'],
      rogue: ['none', 'goggles', 'monocle'],
      oracle: ['none', 'round-glasses'],
      artificer: ['none', 'round-glasses', 'goggles'],
      'dragon-rider': ['none', 'goggles', 'clear-visor'],
      healer: ['none', 'round-glasses'],
      ninja: ['none'],
      'masked-hero': ['none'],
      'jetpack-pilot': ['none', 'goggles', 'clear-visor'],
      exobiologist: ['none', 'round-glasses', 'goggles'],
      'ghost-hunter': ['none', 'round-glasses', 'goggles'],
      'asteroid-miner': ['none', 'goggles', 'clear-visor'],
      'mech-pilot': ['none', 'goggles', 'clear-visor'],
      'time-traveler': ['none', 'round-glasses', 'monocle'],
      'star-navigator': ['none', 'round-glasses', 'monocle'],
      'portal-scout': ['none', 'goggles', 'clear-visor'],
      jester: ['none', 'round-glasses'],
      'monster-hunter': ['none', 'round-glasses', 'goggles', 'monocle'],
    } as const;

    for (let index = 0; index < 2_000; index++) {
      const params = generateParams('adventurers', `adventurer-compatibility-${index}`);
      expect(compatibleGear[params.archetype]).toContain(params.faceGear);
    }
  });

  it('honors every Adventurers primary-role override and balances the full catalog', () => {
    const archetypes = getTheme('adventurers').schema.archetype.options;

    for (const archetype of archetypes) {
      const avatar = createAvatar('adventurers', `primary-override:${archetype}`, {
        traits: { archetype },
      });
      expect(avatar.params.archetype).toBe(archetype);
    }

    const gallery = generateGallery(100, 'adventurers-full-catalog', {
      themes: ['adventurers'],
      palette: 'coast',
      backgroundShape: 'circle',
    });
    const counts = new Map(archetypes.map((archetype) => [archetype, 0]));
    for (const item of gallery) {
      counts.set(item.params.archetype, counts.get(item.params.archetype)! + 1);
    }

    expect([...counts.keys()]).toEqual(archetypes);
    expect([...counts.values()]).toEqual(archetypes.map(() => 2));
  });

  it('keeps Nooks materials, windows, and accents architecturally plausible', () => {
    const compatibleMaterials = {
      cabin: ['wood', 'plaster', 'brick'],
      townhouse: ['brick', 'plaster', 'wood'],
      lighthouse: ['plaster', 'brick'],
      tent: ['canvas'],
      camper: ['plaster', 'canvas'],
      windmill: ['wood', 'brick', 'plaster'],
      greenhouse: ['glass'],
      tower: ['brick', 'plaster'],
      houseboat: ['wood', 'plaster'],
      storefront: ['brick', 'plaster', 'glass', 'wood'],
      cottage: ['plaster', 'wood', 'brick'],
      treehouse: ['wood'],
      'stilt-house': ['wood', 'plaster'],
      'hillside-home': ['plaster', 'brick', 'wood'],
      'snow-dome': ['plaster', 'glass'],
      yurt: ['canvas'],
      'adobe-home': ['plaster', 'brick'],
      'tea-house': ['wood', 'plaster'],
      'cliff-home': ['brick', 'plaster'],
      'bridge-house': ['brick', 'wood', 'plaster'],
      observatory: ['plaster', 'brick', 'glass'],
      library: ['brick', 'plaster', 'wood'],
      bakery: ['brick', 'plaster', 'wood'],
      bathhouse: ['wood', 'plaster', 'brick'],
      'train-station': ['brick', 'plaster', 'wood'],
      firehouse: ['brick', 'plaster'],
      workshop: ['wood', 'brick', 'plaster'],
      theater: ['plaster', 'brick', 'wood'],
      barn: ['wood', 'brick'],
      boathouse: ['wood', 'plaster'],
      caravan: ['wood', 'plaster', 'canvas'],
      'water-tower-home': ['wood', 'plaster'],
      'caboose-home': ['wood', 'plaster'],
      'space-capsule': ['plaster', 'glass'],
      'airship-cabin': ['wood', 'plaster', 'glass'],
      'silo-home': ['wood', 'brick', 'plaster'],
      'submarine-nook': ['plaster', 'glass'],
      'cable-car': ['wood', 'plaster', 'glass'],
      'rocket-house': ['plaster', 'glass'],
      'moon-base': ['plaster', 'glass'],
      'mushroom-house': ['plaster', 'wood'],
      'acorn-house': ['wood'],
      'teapot-house': ['plaster', 'wood'],
      'boot-house': ['wood', 'plaster'],
      'pumpkin-house': ['plaster', 'wood'],
      'lantern-house': ['plaster', 'glass'],
      'shell-house': ['plaster', 'glass'],
      'beehive-home': ['wood', 'plaster'],
      'cloud-home': ['plaster', 'glass', 'canvas'],
      'tree-stump-home': ['wood'],
    } as const satisfies Record<NooksParams['dwelling'], readonly NooksParams['material'][]>;
    const compatibleWindows = {
      cabin: ['square', 'round', 'arched', 'shuttered'],
      townhouse: ['square', 'arched', 'shuttered'],
      lighthouse: ['round', 'arched'],
      tent: ['round', 'arched'],
      camper: ['square', 'round', 'arched'],
      windmill: ['round', 'arched'],
      greenhouse: ['square', 'round', 'arched'],
      tower: ['square', 'arched', 'shuttered'],
      houseboat: ['square', 'round', 'arched'],
      storefront: ['square', 'round', 'arched'],
      cottage: ['round', 'arched', 'shuttered'],
      treehouse: ['square', 'round', 'shuttered'],
      'stilt-house': ['square', 'round'],
      'hillside-home': ['round', 'arched'],
      'snow-dome': ['round', 'arched'],
      yurt: ['round', 'arched'],
      'adobe-home': ['square', 'arched'],
      'tea-house': ['square', 'shuttered'],
      'cliff-home': ['round', 'arched'],
      'bridge-house': ['arched', 'square'],
      observatory: ['round', 'arched'],
      library: ['arched', 'shuttered'],
      bakery: ['round', 'arched', 'shuttered'],
      bathhouse: ['round', 'arched'],
      'train-station': ['arched', 'square'],
      firehouse: ['square', 'arched'],
      workshop: ['square', 'shuttered'],
      theater: ['arched', 'round'],
      barn: ['square', 'round'],
      boathouse: ['round', 'square'],
      caravan: ['round', 'arched', 'shuttered'],
      'water-tower-home': ['round', 'square'],
      'caboose-home': ['square', 'arched'],
      'space-capsule': ['round', 'square'],
      'airship-cabin': ['round', 'arched'],
      'silo-home': ['round', 'arched'],
      'submarine-nook': ['round'],
      'cable-car': ['square', 'round'],
      'rocket-house': ['round', 'arched'],
      'moon-base': ['round', 'square'],
      'mushroom-house': ['round', 'arched'],
      'acorn-house': ['round', 'arched'],
      'teapot-house': ['round', 'arched'],
      'boot-house': ['square', 'arched'],
      'pumpkin-house': ['round', 'arched'],
      'lantern-house': ['square', 'arched'],
      'shell-house': ['round', 'arched'],
      'beehive-home': ['round', 'arched'],
      'cloud-home': ['round'],
      'tree-stump-home': ['round', 'arched', 'shuttered'],
    } as const satisfies Record<NooksParams['dwelling'], readonly NooksParams['windowStyle'][]>;
    const compatibleAccents = {
      cabin: ['none', 'chimney', 'flag', 'flower-box', 'sign'],
      townhouse: ['none', 'chimney', 'awning', 'flower-box', 'sign'],
      lighthouse: ['none', 'flag', 'sign'],
      tent: ['none', 'flag', 'sign'],
      camper: ['none', 'awning', 'flower-box', 'sign'],
      windmill: ['none', 'flag', 'flower-box'],
      greenhouse: ['none', 'awning', 'flower-box', 'sign'],
      tower: ['none', 'flag', 'flower-box', 'sign'],
      houseboat: ['none', 'chimney', 'flag', 'flower-box', 'sign'],
      storefront: ['none', 'awning', 'flower-box', 'sign'],
      cottage: ['none', 'chimney', 'flower-box', 'sign'],
      treehouse: ['none', 'flag', 'flower-box', 'sign'],
      'stilt-house': ['none', 'flag', 'awning', 'sign'],
      'hillside-home': ['none', 'chimney', 'flower-box', 'sign'],
      'snow-dome': ['none', 'flag', 'sign'],
      yurt: ['none', 'flag', 'sign'],
      'adobe-home': ['none', 'chimney', 'awning', 'flower-box', 'sign'],
      'tea-house': ['none', 'awning', 'flower-box', 'sign'],
      'cliff-home': ['none', 'flag', 'flower-box', 'sign'],
      'bridge-house': ['none', 'flag', 'flower-box', 'sign'],
      observatory: ['none', 'flag', 'sign'],
      library: ['none', 'awning', 'flower-box', 'sign'],
      bakery: ['none', 'awning', 'flower-box', 'sign'],
      bathhouse: ['none', 'chimney', 'flower-box', 'sign'],
      'train-station': ['none', 'flag', 'awning', 'flower-box', 'sign'],
      firehouse: ['none', 'flag', 'sign'],
      workshop: ['none', 'chimney', 'awning', 'sign'],
      theater: ['none', 'flag', 'awning', 'sign'],
      barn: ['none', 'flag', 'flower-box', 'sign'],
      boathouse: ['none', 'flag', 'flower-box', 'sign'],
      caravan: ['none', 'awning', 'flower-box', 'sign'],
      'water-tower-home': ['none', 'flag', 'flower-box', 'sign'],
      'caboose-home': ['none', 'chimney', 'flag', 'sign'],
      'space-capsule': ['none', 'flag', 'sign'],
      'airship-cabin': ['none', 'flag', 'sign'],
      'silo-home': ['none', 'chimney', 'flag', 'sign'],
      'submarine-nook': ['none', 'flag', 'sign'],
      'cable-car': ['none', 'flag', 'flower-box', 'sign'],
      'rocket-house': ['none', 'flag', 'sign'],
      'moon-base': ['none', 'flag', 'sign'],
      'mushroom-house': ['none', 'flower-box', 'sign'],
      'acorn-house': ['none', 'flag', 'flower-box', 'sign'],
      'teapot-house': ['none', 'flower-box', 'sign'],
      'boot-house': ['none', 'flower-box', 'sign'],
      'pumpkin-house': ['none', 'flower-box', 'sign'],
      'lantern-house': ['none', 'flag', 'sign'],
      'shell-house': ['none', 'flag', 'flower-box', 'sign'],
      'beehive-home': ['none', 'flower-box', 'sign'],
      'cloud-home': ['none', 'flag', 'sign'],
      'tree-stump-home': ['none', 'chimney', 'flower-box', 'sign'],
    } as const satisfies Record<NooksParams['dwelling'], readonly NooksParams['accent'][]>;

    for (const dwelling of getTheme('nooks').schema.dwelling.options) {
      for (let index = 0; index < 40; index++) {
        const params = generateParams('nooks', `nook-compatibility-${dwelling}-${index}`, {
          traits: { dwelling },
        });
        expect(compatibleMaterials[dwelling]).toContain(params.material);
        expect(compatibleWindows[dwelling]).toContain(params.windowStyle);
        expect(compatibleAccents[dwelling]).toContain(params.accent);
      }
    }
  });

  it('treats repeated themes as one gallery choice', () => {
    const duplicated = generateGallery(8, 'gallery-seed', {
      themes: ['orbs', 'orbs', 'folks'],
    });
    const unique = generateGallery(8, 'gallery-seed', {
      themes: ['orbs', 'folks'],
    });

    expect(duplicated).toEqual(unique);
  });

  it.each(themeNames)('avoids duplicate %s identities in demo-sized galleries', (theme) => {
    const gallery = generateGallery(25, `unique-${theme}`, {
      themes: [theme],
      palette: 'coast',
      backgroundShape: 'circle',
    });
    const signatures = gallery.map((item) => JSON.stringify(item.params));

    expect(new Set(signatures).size).toBe(gallery.length);
  });

  it.each([
    ['adventurers', 16.5, 22],
    ['nooks', 15, 20],
  ] as const)(
    'keeps %s illustration density close to the mature themes',
    (theme, averageLimit, individualLimit) => {
      const counts = generateGallery(25, `detail-density-${theme}`, {
        themes: [theme],
        backgroundShape: 'circle',
      }).map((item) => visualPrimitiveCount(item.svg));
      const average = counts.reduce((total, count) => total + count, 0) / counts.length;

      expect(average).toBeLessThanOrEqual(averageLimit);
      expect(Math.max(...counts)).toBeLessThanOrEqual(individualLimit);
    },
  );

  it('keeps optional Adventurers and Nooks decoration optional in real galleries', () => {
    let adventurerCount = 0;
    let gearedAdventurers = 0;
    let markedAdventurers = 0;
    let nookCount = 0;
    let accentedNooks = 0;

    for (let version = 0; version < 12; version++) {
      const adventurers = generateGallery(25, `optional-adventurers-${version}`, {
        themes: ['adventurers'],
        backgroundShape: 'circle',
      });
      const nooks = generateGallery(25, `optional-nooks-${version}`, {
        themes: ['nooks'],
        backgroundShape: 'circle',
      });

      adventurerCount += adventurers.length;
      gearedAdventurers += adventurers.filter(
        (item) => (item.params as AdventurersParams).faceGear !== 'none',
      ).length;
      markedAdventurers += adventurers.filter(
        (item) => (item.params as AdventurersParams).insignia !== 'none',
      ).length;
      nookCount += nooks.length;
      accentedNooks += nooks.filter(
        (item) => (item.params as NooksParams).accent !== 'none',
      ).length;
    }

    expect(gearedAdventurers / adventurerCount).toBeLessThan(0.6);
    expect(markedAdventurers / adventurerCount).toBeLessThan(0.52);
    expect(accentedNooks / nookCount).toBeLessThan(0.62);
  });

  it.each(themeNames)(
    'keeps mixed %s galleries structurally unique after recoloring',
    (theme) => {
      for (let version = 0; version < 12; version++) {
        const gallery = generateGallery(25, `v4-demo:${theme}:${version}`, {
          themes: [theme],
          backgroundShape: 'circle',
        });
        const signatures = gallery.map(({ params }) => JSON.stringify(
          Object.fromEntries(Object.entries(params).filter(([key]) => key !== 'palette')),
        ));
        const monoSvgs = gallery.map(({ params }) => generateAvatar(theme, {
          ...params,
          palette: 'mono',
        } as never));

        expect(
          new Set(signatures).size,
          `${theme} gallery ${version} repeats structural params`,
        ).toBe(gallery.length);
        expect(
          new Set(monoSvgs).size,
          `${theme} gallery ${version} collapses to duplicate Mono SVGs`,
        ).toBe(gallery.length);
      }
    },
    30_000,
  );

  it('keeps Orbs highly diverse at the bounded gallery limit', () => {
    const gallery = generateGallery(1000, 'orbs-saturation', {
      themes: ['orbs'],
      backgroundShape: 'circle',
    });
    const signatures = new Set(
      gallery.map((item) => JSON.stringify(item.params)),
    );

    expect(gallery).toHaveLength(1000);
    // Candidate selection is deliberately fixed and bounded: it penalizes a
    // repeated semantic identity but cannot promise a collision-free sample at
    // saturation without retry probing or secondary-trait recipe overrides.
    expect(signatures.size).toBeGreaterThanOrEqual(gallery.length * 0.99);
  });

  it.each(themeNames)('balances primary %s silhouettes across a gallery', (theme) => {
    const gallery = generateGallery(25, `balanced-${theme}`, {
      themes: [theme],
      palette: 'coast',
      backgroundShape: 'circle',
    });
    const counts = new Map<string | number, number>();

    for (const item of gallery) {
      const value = (item.params as Record<string, string | number>)[primaryTraits[theme]]!;
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    const frequencies = [...counts.values()];
    expect(Math.max(...frequencies) - Math.min(...frequencies)).toBeLessThanOrEqual(1);

    for (const field of balancedTraits[theme] as readonly string[]) {
      const definition = (getTheme(theme).schema as Record<string, {
        options: readonly string[];
      }>)[field]!;
      const traitCounts = new Map(definition.options.map((value) => [value, 0]));
      for (const item of gallery) {
        const value = (item.params as Record<string, string | number>)[field] as string;
        traitCounts.set(value, traitCounts.get(value)! + 1);
      }
      const traitFrequencies = [...traitCounts.values()];
      expect(
        Math.max(...traitFrequencies) - Math.min(...traitFrequencies),
        `${theme}.${field} is visually imbalanced in a fixed palette: ${JSON.stringify([...traitCounts])}`,
      ).toBeLessThanOrEqual(5);
    }
  });

  it('keeps eyewear from taking over Folks demo galleries', () => {
    for (let version = 0; version < 32; version++) {
      const gallery = generateGallery(25, `v4-demo:folks:${version}`, {
        themes: ['folks'],
        backgroundShape: 'circle',
      });
      const eyewearCount = gallery.filter((item) => {
        if (item.theme !== 'folks') return false;
        return item.params.accessory === 'round-glasses'
          || item.params.accessory === 'soft-glasses';
      }).length;

      expect(eyewearCount, `folks demo gallery ${version}`).toBeLessThanOrEqual(6);
    }
  });

  it.each(['folks', 'adventurers'] as const)(
    'keeps the darkest %s skin tones present without letting them dominate 5x5 galleries',
    (theme) => {
      let darkestToneCount = 0;
      let darkerToneCount = 0;

      for (let version = 0; version < 64; version++) {
        const gallery = generateGallery(25, `v4-demo:${theme}:${version}`, {
          themes: [theme],
          backgroundShape: 'circle',
        });
        const toneCounts = new Map(
          getTheme(theme).schema.skinTone.options.map((tone) => [tone, 0]),
        );

        for (const item of gallery) {
          toneCounts.set(
            item.params.skinTone,
            toneCounts.get(item.params.skinTone)! + 1,
          );
        }

        const deepCount = toneCounts.get('deep')!;
        const darkestInGallery = deepCount + toneCounts.get('umber')!;
        darkestToneCount += darkestInGallery;
        darkerToneCount += darkestInGallery + toneCounts.get('copper')!;

        // Diversity is retained in every gallery, while the very darkest tones
        // occupy less of the grid than under the previous even-share target.
        expect(Math.min(...toneCounts.values()), `${theme} gallery ${version}`)
          .toBeGreaterThanOrEqual(2);
        expect(deepCount, `${theme} gallery ${version}`).toBeLessThanOrEqual(3);
        expect(darkestInGallery, `${theme} gallery ${version}`).toBeLessThanOrEqual(6);
      }

      // Bound the whole deterministic corpus as well as each gallery so a
      // future scorer cannot satisfy the per-gallery ceiling on every seed and
      // still drift back toward the previous, visually heavier mix.
      expect(darkestToneCount).toBeLessThanOrEqual(64 * 4.5);
      expect(darkerToneCount).toBeLessThanOrEqual(64 * 8);
    },
    30_000,
  );

  it.each(['folks', 'adventurers'] as const)(
    'keeps the initial %s demo gallery visibly weighted without dropping a skin tone',
    (theme) => {
      const gallery = generateGallery(25, 'avatarka-v4-demo', {
        themes: [theme],
        namespace: 'demo',
        backgroundShape: 'circle',
      });
      const toneCounts = new Map(
        getTheme(theme).schema.skinTone.options.map((tone) => [tone, 0]),
      );
      for (const item of gallery) {
        toneCounts.set(
          item.params.skinTone,
          toneCounts.get(item.params.skinTone)! + 1,
        );
      }

      expect(Math.min(...toneCounts.values())).toBeGreaterThanOrEqual(2);
      expect(toneCounts.get('umber')! + toneCounts.get('deep')!)
        .toBeLessThanOrEqual(4);
      expect(
        toneCounts.get('copper')!
        + toneCounts.get('umber')!
        + toneCounts.get('deep')!,
      ).toBeLessThanOrEqual(7);
    },
  );

  it('keeps every Orbs composition inside the avatar circle without CSS clipping', () => {
    const defaults = getDefaultParams('orbs');
    const orbsSchema = getTheme('orbs').schema;
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('orbs', defaults)).not.toContain('clip-path');
    for (const orbShape of orbsSchema.orbShape.options) {
      for (const faceStyle of orbsSchema.faceStyle.options) {
        for (const accentPosition of orbsSchema.accentPosition.options) {
          const radius = avatarRadius(generateAvatar('orbs', {
            ...defaults,
            backgroundShape: 'circle',
            orbShape,
            faceStyle,
            accentPosition,
          }));
          if (radius > maximum.radius) {
            maximum = { radius, label: `${orbShape}/${faceStyle}/${accentPosition}` };
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(43.1);
  });

  it('keeps every Bots composition inside the avatar circle without CSS clipping', () => {
    const defaults = getDefaultParams('bots');
    const botsSchema = getTheme('bots').schema;
    let minimum = { radius: Number.POSITIVE_INFINITY, label: '' };
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('bots', defaults)).not.toContain('clip-path');
    for (const chassis of botsSchema.chassis.options) {
      for (const eyeSystem of botsSchema.eyeSystem.options) {
        for (const antenna of botsSchema.antenna.options) {
          for (const sideSensors of botsSchema.sideSensors.options) {
            for (const panel of botsSchema.panel.options) {
              const radius = avatarRadius(generateAvatar('bots', {
                ...defaults,
                backgroundShape: 'circle',
                chassis,
                eyeSystem,
                antenna,
                sideSensors,
                panel,
              }));
              if (radius < minimum.radius) {
                minimum = {
                  radius,
                  label: `${chassis}/${eyeSystem}/${antenna}/${sideSensors}/${panel}`,
                };
              }
              if (radius > maximum.radius) {
                maximum = {
                  radius,
                  label: `${chassis}/${eyeSystem}/${antenna}/${sideSensors}/${panel}`,
                };
              }
            }
          }
        }
      }
    }

    expect(minimum.radius, minimum.label).toBeGreaterThanOrEqual(43.9);
    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(44.1);
  }, 30_000);

  it('fits every Critters geometry inside the padded avatar circle', () => {
    const defaults = getDefaultParams('critters');
    const species = getTheme('critters').schema.species.options;
    const expressions = getTheme('critters').schema.expression.options;
    const markings = getTheme('critters').schema.marking.options;
    const accessories = getTheme('critters').schema.accessory.options;

    expect(generateAvatar('critters', defaults)).not.toContain('clip-path');

    for (const speciesValue of species) {
      for (const expression of expressions) {
        for (const marking of markings) {
          for (const accessory of accessories) {
            const svg = generateAvatar('critters', {
              ...defaults,
              backgroundShape: 'circle',
              species: speciesValue,
              expression,
              marking,
              accessory,
            });
            const radius = avatarRadius(svg);

            expect(
              radius,
              `${speciesValue}/${expression}/${marking}/${accessory} overflows`,
            ).toBeLessThanOrEqual(46.1);
            expect(radius, `${speciesValue}/${expression}/${marking}/${accessory} too small`)
              .toBeGreaterThan(38);
          }
        }
      }
    }
  });

  it('fits every Oddlings composition inside the padded avatar circle', () => {
    const defaults = getDefaultParams('oddlings');
    const oddlingsSchema = getTheme('oddlings').schema;
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('oddlings', defaults)).not.toContain('clip-path');
    for (const bodyShape of oddlingsSchema.bodyShape.options) {
      for (const feature of oddlingsSchema.feature.options) {
        for (const eyeArrangement of oddlingsSchema.eyeArrangement.options) {
          for (const mouthStyle of oddlingsSchema.mouthStyle.options) {
            for (const pattern of oddlingsSchema.pattern.options) {
              const radius = avatarRadius(generateAvatar('oddlings', {
                ...defaults,
                backgroundShape: 'circle',
                bodyShape,
                feature,
                eyeArrangement,
                mouthStyle,
                pattern,
              }));
              if (radius > maximum.radius) {
                maximum = {
                  radius,
                  label: `${bodyShape}/${feature}/${eyeArrangement}/${mouthStyle}/${pattern}`,
                };
              }
            }
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(46.1);
  }, 30_000);

  it('fits every Adventurers composition inside the padded avatar circle', () => {
    const defaults = getDefaultParams('adventurers');
    const adventurersSchema = getTheme('adventurers').schema;
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('adventurers', defaults)).not.toContain('clip-path');
    for (const archetype of adventurersSchema.archetype.options) {
      for (const skinTone of adventurersSchema.skinTone.options) {
        for (const expression of adventurersSchema.expression.options) {
          for (const faceGear of adventurersSchema.faceGear.options) {
            for (const insignia of adventurersSchema.insignia.options) {
              const radius = avatarRadius(generateAvatar('adventurers', {
                ...defaults,
                backgroundShape: 'circle',
                archetype,
                skinTone,
                expression,
                faceGear,
                insignia,
              }));
              if (radius > maximum.radius) {
                maximum = {
                  radius,
                  label: `${archetype}/${skinTone}/${expression}/${faceGear}/${insignia}`,
                };
              }
            }
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(46.1);
  }, 30_000);

  it('fits every Nooks composition inside the padded avatar circle', () => {
    const defaults = getDefaultParams('nooks');
    const nooksSchema = getTheme('nooks').schema;
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('nooks', defaults)).not.toContain('clip-path');
    for (const dwelling of nooksSchema.dwelling.options) {
      for (const expression of nooksSchema.expression.options) {
        for (const windowStyle of nooksSchema.windowStyle.options) {
          for (const material of nooksSchema.material.options) {
            for (const accent of nooksSchema.accent.options) {
              const radius = avatarRadius(generateAvatar('nooks', {
                ...defaults,
                backgroundShape: 'circle',
                dwelling,
                expression,
                windowStyle,
                material,
                accent,
              }));
              if (radius > maximum.radius) {
                maximum = {
                  radius,
                  label: `${dwelling}/${expression}/${windowStyle}/${material}/${accent}`,
                };
              }
            }
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(45.1);
  }, 30_000);

  it('fits every Snacks composition inside the padded avatar circle', () => {
    const defaults = getDefaultParams('snacks');
    const snacksSchema = getTheme('snacks').schema;
    let maximum = { radius: 0, label: '' };

    expect(generateAvatar('snacks', defaults)).not.toContain('clip-path');
    for (const snack of snacksSchema.snack.options) {
      for (const expression of snacksSchema.expression.options) {
        for (const finish of snacksSchema.finish.options) {
          for (const companion of snacksSchema.companion.options) {
            for (const pose of snacksSchema.pose.options) {
              const radius = avatarRadius(generateAvatar('snacks', {
                ...defaults,
                backgroundShape: 'circle',
                snack,
                expression,
                finish,
                companion,
                pose,
              }));
              if (radius > maximum.radius) {
                maximum = {
                  radius,
                  label: `${snack}/${expression}/${finish}/${companion}/${pose}`,
                };
              }
            }
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(46.1);
  }, 30_000);

  it('fits every Folks composition inside the padded avatar circle', () => {
    const defaults = getDefaultParams('folks');
    const folksSchema = getTheme('folks').schema;
    let maximum = { radius: 0, edge: 0, label: '' };

    expect(generateAvatar('folks', defaults)).not.toContain('clip-path');
    for (const topStyle of folksSchema.topStyle.options) {
      for (const hairStyle of folksSchema.hairStyle.options) {
        for (const faceShape of folksSchema.faceShape.options) {
          for (const accessory of folksSchema.accessory.options) {
            const svg = generateAvatar('folks', {
              ...defaults,
              backgroundShape: 'circle',
              topStyle,
              hairStyle,
              faceShape,
              accessory,
            });
            const radius = avatarRadius(svg);
            // The bust is deliberately cropped at the frame, so track the raw
            // geometry edge separately: avatarRadius adds the widest strand
            // stroke pad to every point, while the drawn outline itself must
            // stay inside the circle.
            const { points } = collectPoints(avatarContent(svg));
            const edge = Math.max(
              ...points.map((point) => Math.hypot(point.x - 50, point.y - 50)),
            );
            if (radius > maximum.radius) {
              maximum = {
                radius,
                edge,
                label: `${topStyle}/${hairStyle}/${faceShape}/${accessory}`,
              };
            }
          }
        }
      }
    }

    expect(maximum.edge, maximum.label).toBeLessThanOrEqual(49.7);
    expect(maximum.radius, maximum.label).toBeLessThanOrEqual(53.1);
  }, 30_000);
});

describe('Avatarka recipe v1 golden protocol', () => {
  it.each(themeNames)('keeps %s params and SVG stable', (theme) => {
    const recipe = createRecipe(theme, 'golden-identity', { namespace: 'recipe-v1-test' });
    expect(withVisibleSvgWhitespace(createAvatar(recipe))).toMatchSnapshot();
  });

  it('keeps a mixed gallery stable', () => {
    const gallery = generateGallery(4, 'golden-gallery', {
      themes: ['folks', 'orbs', 'snacks'],
      palette: 'clay',
      backgroundShape: 'circle',
      namespace: 'recipe-v1-test',
    });
    expect(gallery.map(withVisibleSvgWhitespace)).toMatchSnapshot();
  });

  it('keeps one identity from every avatar family stable', () => {
    const gallery = generateGallery(8, 'golden-full-catalog', {
      themes: themeNames,
      backgroundShape: 'circle',
      namespace: 'recipe-v1-test',
    });
    expect(gallery.map(withVisibleSvgWhitespace)).toMatchSnapshot();
  });
});
