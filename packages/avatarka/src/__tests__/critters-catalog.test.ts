import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  generateGallery,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  getTheme,
  type CrittersParams,
} from '../core';
import { paletteNames, palettes } from '../palettes';
import { __test, speciesNames } from '../themes/critters';

const canonicalSpecies = [
  'cat', 'elephant', 'owl', 'dolphin', 'fox', 'turtle', 'panda', 'parrot', 'pufferfish', 'butterfly',
  'dog', 'frog', 'lion', 'toucan', 'seal', 'chameleon', 'rabbit', 'octopus', 'giraffe', 'shark',
  'bear', 'axolotl', 'eagle', 'zebra', 'crab', 'koala', 'crocodile', 'penguin', 'whale', 'mouse',
  'raccoon', 'duck', 'salamander', 'tiger', 'manta-ray', 'snail', 'deer', 'chicken', 'anglerfish', 'iguana',
  'pig', 'peacock', 'gecko', 'bee', 'alpaca', 'jellyfish', 'bat', 'clownfish', 'toad', 'snake',
] as const;

function parseSvg(svg: string): Document {
  return new DOMParser().parseFromString(svg, 'image/svg+xml');
}

function fitTransform(svg: string): string {
  const match = svg.match(/<g><g transform="([^"]+)">/);
  expect(match).toBeDefined();
  return match![1]!;
}

function bodyGeometry(svg: string): string {
  const start = svg.indexOf('<g data-part="species-body"');
  const end = svg.indexOf('<g data-part="marking"', start);
  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);
  return svg
    .slice(start, end)
    .replace(/ data-species="[^"]+"/, '')
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

describe('Critters canonical 50 catalog', () => {
  it('derives the exact public schema order from one exhaustive definition catalog', () => {
    const catalog = getBaseTypeCatalog('critters');

    expect(speciesNames).toEqual(canonicalSpecies);
    expect(getTheme('critters').schema.species.options).toEqual(speciesNames);
    expect(catalog.values).toEqual(speciesNames);
    expect(__test.speciesDefinitions.map(({ id }) => id)).toEqual(canonicalSpecies);
    expect(new Set(speciesNames).size).toBe(50);
    expect(new Set(__test.speciesDefinitions.map(({ label }) => label)).size).toBe(50);
  });

  it('stores complete finite face, marking, leaf, and proportional base anchors per species', () => {
    for (const definition of __test.speciesDefinitions) {
      const { eyes, mouth, marking, accessory } = definition.anchors;
      const values = [
        ...eyes.flatMap((eye) => [eye.x, eye.y, eye.rx, eye.ry, eye.angle]),
        mouth.x, mouth.y, mouth.width, mouth.depth, mouth.bias,
        ...Object.values(marking),
        accessory.x, accessory.y, accessory.width, accessory.angle, accessory.glassesScale,
        ...Object.values(accessory.leaf),
      ];

      expect(values.every(Number.isFinite), definition.id).toBe(true);
      expect(eyes[0].x, definition.id).toBeLessThan(eyes[1].x);
      expect(eyes[0].rx, definition.id).toBeGreaterThan(0);
      expect(eyes[1].rx, definition.id).toBeGreaterThan(0);
      expect(mouth.width, definition.id).toBeGreaterThan(0);
      expect(accessory.width, definition.id).toBeGreaterThanOrEqual(18);
      expect(accessory.width, definition.id).toBeLessThanOrEqual(48);
      expect(accessory.x, definition.id).toBeGreaterThanOrEqual(0);
      expect(accessory.x, definition.id).toBeLessThanOrEqual(100);
      expect(Math.abs(accessory.angle), definition.id).toBeLessThanOrEqual(90);
      expect(accessory.leaf.scale, definition.id).toBeGreaterThan(0);
      expect(accessory.leaf.scale, definition.id).toBeLessThanOrEqual(1);

      for (const profile of [definition.naturalMarkings, definition.naturalAccessories]) {
        expect(profile.length, definition.id).toBeGreaterThan(0);
        expect(new Set(profile.map(([value]) => value)).size, definition.id).toBe(profile.length);
        expect(profile.every(([, weight]) => Number.isFinite(weight) && weight > 0), definition.id)
          .toBe(true);
        expect(profile.some(([value]) => value === 'none'), definition.id).toBe(true);
      }
    }
  });

  it('keeps neckwear out of natural aquatic and delicate profiles while explicit overrides stay valid', () => {
    const neckless = new Set([
      'dolphin', 'pufferfish', 'butterfly', 'seal', 'octopus', 'shark',
      'axolotl', 'crab', 'whale', 'manta-ray', 'snail', 'anglerfish',
      'bee', 'jellyfish', 'clownfish',
    ]);

    for (const definition of __test.speciesDefinitions) {
      if (!neckless.has(definition.id)) continue;
      const natural = definition.naturalAccessories.map(([accessory]) => accessory);
      expect(natural, definition.id).not.toContain('collar');
      expect(natural, definition.id).not.toContain('bandana');
    }
  });

  it('renders every authored base as valid, distinct SVG with two eyes and one mouth', () => {
    const defaults = getDefaultParams('critters');
    const bodies = new Map<string, string>();

    for (const species of speciesNames) {
      const svg = generateAvatar('critters', {
        ...defaults,
        species,
        expression: 'soft-smile',
        marking: 'none',
        accessory: 'none',
      });
      const document = parseSvg(svg);
      const expression = document.querySelector('[data-part="expression"]');

      expect(document.querySelector('parsererror'), species).toBeNull();
      expect(document.documentElement.localName, species).toBe('svg');
      expect(document.querySelector(`[data-species="${species}"]`), species).not.toBeNull();
      expect(expression?.children.length, species).toBe(3);
      expect(svg, species).not.toMatch(/(?:stroke|fill)="(?:stroke|fill)=/);
      expect(svg, species).not.toMatch(/NaN|undefined|Infinity/);
      expect(svg, species).not.toMatch(/(?:#fff(?:fff)?|\bwhite\b|currentColor)/i);

      const body = bodyGeometry(svg);
      expect([...bodies.values()], species).not.toContain(body);
      bodies.set(species, body);
    }
    expect(bodies.size).toBe(50);
  });

  it('keeps dangerous neighboring silhouettes independently authored at 24px', () => {
    const defaults = getDefaultParams('critters');
    const pairs = [
      ['cat', 'fox'], ['cat', 'tiger'], ['bear', 'panda'], ['frog', 'toad'],
      ['chameleon', 'iguana'], ['salamander', 'gecko'], ['dolphin', 'whale'],
      ['shark', 'clownfish'], ['owl', 'eagle'], ['parrot', 'toucan'],
      ['butterfly', 'bee'], ['octopus', 'jellyfish'], ['turtle', 'snail'],
    ] as const;

    for (const [first, second] of pairs) {
      const firstBody = bodyGeometry(generateAvatar('critters', { ...defaults, species: first }));
      const secondBody = bodyGeometry(generateAvatar('critters', { ...defaults, species: second }));
      expect(firstBody, `${first}/${second}`).not.toBe(secondBody);
    }
  });

  it('authors sparse species-defining cues for the six ambiguous silhouettes', () => {
    const defaults = getDefaultParams('critters');
    const expectedCues = {
      salamander: { tail: 1, limb: 4 },
      toad: { 'squat-body': 1, wart: 6 },
      whale: { 'broad-body': 1, flukes: 1, blowhole: 1 },
      dolphin: { fluke: 1, 'dorsal-fin': 1, beak: 1 },
      'manta-ray': { 'diamond-wings': 1, tail: 1, 'cephalic-lobe': 2 },
      clownfish: { 'tail-fin': 1, 'authored-band': 2 },
    } as const;

    for (const [species, cues] of Object.entries(expectedCues)) {
      const document = parseSvg(generateAvatar('critters', {
        ...defaults,
        species: species as CrittersParams['species'],
        marking: 'none',
        accessory: 'none',
      }));
      const body = document.querySelector(`[data-species="${species}"]`);
      expect(body, species).not.toBeNull();

      for (const [cue, count] of Object.entries(cues)) {
        expect(
          body!.querySelectorAll(`[data-cue="${cue}"]`).length,
          `${species}/${cue}`,
        ).toBe(count);
      }
    }

    const clownfish = parseSvg(generateAvatar('critters', {
      ...defaults,
      species: 'clownfish',
      marking: 'none',
      accessory: 'none',
    }));
    const bands = clownfish.querySelectorAll('[data-cue="authored-band"]');
    for (const band of bands) {
      expect(band.localName).toBe('path');
      expect(band.getAttribute('stroke')).toBeNull();
      expect(band.getAttribute('fill')).not.toBeNull();
      expect(band.getAttribute('d')).toMatch(/Z$/);
    }
  });

  it('orients explicit neckwear across side-profile bodies instead of under their mouths', () => {
    const defaults = getDefaultParams('critters');

    for (const species of ['dolphin', 'salamander', 'clownfish'] as const) {
      const definition = __test.speciesDefinitions.find((candidate) => candidate.id === species)!;
      expect(definition.anchors.accessory.width, species).toBe(18);
      expect(Math.abs(definition.anchors.accessory.angle), species).toBeGreaterThanOrEqual(82);

      for (const accessory of ['collar', 'bandana'] as const) {
        const document = parseSvg(generateAvatar('critters', {
          ...defaults,
          species,
          accessory,
        }));
        const transform = document
          .querySelector(`[data-part="accessory"] > g`)
          ?.getAttribute('transform');
        expect(transform, `${species}/${accessory}`).toBe(
          `rotate(${definition.anchors.accessory.angle} ${definition.anchors.accessory.x} ${definition.anchors.accessory.y})`,
        );
      }
    }
  });

  it('keeps base geometry and fit transform fixed across every secondary and presentation option', () => {
    const defaults = getDefaultParams('critters');
    const schema = getTheme('critters').schema;

    for (const species of speciesNames) {
      const baseline = generateAvatar('critters', {
        ...defaults,
        species,
        marking: 'none',
        accessory: 'none',
      });
      const expectedTransform = fitTransform(baseline);
      const expectedBody = bodyGeometry(baseline);
      const variants = [
        ...schema.coat.options.map((coat) => ({ coat })),
        ...schema.expression.options.map((expression) => ({ expression })),
        ...schema.marking.options.map((marking) => ({ marking })),
        ...schema.accessory.options.map((accessory) => ({ accessory })),
        ...schema.palette.options.map((palette) => ({ palette })),
        ...schema.backgroundShape.options.map((backgroundShape) => ({ backgroundShape })),
      ];

      for (const variant of variants) {
        const svg = generateAvatar('critters', { ...defaults, species, ...variant });
        expect(fitTransform(svg), `${species}/${JSON.stringify(variant)}`)
          .toBe(expectedTransform);
        expect(bodyGeometry(svg), `${species}/${JSON.stringify(variant)}`)
          .toBe(expectedBody);
      }
    }
  });

  it('renders the full coat/accessory compatibility surface as valid SVG', () => {
    const defaults = getDefaultParams('critters');
    const schema = getTheme('critters').schema;

    for (const species of speciesNames) {
      for (const coat of schema.coat.options) {
        for (const accessory of schema.accessory.options) {
          for (const marking of schema.marking.options) {
            const svg = generateAvatar('critters', {
              ...defaults,
              species,
              coat,
              accessory,
              marking,
            });
            const label = `${species}/${coat}/${accessory}/${marking}`;
            expect(parseSvg(svg).querySelector('parsererror'), label).toBeNull();
            expect(svg, label).not.toMatch(/(?:stroke|fill)="(?:stroke|fill)=/);
          }
        }
      }
    }
  }, 30_000);

  it('keeps palette ink strongly readable and avoids host-theme-dependent outlines', () => {
    const defaults = getDefaultParams('critters');

    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      for (const surface of [palette.canvas, palette.primary, palette.secondary, palette.accent]) {
        expect(contrastRatio(palette.ink, surface), `${paletteName}/${surface}`)
          .toBeGreaterThanOrEqual(4.5);
      }
      for (const species of speciesNames) {
        const svg = generateAvatar('critters', {
          ...defaults,
          species,
          palette: paletteName,
        });
        expect(svg, `${paletteName}/${species}`).toContain(`fill="${palette.ink}"`);
        expect(svg, `${paletteName}/${species}`).not.toContain('style=');
      }
    }
  });

  it('honors every explicit semantic trait and every primary catalog override', () => {
    const explicit = {
      species: 'octopus',
      coat: 'warm',
      expression: 'sleepy',
      marking: 'cheek-spots',
      accessory: 'bandana',
    } as const;
    const params = generateParams('critters', 'all-explicit-critters', { traits: explicit });

    expect(params).toMatchObject(explicit);
    for (const species of speciesNames) {
      expect(generateParams('critters', `catalog-override:${species}`, {
        traits: { species },
      }).species).toBe(species);
    }
  });

  it('gives a 50-item Critters gallery every primary species exactly once', () => {
    const gallery = generateGallery(50, 'critters-canonical-cycle', {
      themes: ['critters'],
    });
    const generatedSpecies = gallery.map(({ params }) => params.species);

    expect(new Set(generatedSpecies).size).toBe(50);
    expect(new Set(generatedSpecies)).toEqual(new Set(speciesNames));
  });
});
