# avatarka

Generate unique, customizable SVG avatars with multiple themes. Zero runtime dependencies.

## Features

- **6 Built-in Themes**: Geometric patterns, monsters, animals, people, robots, and aliens
- **Seed-based Generation**: Generate deterministic avatars from any string (email, user ID, etc.)
- **Fully Customizable**: Every parameter can be tweaked via a typed API
- **Zero Dependencies**: No runtime dependencies
- **TypeScript First**: Full type safety with exported types

## Installation

```bash
npm install avatarka
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

## API Reference

### `generateAvatar(theme, params)`

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

### `generateParams(theme, seed?)`

Generate random parameters for a theme. Optionally pass a seed for deterministic output.

```typescript
// Random
const params = generateParams('geometric');

// Deterministic
const params = generateParams('geometric', 'my-seed');
```

### `randomAvatar(theme, seed?)`

Convenience function combining `generateParams` and `generateAvatar`.

```typescript
const svg = randomAvatar('people', 'user@email.com');
```

### `getDefaultParams(theme)`

Get default parameters from the theme schema.

```typescript
const defaults = getDefaultParams('monsters');
```

### `getThemeNames()`

Get array of available theme names.

```typescript
const themes = getThemeNames(); // ['people', 'animals', 'monsters', 'robots', 'aliens', 'geometric']
```

### `getTheme(theme)`

Get theme metadata including name and parameter schema.

```typescript
const { name, schema } = getTheme('animals');
```

## Themes

| Theme       | Description                                                                             |
|-------------|-----------------------------------------------------------------------------------------|
| `geometric` | Abstract patterns with shapes like triangles, circles, squares, and hexagons            |
| `monsters`  | Cute monster characters with customizable features                                      |
| `animals`   | Animal faces (cats, dogs, bears, bunnies, foxes, pandas, owls, koalas, penguins, lions) |
| `people`    | Human avatars with various hairstyles and accessories                                   |
| `robots`    | Retro-futuristic robot heads with various features                                      |
| `aliens`    | Extraterrestrial beings with various head shapes                                        |

## PNG Generation (Browser-only)

Convert SVG avatars to PNG using the Canvas API:

```typescript
import { generateAvatar, generateParams, svgToPng, svgToPngDataUrl } from 'avatarka';

const params = generateParams('monsters', 'user@email.com');
const svg = generateAvatar('monsters', params);

// Get as PNG Blob
const blob = await svgToPng(svg, { size: 512 });

// Or as data URL
const dataUrl = await svgToPngDataUrl(svg, { size: 128 });
```

> **Note**: These functions require a browser environment with Canvas support.

## Related Packages

- [avatarka-react](https://www.npmjs.com/package/avatarka-react) - React components for avatarka

## License

MIT
