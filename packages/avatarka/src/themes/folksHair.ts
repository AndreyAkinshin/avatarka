/**
 * The Folks hair catalog is intentionally data-first. The ordered registry is
 * the single source for the public schema, randomizer, drawing layers, and the
 * catalog-review UI. Geometry lives here without pigment choices so changing
 * hair, skin, palette, or frame colors can never move a strand.
 */

export type HairLayerName = 'lower' | 'back' | 'front' | 'overlay';
export type EarAnchor = 'revealed' | 'under-hair';
export type LowerHairAnchor = 'behind-neck' | 'over-neck';
export type HeadbandLayer = 'before-front' | 'over-front';
/**
 * How the shared scalp underlay renders for a style. The face is painted over
 * the back layer, so without this cap only the front fringe would ever appear
 * on the head itself and the side scalp would read as bare skin. `none` is
 * for styles whose identity is a bare scalp.
 */
export type ScalpCoverage = 'full' | 'none';

export interface HairLayerGeometry {
  /** Filled shapes inheriting the selected hair base and tonal edge. */
  readonly silhouette?: string;
  /** Filled tonal shapes inheriting the selected hair shade. */
  readonly shade?: string;
  /** Unfilled construction lines inheriting the selected hair shade. */
  readonly line?: string;
  /** Center-lines for substantial braids, twists, and locs. */
  readonly strands?: string;
  /** Geometry width of the substantial strands above. */
  readonly strandWidth?: number;
}

export interface HairAnchors {
  /** Approximate visible hairline used by fit/accessory invariants. */
  readonly hairlineY: number;
  /** Whether the back mass sits over the ears or leaves them readable. */
  readonly ears: EarAnchor;
  /** Which side of the neck receives shoulder-length hair. */
  readonly lowerHair: LowerHairAnchor;
  /** Style-aware band curve and its relationship to the fringe. */
  readonly headband: {
    readonly d: string;
    readonly layer: HeadbandLayer;
  };
  /** Safe earring offsets relative to the generated ear centers. */
  readonly studs: {
    readonly leftX: number;
    readonly rightX: number;
    readonly y: number;
  };
}

export interface HairDefinition<Id extends string = string> {
  readonly id: Id;
  readonly weight: number;
  readonly geometry: Readonly<Record<HairLayerName, HairLayerGeometry>>;
  readonly anchors: HairAnchors;
  readonly scalp: ScalpCoverage;
}

const emptyLayer: HairLayerGeometry = Object.freeze({});

function layer(
  silhouette = '',
  shade = '',
  line = '',
  strands = '',
  strandWidth = 4.5,
): HairLayerGeometry {
  return Object.freeze({ silhouette, shade, line, strands, strandWidth });
}

function strandLayer(
  strands: string,
  strandWidth: number,
  silhouette = '',
  line = '',
): HairLayerGeometry {
  return layer(silhouette, '', line, strands, strandWidth);
}

const bandCurves = {
  low: 'M29 31Q50 19 71 31',
  medium: 'M28 34Q50 19 72 34',
  high: 'M29 29Q50 17 71 29',
  wide: 'M26 36Q50 18 74 36',
  crown: 'M27 32Q50 15 73 32',
  'flat-low': 'M31 35Q50 30 69 35',
} as const;

/**
 * Shared scalp cap drawn between the face and the fringe. The outer edge hugs
 * every head outline with a little natural volume; the inner edge stays just
 * above every style's fringe so each silhouette keeps its own hairline while
 * the cap quietly covers the side scalp down to the ears. It never reaches the
 * ears themselves, keeping revealed-ear styles readable.
 */
const scalpCapPath = 'M24 44.5'
  + 'C22.8 37 22.8 29 25 22.5'
  + 'C27.5 16.5 33 13.8 41 12.8'
  + 'C45.5 12.3 54.5 12.3 59 12.8'
  + 'C67 13.8 72.5 16.5 75 22.5'
  + 'C77.2 29 77.2 37 76 44.5'
  + 'L67 44L64 28L62 23L50 21.3L44 21.6L38 23L36 28L33 44Z';

/**
 * Center-parted fringes are two mirrored panels whose meeting wedge would
 * otherwise leave a vertical skin strip down the scalp. A small shared panel
 * fills the junction seamlessly so a parting only ever reads as drawn hair.
 */
function centerPartPanel(top: number, bottom: number): string {
  return `<path d="M47.3 ${top}H52.7L51.5 ${bottom}H48.5Z" stroke="none"/>`;
}

interface DefinitionOptions {
  readonly lower?: HairLayerGeometry;
  readonly back?: HairLayerGeometry;
  readonly front?: HairLayerGeometry;
  readonly overlay?: HairLayerGeometry;
  readonly hairlineY?: number;
  readonly ears?: EarAnchor;
  readonly lowerHair?: LowerHairAnchor;
  readonly headband?: keyof typeof bandCurves;
  readonly headbandLayer?: HeadbandLayer;
  readonly studs?: HairAnchors['studs'];
  readonly scalp?: ScalpCoverage;
}

function defineHair<const Id extends string>(
  id: Id,
  weight: number,
  options: DefinitionOptions,
): HairDefinition<Id> {
  const geometry = Object.freeze({
    lower: options.lower ?? emptyLayer,
    back: options.back ?? emptyLayer,
    front: options.front ?? emptyLayer,
    overlay: options.overlay ?? emptyLayer,
  });
  const anchors = Object.freeze({
    hairlineY: options.hairlineY ?? 31,
    ears: options.ears ?? 'revealed',
    lowerHair: options.lowerHair ?? 'behind-neck',
    headband: Object.freeze({
      d: bandCurves[options.headband ?? 'low'],
      layer: options.headbandLayer ?? 'before-front',
    }),
    studs: Object.freeze(options.studs ?? { leftX: -1, rightX: 1, y: 4 }),
  });
  const scalp = options.scalp ?? 'full';
  return Object.freeze({ id, weight, geometry, anchors, scalp });
}

/**
 * Canonical v4 order. Existing seven IDs retain their original visual sense;
 * the added styles deliberately use different silhouettes and construction
 * marks instead of recoloring a small set of templates.
 */
export const hairDefinitions = Object.freeze([
  defineHair('crop', 4, {
    hairlineY: 29,
    front: layer(
      '<path d="M27 39Q26 21 45 17Q65 13 73 32Q65 31 58 26Q51 32 44 27Q37 35 27 39Z"/>',
      '<path d="M27 37Q35 33 44 27Q50 31 58 26Q64 30 71 31Q61 20 47 20Q34 22 27 37Z" opacity=".16"/>',
      '<path d="M34 24L31 31M43 20L40 28M53 19L51 27M63 22L61 29"/>',
    ),
  }),
  defineHair('long-straight', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    lower: layer(
      '<path d="M21 81Q18 51 23 31Q28 13 49 12Q72 13 78 32Q83 53 79 84L66 82L64 49H36L34 82Z"/>',
      '<path d="M22 75Q27 57 27 34L34 29L34 80ZM78 76Q73 58 73 33L66 28L66 81Z" opacity=".22"/>',
      '<path d="M29 31Q25 55 28 77M70 30Q76 53 72 79"/>',
    ),
    front: layer(
      '<path d="M24 42Q24 20 46 14Q69 12 76 38Q66 34 55 24Q51 29 48 34Q42 25 38 24Q34 36 24 42Z"/>',
      '',
      '<path d="M50 18Q49 25 48 34M56 23Q65 33 73 36"/>',
    ),
  }),
  defineHair('space-buns', 3, {
    hairlineY: 31,
    headband: 'medium',
    back: layer(
      '<circle cx="26" cy="22" r="8"/><circle cx="74" cy="22" r="8"/><path d="M26 43Q24 21 37 14Q50 7 63 14Q76 21 74 43L67 35H33Z"/>',
      '<circle cx="23.5" cy="19.5" r="3" opacity=".18"/><circle cx="71.5" cy="19.5" r="3" opacity=".18"/>',
      '<path d="M20 23Q26 15 32 23M68 23Q74 15 80 23"/>',
    ),
    front: layer(
      '<path d="M27 39Q29 21 48 18L50 34Q42 26 38 27Q35 36 27 39ZM73 39Q71 21 52 18L50 34Q58 26 62 27Q65 36 73 39Z"/>'
        + centerPartPanel(18, 34.5),
      '',
      '<path d="M50 18V34"/>',
    ),
  }),
  defineHair('sweep', 5, {
    hairlineY: 30,
    front: layer(
      '<path d="M25 42Q25 20 45 15Q68 10 75 34Q65 36 55 29Q47 23 44 22Q39 35 25 42Z"/>',
      '<path d="M27 37Q33 22 46 18Q59 15 71 30Q56 27 45 21Q38 34 27 37Z" opacity=".14"/>',
      '<path d="M44 20Q52 29 70 32M36 25Q34 33 27 37"/>',
    ),
  }),
  defineHair('beehive', 2, {
    hairlineY: 31,
    headband: 'crown',
    back: layer(
      '<path d="M27 41Q23 25 32 15Q35 4 50 5Q65 4 68 15Q77 25 73 41L66 34H34Z"/>',
      '<path d="M35 16Q36 8 50 8Q64 8 65 16Q56 13 50 14Q44 13 35 16Z" opacity=".2"/>',
      '<path d="M34 20Q50 12 66 20M31 27Q50 19 69 27"/>',
    ),
    front: layer('<path d="M27 40Q28 24 43 20Q58 16 73 35Q61 34 52 27Q45 36 27 40Z"/><path d="M27 39Q25.5 44 29 47.5Q31.5 42 32 37Z"/><path d="M73 34Q74.5 40 71 47Q68.5 41 68 35Z"/>'),
  }),
  defineHair('side-braid', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    back: layer('<path d="M25 45Q23 23 41 16Q62 9 75 31L70 50L62 35H34Z"/>'),
    front: layer(
      '<path d="M26 40Q27 20 48 15Q68 13 74 33L72 40Q60 36 46 25Q40 36 26 40Z"/>',
      '',
      '<path d="M43 21Q55 30 71 31"/>',
    ),
    overlay: layer(
      '<path d="M69 35Q80 42 73 51Q82 57 74 64Q81 72 72 78Q68 82 70 86Q62 82 66 75Q59 68 67 62Q59 55 67 49Q60 42 69 35Z"/>',
      '<path d="M68 47L75 52L67 59L75 65L67 72L73 77L69 82" opacity=".22"/>',
      '<path d="M67 45L75 51M66 57L75 63M66 69L74 75"/>',
    ),
    studs: { leftX: -1, rightX: 2.5, y: 4 },
  }),
  defineHair('cloud', 3, {
    hairlineY: 33,
    ears: 'under-hair',
    headband: 'wide',
    back: layer(
      '<path d="M24 70Q19 61 24 53Q18 43 25 35Q22 23 34 20Q39 10 50 15Q61 10 66 20Q78 23 75 35Q82 43 76 53Q81 62 74 71L65 63H35Z"/>',
      '<circle cx="32" cy="30" r="6" opacity=".14"/><circle cx="66" cy="29" r="7" opacity=".14"/><circle cx="28" cy="52" r="5" opacity=".14"/>',
      '<path d="M25 40Q31 34 37 38M59 25Q66 20 71 27M64 55Q72 51 76 57"/>',
    ),
    front: layer('<path d="M27 39Q25 24 37 20Q48 12 61 19Q75 22 74 39Q65 33 58 27Q49 36 39 28Q34 36 27 39Z"/>'),
  }),
  defineHair('slick-back', 3, {
    hairlineY: 27,
    headband: 'high',
    back: layer(
      '<path d="M28 39Q27 19 50 15Q72 19 72 39Q65 31 50 29Q35 31 28 39Z"/><ellipse cx="50" cy="20" rx="5" ry="4"/>',
      '',
      '<path d="M31 31Q42 19 50 18M69 31Q58 19 50 18"/>',
    ),
    front: layer(
      '<path d="M28 44Q26 21 50 15Q74 21 72 44Q67 35 59 30Q54 27 50 26Q46 27 41 30Q33 35 28 44Z"/>',
      '<path d="M31 37Q40 27 50 26Q60 27 69 37L67 40Q59 31 50 30Q41 31 33 40Z" opacity=".2"/>',
      '<path d="M34 38Q39 26 48 20M43 32Q47 24 52 19M57 32Q53 24 48 19M66 38Q61 26 52 20"/>',
    ),
  }),
  defineHair('high-ponytail', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    headband: 'high',
    back: layer(
      '<path d="M28 43Q25 21 44 16Q67 10 74 34L68 45H34Z"/><path d="M67 17Q80 12 84 24Q87 38 76 50Q78 35 70 29Z"/>',
      '<path d="M72 20Q80 21 80 31Q80 40 75 46Q78 28 72 20Z" opacity=".22"/>',
      '<path d="M72 19Q82 25 77 43"/>',
    ),
    front: layer('<path d="M27 39Q30 20 49 16Q68 17 73 35Q59 30 48 24Q40 34 27 39Z"/>'),
  }),
  defineHair('bald', 2, {
    hairlineY: 22,
    headband: 'high',
    scalp: 'none',
  }),
  defineHair('pixie', 3, {
    hairlineY: 29,
    front: layer(
      '<path d="M27 39Q25 24 37 18L39 24L46 15L50 23L58 14L61 23L70 19L68 28L75 30Q69 36 58 32Q48 28 42 25Q37 36 27 39Z"/>',
      '',
      '<path d="M36 22L33 32M47 19L44 28M59 18L56 28M68 23L63 30"/>',
    ),
  }),
  defineHair('box-braids', 3, {
    hairlineY: 31,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    back: layer('<path d="M25 44Q23 22 40 16Q59 10 75 31L72 51H28Z"/>'),
    front: layer(
      '<path d="M27 39Q28 22 48 17L50 34Q43 27 37 27Q35 35 27 39ZM73 39Q72 22 52 17L50 34Q58 27 63 27Q66 35 73 39Z"/>'
        + centerPartPanel(17, 34.5),
      '',
      '<path d="M50 17V34"/>',
    ),
    overlay: strandLayer(
      '<path d="M29 36Q24 53 28 80M35 34Q31 56 35 84M65 34Q69 56 65 84M71 36Q76 53 72 80"/>',
      4.6,
      '<circle cx="28" cy="80" r="2.5"/><circle cx="35" cy="84" r="2.5"/><circle cx="65" cy="84" r="2.5"/><circle cx="72" cy="80" r="2.5"/>',
      '<path d="M26 45L31 50M25 57L30 62M27 69L31 74M33 45L38 50M32 58L37 63M33 71L38 76M67 45L62 50M68 58L63 63M67 71L62 76M74 45L69 50M75 57L70 62M73 69L69 74"/>',
    ),
    studs: { leftX: -2.5, rightX: 2.5, y: 4 },
  }),
  defineHair('pompadour', 3, {
    hairlineY: 30,
    headband: 'crown',
    back: layer('<path d="M28 42Q25 25 37 19Q42 8 56 9Q72 10 74 30L71 42H29Z"/>'),
    front: layer(
      '<path d="M27 39Q28 25 39 21Q41 8 55 9Q70 10 72 27Q63 22 55 25Q48 29 43 24Q38 36 27 39Z"/>',
      '<path d="M41 20Q44 11 55 12Q65 13 68 22Q57 19 50 25Z" opacity=".18"/>',
      '<path d="M42 20Q49 26 57 22Q64 19 69 24"/>',
    ),
  }),
  defineHair('bob', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    headband: 'medium',
    lower: layer(
      '<path d="M23 68Q20 42 26 27Q34 12 50 13Q67 12 75 28Q81 45 76 69L67 67L65 45H35L33 68Z"/>',
      '<path d="M24 62Q30 65 34 58V68L24 68ZM76 62Q70 65 66 58V68L76 69Z" opacity=".22"/>',
      '<path d="M29 32Q25 49 29 64M71 32Q75 49 71 64"/>',
    ),
    front: layer('<path d="M25 41Q25 21 47 15Q69 14 75 38Q63 32 54 24Q50 33 45 30Q38 38 25 41Z"/>'),
  }),
  defineHair('bantu-knots', 2, {
    hairlineY: 31,
    headband: 'crown',
    back: layer(
      '<path d="M28 40Q27 22 50 17Q73 22 72 40L67 34H33Z"/><circle cx="31" cy="21" r="6"/><circle cx="43" cy="13" r="6"/><circle cx="57" cy="13" r="6"/><circle cx="69" cy="21" r="6"/>',
      '<circle cx="29.5" cy="19.5" r="2" opacity=".25"/><circle cx="41.5" cy="11.5" r="2" opacity=".25"/><circle cx="55.5" cy="11.5" r="2" opacity=".25"/><circle cx="67.5" cy="19.5" r="2" opacity=".25"/>',
      '<path d="M28 22Q31 17 35 21M40 14Q43 9 47 13M54 13Q57 9 61 14M66 21Q69 17 72 22M35 28L42 21M50 25V19M65 28L58 21"/>',
    ),
    front: layer('<path d="M28 38Q31 23 48 19L50 33Q42 27 37 28Q35 35 28 38ZM72 38Q69 23 52 19L50 33Q58 27 63 28Q65 35 72 38Z"/>' + centerPartPanel(19, 33.5)),
  }),
  defineHair('wave', 4, {
    hairlineY: 30,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    lower: layer(
      '<path d="M24 79Q19 59 23 38Q24 15 49 12Q74 13 78 37Q82 58 75 80Q69 75 66 60H35Q32 74 24 79Z"/>',
      '',
      '<path d="M27 75Q22 53 29 31M72 34Q78 52 73 70"/>',
    ),
    front: layer(
      '<path d="M26 43Q25 20 46 15Q68 11 75 34Q66 32 58 24Q54 34 45 28Q39 40 26 43Z"/>',
      '',
      '<path d="M58 23Q52 34 43 30Q38 37 31 39"/>',
    ),
  }),
  defineHair('undercut', 3, {
    hairlineY: 29,
    front: layer(
      '<path d="M27 44Q26 24 38 19Q47 8 67 14Q75 17 76 30L74 42Q68 33 60 30Q53 23 47 26Q43 30 39 27Q34 36 27 44Z"/>',
      '<path d="M31 36Q37 24 49 18Q61 14 71 21Q59 19 49 24Q41 30 35 40Z" opacity=".25"/>',
      '<path d="M33 37Q38 27 46 22M50 17Q56 22 64 25M69 28Q72 32 73 37M29 42Q27 32 33 25M71 42Q73 32 67 25"/>',
    ),
  }),
  defineHair('ringlets', 3, {
    hairlineY: 32,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'wide',
    lower: layer(
      '<path d="M21 76Q18 49 25 31Q33 14 50 15Q68 14 76 32Q83 52 78 77L67 78L64 53H36L33 78Z"/><circle cx="25" cy="68" r="7"/><circle cx="34" cy="77" r="7"/><circle cx="75" cy="68" r="7"/><circle cx="66" cy="77" r="7"/>',
      '',
      '<path d="M26 42Q19 50 28 55Q36 60 27 67Q20 73 28 78M74 42Q81 50 72 55Q64 60 73 67Q80 73 72 78"/>',
    ),
    front: layer('<path d="M26 40Q27 22 40 18Q51 10 62 18Q75 22 74 40Q65 34 59 27Q51 35 43 27Q36 36 26 40Z"/>'),
  }),
  defineHair('half-up-bun', 3, {
    hairlineY: 30,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    lower: layer('<path d="M23 80Q19 49 25 30Q33 14 50 14Q68 14 75 31Q81 53 77 81L66 79L64 49H36L34 80Z"/>', '', '<path d="M29 31Q24 52 28 76M71 31Q76 52 72 76"/>'),
    back: layer('<path d="M35 20Q34 5 46 3.5H54Q66 5 65 20Q58 13 50 12.5Q42 13 35 20Z"/><circle cx="50" cy="12" r="9"/>', '<path d="M44 10Q50 4 56 10Q50 9 44 10Z" opacity=".2"/>', '<path d="M43 13Q50 7 57 13"/>'),
    front: layer('<path d="M26 40Q28 21 48 16L50 33Q43 26 38 27Q35 36 26 40ZM74 40Q72 21 52 16L50 33Q57 26 62 27Q65 36 74 40Z"/>' + centerPartPanel(16, 33.5), '', '<path d="M50 16V33"/>'),
  }),
  defineHair('flipped-ends', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    headband: 'medium',
    lower: layer(
      '<path d="M23 67Q20 41 27 26Q36 13 50 14Q65 13 73 27Q80 44 76 66Q83 68 85 75Q76 72 68 67L65 48H35L32 67Q24 72 15 75Q18 69 23 67Z"/>',
      '<path d="M20 70Q27 69 32 63L31 70L20 74ZM80 70Q73 69 68 63L69 70L80 74Z" opacity=".24"/>',
      '<path d="M29 31Q25 48 29 65Q23 70 18 71M71 31Q75 48 71 65Q77 70 82 71"/>',
    ),
    front: layer('<path d="M25 40Q26 21 47 15Q69 14 75 37Q62 32 54 24Q49 33 44 29Q37 37 25 40Z"/>'),
  }),
  defineHair('shaved', 3, {
    hairlineY: 30,
    headband: 'high',
    front: layer(
      '<path d="M28 37Q29 18 50 16Q71 18 72 37Q62 31 50 30Q38 31 28 37Z"/>',
      '',
      '<path d="M34 27L35 29M41 22L42 24M49 20L50 22M58 22L59 24M65 27L66 29"/>',
    ),
  }),
  defineHair('twin-braids', 3, {
    hairlineY: 30,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    back: layer('<path d="M25 44Q24 22 42 16Q60 11 75 31L72 47H28Z"/>'),
    front: layer('<path d="M27 40Q29 22 48 17L50 34Q42 27 37 28Q34 36 27 40ZM73 40Q71 22 52 17L50 34Q58 27 63 28Q66 36 73 40Z"/>' + centerPartPanel(17, 34.5), '', '<path d="M50 17V34"/>'),
    overlay: strandLayer(
      '<path d="M31 39Q23 49 30 57Q22 66 30 73Q24 80 29 86M69 39Q77 49 70 57Q78 66 70 73Q76 80 71 86"/>',
      5.4,
      '',
      '<path d="M27 48L34 53M26 60L34 65M27 73L33 78M73 48L66 53M74 60L66 65M73 73L67 78"/>',
    ),
    studs: { leftX: -2.5, rightX: 2.5, y: 4 },
  }),
  defineHair('quiff', 3, {
    hairlineY: 29,
    headband: 'crown',
    back: layer('<path d="M28 41Q27 24 40 18Q58 10 72 23L73 40L66 34H34Z"/>'),
    front: layer(
      '<path d="M27 39Q28 25 39 21Q42 9 55 12Q68 13 73 27Q62 22 54 27Q47 31 42 25Q37 36 27 39Z"/>',
      '',
      '<path d="M41 21Q48 28 55 24Q62 20 69 25"/>',
    ),
  }),
  defineHair('shoulder-curls', 3, {
    hairlineY: 32,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'wide',
    lower: layer(
      '<path d="M21 82Q18 55 24 34Q31 15 49 14Q68 14 76 34Q83 55 79 82L66 82L64 53H36L34 82Z"/><circle cx="23" cy="70" r="7"/><circle cx="29" cy="80" r="7"/><circle cx="77" cy="70" r="7"/><circle cx="71" cy="80" r="7"/>',
      '',
      '<path d="M25 43Q18 51 27 57Q35 63 26 70Q19 76 29 82M75 43Q82 51 73 57Q65 63 74 70Q81 76 71 82"/>',
    ),
    front: layer('<path d="M25 41Q25 22 39 18Q51 10 63 18Q76 23 75 41Q65 35 58 27Q50 36 42 28Q35 37 25 41Z"/>'),
  }),
  defineHair('mohawk', 2, {
    hairlineY: 28,
    headband: 'flat-low',
    scalp: 'none',
    back: layer('<path d="M29 36Q34 26 43 24Q54 22 70 35Q60 31 50 31Q39 31 29 36Z" opacity=".28"/>'),
    front: layer(
      '<path d="M35 35Q35 23 40 14Q43 5 48 13Q51 1 55 11Q63 17 65 35Q56 29 50 29Q43 29 35 35Z"/>',
      '<path d="M49 26Q51 12 55 7Q58 18 60 30Z" opacity=".22"/>',
      '<path d="M40 28Q42 15 46 9M50 27Q52 12 55 7M59 29Q61 20 59 14"/>',
    ),
  }),
  defineHair('low-chignon', 3, {
    hairlineY: 28,
    headband: 'high',
    back: layer('<path d="M28 40Q27 20 50 16Q73 20 72 40L66 34H34Z"/><ellipse cx="50" cy="72" rx="11" ry="8"/>', '<ellipse cx="48" cy="70" rx="6" ry="3" opacity=".2"/>', '<path d="M42 72Q50 66 58 72"/>'),
    front: layer('<path d="M29 35Q34 21 50 18Q66 21 71 35Q61 29 50 27Q39 29 29 35Z"/><path d="M28 35Q26.5 40.5 29.5 46.5Q31.5 40.5 32 35Z"/><path d="M72 35Q73.5 40.5 70.5 46.5Q68.5 40.5 68 35Z"/>', '', '<path d="M32 30Q42 20 50 19M68 30Q58 20 50 19"/>'),
  }),
  defineHair('coils', 4, {
    hairlineY: 33,
    ears: 'under-hair',
    headband: 'wide',
    back: layer(
      '<path d="M25 57Q20 32 32 21Q41 11 50 15Q59 11 68 21Q80 32 75 57Z"/><circle cx="29" cy="31" r="9"/><circle cx="39" cy="22" r="9"/><circle cx="51" cy="20" r="10"/><circle cx="63" cy="23" r="9"/><circle cx="72" cy="33" r="9"/><circle cx="27" cy="45" r="8"/><circle cx="73" cy="46" r="8"/>',
      '<circle cx="37" cy="20" r="3" opacity=".18"/><circle cx="60" cy="21" r="3" opacity=".18"/><circle cx="27" cy="40" r="3" opacity=".18"/><circle cx="70" cy="39" r="3" opacity=".18"/>',
      '<path d="M29 31Q34 25 39 30M48 20Q53 15 58 21M64 31Q70 27 73 34"/>',
    ),
    front: layer('<circle cx="31" cy="33" r="7"/><circle cx="40" cy="26" r="8"/><circle cx="51" cy="24" r="8"/><circle cx="62" cy="27" r="8"/><circle cx="70" cy="35" r="7"/>'),
  }),
  defineHair('curtain', 3, {
    hairlineY: 29,
    ears: 'under-hair',
    headband: 'medium',
    lower: layer(
      '<path d="M23 73Q19 43 27 27Q36 13 50 14Q65 13 73 27Q81 43 77 74Q72 71 69 64L64 47H36L31 64Q28 71 23 73Z"/>',
      '<path d="M26 38Q22 54 27 70L31 63L30 42Z" opacity=".2"/><path d="M74 38Q78 54 73 70L69 63L70 42Z" opacity=".2"/>',
      '<path d="M29 31Q24 48 30 68M71 31Q76 48 70 68"/>',
    ),
    front: layer('<path d="M25 41Q26 22 48 15L50 35Q43 27 38 28Q35 37 25 41ZM75 41Q74 22 52 15L50 35Q57 27 62 28Q65 37 75 41Z"/>' + centerPartPanel(15, 35.5), '', '<path d="M50 15V35"/>'),
  }),
  defineHair('high-top', 2, {
    hairlineY: 32,
    headband: 'flat-low',
    headbandLayer: 'over-front',
    scalp: 'full',
    front: layer(
      '<path d="M33 9Q29.5 9 29.5 14L29 40Q40 33 50 32Q60 33 71 40L70.5 14Q70.5 9 67 9Z"/><path d="M26 41Q29 43 31.5 47L33 41Z"/><path d="M74 41Q71 43 68.5 47L67 41Z"/>',
      '<path d="M29.5 29Q50 24 70.5 29L71 37Q60 32 50 31.5Q40 32 29 37Z" opacity=".3"/>',
      '<path d="M37 12L36.8 18M50 11V17M63 12L63.2 18M31.5 24Q50 19.5 68.5 24"/>',
    ),
  }),
  defineHair('double-puffs', 3, {
    hairlineY: 31,
    headband: 'medium',
    back: layer(
      '<path d="M29 42Q27 23 50 17Q73 23 71 42L65 34H35Z"/><circle cx="22" cy="33" r="10.5"/><circle cx="78" cy="33" r="10.5"/>',
      '<circle cx="19" cy="30" r="3.5" opacity=".18"/><circle cx="75" cy="30" r="3.5" opacity=".18"/>',
      '<path d="M14 34Q22 23 30 34M70 34Q78 23 86 34"/>',
    ),
    front: layer('<path d="M28 39Q31 23 48 19L50 34Q42 27 37 28Q35 36 28 39ZM72 39Q69 23 52 19L50 34Q58 27 63 28Q65 36 72 39Z"/>' + centerPartPanel(19, 34.5), '', '<path d="M50 19V34"/>'),
  }),
  defineHair('side-part', 3, {
    hairlineY: 29,
    headband: 'low',
    back: layer('<path d="M27 43Q25 22 43 16Q65 11 74 32L72 44L65 35H34Z"/>'),
    front: layer('<path d="M26 40Q27 21 44 16Q65 12 74 33Q61 33 47 23Q42 33 36 31Q33 37 26 40Z"/>', '', '<path d="M45 18Q53 27 70 31M36 24Q35 32 29 36"/>'),
  }),
  defineHair('rope-twists', 3, {
    hairlineY: 31,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    back: layer('<path d="M25 44Q24 22 42 16Q61 10 75 32L72 49H28Z"/>'),
    front: layer('<path d="M27 40Q29 22 48 17L50 34Q42 27 37 28Q34 36 27 40ZM73 40Q71 22 52 17L50 34Q58 27 63 28Q66 36 73 40Z"/>' + centerPartPanel(17, 34.5)),
    overlay: strandLayer(
      '<path d="M28 36Q23 53 28 82M33 35Q29 55 33 79M67 35Q71 55 67 79M72 36Q77 53 72 82"/>',
      4.4,
      '',
      '<path d="M25 43Q32 47 25 52Q32 57 25 62Q32 67 27 72Q33 77 28 81M30 43Q37 48 30 53Q37 58 30 63Q37 68 32 73M70 43Q63 48 70 53Q63 58 70 63Q63 68 68 73M75 43Q68 47 75 52Q68 57 75 62Q68 67 73 72Q67 77 72 81"/>',
    ),
    studs: { leftX: -2, rightX: 2, y: 4 },
  }),
  defineHair('spiky', 2, {
    hairlineY: 29,
    headband: 'crown',
    back: layer(
      '<path d="M26 42L20 34L26 30L21 22L30 21L27 13L36 17Q42 10 50 10Q58 10 64 17L73 13L70 21L79 22L74 30L80 34L74 42L66 34H34Z"/>',
      '<path d="M24 33L27 26L24 21L31 20L30 15Q26 24 24 33Z" opacity=".2"/><path d="M76 33L73 26L76 21L69 20L70 15Q74 24 76 33Z" opacity=".2"/>',
    ),
    front: layer(
      '<path d="M27 39Q26 30 30 24L33 12L38 18L41 8L45 15L49 5L53 14L58 7L62 16L66 11L69 20Q74 28 73 39L66 32L59 34L53 28L46 33L40 28L34 32Q30 36 27 39Z"/>',
      '<path d="M39 20Q43 11 48 9Q46 17 47 23Z" opacity=".2"/><path d="M55 21Q58 12 63 10Q61 18 62 24Z" opacity=".2"/>',
      '<path d="M33 22L36 14M44 21L47 11M52 20L50 9M60 22L63 13M68 26L71 19"/>',
    ),
  }),
  defineHair('french-twist', 2, {
    hairlineY: 29,
    ears: 'under-hair',
    headband: 'high',
    back: layer(
      '<path d="M27 43Q25 22 44 16Q66 10 74 32L72 57Q70 70 59 75Q64 62 59 51L34 47Z"/>',
      '<path d="M63 30Q72 41 68 57Q65 66 60 70Q64 50 56 40Z" opacity=".22"/>',
      '<path d="M62 28Q72 40 67 57Q65 64 60 69"/>',
    ),
    front: layer('<path d="M26 40Q28 21 47 16Q68 13 74 33Q61 31 51 24Q44 34 26 40Z"/>'),
  }),
  defineHair('shag', 3, {
    hairlineY: 31,
    ears: 'under-hair',
    headband: 'medium',
    lower: layer('<path d="M23 74Q20 43 27 28Q35 13 51 14Q68 13 75 30Q80 48 76 72L70 67L66 76L60 67H40L34 76L30 67Z"/>', '', '<path d="M28 34Q24 51 29 67M72 34Q77 50 71 67"/>'),
    front: layer('<path d="M25 42Q25 21 43 15L46 20L53 12L57 20L66 16L70 22L75 31Q66 37 57 31Q49 26 43 28Q36 39 25 42Z"/>'),
  }),
  defineHair('braided-crown', 2, {
    hairlineY: 31,
    headband: 'crown',
    back: layer('<path d="M27 43Q25 23 42 16Q61 11 74 31L72 44L66 35H34Z"/>'),
    front: layer(
      '<path d="M27 40Q29 23 48 18L50 34Q42 28 37 29Q34 37 27 40ZM73 40Q71 23 52 18L50 34Q58 28 63 29Q66 37 73 40Z"/>'
        + centerPartPanel(18, 34.5),
      '',
      '<path d="M29 29Q35 18 50 17Q65 18 71 29" stroke-width="5"/><path d="M31 27L36 31M37 21L42 26M44 18L48 23M52 18L56 23M58 21L63 26M64 25L69 30"/>',
    ),
  }),
  defineHair('finger-waves', 3, {
    hairlineY: 30,
    headband: 'high',
    front: layer(
      '<path d="M28 38Q28 20 50 16Q72 20 72 38Q61 31 50 30Q39 31 28 38Z"/><path d="M28 37Q26.5 42 29.5 47Q31.5 42 32 37Z"/><path d="M72 37Q73.5 42 70.5 47Q68.5 42 68 37Z"/>',
      '',
      '<path d="M31 27Q38 21 45 26Q52 31 59 25Q65 21 70 27M30 33Q37 27 44 32Q51 37 58 31Q64 27 71 32"/>',
    ),
  }),
  defineHair('twin-ponytails', 3, {
    hairlineY: 30,
    ears: 'under-hair',
    headband: 'medium',
    back: layer(
      '<path d="M28 43Q26 22 43 16Q61 11 72 30L72 45H28Z"/><path d="M29 28Q16 27 15 42Q14 55 23 65Q20 47 29 39ZM71 28Q84 27 85 42Q86 55 77 65Q80 47 71 39Z"/>',
      '<path d="M20 35Q15 45 21 57Q19 41 27 34ZM80 35Q85 45 79 57Q81 41 73 34Z" opacity=".2"/>',
      '<path d="M27 31Q18 38 21 57M73 31Q82 38 79 57"/>',
    ),
    front: layer('<path d="M28 40Q30 22 48 17L50 34Q42 27 37 28Q35 36 28 40ZM72 40Q70 22 52 17L50 34Q58 27 63 28Q65 36 72 40Z"/>' + centerPartPanel(17, 34.5)),
  }),
  defineHair('caesar', 3, {
    hairlineY: 31,
    front: layer('<path d="M28 39Q27 21 50 16Q72 20 72 37Q64 34 60 31L56 35L50 31L45 35L40 31L35 36Q31 39 28 39Z"/>', '', '<path d="M34 26Q50 20 67 27M37 31L40 34M47 29L50 32M57 29L60 32"/>'),
  }),
  defineHair('locs', 3, {
    hairlineY: 31,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    back: layer('<path d="M25 45Q23 22 41 16Q61 10 75 32L72 49H28Z"/>'),
    front: layer('<path d="M27 40Q29 22 48 17L50 34Q42 27 37 28Q34 36 27 40ZM73 40Q71 22 52 17L50 34Q58 27 63 28Q66 36 73 40Z"/>' + centerPartPanel(17, 34.5)),
    overlay: strandLayer(
      '<path d="M27 37Q23 54 27 82M32 35Q28 57 32 77M36 34Q34 42 36 50M64 34Q66 42 64 50M68 35Q72 57 68 77M73 37Q77 54 73 82"/>',
      3.8,
      '',
      '<path d="M27 45Q30 53 26 61M32 45Q35 55 31 64M36 40Q39 45 35 49M64 40Q61 45 65 49M68 45Q65 55 69 64M73 45Q70 53 74 61"/>',
    ),
    studs: { leftX: -2.5, rightX: 2.5, y: 4 },
  }),
  defineHair('bowl-cut', 3, {
    hairlineY: 35,
    ears: 'under-hair',
    headband: 'medium',
    back: layer('<path d="M25 44Q24 20 50 15Q76 20 75 44Q65 38 50 38Q35 38 25 44Z"/>'),
    front: layer('<path d="M26 39Q27 20 50 16Q73 20 74 39Q62 36 50 36Q38 36 26 39Z"/>', '<path d="M27 34Q50 30 73 34V38Q50 34 27 38Z" opacity=".18"/>', '<path d="M28 35Q50 32 72 35"/>'),
  }),
  defineHair('loc-bun', 2, {
    hairlineY: 31,
    ears: 'under-hair',
    headband: 'medium',
    back: layer('<path d="M27 43Q25 22 43 16Q62 11 73 31L72 45H28Z"/><path d="M33 22Q32 7 45 5.5H55Q68 7 67 22Q60 14 50 13.5Q40 14 33 22Z"/><ellipse cx="50" cy="13" rx="11" ry="8"/>', '<path d="M43 12Q50 7 57 12Q50 10 43 12Z" opacity=".22"/>', '<path d="M42 14Q47 8 51 14Q55 8 59 14"/>'),
    front: layer('<path d="M27 40Q29 23 48 18L50 34Q42 28 37 29Q34 37 27 40ZM73 40Q71 23 52 18L50 34Q58 28 63 29Q66 37 73 40Z"/>' + centerPartPanel(18, 34.5)),
    overlay: strandLayer('<path d="M31 37Q27 50 30 67M69 37Q73 50 70 67"/>', 3.8, '', '<path d="M30 43Q33 49 29 55M70 43Q67 49 71 55"/>'),
  }),
  defineHair('asymmetric', 3, {
    hairlineY: 30,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    lower: layer('<path d="M25 71Q22 40 29 27Q38 13 52 14Q69 15 75 31Q80 54 76 82L65 81L63 47H36L33 67Z"/>', '<path d="M66 40Q75 55 72 78L66 79Z" opacity=".2"/>', '<path d="M70 31Q76 52 72 78"/>'),
    front: layer('<path d="M26 40Q27 21 48 15Q69 14 75 36Q61 33 50 23Q44 33 37 31Q33 38 26 40Z"/>'),
  }),
  defineHair('cornrows', 3, {
    hairlineY: 30,
    headband: 'high',
    back: layer('<path d="M28 39Q28 20 50 16Q72 20 72 39Q62 32 50 31Q38 32 28 39Z"/>'),
    front: layer('<path d="M28 37Q30 21 50 17Q70 21 72 37Q61 31 50 30Q39 31 28 37Z"/>'),
    overlay: strandLayer(
      '<path d="M29 35Q30 24 38 16M36 33Q37 22 44 14.5M43 32Q44 20 48 14M50 31V14M57 32Q56 20 52 14M64 33Q63 22 56 14.5M71 35Q70 24 62 16"/>',
      3,
    ),
  }),
  defineHair('high-bun', 3, {
    hairlineY: 29,
    headband: 'high',
    back: layer('<path d="M28 41Q27 20 50 16Q73 20 72 41L66 34H34Z"/><path d="M35 21Q34 6 46 4.5H54Q66 6 65 21Q58 14 50 13.5Q42 14 35 21Z"/><circle cx="50" cy="13" r="8.5"/>', '<path d="M45 11Q50 6 55 11Q50 9 45 11Z" opacity=".2"/>', '<path d="M43 14Q50 7 57 14"/>'),
    front: layer('<path d="M29 36Q34 21 50 18Q66 21 71 36Q61 29 50 27Q39 29 29 36Z"/><path d="M28 36Q26.5 41 29.5 46.5Q31.5 41 32 36Z"/><path d="M72 36Q73.5 41 70.5 46.5Q68.5 41 68 36Z"/>', '', '<path d="M32 30Q42 20 50 19M68 30Q58 20 50 19"/>'),
  }),
  defineHair('mullet', 2, {
    hairlineY: 30,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'medium',
    lower: layer('<path d="M26 75Q22 42 29 27Q38 14 52 15Q68 15 74 31L75 77L66 72L62 81L58 68H39L34 79L30 68Z"/>', '', '<path d="M70 33Q76 52 71 72M30 36Q26 51 30 67"/>'),
    front: layer('<path d="M27 40Q27 20 44 14L47 20L53 12L57 20L66 16L70 22L74 31Q66 37 57 31Q48 27 42 28Q36 38 27 40Z"/>'),
  }),
  defineHair('victory-rolls', 2, {
    hairlineY: 32,
    headband: 'crown',
    back: layer('<path d="M27 44Q25 23 42 16Q61 11 74 31L72 44L65 36H35Z"/>'),
    front: layer(
      '<path d="M27 41Q27 24 36 18Q33 9 42 7Q50 5 52 15Q54 5 63 7Q73 9 70 19Q74 25 73 39Q64 34 56 27Q50 34 44 27Q37 37 27 41Z"/>',
      '<circle cx="43" cy="13" r="3.2" opacity=".25"/><circle cx="62" cy="14" r="3.2" opacity=".25"/>',
      '<path d="M38 14Q43 8 48 14M57 15Q62 9 67 15M37 22Q43 18 49 21M51 21Q57 18 63 22"/>',
    ),
  }),
  defineHair('twist-out', 3, {
    hairlineY: 33,
    ears: 'under-hair',
    headband: 'wide',
    back: layer(
      '<path d="M23 64Q18 52 25 44Q18 33 29 28Q29 16 42 18Q50 10 58 18Q72 16 71 29Q82 34 75 45Q82 54 76 65L65 59H35Z"/><ellipse cx="25" cy="39" rx="8" ry="11" transform="rotate(-28 25 39)"/><ellipse cx="75" cy="39" rx="8" ry="11" transform="rotate(28 75 39)"/><ellipse cx="36" cy="22" rx="7" ry="10" transform="rotate(-20 36 22)"/><ellipse cx="64" cy="22" rx="7" ry="10" transform="rotate(20 64 22)"/>',
      '',
      '<path d="M22 43Q31 36 27 28M34 29Q42 22 38 17M78 43Q69 36 73 28M66 29Q58 22 62 17"/>',
    ),
    front: layer('<path d="M27 40Q25 28 36 23Q44 14 52 21Q61 14 67 25Q76 29 73 41Q64 34 58 27Q50 36 42 28Q36 37 27 40Z"/>'),
  }),
  defineHair('bubble-ponytail', 2, {
    hairlineY: 29,
    ears: 'under-hair',
    lowerHair: 'over-neck',
    headband: 'high',
    back: layer(
      '<path d="M28 43Q25 21 45 16Q67 12 74 34L68 46H34Z"/><ellipse cx="78" cy="24" rx="8" ry="10"/><ellipse cx="80" cy="42" rx="8" ry="10"/><ellipse cx="78" cy="60" rx="7" ry="9"/><ellipse cx="75" cy="76" rx="6" ry="8"/>',
      '<path d="M72 32H84M73 50H85M72 68H82" opacity=".28"/>',
      '<path d="M72 33H84M73 51H85M72 69H81"/>',
    ),
    front: layer('<path d="M27 39Q30 20 49 16Q68 17 73 35Q59 30 48 24Q40 34 27 39Z"/>'),
  }),
  defineHair('pineapple-updo', 2, {
    hairlineY: 31,
    headband: 'crown',
    back: layer(
      '<path d="M29 42Q28 23 50 17Q72 23 71 42L65 34H35Z"/><ellipse cx="50" cy="13" rx="6" ry="9"/><ellipse cx="40" cy="16" rx="7" ry="8" transform="rotate(-24 40 16)"/><ellipse cx="60" cy="16" rx="7" ry="8" transform="rotate(24 60 16)"/><ellipse cx="33" cy="21" rx="6" ry="7" transform="rotate(-32 33 21)"/><ellipse cx="67" cy="21" rx="6" ry="7" transform="rotate(32 67 21)"/>',
      '<path d="M42 24Q50 20 58 24L56 28H44Z" opacity=".28"/>',
      '<path d="M36 21Q40 13 44 21M46 16Q50 8 54 16M56 21Q60 13 64 21M42 26Q50 22 58 26"/>',
    ),
    front: layer('<path d="M28 39Q31 23 48 19L50 34Q42 27 37 28Q35 36 28 39ZM72 39Q69 23 52 19L50 34Q58 27 63 28Q65 36 72 39Z"/>' + centerPartPanel(19, 34.5)),
  }),
] as const);

type DefinitionIds<Definitions extends readonly HairDefinition[]> = {
  readonly [Index in keyof Definitions]: Definitions[Index] extends HairDefinition<infer Id>
    ? Id
    : never;
};

function definitionIds<const Definitions extends readonly HairDefinition[]>(
  definitions: Definitions,
): DefinitionIds<Definitions> {
  return Object.freeze(definitions.map(({ id }) => id)) as DefinitionIds<Definitions>;
}

export const hairStyleNames = definitionIds(hairDefinitions);
export type HairStyle = typeof hairStyleNames[number];

const definitionsById = new Map<HairStyle, HairDefinition<HairStyle>>(
  hairDefinitions.map((definition) => [definition.id, definition]),
);

export const hairStyleWeights = Object.freeze(
  hairDefinitions.map(({ id, weight }) => Object.freeze([id, weight] as const)),
);

export function getHairDefinition(style: HairStyle): HairDefinition<HairStyle> {
  return definitionsById.get(style)!;
}

export interface HairPigments {
  readonly base: string;
  readonly shade: string;
}

/**
 * Render the shared scalp underlay. It belongs directly over the face so the
 * style fringe, headband, and ears keep their established relationships.
 */
export function renderScalpUnderlay(
  style: HairStyle,
  pigments: HairPigments,
): string {
  const definition = getHairDefinition(style);
  if (definition.scalp === 'none') return '';

  return `<g data-folks-hair="${style}" data-folks-hair-layer="scalp"><g fill="${pigments.base}" stroke="${pigments.shade}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="${scalpCapPath}"/></g></g>`;
}

/** Render one geometry layer with a common restrained, fill-related contour. */
export function renderHairLayer(
  style: HairStyle,
  layerName: HairLayerName,
  pigments: HairPigments,
): string {
  const geometry = getHairDefinition(style).geometry[layerName];
  if (!geometry.silhouette && !geometry.shade && !geometry.line && !geometry.strands) return '';

  return `<g data-folks-hair="${style}" data-folks-hair-layer="${layerName}">
    ${geometry.silhouette ? `<g fill="${pigments.base}" stroke="${pigments.shade}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${geometry.silhouette}</g>` : ''}
    ${geometry.shade ? `<g fill="${pigments.shade}" stroke="none">${geometry.shade}</g>` : ''}
    ${geometry.strands ? `<g fill="none" stroke="${pigments.shade}" stroke-width="${geometry.strandWidth! + 1.5}" stroke-linecap="round" stroke-linejoin="round">${geometry.strands}</g><g fill="none" stroke="${pigments.base}" stroke-width="${geometry.strandWidth}" stroke-linecap="round" stroke-linejoin="round">${geometry.strands}</g>` : ''}
    ${geometry.line ? `<g fill="none" stroke="${pigments.shade}" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" opacity=".58">${geometry.line}</g>` : ''}
  </g>`;
}

export function renderHeadband(
  style: HairStyle,
  accent: string,
  layerName: HeadbandLayer,
): string {
  const { headband } = getHairDefinition(style).anchors;
  if (headband.layer !== layerName) return '';
  return `<path d="${headband.d}" fill="none" stroke="${accent}" stroke-width="3.4" stroke-linecap="round"/>`;
}
