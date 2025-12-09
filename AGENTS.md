# Avatarka - Technical Documentation for LLM Agents

This document provides comprehensive technical details about the avatarka project for AI assistants and automated tooling.

## Repository Structure

```
avatarka/
├── packages/
│   ├── avatarka/                    # Core library (zero dependencies)
│   │   ├── src/
│   │   │   ├── index.ts             # Main entry, public API exports
│   │   │   ├── types.ts             # TypeScript type definitions
│   │   │   ├── prng.ts              # Seeded PRNG implementation
│   │   │   ├── utils.ts             # Color and SVG utilities
│   │   │   └── themes/
│   │   │       ├── index.ts         # Theme registry and exports
│   │   │       ├── geometric.ts     # Geometric patterns theme
│   │   │       ├── monsters.ts      # Monster characters theme
│   │   │       ├── animals.ts       # Animal faces theme
│   │   │       ├── people.ts        # Human avatars theme
│   │   │       └── robots.ts        # Robot heads theme
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   └── avatarka-react/              # React components
│       ├── src/
│       │   ├── index.ts             # Component exports
│       │   ├── Avatar.tsx           # Simple renderer component
│       │   └── AvatarEditor.tsx     # Interactive editor component
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
├── package.json                     # Root workspace config
├── pnpm-workspace.yaml              # pnpm workspace definition
├── turbo.json                       # Turborepo pipeline config
├── tsconfig.base.json               # Shared TypeScript config
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

1. **Parameter Generation**: `seed → stringToSeed() → mulberry32() → rng → theme.randomize() → params`
2. **Avatar Generation**: `params → theme.generate() → SVG string`
3. **React Rendering**: `params → generateAvatar() → SVG → img src (data URL) or dangerouslySetInnerHTML`
4. **PNG Generation (Browser)**: `SVG string → Canvas API → PNG Blob/data URL`

## Core Implementation Details

### PRNG Algorithm (Mulberry32)

Location: `packages/avatarka/src/prng.ts`

```typescript
// Mulberry32 - Fast 32-bit PRNG with good statistical properties
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// String to numeric seed conversion
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
```

Key properties:
- Deterministic: Same seed always produces same sequence
- Fast: Single function with bitwise operations
- Stateful: Closure maintains seed state between calls

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
export function randomize(rng: () => number): ThemeParams {
  return {
    paramName: randomPick(options, rng),
    // ... generate each param using rng
  };
}

// Theme object for registry
export const themeName: Theme<typeof schema> = {
  name: 'Display Name',
  schema,
  generate,
  randomize,
};
```

### Full Theme Example

Here's a minimal theme implementation:

```typescript
// packages/avatarka/src/themes/example.ts
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

export function randomize(rng: () => number): ExampleParams {
  const shapes = ['circle', 'square', 'triangle'] as const;

  return {
    backgroundColor: randomColor(rng),
    shape: randomPick(shapes, rng),
    size: Math.floor(rng() * 26) + 20, // 20-45
  };
}

export const example: Theme<typeof schema> = {
  name: 'Example',
  schema,
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
- `randomize(rng)` function returning params object
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
pnpm build
```

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Development mode (watch)
pnpm dev

# Clean build artifacts
pnpm clean

# Run demo app
cd apps/demo && pnpm dev
```

### Turborepo Pipeline

The `turbo.json` configures:

- `build`: Runs tsup for each package, respects dependency order
- `dev`: Parallel watch mode
- `clean`: Removes dist directories

### Package Build (tsup)

Both packages use tsup with:
- ESM and CJS outputs
- TypeScript declarations
- Source maps
- External React (for avatarka-react)

## Testing Strategy

Currently no tests are implemented. Recommended approach:

### Unit Tests

```typescript
// packages/avatarka/src/__tests__/prng.test.ts
import { createRng, stringToSeed } from '../prng';

test('same seed produces same sequence', () => {
  const rng1 = createRng('test');
  const rng2 = createRng('test');
  expect(rng1()).toBe(rng2());
  expect(rng1()).toBe(rng2());
});

test('different seeds produce different sequences', () => {
  const rng1 = createRng('test1');
  const rng2 = createRng('test2');
  expect(rng1()).not.toBe(rng2());
});
```

### Visual Regression Tests

For themes, snapshot testing with image comparison:

```typescript
// packages/avatarka/src/__tests__/themes.test.ts
import { generateAvatar, getDefaultParams } from '../index';

test('geometric theme renders consistently', () => {
  const svg = generateAvatar('geometric', getDefaultParams('geometric'));
  expect(svg).toMatchSnapshot();
});
```

## Package Publishing

### Prerequisites

1. Ensure logged into npm: `npm login`
2. Update version in package.json files
3. Build all packages: `pnpm build`

### Publishing Steps

```bash
# From package directory
cd packages/avatarka
npm publish

cd ../avatarka-react
npm publish
```

### Version Management

Consider using changesets for coordinated versioning:

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
pnpm changeset
pnpm changeset version
pnpm changeset publish
```

## Known Limitations

1. **No SSR optimization**: SVG generated at runtime, not at build time
2. **Fixed viewBox**: All themes use 100x100, cannot be customized
3. **No animation support**: Static SVG only
4. **Limited accessibility**: Alt text on React component, but SVG lacks ARIA attributes
5. **No caching**: Same params regenerate SVG each render (consider memoization in consuming code)

## Design Decisions

### Why Mulberry32?

- Simple to implement (no external dependency)
- Good statistical properties for visual randomization
- Fast enough for real-time generation
- 32-bit state is sufficient for avatar variety

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

| Function                     | Description                     |
|------------------------------|---------------------------------|
| `hslToHex(h, s, l)`          | Convert HSL to hex color        |
| `randomColor(rng)`           | Generate random saturated color |
| `randomPastelColor(rng)`     | Generate random pastel color    |
| `darkenColor(hex, amount)`   | Darken hex color                |
| `lightenColor(hex, amount)`  | Lighten hex color               |

### Random Utilities

| Function                     | Description                 |
|------------------------------|-----------------------------|
| `randomPick(array, rng)`     | Pick random item from array |
| `randomInt(min, max, rng)`   | Random integer in range     |
| `randomFloat(min, max, rng)` | Random float in range       |

### SVG Utilities

| Function                 | Description                 |
|--------------------------|-----------------------------|
| `wrapSvg(content, size)` | Wrap content in SVG element |
