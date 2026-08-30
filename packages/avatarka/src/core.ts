import type { ParamSchema, Seed } from './types';
import {
  baseTypeParam as folksBaseTypeParam,
  folks,
  schema as folksSchema,
  type FolksParams,
} from './themes/folks';
import {
  adventurers,
  baseTypeParam as adventurersBaseTypeParam,
  schema as adventurersSchema,
  type AdventurersParams,
} from './themes/adventurers';
import {
  baseTypeParam as crittersBaseTypeParam,
  critters,
  schema as crittersSchema,
  type CrittersParams,
} from './themes/critters';
import {
  baseTypeParam as oddlingsBaseTypeParam,
  oddlings,
  schema as oddlingsSchema,
  type OddlingsParams,
} from './themes/oddlings';
import {
  baseTypeParam as botsBaseTypeParam,
  bots,
  schema as botsSchema,
  type BotsParams,
} from './themes/bots';
import {
  baseTypeParam as snacksBaseTypeParam,
  snacks,
  schema as snacksSchema,
  type SnacksParams,
} from './themes/snacks';
import {
  baseTypeParam as nooksBaseTypeParam,
  nooks,
  schema as nooksSchema,
  type NooksParams,
} from './themes/nooks';
import {
  baseTypeParam as orbsBaseTypeParam,
  orbs,
  schema as orbsSchema,
  type OrbsParams,
} from './themes/orbs';
import {
  paletteNames,
  palettes,
  type PaletteName,
} from './palettes';
import {
  createBaseTypeSchedule,
  createGalleryCandidateSeeds,
  FOLKS_GALLERY_CANDIDATE_POOL_SIZE,
  GALLERY_CANDIDATE_POOL_SIZE,
  selectGalleryCandidate,
} from './internal/gallery';
import { createEntropySeed, createAvatarRandom } from './internal/random';
import {
  backgroundShapeNames,
  type BackgroundShape,
  type AvatarRandom,
} from './internal/types';
import { assertParamValue, assertSeed } from './internal/validation';
import { RECIPE_VERSION } from './version';

export { RECIPE_VERSION } from './version';
export { getPalette, paletteNames, palettes } from './palettes';
export type { Palette, PaletteColors, PaletteName } from './palettes';
export { backgroundShapeNames } from './internal/types';
export type { BackgroundShape } from './internal/types';
export type { Seed } from './types';

export type ThemeParamsMap = {
  folks: FolksParams;
  adventurers: AdventurersParams;
  critters: CrittersParams;
  oddlings: OddlingsParams;
  bots: BotsParams;
  snacks: SnacksParams;
  nooks: NooksParams;
  orbs: OrbsParams;
};

export type ThemeName = keyof ThemeParamsMap;

type ThemeBaseTypeParamMap = {
  folks: typeof folksBaseTypeParam;
  adventurers: typeof adventurersBaseTypeParam;
  critters: typeof crittersBaseTypeParam;
  oddlings: typeof oddlingsBaseTypeParam;
  bots: typeof botsBaseTypeParam;
  snacks: typeof snacksBaseTypeParam;
  nooks: typeof nooksBaseTypeParam;
  orbs: typeof orbsBaseTypeParam;
};

const internalThemes = {
  folks,
  adventurers,
  critters,
  oddlings,
  bots,
  snacks,
  nooks,
  orbs,
} as const satisfies {
  [K in ThemeName]: {
    baseTypeParam: ThemeBaseTypeParamMap[K];
    generate: (params: ThemeParamsMap[K]) => string;
  };
};

type InternalThemeMap = typeof internalThemes;

/** Canonical public order for the v4 catalog and every category switcher. */
export const themeNames = Object.freeze([
  'folks',
  'adventurers',
  'critters',
  'oddlings',
  'bots',
  'snacks',
  'nooks',
  'orbs',
] as const satisfies readonly ThemeName[]);

export type ThemeParams<T extends ThemeName> = ThemeParamsMap[T];

/** Traits that most strongly affect the rhythm of a 5x5 picker gallery. */
const galleryBalanceParams = {
  folks: ['skinTone', 'faceShape', 'topStyle'],
  // Role-specific gear and insignia should follow their natural weights. Balancing
  // optional decoration here makes almost every Adventurer visually busy.
  adventurers: ['skinTone', 'expression'],
  critters: ['coat', 'expression'],
  oddlings: ['feature', 'pattern', 'eyeArrangement', 'mouthStyle'],
  // Antennas are chassis-specific identity cues, not a quota: most authored
  // silhouettes deliberately have none, while explicit recipe traits remain exact.
  bots: ['eyeSystem', 'sideSensors', 'panel'],
  snacks: ['expression', 'finish', 'companion', 'pose'],
  // Architectural accents are optional character notes, not a gallery quota.
  nooks: ['expression', 'windowStyle', 'material'],
  orbs: ['faceStyle', 'accentPosition'],
} as const satisfies {
  [K in ThemeName]: readonly (keyof ThemeParamsMap[K])[];
};

type GalleryBalanceWeights = {
  [K in ThemeName]?: {
    [P in keyof ThemeParamsMap[K]]?: Readonly<Partial<Record<
      Extract<ThemeParamsMap[K][P], string | number>,
      number
    >>>;
  };
};

// Keep all seven human skin tones present while giving the darkest two a
// little more breathing room in a 5x5 gallery. These are relative gallery
// targets, not rendering traits: explicit recipes and standalone avatars keep
// the exact tone requested or derived from their own seed.
const humanSkinToneGalleryWeights = {
  porcelain: 5,
  peach: 5,
  sand: 4,
  honey: 4,
  copper: 3,
  umber: 2,
  deep: 2,
} as const satisfies Readonly<Record<FolksParams['skinTone'], number>>;

const galleryBalanceWeights = {
  folks: { skinTone: humanSkinToneGalleryWeights },
  adventurers: { skinTone: humanSkinToneGalleryWeights },
} as const satisfies GalleryBalanceWeights;

const GALLERY_COLUMNS = 5;
const MAX_GALLERY_COUNT = 1000;

function createPaletteSchedule(
  count: number,
  random: AvatarRandom,
): PaletteName[] {
  const schedule: PaletteName[] = [];
  const cycleCount = Math.ceil(count / paletteNames.length);

  for (let cycle = 0; cycle < cycleCount; cycle++) {
    const remaining = Math.min(
      paletteNames.length,
      count - schedule.length,
    );
    let bestOrder: PaletteName[] | undefined;
    let bestConflicts = Number.POSITIVE_INFINITY;

    // Each cycle is a permutation, so global palette counts still differ by at
    // most one. Try several deterministic permutations and prefer one that
    // avoids both horizontal and five-column vertical neighbours.
    for (let attempt = 0; attempt < 48; attempt++) {
      const order = random.shuffle(`palette-order:${cycle}:${attempt}`, paletteNames);
      const addition = order.slice(0, remaining);
      const tentative = [...schedule, ...addition];
      let conflicts = 0;

      for (let index = schedule.length; index < tentative.length; index++) {
        if (index > 0 && tentative[index] === tentative[index - 1]) conflicts += 2;
        if (
          index >= GALLERY_COLUMNS
          && tentative[index] === tentative[index - GALLERY_COLUMNS]
        ) {
          conflicts += 1;
        }
      }

      if (conflicts < bestConflicts) {
        bestOrder = addition;
        bestConflicts = conflicts;
      }
      if (conflicts === 0) break;
    }

    if (!bestOrder) throw new Error('Unable to create palette schedule');
    schedule.push(...bestOrder);
  }

  return schedule;
}

function avatarParamsRecord(
  params: object,
): Record<string, string | number> {
  return params as Record<string, string | number>;
}

function galleryIdentitySignature(params: object): string {
  return JSON.stringify(Object.fromEntries(
    Object.entries(avatarParamsRecord(params)).filter(([key]) => (
      key !== 'palette' && key !== 'backgroundShape'
    )),
  ));
}

function galleryBalanceKey(
  theme: ThemeName,
  field: string,
  value: string | number,
): string {
  return JSON.stringify([theme, field, value]);
}

function galleryBalanceWeight(
  theme: ThemeName,
  field: string,
  value: string | number,
): number {
  const themeWeights = (galleryBalanceWeights as GalleryBalanceWeights)[theme] as
    | Readonly<Record<string, Readonly<Record<string | number, number>> | undefined>>
    | undefined;
  return themeWeights?.[field]?.[value] ?? 1;
}

function galleryBalanceWeightTotal(
  theme: ThemeName,
  field: string,
  options: readonly string[],
): number {
  return options.reduce(
    (total, value) => total + galleryBalanceWeight(theme, field, value),
    0,
  );
}

function scoreGalleryCandidate(
  theme: ThemeName,
  params: object,
  valueCounts: ReadonlyMap<string, number>,
  items: readonly { readonly theme: ThemeName; readonly params: object }[],
): number {
  const values = avatarParamsRecord(params);
  const previous = items[items.length - 1];
  const above = items[items.length - GALLERY_COLUMNS];
  const previousValues = previous?.theme === theme
    ? avatarParamsRecord(previous.params)
    : undefined;
  const aboveValues = above?.theme === theme
    ? avatarParamsRecord(above.params)
    : undefined;
  let score = 0;

  for (const field of galleryBalanceParams[theme] as readonly string[]) {
    const value = values[field]!;
    const definition = (internalThemes[theme].schema as ParamSchema)[field];
    const optionCount = definition?.type === 'select' ? definition.options.length : 1;
    const balanceWeight = galleryBalanceWeight(theme, field, value);
    const balanceWeightTotal = definition?.type === 'select'
      ? galleryBalanceWeightTotal(theme, field, definition.options)
      : 1;
    const seen = valueCounts.get(galleryBalanceKey(theme, field, value)) ?? 0;

    // Normalize by target share: four uses of a weight-four value and two uses
    // of a weight-two value represent the same relative saturation. Equal
    // weights retain the original option-count normalization.
    score += seen * (balanceWeightTotal / balanceWeight) * 10;
    if (previousValues?.[field] === value) score += optionCount * 4;
    if (aboveValues?.[field] === value) score += optionCount * 3;
  }

  return score;
}

function rememberGalleryBalance(
  theme: ThemeName,
  params: object,
  valueCounts: Map<string, number>,
): void {
  const values = avatarParamsRecord(params);
  for (const field of galleryBalanceParams[theme] as readonly string[]) {
    const value = values[field]!;
    const key = galleryBalanceKey(theme, field, value);
    valueCounts.set(key, (valueCounts.get(key) ?? 0) + 1);
  }
}

type CommonParamKey = 'palette' | 'backgroundShape';

/** Theme-specific semantic controls. Presentation never changes these traits. */
export type ThemeTraits<T extends ThemeName = ThemeName> =
  T extends ThemeName
    ? Omit<ThemeParams<T>, CommonParamKey>
    : never;

export type AvatarOptions<T extends ThemeName = ThemeName> = {
  /** Scope the same seed to a product, tenant, or site. */
  namespace?: string;
  /** Presentation-only palette override. */
  palette?: PaletteName;
  /** Presentation-only frame override. */
  backgroundShape?: BackgroundShape;
  /** Typed semantic edits stored in the reproducible recipe. */
  traits?: Partial<ThemeTraits<T>>;
};

type RecipeFor<T extends ThemeName> = {
  readonly format: 'avatarka';
  readonly version: typeof RECIPE_VERSION;
  readonly theme: T;
  readonly seed: Seed;
  readonly namespace: string;
  readonly palette?: PaletteName;
  readonly backgroundShape?: BackgroundShape;
  readonly traits?: Readonly<Partial<ThemeTraits<T>>>;
};

/** Serializable identity recipe. The conditional keeps theme and traits correlated. */
export type AvatarRecipe<T extends ThemeName = ThemeName> =
  T extends ThemeName ? RecipeFor<T> : never;

type GeneratedFor<T extends ThemeName> = {
  readonly recipe: RecipeFor<T>;
  readonly theme: T;
  readonly params: Readonly<ThemeParams<T>>;
  readonly svg: string;
};

/** A rendered, reproducible avatar. */
export type GeneratedAvatar<T extends ThemeName = ThemeName> =
  T extends ThemeName ? GeneratedFor<T> : never;

/** Correlated render input; a GeneratedAvatar can be passed directly. */
export type AvatarRenderInput<T extends ThemeName = ThemeName> =
  { [K in T]: { readonly theme: K; readonly params: ThemeParams<K> } }[T];

export type GalleryOptions = {
  /** Limit the gallery to one or more visual themes. */
  themes?: readonly ThemeName[];
  namespace?: string;
  /** Force one curated palette across the whole set. Omit for a balanced mix. */
  palette?: PaletteName;
  /** Force one background silhouette across the whole set. */
  backgroundShape?: BackgroundShape;
};

type GalleryOptionsWithThemes<Themes extends readonly ThemeName[]> =
  Omit<GalleryOptions, 'themes'> & { themes: Themes };

type ThemeSchemaMap = {
  folks: typeof folksSchema;
  adventurers: typeof adventurersSchema;
  critters: typeof crittersSchema;
  oddlings: typeof oddlingsSchema;
  bots: typeof botsSchema;
  snacks: typeof snacksSchema;
  nooks: typeof nooksSchema;
  orbs: typeof orbsSchema;
};

type ThemeBaseTypeParam<T extends ThemeName> = ThemeBaseTypeParamMap[T];

type ThemeBaseTypeValues<T extends ThemeName> =
  ThemeBaseTypeParam<T> extends infer Param
    ? Param extends keyof ThemeSchemaMap[T]
      ? ThemeSchemaMap[T][Param] extends {
        readonly type: 'select';
        readonly options: infer Values extends readonly string[];
      }
        ? Values
        : never
      : never
    : never;

/** The primary catalog axis and its exact built-in values for one theme. */
export type BaseTypeCatalog<T extends ThemeName = ThemeName> =
  T extends ThemeName
    ? Readonly<{
        param: ThemeBaseTypeParam<T>;
        values: ThemeBaseTypeValues<T>;
      }>
    : never;

const themeKinds = {
  folks: 'person',
  adventurers: 'person',
  critters: 'animal',
  oddlings: 'character',
  bots: 'robot',
  snacks: 'food',
  nooks: 'place',
  orbs: 'anonymous',
} as const satisfies {
  [K in ThemeName]: InternalThemeMap[K]['kind'];
};

/** Discriminated, renderer-free metadata for one catalog theme. */
export type ThemeMetadata<T extends ThemeName = ThemeName> =
  T extends ThemeName
    ? Readonly<{
        id: T;
        name: string;
        description: string;
        kind: typeof themeKinds[T];
        baseTypeParam: ThemeBaseTypeParam<T>;
        schema: ThemeSchemaMap[T];
      }>
    : never;

export type ThemeMetadataMap = {
  readonly [K in ThemeName]: ThemeMetadata<K>;
};

function freezeSchema<T extends ParamSchema>(schema: T): T {
  const entries = Object.entries(schema).map(([key, definition]) => {
    const clone = definition.type === 'select'
      ? { ...definition, options: Object.freeze([...definition.options]) }
      : { ...definition };
    return [key, Object.freeze(clone)] as const;
  });
  return Object.freeze(Object.fromEntries(entries)) as T;
}

function createThemeMetadata<T extends ThemeName>(theme: T): ThemeMetadata<T> {
  const source = internalThemes[theme];
  return Object.freeze({
    id: theme,
    name: source.name,
    description: source.description,
    kind: source.kind,
    baseTypeParam: source.baseTypeParam,
    schema: freezeSchema(source.schema),
  }) as ThemeMetadata<T>;
}

/** Safe metadata only; renderer/randomizer internals are deliberately private. */
export const themes = Object.freeze({
  folks: createThemeMetadata('folks'),
  adventurers: createThemeMetadata('adventurers'),
  critters: createThemeMetadata('critters'),
  oddlings: createThemeMetadata('oddlings'),
  bots: createThemeMetadata('bots'),
  snacks: createThemeMetadata('snacks'),
  nooks: createThemeMetadata('nooks'),
  orbs: createThemeMetadata('orbs'),
}) satisfies ThemeMetadataMap;

function createBaseTypeCatalog<T extends ThemeName>(
  theme: T,
): BaseTypeCatalog<T> {
  const metadata = themes[theme];
  const param = metadata.baseTypeParam;
  const definition = (metadata.schema as ParamSchema)[param];
  if (!definition || definition.type !== 'select') {
    throw new Error(`Invalid avatar base type parameter for ${theme}: ${param}`);
  }
  return Object.freeze({
    param,
    values: definition.options,
  }) as BaseTypeCatalog<T>;
}

const baseTypeCatalogs = Object.freeze({
  folks: createBaseTypeCatalog('folks'),
  adventurers: createBaseTypeCatalog('adventurers'),
  critters: createBaseTypeCatalog('critters'),
  oddlings: createBaseTypeCatalog('oddlings'),
  bots: createBaseTypeCatalog('bots'),
  snacks: createBaseTypeCatalog('snacks'),
  nooks: createBaseTypeCatalog('nooks'),
  orbs: createBaseTypeCatalog('orbs'),
}) satisfies {
  readonly [K in ThemeName]: BaseTypeCatalog<K>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === null
    || prototype === Object.prototype
    || Object.getPrototypeOf(prototype) === null;
}

function snapshotRecord(
  value: unknown,
  invalidMessage: string,
): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(invalidMessage);

  const snapshot: Record<string, unknown> = Object.create(null);
  for (const key of Object.keys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor)) {
      throw new Error(`${invalidMessage}: accessor property ${key}`);
    }
    snapshot[key] = descriptor.value;
  }
  return snapshot;
}

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string'
    && Object.prototype.hasOwnProperty.call(internalThemes, value);
}

function assertThemeName(value: unknown): asserts value is ThemeName {
  if (!isThemeName(value)) throw new Error(`Unknown theme: ${String(value)}`);
}

function assertNamespace(namespace: unknown): asserts namespace is string {
  if (typeof namespace !== 'string') {
    throw new Error(`Invalid avatar namespace: ${String(namespace)}`);
  }
}

function assertAvatarParams<T extends ThemeName>(
  theme: T,
  params: ThemeParams<T>,
): ThemeParams<T> {
  const values = snapshotRecord(
    params,
    `Invalid avatar parameters for ${theme}`,
  );

  const schema = internalThemes[theme].schema as ParamSchema;
  for (const [key, definition] of Object.entries(schema)) {
    if (!hasOwn(values, key)) {
      throw new Error(`Missing avatar parameter for ${theme}: ${key}`);
    }
    assertParamValue(theme, key, definition, values[key]);
  }
  for (const key of Object.keys(values)) {
    if (!hasOwn(schema, key)) {
      throw new Error(`Unknown avatar parameter for ${theme}: ${key}`);
    }
  }
  return values as ThemeParams<T>;
}

function assertPalette(value: unknown): asserts value is PaletteName {
  if (
    typeof value !== 'string'
    || !hasOwn(palettes, value)
  ) {
    throw new Error(`Unknown palette: ${String(value)}`);
  }
}

function assertBackgroundShape(value: unknown): asserts value is BackgroundShape {
  if (!backgroundShapeNames.some((shape) => shape === value)) {
    throw new Error(`Unknown background shape: ${String(value)}`);
  }
}

function assertTraits<T extends ThemeName>(
  theme: T,
  traits: unknown,
): asserts traits is Partial<ThemeTraits<T>> {
  if (!isRecord(traits)) throw new Error(`Invalid avatar traits for ${theme}`);

  const schema = internalThemes[theme].schema as ParamSchema;
  for (const [key, value] of Object.entries(traits)) {
    if (key === 'palette' || key === 'backgroundShape') {
      throw new Error(`Presentation field is not an avatar trait: ${key}`);
    }
    const definition = hasOwn(schema, key)
      ? schema[key]
      : undefined;
    if (!definition) throw new Error(`Unknown avatar trait for ${theme}: ${key}`);
    if (value !== undefined) assertParamValue(theme, key, definition, value);
  }
}

const avatarOptionKeys = new Set([
  'namespace',
  'palette',
  'backgroundShape',
  'traits',
]);

function snapshotAvatarOptions<T extends ThemeName>(
  theme: T,
  options: unknown,
): AvatarOptions<T> {
  const snapshot = snapshotRecord(
    options,
    `Invalid avatar options for ${theme}`,
  );
  for (const key of Object.keys(snapshot)) {
    if (!avatarOptionKeys.has(key)) throw new Error(`Unknown avatar option: ${key}`);
  }
  if (hasOwn(snapshot, 'namespace') && snapshot.namespace !== undefined) {
    assertNamespace(snapshot.namespace);
  }
  if (hasOwn(snapshot, 'palette') && snapshot.palette !== undefined) {
    assertPalette(snapshot.palette);
  }
  if (hasOwn(snapshot, 'backgroundShape') && snapshot.backgroundShape !== undefined) {
    assertBackgroundShape(snapshot.backgroundShape);
  }
  if (hasOwn(snapshot, 'traits') && snapshot.traits !== undefined) {
    const traits = snapshotRecord(
      snapshot.traits,
      `Invalid avatar traits for ${theme}`,
    );
    assertTraits(theme, traits);
    snapshot.traits = traits;
  }
  return snapshot as AvatarOptions<T>;
}

function canonicalizeTraits<T extends ThemeName>(
  theme: T,
  traits: Partial<ThemeTraits<T>> | undefined,
): Readonly<Partial<ThemeTraits<T>>> | undefined {
  if (!traits || Object.keys(traits).length === 0) return undefined;

  const schema = internalThemes[theme].schema as ParamSchema;
  const source = traits as Record<string, string | number | undefined>;
  const entries = Object.keys(schema)
    .filter((key) => (
      key !== 'palette'
      && key !== 'backgroundShape'
      && hasOwn(source, key)
      && source[key] !== undefined
    ))
    .map((key) => [key, source[key]!] as const);
  if (entries.length === 0) return undefined;
  return Object.freeze(Object.fromEntries(entries)) as Readonly<
    Partial<ThemeTraits<T>>
  >;
}

function applyAvatarOptions<T extends ThemeName>(
  theme: T,
  params: ThemeParams<T>,
  options?: AvatarOptions<T>,
): ThemeParams<T> {
  if (!options) return params;
  const optionTraits = hasOwn(options, 'traits') ? options.traits : undefined;
  const traits = canonicalizeTraits(
    theme,
    optionTraits as Partial<ThemeTraits<T>> | undefined,
  );
  const palette = hasOwn(options, 'palette') ? options.palette : undefined;
  const backgroundShape = hasOwn(options, 'backgroundShape')
    ? options.backgroundShape
    : undefined;

  return {
    ...params,
    ...(traits ?? {}),
    ...(palette !== undefined ? { palette } : {}),
    ...(backgroundShape !== undefined
      ? { backgroundShape }
      : {}),
  } as ThemeParams<T>;
}

export function generateAvatar<T extends ThemeName>(input: {
  readonly theme: T;
  readonly params: ThemeParams<NoInfer<T>>;
}): string;
export function generateAvatar<T extends ThemeName>(
  theme: T,
  params: ThemeParams<NoInfer<T>>,
): string;
export function generateAvatar(
  inputOrTheme: ThemeName | AvatarRenderInput,
  maybeParams?: ThemeParams<ThemeName>,
): string {
  let theme: unknown;
  let params: unknown;
  if (typeof inputOrTheme === 'string') {
    theme = inputOrTheme;
    params = maybeParams;
  } else {
    const input = snapshotRecord(inputOrTheme, 'Invalid avatar render input');
    if (!hasOwn(input, 'theme') || !hasOwn(input, 'params')) {
      throw new Error('Invalid avatar render input');
    }
    theme = input.theme;
    params = input.params;
  }
  assertThemeName(theme);
  return renderAvatar(theme, params as ThemeParams<typeof theme>);
}

function renderAvatar<T extends ThemeName>(
  theme: T,
  params: ThemeParams<T>,
): string {
  const safeParams = assertAvatarParams(theme, params);
  const themeObject = internalThemes[theme];
  return (themeObject.generate as (value: ThemeParams<T>) => string)(safeParams);
}

export function generateParams<T extends ThemeName>(
  theme: T,
  seed: Seed,
  options?: AvatarOptions<NoInfer<T>>,
): ThemeParams<T> {
  assertThemeName(theme);
  assertSeed(seed);
  const safeOptions = options === undefined
    ? undefined
    : snapshotAvatarOptions(theme, options);
  const namespace = safeOptions && hasOwn(safeOptions, 'namespace')
    ? safeOptions.namespace ?? 'default'
    : 'default';
  const random = createAvatarRandom(seed, `${namespace}:${theme}`);
  const optionTraits = safeOptions && hasOwn(safeOptions, 'traits')
    ? safeOptions.traits
    : undefined;
  const traits = canonicalizeTraits(
    theme,
    optionTraits as Partial<ThemeTraits<T>> | undefined,
  );
  const params = internalThemes[theme].randomize(
    random,
    traits as Partial<ThemeParams<T>> | undefined,
  ) as ThemeParams<T>;
  return applyAvatarOptions(theme, params, safeOptions);
}

export function getDefaultParams<T extends ThemeName>(
  theme: T,
): ThemeParams<T> {
  assertThemeName(theme);
  const themeObject = internalThemes[theme];

  const params: Record<string, string | number> = {};
  for (const [key, definition] of Object.entries(themeObject.schema as ParamSchema)) {
    params[key] = definition.default;
  }
  return params as ThemeParams<T>;
}

export function createRecipe<T extends ThemeName>(
  theme: T,
  seed: Seed,
  options?: AvatarOptions<NoInfer<T>>,
): AvatarRecipe<T> {
  assertThemeName(theme);
  assertSeed(seed);
  const safeOptions = options === undefined
    ? undefined
    : snapshotAvatarOptions(theme, options);
  const canonicalSeed = typeof seed === 'number' && Object.is(seed, -0) ? 0 : seed;
  const namespace = safeOptions && hasOwn(safeOptions, 'namespace')
    ? safeOptions.namespace ?? 'default'
    : 'default';
  const palette = safeOptions && hasOwn(safeOptions, 'palette')
    ? safeOptions.palette
    : undefined;
  const backgroundShape = safeOptions && hasOwn(safeOptions, 'backgroundShape')
    ? safeOptions.backgroundShape
    : undefined;
  const optionTraits = safeOptions && hasOwn(safeOptions, 'traits')
    ? safeOptions.traits
    : undefined;
  const traits = canonicalizeTraits(
    theme,
    optionTraits as Partial<ThemeTraits<T>> | undefined,
  );
  return Object.freeze({
    format: 'avatarka',
    version: RECIPE_VERSION,
    theme,
    seed: canonicalSeed,
    namespace,
    ...(palette !== undefined ? { palette } : {}),
    ...(backgroundShape !== undefined
      ? { backgroundShape }
      : {}),
    ...(traits ? { traits } : {}),
  }) as AvatarRecipe<T>;
}

const recipeKeys = new Set([
  'format',
  'version',
  'theme',
  'seed',
  'namespace',
  'palette',
  'backgroundShape',
  'traits',
]);

export function parseRecipe<T extends ThemeName>(
  value: AvatarRecipe<T>,
): AvatarRecipe<T>;
export function parseRecipe(value: unknown): AvatarRecipe;
export function parseRecipe(value: unknown): AvatarRecipe {
  const recipe = snapshotRecord(value, 'Invalid avatar recipe');
  for (const key of ['format', 'version', 'theme', 'seed', 'namespace']) {
    if (!hasOwn(recipe, key)) throw new Error(`Missing avatar recipe field: ${key}`);
  }
  if (recipe.format !== 'avatarka') {
    throw new Error(`Unknown avatar recipe format: ${String(recipe.format)}`);
  }
  if (recipe.version !== RECIPE_VERSION) {
    throw new Error(
      `Unsupported avatar recipe version: ${String(recipe.version)} (expected ${RECIPE_VERSION})`,
    );
  }
  for (const key of Object.keys(recipe)) {
    if (!recipeKeys.has(key)) throw new Error(`Unknown avatar recipe field: ${key}`);
  }
  assertThemeName(recipe.theme);
  assertSeed(recipe.seed);
  assertNamespace(recipe.namespace);
  // Optional `undefined` is indistinguishable from omission after JSON
  // serialization and is accepted by TypeScript unless consumers enable
  // exactOptionalPropertyTypes. Canonicalize it to omission here as well.
  const hasPalette = hasOwn(recipe, 'palette') && recipe.palette !== undefined;
  const hasBackgroundShape = hasOwn(recipe, 'backgroundShape')
    && recipe.backgroundShape !== undefined;
  const hasTraits = hasOwn(recipe, 'traits') && recipe.traits !== undefined;
  if (hasPalette) assertPalette(recipe.palette);
  if (hasBackgroundShape) assertBackgroundShape(recipe.backgroundShape);
  const traits = hasTraits
    ? snapshotRecord(recipe.traits, `Invalid avatar traits for ${recipe.theme}`)
    : undefined;
  if (traits) assertTraits(recipe.theme, traits);

  const options = {
    namespace: recipe.namespace,
    ...(hasPalette ? { palette: recipe.palette as PaletteName } : {}),
    ...(hasBackgroundShape
      ? { backgroundShape: recipe.backgroundShape as BackgroundShape }
      : {}),
    ...(traits ? { traits } : {}),
  } as AvatarOptions<typeof recipe.theme>;
  return createRecipe(recipe.theme, recipe.seed, options);
}

function createFromRecipe<T extends ThemeName>(recipe: RecipeFor<T>): GeneratedFor<T> {
  const options = {
    namespace: recipe.namespace,
    ...(recipe.palette !== undefined ? { palette: recipe.palette } : {}),
    ...(recipe.backgroundShape !== undefined
      ? { backgroundShape: recipe.backgroundShape }
      : {}),
    ...(recipe.traits !== undefined ? { traits: recipe.traits } : {}),
  } as AvatarOptions<T>;
  const params = generateParams(recipe.theme, recipe.seed, options);
  const frozenParams = Object.freeze({ ...params }) as Readonly<ThemeParams<T>>;
  return Object.freeze({
    recipe,
    theme: recipe.theme,
    params: frozenParams,
    svg: renderAvatar(recipe.theme, params),
  });
}

export function createAvatar<T extends ThemeName>(
  theme: T,
  options?: AvatarOptions<NoInfer<T>>,
): GeneratedAvatar<T>;
export function createAvatar<T extends ThemeName>(
  theme: T,
  seed?: Seed,
  options?: AvatarOptions<NoInfer<T>>,
): GeneratedAvatar<T>;
export function createAvatar<T extends ThemeName>(
  recipe: AvatarRecipe<T>,
): GeneratedAvatar<T>;
export function createAvatar<T extends ThemeName>(
  input: T | AvatarRecipe<T>,
  seedOrOptions?: Seed | AvatarOptions<T>,
  maybeOptions?: AvatarOptions<T>,
): GeneratedAvatar<T> {
  if (typeof input !== 'string') {
    const recipe = parseRecipe(input) as RecipeFor<T>;
    return createFromRecipe(recipe) as GeneratedAvatar<T>;
  }

  assertThemeName(input);
  const seed = isRecord(seedOrOptions) || seedOrOptions === undefined
    ? createEntropySeed()
    : seedOrOptions;
  const options = (isRecord(seedOrOptions) ? seedOrOptions : maybeOptions) as
    | AvatarOptions<T>
    | undefined;
  return createFromRecipe(
    createRecipe(input, seed, options) as RecipeFor<T>,
  ) as GeneratedAvatar<T>;
}

export function getTheme<T extends ThemeName>(theme: T): ThemeMetadata<T> {
  assertThemeName(theme);
  return themes[theme] as unknown as ThemeMetadata<T>;
}

/** Returns the deeply frozen primary catalog axis for a built-in theme. */
export function getBaseTypeCatalog<T extends ThemeName>(
  theme: T,
): BaseTypeCatalog<T> {
  assertThemeName(theme);
  return baseTypeCatalogs[theme] as unknown as BaseTypeCatalog<T>;
}

const galleryOptionKeys = new Set([
  'themes',
  'namespace',
  'palette',
  'backgroundShape',
]);

function snapshotGalleryThemes(value: unknown): ThemeName[] {
  if (!Array.isArray(value)) throw new Error('Invalid gallery themes');
  const lengthDescriptor = Object.getOwnPropertyDescriptor(value, 'length');
  const length = lengthDescriptor && 'value' in lengthDescriptor
    ? lengthDescriptor.value as unknown
    : undefined;
  if (!Number.isSafeInteger(length) || (length as number) < 0) {
    throw new Error('Invalid gallery themes');
  }
  if ((length as number) > MAX_GALLERY_COUNT) {
    throw new Error(
      `Gallery themes must contain at most ${MAX_GALLERY_COUNT} items`,
    );
  }

  const themes: ThemeName[] = [];
  for (let index = 0; index < (length as number); index += 1) {
    const descriptor = Object.getOwnPropertyDescriptor(value, String(index));
    if (!descriptor) {
      throw new Error(`Invalid gallery themes: missing item at index ${index}`);
    }
    if (!('value' in descriptor)) {
      throw new Error(`Invalid gallery themes: accessor item at index ${index}`);
    }
    assertThemeName(descriptor.value);
    themes.push(descriptor.value);
  }
  return themes;
}

function validateGalleryOptions(
  options: unknown,
): { options: GalleryOptions; themes: ThemeName[] | undefined } {
  const snapshot = snapshotRecord(options, 'Invalid gallery options');
  for (const key of Object.keys(snapshot)) {
    if (!galleryOptionKeys.has(key)) throw new Error(`Unknown gallery option: ${key}`);
  }
  if (hasOwn(snapshot, 'namespace') && snapshot.namespace !== undefined) {
    assertNamespace(snapshot.namespace);
  }
  if (hasOwn(snapshot, 'palette') && snapshot.palette !== undefined) {
    assertPalette(snapshot.palette);
  }
  if (hasOwn(snapshot, 'backgroundShape') && snapshot.backgroundShape !== undefined) {
    assertBackgroundShape(snapshot.backgroundShape);
  }
  const themes = hasOwn(snapshot, 'themes') && snapshot.themes !== undefined
    ? snapshotGalleryThemes(snapshot.themes)
    : undefined;
  if (themes) snapshot.themes = themes;
  return {
    options: snapshot as GalleryOptions,
    themes,
  };
}

export function generateGallery<
  const Themes extends readonly ThemeName[],
>(
  count: number,
  options: GalleryOptionsWithThemes<Themes>,
): GeneratedAvatar<Themes[number]>[];
export function generateGallery<
  const Themes extends readonly ThemeName[],
>(
  count: number,
  seed: Seed,
  options: GalleryOptionsWithThemes<Themes>,
): GeneratedAvatar<Themes[number]>[];
export function generateGallery(
  count: number,
  options?: GalleryOptions,
): GeneratedAvatar[];
export function generateGallery(
  count: number,
  seed?: Seed,
  options?: GalleryOptions,
): GeneratedAvatar[];
export function generateGallery(
  count: number,
  seedOrOptions?: Seed | GalleryOptions,
  maybeOptions?: GalleryOptions,
): GeneratedAvatar[] {
  if (!Number.isSafeInteger(count) || count < 0 || count > MAX_GALLERY_COUNT) {
    throw new RangeError(
      `Gallery count must be an integer between 0 and ${MAX_GALLERY_COUNT}`,
    );
  }
  const seed = isRecord(seedOrOptions) ? undefined : seedOrOptions;
  const rawOptions = (isRecord(seedOrOptions) ? seedOrOptions : maybeOptions) as
    | GalleryOptions
    | undefined;
  if (seed !== undefined) assertSeed(seed);
  const validated = rawOptions === undefined
    ? undefined
    : validateGalleryOptions(rawOptions);
  const options = validated?.options;
  const validatedThemes = validated?.themes;

  const optionThemes = validatedThemes;
  const optionNamespace = options && hasOwn(options, 'namespace')
    ? options.namespace
    : undefined;
  const optionPalette = options && hasOwn(options, 'palette')
    ? options.palette
    : undefined;
  const optionBackgroundShape = options && hasOwn(options, 'backgroundShape')
    ? options.backgroundShape
    : undefined;

  const requestedThemeSet = new Set<ThemeName>(
    optionThemes ?? themeNames,
  );
  const requestedThemes = themeNames.filter((theme) => (
    requestedThemeSet.has(theme)
  ));
  if (requestedThemes.length === 0) {
    throw new Error('Gallery requires at least one theme');
  }
  if (count === 0) return [];

  const namespace = optionNamespace ?? 'default';
  const random = createAvatarRandom(seed, `${namespace}:gallery`);
  const themeOrder = random.shuffle('theme-order', requestedThemes);
  const items: GeneratedAvatar[] = [];
  const themeOccurrences = new Map<ThemeName, number>();
  const usedSignaturesByTheme = new Map<ThemeName, Set<string>>();
  const baseTypeSchedules = new Map<ThemeName, {
    readonly param: string;
    readonly values: readonly string[];
  }>();
  const balanceValueCounts = new Map<string, number>();
  const paletteSchedule = optionPalette
    ? undefined
    : createPaletteSchedule(count, random);

  for (const [themeIndex, theme] of themeOrder.entries()) {
    const occurrenceCount = themeIndex < count
      ? Math.floor((count - 1 - themeIndex) / themeOrder.length) + 1
      : 0;
    const catalog = getBaseTypeCatalog(theme);
    const baseTypeParam = internalThemes[theme].baseTypeParam as string;
    if (catalog.param !== baseTypeParam) {
      throw new Error(`Invalid avatar base type parameter for ${theme}: ${baseTypeParam}`);
    }
    baseTypeSchedules.set(theme, {
      param: baseTypeParam,
      values: createBaseTypeSchedule(
        theme,
        catalog.values,
        occurrenceCount,
        random,
      ),
    });
  }

  for (let index = 0; index < count; index++) {
    const theme = themeOrder[index % themeOrder.length]!;
    const occurrence = themeOccurrences.get(theme) ?? 0;
    themeOccurrences.set(theme, occurrence + 1);

    const baseTypeSchedule = baseTypeSchedules.get(theme);
    if (!baseTypeSchedule) throw new Error(`Missing base-type schedule for ${theme}`);
    const { param: baseTypeParam } = baseTypeSchedule;
    const targetBaseType = baseTypeSchedule.values[occurrence];
    if (targetBaseType === undefined) {
      throw new Error(`Missing base type for ${theme} occurrence ${occurrence}`);
    }

    const itemNamespace = `${namespace}:gallery-item:${index}`;
    const targetPalette = optionPalette ?? paletteSchedule![index]!;
    const presentation = {
      namespace: itemNamespace,
      palette: targetPalette,
      ...(optionBackgroundShape ? { backgroundShape: optionBackgroundShape } : {}),
    } as AvatarOptions<typeof theme>;
    const baseTypeTraits = {
      [baseTypeParam]: targetBaseType,
    } as Partial<ThemeTraits<typeof theme>>;
    // Folks keeps four extra independent secondary-trait candidates so its
    // skin-tone and feature balance retains the reviewed 5x5 rhythm. Every
    // theme still performs one small, fixed amount of work per gallery item.
    const candidatePoolSize = theme === 'folks'
      ? FOLKS_GALLERY_CANDIDATE_POOL_SIZE
      : GALLERY_CANDIDATE_POOL_SIZE;
    // Palette and frame are presentation-only. Candidate identities therefore
    // depend exclusively on the gallery seed and semantic balancing, whether
    // callers request one palette or the built-in mixed schedule.
    type Candidate = {
      recipe: AvatarRecipe<typeof theme>;
      params: ThemeParams<typeof theme>;
      signature: string;
      score: number;
    };
    const candidates: Candidate[] = [];
    const usedThemeSignatures = usedSignaturesByTheme.get(theme) ?? new Set<string>();
    usedSignaturesByTheme.set(theme, usedThemeSignatures);

    const candidateSeeds = createGalleryCandidateSeeds(
      index,
      candidatePoolSize,
      random,
    );
    for (const itemSeed of candidateSeeds) {
      const candidateRecipe = createRecipe(theme, itemSeed, {
        ...presentation,
        traits: baseTypeTraits,
      });
      const candidateParams = generateParams(theme, itemSeed, {
        ...presentation,
        traits: baseTypeTraits,
      });
      const signature = galleryIdentitySignature(candidateParams);
      const candidate: Candidate = {
        recipe: candidateRecipe,
        params: candidateParams,
        signature,
        score: scoreGalleryCandidate(
          theme,
          candidateParams,
          balanceValueCounts,
          items,
        ),
      };
      candidates.push(candidate);
    }

    const selected = selectGalleryCandidate(candidates, usedThemeSignatures);
    usedThemeSignatures.add(selected.signature);

    const frozenParams = Object.freeze({ ...selected.params }) as Readonly<
      ThemeParams<typeof theme>
    >;
    const identity = Object.freeze({
      recipe: selected.recipe,
      theme,
      params: frozenParams,
      svg: renderAvatar(theme, selected.params),
    }) as GeneratedFor<typeof theme>;
    items.push(identity as GeneratedAvatar);
    rememberGalleryBalance(theme, identity.params, balanceValueCounts);
  }

  return items;
}

export type {
  FolksParams,
  AdventurersParams,
  CrittersParams,
  OddlingsParams,
  BotsParams,
  SnacksParams,
  NooksParams,
  OrbsParams,
};
