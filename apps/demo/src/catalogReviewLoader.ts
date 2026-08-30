import type { GeneratedAvatar } from 'avatarka';
import type { AvatarGalleryLoader, AvatarGalleryRequest } from 'avatarka-react';
import { DEV_CATALOG_REVIEW_SENTINEL } from './catalogReview';

function abortError(): DOMException {
  return new DOMException('Avatar catalog review generation was cancelled', 'AbortError');
}

/** Cancellable development-only adapter for the catalog review Worker. */
export const loadCatalogReview: AvatarGalleryLoader = (
  request: AvatarGalleryRequest,
  signal: AbortSignal,
) => new Promise<readonly GeneratedAvatar[]>((resolve, reject) => {
  if (signal.aborted) {
    reject(abortError());
    return;
  }

  const worker = new Worker(new URL('./catalogReview.worker.ts', import.meta.url), {
    type: 'module',
  });
  let settled = false;

  const cleanup = () => {
    signal.removeEventListener('abort', handleAbort);
    worker.terminate();
  };
  const resolveOnce = (gallery: readonly GeneratedAvatar[]) => {
    if (settled) return;
    settled = true;
    cleanup();
    resolve(gallery);
  };
  const rejectOnce = (reason: unknown) => {
    if (settled) return;
    settled = true;
    cleanup();
    reject(reason);
  };
  const handleAbort = () => rejectOnce(abortError());

  signal.addEventListener('abort', handleAbort, { once: true });
  worker.onmessage = (event: MessageEvent<GeneratedAvatar[]>) => {
    resolveOnce(event.data);
  };
  worker.onerror = (event) => {
    rejectOnce(event.error ?? new Error(
      event.message || `${DEV_CATALOG_REVIEW_SENTINEL}: catalog review worker failed`,
    ));
  };
  worker.onmessageerror = () => {
    rejectOnce(new Error(
      `${DEV_CATALOG_REVIEW_SENTINEL}: catalog review worker returned an unreadable message`,
    ));
  };
  try {
    worker.postMessage(request);
  } catch (reason) {
    rejectOnce(reason);
  }
});
