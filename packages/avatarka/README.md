# avatarka

[![npm](https://img.shields.io/npm/v/avatarka)](https://www.npmjs.com/package/avatarka)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://avatarka.akinshin.dev/)

Deterministic, curated SVG avatar identities with typed recipes and balanced galleries.

## Install

```bash
npm install avatarka
```

## Create an identity

`createAvatar` is the high-level API. Give it a theme and stable seed; it returns an immutable generated avatar containing `{ recipe, theme, params, svg }`.

```ts
import { createAvatar } from 'avatarka';

const avatar = createAvatar('folks', 'user-123', {
  namespace: 'my-product',
  palette: 'coast',
  backgroundShape: 'circle',
});

document.querySelector('#avatar')!.innerHTML = avatar.svg;
localStorage.setItem('avatar', JSON.stringify(avatar.recipe));
```

For recipe protocol v1, the same theme, seed, namespace, presentation, and traits produce byte-identical params, canonical recipe JSON, and SVG. The built ESM/CJS corpus is checked on Node 18, 20, and 24. Omitting the seed creates fresh entropy and stores the generated seed in the returned recipe.

## Recipes

An `AvatarRecipe` is a small serializable source of truth:

```ts
import { createAvatar, createRecipe, parseRecipe } from 'avatarka';

const recipe = createRecipe('adventurers', 'user-123', {
  namespace: 'forum',
  palette: 'orchid',
  traits: {
    archetype: 'ranger',
    expression: 'content',
  },
});

const avatar = createAvatar(recipe);

const payload: unknown = JSON.parse(JSON.stringify(recipe));
const restored = createAvatar(parseRecipe(payload));
```

Recipes contain a format, protocol version, theme, seed, namespace, and optional presentation or trait overrides. `parseRecipe` strictly validates unknown data, rejects extra fields and unsupported versions, canonicalizes equivalent trait ordering and optional `undefined` (including nested known traits), and clones and freezes the accepted recipe. Public object inputs are treated as JSON-like data: plain records from any JavaScript realm are accepted, while enumerable accessor properties are rejected without being invoked.

Store recipes when an identity must survive application restarts. `RECIPE_VERSION` describes the recipe/rendering protocol and is independent from the npm major version.

## Presentation and traits

`palette` and `backgroundShape` are presentation-only. Changing them preserves the identity's semantic details. `traits` contains theme-specific semantic overrides and is type-checked against the chosen theme. When a parent trait such as `species`, `snack`, or `dwelling` is overridden, unset dependent details are drawn from that parent's curated compatibility set; explicitly supplied dependent traits still win.

```ts
const avatar = createAvatar('folks', 'user-123', {
  palette: 'clay',
  backgroundShape: 'rounded',
  traits: {
    hairStyle: 'coils',
    accessory: 'soft-glasses',
  },
});
```

Background shapes are `circle`, `rounded`, and `square`; `backgroundShapeNames` exposes that frozen canonical order.

## Low-level rendering

Use `generateParams` to generate complete editable typed parameters and `generateAvatar` to render exact parameters without generating or storing a recipe. Generated identity snapshots from `createAvatar` remain readonly.

`generateParams` requires an explicit seed because its return value does not carry a recipe. For a fresh random identity, use `createAvatar(theme)` and keep its captured `recipe` or `params`.

```ts
import {
  generateAvatar,
  generateParams,
  getDefaultParams,
  type FolksParams,
} from 'avatarka';

const params: FolksParams = generateParams('folks', 'user-123', {
  namespace: 'my-product',
  palette: 'grove',
});

const svg = generateAvatar('folks', params);
const defaults = getDefaultParams('folks');
```

Both overloads below are supported:

```ts
generateAvatar('folks', params);
generateAvatar({ theme: 'folks', params });
```

Direct parameters are runtime-validated against the theme schema before rendering.

## Galleries

`generateGallery` creates visually balanced choices. With an explicit seed, the complete gallery is deterministic, including its balance and order. Every item is a complete `GeneratedAvatar` with its own reproducible recipe.

`count` must be an integer from 0 through 1000. For larger batches, generate or stream individual identities instead of materializing the complete balanced gallery in one call.

```ts
import { generateGallery } from 'avatarka';

const choices = generateGallery(25, 'team-42', {
  themes: ['critters'],
  namespace: 'avatar-picker',
  backgroundShape: 'circle',
});
```

The convenience overload `generateGallery(count, options)` creates a fresh gallery on every call and does not expose its internal gallery seed. Its returned item recipes can each be replayed exactly, but reproducing the whole balanced set requires passing and retaining an explicit seed.

Gallery options:

| Option | Type | Behavior |
| --- | --- | --- |
| `themes` | `readonly ThemeName[]` | Limits the canonical theme set; caller order and duplicates are ignored |
| `namespace` | `string` | Scopes the generated identities; defaults to `default` |
| `palette` | `PaletteName` | Forces one palette; omitted assigns a balanced palette mix |
| `backgroundShape` | `BackgroundShape` | Forces one frame shape |

The gallery distributes families, primary silhouettes, palettes, and high-impact traits while avoiding duplicate identities where the theme's parameter space permits. Primary types use independent per-theme cycles: no theme-local block up to the catalog length repeats a type, every complete block contains the exact catalog, and frequencies differ by at most one. Each item recipe pins only that scheduled primary trait; secondary details remain seed-natural and are selected from a small fixed balance pool. In mixed mode, every recipe also records its assigned palette for exact replay. Palette and frame choices never participate in identity selection: changing either presentation option for the same seeded gallery preserves every semantic trait at each index.

Every built-in catalog has 50 base types. Consequently, Gallery 25 is unique per theme, Gallery 50 uses each type once, Gallery 100 uses each type twice, and an eight-theme Gallery 400 covers all 400 theme-qualified base identities exactly once.

## Themes

`themeNames` is the frozen canonical order used throughout Avatarka:

| ID | Family |
| --- | --- |
| `folks` | Clean human portraits with 50 distinct ordered hair silhouettes |
| `adventurers` | Role-driven human portraits with expressive gear |
| `critters` | Editorial animal characters |
| `oddlings` | Soft, offbeat abstract creatures |
| `bots` | Friendly robots with 50 distinct ordered chassis topologies |
| `snacks` | Editorial food and drink characters |
| `nooks` | Tiny architectural characters |
| `orbs` | Friendly anonymous identities |

```ts
import {
  getBaseTypeCatalog,
  getTheme,
  themeNames,
  themes,
} from 'avatarka';

for (const id of themeNames) {
  const { name, description, kind, baseTypeParam, schema } = getTheme(id);
  console.log(id, name, description, kind, baseTypeParam, schema);
}

// `themes` contains the same deeply frozen metadata keyed by theme ID.
console.log(themes.folks.schema);

const critters = getBaseTypeCatalog('critters');
// `param` is exactly "species" and `values` comes from that schema definition.
console.log(critters.param, critters.values);
```

Theme metadata and base-type catalogs are deeply frozen and deliberately exclude renderer and randomizer internals. `getBaseTypeCatalog(theme)` preserves the correlation between a theme, its primary select parameter, and that parameter's exact literal values.

## Palettes

The frozen canonical palette order is `coast`, `orchid`, `clay`, `grove`, `sky`, and `mono`. Every palette defines `canvas`, `primary`, `secondary`, `accent`, and `ink` colors, and is designed to work unchanged on light and dark application surfaces.

```ts
import { getPalette, paletteNames, palettes } from 'avatarka';

const coast = getPalette('coast');
console.log(paletteNames, coast.canvas, palettes.mono.ink);
```

## Browser PNG helpers

PNG conversion is isolated in the browser-only export so the main package remains safe for Node.js and SSR.

```ts
import { createAvatar } from 'avatarka';
import { svgToPng, svgToPngDataUrl } from 'avatarka/browser';

const { svg } = createAvatar('orbs', 'user-123');
const pngBlob = await svgToPng(svg, { size: 512 });
const pngDataUrl = await svgToPngDataUrl(svg, { size: 128 });
```

The helpers require browser Canvas, image, Blob, and object URL APIs. Output size defaults to 256 pixels and must be an integer from 1 through 8192. Both helpers report validation and rendering failures as rejected promises.

## Public types

The root package exports the correlated types used by the API, including `AvatarOptions`, `AvatarRecipe`, `BaseTypeCatalog`, `GeneratedAvatar`, `GalleryOptions`, `ThemeName`, `ThemeParams`, `ThemeTraits`, `ThemeMetadata`, `PaletteName`, `BackgroundShape`, and all eight concrete parameter types. TypeScript consumers require TypeScript 5.4 or newer.

## Migrating from v3

Avatarka v4 deliberately replaces the previous visual catalog and removes its compatibility API. Seeded v3 identities do not retain their artwork. Pin `avatarka@3.0.0` if you need the old avatars.

- `randomAvatar(theme, seed)` becomes `createAvatar(theme, seed).svg`.
- Unseeded `generateParams(theme)` becomes `createAvatar(theme).params`; otherwise pass an explicit seed.
- `getThemeNames()` becomes the frozen `themeNames` tuple.
- `GalleryItem` and `GenerateGalleryOptions` become `GeneratedAvatar` and `GalleryOptions`.
- `studio.createRecipe(...)` plus `studio.generateIdentity(...)` becomes `createAvatar(...)` and the returned `avatar.recipe`, or `createRecipe(...)` followed by `createAvatar(recipe)`.
- `avatarka/studio/v1` no longer exists; import from `avatarka`.
- Browser conversion helpers moved from `avatarka` to `avatarka/browser`.
- The v3 RNG/color helpers, generic theme types, and old concrete theme-param exports are intentionally absent. Pin v3 or own those utilities in application code.

## React

Use [avatarka-react](https://www.npmjs.com/package/avatarka-react) for an SSR-safe `<Avatar>` and accessible `<AvatarPicker>`.

## License

MIT
