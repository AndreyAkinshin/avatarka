# Avatarka - Technical Documentation for LLM Agents

This document provides comprehensive technical details about the avatarka project for AI assistants and automated tooling.

## Repository Structure

```
avatarka/
├── packages/
│   ├── avatarka/                    # Core library (single dep: pragmastat for PRNG)
│   │   ├── src/
│   │   │   ├── index.ts             # Main entry, public API exports
│   │   │   ├── types.ts             # TypeScript type definitions
│   │   │   ├── prng.ts              # Seeded PRNG wrapper (delegates to pragmastat)
│   │   │   ├── utils.ts             # Color and SVG utilities
│   │   │   ├── __tests__/           # Unit tests (vitest)
│   │   │   │   ├── index.test.ts
│   │   │   │   ├── prng.test.ts
│   │   │   │   ├── themes.test.ts
│   │   │   │   ├── utils.test.ts
│   │   │   │   ├── snapshots.test.ts
│   │   │   │   └── __snapshots__/   # Snapshot files for snapshots.test.ts
│   │   │   └── themes/
│   │   │       ├── index.ts         # Theme registry and exports
│   │   │       ├── people.ts        # Human avatars theme
│   │   │       ├── animals.ts       # Animal faces theme
│   │   │       ├── monsters.ts      # Monster characters theme
│   │   │       ├── robots.ts        # Robot heads theme
│   │   │       ├── aliens.ts        # Extraterrestrial beings theme
│   │   │       ├── ocean.ts         # Ocean creatures theme
│   │   │       ├── dinosaurs.ts     # Prehistoric dinosaurs theme
│   │   │       ├── mythical.ts      # Mythical creatures theme
│   │   │       ├── insects.ts       # Insects theme
│   │   │       ├── birds.ts         # Bird species theme
│   │   │       ├── plants.ts        # Plants theme
│   │   │       ├── food.ts          # Food items theme
│   │   │       ├── weather.ts       # Weather phenomena theme
│   │   │       └── gems.ts          # Gemstones theme
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   └── avatarka-react/              # React components
│       ├── src/
│       │   ├── index.ts             # Component exports + core re-exports
│       │   ├── Avatar.tsx           # Simple renderer component
│       │   ├── AvatarEditor.tsx     # Interactive editor component
│       │   ├── AvatarPicker.tsx     # Self-contained picker with gallery
│       │   ├── styles.css          # AvatarPicker styles (consumers import 'avatarka-react/styles.css')
│       │   └── __tests__/
│       │       └── Avatar.test.tsx
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
├── apps/
│   └── demo/                        # Vite demo application
│       ├── src/
│       │   ├── main.tsx             # React entry point
│       │   ├── App.tsx              # Main demo component
│       │   └── styles.css           # Demo styles
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── .github/workflows/
│   ├── ci.yml                       # CI pipeline (restore → build → test → check)
│   └── publish.yml                  # Publish to npm + GitHub Pages
├── VERSION                          # Single version source (currently 1.1.0)
├── package.json                     # Root workspace config
├── pnpm-workspace.yaml              # pnpm workspace definition
├── turbo.json                       # Turborepo pipeline config
├── tsconfig.base.json               # Shared TypeScript config
├── vitest.config.mts                # Test configuration (vitest + jsdom)
├── mise.toml                        # Task runner configuration
├── README.md                        # User documentation
└── AGENTS.md                        # This file
```

## Architecture Overview

### Package Dependencies

```
demo (app)
  └── avatarka-react
        └── avatarka (core)
```

### Data Flow

1. **Parameter Generation**: `seed → new Rng(seed) → theme.randomize(rng) → params`
2. **Avatar Generation**: `params → theme.generate() → SVG string`
3. **React Rendering**: `params → generateAvatar() → SVG → img src (data URL) or dangerouslySetInnerHTML`
4. **PNG Generation (Browser)**: `SVG string → Canvas API → PNG Blob/data URL`

## Core Implementation Details

### PRNG (pragmastat)

Location: `packages/avatarka/src/prng.ts`

The PRNG is a thin wrapper around the `pragmastat` library's `Rng` class:

```typescript
import { Rng } from 'pragmastat';
export { Rng } from 'pragmastat';

export function createRng(seed?: string | number): Rng {
  return new Rng(seed);
}
```

The `Rng` instance provides methods like `uniformInt()`, `uniformFloat()`, `uniformBool()`, `shuffle()`, etc. All theme `randomize` functions accept `Rng` (not a raw `() => number` function).

Key properties:
- Deterministic: Same seed always produces same sequence
- Rich API: Integer ranges, floats, booleans, shuffling
- Stateful: `Rng` instance maintains state between calls

### Parameter Schema System

Location: `packages/avatarka/src/types.ts`

```typescript
type ColorParam = {
  type: 'color';
  default: string;  // Hex color like '#ff0000'
};

type NumberParam = {
  type: 'number';
  default: number;
  min: number;
  max: number;
  step?: number;  // Optional step for sliders
};

type SelectParam = {
  type: 'select';
  default: string;
  options: string[];  // Array of valid options
};

type ParamDefinition = ColorParam | NumberParam | SelectParam;
type ParamSchema = { [key: string]: ParamDefinition };

// Extract parameter values type from a schema
type ParamsFromSchema<T extends ParamSchema> = {
  [K in keyof T]: /* inferred value type based on param kind */
};

// Theme definition interface
interface Theme<T extends ParamSchema = ParamSchema> {
  name: string;
  schema: T;
  shapeParam: string & keyof T;
  generate: (params: ParamsFromSchema<T>) => string;
  randomize: (rng: Rng) => ParamsFromSchema<T>;
}

// Generic params type for external use
type AvatarParams = Record<string, string | number>;
```

### SVG Generation Approach

All themes follow pure functional SVG generation:

1. **No DOM manipulation**: Functions return strings, never touch DOM
2. **Composable**: Small functions return SVG fragments, combined by main generator
3. **Standalone output**: Generated SVG includes xmlns and viewBox attributes
4. **Fixed viewBox**: All themes use 100x100 viewBox for consistency

Example from `packages/avatarka/src/utils.ts`:

```typescript
export function wrapSvg(content: string, size: number = 100): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">${content}</svg>`;
}
```

### Gallery Generation

Location: `packages/avatarka/src/index.ts` — `generateGallery(count, seed?, options?)`

Generates a diverse gallery of N avatars with guaranteed visual variety:
- Exactly 1 avatar from the `'people'` theme
- Round-robin theme distribution across remaining non-people themes
- Per-field uniqueness tracking: no two avatars share the same value for any field (except exempt values `'none'`/`'no'`)
- Colors adjusted (lighten/darken) to avoid exact duplicates
- Graceful degradation when all options for a field are exhausted
- Final result is shuffled for random ordering

Returns `GalleryItem[]` where each item has `{ theme, params, svg }`.

Options:
- `backgroundShape?: string` — Force a specific background shape for all items
- `transparentBackground?: boolean` — Force transparent background for all items

### React: AvatarPicker Component

Location: `packages/avatarka-react/src/AvatarPicker.tsx`

Self-contained avatar picker with internal state management. Requires `import 'avatarka-react/styles.css'` for styling. Features:
- Tab-based UI: Editor mode (parameter controls) and Gallery mode (grid of random avatars)
- Theme selector dropdown
- Parameter locking: users can lock specific fields, then randomize only unlocked ones
- Dice button for randomization
- Optional SVG/PNG save buttons (via `onSaveSvg`/`onSavePng` callbacks)
- CSS custom properties for theming (see avatarka-react README)
- Two layout modes: `'default'` (stacked) and `'compact'` (side-by-side)

## Theme Implementation Pattern

Each theme module exports:

```typescript
// Schema with const assertion for type inference
export const schema = {
  paramName: {
    type: 'color' | 'number' | 'select',
    default: defaultValue,
    // ... type-specific fields
  },
} as const satisfies ParamSchema;

// Inferred params type from schema
export type ThemeParams = ParamsFromSchema<typeof schema>;

// Generate SVG from parameters
export function generate(params: ThemeParams): string {
  // Build SVG string from params
  return wrapSvg(content);
}

// Generate random parameters using RNG
export function randomize(rng: Rng): ThemeParams {
  return {
    paramName: randomPick(options, rng),
    // ... generate each param using rng
  };
}

// Theme object for registry
export const themeName: Theme<typeof schema> = {
  name: 'Display Name',
  schema,
  shapeParam: 'paramName', // Primary visual shape/silhouette field
  generate,
  randomize,
};
```

The `shapeParam` property identifies which schema key defines the primary visual shape (e.g., `'animalType'` for animals, `'bodyShape'` for monsters). This is used by `generateGallery` to ensure shape diversity.

### Full Theme Example

Here's a minimal theme implementation:

```typescript
// packages/avatarka/src/themes/example.ts
import type { Rng } from 'pragmastat';
import type { ParamSchema, ParamsFromSchema, Theme } from '../types';
import { randomColor, randomPick, wrapSvg } from '../utils';

export const schema = {
  backgroundColor: {
    type: 'color',
    default: '#3498db',
  },
  shape: {
    type: 'select',
    default: 'circle',
    options: ['circle', 'square', 'triangle'],
  },
  size: {
    type: 'number',
    default: 40,
    min: 20,
    max: 45,
  },
} as const satisfies ParamSchema;

export type ExampleParams = ParamsFromSchema<typeof schema>;

export function generate(params: ExampleParams): string {
  const { backgroundColor, shape, size } = params;

  let shapeElement: string;
  switch (shape) {
    case 'circle':
      shapeElement = `<circle cx="50" cy="50" r="${size}" fill="white"/>`;
      break;
    case 'square':
      const offset = 50 - size;
      shapeElement = `<rect x="${offset}" y="${offset}" width="${size * 2}" height="${size * 2}" fill="white"/>`;
      break;
    case 'triangle':
      shapeElement = `<polygon points="50,${50 - size} ${50 + size},${50 + size} ${50 - size},${50 + size}" fill="white"/>`;
      break;
  }

  return wrapSvg(`
    <rect width="100" height="100" fill="${backgroundColor}"/>
    ${shapeElement}
  `);
}

export function randomize(rng: Rng): ExampleParams {
  const shapes = ['circle', 'square', 'triangle'] as const;

  return {
    backgroundColor: randomColor(rng),
    shape: randomPick(shapes, rng),
    size: rng.uniformInt(20, 46), // 20-45
  };
}

export const example: Theme<typeof schema> = {
  name: 'Example',
  schema,
  shapeParam: 'shape',
  generate,
  randomize,
};
```

## Adding a New Theme

Step-by-step guide:

### 1. Create Theme File

```bash
touch packages/avatarka/src/themes/newtheme.ts
```

### 2. Implement Theme Module

Follow the pattern above with:
- `schema` constant with `as const satisfies ParamSchema`
- `generate(params)` function returning SVG string
- `randomize(rng: Rng)` function returning params object
- `shapeParam` set to the schema key that defines the primary visual shape
- `themeName` exported Theme object

### 3. Register in Theme Index

Edit `packages/avatarka/src/themes/index.ts`:

```typescript
// Add export
export { newtheme, schema as newthemeSchema } from './newtheme';
export type { NewthemeParams } from './newtheme';

// Add to themes object
import { newtheme } from './newtheme';

export const themes = {
  // ... existing themes
  newtheme,
} as const;
```

### 4. Update ThemeName Type

The `ThemeName` type is automatically inferred from the themes object:

```typescript
export type ThemeName = keyof ThemeMap; // Will include 'newtheme'
```

### 5. Rebuild

```bash
mise run build
```

## Build & Development Commands

All tasks are run via [mise](https://mise.jdx.dev/):

```bash
mise run restore       # Install dependencies
mise run build         # Build all packages
mise run build:static  # Build all packages and demo static site
mise run test          # Run tests
mise run check         # Run TypeScript type checking
mise run check:fix     # Auto-fix static analysis issues
mise run clean         # Clean build artifacts
mise run dev           # Start development mode (watch)
mise run ci            # Full CI pipeline: restore → clean → build → check → test
mise run version X.Y.Z # Bump version in VERSION + package.json files, commit
mise run publish X.Y.Z # Bump version, push, trigger publish workflow
```

### CI/CD Pipelines

- **`.github/workflows/ci.yml`**: Runs on push/PR — restore, build, test, check
- **`.github/workflows/publish.yml`**: Manual trigger — full CI, npm publish, git tag, GitHub Release, deploy demo to GitHub Pages

### Turborepo Pipeline

The `turbo.json` configures:

- `build`: Runs tsup for each package, respects dependency order
- `test`: Runs tests after build, no caching
- `dev`: Parallel watch mode
- `clean`: Removes dist directories

### Package Build (tsup)

Both packages use tsup with:
- ESM and CJS outputs
- TypeScript declarations
- Source maps
- External React (for avatarka-react)

## Testing

Tests use **vitest** with jsdom environment (configured in `vitest.config.mts`).

### Test Files

| File | Coverage |
|------|----------|
| `packages/avatarka/src/__tests__/prng.test.ts` | PRNG seeding and determinism |
| `packages/avatarka/src/__tests__/index.test.ts` | Core API (generateAvatar, generateParams, gallery, etc.) |
| `packages/avatarka/src/__tests__/themes.test.ts` | Theme-specific generation |
| `packages/avatarka/src/__tests__/utils.test.ts` | Color and SVG utility functions |
| `packages/avatarka/src/__tests__/snapshots.test.ts` | SVG snapshot regression tests |
| `packages/avatarka-react/src/__tests__/Avatar.test.tsx` | React component rendering |

### Running Tests

```bash
mise run test      # Run all tests
```

## Package Publishing

### Version Management

The single source of truth is the `VERSION` file at the repository root. The `mise run version` task propagates it to both `packages/avatarka/package.json` and `packages/avatarka-react/package.json`.

### Publishing

```bash
mise run publish 1.2.0
```

This bumps the version, commits, pushes, and triggers the `publish.yml` GitHub Actions workflow which builds, tests, publishes to npm, creates a git tag, a GitHub Release, and deploys the demo site.

## Known Limitations

1. **No SSR optimization**: SVG generated at runtime, not at build time
2. **Fixed viewBox**: All themes use 100x100, cannot be customized
3. **No animation support**: Static SVG only
4. **Limited accessibility**: Alt text on React component, but SVG lacks ARIA attributes
5. **No caching**: Same params regenerate SVG each render (consider memoization in consuming code)

## Design Decisions

### Why pragmastat for PRNG?

- Provides a rich `Rng` API (integers, floats, booleans, shuffling) without reimplementing
- Deterministic seeding from strings or numbers
- Good statistical properties for visual randomization
- Single dependency keeps the library lightweight

### Why `as const satisfies ParamSchema`?

- `as const` preserves literal types for options arrays
- `satisfies` ensures schema matches ParamSchema without widening types
- Enables type inference for `ParamsFromSchema<typeof schema>`

### Why separate randomize from generate?

- Allows users to generate params, modify some, then generate avatar
- Enables storing/serializing params for deterministic recreation
- Separates concerns: randomization logic vs rendering logic

### Why data URLs in Avatar component?

- Avoids XSS concerns with dangerouslySetInnerHTML
- Works as standard img element with proper sizing
- Can be used in contexts where innerHTML isn't allowed

## Utility Functions Reference

### Color Utilities (`packages/avatarka/src/utils.ts`)

The five color functions below are re-exported from the package's public API (`index.ts`).
All RNG-accepting functions take a `Rng` instance from `pragmastat`.

| Function                       | Description                                        |
|--------------------------------|----------------------------------------------------|
| `hslToHex(h, s, l)`           | Convert HSL to hex color                           |
| `randomColor(rng: Rng)`       | Generate random saturated color (S 50-89, L 40-69) |
| `randomPastelColor(rng: Rng)` | Generate random pastel color (S 40-69, L 70-89)    |
| `darkenColor(hex, amount?)`   | Darken hex color (default amount: 20)              |
| `lightenColor(hex, amount?)`  | Lighten hex color (default amount: 20)             |

### Random Utilities (internal, not re-exported from package entry)

| Function                         | Description                        |
|----------------------------------|------------------------------------|
| `randomPick(arr, rng: Rng)`     | Pick random item from array        |
| `randomInt(min, max, rng: Rng)` | Random integer in range [min, max] |
| `randomFloat(min, max, rng: Rng)` | Random float in range [min, max) |

### SVG Utilities (internal, not re-exported from package entry)

| Function                                                  | Description                                   |
|-----------------------------------------------------------|-----------------------------------------------|
| `wrapSvg(content, size?)`                                | Wrap content in SVG element (default: 100)    |
| `generateBackgroundShape(shape, color, size?, contentHash?)` | Generate background + clip path for shape  |
| `wrapSvgWithShape(content, shape, bgColor, size?)`       | Wrap content in SVG with background shape     |
