import type { AvatarGalleryRequest } from 'avatarka-react';
import {
  DEV_CATALOG_REVIEW_SENTINEL,
  generateCatalogReview,
} from './catalogReview';

self.addEventListener('message', (event: MessageEvent<AvatarGalleryRequest>) => {
  const request = event.data;
  if (!request || typeof request !== 'object') {
    throw new Error(`${DEV_CATALOG_REVIEW_SENTINEL}: invalid worker request`);
  }
  self.postMessage(generateCatalogReview(request));
});

export {};
