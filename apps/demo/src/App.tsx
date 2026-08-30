import { useEffect, useState } from 'react';
import {
  getBaseTypeCatalog,
  type GeneratedAvatar,
  type ThemeName,
} from 'avatarka';
import { AvatarPicker, type AvatarGalleryLoader } from 'avatarka-react';
import { loadAvatarGallery } from './galleryLoader';

if (import.meta.env.DEV) {
  void import('./catalogReview.css');
}

const loadCatalogReview: AvatarGalleryLoader | undefined = import.meta.env.DEV
  ? async (request, signal) => {
      const catalogModule = await import('./catalogReviewLoader');
      if (signal.aborted) {
        throw new DOMException('Avatar catalog review generation was cancelled', 'AbortError');
      }
      return catalogModule.loadCatalogReview(request, signal);
    }
  : undefined;

type ReviewMode = 'gallery' | 'catalog';

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function NpmIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0Zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331Zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669Zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331ZM10.665 10H12v2.667h-1.335V10Z" />
    </svg>
  );
}

function App() {
  const [avatar, setAvatar] = useState<GeneratedAvatar | null>(null);
  const [pickerTheme, setPickerTheme] = useState<ThemeName>('folks');
  const [reviewMode, setReviewMode] = useState<ReviewMode>('gallery');
  const catalogCount: number = getBaseTypeCatalog(pickerTheme).values.length;
  const isCatalogReview = import.meta.env.DEV && reviewMode === 'catalog';

  useEffect(() => {
    const mediaQuery = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
    const applyColorMode = () => {
      document.documentElement.dataset.theme = mediaQuery?.matches ? 'dark' : 'light';
    };

    applyColorMode();
    mediaQuery?.addEventListener('change', applyColorMode);
    return () => mediaQuery?.removeEventListener('change', applyColorMode);
  }, []);

  useEffect(() => {
    if (!avatar) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = `data:image/svg+xml,${encodeURIComponent(avatar.svg)}`;
  }, [avatar]);

  return (
    <div className={`app ${isCatalogReview ? 'app--catalog-review' : ''}`.trim()}>
      <main className="main-card">
        <AvatarPicker
          count={isCatalogReview ? catalogCount : 25}
          galleryColumns={isCatalogReview ? Math.min(10, catalogCount) : 5}
          gallerySeed="avatarka-v4-demo"
          namespace="demo"
          loadGallery={isCatalogReview && loadCatalogReview
            ? loadCatalogReview
            : loadAvatarGallery}
          onThemeChange={setPickerTheme}
          onChange={setAvatar}
          downloads
          paletteAccessory={import.meta.env.DEV ? (
            <div
              className="catalog-review-switch"
              role="group"
              aria-label="Gallery review mode"
            >
              <button
                type="button"
                aria-pressed={reviewMode === 'gallery'}
                aria-label="Gallery 25"
                title="Gallery 25"
                onClick={() => setReviewMode('gallery')}
              >
                25
              </button>
              <button
                type="button"
                aria-pressed={reviewMode === 'catalog'}
                aria-label="Catalog 50"
                title="Catalog 50"
                onClick={() => setReviewMode('catalog')}
              >
                {catalogCount === 50 ? '50' : `${catalogCount}/50`}
              </button>
            </div>
          ) : undefined}
          footerAccessory={(
            <>
              <span className="card-footer__brand">avatarka</span>
              <a
                className="card-footer__link"
                href="https://github.com/AndreyAkinshin/avatarka"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Avatarka on GitHub"
                title="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                className="card-footer__link"
                href="https://www.npmjs.com/package/avatarka-react"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="avatarka-react on npm"
                title="npm"
              >
                <NpmIcon />
              </a>
            </>
          )}
        />
      </main>
    </div>
  );
}

export default App;
