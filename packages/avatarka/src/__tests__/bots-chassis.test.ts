import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  paletteNames,
  palettes,
  type BotsParams,
} from '../index';
import { tonalEdge } from '../internal/art';
import { __test as fitTest } from '../fit';
import { BOTS_HARDWARE_ENVELOPE_RADIUS, schema } from '../themes/bots';
import {
  chassisDefinitions,
  chassisNames,
  chassisWeights,
  type Chassis,
} from '../themes/botsChassis';

const canonicalChassis = [
  'capsule', 'block', 'dome', 'hex', 'taper', 'wide', 'cutout',
  'bust', 'drum', 'pyramid', 'shield', 'ring', 'hourglass', 'tripod',
  'bell', 'stack', 'split-core', 'crossframe', 'clamshell', 'gyroscope',
  'crawler', 'twin-wheel', 'mono-wheel', 'walker', 'hover-skiff',
  'saucer', 'quadcopter', 'satellite', 'rocket', 'submarine', 'gantry',
  'forklift', 'excavator', 'crane', 'loader', 'boiler', 'piston',
  'turbine', 'magnet', 'lantern', 'beetle', 'crab', 'spider', 'jelly',
  'manta', 'snail', 'starframe', 'backpack', 'buoy', 'cloud-cluster',
] as const satisfies readonly Chassis[];

function normalizePigments(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

function avatarDrawing(svg: string): string {
  const plainFrame = svg.match(/\n\s*<g>([\s\S]*)<\/g>\s*<\/svg>$/)?.[1];
  if (!plainFrame) throw new Error('Unable to extract Bots avatar drawing');
  return plainFrame;
}

function fixedEnvelopeTransform(svg: string): string {
  const transform = svg.match(
    /<g transform="([^"]+)"><g data-bots-fixed-envelope="true">/,
  )?.[1];
  if (!transform) throw new Error('Missing Bots fixed-envelope transform');
  return transform;
}

function mouthTag(svg: string): string {
  const mouth = svg.match(/<path data-bots-mouth="friendly"[^>]*\/>/)?.[0];
  if (!mouth) throw new Error('Missing Bots friendly mouth');
  return mouth;
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

describe('Bots chassis catalog', () => {
  it('uses one exact ordered exhaustive registry for schema and randomization', () => {
    expect(chassisNames).toEqual(canonicalChassis);
    expect(schema.chassis.options).toBe(chassisNames);
    expect(getBaseTypeCatalog('bots').values).toEqual(chassisNames);
    expect(chassisDefinitions.map(({ id }) => id)).toEqual(canonicalChassis);
    expect(chassisWeights.map(([id]) => id)).toEqual(canonicalChassis);
    expect(chassisDefinitions).toHaveLength(50);
    expect(new Set(chassisNames).size).toBe(50);
    expect(chassisNames.slice(0, 7)).toEqual([
      'capsule', 'block', 'dome', 'hex', 'taper', 'wide', 'cutout',
    ]);
    expect(chassisNames.slice(7)).toHaveLength(43);
    expect(chassisWeights.every(([, weight]) => (
      Number.isSafeInteger(weight) && weight > 0
    ))).toBe(true);

    for (const chassis of chassisNames) {
      expect(generateParams('bots', `bots-primary:${chassis}`, {
        traits: { chassis },
      }).chassis).toBe(chassis);
    }
  });

  it('deeply freezes definitions, geometry, and role anchors', () => {
    expect(Object.isFrozen(chassisDefinitions)).toBe(true);
    expect(Object.isFrozen(chassisNames)).toBe(true);
    expect(Object.isFrozen(chassisWeights)).toBe(true);

    for (const definition of chassisDefinitions) {
      expect(Object.isFrozen(definition)).toBe(true);
      expect(Object.isFrozen(definition.geometry)).toBe(true);
      expect(Object.isFrozen(definition.headCue)).toBe(true);
      expect(Object.isFrozen(definition.naturalAntennas)).toBe(true);
      expect(definition.naturalAntennas.every((choice) => Object.isFrozen(choice))).toBe(true);
      expect(Object.isFrozen(definition.anchors)).toBe(true);
      expect(Object.isFrozen(definition.anchors.face)).toBe(true);
      expect(Object.isFrozen(definition.anchors.antenna)).toBe(true);
      expect(Object.isFrozen(definition.anchors.sideSensors)).toBe(true);
      expect(Object.isFrozen(definition.anchors.panel)).toBe(true);
    }
  });

  it('gives every chassis a distinct low-density topology and matching face plate', () => {
    const topologySignatures = chassisDefinitions.map(({ geometry }) => JSON.stringify({
      body: geometry.body,
      secondary: geometry.secondary,
      line: geometry.line,
    }));
    const completeSignatures = chassisDefinitions.map(({ geometry }) => JSON.stringify(geometry));

    expect(new Set(topologySignatures).size).toBe(50);
    expect(new Set(completeSignatures).size).toBe(50);
    for (const definition of chassisDefinitions) {
      const markup = Object.values(definition.geometry).join('');
      const primitiveCount = markup.match(/<(?:path|rect|circle|ellipse|polygon)\b/g)?.length ?? 0;
      expect(definition.geometry.body, definition.id).not.toBe('');
      expect(definition.geometry.facePlate, definition.id).not.toBe('');
      expect(primitiveCount, definition.id).toBeGreaterThanOrEqual(2);
      expect(primitiveCount, definition.id).toBeLessThanOrEqual(9);
      expect(definition.density, definition.id).toBeGreaterThanOrEqual(1);
      expect(definition.density, definition.id).toBeLessThanOrEqual(3);
      expect(markup, definition.id).not.toMatch(/screen|grid|rivet|stencil/i);
    }
  });

  it('uses sparse authored head cues and reserves natural antennas for ten semantic fits', () => {
    const visibleCues = chassisDefinitions.filter(({ headCue }) => headCue.geometry !== '');
    expect(visibleCues.length).toBeGreaterThanOrEqual(16);
    expect(new Set(visibleCues.map(({ headCue }) => headCue.kind)).size)
      .toBe(visibleCues.length);
    expect(new Set(visibleCues.map(({ headCue }) => headCue.geometry)).size)
      .toBe(visibleCues.length);

    const antennaCapable = chassisDefinitions.filter(({ naturalAntennas }) => (
      naturalAntennas.some(([antenna]) => antenna !== 'none')
    ));
    expect(antennaCapable.map(({ id }) => id)).toEqual([
      'capsule', 'dome', 'crawler', 'saucer', 'quadcopter', 'satellite',
      'submarine', 'snail', 'buoy', 'cloud-cluster',
    ]);

    const defaults = getDefaultParams('bots');
    for (const definition of chassisDefinitions) {
      const allowed = new Set(definition.naturalAntennas.map(([antenna]) => antenna));
      expect(allowed.size, definition.id).toBeGreaterThan(0);
      expect(definition.naturalAntennas.every(([, weight]) => (
        Number.isSafeInteger(weight) && weight > 0
      )), definition.id).toBe(true);

      const withoutAntenna = generateAvatar('bots', {
        ...defaults,
        chassis: definition.id,
        antenna: 'none',
      });
      expect(withoutAntenna, definition.id).not.toContain('data-bots-hardware="antenna"');
      if (definition.headCue.geometry) {
        expect(withoutAntenna, definition.id)
          .toContain(`data-bots-head-cue="${definition.headCue.kind}"`);
      }

      for (let index = 0; index < 8; index++) {
        const params = generateParams('bots', `bots-natural:${definition.id}:${index}`, {
          traits: { chassis: definition.id },
        });
        expect(allowed.has(params.antenna), `${definition.id}/${params.antenna}`).toBe(true);
      }
    }

    const explicit = generateParams('bots', 'bots-explicit-construction-antenna', {
      traits: { chassis: 'gantry', antenna: 'fork' },
    });
    expect(explicit.antenna).toBe('fork');
    expect(generateAvatar('bots', explicit)).toContain('data-bots-antenna-style="fork"');

    for (let regeneration = 0; regeneration < 16; regeneration++) {
      const catalogParams = chassisNames.map((chassis, index) => generateParams(
        'bots',
        `avatarka-v4-demo:${regeneration}`,
        { namespace: `demo:gallery-item:${index}`, traits: { chassis } },
      ));
      const catalogAntennas = catalogParams.filter(({ antenna }) => antenna !== 'none');
      expect(catalogAntennas.length, `regeneration ${regeneration}`)
        .toBeGreaterThanOrEqual(6);
      expect(catalogAntennas.length, `regeneration ${regeneration}`)
        .toBeLessThanOrEqual(10);
      expect(new Set(catalogAntennas.map(({ antenna }) => antenna)).size)
        .toBeGreaterThanOrEqual(4);
      expect(catalogAntennas.every(({ chassis }) => (
        antennaCapable.some(({ id }) => id === chassis)
      ))).toBe(true);
    }

    for (const chassis of ['gantry', 'forklift', 'excavator', 'crane', 'loader'] as const) {
      for (let index = 0; index < 8; index++) {
        expect(generateParams('bots', `bots-construction:${chassis}:${index}`, {
          traits: { chassis },
        }).sideSensors, chassis).toBe('none');
      }
    }
    expect(generateParams('bots', 'bots-explicit-construction-sensors', {
      traits: { chassis: 'loader', sideSensors: 'rails' },
    }).sideSensors).toBe('rails');
  });

  it('protects five unmistakable construction silhouettes with directional cues', () => {
    const expectedCues = {
      gantry: 'gantry-frame',
      forklift: 'forklift-mast-forks',
      excavator: 'excavator-boom-bucket',
      crane: 'crane-jib-hook',
      loader: 'loader-scoop-wheels',
    } as const;
    const bounds = new Map<string, { left: number; right: number; top: number; bottom: number }>();

    for (const [chassis, cue] of Object.entries(expectedCues)) {
      const definition = chassisDefinitions.find(({ id }) => id === chassis)!;
      const markup = Object.values(definition.geometry).join('');
      const cueMarkup = markup.match(
        new RegExp(`<path data-bots-construction-cue="${cue}"[^>]+/>`),
      )?.[0];
      expect(cueMarkup, chassis).toBeDefined();
      const { points } = fitTest.collectPoints(cueMarkup!);
      bounds.set(chassis, {
        left: Math.min(...points.map(({ x }) => x)),
        right: Math.max(...points.map(({ x }) => x)),
        top: Math.min(...points.map(({ y }) => y)),
        bottom: Math.max(...points.map(({ y }) => y)),
      });

      const svg = generateAvatar('bots', {
        ...getDefaultParams('bots'),
        chassis: chassis as Chassis,
        antenna: 'none',
        sideSensors: 'none',
      });
      expect(svg, chassis).toContain(`data-bots-construction-cue="${cue}"`);
    }

    expect(bounds.get('gantry')!.left).toBeLessThanOrEqual(18);
    expect(bounds.get('gantry')!.right).toBeGreaterThanOrEqual(82);
    expect(bounds.get('gantry')!.top).toBeLessThanOrEqual(20);
    expect(bounds.get('gantry')!.bottom).toBeGreaterThanOrEqual(80);
    expect(bounds.get('forklift')!.top).toBeLessThanOrEqual(18);
    expect(bounds.get('forklift')!.right).toBeGreaterThanOrEqual(87);
    expect(bounds.get('excavator')!.left).toBeLessThanOrEqual(16);
    expect(bounds.get('excavator')!.right).toBeGreaterThanOrEqual(90);
    expect(bounds.get('crane')!.left).toBeGreaterThanOrEqual(56);
    expect(bounds.get('crane')!.bottom).toBeGreaterThanOrEqual(68);
    expect(bounds.get('loader')!.top).toBeGreaterThanOrEqual(54);
    expect(bounds.get('loader')!.left).toBeLessThanOrEqual(10);
  });

  it('keeps face and hardware anchors inside safe authoring ranges', () => {
    for (const { id, anchors } of chassisDefinitions) {
      expect(anchors.face.x, id).toBeGreaterThanOrEqual(39);
      expect(anchors.face.x, id).toBeLessThanOrEqual(50);
      expect(anchors.face.y, id).toBeGreaterThanOrEqual(43);
      expect(anchors.face.y, id).toBeLessThanOrEqual(49);
      expect(anchors.face.width, id).toBeGreaterThanOrEqual(24);
      expect(anchors.face.width, id).toBeLessThanOrEqual(50);
      expect(anchors.face.height, id).toBeGreaterThanOrEqual(20);
      expect(anchors.face.height, id).toBeLessThanOrEqual(28);
      expect(anchors.face.eyeGap, id).toBeGreaterThanOrEqual(12);
      expect(anchors.face.eyeGap, id).toBeLessThanOrEqual(24);
      expect(anchors.face.mouthY, id).toBeGreaterThan(anchors.face.y);
      expect(anchors.face.mouthY, id).toBeLessThanOrEqual(58);

      expect(anchors.antenna.x, id).toBeGreaterThanOrEqual(34);
      expect(anchors.antenna.x, id).toBeLessThanOrEqual(61);
      expect(anchors.antenna.y, id).toBeGreaterThanOrEqual(27);
      expect(anchors.antenna.y, id).toBeLessThanOrEqual(36);
      expect(['crown', 'offset-left', 'offset-right', 'split'])
        .toContain(anchors.antenna.profile);

      expect(anchors.sideSensors.leftX, id).toBeGreaterThanOrEqual(17);
      expect(anchors.sideSensors.rightX, id).toBeLessThanOrEqual(83);
      expect(anchors.sideSensors.y, id).toBeGreaterThanOrEqual(48);
      expect(anchors.sideSensors.y, id).toBeLessThanOrEqual(61);
      expect(['temple', 'low', 'wheel', 'wing']).toContain(anchors.sideSensors.profile);

      expect(anchors.panel.x, id).toBeGreaterThanOrEqual(45);
      expect(anchors.panel.x, id).toBeLessThanOrEqual(56);
      expect(anchors.panel.y, id).toBeGreaterThanOrEqual(60);
      expect(anchors.panel.y, id).toBeLessThanOrEqual(72);
      expect(anchors.panel.width, id).toBeGreaterThanOrEqual(16);
      expect(anchors.panel.width, id).toBeLessThanOrEqual(32);
      expect(['center', 'low', 'split', 'side']).toContain(anchors.panel.profile);
    }
  });

  it('renders permanent eyes and one friendly mouth independently of every panel', () => {
    const defaults = getDefaultParams('bots');
    for (const chassis of chassisNames) {
      let canonicalMouth: string | undefined;
      for (const eyeSystem of schema.eyeSystem.options) {
        for (const panel of schema.panel.options) {
          const svg = generateAvatar('bots', {
            ...defaults,
            chassis,
            eyeSystem,
            panel,
          });
          expect(svg, `${chassis}/${eyeSystem}/${panel}`)
            .toContain(`data-bots-eyes="${eyeSystem}"`);
          expect(svg.match(/data-bots-mouth="friendly"/g), `${chassis}/${eyeSystem}/${panel}`)
            .toHaveLength(1);
          canonicalMouth ??= mouthTag(svg);
          expect(mouthTag(svg), `${chassis}/${eyeSystem}/${panel}`).toBe(canonicalMouth);
          expect(svg).toContain(`data-bots-panel="${panel}"`);
          expect(svg).not.toContain('undefined');
          expect(svg).not.toContain('NaN');
        }
      }
    }
  });

  it('uses one fixed fit transform for every manual hardware override', () => {
    const defaults = getDefaultParams('bots');
    const transforms = new Set<string>();

    for (const chassis of chassisNames) {
      for (const antenna of schema.antenna.options) {
        for (const sideSensors of schema.sideSensors.options) {
          for (const panel of schema.panel.options) {
            const svg = generateAvatar('bots', {
              ...defaults,
              chassis,
              antenna,
              sideSensors,
              panel,
            });
            transforms.add(fixedEnvelopeTransform(svg));
            expect(svg, `${chassis}/${antenna}/${sideSensors}/${panel}`)
              .toContain(`r="${BOTS_HARDWARE_ENVELOPE_RADIUS}"`);
            if (antenna === 'none') {
              expect(svg).not.toContain('data-bots-antenna-style=');
            } else {
              expect(svg).toContain(`data-bots-antenna-style="${antenna}"`);
            }
            expect(svg).not.toContain('clip-path');
          }
        }
      }
    }

    expect([...transforms]).toEqual([
      'translate(50 50) scale(0.88) translate(-50 -50)',
    ]);
  });

  it('keeps every chassis geometry stable across all palettes and frames', () => {
    const defaults = getDefaultParams('bots');
    for (const chassis of chassisNames) {
      const common = {
        ...defaults,
        chassis,
        eyeSystem: schema.eyeSystem.options[chassisNames.indexOf(chassis) % schema.eyeSystem.options.length]!,
        antenna: schema.antenna.options[chassisNames.indexOf(chassis) % schema.antenna.options.length]!,
        sideSensors: schema.sideSensors.options[chassisNames.indexOf(chassis) % schema.sideSensors.options.length]!,
        panel: schema.panel.options[chassisNames.indexOf(chassis) % schema.panel.options.length]!,
      } satisfies BotsParams;
      const baseline = normalizePigments(avatarDrawing(generateAvatar('bots', common)));

      for (const palette of paletteNames) {
        for (const backgroundShape of schema.backgroundShape.options) {
          const variant = generateAvatar('bots', { ...common, palette, backgroundShape });
          expect(
            normalizePigments(avatarDrawing(variant)),
            `${chassis}/${palette}/${backgroundShape}`,
          ).toBe(baseline);
        }
      }
    }
  });

  it('keeps optional hardware from moving the chassis or permanent face', () => {
    const defaults = getDefaultParams('bots');
    for (const chassis of chassisNames) {
      const identity = (svg: string): string => normalizePigments(
        svg.match(/<g data-bots-chassis=[\s\S]*?(?=<g data-bots-panel=)/)?.[0] ?? '',
      ).replace(/<g data-bots-eyes="[^"]+">[\s\S]*?<\/g>/, '<eyes/>');
      const baseline = identity(generateAvatar('bots', {
        ...defaults,
        chassis,
        antenna: 'none',
        sideSensors: 'none',
        panel: 'badge',
      }));

      for (const antenna of schema.antenna.options) {
        for (const sideSensors of schema.sideSensors.options) {
          const variant = generateAvatar('bots', {
            ...defaults,
            chassis,
            antenna,
            sideSensors,
            panel: 'badge',
          });
          expect(identity(variant), `${chassis}/${antenna}/${sideSensors}`).toBe(baseline);
        }
      }
    }
  });

  it('uses legible fill-related contours and face semantics in every palette', () => {
    for (const paletteName of paletteNames) {
      const palette = palettes[paletteName];
      const primaryEdge = tonalEdge(palette.primary, palette.ink, 0.32);
      const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.3);
      expect(contrastRatio(primaryEdge, palette.primary), paletteName)
        .toBeGreaterThanOrEqual(1.18);
      expect(contrastRatio(secondaryEdge, palette.secondary), paletteName)
        .toBeGreaterThanOrEqual(1.15);
      expect(contrastRatio(palette.ink, palette.secondary), paletteName)
        .toBeGreaterThanOrEqual(3);

      for (const chassis of chassisNames) {
        const svg = generateAvatar('bots', {
          ...getDefaultParams('bots'),
          chassis,
          palette: paletteName,
        });
        expect(svg).toContain(`stroke="${primaryEdge}" stroke-width="1.6"`);
        expect(svg).toContain('data-bots-mouth="friendly"');
        expect(svg).not.toContain('stroke-opacity');
      }
    }
  });
});
