import { generateGallery, type GeneratedAvatar } from 'avatarka';
import type { AvatarGalleryRequest } from 'avatarka-react';

self.addEventListener('message', (event: MessageEvent<AvatarGalleryRequest>) => {
  const request = event.data;
  const gallery: GeneratedAvatar[] = generateGallery(request.count, request.seed, {
    themes: [request.theme],
    namespace: request.namespace,
    backgroundShape: request.backgroundShape,
  });
  self.postMessage(gallery);
});

export {};
