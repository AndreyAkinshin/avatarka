import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { svgToPng } from 'avatarka/browser';
import {
  createAvatar,
  generateGallery,
  type GeneratedAvatar,
  type ThemeName,
} from 'avatarka';
import {
  Component,
  Suspense,
  startTransition,
  useState,
  type ReactNode,
} from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AvatarPicker,
  defaultLoadAvatarGallery,
  type AvatarGalleryRequest,
  type AvatarGalleryLoader,
  type AvatarPickerErrorContext,
  type AvatarPickerStyle,
} from '../AvatarPicker';
import { svgDataUrl } from '../svg';

vi.mock('avatarka/browser', () => ({
  svgToPng: vi.fn(),
}));

interface Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null } as { error: Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    return this.state.error
      ? <div role="alert">{this.state.error.message}</div>
      : this.props.children;
  }
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function gallery(theme: ThemeName, seed: string, count = 25): GeneratedAvatar[] {
  return generateGallery(count, seed, {
    themes: [theme],
    backgroundShape: 'circle',
  });
}

function galleryForRequest(request: AvatarGalleryRequest): GeneratedAvatar[] {
  return generateGallery(request.count, request.seed, {
    themes: [request.theme],
    namespace: request.namespace,
    backgroundShape: request.backgroundShape,
  });
}

function renderedGallery(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLImageElement>(
    '.avatarka-picker__art:not(.avatarka-picker__art--outgoing)',
  )].map((image) => {
    const source = image.getAttribute('src') ?? '';
    return decodeURIComponent(source.slice(source.indexOf(',') + 1));
  });
}

function geometry(svg: string): string {
  return svg.replace(/#[\da-f]{3,8}/gi, '#color');
}

function previewSource(container: HTMLElement): string | null | undefined {
  return container.querySelector<HTMLImageElement>(
    '.avatarka-picker__preview-image',
  )?.getAttribute('src');
}

function SuspendAfterPicker({
  active,
  pending,
}: {
  active: boolean;
  pending: Promise<unknown>;
}) {
  if (active) throw pending;
  return null;
}

describe('AvatarPicker', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders the canonical eight categories while the initial gallery loads asynchronously', () => {
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const { container } = render(<AvatarPicker loadGallery={loadGallery} />);

    expect([
      ...container.querySelectorAll<HTMLButtonElement>('.avatarka-picker__themes button'),
    ].map((button) => button.textContent)).toEqual([
      'Folks',
      'Adventurers',
      'Critters',
      'Oddlings',
      'Bots',
      'Snacks',
      'Nooks',
      'Orbs',
    ]);
    expect(container.querySelectorAll('.avatarka-picker__placeholder')).toHaveLength(25);
    expect(container.querySelectorAll('[role="radio"]')).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toContain('Generating Folks');
    expect(loadGallery).toHaveBeenCalledTimes(1);
  });

  it('exposes the requested frame shape to gallery and preview styling', async () => {
    const { container } = render(
      <AvatarPicker count={4} backgroundShape="square" />,
    );

    const first = await screen.findByRole('radio', { name: 'Folks avatar 1' });
    expect(first.getAttribute('data-background-shape')).toBe('square');
    expect(container.querySelectorAll(
      '.avatarka-picker__gallery-item[data-background-shape="square"]',
    )).toHaveLength(4);
    expect(container.querySelectorAll(
      '.avatarka-picker__preview[data-background-shape="square"]',
    )).toHaveLength(3);
    expect(decodeURIComponent(
      first.querySelector('img')?.getAttribute('src') ?? '',
    )).toContain('<rect width="100" height="100"');
  });

  it('yields a task before the default loader starts synchronous generation', async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    let settled = false;
    const result = defaultLoadAvatarGallery({
      theme: 'orbs',
      count: 1,
      seed: 'yield-first',
      namespace: 'test',
      backgroundShape: 'circle',
    }, controller.signal).then((items) => {
      settled = true;
      return items;
    });

    await Promise.resolve();
    expect(settled).toBe(false);
    await vi.runAllTimersAsync();
    expect(await result).toHaveLength(1);
  });

  it('publishes a complete generated avatar after the first gallery resolves', async () => {
    const onChange = vi.fn();
    const items = gallery('folks', 'initial');
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    render(<AvatarPicker loadGallery={loadGallery} onChange={onChange} />);

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const selected = onChange.mock.calls[0]![0] as GeneratedAvatar;
    expect(selected).toEqual(items[0]);
    expect(selected.recipe).toMatchObject({
      format: 'avatarka',
      version: 1,
      theme: 'folks',
    });
    expect(selected.svg).toMatch(/^<svg/);
  });

  it('rejects hostile non-canonical loader SVG without inserting active markup and retries safely', async () => {
    const hostileSvg = [
      '<svg xmlns="http://www.w3.org/2000/svg" onload="window.__avatarkaHostile = true">',
      '<script>window.__avatarkaHostile = true</script>',
      '<circle cx="50" cy="50" r="40" onclick="window.__avatarkaHostile = true"/>',
      '</svg>',
    ].join('');
    const items = gallery('folks', 'hostile-loader', 4);
    const safeItems = [...items];
    items[0] = { ...items[0]!, svg: hostileSvg };
    let loadAttempt = 0;
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => {
      loadAttempt += 1;
      return loadAttempt === 1 ? items : safeItems;
    });
    const onChange = vi.fn();
    const onError = vi.fn<(
      error: Error,
      context: AvatarPickerErrorContext,
    ) => void>();
    const { container } = render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onChange={onChange}
        onError={onError}
      />,
    );

    const alert = await screen.findByRole('alert');
    const galleryElement = container.querySelector('.avatarka-picker__gallery')!;

    expect(alert.textContent).toContain('non-canonical avatar at index 0');
    expect(galleryElement.querySelector('svg')).toBeNull();
    expect(galleryElement.querySelector('script')).toBeNull();
    expect(galleryElement.querySelector('[onload], [onclick]')).toBeNull();
    expect(galleryElement.querySelector('img')).toBeNull();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(onChange).not.toHaveBeenCalled();
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0]?.[1]).toMatchObject({
      operation: 'gallery',
      request: { theme: 'folks', count: 4 },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    const first = await screen.findByRole('radio', { name: 'Folks avatar 1' });
    expect(first.querySelector('img')?.getAttribute('src')).toBe(svgDataUrl(safeItems[0]!.svg));
    expect(galleryElement.querySelector('svg')).toBeNull();
    expect(galleryElement.querySelector('script')).toBeNull();
    fireEvent.click(screen.getByRole('radio', { name: 'Folks avatar 2' }));
    expect(onChange).toHaveBeenLastCalledWith(safeItems[1]);
  });

  it('canonicalizes valid custom loader results before publishing a selection', async () => {
    const canonicalItems = gallery('folks', 'canonical-loader', 4);
    const transportedItems = canonicalItems.map((item) => ({
      recipe: { ...item.recipe },
      theme: item.theme,
      params: { ...item.params },
      svg: item.svg,
    })) as GeneratedAvatar[];
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => transportedItems);
    const onChange = vi.fn();

    render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    const published = onChange.mock.calls[0]![0] as GeneratedAvatar;
    expect(published).toEqual(canonicalItems[0]);
    expect(published).not.toBe(transportedItems[0]);
    expect(Object.isFrozen(published)).toBe(true);
    expect(Object.isFrozen(published.recipe)).toBe(true);
    expect(Object.isFrozen(published.params)).toBe(true);
  });

  it('rejects duplicate recipes from a custom gallery loader', async () => {
    const item = gallery('folks', 'duplicate-loader', 1)[0]!;
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => (
      [item, item, item, item]
    ));
    const onError = vi.fn();

    render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onError={onError}
      />,
    );

    expect((await screen.findByRole('alert')).textContent).toContain(
      'duplicate recipe at index 1',
    );
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it('rejects custom loader results outside the requested namespace', async () => {
    const items = generateGallery(4, 'wrong-namespace', {
      themes: ['folks'],
      namespace: 'another-scope',
      backgroundShape: 'circle',
    });
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);

    render(<AvatarPicker count={4} loadGallery={loadGallery} />);

    expect((await screen.findByRole('alert')).textContent).toContain(
      'expected default:gallery-item:0',
    );
  });

  it('rejects custom loader results with the wrong background shape', async () => {
    const items = generateGallery(4, 'wrong-frame', {
      themes: ['folks'],
      namespace: 'default',
      backgroundShape: 'square',
    });
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);

    render(<AvatarPicker count={4} loadGallery={loadGallery} />);

    expect((await screen.findByRole('alert')).textContent).toContain(
      'background shape square at index 0; expected circle',
    );
  });

  it('rejects sparse custom loader arrays even when their length matches count', async () => {
    const sparse = new Array<GeneratedAvatar>(4);
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => sparse);
    const onError = vi.fn();

    render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onError={onError}
      />,
    );

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('sparse result with no item at index 0');
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toBe('Folks gallery unavailable');
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });

  it('never dispatches through an untrusted gallery array map override', async () => {
    const canonicalItems = gallery('folks', 'overridden-map', 4);
    const hostileSvg = [
      '<svg xmlns="http://www.w3.org/2000/svg" onload="window.__avatarkaMapBypass = true">',
      '<script>window.__avatarkaMapBypass = true</script>',
      '</svg>',
    ].join('');
    const hostileItems = [...canonicalItems];
    hostileItems[0] = { ...hostileItems[0]!, svg: hostileSvg };
    const mapOverride = vi.fn(() => hostileItems);
    Object.defineProperty(canonicalItems, 'map', {
      configurable: true,
      value: mapOverride,
    });
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => canonicalItems);
    const onChange = vi.fn();
    const { container } = render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );

    const first = await screen.findByRole('radio', { name: 'Folks avatar 1' });
    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(mapOverride).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(canonicalItems[0]);
    expect(first.querySelector('img')?.getAttribute('src')).toBe(
      svgDataUrl(canonicalItems[0]!.svg),
    );
    expect(container.querySelector(
      '.avatarka-picker__gallery svg, .avatarka-picker__gallery script, .avatarka-picker__gallery [onload]',
    )).toBeNull();
  });

  it('passes a frozen request snapshot across the custom loader boundary', async () => {
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => {
      expect(Object.isFrozen(request)).toBe(true);
      expect(() => Object.defineProperty(request, 'theme', {
        configurable: true,
        value: 'critters',
      })).toThrow(TypeError);
      return gallery(request.theme, String(request.seed), request.count);
    });

    render(<AvatarPicker count={4} loadGallery={loadGallery} />);

    expect(await screen.findByRole('radio', { name: 'Folks avatar 1' })).toBeTruthy();
    expect(loadGallery.mock.calls[0]?.[0].theme).toBe('folks');
  });

  it('clears a stale gallery on loader failure and retries the same request', async () => {
    const onError = vi.fn<(
      error: Error,
      context: AvatarPickerErrorContext,
    ) => void>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => {
      if (loadGallery.mock.calls.length === 2) {
        throw new Error('Worker unavailable');
      }
      return gallery(request.theme, String(request.seed), request.count);
    });

    render(
      <AvatarPicker
        count={4}
        gallerySeed="retry-gallery"
        loadGallery={loadGallery}
        onError={onError}
      />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    fireEvent.click(screen.getByRole('button', { name: 'Critters' }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Worker unavailable');
    expect(screen.queryByRole('radio', { name: 'Folks avatar 1' })).toBeNull();
    expect(screen.queryAllByRole('radio')).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toBe('Critters gallery unavailable');
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0]?.[1]).toMatchObject({
      operation: 'gallery',
      request: {
        theme: 'critters',
        count: 4,
        seed: 'retry-gallery',
        namespace: 'default',
        backgroundShape: 'circle',
      },
    });

    fireEvent.click(screen.getByTitle('Coast'));
    expect(screen.getByRole('alert')).toBe(alert);
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
    expect(loadGallery).toHaveBeenCalledTimes(2);

    vi.mocked(svgToPng).mockRejectedValueOnce(new Error('Canvas unavailable'));
    fireEvent.click(screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    }));
    await waitFor(() => expect(screen.getAllByRole('alert')).toHaveLength(2));
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Critters gallery unavailable');
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(2));
    expect(onError.mock.calls[1]?.[1]).toMatchObject({
      operation: 'png-download',
      avatar: { theme: 'folks' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByRole('radio', { name: 'Critters avatar 1' })).toBeTruthy();
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert').textContent).toContain('Download failed');
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    expect(loadGallery).toHaveBeenCalledTimes(3);
    expect(loadGallery.mock.calls[2]?.[0]).toEqual(loadGallery.mock.calls[1]?.[0]);
  });

  it('lets an initial selection Effect reach an error boundary without reclassifying it', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const onError = vi.fn();
    const onChange = vi.fn(() => {
      throw new Error('Consumer callback failed');
    });
    const items = gallery('folks', 'callback-error', 4);
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);

    render(
      <ErrorBoundary>
        <AvatarPicker
          count={4}
          loadGallery={loadGallery}
          onChange={onChange}
          onError={onError}
        />
      </ErrorBoundary>,
    );

    expect((await screen.findByRole('alert')).textContent).toBe('Consumer callback failed');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onError).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalled();
  });

  it('keeps download actions and the selected preview stable during regeneration', async () => {
    const first = gallery('folks', 'first');
    const next = deferred<readonly GeneratedAvatar[]>();
    let call = 0;
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => {
      call += 1;
      return call === 1 ? Promise.resolve(first) : next.promise;
    });
    const { container } = render(<AvatarPicker loadGallery={loadGallery} />);

    await screen.findByRole('radio', { name: 'Folks avatar 1' });
    const saveSvg = screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    }) as HTMLButtonElement;
    const savePng = screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    }) as HTMLButtonElement;
    const previewBefore = container.querySelector('.avatarka-picker__preview')?.innerHTML;
    const regenerate = screen.getByRole('button', {
      name: 'Regenerate avatar gallery',
    });
    const regenerateLabel = screen.getByText('Regenerate');

    fireEvent.click(regenerate);

    expect(screen.getByRole('button', {
      name: 'Regenerate avatar gallery',
    })).toBe(regenerate);
    expect(screen.getByText('Regenerate')).toBe(regenerateLabel);
    expect(regenerate.querySelector('.avatarka-picker__randomize-icon.is-rolling')).toBeTruthy();
    expect(screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    })).toBe(saveSvg);
    expect(screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    })).toBe(savePng);
    expect(saveSvg.disabled).toBe(false);
    expect(savePng.disabled).toBe(false);
    expect(container.querySelector('.avatarka-picker__preview')?.innerHTML).toBe(previewBefore);
    expect(screen.getByRole('status').textContent).toContain('Generating');
  });

  it('changes only colors when a named palette is selected', async () => {
    const onChange = vi.fn();
    const items = gallery('folks', 'palette');
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    const { container } = render(
      <AvatarPicker loadGallery={loadGallery} onChange={onChange} />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    const mixed = renderedGallery(container);
    fireEvent.click(screen.getByTitle('Coast'));
    const coast = renderedGallery(container);

    expect(loadGallery).toHaveBeenCalledTimes(1);
    expect(coast).not.toEqual(mixed);
    expect(coast.map(geometry)).toEqual(mixed.map(geometry));
    const selected = onChange.mock.calls.at(-1)?.[0] as GeneratedAvatar;
    expect(selected.recipe.palette).toBe('coast');

    fireEvent.click(screen.getByTitle('Mixed palettes'));
    expect(loadGallery).toHaveBeenCalledTimes(1);
    expect(renderedGallery(container)).toEqual(mixed);
    expect((onChange.mock.calls.at(-1)?.[0] as GeneratedAvatar).recipe.palette).toBe(
      items[0]!.recipe.palette,
    );
  });

  it('aborts and ignores stale gallery loads after a category switch', async () => {
    const requests: Array<{
      theme: ThemeName;
      signal: AbortSignal;
      result: Deferred<readonly GeneratedAvatar[]>;
    }> = [];
    const loadGallery = vi.fn<AvatarGalleryLoader>((request, signal) => {
      const result = deferred<readonly GeneratedAvatar[]>();
      requests.push({ theme: request.theme, signal, result });
      return result.promise;
    });
    render(<AvatarPicker loadGallery={loadGallery} />);
    expect(requests[0]?.theme).toBe('folks');

    fireEvent.click(screen.getByRole('button', { name: 'Critters' }));
    expect(requests[0]?.signal.aborted).toBe(true);
    expect(requests[1]?.theme).toBe('critters');

    await act(async () => {
      requests[0]!.result.resolve(gallery('folks', 'stale'));
      requests[1]!.result.resolve(gallery('critters', 'fresh'));
      await Promise.resolve();
    });

    expect(await screen.findByRole('radio', { name: 'Critters avatar 1' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Folks avatar 1' })).toBeNull();
    expect(screen.getByRole('status').textContent).toBe('Critters gallery ready');
  });

  it('reports only actual user category browsing through onThemeChange', async () => {
    const onThemeChange = vi.fn();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => (
      galleryForRequest(request)
    ));
    const { rerender } = render(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onThemeChange={onThemeChange}
      />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    fireEvent.click(screen.getByRole('button', { name: 'Folks' }));
    fireEvent.click(screen.getByTitle('Coast'));
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate avatar gallery' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));
    expect(onThemeChange).not.toHaveBeenCalled();

    const replacement = vi.fn();
    rerender(
      <AvatarPicker
        count={4}
        loadGallery={loadGallery}
        onThemeChange={replacement}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Critters' }));
    await screen.findByRole('radio', { name: 'Critters avatar 1' });

    expect(onThemeChange).not.toHaveBeenCalled();
    expect(replacement).toHaveBeenCalledTimes(1);
    expect(replacement).toHaveBeenCalledWith('critters');
  });

  it('ignores stale loads when gallery inputs change through props', async () => {
    const requests: Array<{
      seed: string | number;
      signal: AbortSignal;
      result: Deferred<readonly GeneratedAvatar[]>;
    }> = [];
    const loadGallery = vi.fn<AvatarGalleryLoader>((request, signal) => {
      const result = deferred<readonly GeneratedAvatar[]>();
      requests.push({ seed: request.seed, signal, result });
      return result.promise;
    });
    const onChange = vi.fn();
    const { container, rerender } = render(
      <AvatarPicker
        count={4}
        gallerySeed="external-old"
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );

    rerender(
      <AvatarPicker
        count={4}
        gallerySeed="external-new"
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );

    expect(requests).toHaveLength(2);
    expect(requests[0]?.signal.aborted).toBe(true);
    const stale = gallery('folks', 'external-old', 4);
    const fresh = gallery('folks', 'external-new', 4);
    await act(async () => {
      requests[0]!.result.resolve(stale);
      requests[1]!.result.resolve(fresh);
      await Promise.resolve();
    });

    await waitFor(() => expect(onChange).toHaveBeenCalledTimes(1));
    expect(onChange).toHaveBeenCalledWith(fresh[0]);
    expect(renderedGallery(container)).toEqual(fresh.map((item) => item.svg));
    expect(renderedGallery(container)).not.toEqual(stale.map((item) => item.svg));
  });

  it('keeps the committed gallery load valid when a controlled transition is abandoned', async () => {
    const suspended = deferred<void>();
    const requests: Array<{
      request: AvatarGalleryRequest;
      result: Deferred<readonly GeneratedAvatar[]>;
    }> = [];
    const loadGallery = vi.fn<AvatarGalleryLoader>((request) => {
      const result = deferred<readonly GeneratedAvatar[]>();
      requests.push({ request, result });
      return result.promise;
    });
    const folks = createAvatar('folks', 'committed-controlled');
    const critter = createAvatar('critters', 'abandoned-controlled');

    function Harness() {
      const [showPendingValue, setShowPendingValue] = useState(false);
      return (
        <Suspense fallback={<span>Suspended update</span>}>
          <AvatarPicker
            count={4}
            value={(showPendingValue ? critter : folks).recipe}
            loadGallery={loadGallery}
          />
          <button
            type="button"
            onClick={() => {
              startTransition(() => setShowPendingValue(true));
            }}
          >
            Start suspended update
          </button>
          <SuspendAfterPicker active={showPendingValue} pending={suspended.promise} />
        </Suspense>
      );
    }

    render(<Harness />);
    expect(requests.map(({ request }) => request.theme)).toEqual(['folks']);

    fireEvent.click(screen.getByRole('button', { name: 'Start suspended update' }));
    expect(screen.queryByText('Suspended update')).toBeNull();
    expect(requests.map(({ request }) => request.theme)).toEqual(['folks']);

    await act(async () => {
      requests[0]!.result.resolve(galleryForRequest(requests[0]!.request));
      await Promise.resolve();
    });

    expect(await screen.findByRole('radio', { name: 'Folks avatar 1' })).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe('Folks gallery ready');
    expect(requests.map(({ request }) => request.theme)).toEqual(['folks']);
  });

  it('dispatches committed DOM events only to the committed onChange callback', async () => {
    const suspended = deferred<void>();
    const committedOnChange = vi.fn();
    const abandonedOnChange = vi.fn();
    const folks = createAvatar('folks', 'committed-callback');
    const critter = createAvatar('critters', 'abandoned-callback');
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => (
      galleryForRequest(request)
    ));

    function Harness() {
      const [showPendingValue, setShowPendingValue] = useState(false);
      return (
        <Suspense fallback={<span>Suspended update</span>}>
          <AvatarPicker
            count={4}
            value={(showPendingValue ? critter : folks).recipe}
            loadGallery={loadGallery}
            onChange={showPendingValue ? abandonedOnChange : committedOnChange}
          />
          <button
            type="button"
            onClick={() => {
              startTransition(() => setShowPendingValue(true));
            }}
          >
            Start suspended update
          </button>
          <SuspendAfterPicker active={showPendingValue} pending={suspended.promise} />
        </Suspense>
      );
    }

    render(<Harness />);
    const choice = await screen.findByRole('radio', { name: 'Folks avatar 2' });

    fireEvent.click(screen.getByRole('button', { name: 'Start suspended update' }));
    expect(screen.queryByText('Suspended update')).toBeNull();
    fireEvent.click(choice);

    expect(committedOnChange).toHaveBeenCalledTimes(1);
    expect(committedOnChange.mock.calls[0]?.[0]).toMatchObject({ theme: 'folks' });
    expect(abandonedOnChange).not.toHaveBeenCalled();
  });

  it('preserves a selected default recipe when the initial gallery becomes ready', async () => {
    const selected = createAvatar('bots', 'controlled-bot', { palette: 'mono' });
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const onChange = vi.fn();
    const { container } = render(
      <AvatarPicker
        defaultValue={selected.recipe}
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );

    expect(previewSource(container)).toBe(svgDataUrl(selected.svg));
    expect(screen.getByRole('button', { name: 'Bots' }).getAttribute('aria-pressed')).toBe('true');
    expect((screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    }) as HTMLButtonElement).disabled).toBe(false);

    await act(async () => {
      pending.resolve(gallery('bots', 'default-value'));
      await Promise.resolve();
    });
    expect(previewSource(container)).toBe(svgDataUrl(selected.svg));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('follows a controlled recipe and proposes user selections through onChange', async () => {
    const controlled = createAvatar('oddlings', 'controlled');
    const items = gallery('oddlings', 'choices');
    const onChange = vi.fn();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    const { container, rerender } = render(
      <AvatarPicker value={controlled.recipe} loadGallery={loadGallery} onChange={onChange} />,
    );
    await screen.findByRole('radio', { name: 'Oddlings avatar 1' });

    fireEvent.click(screen.getByRole('radio', { name: 'Oddlings avatar 2' }));
    expect(onChange).toHaveBeenLastCalledWith(items[1]);
    expect(previewSource(container)).toBe(svgDataUrl(controlled.svg));

    const replacement = createAvatar('oddlings', 'replacement');
    rerender(
      <AvatarPicker value={replacement.recipe} loadGallery={loadGallery} onChange={onChange} />,
    );
    expect(previewSource(container)).toBe(svgDataUrl(replacement.svg));
  });

  it('loads only the next category when a controlled recipe changes themes', async () => {
    const requests: Array<{
      request: AvatarGalleryRequest;
      signal: AbortSignal;
      result: Deferred<readonly GeneratedAvatar[]>;
    }> = [];
    const loadGallery = vi.fn<AvatarGalleryLoader>((request, signal) => {
      const result = deferred<readonly GeneratedAvatar[]>();
      requests.push({ request, signal, result });
      return result.promise;
    });
    const folks = createAvatar('folks', 'controlled-folks');
    const critter = createAvatar('critters', 'controlled-critter');
    const { rerender } = render(
      <AvatarPicker count={4} value={folks.recipe} loadGallery={loadGallery} />,
    );

    expect(requests.map(({ request }) => request.theme)).toEqual(['folks']);

    rerender(
      <AvatarPicker count={4} value={critter.recipe} loadGallery={loadGallery} />,
    );

    expect(requests.map(({ request }) => request.theme)).toEqual([
      'folks',
      'critters',
    ]);
    expect(requests[0]?.signal.aborted).toBe(true);

    await act(async () => {
      requests[0]!.result.resolve(galleryForRequest(requests[0]!.request));
      requests[1]!.result.resolve(galleryForRequest(requests[1]!.request));
      await Promise.resolve();
    });

    expect(await screen.findByRole('radio', { name: 'Critters avatar 1' })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: 'Folks avatar 1' })).toBeNull();
  });

  it('keeps controlled selection independent from the browsed category', async () => {
    const requests: AvatarGalleryRequest[] = [];
    const controlled = createAvatar('folks', 'controlled-browser');
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => {
      requests.push(request);
      return galleryForRequest(request);
    });
    const { container, rerender } = render(
      <AvatarPicker count={4} value={controlled.recipe} loadGallery={loadGallery} />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    fireEvent.click(screen.getByRole('button', { name: 'Critters' }));

    expect(await screen.findByRole('radio', { name: 'Critters avatar 1' })).toBeTruthy();
    expect(previewSource(container)).toBe(svgDataUrl(controlled.svg));
    expect(requests.map(({ theme }) => theme)).toEqual(['folks', 'critters']);

    rerender(
      <AvatarPicker
        count={4}
        value={{ ...controlled.recipe }}
        loadGallery={loadGallery}
      />,
    );

    expect(screen.getByRole('button', { name: 'Critters' }).getAttribute('aria-pressed')).toBe('true');
    expect(requests.map(({ theme }) => theme)).toEqual(['folks', 'critters']);
  });

  it('applies palette proposals to a controlled identity outside the gallery', async () => {
    const controlled = createAvatar('folks', 'external-selection');
    const items = gallery('folks', 'unrelated-gallery', 4);
    const onChange = vi.fn();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    render(
      <AvatarPicker
        count={4}
        value={controlled.recipe}
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    fireEvent.click(screen.getByTitle('Coast'));

    const proposal = onChange.mock.calls.at(-1)?.[0] as GeneratedAvatar;
    expect(proposal.recipe.seed).toBe('external-selection');
    expect(proposal.recipe.palette).toBe('coast');
  });

  it('uses roving keyboard focus based on the rendered column count', async () => {
    const items = gallery('folks', 'keyboard', 9);
    const onChange = vi.fn();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    render(<AvatarPicker count={9} loadGallery={loadGallery} onChange={onChange} />);
    const first = await screen.findByRole('radio', { name: 'Folks avatar 1' });

    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });

    expect(document.activeElement).toBe(
      screen.getByRole('radio', { name: 'Folks avatar 4' }),
    );
    expect(onChange).toHaveBeenLastCalledWith(items[3]);
  });

  it('uses galleryColumns for layout and a ten-column keyboard stride', async () => {
    const items = gallery('folks', 'keyboard-ten', 20);
    const onChange = vi.fn();
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => items);
    const { container } = render(
      <AvatarPicker
        count={20}
        galleryColumns={10}
        loadGallery={loadGallery}
        onChange={onChange}
      />,
    );
    const first = await screen.findByRole('radio', { name: 'Folks avatar 1' });
    const root = container.querySelector<HTMLElement>('.avatarka-picker')!;

    expect(root.style.getPropertyValue('--avatarka-picker-columns')).toBe('10');
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    const eleventh = screen.getByRole('radio', { name: 'Folks avatar 11' });
    expect(document.activeElement).toBe(eleventh);
    expect(onChange).toHaveBeenLastCalledWith(items[10]);

    fireEvent.keyDown(eleventh, { key: 'ArrowUp' });
    expect(document.activeElement).toBe(first);
    expect(onChange).toHaveBeenLastCalledWith(items[0]);
  });

  it('allows downloads to be hidden', () => {
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const hidden = render(<AvatarPicker loadGallery={loadGallery} downloads={false} />);
    expect(hidden.container.querySelector('.avatarka-picker__downloads')).toBeNull();
  });

  it('merges download object options over enabled format defaults', () => {
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    render(
      <AvatarPicker
        loadGallery={loadGallery}
        defaultValue={createAvatar('folks', 'download').recipe}
        downloads={{ pngSize: 1024 }}
      />,
    );
    expect(screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    })).toBeTruthy();
    expect(screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    })).toBeTruthy();
  });

  it('lets an object option disable only PNG while SVG stays enabled', () => {
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    render(
      <AvatarPicker
        loadGallery={loadGallery}
        defaultValue={createAvatar('folks', 'svg-only-download').recipe}
        downloads={{ png: false }}
      />,
    );
    expect(screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    })).toBeTruthy();
    expect(screen.queryByRole('button', {
      name: 'Download selected avatar as PNG',
    })).toBeNull();
  });

  it('reports built-in download failures through the same visible error contract', async () => {
    const selected = createAvatar('folks', 'failed-download');
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const onError = vi.fn<(
      error: Error,
      context: AvatarPickerErrorContext,
    ) => void>();
    vi.mocked(svgToPng).mockRejectedValueOnce(new Error('Canvas unavailable'));
    render(
      <AvatarPicker
        defaultValue={selected.recipe}
        loadGallery={loadGallery}
        onError={onError}
      />,
    );

    fireEvent.click(screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    }));

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Download failed. Canvas unavailable');
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull();
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    const [error, context] = onError.mock.calls[0]!;
    expect(error.message).toBe('Canvas unavailable');
    expect(context).toEqual({
      operation: 'png-download',
      avatar: selected,
    });
  });

  it('reports synchronous SVG download failures with the selected avatar', async () => {
    const selected = createAvatar('bots', 'failed-svg-download');
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const onError = vi.fn<(
      error: Error,
      context: AvatarPickerErrorContext,
    ) => void>();
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => {
        throw new Error('Object URLs unavailable');
      }),
      revokeObjectURL: vi.fn(),
    });
    render(
      <AvatarPicker
        defaultValue={selected.recipe}
        loadGallery={loadGallery}
        onError={onError}
      />,
    );

    fireEvent.click(screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    }));

    expect((await screen.findByRole('alert')).textContent).toContain(
      'Download failed. Object URLs unavailable',
    );
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0]).toEqual([
      expect.objectContaining({ message: 'Object URLs unavailable' }),
      { operation: 'svg-download', avatar: selected },
    ]);
  });

  it('bounds its gallery cache and refreshes least-recently-used entries', async () => {
    const loadGallery = vi.fn<AvatarGalleryLoader>(async (request) => (
      gallery(request.theme, String(request.seed), request.count)
    ));
    const { rerender } = render(
      <AvatarPicker
        count={1}
        downloads={false}
        gallerySeed="cache-0"
        loadGallery={loadGallery}
      />,
    );
    await waitFor(() => expect(loadGallery).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));

    for (let index = 1; index <= 7; index += 1) {
      rerender(
        <AvatarPicker
          count={1}
          downloads={false}
          gallerySeed={`cache-${index}`}
          loadGallery={loadGallery}
        />,
      );
      await waitFor(() => expect(loadGallery).toHaveBeenCalledTimes(index + 1));
      await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));
    }

    rerender(
      <AvatarPicker
        count={1}
        downloads={false}
        gallerySeed="cache-0"
        loadGallery={loadGallery}
      />,
    );
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));
    expect(loadGallery).toHaveBeenCalledTimes(8);

    rerender(
      <AvatarPicker
        count={1}
        downloads={false}
        gallerySeed="cache-8"
        loadGallery={loadGallery}
      />,
    );
    await waitFor(() => expect(loadGallery).toHaveBeenCalledTimes(9));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));

    rerender(
      <AvatarPicker
        count={1}
        downloads={false}
        gallerySeed="cache-0"
        loadGallery={loadGallery}
      />,
    );
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));
    expect(loadGallery).toHaveBeenCalledTimes(9);

    rerender(
      <AvatarPicker
        count={1}
        downloads={false}
        gallerySeed="cache-1"
        loadGallery={loadGallery}
      />,
    );
    await waitFor(() => expect(loadGallery).toHaveBeenCalledTimes(10));
  });

  it('accepts documented picker CSS variables through its exported style type', () => {
    const style: AvatarPickerStyle = {
      '--avatarka-picker-bg': '#101216',
      '--avatarka-picker-accent': '#8d91ff',
      color: 'rgb(1, 2, 3)',
    };
    const pending = deferred<readonly GeneratedAvatar[]>();
    const loadGallery = vi.fn<AvatarGalleryLoader>(() => pending.promise);
    const { container } = render(
      <AvatarPicker count={1} loadGallery={loadGallery} style={style} />,
    );
    const root = container.querySelector<HTMLElement>('.avatarka-picker')!;

    expect(root.style.getPropertyValue('--avatarka-picker-bg')).toBe('#101216');
    expect(root.style.getPropertyValue('--avatarka-picker-accent')).toBe('#8d91ff');
    expect(root.style.color).toBe('rgb(1, 2, 3)');
  });

  it('skips gallery crossfades when reduced motion is requested', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });
    const first = gallery('folks', 'reduced-first', 4);
    const second = gallery('folks', 'reduced-second', 4);
    let call = 0;
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => {
      call += 1;
      return call === 1 ? first : second;
    });
    const { container } = render(
      <AvatarPicker count={4} loadGallery={loadGallery} downloads={false} />,
    );
    await screen.findByRole('radio', { name: 'Folks avatar 1' });

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate avatar gallery' }));
    await waitFor(() => expect(loadGallery).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));

    expect(container.querySelector('.avatarka-picker__art--outgoing')).toBeNull();
    expect(container.querySelector('.avatarka-picker__art--incoming')).toBeNull();
  });

  it('disables only dice motion for reduced-motion users while keeping its label stable', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'packages/avatarka-react/src/styles.css'),
      'utf8',
    );
    const reducedMotionRules = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));

    expect(reducedMotionRules).toContain('.avatarka-picker__randomize-icon.is-rolling');
    expect(reducedMotionRules).toContain('animation: none');
    expect(css).not.toContain('.avatarka-picker__randomize-label.is-rolling');
  });

  it('does not invoke its loader during server rendering', () => {
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => []);
    const markup = renderToString(
      <AvatarPicker loadGallery={loadGallery} count={4} downloads={false} />,
    );

    expect(loadGallery).not.toHaveBeenCalled();
    expect(markup.match(/avatarka-picker__placeholder/g)).toHaveLength(4);
    expect(markup).toContain('Generating Folks gallery');
  });

  it('rejects picker counts above its safe mounted-gallery maximum', () => {
    const loadGallery = vi.fn<AvatarGalleryLoader>(async () => []);

    expect(() => renderToString(
      <AvatarPicker loadGallery={loadGallery} count={101} downloads={false} />,
    )).toThrowError(
      new RangeError('AvatarPicker count must be an integer between 1 and 100'),
    );
    expect(loadGallery).not.toHaveBeenCalled();
  });

  it.each([
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
    5,
  ])(
    'rejects invalid galleryColumns value %s before loading',
    (galleryColumns) => {
      const loadGallery = vi.fn<AvatarGalleryLoader>(async () => []);

      expect(() => renderToString(
        <AvatarPicker
          count={4}
          galleryColumns={galleryColumns}
          loadGallery={loadGallery}
          downloads={false}
        />,
      )).toThrowError(
        new RangeError('AvatarPicker galleryColumns must be an integer between 1 and count'),
      );
      expect(loadGallery).not.toHaveBeenCalled();
    },
  );
});
