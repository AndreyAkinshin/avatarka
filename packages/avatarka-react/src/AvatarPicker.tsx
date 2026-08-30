import {
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  createAvatar,
  generateGallery,
  getPalette,
  getTheme,
  paletteNames,
  themeNames,
  type AvatarRecipe,
  type BackgroundShape,
  type GeneratedAvatar,
  type PaletteName,
  type Seed,
  type ThemeName,
} from 'avatarka';
import { svgToPng } from 'avatarka/browser';
import { svgDataUrl } from './svg';

export type AvatarPickerPalette = PaletteName | 'mixed';

export type AvatarPickerStyle = CSSProperties & {
  '--avatarka-picker-bg'?: string;
  '--avatarka-picker-surface'?: string;
  '--avatarka-picker-text'?: string;
  '--avatarka-picker-muted'?: string;
  '--avatarka-picker-border'?: string;
  '--avatarka-picker-accent'?: string;
  '--avatarka-picker-focus'?: string;
  '--avatarka-picker-placeholder'?: string;
};

export interface AvatarGalleryRequest {
  readonly theme: ThemeName;
  readonly count: number;
  readonly seed: Seed;
  readonly namespace: string;
  readonly backgroundShape: BackgroundShape;
}

export type AvatarGalleryLoader = (
  request: AvatarGalleryRequest,
  signal: AbortSignal,
) => Promise<readonly GeneratedAvatar[]>;

export type AvatarPickerErrorOperation =
  | 'gallery'
  | 'svg-download'
  | 'png-download';

export type AvatarPickerErrorContext =
  | {
      readonly operation: 'gallery';
      readonly request: Readonly<AvatarGalleryRequest>;
    }
  | {
      readonly operation: 'svg-download' | 'png-download';
      readonly avatar: GeneratedAvatar;
    };

/** Partial overrides merged over the default SVG + PNG download actions. */
export interface AvatarPickerDownloads {
  /** Show the SVG download action. */
  svg?: boolean;
  /** Show the PNG download action. */
  png?: boolean;
  /** PNG width and height in pixels. Defaults to 512. */
  pngSize?: number;
}

export interface AvatarPickerProps {
  /** Controlled selected recipe. */
  value?: AvatarRecipe;
  /** Initial selected recipe for an uncontrolled picker. */
  defaultValue?: AvatarRecipe;
  /**
   * Called with a complete reproducible avatar whenever the selection changes.
   * Callback exceptions are not caught or reported through `onError`.
   */
  onChange?: (avatar: GeneratedAvatar) => void;
  /**
   * Called when the user browses to a different category.
   * Controlled recipes and other picker updates do not invoke this callback.
   * Callback exceptions are not caught or reported through `onError`.
   */
  onThemeChange?: (theme: ThemeName) => void;
  /** Reports gallery and built-in download failures with their operation context. */
  onError?: (error: Error, context: AvatarPickerErrorContext) => void;
  /** Initial category when no value is supplied. Defaults to Folks. */
  defaultTheme?: ThemeName;
  /** Initial palette browsing mode. Defaults to Mixed. */
  defaultPalette?: AvatarPickerPalette;
  /** Stable seed used to build picker galleries. */
  gallerySeed?: Seed;
  /** Optional identity scope used by generated gallery recipes. */
  namespace?: string;
  /** Frame used by generated gallery avatars. */
  backgroundShape?: BackgroundShape;
  /** Number of mounted choices, from 1 through 100. Defaults to 25. */
  count?: number;
  /**
   * Number of rendered gallery columns and keyboard row stride. Must be an
   * integer from 1 through `count`; defaults to `ceil(sqrt(count))`.
   */
  galleryColumns?: number;
  /**
   * Async gallery implementation. Applications can inject a Web Worker loader;
   * the default yields the first paint and then generates on the main thread.
   * Custom results are regenerated and checked against their recipes.
   */
  loadGallery?: AvatarGalleryLoader;
  /** Built-in downloads. `true` enables SVG and PNG; defaults to `true`. */
  downloads?: boolean | AvatarPickerDownloads;
  /** Optional extra controls rendered at the end of the palette row. */
  paletteAccessory?: ReactNode;
  /** Optional content rendered at the bottom of the preview panel. */
  footerAccessory?: ReactNode;
  className?: string;
  style?: AvatarPickerStyle;
}

interface ResolvedDownloads {
  svg: boolean;
  png: boolean;
  pngSize: number;
}

interface PickerFailure {
  readonly id: number;
  readonly error: Error;
  readonly context: AvatarPickerErrorContext;
}

interface PendingSelection {
  readonly id: number;
  readonly avatar: GeneratedAvatar;
}

const GALLERY_CACHE_LIMIT = 8;
const MAX_PICKER_COUNT = 100;

function abortError(): DOMException {
  return new DOMException('Avatar gallery generation was aborted', 'AbortError');
}

function yieldToBrowser(signal: AbortSignal): Promise<void> {
  if (signal.aborted) return Promise.reject(abortError());

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, 0);
    const handleAbort = () => {
      clearTimeout(timer);
      reject(abortError());
    };
    signal.addEventListener('abort', handleAbort, { once: true });
  });
}

/** Default async loader used when an application does not provide a Worker. */
export async function defaultLoadAvatarGallery(
  request: AvatarGalleryRequest,
  signal: AbortSignal,
): Promise<readonly GeneratedAvatar[]> {
  await yieldToBrowser(signal);
  if (signal.aborted) throw abortError();

  const gallery = generateGallery(request.count, request.seed, {
    themes: [request.theme],
    namespace: request.namespace,
    backgroundShape: request.backgroundShape,
  });
  if (signal.aborted) throw abortError();
  return gallery;
}

function resolveDownloads(
  downloads: AvatarPickerProps['downloads'],
): ResolvedDownloads {
  if (downloads === false) return { svg: false, png: false, pngSize: 512 };
  if (downloads === true || downloads === undefined) {
    return { svg: true, png: true, pngSize: 512 };
  }
  return {
    svg: downloads.svg ?? true,
    png: downloads.png ?? true,
    pngSize: downloads.pngSize ?? 512,
  };
}

function asError(reason: unknown, fallbackMessage: string): Error {
  return reason instanceof Error ? reason : new Error(fallbackMessage);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function snapshotDataRecord(value: unknown): Record<string, unknown> | undefined {
  if (!isRecord(value)) return undefined;
  const snapshot: Record<string, unknown> = Object.create(null);
  for (const key of Object.keys(value)) {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (!descriptor || !('value' in descriptor)) return undefined;
    snapshot[key] = descriptor.value;
  }
  return snapshot;
}

function paramsMatch(actual: unknown, expected: object): boolean {
  const actualSnapshot = snapshotDataRecord(actual);
  if (!actualSnapshot) return false;
  const expectedEntries = Object.entries(expected);
  const actualKeys = Object.keys(actualSnapshot);
  return actualKeys.length === expectedEntries.length
    && expectedEntries.every(([key, value]) => actualSnapshot[key] === value);
}

function validateGalleryResult(
  result: readonly GeneratedAvatar[],
  request: AvatarGalleryRequest,
  canonicalize: boolean,
): readonly GeneratedAvatar[] {
  if (!Array.isArray(result)) {
    throw new Error('Avatar gallery loader returned a non-array result');
  }
  const lengthDescriptor = Object.getOwnPropertyDescriptor(result, 'length');
  const resultLength = lengthDescriptor && 'value' in lengthDescriptor
    ? lengthDescriptor.value as unknown
    : undefined;
  if (resultLength !== request.count) {
    throw new Error(
      `Avatar gallery loader returned ${resultLength} items; expected ${request.count}`,
    );
  }

  const items: GeneratedAvatar[] = [];
  const recipeIndexes = new Map<string, number>();
  for (let index = 0; index < (resultLength as number); index += 1) {
    const itemDescriptor = Object.getOwnPropertyDescriptor(result, String(index));
    if (!itemDescriptor) {
      throw new Error(
        `Avatar gallery loader returned a sparse result with no item at index ${index}`,
      );
    }
    if (!('value' in itemDescriptor)) {
      throw new Error(
        `Avatar gallery loader returned an accessor item at index ${index}`,
      );
    }
    const item = snapshotDataRecord(itemDescriptor.value);
    if (!item) {
      throw new Error(`Avatar gallery loader returned an invalid item at index ${index}`);
    }
    if (item.theme !== request.theme) {
      throw new Error(
        `Avatar gallery loader returned an item outside the ${request.theme} theme at index ${index}`,
      );
    }
    if (!canonicalize) {
      items.push(itemDescriptor.value as GeneratedAvatar);
      continue;
    }

    let canonical: GeneratedAvatar;
    try {
      canonical = createAvatar(item.recipe as AvatarRecipe);
    } catch (reason) {
      const detail = asError(reason, 'invalid recipe').message;
      throw new Error(
        `Avatar gallery loader returned an invalid recipe at index ${index}: ${detail}`,
      );
    }

    const canonicalRecipeKey = recipeKey(canonical.recipe);
    const duplicateIndex = recipeIndexes.get(canonicalRecipeKey);
    if (duplicateIndex !== undefined) {
      throw new Error(
        `Avatar gallery loader returned a duplicate recipe at index ${index} (already used at index ${duplicateIndex})`,
      );
    }
    recipeIndexes.set(canonicalRecipeKey, index);

    const expectedNamespace = `${request.namespace}:gallery-item:${index}`;
    if (canonical.recipe.namespace !== expectedNamespace) {
      throw new Error(
        `Avatar gallery loader returned namespace ${canonical.recipe.namespace} at index ${index}; expected ${expectedNamespace}`,
      );
    }
    if (canonical.recipe.backgroundShape !== request.backgroundShape) {
      throw new Error(
        `Avatar gallery loader returned background shape ${String(canonical.recipe.backgroundShape)} at index ${index}; expected ${request.backgroundShape}`,
      );
    }

    if (
      canonical.theme !== item.theme
      || !paramsMatch(item.params, canonical.params)
      || item.svg !== canonical.svg
    ) {
      throw new Error(
        `Avatar gallery loader returned a non-canonical avatar at index ${index}`,
      );
    }
    items.push(canonical);
  }

  return Object.freeze(items);
}

function readGalleryCache(
  cache: Map<string, readonly GeneratedAvatar[]>,
  key: string,
): readonly GeneratedAvatar[] | undefined {
  const cached = cache.get(key);
  if (!cached) return undefined;
  cache.delete(key);
  cache.set(key, cached);
  return cached;
}

function writeGalleryCache(
  cache: Map<string, readonly GeneratedAvatar[]>,
  key: string,
  gallery: readonly GeneratedAvatar[],
): void {
  cache.delete(key);
  cache.set(key, gallery);
  while (cache.size > GALLERY_CACHE_LIMIT) {
    const oldestKey = cache.keys().next().value as string | undefined;
    if (oldestKey === undefined) break;
    cache.delete(oldestKey);
  }
}

function generatedSeed(seed: Seed, generation: number): Seed {
  if (generation === 0) return seed;
  return `${typeof seed}:${String(seed)}:generation:${generation}`;
}

function requestKey(request: AvatarGalleryRequest): string {
  return JSON.stringify(request);
}

function recipeKey(recipe: AvatarRecipe): string {
  return JSON.stringify(recipe);
}

function applyPalette(
  avatar: GeneratedAvatar,
  palette: AvatarPickerPalette,
): GeneratedAvatar {
  if (palette === 'mixed' || avatar.recipe.palette === palette) return avatar;
  const recipe = { ...avatar.recipe, palette } satisfies AvatarRecipe;
  return createAvatar(recipe);
}

function removeForcedPalette(avatar: GeneratedAvatar): GeneratedAvatar {
  if (avatar.recipe.palette === undefined) return avatar;
  const { palette: _removedPalette, ...recipe } = avatar.recipe;
  return createAvatar(recipe);
}

function galleryLabel(item: GeneratedAvatar, index: number): string {
  return `${getTheme(item.theme).name} avatar ${index + 1}`;
}

function downloadBlob(blob: Blob, filename: string): void {
  let url: string | undefined;
  let anchor: HTMLAnchorElement | undefined;
  try {
    url = URL.createObjectURL(blob);
    anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
  } finally {
    anchor?.remove();
    if (url !== undefined) {
      const objectUrl = url;
      setTimeout(() => {
        try {
          URL.revokeObjectURL(objectUrl);
        } catch {
          // Cleanup errors do not change the completed download operation.
        }
      }, 0);
    }
  }
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M4 20h16" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

interface SvgImageProps {
  className: string;
  svg: string;
}

const SvgImage = memo(function SvgImage({ className, svg }: SvgImageProps) {
  const src = useMemo(() => svgDataUrl(svg), [svg]);
  return (
    <img
      className={className}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
    />
  );
});

export const AvatarPicker = memo(function AvatarPicker({
  value,
  defaultValue,
  onChange,
  onThemeChange,
  onError,
  defaultTheme = 'folks',
  defaultPalette = 'mixed',
  gallerySeed = 'avatarka-picker',
  namespace = 'default',
  backgroundShape = 'circle',
  count = 25,
  galleryColumns,
  loadGallery = defaultLoadAvatarGallery,
  downloads = true,
  paletteAccessory,
  footerAccessory,
  className,
  style,
}: AvatarPickerProps) {
  if (!Number.isSafeInteger(count) || count <= 0 || count > MAX_PICKER_COUNT) {
    throw new RangeError(
      `AvatarPicker count must be an integer between 1 and ${MAX_PICKER_COUNT}`,
    );
  }
  const resolvedGalleryColumns = galleryColumns
    ?? Math.max(1, Math.ceil(Math.sqrt(count)));
  if (
    !Number.isSafeInteger(resolvedGalleryColumns)
    || resolvedGalleryColumns <= 0
    || resolvedGalleryColumns > count
  ) {
    throw new RangeError(
      'AvatarPicker galleryColumns must be an integer between 1 and count',
    );
  }

  const initialRecipe = value ?? defaultValue;
  const [theme, setTheme] = useState<ThemeName>(
    () => initialRecipe?.theme ?? defaultTheme,
  );
  const [palette, setPalette] = useState<AvatarPickerPalette>(
    () => initialRecipe?.palette ?? defaultPalette,
  );
  const [generation, setGeneration] = useState(0);
  const [retryToken, setRetryToken] = useState(0);
  const [diceRoll, setDiceRoll] = useState(0);
  const [gallery, setGallery] = useState<readonly GeneratedAvatar[]>([]);
  const [previousGallery, setPreviousGallery] = useState<readonly GeneratedAvatar[] | null>(null);
  const [galleryTransition, setGalleryTransition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [uncontrolledRecipe, setUncontrolledRecipe] = useState<AvatarRecipe | undefined>(
    defaultValue,
  );
  const [isGenerating, setIsGenerating] = useState(true);
  const [galleryFailure, setGalleryFailure] = useState<PickerFailure | null>(null);
  const [downloadFailure, setDownloadFailure] = useState<PickerFailure | null>(null);
  const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null);
  const [isSavingPng, setIsSavingPng] = useState(false);
  const galleryId = useId();

  const onChangeRef = useRef(onChange);
  const onThemeChangeRef = useRef(onThemeChange);
  const onErrorRef = useRef(onError);
  const valueRef = useRef(value);
  const paletteRef = useRef(palette);
  const galleryRef = useRef<readonly GeneratedAvatar[]>([]);
  const galleryButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const galleryCache = useRef(new Map<string, readonly GeneratedAvatar[]>());
  const requestIdRef = useRef(0);
  const failureIdRef = useRef(0);
  const selectionIdRef = useRef(0);
  const notifiedGalleryFailureIdRef = useRef(0);
  const notifiedDownloadFailureIdRef = useRef(0);
  const notifiedSelectionIdRef = useRef(0);
  const transitionIdRef = useRef(0);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectAfterLoadRef = useRef(initialRecipe === undefined);

  const selectedRecipe = value ?? uncontrolledRecipe;
  const selected = useMemo(
    () => selectedRecipe ? createAvatar(selectedRecipe) : null,
    [selectedRecipe],
  );
  const selectedKey = selected ? recipeKey(selected.recipe) : null;
  const controlledValueKey = value === undefined ? null : selectedKey;
  const [syncedControlledValueKey, setSyncedControlledValueKey] =
    useState<string | null>(controlledValueKey);

  if (syncedControlledValueKey !== controlledValueKey) {
    setSyncedControlledValueKey(controlledValueKey);
    if (value !== undefined) {
      setTheme(value.theme);
      setPalette(value.palette ?? 'mixed');
    }
  }

  const galleryRequest = useMemo<AvatarGalleryRequest>(() => Object.freeze({
    theme,
    count,
    seed: generatedSeed(gallerySeed, generation),
    namespace,
    backgroundShape,
  }), [backgroundShape, count, gallerySeed, generation, namespace, theme]);
  const galleryRequestKey = requestKey(galleryRequest);
  const galleryLoadIdentity = galleryRequestKey;
  const latestGalleryLoadIdentityRef = useRef(galleryLoadIdentity);
  const latestLoadGalleryRef = useRef(loadGallery);

  const publishCommittedValues = useCallback((element: HTMLDivElement | null) => {
    if (element === null) return;
    onChangeRef.current = onChange;
    onThemeChangeRef.current = onThemeChange;
    onErrorRef.current = onError;
    valueRef.current = value;
    paletteRef.current = palette;
    latestGalleryLoadIdentityRef.current = galleryLoadIdentity;
    latestLoadGalleryRef.current = loadGallery;
  }, [galleryLoadIdentity, loadGallery, onChange, onError, onThemeChange, palette, value]);

  const resolvedDownloads = useMemo(() => resolveDownloads(downloads), [downloads]);

  const displayGallery = useMemo(
    () => gallery.map((item) => applyPalette(item, palette)),
    [gallery, palette],
  );
  const previousDisplayGallery = useMemo(
    () => previousGallery?.map((item) => applyPalette(item, palette)) ?? null,
    [palette, previousGallery],
  );
  const selectedGalleryIndex = useMemo(
    () => selectedKey === null
      ? -1
      : displayGallery.findIndex((item) => recipeKey(item.recipe) === selectedKey),
    [displayGallery, selectedKey],
  );
  const rovingIndex = selectedGalleryIndex >= 0 ? selectedGalleryIndex : selectedIndex;

  const reportError = useCallback((
    error: Error,
    context: AvatarPickerErrorContext,
  ) => {
    failureIdRef.current += 1;
    const nextFailure = { id: failureIdRef.current, error, context };
    if (context.operation === 'gallery') {
      setGalleryFailure(nextFailure);
    } else {
      setDownloadFailure(nextFailure);
    }
  }, []);

  const selectAvatar = useCallback((
    avatar: GeneratedAvatar,
    notify: 'sync' | 'deferred' | false = 'sync',
  ) => {
    if (valueRef.current === undefined) setUncontrolledRecipe(avatar.recipe);
    if (notify === 'sync') onChangeRef.current?.(avatar);
    if (notify === 'deferred') {
      selectionIdRef.current += 1;
      setPendingSelection({ id: selectionIdRef.current, avatar });
    }
  }, []);

  useEffect(() => {
    if (
      !pendingSelection
      || notifiedSelectionIdRef.current === pendingSelection.id
    ) return;
    notifiedSelectionIdRef.current = pendingSelection.id;
    onChangeRef.current?.(pendingSelection.avatar);
  }, [pendingSelection]);

  useEffect(() => {
    if (
      !galleryFailure
      || notifiedGalleryFailureIdRef.current === galleryFailure.id
    ) return;
    notifiedGalleryFailureIdRef.current = galleryFailure.id;
    onErrorRef.current?.(galleryFailure.error, galleryFailure.context);
  }, [galleryFailure]);

  useEffect(() => {
    if (
      !downloadFailure
      || notifiedDownloadFailureIdRef.current === downloadFailure.id
    ) return;
    notifiedDownloadFailureIdRef.current = downloadFailure.id;
    onErrorRef.current?.(downloadFailure.error, downloadFailure.context);
  }, [downloadFailure]);

  const finishGalleryTransition = useCallback(() => {
    transitionIdRef.current += 1;
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }
    setPreviousGallery(null);
  }, []);

  const commitGallery = useCallback((nextGallery: readonly GeneratedAvatar[]) => {
    const reduceMotion = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const currentGallery = galleryRef.current;
    const currentPalette = paletteRef.current;

    finishGalleryTransition();
    if (!reduceMotion && currentGallery.length > 0) {
      setPreviousGallery(currentGallery);
      const transitionId = transitionIdRef.current + 1;
      transitionIdRef.current = transitionId;
      setGalleryTransition(transitionId);
      transitionTimeoutRef.current = setTimeout(() => {
        if (transitionIdRef.current !== transitionId) return;
        setPreviousGallery(null);
        transitionTimeoutRef.current = null;
      }, 360);
    }

    galleryRef.current = nextGallery;
    setGallery(nextGallery);

    setSelectedIndex(0);
    const first = nextGallery[0];
    if (
      first
      && selectAfterLoadRef.current
      && valueRef.current === undefined
    ) {
      selectAvatar(applyPalette(first, currentPalette), 'deferred');
    }
    selectAfterLoadRef.current = false;
  }, [finishGalleryTransition, selectAvatar]);

  useEffect(() => {
    return () => {
      requestIdRef.current += 1;
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    galleryCache.current.clear();
  }, [loadGallery]);

  const failGallery = useCallback((
    reason: unknown,
    request: AvatarGalleryRequest,
  ) => {
    const error = asError(reason, 'Unable to generate avatar gallery');
    finishGalleryTransition();
    galleryRef.current = [];
    setGallery([]);
    setSelectedIndex(0);
    setIsGenerating(false);
    reportError(error, {
      operation: 'gallery',
      request: Object.freeze({ ...request }),
    });
  }, [finishGalleryTransition, reportError]);

  useEffect(() => {
    const request = galleryRequest;
    const key = galleryRequestKey;
    const loadIdentity = galleryLoadIdentity;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const controller = new AbortController();
    const isStale = () => (
      controller.signal.aborted
      || requestId !== requestIdRef.current
      || loadIdentity !== latestGalleryLoadIdentityRef.current
      || loadGallery !== latestLoadGalleryRef.current
    );

    setIsGenerating(true);
    setGalleryFailure(null);

    const cached = readGalleryCache(galleryCache.current, key);
    let pending: Promise<readonly GeneratedAvatar[]>;
    try {
      pending = cached
        ? Promise.resolve(cached)
        : Promise.resolve(loadGallery(request, controller.signal));
    } catch (reason) {
      pending = Promise.reject(reason);
    }

    void pending.then((loadedGallery) => {
      if (isStale()) return;

      let nextGallery: readonly GeneratedAvatar[];
      try {
        nextGallery = validateGalleryResult(
          loadedGallery,
          request,
          !cached && loadGallery !== defaultLoadAvatarGallery,
        );
      } catch (reason) {
        failGallery(reason, request);
        return;
      }

      writeGalleryCache(galleryCache.current, key, nextGallery);
      commitGallery(nextGallery);
      setIsGenerating(false);
    }, (reason: unknown) => {
      if (isStale()) return;
      failGallery(reason, request);
    });

    return () => controller.abort();
  }, [commitGallery, failGallery, galleryLoadIdentity, galleryRequest, galleryRequestKey, loadGallery, retryToken]);

  const beginGalleryChange = useCallback(() => {
    requestIdRef.current += 1;
    finishGalleryTransition();
    setIsGenerating(true);
    setGalleryFailure(null);
    setDownloadFailure(null);
    setSelectedIndex(0);
    selectAfterLoadRef.current = true;
  }, [finishGalleryTransition]);

  const retryGallery = useCallback(() => {
    requestIdRef.current += 1;
    finishGalleryTransition();
    setIsGenerating(true);
    setGalleryFailure(null);
    setRetryToken((current) => current + 1);
  }, [finishGalleryTransition]);

  const handlePaletteChange = useCallback((nextPalette: AvatarPickerPalette) => {
    if (nextPalette === palette) return;
    setDownloadFailure(null);
    setPalette(nextPalette);

    const naturalAvatar = selectedGalleryIndex >= 0
      ? gallery[selectedGalleryIndex]
      : selected
        ? removeForcedPalette(selected)
        : gallery[selectedIndex];
    if (naturalAvatar) selectAvatar(applyPalette(naturalAvatar, nextPalette));
  }, [gallery, palette, selectAvatar, selected, selectedGalleryIndex, selectedIndex]);

  const handleGallerySelect = useCallback((item: GeneratedAvatar, index: number) => {
    setDownloadFailure(null);
    setSelectedIndex(index);
    selectAvatar(item);
  }, [selectAvatar]);

  const handleGalleryKeyDown = useCallback((
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % displayGallery.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index - 1 + displayGallery.length) % displayGallery.length;
        break;
      case 'ArrowDown':
        nextIndex = Math.min(index + resolvedGalleryColumns, displayGallery.length - 1);
        break;
      case 'ArrowUp':
        nextIndex = Math.max(index - resolvedGalleryColumns, 0);
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = displayGallery.length - 1;
        break;
    }

    if (nextIndex === null || nextIndex < 0) return;
    event.preventDefault();
    const next = displayGallery[nextIndex];
    if (next) handleGallerySelect(next, nextIndex);
    galleryButtons.current[nextIndex]?.focus();
  }, [displayGallery, handleGallerySelect, resolvedGalleryColumns]);

  const saveSvg = useCallback(() => {
    if (!selected) return;
    setDownloadFailure(null);
    try {
      downloadBlob(
        new Blob([selected.svg], { type: 'image/svg+xml;charset=utf-8' }),
        `avatarka-${selected.theme}.svg`,
      );
    } catch (reason) {
      reportError(asError(reason, 'Unable to export SVG'), {
        operation: 'svg-download',
        avatar: selected,
      });
    }
  }, [reportError, selected]);

  const savePng = useCallback(async () => {
    if (!selected || isSavingPng) return;
    setIsSavingPng(true);
    setDownloadFailure(null);
    try {
      const blob = await svgToPng(selected.svg, { size: resolvedDownloads.pngSize });
      downloadBlob(blob, `avatarka-${selected.theme}.png`);
    } catch (reason) {
      reportError(asError(reason, 'Unable to export PNG'), {
        operation: 'png-download',
        avatar: selected,
      });
    } finally {
      setIsSavingPng(false);
    }
  }, [isSavingPng, reportError, resolvedDownloads.pngSize, selected]);

  const mixedPaletteBackground = useMemo(() => {
    const segment = 100 / paletteNames.length;
    const stops = paletteNames.map((name, index) => (
      `${getPalette(name).primary} ${index * segment}% ${(index + 1) * segment}%`
    ));
    return `conic-gradient(from -45deg, ${stops.join(', ')})`;
  }, []);

  const rootStyle = {
    ...style,
    '--avatarka-picker-columns': resolvedGalleryColumns,
  } as CSSProperties;
  const themeName = getTheme(theme).name;
  const galleryFailed = galleryFailure !== null;
  const failures = [galleryFailure, downloadFailure].filter(
    (item): item is PickerFailure => item !== null,
  );
  const status = isGenerating
    ? `Generating ${themeName} gallery`
    : galleryFailed
      ? `${themeName} gallery unavailable`
      : `${themeName} gallery ready`;

  return (
    <div
      ref={publishCommittedValues}
      className={`avatarka-picker ${className ?? ''}`.trim()}
      style={rootStyle}
      data-generating={isGenerating ? 'true' : 'false'}
    >
      <div className="avatarka-picker__themes" role="group" aria-label="Avatar category">
        {themeNames.map((name) => (
          <button
            type="button"
            key={name}
            className={name === theme ? 'is-active' : ''}
            onClick={() => {
              if (name === theme) return;
              beginGalleryChange();
              setTheme(name);
              onThemeChangeRef.current?.(name);
            }}
            aria-pressed={name === theme}
          >
            {getTheme(name).name}
          </button>
        ))}
      </div>

      <div className="avatarka-picker__palette-row" role="group" aria-label="Avatar palette">
        <span>Palette</span>
        <button
          type="button"
          className={`avatarka-picker__palette avatarka-picker__palette--mixed ${palette === 'mixed' ? 'is-active' : ''}`}
          style={{ background: mixedPaletteBackground }}
          onClick={() => handlePaletteChange('mixed')}
          aria-pressed={palette === 'mixed'}
          aria-label="Mixed palettes"
          title="Mixed palettes"
        />
        {paletteNames.map((name) => {
          const colors = getPalette(name);
          return (
            <button
              type="button"
              key={name}
              className={`avatarka-picker__palette ${palette === name ? 'is-active' : ''}`}
              style={{
                background: `conic-gradient(from -45deg, ${colors.primary} 0 42%, ${colors.accent} 42% 72%, ${colors.secondary} 72% 100%)`,
              }}
              onClick={() => handlePaletteChange(name)}
              aria-pressed={palette === name}
              aria-label={`${colors.name} palette`}
              title={colors.name}
            />
          );
        })}
        {paletteAccessory}
      </div>

      <span className="avatarka-picker__status" role="status" aria-live="polite">
        {status}
      </span>

      {failures.map((failure) => (
        <div className="avatarka-picker__error" role="alert" key={failure.id}>
          <span>
            {failure.context.operation === 'gallery' ? 'Gallery unavailable.' : 'Download failed.'}
            {' '}
            {failure.error.message || 'The operation could not be completed.'}
          </span>
          {failure.context.operation === 'gallery' ? (
            <button
              type="button"
              onClick={retryGallery}
              aria-controls={galleryId}
            >
              Retry
            </button>
          ) : null}
        </div>
      ))}

      <div
        id={galleryId}
        className={`avatarka-picker__gallery ${isGenerating ? 'is-generating' : ''} ${galleryFailed ? 'has-error' : ''}`.trim()}
        role="radiogroup"
        aria-label={`${themeName} gallery`}
        aria-busy={isGenerating}
      >
        {displayGallery.length === 0
          ? Array.from({ length: count }, (_, index) => (
              <span
                key={index}
                className="avatarka-picker__placeholder"
                data-background-shape={backgroundShape}
                aria-hidden="true"
              />
            ))
          : displayGallery.map((item, index) => {
              const itemKey = recipeKey(item.recipe);
              const isSelected = selectedKey !== null && itemKey === selectedKey;
              return (
                <button
                  type="button"
                  key={index}
                  ref={(element) => {
                    galleryButtons.current[index] = element;
                  }}
                  className={`avatarka-picker__gallery-item ${isSelected ? 'is-selected' : ''}`}
                  data-background-shape={item.params.backgroundShape}
                  onClick={() => handleGallerySelect(item, index)}
                  onKeyDown={(event) => handleGalleryKeyDown(event, index)}
                  disabled={isGenerating}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={galleryLabel(item, index)}
                  tabIndex={!isGenerating && index === rovingIndex ? 0 : -1}
                  title={`${getTheme(item.theme).name} ${index + 1}`}
                >
                  {previousDisplayGallery?.[index] ? (
                    <SvgImage
                      className="avatarka-picker__art avatarka-picker__art--outgoing"
                      svg={previousDisplayGallery[index]!.svg}
                    />
                  ) : null}
                  <SvgImage
                    key={galleryTransition}
                    className={`avatarka-picker__art ${previousDisplayGallery ? 'avatarka-picker__art--incoming' : ''}`}
                    svg={item.svg}
                  />
                </button>
              );
            })}
      </div>

      <div className="avatarka-picker__preview-panel">
        <div className="avatarka-picker__preview-row">
          {[96, 40, 24].map((size) => (
            <div
              key={size}
              className={`avatarka-picker__preview ${selected ? '' : 'is-empty'}`}
              data-background-shape={selected?.params.backgroundShape ?? backgroundShape}
              aria-hidden="true"
              style={{ width: size, height: size }}
            >
              {selected ? (
                <SvgImage
                  className="avatarka-picker__preview-image"
                  svg={selected.svg}
                />
              ) : null}
            </div>
          ))}
          {footerAccessory ? (
            <div className="avatarka-picker__preview-footer">{footerAccessory}</div>
          ) : null}
          {(resolvedDownloads.svg || resolvedDownloads.png) && (
            <div
              className="avatarka-picker__downloads"
              role="group"
              aria-label="Download selected avatar"
            >
              {resolvedDownloads.svg && (
                <button
                  type="button"
                  onClick={saveSvg}
                  disabled={!selected}
                  aria-label="Download selected avatar as SVG"
                >
                  <DownloadIcon />
                  SVG
                </button>
              )}
              {resolvedDownloads.png && (
                <button
                  type="button"
                  onClick={() => void savePng()}
                  disabled={!selected || isSavingPng}
                  aria-label="Download selected avatar as PNG"
                  aria-busy={isSavingPng}
                >
                  <DownloadIcon />
                  PNG
                </button>
              )}
            </div>
          )}
          <button
            type="button"
            className="avatarka-picker__randomize"
            onClick={() => {
              setDiceRoll((roll) => roll + 1);
              beginGalleryChange();
              setGeneration((current) => current + 1);
            }}
            aria-controls={galleryId}
            aria-label="Regenerate avatar gallery"
            title="Regenerate avatar gallery"
          >
            <span
              key={diceRoll}
              className={`avatarka-picker__randomize-icon ${diceRoll > 0 ? 'is-rolling' : ''}`}
            >
              <DiceIcon />
            </span>
            <span className="avatarka-picker__randomize-label">Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default AvatarPicker;
