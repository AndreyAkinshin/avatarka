# Avatarka

[![npm avatarka](https://img.shields.io/npm/v/avatarka?label=npm%20avatarka)](https://www.npmjs.com/package/avatarka)
[![npm avatarka-react](https://img.shields.io/npm/v/avatarka-react?label=npm%20avatarka-react)](https://www.npmjs.com/package/avatarka-react)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://andreyakinshin.github.io/avatarka/)

Generate unique, customizable SVG and PNG avatars with multiple themes. Zero dependencies in the core library.

## Features

- **6 Built-in Themes**: Geometric patterns, monsters, animals, people, robots, and aliens
- **Seed-based Generation**: Generate deterministic avatars from any string (email, user ID, etc.)
- **Fully Customizable**: Every parameter can be tweaked via a typed API
- **Zero Dependencies**: Core library has no runtime dependencies
- **React Components**: Ready-to-use Avatar and AvatarEditor components
- **PNG Export**: Browser-based PNG generation via Canvas API
- **TypeScript First**: Full type safety with exported types

## Installation

```bash
# Core library only
npm install avatarka

# With React components
npm install avatarka avatarka-react
```

## Quick Start

### Basic Usage

```typescript
import { generateAvatar, generateParams } from 'avatarka';

// Generate random parameters and create an avatar
const params = generateParams('monsters');
const svg = generateAvatar('monsters', params);

// Insert into DOM
document.getElementById('avatar').innerHTML = svg;
```

### Seed-based Generation

Generate consistent avatars from any string (great for user avatars):

```typescript
import { randomAvatar, generateParams } from 'avatarka';

// One-liner: generate avatar from seed
const svg = randomAvatar('animals', 'user@email.com');

// Same seed always produces the same avatar
const params1 = generateParams('geometric', 'user-123');
const params2 = generateParams('geometric', 'user-123');
// params1 and params2 are identical
```

### React Components

```tsx
import { Avatar, AvatarEditor, generateParams } from 'avatarka-react';
import { useState } from 'react';

// Simple avatar display
function UserAvatar({ email }: { email: string }) {
  return <Avatar theme="animals" seed={email} size={64} />;
}

// Interactive editor
function AvatarCustomizer() {
  const [params, setParams] = useState(() => generateParams('monsters'));

  return (
    <AvatarEditor
      theme="monsters"
      params={params}
      onChange={setParams}
      previewSize={200}
    />
  );
}
```

### PNG Generation (Browser)

```typescript
import { generateAvatar, generateParams, svgToPng, svgToPngDataUrl } from 'avatarka';

// Generate SVG first
const params = generateParams('monsters', 'user@email.com');
const svg = generateAvatar('monsters', params);

// Convert to PNG Blob and download
const blob = await svgToPng(svg, { size: 512 });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'avatar.png';
a.click();
URL.revokeObjectURL(url);

// Or get as data URL for embedding
const dataUrl = await svgToPngDataUrl(svg, { size: 128 });
// Returns: "data:image/png;base64,..."
```

> **Note**: PNG generation uses the Canvas API and is only available in browser environments.

## API Reference

### Core Functions

#### `generateAvatar(theme, params)`

Generate an SVG string from theme and parameters.

```typescript
const svg = generateAvatar('robots', {
  backgroundShape: 'circle',
  bodyColor: '#95a5a6',
  accentColor: '#3498db',
  eyeColor: '#e74c3c',
  backgroundColor: '#2c3e50',
  headShape: 'square',
  antennaStyle: 'single',
  eyeStyle: 'round',
  mouthStyle: 'grille',
  hasPanel: 'no',
  panelLights: 3,
});
```

#### `generateParams(theme, seed?)`

Generate random parameters for a theme. Optionally pass a seed for deterministic output.

```typescript
// Random
const params = generateParams('geometric');

// Deterministic
const params = generateParams('geometric', 'my-seed');
```

#### `randomAvatar(theme, seed?)`

Convenience function combining `generateParams` and `generateAvatar`.

```typescript
const svg = randomAvatar('people', 'user@email.com');
```

#### `getDefaultParams(theme)`

Get default parameters from the theme schema.

```typescript
const defaults = getDefaultParams('monsters');
```

#### `getThemeNames()`

Get array of available theme names.

```typescript
const themes = getThemeNames(); // ['people', 'animals', 'monsters', 'robots', 'aliens', 'geometric']
```

#### `getTheme(theme)`

Get theme metadata including name and parameter schema.

```typescript
const { name, schema } = getTheme('animals');
```

### React Components

#### `<Avatar />`

Simple avatar renderer.

| Prop        | Type               | Default    | Description                        |
|-------------|--------------------|------------|------------------------------------|
| `theme`     | `ThemeName`        | required   | Theme to use                       |
| `params`    | `AvatarParams`     | -          | Avatar parameters                  |
| `seed`      | `string \| number` | -          | Seed for generation (if no params) |
| `size`      | `number`           | `100`      | Size in pixels                     |
| `className` | `string`           | -          | CSS class                          |
| `style`     | `CSSProperties`    | -          | Inline styles                      |
| `alt`       | `string`           | `'Avatar'` | Alt text                           |

#### `<AvatarEditor />`

Interactive editor with auto-generated controls.

| Prop          | Type               | Default  | Description            |
|---------------|--------------------|----------|------------------------|
| `theme`       | `ThemeName`        | required | Theme to use           |
| `params`      | `AvatarParams`     | required | Current parameters     |
| `onChange`    | `(params) => void` | required | Change handler         |
| `previewSize` | `number`           | `100`    | Preview size in pixels |
| `showPreview` | `boolean`          | `true`   | Show avatar preview    |
| `className`   | `string`           | -        | CSS class              |
| `style`       | `CSSProperties`    | -        | Inline styles          |

### PNG Functions (Browser-only)

#### `svgToPng(svg, options?)`

Convert an SVG string to a PNG Blob using the Canvas API.

```typescript
const svg = generateAvatar('monsters', params);
const blob = await svgToPng(svg, { size: 512 });
```

#### `svgToPngDataUrl(svg, options?)`

Convert an SVG string to a PNG data URL.

```typescript
const svg = generateAvatar('animals', params);
const dataUrl = await svgToPngDataUrl(svg, { size: 128 });
// Returns: "data:image/png;base64,..."
```

#### PNG Options

| Option | Type     | Default | Description           |
|--------|----------|---------|----------------------|
| `size` | `number` | `256`   | Output size in pixels |

> **Note**: These functions require a browser environment with Canvas support. They will throw an error if called in Node.js.

## Themes

### Geometric

Abstract patterns with shapes like triangles, circles, squares, and hexagons.

**Parameters**: `backgroundShape`, `backgroundColor`, `primaryColor`, `secondaryColor`, `pattern`, `complexity`, `rotation`

### Monsters

Cute monster characters with customizable features.

**Parameters**: `backgroundShape`, `backgroundColor`, `bodyColor`, `eyeColor`, `mouthColor`, `bodyShape`, `eyeCount`, `hasHorns`, `hasTeeth`, `expression`

### Animals

Animal faces including cats, dogs, bears, bunnies, foxes, pandas, owls, koalas, penguins, and lions.

**Parameters**: `backgroundShape`, `animalType`, `primaryColor`, `secondaryColor`, `eyeColor`, `backgroundColor`, `expression`

### People

Human avatars with various hairstyles and accessories.

**Parameters**: `backgroundShape`, `skinColor`, `hairColor`, `eyeColor`, `backgroundColor`, `hairStyle`, `accessory`, `expression`

### Robots

Retro-futuristic robot heads with various head shapes and features.

**Parameters**: `backgroundShape`, `bodyColor`, `accentColor`, `eyeColor`, `backgroundColor`, `headShape`, `antennaStyle`, `eyeStyle`, `mouthStyle`, `hasPanel`, `panelLights`

### Aliens

Extraterrestrial beings with various head shapes and features.

**Parameters**: `backgroundShape`, `skinColor`, `eyeColor`, `backgroundColor`, `headShape`, `eyeStyle`, `antennae`, `mouthStyle`, `markings`

## License

MIT
