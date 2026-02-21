import { describe, it, expect } from 'vitest';
import { createRng } from '../prng';

describe('createRng', () => {
  it('creates deterministic RNG from string seed', () => {
    const rng1 = createRng('test-seed');
    const rng2 = createRng('test-seed');

    expect(rng1.uniformFloat()).toBe(rng2.uniformFloat());
    expect(rng1.uniformFloat()).toBe(rng2.uniformFloat());
  });

  it('creates deterministic RNG from numeric seed', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);

    expect(rng1.uniformFloat()).toBe(rng2.uniformFloat());
    expect(rng1.uniformFloat()).toBe(rng2.uniformFloat());
  });

  it('creates RNG without seed', () => {
    const rng = createRng();

    // Should produce valid values without throwing
    const value = rng.uniformFloat();
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThan(1);
  });

  it('returns values in valid range', () => {
    const rng = createRng('seed');

    for (let i = 0; i < 100; i++) {
      const value = rng.uniformFloat();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('uniformInt returns integers in range', () => {
    const rng = createRng('int-test');

    for (let i = 0; i < 100; i++) {
      const value = rng.uniformInt(5, 11);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThan(11);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it('shuffle returns a new array with same elements', () => {
    const rng = createRng('shuffle-test');
    const original = [1, 2, 3, 4, 5];
    const shuffled = rng.shuffle(original);

    expect(shuffled).not.toBe(original);
    expect(shuffled.sort()).toEqual(original.sort());
  });
});
