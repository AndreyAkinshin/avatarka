import { describe, expect, it } from 'vitest';
import {
  generateAvatar,
  getDefaultParams,
  getTheme,
  type ThemeName,
} from '../core';
import { tonalEdge } from '../internal/art';
import { paletteNames, palettes } from '../palettes';

const structuralThemes = ['bots', 'snacks', 'nooks'] as const;

function selectOptions(theme: ThemeName): readonly [string, readonly string[]][] {
  return Object.entries(getTheme(theme).schema).flatMap(([name, definition]) => (
    definition.type === 'select' && name !== 'palette'
      ? [[name, definition.options] as const]
      : []
  ));
}

function inkStrokeTags(svg: string, ink: string): readonly string[] {
  return (svg.match(/<[^>]+>/g) ?? [])
    .filter((tag) => tag.includes(`stroke="${ink}"`));
}

function withoutHexColors(svg: string): string {
  return svg.replace(/#[\da-f]{6}/gi, '#color');
}

describe('structural theme contours', () => {
  it.each(structuralThemes)(
    '%s covers every select option with solid tonal structure',
    (theme) => {
      const defaults = getDefaultParams(theme);

      for (const paletteName of paletteNames) {
        const ink = palettes[paletteName].ink;

        for (const [name, options] of selectOptions(theme)) {
          for (const option of options) {
            const svg = generateAvatar(theme, {
              ...defaults,
              palette: paletteName,
              [name]: option,
            } as never);

            expect(svg, `${theme}/${paletteName}/${name}/${option}`)
              .not.toContain('stroke-opacity');
            for (const tag of inkStrokeTags(svg, ink)) {
              expect(tag, `${theme}/${paletteName}/${name}/${option}`)
                .toMatch(/fill="(?:none|#[\da-f]{6})"/i);

              // Near-black strokes are reserved for face semantics. Structural
              // shapes use fill-derived edges and therefore never combine an
              // ink stroke with a non-canvas color fill.
              const fill = tag.match(/fill="(#[\da-f]{6})"/i)?.[1];
              if (fill) expect(fill.toLowerCase()).toBe(palettes[paletteName].canvas);
            }
          }
        }
      }
    },
  );

  it.each(structuralThemes)(
    '%s keeps every select option geometrically stable across palettes',
    (theme) => {
      const defaults = getDefaultParams(theme);

      for (const [name, options] of selectOptions(theme)) {
        for (const option of options) {
          const coast = withoutHexColors(generateAvatar(theme, {
            ...defaults,
            palette: 'coast',
            [name]: option,
          } as never));

          for (const palette of paletteNames.slice(1)) {
            expect(
              withoutHexColors(generateAvatar(theme, {
                ...defaults,
                palette,
                [name]: option,
              } as never)),
              `${theme}/${name}/${option}/${palette}`,
            ).toBe(coast);
          }
        }
      }
    },
  );

  it('uses fill-derived contours for robot and architectural structure', () => {
    const coast = palettes.coast;
    const robot = generateAvatar('bots', {
      ...getDefaultParams('bots'),
      sideSensors: 'rails',
    });
    const nook = generateAvatar('nooks', {
      ...getDefaultParams('nooks'),
      palette: 'coast',
    });

    expect(robot).toContain(
      `stroke="${tonalEdge(coast.primary, coast.ink, 0.32)}" stroke-width="1.6"`,
    );
    expect(robot).toContain(
      `stroke="${tonalEdge(coast.secondary, coast.ink, 0.32)}" stroke-width="1.5"`,
    );
    expect(nook).toContain(
      `stroke="${tonalEdge(coast.primary, coast.ink, 0.32)}" stroke-width="1.7"`,
    );
    expect(nook).toContain(
      `stroke="${tonalEdge(coast.secondary, coast.ink, 0.34)}" stroke-width="1.55"`,
    );
    expect(nook).toContain(
      `stroke="${tonalEdge(coast.accent, coast.ink, 0.34)}" stroke-width="1.7"`,
    );
  });

  it('leaves simple food silhouettes open and tones overlap-critical edges', () => {
    const clay = palettes.clay;
    const toast = generateAvatar('snacks', getDefaultParams('snacks'));
    const mushroom = generateAvatar('snacks', {
      ...getDefaultParams('snacks'),
      snack: 'mushroom',
    });
    const coffee = generateAvatar('snacks', {
      ...getDefaultParams('snacks'),
      snack: 'coffee',
    });

    expect(toast.match(/<path d="M22 80L[^>]+>/)?.[0]).not.toContain('stroke=');
    expect(mushroom).toContain(
      `stroke="${tonalEdge(clay.secondary, clay.ink, 0.3)}" stroke-width="1.45"`,
    );
    expect(coffee).toContain(
      `stroke="${tonalEdge(clay.primary, clay.ink, 0.3)}" stroke-width="1.65"`,
    );
    expect(coffee).not.toContain(`stroke="${clay.ink}" stroke-width="5"`);
  });
});
