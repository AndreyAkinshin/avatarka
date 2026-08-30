/**
 * The Bots catalog is topology-first. This ordered registry is the single
 * source for the public chassis schema, catalog review, randomizer weights,
 * hardware anchors, and renderer geometry. Pigments deliberately live in the
 * renderer so palettes and frames can never select or move robot hardware.
 */

export type AntennaProfile = 'crown' | 'offset-left' | 'offset-right' | 'split';
export type SensorProfile = 'temple' | 'low' | 'wheel' | 'wing';
export type PanelProfile = 'center' | 'low' | 'split' | 'side';
export type AntennaStyle = 'none' | 'single' | 'fork' | 'twin' | 'loop';
export type HeadCueLayer = 'behind' | 'front';

export interface HeadCue {
  /** Semantic cue name for contact-sheet review and collision tests. */
  readonly kind: string;
  /** Behind cues extend the silhouette; front cues sit inside the head mass. */
  readonly layer: HeadCueLayer;
  readonly geometry: string;
}

export type NaturalAntennaWeight = readonly [
  antenna: AntennaStyle,
  weight: number,
];

export interface ChassisGeometry {
  /** Primary topology silhouette. */
  readonly body: string;
  /** One restrained secondary structural mass, never decorative clutter. */
  readonly secondary: string;
  /** Sparse construction seams inheriting a fill-derived tonal edge. */
  readonly line: string;
  /** Topology-specific inset behind the permanent face. */
  readonly facePlate: string;
}

export interface ChassisAnchors {
  readonly face: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly eyeGap: number;
    readonly mouthY: number;
  };
  readonly antenna: {
    readonly x: number;
    readonly y: number;
    readonly profile: AntennaProfile;
  };
  readonly sideSensors: {
    readonly leftX: number;
    readonly rightX: number;
    readonly y: number;
    readonly profile: SensorProfile;
  };
  readonly panel: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly profile: PanelProfile;
  };
}

export interface ChassisDefinition<Id extends string = string> {
  readonly id: Id;
  readonly label: string;
  readonly weight: number;
  readonly density: 1 | 2 | 3;
  readonly geometry: ChassisGeometry;
  readonly headCue: HeadCue;
  readonly naturalAntennas: readonly NaturalAntennaWeight[];
  readonly anchors: ChassisAnchors;
}

interface DefinitionOptions {
  readonly weight?: number;
  readonly density: 1 | 2 | 3;
  readonly body: string;
  readonly secondary?: string;
  readonly line?: string;
  readonly facePlate: string;
  readonly headCue?: HeadCue;
  readonly naturalAntennas?: readonly NaturalAntennaWeight[];
  readonly face: readonly [x: number, y: number, width: number, height: number, eyeGap: number, mouthY?: number];
  readonly antenna?: readonly [x: number, y: number, profile: AntennaProfile];
  readonly sideSensors?: readonly [leftX: number, rightX: number, y: number, profile: SensorProfile];
  readonly panel?: readonly [x: number, y: number, width: number, profile: PanelProfile];
}

function defineChassis<const Id extends string>(
  id: Id,
  label: string,
  options: DefinitionOptions,
): ChassisDefinition<Id> {
  const [faceX, faceY, faceWidth, faceHeight, eyeGap, mouthY = faceY + 8] = options.face;
  const [antennaX = 50, antennaY = 30, antennaProfile = 'crown'] = options.antenna ?? [];
  const [sensorLeft = 20, sensorRight = 80, sensorY = 52, sensorProfile = 'temple'] = options.sideSensors ?? [];
  const [panelX = faceX, panelY = 70, panelWidth = 24, panelProfile = 'center'] = options.panel ?? [];
  const headCue = options.headCue ?? {
    kind: 'integrated',
    layer: 'front',
    geometry: '',
  };
  const naturalAntennas = options.naturalAntennas ?? [['none', 1] as const];

  return Object.freeze({
    id,
    label,
    weight: options.weight ?? 2,
    density: options.density,
    geometry: Object.freeze({
      body: options.body,
      secondary: options.secondary ?? '',
      line: options.line ?? '',
      facePlate: options.facePlate,
    }),
    headCue: Object.freeze({ ...headCue }),
    naturalAntennas: Object.freeze(
      naturalAntennas.map((choice) => Object.freeze([...choice] as NaturalAntennaWeight)),
    ),
    anchors: Object.freeze({
      face: Object.freeze({
        x: faceX,
        y: faceY,
        width: faceWidth,
        height: faceHeight,
        eyeGap,
        mouthY,
      }),
      antenna: Object.freeze({ x: antennaX, y: antennaY, profile: antennaProfile }),
      sideSensors: Object.freeze({
        leftX: sensorLeft,
        rightX: sensorRight,
        y: sensorY,
        profile: sensorProfile,
      }),
      panel: Object.freeze({
        x: panelX,
        y: panelY,
        width: panelWidth,
        profile: panelProfile,
      }),
    }),
  });
}

export const chassisDefinitions = Object.freeze([
  // The first seven retain the established v4-preview silhouettes and senses.
  defineChassis('capsule', 'Capsule', {
    density: 1,
    body: '<rect x="24" y="25" width="52" height="55" rx="22"/>',
    facePlate: '<rect x="29" y="37" width="42" height="26" rx="13"/>',
    headCue: {
      kind: 'status-dome', layer: 'behind',
      geometry: '<path d="M42 27V23Q42 17 50 17Q58 17 58 23V27Z"/>',
    },
    naturalAntennas: [['single', 1]],
    face: [50, 49, 42, 26, 20, 57],
    antenna: [50, 31, 'crown'], sideSensors: [21, 79, 52, 'temple'], panel: [50, 70, 24, 'center'],
  }),
  defineChassis('block', 'Block', {
    density: 1,
    body: '<rect x="22" y="27" width="56" height="52" rx="9"/>',
    facePlate: '<rect x="28" y="38" width="44" height="24" rx="5"/>',
    headCue: {
      kind: 'carry-handle', layer: 'behind',
      geometry: '<path d="M37 29V23Q37 18 42 18H58Q63 18 63 23V29H57V24H43V29Z"/>',
    },
    face: [50, 49, 44, 24, 22, 57],
    antenna: [50, 32, 'split'], sideSensors: [20, 80, 52, 'temple'], panel: [50, 70, 28, 'center'],
  }),
  defineChassis('dome', 'Dome', {
    density: 1,
    body: '<path d="M23 78V50C23 32 34 22 50 22C66 22 77 32 77 50V78Z"/>',
    facePlate: '<path d="M30 63V49C30 40 38 35 50 35C62 35 70 40 70 49V63Z"/>',
    headCue: {
      kind: 'vent-cap', layer: 'front',
      geometry: '<path d="M42 25Q50 19 58 25L55 30H45Z"/>',
    },
    naturalAntennas: [['none', 2], ['single', 4]],
    face: [50, 49, 40, 28, 18, 58],
    antenna: [50, 29, 'crown'], sideSensors: [21, 79, 53, 'temple'], panel: [50, 69, 25, 'center'],
  }),
  defineChassis('hex', 'Hex', {
    density: 1,
    body: '<path d="M31 22H69L79 38V64L68 80H32L21 64V38Z"/>',
    facePlate: '<path d="M33 36H67L72 42V58L67 64H33L28 58V42Z"/>',
    headCue: {
      kind: 'sensor-fins', layer: 'behind',
      geometry: '<path d="M33 28L22 20L21 35ZM67 28L78 20L79 35Z"/>',
    },
    face: [50, 49, 44, 27, 21, 57],
    antenna: [50, 29, 'split'], sideSensors: [20, 80, 51, 'temple'], panel: [50, 70, 27, 'center'],
  }),
  defineChassis('taper', 'Taper', {
    density: 1,
    body: '<path d="M27 23H73L78 66L66 80H34L22 66Z"/>',
    facePlate: '<path d="M29 37H71L68 63H32Z"/>',
    headCue: {
      kind: 'chevron-ridge', layer: 'front',
      geometry: '<path d="M37 26L50 18L63 26L58 31L50 25L42 31Z"/>',
    },
    face: [50, 49, 42, 26, 20, 57],
    antenna: [50, 30, 'crown'], sideSensors: [21, 79, 52, 'temple'], panel: [50, 70, 24, 'center'],
  }),
  defineChassis('wide', 'Wide', {
    density: 1,
    body: '<rect x="18" y="31" width="64" height="46" rx="17"/>',
    facePlate: '<rect x="25" y="38.5" width="50" height="21" rx="10.5"/>',
    headCue: {
      kind: 'roof-pods', layer: 'behind',
      geometry: '<path d="M27 33V27Q27 23 31 23H39Q43 23 43 29V33ZM57 33V29Q57 23 61 23H69Q73 23 73 27V33Z"/>',
    },
    face: [50, 48, 50, 21, 24, 56],
    antenna: [50, 36, 'split'], sideSensors: [17, 83, 53, 'wing'], panel: [50, 68, 32, 'center'],
  }),
  defineChassis('cutout', 'Cutout', {
    density: 1,
    body: '<path d="M31 22H69L78 31V70L69 79H59L55 74H45L41 79H31L22 70V31Z"/>',
    facePlate: '<path d="M28.5 37H71.5V59L66.5 63H57L53.5 60H46.5L43 63H33.5L28.5 59Z"/>',
    headCue: {
      kind: 'inset-crown', layer: 'front',
      geometry: '<path d="M38 26L45 21H55L62 26L57 31H43Z"/>',
    },
    face: [50, 49, 43, 26, 20, 57],
    antenna: [50, 29, 'crown'], sideSensors: [21, 79, 51, 'temple'], panel: [50, 69, 26, 'center'],
  }),

  // Purpose-built topologies. Each body and face plate is authored as one
  // readable silhouette rather than assembled from interchangeable screens.
  defineChassis('bust', 'Bust', {
    density: 2,
    body: '<path d="M31 25Q50 17 69 25L75 64L84 78H16L25 64Z"/>',
    secondary: '<path d="M22 73Q31 66 39 66H61Q69 66 78 73L82 80H18Z"/>',
    facePlate: '<path d="M31 37Q50 29 69 37L67 61Q50 67 33 61Z"/>',
    headCue: {
      kind: 'temple-cap', layer: 'front',
      geometry: '<path d="M38 27Q50 18 62 27L58 32Q50 27 42 32Z"/>',
    },
    face: [50, 48, 38, 26, 18, 57],
    antenna: [50, 30, 'crown'], sideSensors: [23, 77, 50, 'temple'], panel: [50, 71, 22, 'low'],
  }),
  defineChassis('drum', 'Drum', {
    density: 2,
    body: '<path d="M25 31Q50 23 75 31V72Q50 82 25 72Z"/>',
    secondary: '<path d="M25 31Q50 41 75 31V38Q50 48 25 38ZM25 67Q50 57 75 67V72Q50 82 25 72Z"/>',
    line: '<path d="M26 38V66M74 38V66"/>',
    facePlate: '<path d="M30 40Q50 34 70 40V61Q50 67 30 61Z"/>',
    headCue: {
      kind: 'valve-key', layer: 'behind',
      geometry: '<path d="M45 29V20H55V29ZM38 16H62V21H38Z"/>',
    },
    face: [50, 49, 40, 24, 19, 57],
    antenna: [50, 33, 'offset-right'], sideSensors: [22, 78, 53, 'temple'], panel: [50, 69, 25, 'center'],
  }),
  defineChassis('pyramid', 'Pyramid', {
    density: 2,
    body: '<path d="M50 18L84 81H16Z"/>',
    secondary: '<path d="M21.4 71H78.6L84 81H16Z"/>',
    line: '<path d="M38 72.5V79M62 72.5V79"/>',
    facePlate: '<path d="M38.1 40H61.9L74.8 64H25.2Z"/>',
    headCue: {
      kind: 'apex-cap', layer: 'front',
      geometry: '<path d="M50 18.5L57.5 32H42.5Z"/>',
    },
    face: [50, 49, 40, 24, 18, 57],
    antenna: [50, 29, 'crown'], sideSensors: [25, 75, 61, 'low'], panel: [50, 72, 24, 'low'],
  }),
  defineChassis('shield', 'Shield', {
    density: 1,
    body: '<path d="M50 20L77 30V57Q73 73 50 82Q27 73 23 57V30Z"/>',
    facePlate: '<path d="M50 31L69 38V56Q64 65 50 70Q36 65 31 56V38Z"/>',
    face: [50, 48, 38, 27, 18, 57],
    antenna: [50, 29, 'crown'], sideSensors: [22, 78, 50, 'temple'], panel: [50, 70, 20, 'low'],
  }),
  defineChassis('ring', 'Ring', {
    density: 2,
    body: '<circle cx="50" cy="51" r="31"/>',
    secondary: '<circle cx="50" cy="51" r="24"/>',
    line: '<path d="M25 33Q50 17 75 33M25 69Q50 85 75 69"/>',
    facePlate: '<ellipse cx="50" cy="50" rx="20" ry="17"/>',
    headCue: {
      kind: 'orbital-node', layer: 'front',
      geometry: '<circle cx="50" cy="20" r="4.5"/>',
    },
    face: [50, 48, 40, 26, 18, 57],
    antenna: [50, 28, 'crown'], sideSensors: [19, 81, 52, 'wheel'], panel: [50, 72, 18, 'low'],
  }),
  defineChassis('hourglass', 'Hourglass', {
    density: 1,
    body: '<path d="M25 23H75L65 50L76 79H24L35 50Z"/>',
    facePlate: '<path d="M33 33H67L60 50L68 67H32L40 50Z"/>',
    face: [50, 48, 34, 25, 16, 57],
    antenna: [50, 30, 'split'], sideSensors: [24, 76, 50, 'temple'], panel: [50, 70, 20, 'low'],
  }),
  defineChassis('tripod', 'Tripod', {
    density: 2,
    body: '<path d="M31 26Q50 18 69 26L73 64Q50 76 27 64Z"/>',
    secondary: '<path d="M36 63L28 83H38L50 68L62 83H72L64 63Z"/>',
    facePlate: '<path d="M34 36Q50 30 66 36L67 57Q50 65 33 57Z"/>',
    headCue: {
      kind: 'camera-fin', layer: 'behind',
      geometry: '<path d="M43 27L50 16L57 27Z"/>',
    },
    face: [50, 47, 34, 25, 16, 56],
    antenna: [50, 31, 'crown'], sideSensors: [27, 73, 49, 'temple'], panel: [50, 64, 19, 'low'],
  }),
  defineChassis('bell', 'Bell', {
    density: 2,
    body: '<path d="M50 20Q70 21 74 45L78 73Q65 82 50 82Q35 82 22 73L26 45Q30 21 50 20Z"/>',
    secondary: '<path d="M22 70Q50 78 78 70L76 78Q50 87 24 78Z"/>',
    facePlate: '<path d="M31 36Q50 28 69 36L70 60Q50 68 30 60Z"/>',
    headCue: {
      kind: 'bell-cap', layer: 'behind',
      geometry: '<path d="M43 24Q43 14 50 14Q57 14 57 24Z"/>',
    },
    face: [50, 48, 40, 26, 19, 57],
    antenna: [50, 28, 'crown'], sideSensors: [24, 76, 52, 'temple'], panel: [50, 70, 24, 'low'],
  }),
  defineChassis('stack', 'Stack', {
    density: 3,
    body: '<rect x="27" y="22" width="46" height="19" rx="8"/><rect x="22" y="40" width="56" height="22" rx="7"/><rect x="27" y="61" width="46" height="19" rx="8"/>',
    secondary: '<path d="M31 40H69M31 62H69"/>',
    facePlate: '<rect x="29" y="43" width="42" height="18" rx="7"/>',
    face: [50, 49, 42, 20, 19, 57],
    antenna: [50, 28, 'split'], sideSensors: [20, 80, 51, 'temple'], panel: [50, 70, 25, 'center'],
  }),
  defineChassis('split-core', 'Split core', {
    density: 2,
    body: '<path d="M20 33Q32 20 47 25V78Q30 82 20 67ZM80 33Q68 20 53 25V78Q70 82 80 67Z"/>',
    secondary: '<path d="M47 31H53V73H47Z"/>',
    facePlate: '<path d="M28 39Q38 32 48 36V63Q38 67 28 60ZM72 39Q62 32 52 36V63Q62 67 72 60Z"/>',
    headCue: {
      kind: 'bridge-link', layer: 'front',
      geometry: '<path d="M40 28H60V34H40Z"/>',
    },
    face: [50, 48, 40, 26, 18, 57],
    antenna: [50, 30, 'split'], sideSensors: [18, 82, 52, 'temple'], panel: [50, 70, 24, 'split'],
  }),
  defineChassis('crossframe', 'Crossframe', {
    density: 1,
    body: '<path d="M41.5 20H58.5L62 23.5V37H76.5L80 40.5V59.5L76.5 63H62V76.5L58.5 80H41.5L38 76.5V63H23.5L20 59.5V40.5L23.5 37H38V23.5Z"/>',
    secondary: '<path d="M41.5 20H58.5L62 23.5V27H38V23.5ZM38 73H62V76.5L58.5 80H41.5L38 76.5ZM20 40.5L23.5 37H27V63H23.5L20 59.5ZM73 37H76.5L80 40.5V59.5L76.5 63H73Z"/>',
    line: '<path d="M42.9 23.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM53.9 23.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM42.9 76.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM53.9 76.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM21.9 44.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM21.9 55.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM74.9 44.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0ZM74.9 55.5a1.6 1.6 0 1 0 3.2 0a1.6 1.6 0 1 0 -3.2 0Z"/>',
    facePlate: '<rect x="33" y="32" width="34" height="34" rx="10"/>',
    face: [50, 48, 36, 27, 17, 57],
    antenna: [50, 28, 'crown'], sideSensors: [19, 81, 50, 'temple'], panel: [50, 72, 18, 'low'],
  }),
  defineChassis('clamshell', 'Clamshell', {
    density: 2,
    body: '<path d="M18 52Q21 25 50 20Q79 25 82 52Q77 79 50 82Q23 79 18 52Z"/>',
    secondary: '<path d="M19 52Q50 42 81 52Q50 62 19 52Z"/>',
    line: '<path d="M21 51H79"/>',
    facePlate: '<path d="M28 40Q50 31 72 40V59Q50 68 28 59Z"/>',
    face: [50, 47, 44, 24, 20, 56],
    antenna: [50, 30, 'crown'], sideSensors: [18, 82, 52, 'temple'], panel: [50, 70, 24, 'low'],
  }),
  defineChassis('gyroscope', 'Gyroscope', {
    density: 3,
    body: '<circle cx="50" cy="51" r="25"/>',
    secondary: '<path fill-rule="evenodd" d="M81.4 40.8A33 21 -18 1 0 18.6 61.2A33 21 -18 1 0 81.4 40.8ZM74.7 43A26 14.5 -18 1 1 25.3 59A26 14.5 -18 1 1 74.7 43Z"/><circle cx="81.4" cy="40.8" r="3.2"/><circle cx="18.6" cy="61.2" r="3.2"/>',
    line: '<path d="M31 36Q50 28 69 36"/>',
    facePlate: '<circle cx="50" cy="50" r="20"/>',
    face: [50, 48, 42, 26, 20, 57],
    antenna: [50, 27, 'crown'], sideSensors: [17, 83, 51, 'wheel'], panel: [50, 69, 16, 'low'],
  }),
  defineChassis('crawler', 'Crawler', {
    density: 3,
    body: '<path d="M24 27H69Q78 31 78 48V67H22V35Q22 29 24 27Z"/>',
    secondary: '<rect x="16" y="62" width="68" height="19" rx="9.5"/><path d="M25 68H75V75H25Z"/>',
    line: '<path d="M29 80Q25 72 29 63M71 80Q75 72 71 63"/>',
    facePlate: '<path d="M29 36H68Q71 38 71 43V57H29Z"/>',
    headCue: {
      kind: 'lidar-dome', layer: 'behind',
      geometry: '<path d="M43 29V24Q43 19 50 19Q57 19 57 24V29Z"/>',
    },
    naturalAntennas: [['none', 2], ['single', 4]],
    face: [50, 46, 42, 22, 20, 55],
    antenna: [55, 33, 'offset-right'], sideSensors: [20, 80, 51, 'low'], panel: [50, 60, 22, 'low'],
  }),
  defineChassis('twin-wheel', 'Twin wheel', {
    density: 3,
    body: '<path d="M28 25H72L76 68H24Z"/>',
    secondary: '<circle cx="24" cy="70" r="12"/><circle cx="76" cy="70" r="12"/>',
    line: '<path d="M18 70H30M70 70H82"/>',
    facePlate: '<path d="M31 36H69L67 59H33Z"/>',
    headCue: {
      kind: 'light-bar', layer: 'behind',
      geometry: '<path d="M36 29V21H64V29H58V26H42V29Z"/>',
    },
    face: [50, 47, 36, 23, 18, 56],
    antenna: [50, 31, 'split'], sideSensors: [22, 78, 49, 'wheel'], panel: [50, 65, 20, 'low'],
  }),
  defineChassis('mono-wheel', 'Mono wheel', {
    density: 2,
    body: '<path d="M27 24Q50 17 73 24L76 62Q50 72 24 62Z"/>',
    secondary: '<circle cx="50" cy="72" r="13"/>',
    line: '<path d="M50 63V81"/>',
    facePlate: '<path d="M31 35Q50 29 69 35L68 58Q50 65 32 58Z"/>',
    headCue: {
      kind: 'arch-handle', layer: 'behind',
      geometry: '<path d="M37 27V23Q37 15 50 15Q63 15 63 23V27H57V23Q57 21 50 21Q43 21 43 23V27Z"/>',
    },
    face: [50, 46, 38, 24, 18, 55],
    antenna: [50, 30, 'crown'], sideSensors: [23, 77, 49, 'temple'], panel: [50, 62, 20, 'low'],
  }),
  defineChassis('walker', 'Walker', {
    density: 3,
    body: '<path d="M27 24H73L76 64H24Z"/>',
    secondary: '<path d="M31 62L25 83H36L43 64ZM69 62L75 83H64L57 64Z"/>',
    line: '<path d="M29 82H38M62 82H71"/>',
    facePlate: '<path d="M31 35H69L68 58H32Z"/>',
    headCue: {
      kind: 'ear-blocks', layer: 'behind',
      geometry: '<path d="M24 35H17V27Q17 23 21 23H28V31ZM76 35H83V27Q83 23 79 23H72V31Z"/>',
    },
    face: [50, 46, 38, 23, 18, 55],
    antenna: [50, 30, 'split'], sideSensors: [22, 78, 49, 'temple'], panel: [50, 63, 20, 'low'],
  }),
  defineChassis('hover-skiff', 'Hover skiff', {
    density: 3,
    body: '<path d="M23 29Q50 20 77 29L73 62Q50 71 27 62Z"/>',
    secondary: '<path d="M16 67Q50 57 84 67L75 78H25Z"/>',
    line: '<path d="M28 77Q50 70 72 77"/>',
    facePlate: '<path d="M30 37Q50 31 70 37L67 58Q50 64 33 58Z"/>',
    headCue: {
      kind: 'navigation-fin', layer: 'behind',
      geometry: '<path d="M43 29L57 15L61 30Z"/>',
    },
    face: [50, 46, 38, 23, 18, 55],
    antenna: [50, 31, 'crown'], sideSensors: [21, 79, 48, 'wing'], panel: [50, 64, 22, 'low'],
  }),
  defineChassis('saucer', 'Saucer', {
    density: 2,
    body: '<path d="M18 52Q26 34 50 31Q74 34 82 52Q74 70 50 73Q26 70 18 52Z"/>',
    secondary: '<path d="M33 38Q50 16 67 38Q61 47 50 48Q39 47 33 38Z"/>',
    facePlate: '<path d="M29 45Q50 37 71 45L68 60Q50 67 32 60Z"/>',
    naturalAntennas: [['loop', 1]],
    face: [50, 49, 40, 20, 20, 57],
    antenna: [50, 27, 'crown'], sideSensors: [17, 83, 53, 'wing'], panel: [50, 66, 23, 'low'],
  }),
  defineChassis('quadcopter', 'Quadcopter', {
    density: 3,
    body: '<path d="M32 31H68L73 67H27Z"/>',
    secondary: '<circle cx="18" cy="31" r="8"/><circle cx="82" cy="31" r="8"/><path d="M25 35L12 31M75 35L88 31"/>',
    line: '<path d="M10 31H26M74 31H90"/>',
    facePlate: '<path d="M34 39H66L68 58H32Z"/>',
    naturalAntennas: [['twin', 1]],
    face: [50, 47, 34, 22, 16, 56],
    antenna: [50, 35, 'split'], sideSensors: [22, 78, 48, 'wing'], panel: [50, 64, 19, 'low'],
  }),
  defineChassis('satellite', 'Satellite', {
    density: 3,
    body: '<rect x="31" y="27" width="38" height="48" rx="12"/>',
    secondary: '<path d="M12 35H29V62H12ZM71 35H88V62H71Z"/>',
    line: '<path d="M17 35V62M83 35V62"/>',
    facePlate: '<rect x="35" y="36" width="30" height="25" rx="8"/>',
    naturalAntennas: [['fork', 1]],
    face: [50, 47, 30, 25, 15, 56],
    antenna: [50, 32, 'crown'], sideSensors: [29, 71, 50, 'wing'], panel: [50, 68, 18, 'low'],
  }),
  defineChassis('rocket', 'Rocket', {
    density: 3,
    body: '<path d="M50 14Q69 30 69 62L62 75H38L31 62Q31 30 50 14Z"/>',
    secondary: '<path d="M32 57L20 72L36 70ZM68 57L80 72L64 70ZM42 74L46 85H54L58 74Z"/>',
    line: '<path d="M50 17V31"/>',
    facePlate: '<path d="M50 30Q64 34 64 49Q62 61 50 65Q38 61 36 49Q36 34 50 30Z"/>',
    face: [50, 46, 28, 26, 14, 55],
    antenna: [50, 31, 'crown'], sideSensors: [30, 70, 51, 'wing'], panel: [50, 67, 16, 'low'],
  }),
  defineChassis('submarine', 'Submarine', {
    density: 3,
    body: '<path d="M16 50Q19 31 47 27H68Q82 32 84 50Q82 69 65 74H39Q19 69 16 50Z"/>',
    secondary: '<path d="M46 27V20H63V29M20 44L12 38V62L20 57Z"/>',
    line: '<path d="M61 21V15H69"/>',
    facePlate: '<path d="M29 39Q50 31 72 40V59Q50 67 29 59Z"/>',
    naturalAntennas: [['none', 2], ['single', 4]],
    face: [50, 48, 43, 23, 20, 57],
    antenna: [61, 32, 'offset-right'], sideSensors: [18, 82, 51, 'low'], panel: [56, 67, 20, 'side'],
  }),
  defineChassis('gantry', 'Gantry', {
    density: 3,
    body: '<path data-bots-construction-cue="gantry-frame" d="M18 20H82V80H69V35H31V80H18Z"/>',
    secondary: '<path d="M29 29H71V59H64V38H36V59H29Z"/>',
    line: '<path d="M22 26H78M22 75H31M69 75H78"/>',
    facePlate: '<rect x="31" y="32" width="38" height="25" rx="6"/>',
    face: [50, 43, 38, 25, 18, 52],
    antenna: [50, 27, 'split'], sideSensors: [25, 75, 48, 'temple'], panel: [50, 61, 18, 'low'],
  }),
  defineChassis('forklift', 'Forklift', {
    density: 3,
    body: '<path d="M19 31H57Q64 34 66 45V68H19Z"/>',
    secondary: '<path data-bots-construction-cue="forklift-mast-forks" d="M67 18H77V68H89V74H66ZM74 57H87V63H74ZM18 65H31V78H18Z"/>',
    line: '<path d="M72 24V56M77 30H85M77 40H85"/>',
    facePlate: '<path d="M24 39H60Q63 41 63 47V59H24Z"/>',
    face: [43, 47, 38, 23, 18, 56],
    antenna: [43, 34, 'offset-left'], sideSensors: [17, 66, 50, 'low'], panel: [45, 65, 20, 'side'],
  }),
  defineChassis('excavator', 'Excavator', {
    density: 3,
    body: '<path d="M22 30H50Q58 32 58 41V66H18V39Q18 31 22 30Z"/>',
    secondary: '<path data-bots-construction-cue="excavator-boom-bucket" d="M22 64H68Q76 64 76 72.5Q76 81 68 81H22Q14 81 14 72.5Q14 64 22 64ZM53 36L72 17L79 23L60 43ZM73 18L80 22L89 49L82 54ZM83 48L94 52L93 62L86 68L78 61L80 51ZM51 41a5 5 0 1 0 10 0a5 5 0 1 0 -10 0ZM72 20a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z"/>',
    line: '<path d="M20.5 72.5a4 4 0 1 0 8 0a4 4 0 1 0 -8 0ZM34.5 72.5a4 4 0 1 0 8 0a4 4 0 1 0 -8 0ZM48.5 72.5a4 4 0 1 0 8 0a4 4 0 1 0 -8 0ZM62.5 72.5a4 4 0 1 0 8 0a4 4 0 1 0 -8 0ZM58 38L74 22M78 27L85 48M81 60L87 65"/>',
    facePlate: '<path d="M23 38H51Q55 40 55 45V57H23Z"/>',
    face: [39, 46, 32, 20, 15, 53],
    antenna: [40, 35, 'offset-left'], sideSensors: [17, 68, 50, 'low'], panel: [45, 60, 18, 'side'],
  }),
  defineChassis('crane', 'Crane', {
    density: 3,
    body: '<path d="M18 34H58L62 76H16Z"/>',
    secondary: '<path data-bots-construction-cue="crane-jib-hook" d="M57 17H67V80H56ZM62 22H86V29H67ZM81 27H85V52H81ZM77 50Q84 61 92 51Q91 65 84 68Q77 64 77 50Z"/>',
    line: '<path d="M62 28L82 21M60 36L71 24"/>',
    facePlate: '<path d="M21 40H55L58 60H18Z"/>',
    face: [39, 49, 36, 22, 17, 58],
    antenna: [39, 36, 'offset-left'], sideSensors: [17, 64, 51, 'low'], panel: [45, 68, 19, 'side'],
  }),
  defineChassis('loader', 'Loader', {
    density: 3,
    body: '<path d="M29 27H70Q76 35 77 50V67H24Z"/><circle cx="34" cy="74" r="8"/><circle cx="68" cy="74" r="8"/>',
    secondary: '<path data-bots-construction-cue="loader-scoop-wheels" d="M31 55L14 57L8 67Q14 80 36 78L45 66Z"/><path d="M25 65H78V71H25Z"/>',
    line: '<path d="M13 65Q22 72 37 69M36 74H66"/>',
    facePlate: '<path d="M34 36H69Q73 40 73 47V58H31Z"/>',
    face: [50, 47, 38, 22, 18, 56],
    antenna: [50, 34, 'offset-left'], sideSensors: [24, 78, 50, 'low'], panel: [50, 64, 20, 'side'],
  }),
  defineChassis('boiler', 'Boiler', {
    density: 3,
    body: '<path d="M29 24Q50 17 71 24V75Q50 83 29 75Z"/>',
    secondary: '<path d="M33 22V14H44V21M29 66H71V76H29Z"/>',
    line: '<path d="M36 74V81M64 74V81"/>',
    facePlate: '<path d="M34 35Q50 30 66 35V59Q50 65 34 59Z"/>',
    face: [50, 46, 32, 24, 16, 55],
    antenna: [55, 31, 'offset-right'], sideSensors: [27, 73, 49, 'temple'], panel: [50, 67, 20, 'low'],
  }),
  defineChassis('piston', 'Piston', {
    density: 3,
    body: '<rect x="28" y="27" width="44" height="48" rx="8"/>',
    secondary: '<path d="M36 27V17H64V27ZM36 75V84H64V75Z"/>',
    line: '<path d="M42 18V26M58 18V26M42 76V83M58 76V83"/>',
    facePlate: '<rect x="34" y="37" width="32" height="24" rx="6"/>',
    face: [50, 47, 32, 24, 16, 56],
    antenna: [50, 32, 'split'], sideSensors: [26, 74, 50, 'temple'], panel: [50, 67, 20, 'low'],
  }),
  defineChassis('turbine', 'Turbine', {
    density: 3,
    body: '<circle cx="50" cy="51" r="31"/>',
    secondary: '<path d="M50 21L57 42L78 34L62 51L79 63L57 60L50 81L43 60L21 63L38 51L22 34L43 42Z"/>',
    line: '<circle cx="50" cy="51" r="20"/>',
    facePlate: '<circle cx="50" cy="50" r="17"/>',
    face: [50, 47, 32, 24, 15, 56],
    antenna: [50, 28, 'crown'], sideSensors: [19, 81, 51, 'wheel'], panel: [50, 70, 16, 'low'],
  }),
  defineChassis('magnet', 'Magnet', {
    density: 2,
    body: '<path d="M24 23H38V55Q38 67 50 67Q62 67 62 55V23H76V58Q76 81 50 81Q24 81 24 58Z"/>',
    secondary: '<path d="M24 23H38V37H24ZM62 23H76V37H62Z"/>',
    facePlate: '<path d="M32 39H68V58Q65 71 50 73Q35 71 32 58Z"/>',
    face: [50, 49, 36, 25, 17, 58],
    antenna: [50, 34, 'split'], sideSensors: [23, 77, 51, 'temple'], panel: [50, 72, 18, 'low'],
  }),
  defineChassis('lantern', 'Lantern', {
    density: 3,
    body: '<path d="M30 30H70L75 74H25Z"/>',
    secondary: '<path d="M36 30Q37 15 50 15Q63 15 64 30H58Q58 22 50 22Q42 22 42 30ZM28 68H72V78H28Z"/>',
    line: '<path d="M34 36L29 67M66 36L71 67"/>',
    facePlate: '<path d="M35 39H65L69 60H31Z"/>',
    face: [50, 48, 34, 23, 16, 57],
    antenna: [50, 35, 'split'], sideSensors: [25, 75, 51, 'temple'], panel: [50, 68, 18, 'low'],
  }),
  defineChassis('beetle', 'Beetle', {
    density: 2,
    body: '<path d="M50 20Q74 22 79 51Q75 80 50 82Q25 80 21 51Q26 22 50 20Z"/>',
    secondary: '<path d="M50 21V81M24 43Q50 50 76 43"/>',
    line: '<path d="M37 25Q28 18 24 25M63 25Q72 18 76 25"/>',
    facePlate: '<path d="M30 38Q50 30 70 38V58Q50 67 30 58Z"/>',
    face: [50, 47, 40, 24, 19, 56],
    antenna: [50, 31, 'split'], sideSensors: [20, 80, 51, 'wing'], panel: [50, 70, 22, 'low'],
  }),
  defineChassis('crab', 'Crab', {
    density: 3,
    body: '<path d="M24 33Q50 18 76 33L72 68Q50 80 28 68Z"/>',
    secondary: '<path d="M25 48L12 39L9 48L20 57ZM75 48L88 39L91 48L80 57Z"/>',
    line: '<path d="M28 64L17 75M38 70L31 82M72 64L83 75M62 70L69 82"/>',
    facePlate: '<path d="M30 39Q50 30 70 39L67 59Q50 67 33 59Z"/>',
    face: [50, 47, 38, 23, 18, 56],
    antenna: [50, 31, 'split'], sideSensors: [20, 80, 50, 'wing'], panel: [50, 66, 20, 'low'],
  }),
  defineChassis('spider', 'Spider', {
    density: 3,
    body: '<ellipse cx="50" cy="59" rx="19" ry="21"/><ellipse cx="50" cy="36" rx="16" ry="15"/>',
    secondary: '<path d="M39 39Q50 45 61 39L60 52H40Z"/>',
    line: '<path d="M37 43L24 34L16 26M33 51L19 48L10 41M34 59L20 67L14 76M40 67L33 81M63 43L76 34L84 26M67 51L81 48L90 41M66 59L80 67L86 76M60 67L67 81"/>',
    facePlate: '<path d="M36 33Q50 27 64 33L62 51Q50 57 38 51Z"/>',
    face: [50, 43, 28, 22, 14, 51],
    antenna: [50, 29, 'crown'], sideSensors: [31, 69, 48, 'temple'], panel: [50, 63, 18, 'low'],
  }),
  defineChassis('jelly', 'Jelly', {
    density: 3,
    body: '<path d="M22 53Q23 20 50 18Q77 20 78 53L72 67H28Z"/>',
    secondary: '<path d="M30 65V82Q36 76 42 82V66Q48 76 54 82V66Q61 77 68 82V65Z"/>',
    line: '<path d="M28 57Q50 64 72 57"/>',
    facePlate: '<path d="M30 36Q50 27 70 36V58Q50 66 30 58Z"/>',
    face: [50, 46, 40, 24, 19, 55],
    antenna: [50, 28, 'crown'], sideSensors: [21, 79, 50, 'wing'], panel: [50, 65, 20, 'low'],
  }),
  defineChassis('manta', 'Manta', {
    density: 2,
    body: '<path d="M9 48Q29 20 50 31Q71 20 91 48L72 70L56 64L50 82L44 64L28 70Z"/>',
    secondary: '<path d="M30 38Q50 29 70 38L64 60H36Z"/>',
    line: '<path d="M14 48Q31 45 40 57M86 48Q69 45 60 57"/>',
    facePlate: '<path d="M33 40Q50 32 67 40L63 59H37Z"/>',
    face: [50, 46, 34, 22, 16, 55],
    antenna: [50, 35, 'split'], sideSensors: [19, 81, 49, 'wing'], panel: [50, 64, 18, 'low'],
  }),
  defineChassis('snail', 'Snail', {
    density: 3,
    body: '<path d="M23 51Q24 24 50 22Q71 23 76 43V69H31Q19 66 23 51Z"/>',
    secondary: '<circle cx="52" cy="48" r="18"/><path d="M27 64H82Q86 66 82 72H27Z"/>',
    line: '<path d="M52 36Q64 37 64 49Q63 60 52 60Q42 59 42 50Q43 42 51 42"/>',
    facePlate: '<path d="M28 38Q40 31 50 37V59Q40 65 28 58Z"/>',
    naturalAntennas: [['twin', 1]],
    face: [39, 47, 24, 23, 12, 56],
    antenna: [34, 34, 'offset-left'], sideSensors: [21, 78, 51, 'low'], panel: [55, 67, 20, 'side'],
  }),
  defineChassis('starframe', 'Starframe', {
    density: 1,
    body: '<path d="M50 11L60 34L85 29L68 50L85 70L60 66L50 89L40 66L15 70L32 50L15 29L40 34Z"/>',
    facePlate: '<path d="M50 29L63 39L62 59L50 69L38 59L37 39Z"/>',
    face: [50, 47, 26, 26, 13, 56],
    antenna: [50, 29, 'crown'], sideSensors: [20, 80, 50, 'wing'], panel: [50, 70, 16, 'low'],
  }),
  defineChassis('backpack', 'Backpack', {
    density: 3,
    body: '<rect x="25" y="24" width="50" height="57" rx="14"/>',
    secondary: '<path d="M25 39H18V68H25ZM75 39H82V68H75ZM34 24V17H66V24Z"/>',
    line: '<path d="M32 74H68"/>',
    facePlate: '<rect x="32" y="36" width="36" height="25" rx="9"/>',
    face: [50, 47, 36, 25, 17, 56],
    antenna: [50, 31, 'split'], sideSensors: [18, 82, 52, 'temple'], panel: [50, 70, 22, 'center'],
  }),
  defineChassis('buoy', 'Buoy', {
    density: 3,
    body: '<path d="M34 27H66L73 72L64 82H36L27 72Z"/>',
    secondary: '<path d="M34 27L42 16H58L66 27ZM29 60H71L73 71H27Z"/>',
    line: '<path d="M40 17L35 10M60 17L65 10"/>',
    facePlate: '<path d="M35 36H65L68 58H32Z"/>',
    naturalAntennas: [['twin', 3], ['fork', 1]],
    face: [50, 47, 34, 23, 16, 56],
    antenna: [50, 34, 'split'], sideSensors: [27, 73, 50, 'temple'], panel: [50, 68, 18, 'low'],
  }),
  defineChassis('cloud-cluster', 'Cloud cluster', {
    density: 3,
    body: '<circle cx="34" cy="46" r="17"/><circle cx="50" cy="34" r="20"/><circle cx="68" cy="47" r="18"/><path d="M22 47Q18 68 34 76H69Q84 68 80 49Z"/>',
    secondary: '<path d="M29 65Q50 75 72 64Q67 80 50 82Q34 79 29 65Z"/>',
    line: '<path d="M29 44Q36 31 47 30M55 29Q67 31 73 43"/>',
    facePlate: '<path d="M29 43Q50 32 71 43L68 62Q50 70 32 62Z"/>',
    naturalAntennas: [['none', 2], ['fork', 3], ['loop', 1]],
    face: [50, 49, 40, 24, 19, 58],
    antenna: [50, 30, 'crown'], sideSensors: [20, 80, 52, 'wing'], panel: [50, 70, 21, 'low'],
  }),
] as const);

type DefinitionIds<Definitions extends readonly ChassisDefinition[]> = {
  readonly [Index in keyof Definitions]: Definitions[Index] extends ChassisDefinition<infer Id>
    ? Id
    : never;
};

function definitionIds<const Definitions extends readonly ChassisDefinition[]>(
  definitions: Definitions,
): DefinitionIds<Definitions> {
  return Object.freeze(definitions.map(({ id }) => id)) as DefinitionIds<Definitions>;
}

export const chassisNames = definitionIds(chassisDefinitions);
export type Chassis = typeof chassisNames[number];

const definitionsById = new Map<Chassis, ChassisDefinition<Chassis>>(
  chassisDefinitions.map((definition) => [definition.id, definition]),
);

export const chassisWeights = Object.freeze(
  chassisDefinitions.map(({ id, weight }) => Object.freeze([id, weight] as const)),
);

export function getChassisDefinition(chassis: Chassis): ChassisDefinition<Chassis> {
  return definitionsById.get(chassis)!;
}
