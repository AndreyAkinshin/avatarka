# avatarka-react

React components for the [avatarka](https://www.npmjs.com/package/avatarka) SVG avatar generator.

## Installation

```bash
npm install avatarka avatarka-react
```

## Styles

The `AvatarPicker` component requires CSS styles. Import them in your app:

```tsx
import 'avatarka-react/styles.css';
```

The stylesheet uses CSS custom properties for easy theming:

```css
/* Example: customize AvatarPicker colors */
.avatarka-picker {
  --avatarka-bg: #1f2937;
  --avatarka-accent: #818cf8;
  --avatarka-text: #f3f4f6;
  --avatarka-text-secondary: #9ca3af;
  --avatarka-border: #374151;
  --avatarka-input-bg: #374151;
  --avatarka-btn-bg: #374151;
  --avatarka-shadow: rgba(0, 0, 0, 0.3);
}
```

Note: The `Avatar` and `AvatarEditor` components do not require any CSS.

## Components

### `<Avatar />`

Simple avatar renderer.

```tsx
import { Avatar } from 'avatarka-react';

// From seed (deterministic)
<Avatar theme="animals" seed="user@email.com" size={64} />

// From parameters
import { generateParams } from 'avatarka-react';

const params = generateParams('monsters');
<Avatar theme="monsters" params={params} size={100} />
```

#### Props

| Prop        | Type               | Default    | Description                        |
|-------------|--------------------|------------|------------------------------------|
| `theme`     | `ThemeName`        | required   | Theme to use                       |
| `params`    | `AvatarParams`     | -          | Avatar parameters                  |
| `seed`      | `string \| number` | -          | Seed for generation (if no params) |
| `size`      | `number`           | `100`      | Size in pixels                     |
| `className` | `string`           | -          | CSS class                          |
| `style`     | `CSSProperties`    | -          | Inline styles                      |
| `alt`       | `string`           | `'Avatar'` | Alt text                           |

### `<AvatarEditor />`

Interactive editor with auto-generated controls for all theme parameters.

```tsx
import { AvatarEditor, generateParams } from 'avatarka-react';
import { useState } from 'react';

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

#### Props

| Prop          | Type               | Default  | Description            |
|---------------|--------------------|----------|------------------------|
| `theme`       | `ThemeName`        | required | Theme to use           |
| `params`      | `AvatarParams`     | required | Current parameters     |
| `onChange`    | `(params) => void` | required | Change handler         |
| `previewSize` | `number`           | `100`    | Preview size in pixels |
| `showPreview` | `boolean`          | `true`   | Show avatar preview    |
| `className`   | `string`           | -        | CSS class              |
| `style`       | `CSSProperties`    | -        | Inline styles          |

### `<AvatarPicker />`

Self-contained avatar picker component with theme selector, editor controls, and gallery mode. Manages its own internal state - perfect for "choose your avatar" flows.

**Important:** This component requires CSS styles. Make sure to import them:

```tsx
import { AvatarPicker } from 'avatarka-react';
import 'avatarka-react/styles.css';

// Basic usage
<AvatarPicker />

// With initial theme and change callback
<AvatarPicker
  defaultTheme="monsters"
  onParamsChange={(theme, params) => {
    console.log('Selected:', theme, params);
  }}
/>
```

#### Props

| Prop              | Type                                | Default     | Description                              |
|-------------------|-------------------------------------|-------------|------------------------------------------|
| `defaultTheme`    | `ThemeName`                         | `'people'`  | Initial theme to use                     |
| `onParamsChange`  | `(theme, params) => void`           | -           | Callback when avatar changes             |
| `gridSize`        | `number`                            | `5`         | Gallery grid size (creates n×n grid)     |
| `backgroundColor` | `string`                            | -           | Background color (CSS value)             |
| `accentColor`     | `string`                            | -           | Accent color for buttons (CSS value)     |
| `className`       | `string`                            | -           | CSS class                                |
| `style`           | `CSSProperties`                     | -           | Inline styles                            |

See the [Styles](#styles) section above for theming options via CSS custom properties.

## Re-exported Functions

For convenience, `avatarka-react` re-exports all functions from the core `avatarka` package:

```tsx
import {
  generateAvatar,
  generateParams,
  randomAvatar,
  getDefaultParams,
  getThemeNames,
  getTheme,
  svgToPng,
  svgToPngDataUrl,
} from 'avatarka-react';
```

## Related Packages

- [avatarka](https://www.npmjs.com/package/avatarka) - Core library (zero dependencies)

## License

MIT
