import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  getBaseTypeCatalog,
  generateGallery,
  paletteNames,
  type GeneratedAvatar,
} from 'avatarka';
import type { AvatarGalleryRequest } from 'avatarka-react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { generateCatalogReview } from './catalogReview';
import { loadAvatarGallery } from './galleryLoader';

class WorkerStub {
  static instances: WorkerStub[] = [];

  onmessage: ((event: MessageEvent<GeneratedAvatar[]>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  messages: AvatarGalleryRequest[] = [];
  terminated = false;
  terminateCalls = 0;
  postMessageError: Error | null = null;

  constructor() {
    WorkerStub.instances.push(this);
  }

  postMessage(message: AvatarGalleryRequest): void {
    if (this.postMessageError) throw this.postMessageError;
    this.messages.push(message);
  }

  respond(gallery: GeneratedAvatar[]): void {
    this.onmessage?.(new MessageEvent('message', { data: gallery }));
  }

  terminate(): void {
    this.terminated = true;
    this.terminateCalls += 1;
  }
}

function galleryFor(request: AvatarGalleryRequest): GeneratedAvatar[] {
  return generateGallery(request.count, request.seed, {
    themes: [request.theme],
    namespace: request.namespace,
    backgroundShape: request.backgroundShape,
  });
}

function catalogFor(request: AvatarGalleryRequest): GeneratedAvatar[] {
  return [...generateCatalogReview(request)];
}

function latestWorker(): WorkerStub {
  const worker = WorkerStub.instances[WorkerStub.instances.length - 1];
  if (!worker) throw new Error('Expected an avatar gallery worker');
  return worker;
}

async function finishLatestGallery(): Promise<GeneratedAvatar[]> {
  const worker = latestWorker();
  const request = worker.messages[worker.messages.length - 1];
  if (!request) throw new Error('Expected an avatar gallery request');
  const gallery = galleryFor(request);
  act(() => worker.respond(gallery));
  await waitFor(() => {
    expect(screen.getByRole('status').textContent).toContain('ready');
  });
  return gallery;
}

async function finishLatestCatalog(): Promise<GeneratedAvatar[]> {
  const worker = latestWorker();
  const request = worker.messages[worker.messages.length - 1];
  if (!request) throw new Error('Expected an avatar catalog review request');
  const gallery = catalogFor(request);
  act(() => worker.respond(gallery));
  await waitFor(() => {
    expect(screen.getByRole('status').textContent).toContain('ready');
  });
  return gallery;
}

function renderedAvatars(container: HTMLElement): string[] {
  return [...container.querySelectorAll<HTMLImageElement>(
    '.avatarka-picker__art:not(.avatarka-picker__art--outgoing), .avatarka-picker__preview:not(.is-empty) img',
  )].map((image) => {
    const source = image.getAttribute('src');
    if (!source?.startsWith('data:image/svg+xml,')) {
      throw new Error('Expected an encoded SVG image');
    }
    return decodeURIComponent(source.slice('data:image/svg+xml,'.length));
  });
}

function renderedGeometry(container: HTMLElement): string[] {
  return renderedAvatars(container).map((svg) => svg.replace(/#[0-9a-f]{6}/gi, '#color'));
}

function avatarParam(item: GeneratedAvatar, param: string): string | number {
  return (item.params as unknown as Record<string, string | number>)[param]!;
}

describe('Avatarka v4 demo', () => {
  beforeEach(() => {
    document.querySelector('link[rel="icon"]')?.remove();
    WorkerStub.instances = [];
    vi.stubGlobal('Worker', WorkerStub);
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
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('applies the system color mode before the module application loads', () => {
    const html = readFileSync(resolve(process.cwd(), 'apps/demo/index.html'), 'utf8');
    const match = html.match(/<script data-avatarka-color-mode>([\s\S]*?)<\/script>/);
    const bootstrap = match?.[1];
    if (!bootstrap) throw new Error('Missing color mode bootstrap');

    expect(html.indexOf(bootstrap)).toBeLessThan(html.indexOf('<script type="module"'));

    const documentLike = { documentElement: { dataset: {} as Record<string, string> } };
    const windowLike = { matchMedia: () => ({ matches: true }) };
    const runBootstrap = new Function('window', 'document', bootstrap);

    runBootstrap(windowLike, documentLike);

    expect(documentLike.documentElement.dataset.theme).toBe('dark');
  });

  it('renders against the system color scheme without any mode switcher', () => {
    render(<App />);

    expect(screen.queryByRole('group', { name: 'Color scheme' })).toBeNull();
    expect(latestWorker().messages[0]?.theme).toBe('folks');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('renders the single v4 catalog in canonical order', () => {
    render(<App />);
    const category = screen.getByRole('group', { name: 'Avatar category' });

    expect(within(category).getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Folks',
      'Adventurers',
      'Critters',
      'Oddlings',
      'Bots',
      'Snacks',
      'Nooks',
      'Orbs',
    ]);
    expect(screen.queryByText('Classic Pop')).toBeNull();
    expect(screen.queryByText('Studio')).toBeNull();
  });

  it('loads initial and switched galleries through cancellable workers', async () => {
    render(<App />);
    expect(latestWorker().messages[0]?.theme).toBe('folks');
    await finishLatestGallery();

    fireEvent.click(screen.getByRole('button', { name: 'Adventurers' }));
    expect(latestWorker().messages[0]?.theme).toBe('adventurers');
    const gallery = await finishLatestGallery();

    expect(screen.getByRole('radio', { name: 'Adventurers avatar 1' })).toBeTruthy();
    expect(gallery.every((item) => item.theme === 'adventurers')).toBe(true);
  });

  it('switches to the schema-ordered development catalog without probe requests', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    const galleryWorkerCount = WorkerStub.instances.length;

    const mode = screen.getByRole('group', { name: 'Gallery review mode' });
    expect(within(mode).getByRole('button', { name: 'Gallery 25' }).getAttribute(
      'aria-pressed',
    )).toBe('true');
    expect(within(mode).getByRole('button', { name: 'Catalog 50' })).toBeTruthy();

    fireEvent.click(within(mode).getByRole('button', { name: 'Catalog 50' }));
    await waitFor(() => expect(WorkerStub.instances).toHaveLength(galleryWorkerCount + 1));
    const request = latestWorker().messages[0];
    expect(request).toMatchObject({ theme: 'folks', count: 50, namespace: 'demo' });
    const catalog = await finishLatestCatalog();
    const baseTypes = getBaseTypeCatalog('folks');

    expect(screen.getAllByRole('radio')).toHaveLength(baseTypes.values.length);
    expect(catalog.map((item) => avatarParam(item, baseTypes.param))).toEqual(baseTypes.values);
    expect(catalog.map((item) => item.recipe.namespace)).toEqual(
      baseTypes.values.map((_, index) => `demo:gallery-item:${index}`),
    );
    expect(container.querySelector<HTMLElement>('.avatarka-picker')?.style.getPropertyValue(
      '--avatarka-picker-columns',
    )).toBe('10');
    expect(container.querySelector('.app--catalog-review')).toBeTruthy();
    expect(WorkerStub.instances).toHaveLength(galleryWorkerCount + 1);

    const palette = screen.getByRole('group', { name: 'Avatar palette' });
    const paletteButtons = within(palette).getAllByRole('button');
    expect(paletteButtons[0]?.getAttribute('aria-label')).toBe('Mixed palettes');
    expect(paletteButtons[0]?.getAttribute('aria-pressed')).toBe('true');
    expect(paletteNames.map((name) => (
      catalog.filter((item) => item.params.palette === name).length
    )).sort((left, right) => left - right)).toEqual([8, 8, 8, 8, 9, 9]);
  });

  it('keeps catalog base order stable across themes, palettes, and regeneration', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    fireEvent.click(screen.getByRole('button', { name: 'Catalog 50' }));
    await waitFor(() => expect(latestWorker().messages[0]?.count).toBe(50));
    await finishLatestCatalog();

    const beforeThemeWorkers = WorkerStub.instances.length;
    fireEvent.click(screen.getByRole('button', { name: 'Critters' }));
    await waitFor(() => expect(WorkerStub.instances).toHaveLength(beforeThemeWorkers + 1));
    const critters = getBaseTypeCatalog('critters');
    expect(critters.values).toHaveLength(50);
    const themeRequest = latestWorker().messages[0];
    expect(themeRequest).toMatchObject({
      theme: 'critters',
      count: critters.values.length,
    });
    const first = await finishLatestCatalog();
    expect(first.map((item) => avatarParam(item, critters.param))).toEqual(critters.values);
    expect(screen.getByRole('button', { name: 'Catalog 50' })).toBeTruthy();

    const workersBeforePalette = WorkerStub.instances.length;
    const mixedBeforePalette = renderedAvatars(container);
    const geometryBeforePalette = renderedGeometry(container);
    fireEvent.click(screen.getByRole('button', { name: 'Coast palette' }));
    expect(WorkerStub.instances).toHaveLength(workersBeforePalette);
    expect(renderedGeometry(container)).toEqual(geometryBeforePalette);
    expect(renderedAvatars(container)).not.toEqual(mixedBeforePalette);

    fireEvent.click(screen.getByRole('button', { name: 'Mixed palettes' }));
    expect(WorkerStub.instances).toHaveLength(workersBeforePalette);
    expect(renderedAvatars(container)).toEqual(mixedBeforePalette);

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate avatar gallery' }));
    await waitFor(() => expect(WorkerStub.instances).toHaveLength(workersBeforePalette + 1));
    const regenerationRequest = latestWorker().messages[0];
    expect(regenerationRequest?.count).toBe(critters.values.length);
    expect(regenerationRequest?.seed).not.toBe(themeRequest?.seed);
    const regenerated = await finishLatestCatalog();

    expect(regenerated.map((item) => avatarParam(item, critters.param))).toEqual(critters.values);
    expect(regenerated.map((item) => item.recipe.namespace)).toEqual(
      first.map((item) => item.recipe.namespace),
    );
    expect(regenerated.map((item) => item.params)).not.toEqual(
      first.map((item) => item.params),
    );
    expect(regenerated.map((item) => item.params.palette)).not.toEqual(
      first.map((item) => item.params.palette),
    );
    expect(paletteNames.map((name) => (
      regenerated.filter((item) => item.params.palette === name).length
    )).sort((left, right) => left - right)).toEqual([8, 8, 8, 8, 9, 9]);
  });

  it('ignores a stale catalog result when regeneration supersedes its worker', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    const galleryWorkerCount = WorkerStub.instances.length;

    fireEvent.click(screen.getByRole('button', { name: 'Catalog 50' }));
    await waitFor(() => expect(WorkerStub.instances).toHaveLength(galleryWorkerCount + 1));
    const staleWorker = latestWorker();
    const staleRequest = staleWorker.messages[0];
    if (!staleRequest) throw new Error('Expected a stale catalog request');
    const staleGallery = catalogFor(staleRequest);

    fireEvent.click(screen.getByRole('button', { name: 'Regenerate avatar gallery' }));
    await waitFor(() => expect(WorkerStub.instances).toHaveLength(galleryWorkerCount + 2));
    expect(staleWorker.terminated).toBe(true);
    const freshWorker = latestWorker();
    const freshRequest = freshWorker.messages[0];
    if (!freshRequest) throw new Error('Expected a fresh catalog request');
    const freshGallery = catalogFor(freshRequest);

    act(() => staleWorker.respond(staleGallery));
    expect(screen.getByRole('status').textContent).toContain('Generating');
    act(() => freshWorker.respond(freshGallery));
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain('ready'));

    expect(renderedAvatars(container)[0]).toBe(freshGallery[0]!.svg);
    expect(renderedAvatars(container)[0]).not.toBe(staleGallery[0]!.svg);
  });

  it('terminates a worker when postMessage throws synchronously', async () => {
    const request: AvatarGalleryRequest = {
      theme: 'folks',
      count: 4,
      seed: 'post-message-error',
      namespace: 'default',
      backgroundShape: 'circle',
    };
    const controller = new AbortController();
    const error = new Error('Unable to clone request');
    const OriginalWorker = WorkerStub;
    class ThrowingWorker extends OriginalWorker {
      constructor() {
        super();
        this.postMessageError = error;
      }
    }
    vi.stubGlobal('Worker', ThrowingWorker);
    const rejected = loadAvatarGallery(request, controller.signal);

    await expect(rejected).rejects.toBe(error);
    expect(latestWorker().terminateCalls).toBe(1);
    controller.abort();
    expect(latestWorker().terminateCalls).toBe(1);
  });

  it('rejects unreadable worker messages and cleans up once', async () => {
    const request: AvatarGalleryRequest = {
      theme: 'folks',
      count: 4,
      seed: 'message-error',
      namespace: 'default',
      backgroundShape: 'circle',
    };
    const controller = new AbortController();
    const pending = loadAvatarGallery(request, controller.signal);
    const worker = latestWorker();

    worker.onmessageerror?.(new MessageEvent('messageerror'));

    await expect(pending).rejects.toThrow('unreadable message');
    expect(worker.terminateCalls).toBe(1);
    controller.abort();
    expect(worker.terminateCalls).toBe(1);
  });

  it('cancels the separate development catalog worker exactly once', async () => {
    const { loadCatalogReview } = await import('./catalogReviewLoader');
    const request: AvatarGalleryRequest = {
      theme: 'critters',
      count: getBaseTypeCatalog('critters').values.length,
      seed: 'catalog-abort',
      namespace: 'demo',
      backgroundShape: 'circle',
    };
    const controller = new AbortController();
    const pending = loadCatalogReview(request, controller.signal);
    const worker = latestWorker();

    controller.abort();

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
    expect(worker.terminateCalls).toBe(1);
    controller.abort();
    expect(worker.terminateCalls).toBe(1);
  });

  it('changes only interface colors when the system scheme flips', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    const lightAvatars = renderedAvatars(container);

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    cleanup();
    const darkRender = render(<App />);
    await finishLatestGallery();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(renderedAvatars(darkRender.container)).toEqual(lightAvatars);
  });

  it('recolors without requesting or changing avatar geometry', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    const mixedAvatars = renderedAvatars(container);
    const mixedGeometry = renderedGeometry(container);
    const workerCount = WorkerStub.instances.length;

    fireEvent.click(screen.getByRole('button', { name: 'Coast palette' }));

    expect(renderedGeometry(container)).toEqual(mixedGeometry);
    expect(renderedAvatars(container)).not.toEqual(mixedAvatars);
    expect(WorkerStub.instances).toHaveLength(workerCount);
  });

  it('keeps the current preview and download actions while regenerating', async () => {
    const { container } = render(<App />);
    await finishLatestGallery();
    const preview = renderedAvatars(container);
    const saveSvg = screen.getByRole('button', {
      name: 'Download selected avatar as SVG',
    }) as HTMLButtonElement;
    const savePng = screen.getByRole('button', {
      name: 'Download selected avatar as PNG',
    }) as HTMLButtonElement;

    const regenerate = screen.getByRole('button', { name: 'Regenerate avatar gallery' });
    const regenerateText = screen.getByText('Regenerate');
    fireEvent.click(regenerate);

    expect(screen.getByRole('button', { name: 'Regenerate avatar gallery' })).toBe(regenerate);
    expect(screen.getByText('Regenerate')).toBe(regenerateText);
    expect(saveSvg.disabled).toBe(false);
    expect(savePng.disabled).toBe(false);
    expect(renderedAvatars(container)).toEqual(preview);
    expect(screen.getByRole('status').textContent).toContain('Generating');
  });

  it('updates the favicon from the selected reproducible avatar', async () => {
    render(<App />);
    const gallery = await finishLatestGallery();

    await waitFor(() => {
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      expect(favicon?.href).toContain(encodeURIComponent(gallery[0]!.svg));
    });
  });
});
