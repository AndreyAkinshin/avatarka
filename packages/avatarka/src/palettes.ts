export interface PaletteColors {
  readonly canvas: string;
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly ink: string;
}

export interface Palette extends PaletteColors {
  readonly name: string;
}

const paletteDefinitions = {
  coast: {
    name: 'Coast',
    canvas: '#678f8a',
    primary: '#56bfb1',
    secondary: '#b3dbcf',
    accent: '#e37f65',
    ink: '#0c1e1c',
  },
  orchid: {
    name: 'Orchid',
    canvas: '#8c809c',
    primary: '#b199de',
    secondary: '#d8cae9',
    accent: '#da7baa',
    ink: '#1c1825',
  },
  clay: {
    name: 'Clay',
    canvas: '#9b806b',
    primary: '#dd8d74',
    secondary: '#e8cbb4',
    accent: '#d09945',
    ink: '#241711',
  },
  grove: {
    name: 'Grove',
    canvas: '#808b6e',
    primary: '#86b37d',
    secondary: '#cfd5b0',
    accent: '#db8c54',
    ink: '#181d10',
  },
  sky: {
    name: 'Sky',
    canvas: '#7289a1',
    primary: '#76ace4',
    secondary: '#bbd4ee',
    accent: '#e47d70',
    ink: '#121c26',
  },
  mono: {
    name: 'Mono',
    canvas: '#80878d',
    primary: '#98a7b4',
    secondary: '#cbd2d8',
    // Warm graphite keeps Mono neutral without collapsing into primary.
    accent: '#b0948d',
    ink: '#161b20',
  },
} as const satisfies Record<string, Palette>;

export type PaletteName = keyof typeof paletteDefinitions;

/** Canonical palette order for APIs and controls. */
export const paletteNames = Object.freeze([
  'coast',
  'orchid',
  'clay',
  'grove',
  'sky',
  'mono',
] as const satisfies readonly PaletteName[]);

for (const palette of Object.values(paletteDefinitions)) Object.freeze(palette);

/** Curated, surface-neutral palettes. Runtime-frozen to protect determinism. */
export const palettes = Object.freeze(paletteDefinitions);

export function getPalette<Name extends PaletteName>(
  name: Name,
): (typeof palettes)[Name] {
  if (!Object.prototype.hasOwnProperty.call(palettes, name)) {
    throw new Error(`Unknown palette: ${String(name)}`);
  }
  return palettes[name];
}
