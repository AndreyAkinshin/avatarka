# avatarka-react

[![npm](https://img.shields.io/npm/v/avatarka-react)](https://www.npmjs.com/package/avatarka-react)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://avatarka.akinshin.dev/)

SSR-safe avatar rendering and an accessible, self-contained picker for [avatarka](https://www.npmjs.com/package/avatarka).

## Install

```bash
npm install avatarka avatarka-react react
```

TypeScript consumers need TypeScript 5.4 or newer with `moduleResolution` set to `Bundler`, `Node16`, or `NodeNext`. Legacy `Node` resolution does not understand the package's documented export subpaths. JavaScript consumers are unaffected.

## Avatar

`Avatar` renders an isolated `<img>` with an encoded SVG data URL. Supply exactly one source: a recipe, complete params, or a theme with an explicit seed.

```tsx
import { Avatar, createAvatar, generateParams } from 'avatarka-react';

const recipe = createAvatar('adventurers', 'user-123').recipe;
const params = generateParams('critters', 'user-456');

export function Examples() {
  return (
    <>
      <Avatar
        theme="folks"
        seed="user-123"
        namespace="my-app"
        palette="coast"
        size={64}
        alt="User avatar"
      />

      <Avatar recipe={recipe} size={64} />
      <Avatar theme="critters" params={params} size={64} />
    </>
  );
}
```

Seeded rendering requires a seed intentionally: the component never introduces randomness during render or SSR. `size` defaults to 100, `alt` defaults to an empty string for decorative images, and normal `<img>` attributes such as `className`, `loading`, and `aria-*` are forwarded. Source, responsive-source, dimensions, children, and inner-HTML attributes are owned by `Avatar` and cannot be overridden. Presentation and typed `traits` can be passed only in seeded mode.

`Avatar` needs no stylesheet.

## AvatarPicker

Import the picker stylesheet once in your application:

```tsx
import { AvatarPicker } from 'avatarka-react';
import 'avatarka-react/styles.css';

export function ProfileAvatarPicker() {
  return (
    <AvatarPicker
      defaultTheme="folks"
      gallerySeed="profile-choices"
      namespace="my-app"
      onChange={(avatar) => {
        localStorage.setItem('avatar', JSON.stringify(avatar.recipe));
      }}
      onError={(error, context) => {
        console.error(`Avatar ${context.operation} failed`, error);
      }}
    />
  );
}
```

The picker shows the canonical eight categories and mixed or named palettes, produces reproducible recipes, preserves the selected preview while a new gallery loads, and includes keyboard navigation and reduced-motion behavior.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `AvatarRecipe` | — | Controlled selected recipe |
| `defaultValue` | `AvatarRecipe` | — | Initial recipe for uncontrolled use |
| `onChange` | `(avatar: GeneratedAvatar) => void` | — | Receives the complete proposed selection |
| `onThemeChange` | `(theme: ThemeName) => void` | — | Reports actual user category browsing changes |
| `onError` | `(error: Error, context: AvatarPickerErrorContext) => void` | — | Reports gallery and built-in download failures |
| `defaultTheme` | `ThemeName` | `folks` | Initial category when no recipe is supplied |
| `defaultPalette` | `PaletteName \| 'mixed'` | `mixed` | Initial palette browsing mode |
| `gallerySeed` | `string \| number` | `avatarka-picker` | Stable seed for gallery choices |
| `namespace` | `string` | `default` | Identity scope for gallery recipes |
| `backgroundShape` | `circle \| rounded \| square` | `circle` | Frame used by gallery avatars |
| `count` | `number` | `25` | Integer number of mounted gallery choices from 1 through 100 |
| `galleryColumns` | `number` | `ceil(sqrt(count))` | Integer visual column count and Arrow Up/Down stride from 1 through `count` |
| `loadGallery` | `AvatarGalleryLoader` | main-thread async loader | Cancellable async gallery implementation |
| `downloads` | `boolean \| AvatarPickerDownloads` | `true` | Enables or configures built-in SVG/PNG downloads |
| `paletteAccessory` | `ReactNode` | — | Extra controls rendered at the end of the palette row |
| `footerAccessory` | `ReactNode` | — | Extra content rendered at the bottom of the preview panel |
| `className` | `string` | — | Additional root class |
| `style` | `AvatarPickerStyle` | — | Root inline styles and typed picker CSS variables |

In controlled mode, `onChange` proposes a complete generated avatar and the parent updates `value` with `avatar.recipe`:

```tsx
import { useState } from 'react';
import {
  AvatarPicker,
  createAvatar,
  type AvatarRecipe,
} from 'avatarka-react';

export function ControlledPicker() {
  const [value, setValue] = useState<AvatarRecipe>(
    () => createAvatar('folks', 'user-123').recipe,
  );

  return (
    <AvatarPicker
      value={value}
      onChange={(avatar) => setValue(avatar.recipe)}
      downloads={{ svg: true, png: true, pngSize: 1024 }}
    />
  );
}
```

Set `downloads={false}` to hide both actions. With an options object, enable `svg` and `png` independently; `pngSize` defaults to 512.

Gallery failures replace stale choices with a visible error and a Retry action. Gallery and built-in download failures are also reported through `onError(error, context)`. The context is a discriminated union: `operation: 'gallery'` includes the exact `request`, while `operation: 'svg-download' | 'png-download'` includes the selected `avatar`. `onThemeChange` fires only when the user clicks a different category; controlled recipe updates, palette changes, regeneration, retries, and internal request lifecycle events do not fire it. `AvatarPicker` does not catch or reclassify exceptions thrown by consumer callbacks such as `onChange` or `onThemeChange`. Handle failures inside the callback; React error boundaries do not catch exceptions originating from event handlers. The initial automatic selection is delivered from a React Effect and therefore follows React's Effect error propagation.

## Async gallery loading

The default loader yields the initial browser paint and then calls `generateGallery` on the main thread. For larger pickers, provide an `AvatarGalleryLoader` backed by a Web Worker or your own service. The picker aborts stale requests when its inputs change. `AvatarPicker` deliberately caps its mounted grid at 100 choices; the core `generateGallery` API retains its 1000-item batch limit for non-UI workflows.

```ts
import type {
  AvatarGalleryLoader,
} from 'avatarka-react';
import type { GeneratedAvatar } from 'avatarka';

export const loadGallery: AvatarGalleryLoader = (request, signal) =>
  new Promise<readonly GeneratedAvatar[]>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const worker = new Worker(
      new URL('./avatar-gallery.worker.ts', import.meta.url),
      { type: 'module' },
    );
    let settled = false;
    const cleanup = () => {
      signal.removeEventListener('abort', abort);
      worker.terminate();
    };
    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback();
    };
    const abort = () => finish(
      () => reject(new DOMException('Aborted', 'AbortError')),
    );

    signal.addEventListener('abort', abort, { once: true });
    worker.onmessage = (event: MessageEvent<GeneratedAvatar[]>) => {
      finish(() => resolve(event.data));
    };
    worker.onerror = (event) => {
      finish(() => reject(event.error ?? new Error(event.message)));
    };
    worker.onmessageerror = () => {
      finish(() => reject(new Error('Unreadable Worker response')));
    };
    try {
      worker.postMessage(request);
    } catch (error) {
      finish(() => reject(error));
    }
  });
```

The corresponding worker calls the core API:

```ts
// avatar-gallery.worker.ts
import { generateGallery } from 'avatarka';
import type { AvatarGalleryRequest } from 'avatarka-react';

self.addEventListener('message', (event: MessageEvent<AvatarGalleryRequest>) => {
  const request = event.data;
  self.postMessage(generateGallery(request.count, request.seed, {
    themes: [request.theme],
    namespace: request.namespace,
    backgroundShape: request.backgroundShape,
  }));
});
```

`AvatarGalleryRequest` is a readonly `{ theme, count, seed, namespace, backgroundShape }` snapshot and is frozen before it crosses the loader boundary. A loader must resolve exactly `count` unique generated avatars from the requested theme, use `${request.namespace}:gallery-item:${index}` for each recipe namespace, preserve the requested background shape, and honor its `AbortSignal`.

Custom-loader output crosses a strict trust boundary. For every item, the picker parses and regenerates `item.recipe` with the core API, rejects duplicate recipes and request-scope mismatches, then requires `theme`, `params`, and `svg` to match that canonical result exactly. A malformed, altered, or non-canonical item fails the whole request and exposes Retry; accepted SVG is rendered only through an encoded image URL, never inserted as live DOM markup. This makes structured-cloned Worker results safe while detecting stale or incompatible generator implementations.

## Styling

The picker inherits your font and exposes these CSS custom properties. Inline users can import `AvatarPickerStyle` for typed custom-property names:

```tsx
import type { AvatarPickerStyle } from 'avatarka-react';

const pickerStyle: AvatarPickerStyle = {
  '--avatarka-picker-bg': '#15171c',
  '--avatarka-picker-accent': '#8d91ff',
};
```

```css
.profile-picker {
  --avatarka-picker-bg: #15171c;
  --avatarka-picker-surface: #1d2027;
  --avatarka-picker-text: #f4f5f7;
  --avatarka-picker-muted: #a4aab5;
  --avatarka-picker-border: #343944;
  --avatarka-picker-accent: #8d91ff;
  --avatarka-picker-focus: #aeb1ff;
  --avatarka-picker-placeholder: #292d36;
}
```

Apply that class with `<AvatarPicker className="profile-picker" />`. The internal `--avatarka-picker-columns` value is computed from `galleryColumns`, or from `count` when `galleryColumns` is omitted; application code should configure the prop instead of overriding the internal variable.

## Re-exported core API

For component-oriented applications, `avatarka-react` explicitly mirrors the complete public root API from `avatarka`. You can install and import from one package without giving up recipes, strict parsing, low-level parameters, or catalog metadata:

```ts
import {
  RECIPE_VERSION,
  createAvatar,
  createRecipe,
  generateAvatar,
  generateGallery,
  generateParams,
  getBaseTypeCatalog,
  getDefaultParams,
  getPalette,
  getTheme,
  paletteNames,
  parseRecipe,
  themeNames,
} from 'avatarka-react';
```

The mirror is an explicit allow-list rather than `export *`, so additions stay deliberate and cannot collide silently with React components. Browser-only PNG helpers remain isolated in `avatarka/browser`.

## Migrating from v3

Version 4 removes the previous avatar catalog and React editor. Pin `avatarka@3.0.0` and `avatarka-react@3.0.0` if you need the old visuals.

- Replace `randomAvatar(theme, seed)` with `createAvatar(theme, seed).svg`.
- Replace `studio.createRecipe(...)` plus `studio.generateIdentity(...)` with the root `createAvatar(...)` recipe flow.
- Replace `AvatarEditor` with `AvatarPicker`, or build schema-driven controls on the core API.
- Picker changes now arrive through `onChange(avatar)` and persist as `avatar.recipe`.
- The root v4 catalog replaces the old Studio entrypoint; `avatarka/studio/v1` is removed.
- Import PNG helpers from `avatarka/browser`, not either package root.

## License

MIT
