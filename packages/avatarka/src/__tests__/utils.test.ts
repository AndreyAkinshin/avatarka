import { describe, it, expect } from 'vitest';
import {
  hslToHex,
  randomColor,
  randomPastelColor,
  darkenColor,
  lightenColor,
  randomPick,
  randomInt,
  randomFloat,
  wrapSvg,
  generateBackgroundShape,
  wrapSvgWithShape,
} from '../utils';
import { createRng } from '../prng';

describe('hslToHex', () => {
  it('converts red correctly', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
  });

  it('converts green correctly', () => {
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
  });

  it('converts blue correctly', () => {
    expect(hslToHex(240, 100, 50)).toBe('#0000ff');
  });

  it('converts white correctly', () => {
    expect(hslToHex(0, 0, 100)).toBe('#ffffff');
  });

  it('converts black correctly', () => {
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });

  it('converts various hues', () => {
    // Yellow (60°)
    expect(hslToHex(60, 100, 50)).toBe('#ffff00');
    // Cyan (180°)
    expect(hslToHex(180, 100, 50)).toBe('#00ffff');
    // Magenta (300°)
    expect(hslToHex(300, 100, 50)).toBe('#ff00ff');
  });
});

describe('randomColor', () => {
  it('returns valid hex color', () => {
    const rng = createRng('test');
    const color = randomColor(rng);

    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('produces deterministic results with same seed', () => {
    const rng1 = createRng('color-seed');
    const rng2 = createRng('color-seed');

    expect(randomColor(rng1)).toBe(randomColor(rng2));
  });

  it('produces different colors with different seeds', () => {
    const rng1 = createRng('seed1');
    const rng2 = createRng('seed2');

    expect(randomColor(rng1)).not.toBe(randomColor(rng2));
  });
});

describe('randomPastelColor', () => {
  it('returns valid hex color', () => {
    const rng = createRng('test');
    const color = randomPastelColor(rng);

    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('produces deterministic results', () => {
    const rng1 = createRng('pastel-seed');
    const rng2 = createRng('pastel-seed');

    expect(randomPastelColor(rng1)).toBe(randomPastelColor(rng2));
  });
});

describe('darkenColor', () => {
  it('darkens a color', () => {
    const original = '#ff8080';
    const darkened = darkenColor(original, 20);

    // Parse both colors
    const origNum = parseInt(original.slice(1), 16);
    const darkNum = parseInt(darkened.slice(1), 16);

    // Darkened color should have lower RGB values
    expect(darkNum).toBeLessThan(origNum);
  });

  it('uses default amount', () => {
    const color = '#808080';
    const darkened = darkenColor(color);

    expect(darkened).not.toBe(color);
  });

  it('does not go below 0', () => {
    const result = darkenColor('#101010', 100);

    expect(result).toBe('#000000');
  });

  it('returns valid hex color', () => {
    expect(darkenColor('#ffffff', 50)).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('lightenColor', () => {
  it('lightens a color', () => {
    const original = '#808080';
    const lightened = lightenColor(original, 20);

    const origNum = parseInt(original.slice(1), 16);
    const lightNum = parseInt(lightened.slice(1), 16);

    expect(lightNum).toBeGreaterThan(origNum);
  });

  it('uses default amount', () => {
    const color = '#808080';
    const lightened = lightenColor(color);

    expect(lightened).not.toBe(color);
  });

  it('does not go above 255', () => {
    const result = lightenColor('#f0f0f0', 100);

    expect(result).toBe('#ffffff');
  });

  it('returns valid hex color', () => {
    expect(lightenColor('#000000', 50)).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('randomPick', () => {
  it('picks an item from array', () => {
    const rng = createRng('pick');
    const arr = ['a', 'b', 'c', 'd'];

    const picked = randomPick(arr, rng);

    expect(arr).toContain(picked);
  });

  it('produces deterministic results', () => {
    const arr = ['x', 'y', 'z'];

    const rng1 = createRng('same');
    const rng2 = createRng('same');

    expect(randomPick(arr, rng1)).toBe(randomPick(arr, rng2));
  });

  it('can pick any item given enough iterations', () => {
    const arr = ['a', 'b', 'c'];
    const picked = new Set<string>();

    for (let i = 0; i < 100; i++) {
      const rng = createRng(`seed-${i}`);
      picked.add(randomPick(arr, rng));
    }

    expect(picked.size).toBe(3);
  });

  it('works with readonly arrays', () => {
    const arr = ['one', 'two', 'three'] as const;
    const rng = createRng('readonly');

    const result = randomPick(arr, rng);

    expect(['one', 'two', 'three']).toContain(result);
  });
});

describe('randomInt', () => {
  it('returns integers in range', () => {
    const rng = createRng('int');

    for (let i = 0; i < 100; i++) {
      const value = randomInt(5, 10, rng);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('produces deterministic results', () => {
    const rng1 = createRng('int-seed');
    const rng2 = createRng('int-seed');

    expect(randomInt(0, 100, rng1)).toBe(randomInt(0, 100, rng2));
  });

  it('can return boundary values', () => {
    const min = 1;
    const max = 3;
    const values = new Set<number>();

    for (let i = 0; i < 1000; i++) {
      const rng = createRng(`bound-${i}`);
      values.add(randomInt(min, max, rng));
    }

    expect(values.has(min)).toBe(true);
    expect(values.has(max)).toBe(true);
  });
});

describe('randomFloat', () => {
  it('returns floats in range', () => {
    const rng = createRng('float');

    for (let i = 0; i < 100; i++) {
      const value = randomFloat(5.0, 10.0, rng);
      expect(value).toBeGreaterThanOrEqual(5.0);
      expect(value).toBeLessThanOrEqual(10.0);
    }
  });

  it('produces deterministic results', () => {
    const rng1 = createRng('float-seed');
    const rng2 = createRng('float-seed');

    expect(randomFloat(0, 1, rng1)).toBe(randomFloat(0, 1, rng2));
  });
});

describe('wrapSvg', () => {
  it('wraps content in SVG element', () => {
    const content = '<circle cx="50" cy="50" r="40"/>';
    const svg = wrapSvg(content);

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 100 100"');
    expect(svg).toContain(content);
  });

  it('uses default size of 100', () => {
    const svg = wrapSvg('<rect/>');

    expect(svg).toContain('width="100"');
    expect(svg).toContain('height="100"');
    expect(svg).toContain('viewBox="0 0 100 100"');
  });

  it('uses custom size', () => {
    const svg = wrapSvg('<rect/>', 200);

    expect(svg).toContain('width="200"');
    expect(svg).toContain('height="200"');
    expect(svg).toContain('viewBox="0 0 200 200"');
  });
});

describe('generateBackgroundShape', () => {
  it('generates circle shape', () => {
    const { background, clipPath, clipId } = generateBackgroundShape('circle', '#ff0000');

    expect(background).toContain('<circle');
    expect(background).toContain('fill="#ff0000"');
    expect(clipPath).toContain('<clipPath');
    expect(clipPath).toContain(`id="${clipId}"`);
    expect(clipId).toMatch(/^clip-circle-[a-f0-9]+$/);
  });

  it('generates rounded shape', () => {
    const { background, clipPath, clipId } = generateBackgroundShape('rounded', '#00ff00');

    expect(background).toContain('<rect');
    expect(background).toContain('rx="15"');
    expect(clipPath).toContain('rx="15"');
    expect(clipId).toMatch(/^clip-rounded-[a-f0-9]+$/);
  });

  it('generates square shape', () => {
    const { background, clipPath, clipId } = generateBackgroundShape('square', '#0000ff');

    expect(background).toContain('<rect');
    expect(background).not.toContain('rx=');
    expect(clipPath).toContain('<rect');
    expect(clipId).toMatch(/^clip-square-[a-f0-9]+$/);
  });

  it('uses custom size', () => {
    const { background } = generateBackgroundShape('circle', '#fff', 200);

    expect(background).toContain('cx="100"');
    expect(background).toContain('cy="100"');
    expect(background).toContain('r="100"');
  });

  it('generates deterministic IDs based on inputs', () => {
    const result1 = generateBackgroundShape('circle', '#ff0000');
    const result2 = generateBackgroundShape('circle', '#ff0000');
    const result3 = generateBackgroundShape('rounded', '#00ff00');

    // Same inputs produce same ID (deterministic)
    expect(result1.clipId).toBe(result2.clipId);
    // Different inputs produce different IDs
    expect(result1.clipId).not.toBe(result3.clipId);
  });
});

describe('wrapSvgWithShape', () => {
  it('wraps content with background shape', () => {
    const content = '<text>Hello</text>';
    const svg = wrapSvgWithShape(content, 'circle', '#ff0000');

    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('<circle');
    expect(svg).toContain('fill="#ff0000"');
    expect(svg).toContain(content);
  });

  it('applies circle background', () => {
    const svg = wrapSvgWithShape('<rect/>', 'circle', '#000');

    expect(svg).toContain('<circle');
  });

  it('applies custom size', () => {
    const svg = wrapSvgWithShape('<rect/>', 'square', '#000', 200);

    expect(svg).toContain('viewBox="0 0 200 200"');
    expect(svg).toContain('width="200"');
  });

  it('does not clip content to background shape', () => {
    const svg = wrapSvgWithShape('<rect/>', 'circle', '#000');

    // Content should not be clipped - allows elements to extend beyond background
    expect(svg).not.toContain('clip-path');
    expect(svg).not.toContain('<defs>');
  });
});
