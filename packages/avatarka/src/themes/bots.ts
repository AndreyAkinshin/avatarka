import type { ParamSchema, ParamsFromSchema } from '../types';
import { fitToCircle } from '../fit';
import { getPalette, paletteNames, type Palette } from '../palettes';
import {
  createArtVariation,
  renderAvatarFrame,
  tonalEdge,
  type ArtVariation,
} from '../internal/art';
import { backgroundShapeNames, type AvatarRandom, type InternalTheme } from '../internal/types';
import {
  chassisNames,
  chassisWeights,
  getChassisDefinition,
  type AntennaProfile,
  type PanelProfile,
  type SensorProfile,
} from './botsChassis';

export const schema = {
  backgroundShape: { type: 'select', default: 'circle', options: backgroundShapeNames },
  palette: { type: 'select', default: 'coast', options: paletteNames },
  chassis: { type: 'select', default: 'capsule', options: chassisNames },
  eyeSystem: {
    type: 'select',
    default: 'dual',
    options: ['dual', 'visor', 'mono', 'soft', 'scanner'],
  },
  antenna: {
    type: 'select',
    default: 'single',
    options: ['none', 'single', 'fork', 'twin', 'loop'],
  },
  sideSensors: {
    type: 'select',
    default: 'pods',
    options: ['none', 'pods', 'rails', 'discs'],
  },
  panel: {
    type: 'select',
    default: 'badge',
    options: ['plain', 'split', 'badge', 'vents', 'stripe'],
  },
} as const satisfies ParamSchema;

export const baseTypeParam = 'chassis' as const;
export type BotsParams = ParamsFromSchema<typeof schema>;

const constructionChassis = new Set<BotsParams['chassis']>([
  'gantry', 'forklift', 'excavator', 'crane', 'loader',
]);

interface BotLayout {
  style: BotsParams['chassis'];
  svg: string;
  faceX: number;
  faceY: number;
  faceWidth: number;
  faceHeight: number;
  eyeGap: number;
  mouthY: number;
  topX: number;
  topY: number;
  antennaProfile: AntennaProfile;
  sensorLeft: number;
  sensorRight: number;
  sensorY: number;
  sensorProfile: SensorProfile;
  panelX: number;
  panelY: number;
  panelWidth: number;
  panelProfile: PanelProfile;
}

interface HardwareAsymmetry {
  target: 'antenna' | 'sensors' | 'panel';
  direction: -1 | 1;
}

/**
 * An invisible geometry-only circle reserves one stable hardware footprint.
 * Every topology and manual hardware override is authored inside it, so adding
 * hardware never rescales or recenters the chassis and permanent face.
 *
 * The radius and stroke width are a matched pair: the radius bounds every
 * composition point (fullest topology: 46.24 from center) while the stroke
 * pad bounds every scaled hardware stroke (fullest presence scale: 3.27), and
 * together they keep the measured content radius at exactly 50 so the fit
 * transform stays `translate(50 50) scale(0.88) translate(-50 -50)` for all
 * chassis and hardware overrides.
 */
export const BOTS_HARDWARE_ENVELOPE_RADIUS = 46.5;
const hardwareEnvelope = `<circle data-bots-hardware-envelope="reserved" cx="50" cy="50" r="${BOTS_HARDWARE_ENVELOPE_RADIUS}" fill="none" stroke="transparent" stroke-width="7"/>`;

/**
 * Per-chassis presence scale. Every composition is authored well inside the
 * hardware envelope, which left sparse topologies looking timid next to the
 * fullest ones. Each factor below lifts that chassis' maximal composition
 * (any antenna/side-sensor/panel override) to a shared occupancy target of
 * 44 viewBox units from center — measured against the envelope radius of 46.5
 * with headroom for hardware asymmetry — while chassis already at or beyond
 * the target keep factor 1 and stay byte-identical. The envelope itself is
 * never scaled, so the fixed fit transform and the reserved footprint are
 * unchanged; the catalog test asserting one fixed fit transform across all
 * hardware overrides is the regression guard against overflow.
 */
const chassisPresenceScale: Record<BotsParams['chassis'], number> = {
  capsule: 1.0605,
  block: 1.0695,
  dome: 1.0135,
  hex: 1.0003,
  taper: 1.0365,
  wide: 1.0509,
  cutout: 1.0135,
  bust: 1,
  drum: 1.1119,
  pyramid: 1,
  shield: 1.0135,
  ring: 1,
  hourglass: 1.0224,
  tripod: 1.0605,
  bell: 1,
  stack: 1,
  'split-core': 1.0224,
  crossframe: 1,
  clamshell: 1.0365,
  gyroscope: 1,
  crawler: 1,
  'twin-wheel': 1,
  'mono-wheel': 1.0365,
  walker: 1.0224,
  'hover-skiff': 1.0605,
  saucer: 1,
  quadcopter: 1,
  satellite: 1.077,
  rocket: 1.0605,
  submarine: 1,
  gantry: 1,
  forklift: 1,
  excavator: 1,
  crane: 1,
  loader: 1,
  boiler: 1.0197,
  piston: 1.0695,
  turbine: 1,
  magnet: 1.1209,
  lantern: 1.1483,
  beetle: 1.0455,
  crab: 1.0455,
  spider: 1,
  jelly: 1,
  manta: 1.0718,
  snail: 1,
  starframe: 1.0135,
  backpack: 1.0455,
  buoy: 1.0299,
  'cloud-cluster': 1.0365,
};

function renderChassis(style: BotsParams['chassis'], palette: Palette): BotLayout {
  const definition = getChassisDefinition(style);
  const primaryEdge = tonalEdge(palette.primary, palette.ink, 0.32);
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.3);
  const geometry = definition.geometry;
  const { face, antenna, sideSensors, panel } = definition.anchors;
  const headCue = definition.headCue.geometry
    ? `<g data-bots-head-cue="${definition.headCue.kind}" data-bots-head-cue-layer="${definition.headCue.layer}" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">${definition.headCue.geometry}</g>`
    : '';
  const headCueBehind = definition.headCue.layer === 'behind' ? headCue : '';
  const headCueFront = definition.headCue.layer === 'front' ? headCue : '';
  const svg = `<g data-bots-chassis="${style}" data-bots-density="${definition.density}">
    ${headCueBehind}
    <g data-bots-chassis-layer="body" fill="${palette.primary}" stroke="${primaryEdge}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${geometry.body}</g>
    ${geometry.secondary ? `<g data-bots-chassis-layer="secondary" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${geometry.secondary}</g>` : ''}
    ${geometry.line ? `<g data-bots-chassis-layer="line" fill="none" stroke="${primaryEdge}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${geometry.line}</g>` : ''}
    ${headCueFront}
  </g>`;

  return {
    style,
    svg,
    faceX: face.x,
    faceY: face.y,
    faceWidth: face.width,
    faceHeight: face.height,
    eyeGap: face.eyeGap,
    mouthY: face.mouthY,
    topX: antenna.x,
    topY: antenna.y,
    antennaProfile: antenna.profile,
    sensorLeft: sideSensors.leftX,
    sensorRight: sideSensors.rightX,
    sensorY: sideSensors.y,
    sensorProfile: sideSensors.profile,
    panelX: panel.x,
    panelY: panel.y,
    panelWidth: panel.width,
    panelProfile: panel.profile,
  };
}

function getHardwareAsymmetry(
  params: BotsParams,
  art: ArtVariation,
): HardwareAsymmetry {
  const target = params.antenna !== 'none'
    ? 'antenna'
    : params.sideSensors !== 'none'
      ? 'sensors'
      : 'panel';
  return { target, direction: art.bool('hardware-direction') ? 1 : -1 };
}

function renderAntenna(
  style: BotsParams['antenna'],
  layout: BotLayout,
  palette: Palette,
  asymmetry: HardwareAsymmetry,
): string {
  if (style === 'none') return '';
  const { topX: x, topY: y } = layout;
  const direction = asymmetry.target === 'antenna' ? asymmetry.direction : 0;
  const spread = layout.antennaProfile === 'split' ? 11 : 9;
  const stemEdge = tonalEdge(palette.primary, palette.ink, 0.34);
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.3);
  const stem = (d: string, width = 4): string => (
    `<path d="${d}" fill="none" stroke="${stemEdge}" stroke-width="${width + 1.6}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${palette.primary}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`
  );
  const tip = (cx: number, cy: number, r = 4.1): string => (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1.2"/>`
  );
  let content: string;

  switch (style) {
    case 'single': {
      const tipX = x + direction * 2;
      content = `${stem(`M${x} ${y + 1}Q${x} ${y - 6} ${tipX} ${y - 12}`, 3.8)}${tip(tipX, y - 16)}`;
      break;
    }
    case 'fork': {
      const leftLift = direction < 0 ? -1.3 : 0;
      const rightLift = direction > 0 ? -1.3 : 0;
      content = `${stem(`M${x} ${y + 1}V${y - 8}M${x} ${y - 7}L${x - spread} ${y - 14 + leftLift}M${x} ${y - 7}L${x + spread} ${y - 14 + rightLift}`, 3.4)}${tip(x - spread - 1.5, y - 16 + leftLift, 3.7)}${tip(x + spread + 1.5, y - 16 + rightLift, 3.7)}`;
      break;
    }
    case 'twin': {
      const leftLift = direction < 0 ? -1.3 : 0;
      const rightLift = direction > 0 ? -1.3 : 0;
      content = `${stem(`M${x - spread} ${y + 1}V${y - 14 + leftLift}M${x + spread} ${y + 1}V${y - 14 + rightLift}`, 3.6)}${tip(x - spread, y - 16 + leftLift, 3.9)}${tip(x + spread, y - 16 + rightLift, 3.9)}`;
      break;
    }
    case 'loop': {
      const loopSpread = spread + 3;
      content = stem(`M${x - loopSpread} ${y + 1}V${y - 5}C${x - loopSpread} ${y - 18} ${x + direction * 2} ${y - 18} ${x + loopSpread} ${y - 5}V${y + 1}`, 4.1);
      break;
    }
  }

  return `<g data-bots-hardware="antenna" data-bots-antenna-style="${style}" data-bots-hardware-profile="${layout.antennaProfile}">${content}</g>`;
}

function renderSideSensors(
  style: BotsParams['sideSensors'],
  layout: BotLayout,
  palette: Palette,
  asymmetry: HardwareAsymmetry,
): string {
  if (style === 'none') return '';
  const direction = asymmetry.target === 'sensors' ? asymmetry.direction : 0;
  const profileLift = layout.sensorProfile === 'low' ? 1 : layout.sensorProfile === 'wing' ? -1 : 0;
  const leftLift = profileLift + (direction < 0 ? -1.2 : 0);
  const rightLift = profileLift + (direction > 0 ? -1.2 : 0);
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.32);
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.3);
  const primaryEdge = tonalEdge(palette.primary, palette.ink, 0.32);
  const radius = layout.sensorProfile === 'wheel' ? 6.8 : layout.sensorProfile === 'wing' ? 6.2 : 7;
  let content: string;

  switch (style) {
    case 'pods':
      content = `<circle cx="${layout.sensorLeft}" cy="${layout.sensorY + leftLift}" r="${radius}" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1.3"/><circle cx="${layout.sensorRight}" cy="${layout.sensorY + rightLift}" r="${radius}" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1.3"/>`;
      break;
    case 'rails': {
      const height = layout.sensorProfile === 'low' ? 18 : 21;
      content = `<rect x="${layout.sensorLeft - 4.5}" y="${layout.sensorY - height / 2 + leftLift}" width="9" height="${height}" rx="4.5" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.5"/><rect x="${layout.sensorRight - 4.5}" y="${layout.sensorY - height / 2 + rightLift}" width="9" height="${height}" rx="4.5" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.5"/>`;
      break;
    }
    case 'discs': {
      const leftRadius = radius + (direction < 0 ? -0.5 : 0);
      const rightRadius = radius + (direction > 0 ? -0.5 : 0);
      content = `<circle cx="${layout.sensorLeft}" cy="${layout.sensorY + profileLift}" r="${leftRadius}" fill="${palette.primary}" stroke="${primaryEdge}" stroke-width="1.5"/><circle cx="${layout.sensorLeft}" cy="${layout.sensorY + profileLift}" r="${Math.max(2.6, leftRadius - 3.2)}" fill="${palette.accent}"/><circle cx="${layout.sensorRight}" cy="${layout.sensorY + profileLift}" r="${rightRadius}" fill="${palette.primary}" stroke="${primaryEdge}" stroke-width="1.5"/><circle cx="${layout.sensorRight}" cy="${layout.sensorY + profileLift}" r="${Math.max(2.6, rightRadius - 3.2)}" fill="${palette.accent}"/>`;
      break;
    }
  }

  return `<g data-bots-hardware="side-sensors" data-bots-hardware-profile="${layout.sensorProfile}">${content}</g>`;
}

function renderFacePlate(layout: BotLayout, palette: Palette): string {
  const geometry = getChassisDefinition(layout.style).geometry.facePlate;
  const edge = tonalEdge(palette.secondary, palette.ink, 0.28);
  return `<g data-bots-faceplate="${layout.style}" fill="${palette.secondary}" stroke="${edge}" stroke-width="1.15" stroke-linejoin="round">${geometry}</g>`;
}

function renderEyeSystem(
  style: BotsParams['eyeSystem'],
  layout: BotLayout,
  palette: Palette,
): string {
  const { faceX: x, faceY: y, eyeGap } = layout;
  const leftX = x - eyeGap / 2;
  const rightX = x + eyeGap / 2;
  let content: string;

  switch (style) {
    case 'dual':
      content = `<circle cx="${leftX}" cy="${y}" r="4.4" fill="${palette.ink}"/><circle cx="${rightX}" cy="${y}" r="4.4" fill="${palette.ink}"/><circle cx="${leftX - 1.2}" cy="${y - 1.2}" r="1.15" fill="${palette.accent}"/><circle cx="${rightX - 1.2}" cy="${y - 1.2}" r="1.15" fill="${palette.accent}"/>`;
      break;
    case 'visor':
      content = `<path d="M${leftX - 5} ${y}Q${x} ${y - 4} ${rightX + 5} ${y}" fill="none" stroke="${palette.ink}" stroke-width="5.2" stroke-linecap="round"/><circle cx="${leftX}" cy="${y - 0.7}" r="2" fill="${palette.accent}"/><circle cx="${rightX}" cy="${y - 0.7}" r="2" fill="${palette.accent}"/>`;
      break;
    case 'mono':
      content = `<ellipse cx="${x}" cy="${y}" rx="7.2" ry="6.2" fill="${palette.ink}"/><circle cx="${x - 1.4}" cy="${y - 1.2}" r="2.6" fill="${palette.accent}"/>`;
      break;
    case 'soft':
      content = `<path d="M${leftX - 4.5} ${y + 1}Q${leftX} ${y - 4.5} ${leftX + 4.5} ${y + 1}M${rightX - 4.5} ${y + 1}Q${rightX} ${y - 4.5} ${rightX + 4.5} ${y + 1}" fill="none" stroke="${palette.ink}" stroke-width="3.3" stroke-linecap="round"/>`;
      break;
    case 'scanner':
      content = `<path d="M${leftX - 4.5} ${y}L${leftX} ${y - 4}L${leftX + 4.5} ${y}L${leftX} ${y + 4}ZM${rightX - 4.5} ${y}L${rightX} ${y - 4}L${rightX + 4.5} ${y}L${rightX} ${y + 4}Z" fill="${palette.ink}"/><circle cx="${rightX}" cy="${y}" r="1.7" fill="${palette.accent}"/>`;
      break;
  }

  return `<g data-bots-eyes="${style}">${content}</g>`;
}

function renderFriendlyMouth(layout: BotLayout, palette: Palette): string {
  const halfWidth = Math.max(4.5, Math.min(7, layout.faceWidth * 0.15));
  return `<path data-bots-mouth="friendly" d="M${layout.faceX - halfWidth} ${layout.mouthY}Q${layout.faceX} ${layout.mouthY + 4} ${layout.faceX + halfWidth} ${layout.mouthY}" fill="none" stroke="${palette.ink}" stroke-width="2.1" stroke-linecap="round"/>`;
}

function renderPanel(
  style: BotsParams['panel'],
  layout: BotLayout,
  palette: Palette,
  asymmetry: HardwareAsymmetry,
): string {
  const x = layout.panelX;
  const y = Math.max(layout.panelY, layout.mouthY + 8);
  const widthScale = layout.panelProfile === 'split' ? 0.9 : layout.panelProfile === 'side' ? 0.82 : 1;
  const panelWidth = layout.panelWidth * widthScale;
  const direction = asymmetry.target === 'panel' ? asymmetry.direction : 0;
  const profileShift = layout.panelProfile === 'side' ? direction * 1.4 : 0;
  const secondaryEdge = tonalEdge(palette.secondary, palette.ink, 0.3);
  const accentEdge = tonalEdge(palette.accent, palette.ink, 0.3);
  let content: string;

  switch (style) {
    case 'plain':
      content = `<rect x="${x - panelWidth / 2 + profileShift}" y="${y - 2.6}" width="${panelWidth}" height="5.2" rx="2.6" fill="${palette.secondary}" stroke="${secondaryEdge}" stroke-width="1.1"/>`;
      break;
    case 'split': {
      const segmentWidth = Math.max(6, panelWidth / 2 - 2);
      content = `<rect x="${x - panelWidth / 2}" y="${y - 3}" width="${segmentWidth}" height="6" rx="3" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1"/><rect x="${x + panelWidth / 2 - segmentWidth}" y="${y - 3}" width="${segmentWidth}" height="6" rx="3" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1"/>`;
      break;
    }
    case 'badge':
      content = `<circle cx="${x + profileShift}" cy="${y}" r="4.5" fill="${palette.accent}" stroke="${accentEdge}" stroke-width="1.1"/>`;
      break;
    case 'vents':
      content = `<path d="M${x - panelWidth / 2 + profileShift} ${y}H${x + panelWidth / 2 + profileShift}" fill="none" stroke="${secondaryEdge}" stroke-width="4.5" stroke-linecap="round"/>`;
      break;
    case 'stripe':
      content = `<path d="M${x - panelWidth / 2} ${y + 2}L${x + panelWidth / 2} ${y - 2}" fill="none" stroke="${palette.accent}" stroke-width="4.2" stroke-linecap="round"/>`;
      break;
  }

  return `<g data-bots-panel="${style}" data-bots-hardware-profile="${layout.panelProfile}">${content}</g>`;
}

export function generate(params: BotsParams): string {
  const art = createArtVariation('bots', params);
  const palette = getPalette(params.palette);
  const layout = renderChassis(params.chassis, palette);
  const asymmetry = getHardwareAsymmetry(params, art);
  const drawing = [
    renderAntenna(params.antenna, layout, palette, asymmetry),
    renderSideSensors(params.sideSensors, layout, palette, asymmetry),
    layout.svg,
    renderFacePlate(layout, palette),
    renderEyeSystem(params.eyeSystem, layout, palette),
    renderFriendlyMouth(layout, palette),
    renderPanel(params.panel, layout, palette, asymmetry),
  ].join('');
  const scale = chassisPresenceScale[params.chassis];
  const scaled = scale === 1
    ? drawing
    : `<g transform="translate(50 50) scale(${scale}) translate(-50 -50)">${drawing}</g>`;
  const content = hardwareEnvelope + scaled;

  const fitted = fitToCircle(`<g data-bots-fixed-envelope="true">${content}</g>`, {
    size: 100,
    padding: 6,
  });
  return renderAvatarFrame(fitted, params.palette, params.backgroundShape, {
    clipContent: false,
  });
}

export function randomize(
  random: AvatarRandom,
  traits: Partial<BotsParams> = {},
): BotsParams {
  const chassis = traits.chassis ?? random.weightedPick('chassis', chassisWeights);
  const definition = getChassisDefinition(chassis);

  return {
    backgroundShape: random.weightedPick('background-shape', [
      ['circle', 6], ['rounded', 3], ['square', 1],
    ]),
    palette: random.pick('palette', schema.palette.options),
    chassis,
    eyeSystem: traits.eyeSystem ?? random.weightedPick('eye-system', [
      ['dual', 5], ['visor', 4], ['mono', 2], ['soft', 4], ['scanner', 2],
    ]),
    antenna: traits.antenna ?? random.weightedPick(
      `antenna:${chassis}`,
      definition.naturalAntennas,
    ),
    sideSensors: traits.sideSensors ?? (constructionChassis.has(chassis)
      ? 'none'
      : random.weightedPick('side-sensors', [
          ['none', 4], ['pods', 4], ['rails', 3], ['discs', 3],
        ])),
    panel: traits.panel ?? random.weightedPick('panel', [
      ['plain', 2], ['split', 3], ['badge', 4], ['vents', 3], ['stripe', 3],
    ]),
  };
}

export const bots: InternalTheme<typeof schema, 'robot', typeof baseTypeParam> = {
  name: 'Bots',
  description: 'Friendly industrial robot heads with bold, readable hardware.',
  kind: 'robot',
  baseTypeParam,
  schema,
  generate,
  randomize,
};
