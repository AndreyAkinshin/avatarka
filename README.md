# Avatarka

[![npm avatarka](https://img.shields.io/npm/v/avatarka?label=npm%20avatarka)](https://www.npmjs.com/package/avatarka)
[![npm avatarka-react](https://img.shields.io/npm/v/avatarka-react?label=npm%20avatarka-react)](https://www.npmjs.com/package/avatarka-react)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://avatarka.akinshin.dev/)

Deterministic, curated SVG avatar identities for JavaScript, TypeScript, and React.

Avatarka v4 is a clean visual and API reset. It ships eight cohesive character families, six surface-neutral palettes, serializable identity recipes, balanced galleries, and browser PNG export. Within one recipe protocol, the same theme, seed, namespace, and options always reproduce the same identity.

## Install

```bash
npm install avatarka

# React components
npm install avatarka avatarka-react
```

## Quick start

`createAvatar` is the primary API. It returns the rendered SVG together with the exact parameters and a recipe you can store.

```ts
import { createAvatar } from 'avatarka';

const avatar = createAvatar('folks', 'user-123', {
  namespace: 'acme-dashboard',
  palette: 'coast',
});

avatar.svg;
avatar.params;
avatar.recipe;
```

Strings and numbers are distinct seeds. Use a namespace to keep the same seed independent across products, tenants, or identity domains.

For recipe protocol v1, the same theme, seed, namespace, presentation, and traits produce byte-identical params, recipe JSON, and SVG. This contract is checked against the built ESM and CJS packages on Node 18, 20, and 24. A renderer change cannot silently alter an existing seeded identity without an explicit recipe-protocol decision.

If you omit the seed, Avatarka generates one and records it in `avatar.recipe`, so the result can still be reproduced.

## Recipes

Recipes are JSON-safe identity records. Save the recipe rather than the generated SVG when you want to re-render an identity later.

```ts
import { createAvatar, parseRecipe } from 'avatarka';

const original = createAvatar('adventurers', 'ada@example.com', {
  namespace: 'community',
  palette: 'orchid',
  backgroundShape: 'rounded',
  traits: {
    archetype: 'aviator',
    expression: 'curious',
  },
});

localStorage.setItem('avatar', JSON.stringify(original.recipe));

const stored: unknown = JSON.parse(localStorage.getItem('avatar')!);
const restored = createAvatar(parseRecipe(stored));
```

`parseRecipe` strictly validates untrusted input, rejects unknown fields and unsupported recipe versions, canonicalizes equivalent JSON-safe inputs, and returns an immutable clone. Recipe protocol versions are independent from npm package versions.

## Exact parameter control

Use `generateParams` when you need complete editable typed parameters, and `generateAvatar` as the low-level pure renderer. The params stored on a generated identity remain readonly.

`generateParams` always requires an explicit seed. For a fresh random identity, call `createAvatar(theme)` so the generated seed is captured in its recipe.

```ts
import { generateAvatar, generateParams } from 'avatarka';

const params = generateParams('folks', 'user-123', {
  palette: 'clay',
  traits: { hairStyle: 'wave' },
});

const svg = generateAvatar('folks', params);
```

Presentation fields (`palette` and `backgroundShape`) are separate from semantic `traits`, so recoloring or reframing an identity does not change its character details. Overriding a parent trait also reselects any unset dependent details from the matching curated set, while explicit child overrides are preserved.

## Balanced galleries

```ts
import { generateGallery } from 'avatarka';

const choices = generateGallery(25, 'team-42', {
  themes: ['critters'],
  namespace: 'profile-picker',
  backgroundShape: 'circle',
});

// Array<{ recipe, theme, params, svg }>
```

Omit `palette` for a balanced mix of all palettes, or set one palette for the entire gallery. Mixed galleries store the assigned palette in each item recipe for exact replay. Palette and frame choices do not affect which semantic identity is selected at any gallery index. Omit `themes` to distribute results across all eight families. `themes` is treated as a canonical set: caller order and duplicates do not change a seeded gallery.

Each family schedules its primary catalog independently. A theme-local block up to that catalog's length contains no repeated base type; complete blocks contain every type once, and longer galleries start another deterministic cycle. Every item recipe records only its scheduled primary trait in `traits`, while all secondary details remain naturally seeded and gallery-balanced. This keeps mixed galleries reproducible without searching for a seed that happens to produce the requested type.

All eight built-in catalogs contain 50 base types. A single-theme Gallery 25 therefore has 25 distinct types, Gallery 50 contains every type once, and Gallery 100 contains every type twice. A canonical eight-theme Gallery 400 contains each theme-qualified base identity exactly once.

Pass an explicit seed when the complete gallery must be reproducible, including its balance and order. The convenience overload `generateGallery(count, options)` creates a fresh gallery on every call and does not expose its internal gallery seed. Every returned item still carries a reproducible recipe, but replaying the whole set requires supplying and retaining an explicit seed.

`count` must be an integer from 0 through 1000; stream individual identities for larger batches.

## Catalog

The canonical theme order used by the API, demo, and React picker is:

1. `folks` — clean human portraits
2. `adventurers` — expressive role-driven people
3. `critters` — warm animal characters
4. `oddlings` — playful abstract creatures
5. `bots` — friendly industrial robots
6. `snacks` — editorial food and drink characters
7. `nooks` — tiny architectural characters
8. `orbs` — calm anonymous identities

Use the frozen `themeNames` tuple for that order and `getTheme(name)` or `themes` for safe metadata and schemas. `getBaseTypeCatalog(theme)` returns the theme's primary catalog axis directly from that schema, with correlated literal types:

```ts
import { getBaseTypeCatalog } from 'avatarka';

const critters = getBaseTypeCatalog('critters');
// { param: 'species', values: readonly ('cat' | 'dog' | ...)[] }
```

The returned catalog object and its `values` are deeply frozen and contain no renderer or randomizer internals.

Folks exposes 50 ordered, individually drawn `hairStyle` silhouettes through
that catalog. Hair styles stay available across every skin tone and face shape;
headwear is intentionally separate from the hair-style axis.

Bots exposes 50 ordered `chassis` topologies through the same catalog API. Each
topology has its own face plate and hardware anchors; antennas, side sensors,
panels, palettes, and frames do not rescale or recenter the underlying robot.
Every bot keeps a friendly mouth independent of its selected panel.

The canonical palettes are `coast`, `orchid`, `clay`, `grove`, `sky`, and `mono`. They use the same avatar canvas in light and dark interfaces, so previews and exported files stay identical. Use `paletteNames`, `getPalette(name)`, or `palettes` to inspect them. The frozen `backgroundShapeNames` tuple provides the canonical `circle`, `rounded`, `square` frame order.

## PNG export in browsers

Canvas helpers live in the browser-only entrypoint and are not loaded by server code.

```ts
import { createAvatar } from 'avatarka';
import { svgToPng, svgToPngDataUrl } from 'avatarka/browser';

const { svg } = createAvatar('orbs', 'user-123');
const blob = await svgToPng(svg, { size: 512 });
const dataUrl = await svgToPngDataUrl(svg, { size: 128 });
```

Output size must be an integer from 1 through 8192. Both helpers report validation and rendering failures as rejected promises.

## React

```tsx
import { Avatar, AvatarPicker } from 'avatarka-react';
import 'avatarka-react/styles.css';

export function Profile() {
  return (
    <>
      <Avatar
        theme="folks"
        seed="user-123"
        namespace="my-app"
        size={64}
        alt="Andrey's avatar"
      />

      <AvatarPicker
        gallerySeed="profile-picker"
        namespace="my-app"
        onChange={(avatar) => {
          localStorage.setItem('avatar', JSON.stringify(avatar.recipe));
        }}
      />
    </>
  );
}
```

`Avatar` accepts exactly one source: a recipe, complete params, or a theme plus an explicit seed. `AvatarPicker` supports controlled and uncontrolled selection, observable user category browsing, configurable visual/keyboard column stride, async gallery loaders, SVG/PNG downloads, keyboard navigation, reduced motion, and CSS custom properties. See the [React package guide](packages/avatarka-react/README.md).

## Migrating from v3

Version 4 intentionally removes the old avatar catalog and compatibility layer. Existing seeded identities will not keep their v3 artwork. If you need those avatars, pin `avatarka@3.0.0` and, for React, `avatarka-react@3.0.0`.

- Replace `randomAvatar(theme, seed)` with `createAvatar(theme, seed).svg`.
- Replace unseeded `generateParams(theme)` with `createAvatar(theme).params`, or pass an explicit seed to `generateParams`.
- Replace `getThemeNames()` with the frozen `themeNames` tuple.
- Replace `GalleryItem` and `GenerateGalleryOptions` with `GeneratedAvatar` and `GalleryOptions`.
- Replace `studio.createRecipe(...)` plus `studio.generateIdentity(...)` with the root `createAvatar(...)` recipe flow.
- The `avatarka/studio/v1` entrypoint is removed; import the v4 API from `avatarka`.
- Import `svgToPng` and `svgToPngDataUrl` from `avatarka/browser`.
- `AvatarEditor` is removed. Use `AvatarPicker`, or build custom controls from `getTheme(theme).schema` with `generateAvatar`.
- The v3 RNG, color utilities, generic `Theme`/`ThemeMap`/`AvatarParams`, and old concrete theme-param exports have no v4 compatibility aliases. Pin v3 or keep application-specific utilities locally if you depend on them.

## Development

```bash
mise run restore
mise run build
mise run check
mise run test
mise run build:static
mise run ci
```

`mise run build` already builds the core package, React package, and Vite demo through Turborepo. `build:static` is a stable alias for that same production build.

TypeScript consumers require TypeScript 5.4 or newer with `moduleResolution` set to `Bundler`, `Node16`, or `NodeNext`. Legacy `Node` resolution does not understand package export subpaths such as `avatarka/browser` and `avatarka-react/styles.css`. JavaScript consumers are unaffected.

## Packages

- [`avatarka`](packages/avatarka/README.md) — deterministic core, recipes, SVG rendering, galleries, and browser PNG helpers
- [`avatarka-react`](packages/avatarka-react/README.md) — SSR-safe avatar rendering and an accessible picker

## License

MIT
