import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  generateParams,
  getDefaultParams,
  paletteNames,
  palettes,
  type FolksParams,
} from '../index';
import { __test as fitTest } from '../fit';
import { tonalEdge } from '../internal/art';
import { schema } from '../themes/folks';
import {
  getHairDefinition,
  hairDefinitions,
  hairStyleNames,
  hairStyleWeights,
  renderHairLayer,
  type HairStyle,
} from '../themes/folksHair';

const canonicalHairStyles = [
  'crop', 'long-straight', 'space-buns', 'sweep', 'beehive',
  'side-braid', 'cloud', 'slick-back', 'high-ponytail', 'bald',
  'pixie', 'box-braids', 'pompadour', 'bob', 'bantu-knots',
  'wave', 'undercut', 'ringlets', 'half-up-bun', 'flipped-ends',
  'shaved', 'twin-braids', 'quiff', 'shoulder-curls', 'mohawk',
  'low-chignon', 'coils', 'curtain', 'high-top', 'double-puffs',
  'side-part', 'rope-twists', 'spiky', 'french-twist', 'shag',
  'braided-crown', 'finger-waves', 'twin-ponytails', 'caesar', 'locs',
  'bowl-cut', 'loc-bun', 'asymmetric', 'cornrows', 'high-bun',
  'mullet', 'victory-rolls', 'twist-out', 'bubble-ponytail',
  'pineapple-updo',
] as const satisfies readonly HairStyle[];

const skinTones = [
  'porcelain', 'peach', 'sand', 'honey', 'copper', 'umber', 'deep',
] as const satisfies readonly FolksParams['skinTone'][];

const skinPigments = {
  porcelain: { base: '#f4d9ce', ink: '#3f2924' },
  peach: { base: '#edc4ae', ink: '#3f2924' },
  sand: { base: '#dca982', ink: '#3b2721' },
  honey: { base: '#c88b5b', ink: '#34221d' },
  copper: { base: '#a86643', ink: '#291a16' },
  umber: { base: '#85543c', ink: '#2b1a16' },
  deep: { base: '#684236', ink: '#211310' },
} as const satisfies Record<FolksParams['skinTone'], {
  readonly base: string;
  readonly ink: string;
}>;

const faceShapes = [
  'oval', 'round', 'soft-square', 'tapered',
] as const satisfies readonly FolksParams['faceShape'][];

function geometrySignature(style: HairStyle): string {
  return JSON.stringify(getHairDefinition(style).geometry);
}

function renderedHair(style: HairStyle): string {
  return (['lower', 'back', 'front', 'overlay'] as const)
    .map((layerName) => renderHairLayer(style, layerName, {
      base: '#765432',
      shade: '#321000',
    }))
    .join('');
}

function radius(content: string): number {
  const { points, pad } = fitTest.collectPoints(content);
  return Math.max(
    0,
    ...points.map((point) => Math.hypot(point.x - 50, point.y - 50)),
  ) + pad;
}

function normalizePigments(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

function normalizePresentationGeometry(
  svg: string,
  skinTone: FolksParams['skinTone'],
): string {
  const pigments = skinPigments[skinTone];
  const amount = skinTone === 'deep' ? 0.72 : skinTone === 'umber' ? 0.62 : 0.54;
  const feature = tonalEdge(pigments.base, pigments.ink, amount);
  const normalizedFacePaint = svg.replace(/<[^>]+>/g, (tag) => (
    tag.includes(`stroke="${feature}"`)
      ? tag.replace(/stroke-width="[\d.]+"/, 'stroke-width="facial"')
      : tag
  ));
  return normalizePigments(normalizedFacePaint);
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

function contrastRatio(left: string, right: string): number {
  const leftLuminance = relativeLuminance(left);
  const rightLuminance = relativeLuminance(right);
  return (
    (Math.max(leftLuminance, rightLuminance) + 0.05)
    / (Math.min(leftLuminance, rightLuminance) + 0.05)
  );
}

function avatarDrawing(svg: string): string {
  const fixedViewport = svg.match(/<svg x="0"[\s\S]*<\/svg>\s*<\/svg>$/)?.[0] ?? svg;
  return fixedViewport
    .replace(/<svg x="0"[^>]*>/, '<svg>')
    .replace(/<(?:circle|rect)\b[^>]*\/>/, '');
}

describe('Folks hair catalog', () => {
  it('uses one exact ordered exhaustive registry for schema and randomization', () => {
    expect(hairStyleNames).toEqual(canonicalHairStyles);
    expect(schema.hairStyle.options).toBe(hairStyleNames);
    expect(hairDefinitions.map(({ id }) => id)).toEqual(canonicalHairStyles);
    expect(hairStyleWeights.map(([id]) => id)).toEqual(canonicalHairStyles);
    expect(new Set(hairStyleNames).size).toBe(50);
    expect(hairDefinitions).toHaveLength(50);
    expect(hairStyleWeights.every(([, weight]) => (
      Number.isSafeInteger(weight) && weight > 0
    ))).toBe(true);

    for (const hairStyle of hairStyleNames) {
      expect(generateParams('folks', `folks-primary:${hairStyle}`, {
        traits: { hairStyle },
      }).hairStyle).toBe(hairStyle);
    }
  });

  it('deeply freezes definitions and their structural anchors', () => {
    expect(Object.isFrozen(hairDefinitions)).toBe(true);
    expect(Object.isFrozen(hairStyleNames)).toBe(true);
    expect(Object.isFrozen(hairStyleWeights)).toBe(true);

    for (const definition of hairDefinitions) {
      expect(Object.isFrozen(definition)).toBe(true);
      expect(Object.isFrozen(definition.geometry)).toBe(true);
      expect(Object.isFrozen(definition.anchors)).toBe(true);
      expect(Object.isFrozen(definition.anchors.headband)).toBe(true);
      expect(Object.isFrozen(definition.anchors.studs)).toBe(true);
      for (const layer of Object.values(definition.geometry)) {
        expect(Object.isFrozen(layer)).toBe(true);
      }
    }
  });

  it('gives every style a distinct silhouette/construction signature', () => {
    const signatures = hairStyleNames.map(geometrySignature);
    expect(new Set(signatures).size).toBe(50);

    const culturallySpecific = [
      'box-braids', 'bantu-knots', 'coils', 'rope-twists',
      'braided-crown', 'locs', 'loc-bun', 'cornrows', 'twist-out',
      'pineapple-updo',
    ] as const;
    expect(new Set(culturallySpecific.map(geometrySignature)).size).toBe(
      culturallySpecific.length,
    );

    expect(getHairDefinition('box-braids').geometry.overlay.strands).toContain('M29 36');
    expect(getHairDefinition('box-braids').geometry.overlay.strandWidth).toBeGreaterThanOrEqual(4.5);
    expect(geometrySignature('bantu-knots').match(/circle/g)?.length).toBeGreaterThanOrEqual(8);
    expect(geometrySignature('cornrows').match(/M/g)?.length).toBeGreaterThanOrEqual(6);
    expect(geometrySignature('rope-twists').match(/Q/g)?.length).toBeGreaterThanOrEqual(20);
    expect(geometrySignature('locs').match(/M/g)?.length).toBeGreaterThanOrEqual(12);
  });

  it('keeps structural anchors in face- and frame-safe ranges', () => {
    for (const definition of hairDefinitions) {
      expect(definition.anchors.hairlineY).toBeGreaterThanOrEqual(22);
      expect(definition.anchors.hairlineY).toBeLessThanOrEqual(35);
      expect(['revealed', 'under-hair']).toContain(definition.anchors.ears);
      expect(['behind-neck', 'over-neck']).toContain(definition.anchors.lowerHair);
      expect(['before-front', 'over-front']).toContain(definition.anchors.headband.layer);

      const { points } = fitTest.collectPoints(
        `<path d="${definition.anchors.headband.d}" stroke="#000000" stroke-width="3.4"/>`,
      );
      expect(Math.min(...points.map(({ y }) => y))).toBeGreaterThanOrEqual(13);
      expect(Math.max(...points.map(({ y }) => y))).toBeLessThanOrEqual(38);
      expect(definition.anchors.studs.leftX).toBeGreaterThanOrEqual(-3);
      expect(definition.anchors.studs.rightX).toBeLessThanOrEqual(3);
      expect(definition.anchors.studs.y).toBeGreaterThanOrEqual(3);
      expect(definition.anchors.studs.y).toBeLessThanOrEqual(5);
    }
  });

  it('fits every complete hair construction inside a tilted circular frame', () => {
    const overflow = hairStyleNames.flatMap((style) => {
      const content = renderedHair(style);
      const worstRadius = Math.max(
        radius(`<g transform="translate(-.9 .65) rotate(-2.35 50 53)">${content}</g>`),
        radius(`<g transform="translate(.9 .65) rotate(2.35 50 53)">${content}</g>`),
      );
      return worstRadius <= 49.25 ? [] : [`${style}:${worstRadius.toFixed(3)}`];
    });

    expect(overflow).toEqual([]);
  });

  it('renders every style across all face shapes and skin tones', () => {
    for (const [index, hairStyle] of hairStyleNames.entries()) {
      for (const [shapeIndex, faceShape] of faceShapes.entries()) {
        for (const [toneIndex, skinTone] of skinTones.entries()) {
          const accessoryIndex = (index + shapeIndex + toneIndex) % 3;
          const svg = generateAvatar('folks', {
            ...getDefaultParams('folks'),
            hairStyle,
            faceShape,
            skinTone,
            accessory: accessoryIndex === 0
              ? 'studs'
              : accessoryIndex === 1 ? 'headband' : 'soft-glasses',
            topStyle: index % 2 === 0 ? 'hood' : 'wrap',
          });

          expect(svg).toContain('<svg');
          expect(svg).not.toContain('undefined');
          expect(svg).not.toContain('NaN');
          if (hairStyle !== 'bald') {
            expect(svg).toContain(`data-folks-hair="${hairStyle}"`);
          }
        }
      }
    }
  });

  it('keeps geometry stable across palette, skin, and hair pigments', () => {
    for (const [index, hairStyle] of hairStyleNames.entries()) {
      const common = {
        ...getDefaultParams('folks'),
        hairStyle,
        faceShape: faceShapes[index % faceShapes.length]!,
        accessory: index % 2 === 0 ? 'headband' : 'studs',
      } satisfies FolksParams;
      const baseline = normalizePresentationGeometry(
        avatarDrawing(generateAvatar('folks', common)),
        common.skinTone,
      );

      for (const [variantIndex, palette] of paletteNames.entries()) {
        const variant = generateAvatar('folks', {
          ...common,
          palette,
          skinTone: skinTones[(index + variantIndex) % skinTones.length]!,
          hairColor: schema.hairColor.options[
            (index + variantIndex) % schema.hairColor.options.length
          ]!,
        });
        expect(normalizePresentationGeometry(
          avatarDrawing(variant),
          skinTones[(index + variantIndex) % skinTones.length]!,
        )).toBe(baseline);
      }
    }
  });

  it('keeps every hair pigment legible on every universal canvas', () => {
    for (const hairStyle of hairStyleNames) {
      if (hairStyle === 'bald') continue;
      for (const hairColor of schema.hairColor.options) {
        for (const palette of paletteNames) {
          const svg = generateAvatar('folks', {
            ...getDefaultParams('folks'),
            hairStyle,
            hairColor,
            palette,
          });
          const pigments = svg.match(
            new RegExp(`data-folks-hair="${hairStyle}"[\\s\\S]*?<g fill="(#[\\da-f]{6})" stroke="(#[\\da-f]{6})"`, 'i'),
          );
          expect(pigments, `${hairStyle}/${hairColor}/${palette}`).not.toBeNull();
          const base = pigments![1]!;
          const shade = pigments![2]!;
          expect(contrastRatio(base, palettes[palette].canvas)).toBeGreaterThanOrEqual(1.28);
          expect(contrastRatio(shade, base)).toBeGreaterThanOrEqual(1.18);
        }
      }
    }
  });

  it('layers hoods, lower hair, ears, face, bands, fringe, and features naturally', () => {
    for (const hairStyle of hairStyleNames) {
      const definition = getHairDefinition(hairStyle);
      const svg = generateAvatar('folks', {
        ...getDefaultParams('folks'),
        hairStyle,
        topStyle: 'hood',
        accessory: 'headband',
      });
      const hood = svg.indexOf('Q20.5 78.5 30 75');
      const neck = svg.indexOf('M41 68 Q41 79');
      const face = svg.indexOf('M50 18C64 18');
      const front = svg.indexOf(`data-folks-hair="${hairStyle}" data-folks-hair-layer="front"`);
      const band = svg.indexOf(`d="${definition.anchors.headband.d}"`);
      const brows = svg.indexOf('stroke-width="1.75"');

      expect(hood).toBeGreaterThan(-1);
      expect(neck).toBeGreaterThan(hood);
      expect(face).toBeGreaterThan(neck);
      expect(brows).toBeGreaterThan(face);
      expect(band).toBeGreaterThan(face);
      if (front >= 0) {
        if (definition.anchors.headband.layer === 'before-front') {
          expect(band).toBeLessThan(front);
        } else {
          expect(band).toBeGreaterThan(front);
        }
      }
    }
  });
});
