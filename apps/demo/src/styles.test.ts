import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Rgb = readonly [number, number, number];

const packageCss = readFileSync(
  resolve(process.cwd(), 'packages/avatarka-react/src/styles.css'),
  'utf8',
);
const demoCss = readFileSync(resolve(process.cwd(), 'apps/demo/src/styles.css'), 'utf8');

function hex(value: string): Rgb {
  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

function token(css: string, name: string): Rgb {
  const match = css.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})`, 'i'));
  if (!match?.[1]) throw new Error(`Missing CSS token ${name}`);
  return hex(match[1]);
}

function fallbackToken(css: string, name: string): Rgb {
  const match = css.match(new RegExp(`${name}:\\s*var\\([^,]+,\\s*(#[0-9a-f]{6})\\)`, 'i'));
  if (!match?.[1]) throw new Error(`Missing CSS fallback token ${name}`);
  return hex(match[1]);
}

function mix(foreground: Rgb, background: Rgb, weight: number): Rgb {
  return [
    foreground[0] * weight + background[0] * (1 - weight),
    foreground[1] * weight + background[1] * (1 - weight),
    foreground[2] * weight + background[2] * (1 - weight),
  ];
}

function luminance(color: Rgb): number {
  const [red, green, blue] = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red! + 0.7152 * green! + 0.0722 * blue!;
}

function contrast(first: Rgb, second: Rgb): number {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

describe('light interface color tokens', () => {
  it('keeps the package defaults above WCAG AA for small text', () => {
    const background = fallbackToken(packageCss, '--_avatarka-picker-bg');
    const surface = fallbackToken(packageCss, '--_avatarka-picker-surface');
    const muted = fallbackToken(packageCss, '--_avatarka-picker-muted');
    const accent = fallbackToken(packageCss, '--_avatarka-picker-accent');

    expect(contrast(accent, mix(accent, background, 0.08))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('keeps the demo overrides above WCAG AA for small text', () => {
    const background = token(demoCss, '--card');
    const surface = token(demoCss, '--surface');
    const muted = token(demoCss, '--muted');
    const accent = token(demoCss, '--accent');

    expect(contrast(accent, mix(accent, background, 0.08))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(muted, surface)).toBeGreaterThanOrEqual(4.5);
  });
});
