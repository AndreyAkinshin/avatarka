import { describe, expect, it } from 'vitest';
import {
  createAvatar,
  generateAvatar,
  generateGallery,
  generateParams,
  getDefaultParams,
  getTheme,
  type SnacksParams,
} from '../core';
import { __test as fitTest } from '../fit';
import { paletteNames } from '../palettes';
import { __test as snacksTest } from '../themes/snacks';

const snacksSchema = getTheme('snacks').schema;

const canonicalSnacks = [
  'toast', 'banana', 'coffee', 'pizza', 'berry', 'pretzel', 'avocado', 'fries', 'cupcake', 'sushi',
  'dumpling', 'pineapple', 'boba', 'croissant', 'apple', 'noodles', 'taco', 'donut', 'corn', 'cake',
  'citrus', 'burger', 'carrot', 'waffle', 'mushroom', 'watermelon', 'soda-can', 'popcorn', 'egg', 'ice-cream',
  'pea-pod', 'sandwich', 'onion', 'pancakes', 'lollipop', 'cheese', 'celery', 'candy', 'hot-dog', 'jelly',
  'milk-carton', 'bell-pepper', 'baguette', 'teapot', 'tofu', 'chocolate', 'artichoke', 'ice-pop', 'honey-jar', 'cookie',
] as const;

function withoutColors(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

function artworkGeometry(svg: string): string {
  const start = svg.indexOf('<circle cx="50" cy="50" r="49" fill="none" stroke="transparent"');
  expect(start).toBeGreaterThan(0);
  return withoutColors(svg.slice(start));
}

function fitTransform(svg: string): string {
  const match = svg.match(/<g transform="(translate\(50 50\) scale\([^\"]+\) translate\([^\"]+\))">/);
  expect(match).not.toBeNull();
  return match![1]!;
}

function avatarContent(svg: string): string {
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  return inner.replace(/<(?:circle|rect)\b[^>]*\/>/, '');
}

function avatarRadius(svg: string): number {
  const { points, pad } = fitTest.collectPoints(avatarContent(svg));
  return Math.max(
    ...points.map((point) => Math.hypot(point.x - 50, point.y - 50)),
  ) + pad;
}

function primitiveCount(svg: string): number {
  return svg.match(/<(?:path|rect|circle|ellipse|polygon|line|polyline)\b/g)?.length ?? 0;
}

function taggedElements(svg: string, attribute: string): readonly string[] {
  return svg.match(new RegExp(
    `<(?:path|circle|ellipse)\\b[^>]*\\b${attribute}="[^"]+"[^>]*\\/?>`,
    'g',
  )) ?? [];
}

function geometryBounds(svg: string): {
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
  readonly width: number;
  readonly height: number;
  readonly centerX: number;
} {
  const { points, pad } = fitTest.collectPoints(svg);
  expect(points.length, svg).toBeGreaterThan(0);
  const minX = Math.min(...points.map(({ x }) => x)) - pad;
  const maxX = Math.max(...points.map(({ x }) => x)) + pad;
  const minY = Math.min(...points.map(({ y }) => y)) - pad;
  const maxY = Math.max(...points.map(({ y }) => y)) + pad;
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
  };
}

describe('Snacks 50 catalog', () => {
  it('keeps the exact canonical order, fifty unique foods, and one mushroom', () => {
    const snacks = snacksSchema.snack.options;

    expect(snacks).toEqual(canonicalSnacks);
    expect(snacks).toHaveLength(50);
    expect(new Set(snacks).size).toBe(50);
    expect(snacks.filter((snack) => snack === 'mushroom')).toEqual(['mushroom']);
  });

  it('uses a dedicated authored base silhouette for every food or vessel', () => {
    const defaults = getDefaultParams('snacks');
    const silhouettes = snacksSchema.snack.options.map((snack) => ({
      snack,
      artwork: withoutColors(snacksTest.renderParts({
        ...defaults,
        snack,
        expression: 'soft-smile',
        finish: 'plain',
        companion: 'none',
        pose: 'centered',
      }).body),
    }));

    for (const silhouette of silhouettes) {
      expect(silhouette.artwork, silhouette.snack).not.toBe('');
    }
    expect(new Set(silhouettes.map(({ artwork }) => artwork)).size).toBe(50);

    const dangerousPairs = [
      ['toast', 'waffle'], ['coffee', 'boba'], ['coffee', 'teapot'],
      ['boba', 'soda-can'], ['milk-carton', 'honey-jar'],
      ['cupcake', 'cake'], ['cake', 'pancakes'], ['croissant', 'baguette'],
      ['berry', 'apple'], ['apple', 'bell-pepper'], ['carrot', 'celery'],
      ['pizza', 'sandwich'], ['burger', 'hot-dog'], ['candy', 'ice-pop'],
    ] as const;
    const bySnack = new Map(silhouettes.map(({ snack, artwork }) => [snack, artwork]));
    for (const [left, right] of dangerousPairs) {
      expect(bySnack.get(left), `${left}/${right}`).not.toBe(bySnack.get(right));
    }
  });

  it('keeps two eyes and one mouth visible in every palette and frame', () => {
    const defaults = getDefaultParams('snacks');

    for (const snack of snacksSchema.snack.options) {
      for (const palette of paletteNames) {
        for (const backgroundShape of snacksSchema.backgroundShape.options) {
          const face = snacksTest.renderParts({
            ...defaults,
            snack,
            palette,
            backgroundShape,
            expression: 'soft-smile',
            finish: 'plain',
            companion: 'none',
          }).face;
          const label = `${snack}/${palette}/${backgroundShape}`;

          if (snack === 'pretzel') {
            const body = snacksTest.renderParts({
              ...defaults,
              snack,
              palette,
              backgroundShape,
              expression: 'soft-smile',
              finish: 'plain',
              companion: 'none',
            }).body;
            expect(
              body.match(/data-snack-negative-space="pretzel-(?:left|right)"/g),
              `${label}: knot holes`,
            ).toHaveLength(2);
            expect(
              face.match(/data-snack-eye="pretzel"/g),
              `${label}: authored eyes`,
            ).toHaveLength(2);
          } else {
            expect(face.match(/<ellipse\b/g), `${label}: eye whites`).toHaveLength(2);
            expect(face.match(/<circle\b/g), `${label}: pupils`).toHaveLength(2);
          }
          expect(face.match(/<path\b/g)?.length, `${label}: mouth`).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('keeps every artwork geometrically stable across palettes and frames', () => {
    const defaults = getDefaultParams('snacks');

    for (const snack of snacksSchema.snack.options) {
      const reference = artworkGeometry(generateAvatar('snacks', {
        ...defaults,
        snack,
        palette: 'coast',
        backgroundShape: 'circle',
      }));

      for (const palette of paletteNames) {
        for (const backgroundShape of snacksSchema.backgroundShape.options) {
          expect(
            artworkGeometry(generateAvatar('snacks', {
              ...defaults,
              snack,
              palette,
              backgroundShape,
            })),
            `${snack}/${palette}/${backgroundShape}`,
          ).toBe(reference);
        }
      }
    }
  });

  it('does not let finish or companion choices re-roll base or face geometry', () => {
    const defaults = getDefaultParams('snacks');

    for (const snack of snacksSchema.snack.options) {
      const referenceParts = snacksTest.renderParts({
        ...defaults,
        snack,
        expression: 'soft-smile',
        finish: 'plain',
        companion: 'none',
        pose: 'centered',
      });
      const referenceBase = withoutColors(referenceParts.body);
      const referenceFace = withoutColors(referenceParts.face);
      const referenceFits = new Map(snacksSchema.pose.options.map((pose) => [
        pose,
        fitTransform(generateAvatar('snacks', {
          ...defaults,
          snack,
          expression: 'soft-smile',
          finish: 'plain',
          companion: 'none',
          pose,
        })),
      ] as const));

      for (const finish of snacksSchema.finish.options) {
        for (const companion of snacksSchema.companion.options) {
          for (const pose of snacksSchema.pose.options) {
            const svg = generateAvatar('snacks', {
              ...defaults,
              snack,
              expression: 'soft-smile',
              finish,
              companion,
              pose,
            });
            const label = `${snack}/${finish}/${companion}/${pose}`;
            const parts = snacksTest.renderParts({
              ...defaults,
              snack,
              expression: 'soft-smile',
              finish,
              companion,
              pose,
            });
            expect(withoutColors(parts.body), `${label}: base`).toBe(referenceBase);
            expect(withoutColors(parts.face), `${label}: face`).toBe(referenceFace);
            expect(fitTransform(svg), `${label}: fit`).toBe(referenceFits.get(pose));
          }
        }
      }
    }
  });

  it('keeps the four clarified silhouettes authored, spacious, and distinct at icon scale', () => {
    const defaults = getDefaultParams('snacks');
    const parts = Object.fromEntries(
      (['berry', 'pretzel', 'croissant', 'bell-pepper'] as const).map((snack) => [
        snack,
        snacksTest.renderParts({
          ...defaults,
          snack,
          expression: 'soft-smile',
          finish: 'plain',
          companion: 'none',
          pose: 'centered',
        }),
      ]),
    ) as Record<
      'berry' | 'pretzel' | 'croissant' | 'bell-pepper',
      ReturnType<typeof snacksTest.renderParts>
    >;

    const berryLobes = taggedElements(parts.berry.body, 'data-snack-lobe');
    expect(berryLobes).toHaveLength(5);
    const berryBounds = geometryBounds(berryLobes.join(''));
    expect(berryBounds.width).toBeGreaterThanOrEqual(64);
    expect(berryBounds.height).toBeGreaterThanOrEqual(55);
    expect(parts.berry.body).toContain('data-snack-calyx="berry"');
    expect(parts.berry.body).toContain('data-snack-leaf="berry"');
    expect(parts.berry.body).toContain('data-snack-stem="berry"');

    const pretzelSpaces = taggedElements(parts.pretzel.body, 'data-snack-negative-space');
    expect(pretzelSpaces).toHaveLength(2);
    const [leftSpace, rightSpace] = pretzelSpaces.map(geometryBounds);
    expect(leftSpace!.width).toBeGreaterThanOrEqual(15);
    expect(leftSpace!.height).toBeGreaterThanOrEqual(15);
    expect(rightSpace!.width).toBeGreaterThanOrEqual(15);
    expect(rightSpace!.height).toBeGreaterThanOrEqual(15);
    expect(rightSpace!.centerX - leftSpace!.centerX).toBeGreaterThanOrEqual(30);
    expect(parts.pretzel.body).toContain('data-snack-bottom-band="pretzel"');
    expect(parts.pretzel.body).toContain('data-snack-knot-crossing="pretzel"');
    expect(parts.pretzel.body).toContain('data-snack-salt="pretzel"');
    expect(parts.pretzel.face.match(/data-snack-eye="pretzel"/g)).toHaveLength(2);

    const croissantSilhouette = taggedElements(
      parts.croissant.body,
      'data-snack-silhouette',
    );
    expect(croissantSilhouette).toHaveLength(1);
    const croissantBounds = geometryBounds(croissantSilhouette[0]!);
    expect(croissantBounds.width).toBeGreaterThanOrEqual(88);
    expect(croissantBounds.height).toBeGreaterThanOrEqual(42);
    const laminations = taggedElements(parts.croissant.body, 'data-snack-lamination');
    expect(laminations).toHaveLength(3);
    expect(laminations.every((layer) => /\bfill="(?!none)[^"]+"/.test(layer))).toBe(true);
    expect(taggedElements(parts.croissant.body, 'data-snack-horn')).toHaveLength(2);
    expect(parts.croissant.body).toContain('data-snack-inner-curve="croissant"');

    const pepperSilhouette = taggedElements(
      parts['bell-pepper'].body,
      'data-snack-silhouette',
    );
    expect(pepperSilhouette).toHaveLength(1);
    const pepperBounds = geometryBounds(pepperSilhouette[0]!);
    expect(pepperBounds.width).toBeGreaterThanOrEqual(68);
    expect(pepperBounds.height).toBeGreaterThanOrEqual(55);
    expect(taggedElements(parts['bell-pepper'].body, 'data-snack-lobe')).toHaveLength(3);
    expect(parts['bell-pepper'].body).toContain('data-snack-stem="bell-pepper"');
    expect(parts['bell-pepper'].body).toContain('data-snack-calyx="bell-pepper"');

    expect(parts.berry.limbs).toBe('');
    expect(parts.pretzel.limbs).toBe('');
    for (const snack of ['croissant', 'bell-pepper'] as const) {
      expect(parts[snack].limbs.match(/<path\b/g)).toHaveLength(1);
      expect(parts[snack].limbs).not.toContain('<circle');
      expect(parts[snack].limbs).toContain(`data-snack-limbs="${snack}"`);
    }
  });

  it('keeps every finish, companion, and authored pose safely fitted', () => {
    const defaults = getDefaultParams('snacks');
    let maximum = { radius: 0, label: '' };

    for (const snack of snacksSchema.snack.options) {
      for (const finish of snacksSchema.finish.options) {
        for (const companion of snacksSchema.companion.options) {
          for (const pose of snacksSchema.pose.options) {
            const label = `${snack}/${finish}/${companion}/${pose}`;
            const svg = generateAvatar('snacks', {
              ...defaults,
              snack,
              expression: 'soft-smile',
              finish,
              companion,
              pose,
            });
            const radius = avatarRadius(svg);
            if (radius > maximum.radius) maximum = { radius, label };

            expect(svg, label).not.toContain('clip-path');
            const face = snacksTest.renderParts({
              ...defaults,
              snack,
              expression: 'soft-smile',
              finish,
              companion,
              pose,
            }).face;
            if (snack === 'pretzel') {
              expect(face, `${label}: face`).toContain('data-snack-eye="pretzel"');
            } else {
              expect(face, `${label}: face`).toContain('<ellipse');
            }
            expect(radius, `${label}: overflow`).toBeLessThanOrEqual(46.1);
          }
        }
      }
    }

    expect(maximum.radius, maximum.label).toBeGreaterThan(42);
  }, 30_000);

  it('honors every primary, secondary, and presentation override', () => {
    const expectedTraits = {
      expression: 'sleepy',
      finish: 'spots',
      companion: 'steam',
      pose: 'lean-right',
    } as const;

    for (const snack of snacksSchema.snack.options) {
      const params = generateParams('snacks', `snacks-overrides:${snack}`, {
        palette: 'mono',
        backgroundShape: 'square',
        traits: { snack, ...expectedTraits },
      });
      expect(params).toMatchObject({
        snack,
        ...expectedTraits,
        palette: 'mono',
        backgroundShape: 'square',
      });
    }
  });

  it('derives only curated finish and companion profiles for each snack', () => {
    const finishGroups = [
      { snacks: ['banana', 'berry', 'avocado', 'pineapple', 'apple', 'citrus', 'watermelon'], allowed: ['plain', 'seeds', 'spots', 'stripes'] },
      { snacks: ['toast', 'pretzel', 'croissant', 'waffle', 'pancakes', 'baguette', 'cookie'], allowed: ['plain', 'drizzle', 'stripes', 'spots'] },
      { snacks: ['cupcake', 'donut', 'cake', 'ice-cream', 'lollipop', 'candy', 'jelly', 'chocolate', 'ice-pop'], allowed: ['plain', 'drizzle', 'spots', 'stripes'] },
      { snacks: ['pizza', 'fries', 'sushi', 'dumpling', 'noodles', 'taco', 'burger', 'popcorn', 'sandwich', 'cheese', 'hot-dog'], allowed: ['plain', 'seeds', 'stripes', 'spots'] },
      { snacks: ['coffee', 'boba', 'soda-can', 'milk-carton', 'teapot', 'honey-jar'], allowed: ['plain', 'drizzle', 'stripes'] },
      { snacks: ['corn', 'carrot', 'mushroom', 'egg', 'pea-pod', 'onion', 'celery', 'bell-pepper', 'tofu', 'artichoke'], allowed: ['plain', 'seeds', 'stripes', 'spots'] },
    ] as const;
    const companionGroups = [
      { snacks: ['banana', 'berry', 'avocado', 'pineapple', 'apple', 'citrus', 'watermelon'], allowed: ['none', 'leaf', 'pick'] },
      { snacks: ['egg', 'milk-carton', 'honey-jar'], allowed: ['none', 'butter', 'berry'] },
      { snacks: ['toast', 'pretzel', 'croissant', 'waffle', 'pancakes', 'baguette'], allowed: ['none', 'butter', 'berry', 'steam'] },
      { snacks: ['coffee', 'dumpling', 'noodles', 'teapot'], allowed: ['none', 'steam', 'pick'] },
      { snacks: ['sushi', 'soda-can', 'sandwich', 'cheese'], allowed: ['none', 'pick', 'leaf'] },
      { snacks: ['pizza', 'fries', 'taco', 'burger', 'popcorn', 'hot-dog', 'tofu'], allowed: ['none', 'steam', 'pick', 'leaf'] },
      { snacks: ['cupcake', 'boba', 'donut', 'cake', 'ice-cream', 'lollipop', 'candy', 'jelly', 'chocolate', 'ice-pop', 'cookie'], allowed: ['none', 'berry', 'butter', 'pick'] },
      { snacks: ['corn', 'carrot', 'mushroom', 'pea-pod', 'onion', 'celery', 'bell-pepper', 'artichoke'], allowed: ['none', 'leaf', 'pick'] },
    ] as const;
    const finishBySnack = new Map(finishGroups.flatMap(({ snacks, allowed }) => (
      snacks.map((snack) => [snack, allowed] as const)
    )));
    const companionBySnack = new Map(companionGroups.flatMap(({ snacks, allowed }) => (
      snacks.map((snack) => [snack, allowed] as const)
    )));

    expect([...finishBySnack.keys()]).toHaveLength(50);
    expect([...companionBySnack.keys()]).toHaveLength(50);
    for (const snack of snacksSchema.snack.options) {
      for (let sample = 0; sample < 24; sample++) {
        const params = generateParams('snacks', `snacks-profile:${snack}:${sample}`, {
          traits: { snack },
        });
        expect(finishBySnack.get(snack), `${snack}/${params.finish}`).toContain(params.finish);
        expect(companionBySnack.get(snack), `${snack}/${params.companion}`)
          .toContain(params.companion);
      }
    }
  });

  it('honors all primary overrides and balances two complete catalogs', () => {
    for (const snack of snacksSchema.snack.options) {
      expect(createAvatar('snacks', `snacks-primary:${snack}`, {
        traits: { snack },
      }).params.snack).toBe(snack);
    }

    const gallery = generateGallery(100, 'snacks-full-catalog', {
      themes: ['snacks'],
      palette: 'coast',
      backgroundShape: 'circle',
    });
    const counts = new Map(snacksSchema.snack.options.map((snack) => [snack, 0]));
    for (const avatar of gallery) {
      const params = avatar.params as SnacksParams;
      counts.set(params.snack, counts.get(params.snack)! + 1);
    }

    expect([...counts.keys()]).toEqual(canonicalSnacks);
    expect([...counts.values()]).toEqual(canonicalSnacks.map(() => 2));
  });

  it('keeps detail density restrained across all secondary combinations', () => {
    const defaults = getDefaultParams('snacks');
    let maximum = { count: 0, label: '' };

    for (const snack of snacksSchema.snack.options) {
      for (const finish of snacksSchema.finish.options) {
        for (const companion of snacksSchema.companion.options) {
          const count = primitiveCount(generateAvatar('snacks', {
            ...defaults,
            snack,
            finish,
            companion,
          }));
          if (count > maximum.count) {
            maximum = { count, label: `${snack}/${finish}/${companion}` };
          }
        }
      }
    }

    expect(maximum.count, maximum.label).toBeLessThanOrEqual(34);
  });
});
