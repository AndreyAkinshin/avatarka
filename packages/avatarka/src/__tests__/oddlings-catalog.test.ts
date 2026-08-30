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
import { __test, bodyShapeNames } from '../themes/oddlings';

const canonicalBodies = [
  'pebble', 'crown', 'glider', 'bean', 'loop', 'starlet', 'bell', 'bowtie', 'sprout', 'tripod',
  'puddle', 'flame', 'pillow', 'notch', 'flower', 'monolith', 'caterpillar', 'heart', 'totem', 'bridge',
  'lean', 'clover', 'shield', 'worm', 'lantern', 'mitten', 'hourglass', 'kite', 'cloudlet', 'split-tail',
  'droplet', 'satellite', 'arch', 'prickle', 'vase', 'comma', 'scallop', 'elbow', 'gourd', 'pinwheel',
  'saddle', 'tulip', 'wedge', 'shell', 'fork', 'canopy', 'zigzag', 'fan', 'stack', 'prism',
] as const;

function parseSvg(svg: string): Document {
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

function fitTransform(svg: string): string {
  const match = svg.match(/<g><g transform="([^"]+)">/);
  expect(match).toBeDefined();
  return match![1]!;
}

function partMarkup(svg: string, selector: string): string {
  const part = parseSvg(svg).querySelector(selector);
  expect(part).not.toBeNull();
  return part!.outerHTML
    .replace(/ data-(?:body-shape|topology)="[^"]+"/g, '')
    .replace(/#[\da-f]{6}/gi, '#color');
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

describe('Oddlings canonical 50 catalog', () => {
  it('derives the exact public schema order from one exhaustive definition catalog', () => {
    const catalog = getBaseTypeCatalog('oddlings');

    expect(bodyShapeNames).toEqual(canonicalBodies);
    expect(getTheme('oddlings').schema.bodyShape.options).toEqual(bodyShapeNames);
    expect(catalog.values).toEqual(bodyShapeNames);
    expect(__test.bodyDefinitions.map(({ id }) => id)).toEqual(canonicalBodies);
    expect(new Set(bodyShapeNames).size).toBe(50);
    expect(new Set(__test.bodyDefinitions.map(({ label }) => label)).size).toBe(50);
    expect(new Set(__test.bodyDefinitions.map(({ topology }) => topology)).size).toBe(50);
  });

  it('stores complete finite face, surface, safe-zone, and natural-profile metadata', () => {
    const theme = getTheme('oddlings');

    for (const definition of __test.bodyDefinitions) {
      const { faceBox, bounds, featureAnchors, patternZones } = definition;
      const values = [
        ...Object.values(faceBox),
        ...Object.values(bounds),
        ...Object.values(featureAnchors).flatMap((anchor) => Object.values(anchor)),
        ...Object.values(patternZones).flatMap((value) => Object.values(value)),
      ];
      expect(values.every(Number.isFinite), definition.id).toBe(true);
      expect(faceBox.width, definition.id).toBeGreaterThanOrEqual(24);
      expect(faceBox.height, definition.id).toBeGreaterThanOrEqual(15);
      expect(faceBox.x - faceBox.width / 2, definition.id).toBeGreaterThanOrEqual(bounds.left - 1);
      expect(faceBox.x + faceBox.width / 2, definition.id).toBeLessThanOrEqual(bounds.right + 1);
      expect(faceBox.y - faceBox.height / 2, definition.id).toBeGreaterThanOrEqual(bounds.top - 1);
      expect(faceBox.y + faceBox.height / 2, definition.id).toBeLessThanOrEqual(bounds.bottom + 1);

      for (const [name, anchor] of Object.entries(featureAnchors)) {
        expect(Math.hypot(anchor.nx, anchor.ny), `${definition.id}/${name}`).toBeCloseTo(1, 8);
        expect(anchor.x, `${definition.id}/${name}`).toBeGreaterThanOrEqual(bounds.left - 3);
        expect(anchor.x, `${definition.id}/${name}`).toBeLessThanOrEqual(bounds.right + 3);
        expect(anchor.y, `${definition.id}/${name}`).toBeGreaterThanOrEqual(bounds.top - 3);
        expect(anchor.y, `${definition.id}/${name}`).toBeLessThanOrEqual(bounds.bottom + 3);
      }
      expect(featureAnchors.top.ny, definition.id).toBeLessThan(-0.5);
      expect(featureAnchors.left.nx, definition.id).toBeLessThan(-0.35);
      expect(featureAnchors.right.nx, definition.id).toBeGreaterThan(0.35);
      expect(featureAnchors.baseLeft.ny, definition.id).toBeGreaterThan(0.5);
      expect(featureAnchors.baseRight.ny, definition.id).toBeGreaterThan(0.5);

      for (const zone of [patternZones.left, patternZones.right, patternZones.belly]) {
        expect(zone.width, definition.id).toBeGreaterThan(0);
        expect(zone.height, definition.id).toBeGreaterThan(0);
        expect(zone.x - zone.width / 2, definition.id).toBeGreaterThanOrEqual(bounds.left - 1);
        expect(zone.x + zone.width / 2, definition.id).toBeLessThanOrEqual(bounds.right + 1);
        expect(zone.y - zone.height / 2, definition.id).toBeGreaterThanOrEqual(bounds.top - 1);
        expect(zone.y + zone.height / 2, definition.id).toBeLessThanOrEqual(bounds.bottom + 1);
      }
      expect(patternZones.faceExclusion.width, definition.id).toBeGreaterThan(faceBox.width);
      expect(patternZones.faceExclusion.height, definition.id).toBeGreaterThan(faceBox.height);

      for (const [profile, options, quiet] of [
        [definition.naturalFeatures, theme.schema.feature.options, 'none'],
        [definition.naturalPatterns, theme.schema.pattern.options, 'plain'],
      ] as const) {
        expect(profile.length, definition.id).toBeGreaterThan(0);
        expect(new Set(profile.map(([value]) => value)).size, definition.id).toBe(profile.length);
        expect(profile.every(([value, weight]) => (
          options.includes(value as never) && Number.isFinite(weight) && weight > 0
        )), definition.id).toBe(true);
        expect(profile.some(([value]) => value === quiet), definition.id).toBe(true);
      }
    }
  });

  it('keeps authored body bounds honest and every raw body independently drawn', () => {
    const geometries = new Map<string, string>();

    for (const definition of __test.bodyDefinitions) {
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
      expect(actual.left, definition.id).toBeGreaterThanOrEqual(definition.bounds.left - 4);
      expect(actual.right, definition.id).toBeLessThanOrEqual(definition.bounds.right + 4);
      expect(actual.top, definition.id).toBeGreaterThanOrEqual(definition.bounds.top - 4);
      expect(actual.bottom, definition.id).toBeLessThanOrEqual(definition.bounds.bottom + 4);

      const geometry = raw.replace(/#[\da-f]{6}/gi, '#color');
      expect([...geometries.values()], definition.id).not.toContain(geometry);
      geometries.set(definition.id, geometry);
    }
    expect(geometries.size).toBe(50);
  });

  it('renders every authored base as valid SVG with a visible eye arrangement and mouth', () => {
    const defaults = getDefaultParams('oddlings');
    const bodies = new Map<string, string>();

    for (const bodyShape of bodyShapeNames) {
      const svg = generateAvatar('oddlings', {
        ...defaults,
        bodyShape,
        eyeArrangement: 'pair',
        mouthStyle: 'smile',
        feature: 'none',
        pattern: 'plain',
      });
      const document = parseSvg(svg);
      const eyes = document.querySelector('[data-part="eyes"]');
      const mouth = document.querySelector('[data-part="mouth"]');

      expect(document.querySelector('parsererror'), bodyShape).toBeNull();
      expect(document.documentElement.localName, bodyShape).toBe('svg');
      expect(document.querySelector(`[data-body-shape="${bodyShape}"]`), bodyShape).not.toBeNull();
      expect(eyes?.children.length, bodyShape).toBeGreaterThanOrEqual(2);
      expect(mouth?.children.length, bodyShape).toBeGreaterThanOrEqual(1);
      expect(svg, bodyShape).not.toMatch(/NaN|undefined|Infinity/);
      expect(svg, bodyShape).not.toMatch(/(?:stroke|fill)="(?:stroke|fill)=/);
      expect(svg, bodyShape).not.toMatch(/stroke="(?:#fff(?:fff)?|white|currentColor)"/i);
      expect(svg, bodyShape).not.toMatch(/\sstyle="/);

      const body = partMarkup(svg, '[data-part="body"]');
      expect([...bodies.values()], bodyShape).not.toContain(body);
      bodies.set(bodyShape, body);
    }
  });

  it('keeps dangerous neighboring silhouettes independently authored at small sizes', () => {
    const defaults = getDefaultParams('oddlings');
    const pairs = [
      ['pebble', 'pillow'], ['crown', 'fork'], ['glider', 'bowtie'],
      ['loop', 'arch'], ['loop', 'bridge'], ['starlet', 'prickle'],
      ['bell', 'lantern'], ['sprout', 'droplet'], ['droplet', 'flame'],
      ['tripod', 'split-tail'], ['monolith', 'totem'], ['totem', 'stack'],
      ['worm', 'comma'], ['comma', 'zigzag'], ['flower', 'clover'],
      ['clover', 'pinwheel'], ['pinwheel', 'fan'], ['vase', 'gourd'],
      ['gourd', 'tulip'], ['tulip', 'canopy'], ['scallop', 'shell'],
      ['wedge', 'prism'], ['prism', 'shield'],
    ] as const;

    for (const [first, second] of pairs) {
      const firstBody = partMarkup(generateAvatar('oddlings', {
        ...defaults,
        bodyShape: first,
      }), '[data-part="body"]');
      const secondBody = partMarkup(generateAvatar('oddlings', {
        ...defaults,
        bodyShape: second,
      }), '[data-part="body"]');
      expect(firstBody, `${first}/${second}`).not.toBe(secondBody);
    }
  });

  it('uses a fixed base fit and keeps each secondary layer independent of unrelated controls', () => {
    const defaults = getDefaultParams('oddlings');
    const theme = getTheme('oddlings');

    for (const bodyShape of bodyShapeNames) {
      const baseline = generateAvatar('oddlings', {
        ...defaults,
        bodyShape,
        feature: 'horn',
        pattern: 'dapple',
        eyeArrangement: 'offset',
        mouthStyle: 'crooked',
      });
      const expectedTransform = fitTransform(baseline);
      const expectedBody = partMarkup(baseline, '[data-part="body"]');
      const expectedPattern = partMarkup(baseline, '[data-part="pattern"]');
      const expectedFeature = partMarkup(baseline, '[data-part="feature"][data-layer="behind"]');
      const variants = [
        ...theme.schema.eyeArrangement.options.map((eyeArrangement) => ({ eyeArrangement })),
        ...theme.schema.mouthStyle.options.map((mouthStyle) => ({ mouthStyle })),
        ...theme.schema.feature.options.map((feature) => ({ feature })),
        ...theme.schema.pattern.options.map((pattern) => ({ pattern })),
        ...theme.schema.palette.options.map((palette) => ({ palette })),
        ...theme.schema.backgroundShape.options.map((backgroundShape) => ({ backgroundShape })),
      ];

      for (const variant of variants) {
        const svg = generateAvatar('oddlings', {
          ...defaults,
          bodyShape,
          feature: 'horn',
          pattern: 'dapple',
          eyeArrangement: 'offset',
          mouthStyle: 'crooked',
          ...variant,
        });
        expect(fitTransform(svg), `${bodyShape}/${JSON.stringify(variant)}`)
          .toBe(expectedTransform);
        expect(partMarkup(svg, '[data-part="body"]'), `${bodyShape}/${JSON.stringify(variant)}`)
          .toBe(expectedBody);
        if (!('pattern' in variant)) {
          expect(partMarkup(svg, '[data-part="pattern"]'), `${bodyShape}/${JSON.stringify(variant)}`)
            .toBe(expectedPattern);
        }
        if (!('feature' in variant)) {
          expect(partMarkup(svg, '[data-part="feature"][data-layer="behind"]'), `${bodyShape}/${JSON.stringify(variant)}`)
            .toBe(expectedFeature);
        }
      }
    }
  });

  it('keeps dapple to one painterly flank and swoop to one broad wash', () => {
    const defaults = getDefaultParams('oddlings');

    for (const bodyShape of bodyShapeNames) {
      for (const pattern of ['dapple', 'swoop'] as const) {
        const svg = generateAvatar('oddlings', { ...defaults, bodyShape, pattern });
        const group = parseSvg(svg).querySelector('[data-part="pattern"]');
        expect(group?.querySelectorAll('path').length, `${bodyShape}/${pattern}`).toBe(1);
        expect(group?.children.length, `${bodyShape}/${pattern}`).toBe(1);
        expect(group?.querySelector('circle, ellipse, line, rect'), `${bodyShape}/${pattern}`)
          .toBeNull();
      }
    }
  });

  it('renders every feature/pattern and eye/mouth combination as valid bounded SVG', () => {
    const defaults = getDefaultParams('oddlings');
    const theme = getTheme('oddlings');

    for (const bodyShape of bodyShapeNames) {
      for (const feature of theme.schema.feature.options) {
        for (const pattern of theme.schema.pattern.options) {
          const label = `${bodyShape}/${feature}/${pattern}`;
          const svg = generateAvatar('oddlings', { ...defaults, bodyShape, feature, pattern });
          expect(parseSvg(svg).querySelector('parsererror'), label).toBeNull();
          expect(svg, label).not.toMatch(/NaN|undefined|Infinity/);
        }
      }
      for (const eyeArrangement of theme.schema.eyeArrangement.options) {
        for (const mouthStyle of theme.schema.mouthStyle.options) {
          const label = `${bodyShape}/${eyeArrangement}/${mouthStyle}`;
          const svg = generateAvatar('oddlings', {
            ...defaults,
            bodyShape,
            eyeArrangement,
            mouthStyle,
          });
          const document = parseSvg(svg);
          expect(document.querySelector('parsererror'), label).toBeNull();
          expect(document.querySelector('[data-part="eyes"]')?.children.length, label)
            .toBeGreaterThanOrEqual(1);
          expect(document.querySelector('[data-part="mouth"]')?.children.length, label)
            .toBeGreaterThanOrEqual(1);
        }
      }
    }
  });

  it('keeps every palette readable without host-theme-dependent outlines', () => {
    const defaults = getDefaultParams('oddlings');

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      for (const surface of [palette.canvas, palette.primary, palette.secondary, palette.accent]) {
        expect(contrastRatio(palette.ink, surface), `${paletteName}/${surface}`)
          .toBeGreaterThanOrEqual(4.5);
      }
      for (const bodyShape of bodyShapeNames) {
        for (const backgroundShape of getTheme('oddlings').schema.backgroundShape.options) {
          const svg = generateAvatar('oddlings', {
            ...defaults,
            bodyShape,
            palette: paletteName,
            backgroundShape,
          });
          expect(svg, `${paletteName}/${backgroundShape}/${bodyShape}`)
            .toContain(`fill="${palette.ink}"`);
          expect(svg, `${paletteName}/${backgroundShape}/${bodyShape}`)
            .not.toMatch(/stroke="(?:#fff(?:fff)?|white|currentColor)"/i);
          expect(svg, `${paletteName}/${backgroundShape}/${bodyShape}`).not.toMatch(/\sstyle="/);
        }
      }
    }
  });

  it('keeps catalog occupancy healthy while reserving one fixed safety envelope', () => {
    const defaults = getDefaultParams('oddlings');

    for (const bodyShape of bodyShapeNames) {
      const transform = fitTransform(generateAvatar('oddlings', {
        ...defaults,
        bodyShape,
        feature: 'none',
        pattern: 'plain',
      }));
      const scale = Number(transform.match(/scale\(([^)]+)\)/)?.[1]);
      expect(Number.isFinite(scale), bodyShape).toBe(true);
      expect(scale, `${bodyShape} under-filled`).toBeGreaterThanOrEqual(0.7);
      expect(scale, `${bodyShape} over-filled`).toBeLessThanOrEqual(1.35);
    }
  });

  it('honors every explicit semantic trait and every primary catalog override', () => {
    const explicit = {
      bodyShape: 'satellite',
      eyeArrangement: 'trio',
      mouthStyle: 'toothy',
      feature: 'side-fin',
      pattern: 'patch',
    } as const;
    expect(generateParams('oddlings', 'all-explicit-oddlings', { traits: explicit }))
      .toMatchObject(explicit);

    for (const bodyShape of bodyShapeNames) {
      expect(generateParams('oddlings', `catalog-override:${bodyShape}`, {
        traits: { bodyShape },
      }).bodyShape).toBe(bodyShape);
    }
  });

  it('gives a 50-item Oddlings gallery every primary body exactly once', () => {
    const gallery = generateGallery(50, 'oddlings-canonical-cycle', {
      themes: ['oddlings'],
    });
    const generatedBodies = gallery.map(({ params }) => params.bodyShape);

    expect(new Set(generatedBodies).size).toBe(50);
    expect(new Set(generatedBodies)).toEqual(new Set(bodyShapeNames));
  });
});
