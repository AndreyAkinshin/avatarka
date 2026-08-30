# Avatarka v4 — Technical Guide for Agents

This repository contains the clean v4 Avatarka API and artwork. Preserve deterministic output, theme/type correlation, presentation-independent geometry, and the canonical catalog order when making changes.

## Repository layout

```text
avatarka/
├── packages/
│   ├── avatarka/                    # Framework-independent core
│   │   ├── src/
│   │   │   ├── index.ts             # Root public entry; re-exports core.ts
│   │   │   ├── core.ts              # Catalog, recipes, generation, galleries
│   │   │   ├── browser.ts           # Browser-only SVG-to-PNG helpers
│   │   │   ├── types.ts             # Internal schema primitives + public Seed
│   │   │   ├── palettes.ts          # Curated palettes and metadata
│   │   │   ├── version.ts           # Recipe protocol version
│   │   │   ├── fit.ts               # DOM-free SVG geometry fitting
│   │   │   ├── internal/
│   │   │   │   ├── art.ts           # Frame and hidden drawing variation
│   │   │   │   ├── gallery.ts       # Bounded per-theme base-type scheduling
│   │   │   │   ├── random.ts        # Seeded named random streams
│   │   │   │   ├── types.ts         # Internal theme/RNG contracts
│   │   │   │   └── validation.ts    # Runtime schema validation
│   │   │   ├── themes/               # Eight v4 SVG theme implementations
│   │   │   └── __tests__/            # Core, protocol, types, fit, browser tests
│   │   ├── package.json
│   │   └── tsup.config.ts            # Builds root and browser entrypoints
│   └── avatarka-react/
│       ├── src/
│       │   ├── index.ts              # Components + explicit full core API mirror
│       │   ├── Avatar.tsx            # SSR-safe deterministic <img>
│       │   ├── AvatarPicker.tsx      # Async gallery picker
│       │   ├── styles.css            # Picker stylesheet and CSS variables
│       │   └── __tests__/
│       ├── package.json
│       └── tsup.config.ts
├── apps/demo/
│   ├── src/App.tsx                   # v4 demo shell
│   ├── src/galleryLoader.ts          # Cancellable Worker adapter
│   ├── src/gallery.worker.ts         # Off-main-thread gallery generation
│   ├── src/catalogReviewLoader.ts     # DEV-only catalog Worker adapter
│   ├── src/catalogReview.worker.ts    # DEV-only schema-order catalog generation
│   └── src/App.test.tsx
├── .github/workflows/                # CI, publish, release, Pages deploy
├── scripts/check-versions.mjs        # Strict SemVer and package-version guard
├── VERSION                           # Package-version source of truth
├── mise.toml                         # Supported project tasks
├── package.json                      # pnpm/Turborepo workspace scripts
└── vitest.config.mts                 # Vitest + jsdom configuration
```

## Package graph

```text
apps/demo → avatarka-react → avatarka
          └────────────────→ avatarka
```

`avatarka` has one runtime dependency, `pragmastat`. React is a peer dependency of `avatarka-react`.

## Canonical catalog

The order below is part of the public product contract. Keep it identical in `internalThemes`, `themeNames`, galleries, demo controls, React controls, tests, and docs:

1. `folks`
2. `adventurers`
3. `critters`
4. `oddlings`
5. `bots`
6. `snacks`
7. `nooks`
8. `orbs`

The canonical palette order is `coast`, `orchid`, `clay`, `grove`, `sky`, `mono`.

The ordered Folks `hairStyle` catalog is also a public product contract:

```text
crop, long-straight, space-buns, sweep, beehive, side-braid, cloud, slick-back, high-ponytail, bald,
pixie, box-braids, pompadour, bob, bantu-knots, wave, undercut, ringlets, half-up-bun, flipped-ends,
shaved, twin-braids, quiff, shoulder-curls, mohawk, low-chignon, coils, curtain, high-top, double-puffs,
side-part, rope-twists, spiky, french-twist, shag, braided-crown, finger-waves, twin-ponytails, caesar, locs,
bowl-cut, loc-bun, asymmetric, cornrows, high-bun, mullet, victory-rolls, twist-out, bubble-ponytail, pineapple-updo
```

Keep headwear out of this axis, preserve culturally distinct constructions,
and derive schema order from the exhaustive hair-definition registry.

The ordered Bots `chassis` catalog is likewise a public product contract:

```text
capsule, block, dome, hex, taper, wide, cutout, bust, drum, pyramid,
shield, ring, hourglass, tripod, bell, stack, split-core, crossframe, clamshell, gyroscope,
crawler, twin-wheel, mono-wheel, walker, hover-skiff, saucer, quadcopter, satellite, rocket, submarine,
gantry, forklift, excavator, crane, loader, boiler, piston, turbine, magnet, lantern,
beetle, crab, spider, jelly, manta, snail, starframe, backpack, buoy, cloud-cluster
```

Derive schema order and randomizer weights from the exhaustive chassis registry.
Keep every topology inside the fixed hardware envelope, give every bot permanent
face semantics, and keep antenna, side-sensor, and panel overrides from moving
or resizing the chassis and face.

Palettes are presentation only. An avatar's SVG and exported file must not depend on the application's light/dark mode. Changing `palette` or `backgroundShape` may change colors or framing, but must not change semantic traits, feature positions, hidden drawing variation, or silhouette details.

## Core data flow

The high-level deterministic flow is:

```text
theme + seed + namespace + options
  → createRecipe
  → named random streams
  → theme.randomize
  → presentation/trait overrides
  → validated complete params
  → theme.generate
  → { recipe, theme, params, svg }
```

`createAvatar` is the primary public API. It accepts either a theme plus seed/options or an `AvatarRecipe`. If the seed is omitted, it materializes entropy and stores that seed in the returned recipe.

`generateParams` and `generateAvatar` are the low-level APIs. `generateParams` requires an explicit seed because params alone cannot capture entropy. `generateAvatar` validates and renders exact params and does not create a recipe. Use unseeded `createAvatar(theme)` when fresh entropy is wanted; its returned recipe records the generated seed.

`generateGallery` returns `GeneratedAvatar[]` and balances theme distribution, primary silhouettes, natural palette rotation, and selected high-impact traits. Its `themes` option is a canonical set: order and duplicates are semantically irrelevant. Base types are scheduled independently per theme: every theme-local block of catalog length contains no repeat, a complete block contains the exact catalog, and frequencies differ by at most one. Each item recipe pins only that scheduled base trait; a small fixed candidate pool chooses natural secondary traits without primary-trait seed probing. An explicit gallery seed reproduces the complete set and order. The unseeded convenience overload creates fresh entropy without returning a gallery-level seed; its individual items remain reproducible from their recipes. Preserve seeded byte determinism when optimizing gallery generation.

Gallery base-type cycle membership and order use separate named streams: `base-type-members:<theme>:<cycle>` samples the partial-cycle set, then `base-type-order:<theme>:<cycle>` shuffles that set after it has been restored to canonical catalog order. Avoid a repeated cycle-boundary neighbor with deterministic rotation when the block has another member. Every built-in catalog now contains exactly 50 base types: scheduler tests must keep Gallery 25 unique, Gallery 50 exhaustive exactly once, Gallery 100 exhaustive exactly twice, and the canonical eight-theme Gallery 400 exhaustive across all 400 theme-qualified base identities.

## Recipes and compatibility

Recipes use this public shape:

```ts
type AvatarRecipe<T extends ThemeName> = {
  readonly format: 'avatarka';
  readonly version: 1;
  readonly theme: T;
  readonly seed: string | number;
  readonly namespace: string;
  readonly palette?: PaletteName;
  readonly backgroundShape?: BackgroundShape;
  readonly traits?: Readonly<Partial<ThemeTraits<T>>>;
};
```

`RECIPE_VERSION` and `RECIPE_PROTOCOL` govern deterministic recipe rendering and are independent of the npm package version. `scripts/check-determinism.mjs` hashes canonical recipe JSON, params, and SVG from the built ESM/CJS packages; `mise run check:determinism` runs it on Node 18, 20, and 24. Any digest change requires reviewed fixture diffs and an explicit protocol-version decision.

`parseRecipe` is a trust boundary. It must continue to:

- accept only plain records;
- reject unknown format/version/theme/palette/frame values;
- reject unknown top-level fields and trait fields;
- keep the theme and traits correlated;
- validate string or finite numeric seeds and all schema values;
- return isolated frozen data rather than the caller's mutable objects.

The root `themes` export exposes deeply frozen metadata and schemas only. Do not expose renderer, randomizer, RNG, or art internals through public metadata.

## Deterministic randomness

`internal/random.ts` builds independent named streams from recipe protocol, namespace, seed type, seed value, and trait key. String seed `"1"` and numeric seed `1` are intentionally different.

Always use a stable, descriptive key for random choices. Never use `Math.random()`, current time, object iteration accidents, or one sequential RNG stream inside deterministic generation. Adding a new named choice must not shift existing unrelated choices.

`AvatarRandom.sample` accepts readonly input and a safe-integer count from zero through the input length. It returns an empty array for zero and otherwise delegates to Pragmastat's deterministic sampling without mutating the input.

`createArtVariation` adds small illustrator-like differences derived from semantic params. It deliberately excludes `palette` and `backgroundShape`; keep that invariant.

## Theme implementation

Each file in `packages/avatarka/src/themes` exports:

- a `schema` declared with `as const satisfies ParamSchema`;
- an inferred concrete params type;
- pure string-based SVG generation;
- randomization through `AvatarRandom` named methods;
- an `InternalTheme` object with `name`, `description`, `kind`, `baseTypeParam`, `schema`, `generate`, and `randomize`.

`baseTypeParam` must name a select definition in that theme's schema. It is the single source for gallery base-type scheduling, public metadata, and `getBaseTypeCatalog(theme)`. Gallery recipes override that one trait directly, so no parallel random-stream key or primary seed-probing contract belongs in `InternalTheme`.

All avatars use a 100×100 SVG viewBox. Rendering must remain DOM-free and work in Node.js. Reuse `renderAvatarFrame`, `createArtVariation`, and `fitToCircle` where appropriate. Avoid fragile CSS-dependent SVG appearance; exported SVG is the source of truth.

When changing artwork:

- inspect every schema option, not only random samples;
- verify ears, gear, appendages, strokes, and decorations fit inside circular frames;
- check all six palettes and all three background shapes;
- preserve readable contrast on light and dark host surfaces without changing SVG by host theme;
- keep repeated gallery avatars varied but stylistically coherent;
- update protocol snapshots only after confirming the change is intentional.

When adding or renaming a theme, update `internalThemes`, `themeNames`, `ThemeParamsMap`, the theme's base-type fields, balance maps, concrete type exports, React/demo assumptions, tests, and every README together.

## Parameter schemas

Built-in theme definitions use these internal schema primitives:

```ts
type ColorParam = { type: 'color'; default: string };
type NumberParam = {
  type: 'number';
  default: number;
  min: number;
  max: number;
  step?: number;
};
type SelectParam = {
  type: 'select';
  default: string;
  options: readonly string[];
};
```

Consumers inspect concrete, deeply frozen schema metadata through `themes` and `getTheme`. `getBaseTypeCatalog(theme)` returns a deeply frozen `{ param, values }` view derived directly from the selected schema options, with the theme/parameter/value types correlated and no renderer, randomizer, or RNG key exposed. The generic `ColorParam`, `NumberParam`, `SelectParam`, `ParamSchema`, and `ParamsFromSchema` helpers are implementation details rather than root-package exports.

`palette` and `backgroundShape` are common presentation params. `ThemeTraits<T>` omits them. Runtime validation must match TypeScript constraints: reject missing/extra direct params, invalid select values, malformed colors, non-finite numbers, and values that violate min/max/step.

## Browser entrypoint

`avatarka/browser` exports `svgToPng` and `svgToPngDataUrl`. Keep Canvas, Image, FileReader, Blob, and object URL assumptions out of the root entrypoint. Validate output sizes before doing browser work, provide clear non-browser errors, and revoke every object URL on success and failure.

## React package

`Avatar` has three mutually exclusive source modes:

- `recipe`;
- `theme` plus complete `params`;
- `theme` plus required `seed`, with optional namespace/palette/frame/traits.

It must remain deterministic during render and safe for SSR. It renders an `<img>` with an encoded SVG data URL and forwards normal image attributes.

`AvatarPicker` supports controlled `value`, uncontrolled `defaultValue`, and `onChange(GeneratedAvatar)`. `onThemeChange(theme)` observes only actual user category browsing; controlled recipe synchronization and palette/regeneration lifecycle do not invoke it. `galleryColumns` controls both rendered columns and Arrow Up/Down stride, must be a safe integer from 1 through `count`, and defaults to `ceil(sqrt(count))`. Its gallery loader contract is:

```ts
type AvatarGalleryLoader = (
  request: {
    theme: ThemeName;
    count: number;
    seed: Seed;
    namespace: string;
    backgroundShape: BackgroundShape;
  },
  signal: AbortSignal,
) => Promise<readonly GeneratedAvatar[]>;
```

Picker `count` is an integer from 1 through 100 so the mounted image grid, decoding work, transition DOM, and cache remain bounded. The non-UI core `generateGallery` API supports counts from 0 through 1000.

The default loader yields before synchronous generation. The demo supplies a Worker loader. Any loader change must preserve abort handling, stale-result rejection, bounded gallery caching, visible failure/retry UI, stable preview/download actions during regeneration, palette-only recoloring, keyboard behavior, and reduced motion.

Treat custom loader results as untrusted data. Require exact count and theme, parse and regenerate every recipe, and accept the result only when its theme, params, and SVG match that canonical avatar. Render accepted SVG through an encoded `<img>` data URL, as `Avatar` does; never place loader-supplied SVG into the DOM with `dangerouslySetInnerHTML`. Report gallery and built-in download failures through the typed `onError` context; never reclassify consumer callback exceptions as loader failures.

Consumers import `avatarka-react/styles.css` for the picker. Its package subpath must keep separate ESM `.d.ts` and CommonJS `.d.cts` targets so strict side-effect imports compile with Bundler, Node16, and NodeNext resolution. A clean production or watch build must emit both declaration targets plus the CSS asset. Preserve the documented `--avatarka-picker-*` custom properties. `Avatar` has no stylesheet dependency.

The React package explicitly mirrors the complete root `avatarka` API so component-oriented consumers can use one import surface. Keep that mirror as a reviewed runtime/type allow-list rather than using `export *`; browser-only PNG helpers stay in `avatarka/browser`.

## Demo

The Vite demo is a production consumer of the published package boundaries. Gallery generation runs in `gallery.worker.ts` through the cancellable adapter in `galleryLoader.ts`. Development builds also expose a review toggle whose separate Worker renders every current base type once in canonical schema order; its imports, controls, CSS, sentinel, and Worker chunk must be guarded by literal `import.meta.env.DEV` and absent from production artifacts. The UI theme may change only interface CSS, never generated SVG content.

For LAN review:

```bash
pnpm --filter demo dev -- --host 0.0.0.0 --port 4173
```

Vite permits `jn8128-box.local` in `apps/demo/vite.config.ts`.

## Commands

Use mise tasks from the repository root:

```bash
mise run restore       # pnpm install --frozen-lockfile
mise run build         # build core, React, and demo in dependency order
mise run build:static  # stable alias for the same production build
mise run check         # TypeScript checks for core, React, and demo
mise run check:determinism # built ESM/CJS protocol corpus on supported Node versions
mise run test          # all Vitest tests
mise run clean         # remove package/demo build output
mise run dev           # package watch mode through Turborepo
mise run ci            # restore → clean → build → check → test
```

Run targeted tests while iterating, then `mise run ci` before handoff when practical.

## Tests

- `core.test.ts`: deterministic generation, gallery balance, immutable metadata, visual invariants, and golden recipe protocol snapshots
- `api-types.test.ts`: compile-time theme/params/traits correlation
- `validation.test.ts`: schema and runtime input validation
- `fit.test.ts`: DOM-free SVG geometry fitting
- `browser.test.ts`: Canvas conversion, cleanup, validation, and environment errors
- React tests: SSR, mutually exclusive sources, async picker lifecycle, controlled state, downloads, keyboard navigation, and reduced motion
- Demo tests: canonical catalog, Worker lifecycle, stable presentation, regeneration, and favicon integration

Snapshot changes are protocol changes until proven otherwise. Review SVG diffs rather than blindly updating snapshots.

## Versioning and publishing

`VERSION` is the source of truth for both published package versions. `pnpm check:versions` validates strict SemVer syntax and requires `VERSION`, `avatarka`, and `avatarka-react` to agree; it is part of the normal `check` task.

```bash
mise run version 4.0.1
mise run publish 4.0.1
```

The version task refuses a dirty worktree before writing anything. The publish task validates the candidate, attached `main` branch, upstream state, and GitHub CLI authentication before creating a version commit. The workflow builds, tests, and packs once without registry credentials, then publishes those exact verified tarballs through npm trusted publishing (GitHub OIDC, `id-token: write` in the publish job only) — no long-lived npm token is stored anywhere. Stable releases use npm `latest`; SemVer prereleases use `next` and become GitHub prereleases. Separate minimal write jobs create the tag/release and deploy the verified demo artifact to GitHub Pages. Integrity and existing-tag checks make a safely resumed workflow idempotent without accepting mismatched package contents.

Every commit message must end with this trailer:

```text
Acked-by: Andrey Akinshin <andrey.akinshin@gmail.com>
```
