# Avatarka

[![npm avatarka](https://img.shields.io/npm/v/avatarka?label=npm%20avatarka)](https://www.npmjs.com/package/avatarka)
[![npm avatarka-react](https://img.shields.io/npm/v/avatarka-react?label=npm%20avatarka-react)](https://www.npmjs.com/package/avatarka-react)
[![Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://avatarka.akinshin.dev/)

Generate unique, customizable SVG and PNG avatars with multiple themes.

## Features

- **14 Built-in Themes**: People, animals, monsters, robots, aliens, ocean, dinosaurs, mythical, insects, birds, plants, food, weather, and gems
- **Seed-based Generation**: Generate deterministic avatars from any string (email, user ID, etc.)
- **Fully Customizable**: Every parameter can be tweaked via a typed API
- **Minimal Dependencies**: Core library depends only on [pragmastat](https://www.npmjs.com/package/pragmastat) for PRNG
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
const params1 = generateParams('monsters', 'user-123');
const params2 = generateParams('monsters', 'user-123');
// params1 and params2 are identical
```

#### `generateGallery(count, seed?, options?)`

Generate a diverse gallery of avatars with guaranteed visual variety across all themes.

```typescript
import { generateGallery } from 'avatarka';

const items = generateGallery(25, 'my-seed', {
  backgroundShape: 'circle',
  transparentBackground: false,
});
// Returns: Array of { theme, params, svg }
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backgroundShape` | `string` | - | Force background shape for all items |
| `transparentBackground` | `boolean` | - | Force transparent background for all items |

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
const params = generateParams('monsters');

// Deterministic
const params = generateParams('monsters', 'my-seed');
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
const themes = getThemeNames();
// ['people', 'animals', 'monsters', 'robots', 'aliens', 'ocean',
//  'dinosaurs', 'mythical', 'insects', 'birds', 'plants', 'food',
//  'weather', 'gems']
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

| Prop               | Type                                          | Default  | Description                                      |
|--------------------|-----------------------------------------------|----------|--------------------------------------------------|
| `theme`            | `ThemeName`                                   | required | Theme to use                                     |
| `params`           | `AvatarParams`                                | required | Current parameters                               |
| `onChange`         | `(params) => void`                            | required | Change handler                                   |
| `onThemeChange`    | `(theme: ThemeName) => void`                  | -        | Callback when theme changes                      |
| `previewSize`      | `number`                                      | `100`    | Preview size in pixels                           |
| `showPreview`      | `boolean`                                     | `true`   | Show avatar preview                              |
| `showGalleryButton`| `boolean`                                     | -        | Show gallery toggle button                       |
| `onGallerySelect`  | `(theme: ThemeName, params: AvatarParams) => void` | -   | Callback when avatar selected from gallery       |
| `galleryCount`     | `number`                                      | -        | Number of avatars in gallery mode                |
| `galleryAvatarSize`| `number`                                      | -        | Size of each avatar in the gallery grid          |
| `className`        | `string`                                      | -        | CSS class                                        |
| `style`            | `CSSProperties`                               | -        | Inline styles                                    |

#### `<AvatarPicker />`

Self-contained avatar picker with editor and gallery modes. Requires importing the stylesheet:

```tsx
import { AvatarPicker } from 'avatarka-react';
import 'avatarka-react/styles.css';

function MyApp() {
  return (
    <AvatarPicker
      defaultTheme="monsters"
      onParamsChange={(theme, params) => console.log(theme, params)}
    />
  );
}
```

| Prop                         | Type                                          | Default     | Description                                         |
|------------------------------|-----------------------------------------------|-------------|-----------------------------------------------------|
| `defaultTheme`               | `ThemeName`                                   | `'people'`  | Initial theme                                       |
| `onParamsChange`             | `(theme: ThemeName, params: AvatarParams) => void` | -      | Callback when avatar parameters change              |
| `gridSize`                   | `number`                                      | `5`         | Gallery grid size (n x n), fallback for width/height|
| `gridWidth`                  | `number`                                      | `gridSize`  | Number of gallery grid columns                      |
| `gridHeight`                 | `number`                                      | `gridSize`  | Number of gallery grid rows                         |
| `backgroundColor`            | `string`                                      | -           | Background color (CSS value)                        |
| `accentColor`                | `string`                                      | -           | Accent color for buttons and active elements        |
| `layout`                     | `'default' \| 'compact'`                      | `'default'` | Layout mode (stacked or side-by-side)               |
| `alwaysTransparentBackground`| `boolean`                                     | -           | Force transparent avatar background                 |
| `onSaveSvg`                  | `() => void`                                  | -           | Callback for SVG save (shows SVG button when set)   |
| `onSavePng`                  | `() => void`                                  | -           | Callback for PNG save (shows PNG button when set)   |
| `className`                  | `string`                                      | -           | CSS class                                           |
| `style`                      | `CSSProperties`                               | -           | Inline styles                                       |

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

### People

Human avatars with various hairstyles and accessories.

**Parameters**: `backgroundShape`, `skinColor`, `hairColor`, `eyeColor`, `backgroundColor`, `hairStyle`, `accessory`, `expression`

### Animals

Animal faces including cats, dogs, bears, bunnies, foxes, pandas, owls, koalas, penguins, and lions.

**Parameters**: `backgroundShape`, `animalType`, `primaryColor`, `secondaryColor`, `eyeColor`, `backgroundColor`, `expression`

### Monsters

Cute monster characters with customizable features.

**Parameters**: `backgroundShape`, `backgroundColor`, `bodyColor`, `eyeColor`, `mouthColor`, `bodyShape`, `eyeCount`, `hasHorns`, `hasTeeth`, `expression`

### Robots

Retro-futuristic robot heads with various head shapes and features.

**Parameters**: `backgroundShape`, `bodyColor`, `accentColor`, `eyeColor`, `backgroundColor`, `headShape`, `antennaStyle`, `eyeStyle`, `mouthStyle`, `hasPanel`, `panelLights`

### Aliens

Extraterrestrial beings with various head shapes and features.

**Parameters**: `backgroundShape`, `skinColor`, `eyeColor`, `backgroundColor`, `headShape`, `eyeStyle`, `antennae`, `mouthStyle`, `markings`

### Ocean

Ocean creatures including octopus, fish, jellyfish, crab, whale, seahorse, pufferfish, turtle, shark, and starfish.

**Parameters**: `backgroundShape`, `creatureType`, `primaryColor`, `secondaryColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `hasBubbles`

### Dinosaurs

Prehistoric dinosaurs including trex, triceratops, stegosaurus, brachiosaurus, pterodactyl, and more.

**Parameters**: `backgroundShape`, `dinosaurType`, `primaryColor`, `secondaryColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `hasPlants`

### Mythical

Mythical creatures including dragon, unicorn, phoenix, griffin, yeti, cerberus, kitsune, minotaur, fairy, and hydra.

**Parameters**: `backgroundShape`, `creatureType`, `primaryColor`, `secondaryColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `magic`

### Insects

Insects including butterfly, bee, ladybug, ant, beetle, dragonfly, caterpillar, firefly, mantis, and spider.

**Parameters**: `backgroundShape`, `insectType`, `primaryColor`, `secondaryColor`, `wingColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

### Birds

Bird species including parrot, owl, penguin, flamingo, eagle, toucan, peacock, hummingbird, robin, and crow.

**Parameters**: `backgroundShape`, `birdType`, `primaryColor`, `secondaryColor`, `crestColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

### Plants

Plants including cactus, sunflower, rose, tulip, venus-flytrap, bonsai, mushroom, fern, bamboo, and succulent.

**Parameters**: `backgroundShape`, `plantType`, `primaryColor`, `secondaryColor`, `potColor`, `bloomColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

### Food

Food items including sushi, pizza, cupcake, ice-cream, donut, burger, taco, ramen, cookie, and watermelon.

**Parameters**: `backgroundShape`, `foodType`, `primaryColor`, `secondaryColor`, `toppingColor`, `plateColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

### Weather

Weather phenomena including sun, cloud, raindrop, snowflake, lightning, tornado, rainbow, moon, star, and comet.

**Parameters**: `backgroundShape`, `weatherType`, `primaryColor`, `secondaryColor`, `glowColor`, `precipitationColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

### Gems

Gemstones including diamond, ruby, emerald, sapphire, amethyst, opal, topaz, pearl, crystal, and geode.

**Parameters**: `backgroundShape`, `gemType`, `primaryColor`, `secondaryColor`, `facetColor`, `sparkleColor`, `eyeColor`, `backgroundColor`, `expression`, `pattern`, `decoration`

## License

MIT
