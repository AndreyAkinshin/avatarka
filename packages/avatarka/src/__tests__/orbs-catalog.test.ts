import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  generateGallery,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  getTheme,
} from '../core';
import { __test as fitTest } from '../fit';
import { paletteNames, palettes } from '../palettes';
import { __test, orbShapeNames } from '../themes/orbs';

const canonicalShapes = [
  'round', 'pebble', 'arch', 'drop', 'bean', 'crescent', 'lens', 'orbit', 'spiral', 'portal',
  'wave', 'flame', 'comet', 'ribbon', 'infinity', 'knot', 'bolt', 'fan', 'fold', 'sail',
  'heart', 'star', 'clover', 'rainbow', 'crown', 'quote', 'speech-bubble', 'keyhole', 'tag', 'bookmark',
  'puzzle', 'medal', 'ticket', 'anchor', 'flag', 'crystal', 'scroll', 'leaf', 'sunrise', 'mountain',
  'arrow', 'paper-plane', 'kite', 'umbrella', 'music-note', 'pawn', 'trophy', 'bowtie', 'ampersand', 'at-sign',
] as const;

function parseSvg(svg: string): Document {
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

function fitTransform(svg: string): string {
  const match = svg.match(/data-part="artwork" transform="([^"]+)"/);
  expect(match).toBeDefined();
  return match![1]!;
}

function partMarkup(svg: string, selector: string): string {
  const part = parseSvg(svg).querySelector(selector);
  expect(part).not.toBeNull();
  return part!.outerHTML
    .replace(/ data-(?:orb-shape|topology|negative-spaces|accent-position|face-style)="[^"]+"/g, '')
    .replace(/#[\da-f]{6}/gi, '#color');
}

function avatarContent(svg: string): string {
  const inner = svg
    .replace(/^[\s\S]*?<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  return inner.replace(/<(?:circle|rect)\b[^>]*\/>/, '');
}

function avatarRadius(svg: string): number {
  const { points, pad } = fitTest.collectPoints(avatarContent(svg));
  return Math.max(...points.map((point) => Math.hypot(point.x - 50, point.y - 50))) + pad;
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

function definitionFor(id: (typeof canonicalShapes)[number]) {
  const definition = __test.orbShapeDefinitions.find((candidate) => candidate.id === id);
  expect(definition, id).toBeDefined();
  return definition!;
}

function rawBodyDocument(id: (typeof canonicalShapes)[number]): Document {
  return parseSvg(
    `<svg xmlns="http://www.w3.org/2000/svg"><g>${__test.renderBody(id, '#123456', '#654321')}</g></svg>`,
  );
}

function fieldCovers(
  field: { x: number; y: number; width: number; height: number },
  x: number,
  y: number,
): boolean {
  return Math.abs(x - field.x) <= field.width / 2
    && Math.abs(y - field.y) <= field.height / 2;
}

describe('Orbs canonical 50 catalog', () => {
  it('derives the exact public schema order from one exhaustive definition catalog', () => {
    const catalog = getBaseTypeCatalog('orbs');

    expect(orbShapeNames).toEqual(canonicalShapes);
    expect(getTheme('orbs').schema.orbShape.options).toEqual(orbShapeNames);
    expect(catalog.values).toEqual(orbShapeNames);
    expect(__test.orbShapeDefinitions.map(({ id }) => id)).toEqual(canonicalShapes);
    expect(new Set(orbShapeNames).size).toBe(50);
    expect(new Set(__test.orbShapeDefinitions.map(({ label }) => label)).size).toBe(50);
    expect(new Set(__test.orbShapeDefinitions.map(({ topology }) => topology)).size).toBe(50);
  });

  it('stores finite local face fields, bounds, negative-space data, and natural accent profiles', () => {
    const theme = getTheme('orbs');

    for (const definition of __test.orbShapeDefinitions) {
      const values = [
        ...Object.values(definition.faceField).filter((value): value is number => typeof value === 'number'),
        ...Object.values(definition.bounds),
      ];
      expect(values.every(Number.isFinite), definition.id).toBe(true);
      expect(definition.faceField.width, definition.id).toBeGreaterThanOrEqual(24);
      expect(definition.faceField.height, definition.id).toBeGreaterThanOrEqual(21);
      expect(definition.faceField.x - definition.faceField.width / 2, definition.id)
        .toBeGreaterThanOrEqual(definition.bounds.left - 1);
      expect(definition.faceField.x + definition.faceField.width / 2, definition.id)
        .toBeLessThanOrEqual(definition.bounds.right + 1);
      expect(definition.faceField.y - definition.faceField.height / 2, definition.id)
        .toBeGreaterThanOrEqual(definition.bounds.top - 1);
      expect(definition.faceField.y + definition.faceField.height / 2, definition.id)
        .toBeLessThanOrEqual(definition.bounds.bottom + 1);
      expect([0, 1, 2]).toContain(definition.negativeSpaces);
      expect(definition.naturalAccents.length, definition.id).toBe(5);
      expect(new Set(definition.naturalAccents.map(([value]) => value)).size, definition.id)
        .toBe(definition.naturalAccents.length);
      expect(definition.naturalAccents.every(([value, weight]) => (
        theme.schema.accentPosition.options.includes(value)
        && Number.isFinite(weight)
        && weight > 0
      )), definition.id).toBe(true);
    }
  });

  it('keeps all 50 raw symbol topologies independently authored and bounds-safe', () => {
    const geometries = new Map<string, string>();

    for (const definition of __test.orbShapeDefinitions) {
      const raw = __test.renderBody(definition.id, '#123456', '#654321');
      const { points, pad } = fitTest.collectPoints(raw);
      const xs = points.map(({ x }) => x);
      const ys = points.map(({ y }) => y);
      const actual = {
        left: Math.min(...xs) - pad,
        right: Math.max(...xs) + pad,
        top: Math.min(...ys) - pad,
        bottom: Math.max(...ys) + pad,
      };
      expect(actual.left, definition.id).toBeGreaterThanOrEqual(definition.bounds.left - 8);
      expect(actual.right, definition.id).toBeLessThanOrEqual(definition.bounds.right + 8);
      expect(actual.top, definition.id).toBeGreaterThanOrEqual(definition.bounds.top - 8);
      expect(actual.bottom, definition.id).toBeLessThanOrEqual(definition.bounds.bottom + 8);

      const geometry = raw.replace(/#[\da-f]{6}/gi, '#color');
      expect([...geometries.values()], definition.id).not.toContain(geometry);
      geometries.set(definition.id, geometry);
      expect(raw, definition.id).not.toMatch(/<(?:text|image|use|pattern|mask|filter)\b/i);
      expect(parseSvg(`<svg xmlns="http://www.w3.org/2000/svg">${raw}</svg>`)
        .querySelectorAll('circle').length, definition.id).toBeLessThanOrEqual(1);
      if (definition.negativeSpaces > 0) {
        expect(raw, definition.id).toMatch(/fill-rule="evenodd"|stroke-width="(?:1[2-9]|[2-9]\d)/);
      }
      if (definition.bandTopology) {
        expect(raw, definition.id).toMatch(/stroke-width=|fill-rule="evenodd"/);
      }
    }
    expect(geometries.size).toBe(50);
  });

  it('renders every base and face style as valid SVG with two eyes and a mouth', () => {
    const defaults = getDefaultParams('orbs');
    const bodies = new Map<string, string>();

    for (const orbShape of orbShapeNames) {
      for (const faceStyle of getTheme('orbs').schema.faceStyle.options) {
        const svg = generateAvatar('orbs', { ...defaults, orbShape, faceStyle });
        const document = parseSvg(svg);
        const eyes = document.querySelector('[data-part="eyes"]');
        const mouth = document.querySelector('[data-part="mouth"]');

        expect(document.querySelector('parsererror'), `${orbShape}/${faceStyle}`).toBeNull();
        expect(document.querySelector(`[data-orb-shape="${orbShape}"]`), orbShape).not.toBeNull();
        expect(eyes?.children.length, `${orbShape}/${faceStyle}`).toBe(2);
        expect(mouth?.children.length, `${orbShape}/${faceStyle}`).toBeGreaterThanOrEqual(1);
        expect(svg, `${orbShape}/${faceStyle}`).not.toMatch(/NaN|undefined|Infinity/);
        expect(svg, `${orbShape}/${faceStyle}`).not.toMatch(/stroke="(?:#fff(?:fff)?|white|currentColor)"/i);
        expect(svg, `${orbShape}/${faceStyle}`).not.toMatch(/\sstyle="/);
      }
      const body = partMarkup(generateAvatar('orbs', { ...defaults, orbShape }), '[data-part="body"]');
      expect([...bodies.values()], orbShape).not.toContain(body);
      bodies.set(orbShape, body);
    }
  });

  it('renders every accent as exactly one backing mass', () => {
    const defaults = getDefaultParams('orbs');

    for (const orbShape of orbShapeNames) {
      for (const accentPosition of getTheme('orbs').schema.accentPosition.options) {
        const svg = generateAvatar('orbs', { ...defaults, orbShape, accentPosition });
        const document = parseSvg(svg);
        const accent = document.querySelector('[data-part="accent"]');
        const body = document.querySelector('[data-part="body"]');
        expect(accent?.children.length, `${orbShape}/${accentPosition}`).toBe(1);
        expect(accent?.nextElementSibling, `${orbShape}/${accentPosition}`).toBe(body);
      }
    }
  });

  it('keeps accent, face, palette, and frame controls geometrically independent', () => {
    const defaults = getDefaultParams('orbs');
    const theme = getTheme('orbs');

    for (const orbShape of orbShapeNames) {
      const baseline = generateAvatar('orbs', {
        ...defaults,
        orbShape,
        faceStyle: 'soft-smile',
        accentPosition: 'upper-left',
      });
      const expectedTransform = fitTransform(baseline);
      const expectedBody = partMarkup(baseline, '[data-part="body"]');
      const expectedField = partMarkup(baseline, '[data-part="face-field"]');
      const expectedFace = partMarkup(baseline, '[data-part="face"]');
      const expectedAccent = partMarkup(baseline, '[data-part="accent"]');

      for (const accentPosition of theme.schema.accentPosition.options) {
        const svg = generateAvatar('orbs', { ...defaults, orbShape, accentPosition });
        expect(fitTransform(svg), `${orbShape}/${accentPosition}`).toBe(expectedTransform);
        expect(partMarkup(svg, '[data-part="body"]'), `${orbShape}/${accentPosition}`)
          .toBe(expectedBody);
        expect(partMarkup(svg, '[data-part="face-field"]'), `${orbShape}/${accentPosition}`)
          .toBe(expectedField);
        expect(partMarkup(svg, '[data-part="face"]'), `${orbShape}/${accentPosition}`)
          .toBe(expectedFace);
      }
      for (const faceStyle of theme.schema.faceStyle.options) {
        const svg = generateAvatar('orbs', { ...defaults, orbShape, faceStyle });
        expect(fitTransform(svg), `${orbShape}/${faceStyle}`).toBe(expectedTransform);
        expect(partMarkup(svg, '[data-part="body"]'), `${orbShape}/${faceStyle}`)
          .toBe(expectedBody);
        expect(partMarkup(svg, '[data-part="face-field"]'), `${orbShape}/${faceStyle}`)
          .toBe(expectedField);
        expect(partMarkup(svg, '[data-part="accent"]'), `${orbShape}/${faceStyle}`)
          .toBe(expectedAccent);
      }
      for (const palette of theme.schema.palette.options) {
        for (const backgroundShape of theme.schema.backgroundShape.options) {
          const svg = generateAvatar('orbs', {
            ...defaults,
            orbShape,
            palette,
            backgroundShape,
          });
          expect(fitTransform(svg), `${orbShape}/${palette}/${backgroundShape}`)
            .toBe(expectedTransform);
          expect(partMarkup(svg, '[data-part="body"]'), `${orbShape}/${palette}`)
            .toBe(expectedBody);
          expect(partMarkup(svg, '[data-part="face-field"]'), `${orbShape}/${palette}`)
            .toBe(expectedField);
          expect(partMarkup(svg, '[data-part="accent"]'), `${orbShape}/${palette}`)
            .toBe(expectedAccent);
        }
      }
    }
  });

  it('keeps every authored combination inside the fixed padded fit envelope', () => {
    const defaults = getDefaultParams('orbs');
    const theme = getTheme('orbs');

    for (const orbShape of orbShapeNames) {
      for (const faceStyle of theme.schema.faceStyle.options) {
        for (const accentPosition of theme.schema.accentPosition.options) {
          for (const palette of theme.schema.palette.options) {
            for (const backgroundShape of theme.schema.backgroundShape.options) {
              const label = `${orbShape}/${faceStyle}/${accentPosition}/${palette}/${backgroundShape}`;
              const svg = generateAvatar('orbs', {
                ...defaults,
                orbShape,
                faceStyle,
                accentPosition,
                palette,
                backgroundShape,
              });
              expect(avatarRadius(svg), label).toBeLessThanOrEqual(43.1);
            }
          }
        }
      }
    }
  }, 30_000);

  it('keeps all palette surfaces readable without host-theme outlines', () => {
    const defaults = getDefaultParams('orbs');

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      for (const surface of [palette.canvas, palette.primary, palette.secondary, palette.accent]) {
        expect(contrastRatio(palette.ink, surface), `${paletteName}/${surface}`)
          .toBeGreaterThanOrEqual(4.5);
      }
      for (const orbShape of orbShapeNames) {
        const svg = generateAvatar('orbs', { ...defaults, orbShape, palette: paletteName });
        expect(svg, `${paletteName}/${orbShape}`).toContain(`fill="${palette.ink}"`);
        expect(svg, `${paletteName}/${orbShape}`)
          .not.toMatch(/stroke="(?:#fff(?:fff)?|white|currentColor)"/i);
      }
    }
  });

  it('keeps dangerous neighboring logo topologies visually distinct', () => {
    const defaults = getDefaultParams('orbs');
    const pairs = [
      ['round', 'pebble'], ['arch', 'portal'], ['arch', 'rainbow'],
      ['orbit', 'spiral'], ['orbit', 'at-sign'], ['spiral', 'at-sign'],
      ['ribbon', 'infinity'], ['ribbon', 'ampersand'], ['knot', 'clover'],
      ['fold', 'crystal'], ['drop', 'flame'], ['arrow', 'paper-plane'],
      ['kite', 'crystal'], ['medal', 'trophy'], ['bowtie', 'infinity'],
      ['keyhole', 'pawn'], ['speech-bubble', 'quote'], ['fan', 'sunrise'],
    ] as const;

    for (const [first, second] of pairs) {
      const firstBody = partMarkup(
        generateAvatar('orbs', { ...defaults, orbShape: first }),
        '[data-part="body"]',
      );
      const secondBody = partMarkup(
        generateAvatar('orbs', { ...defaults, orbShape: second }),
        '[data-part="body"]',
      );
      expect(firstBody, `${first}/${second}`).not.toBe(secondBody);
    }
  });

  it('protects the audited silhouette cues and signature negative spaces', () => {
    const round = definitionFor('round');
    const pebble = definitionFor('pebble');
    const bean = definitionFor('bean');
    expect(pebble.faceField.width / pebble.faceField.height)
      .toBeGreaterThan(round.faceField.width / round.faceField.height + 0.1);
    expect(Math.abs(pebble.faceField.x - bean.faceField.x)).toBeGreaterThanOrEqual(8);
    expect(bean.faceField.tilt).toBeLessThanOrEqual(-8);

    const protectedVoids = [
      ['rainbow', [[50, 58]]],
      ['ribbon', [[50, 35]]],
      ['infinity', [[27, 50], [73, 50]]],
      ['ampersand', [[47, 28]]],
    ] as const;
    for (const [id, points] of protectedVoids) {
      const field = definitionFor(id).faceField;
      for (const [x, y] of points) {
        expect(fieldCovers(field, x, y), `${id}/${x},${y}`).toBe(false);
      }
    }

    const rainbowBody = rawBodyDocument('rainbow').documentElement.querySelector('g')!;
    expect(rainbowBody.children.length).toBe(2);
    expect(rainbowBody.children[0]?.getAttribute('fill-rule')).toBe('evenodd');
    expect(rainbowBody.children[1]?.getAttribute('fill')).toBe('none');
    expect(rainbowBody.children[1]?.getAttribute('stroke-width')).toBe('7');

    const quotePaths = [...rawBodyDocument('quote').querySelectorAll('path')];
    expect(quotePaths.length).toBe(2);
    const quoteExtents = quotePaths.map((path) => {
      const { points } = fitTest.collectPoints(path.outerHTML);
      return {
        left: Math.min(...points.map(({ x }) => x)),
        right: Math.max(...points.map(({ x }) => x)),
      };
    });
    expect(quoteExtents[0]!.right).toBeLessThan(quoteExtents[1]!.left);

    const puzzlePath = rawBodyDocument('puzzle').querySelector('path')!.getAttribute('d')!;
    expect(puzzlePath).toContain('C92 36 97 42 97 50C97 58 92 64 83 62');
    expect(puzzlePath).toContain('C25 65 32 59 32 50C32 41 25 35 15 38');

    const waveBody = rawBodyDocument('wave').documentElement.querySelector('g')!;
    expect(waveBody.children.length).toBe(2);
    expect(definitionFor('wave').faceField.x).toBeGreaterThanOrEqual(44);
    expect(definitionFor('wave').faceField.x).toBeLessThanOrEqual(52);
    expect(definitionFor('wave').faceField.y).toBeGreaterThan(70);

    const scrollBody = rawBodyDocument('scroll').documentElement.querySelector('g')!;
    expect(scrollBody.children.length).toBe(2);
    expect(scrollBody.querySelectorAll('rect')).toHaveLength(0);
    expect(scrollBody.children[1]?.getAttribute('d')?.match(/M/g)).toHaveLength(4);

    expect(definitionFor('fold').faceField.kind).toBe('rounded');
    expect(definitionFor('crystal').faceField.kind).toBe('diamond');
    expect(rawBodyDocument('fold').querySelectorAll('path')).toHaveLength(2);
  });

  it('honors every explicit semantic trait and primary catalog override', () => {
    const explicit = {
      orbShape: 'paper-plane',
      faceStyle: 'curious',
      accentPosition: 'halo',
    } as const;
    expect(generateParams('orbs', 'all-explicit-orbs', { traits: explicit }))
      .toMatchObject(explicit);

    for (const orbShape of orbShapeNames) {
      expect(generateParams('orbs', `catalog-override:${orbShape}`, {
        traits: { orbShape },
      }).orbShape).toBe(orbShape);
    }
  });

  it('gives a 50-item Orbs gallery every primary shape exactly once', () => {
    const gallery = generateGallery(50, 'orbs-canonical-cycle', { themes: ['orbs'] });
    const generatedShapes = gallery.map(({ params }) => params.orbShape);

    expect(new Set(generatedShapes).size).toBe(50);
    expect(new Set(generatedShapes)).toEqual(new Set(orbShapeNames));
  });
});
