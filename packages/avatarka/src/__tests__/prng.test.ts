import { describe, it, expect } from 'vitest';
import { mulberry32, stringToSeed, createRng } from '../prng';

describe('mulberry32', () => {
  it('produces deterministic results from the same seed', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);

    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('produces different results from different seeds', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(67890);

    expect(rng1()).not.toBe(rng2());
  });

  it('produces values between 0 and 1', () => {
    const rng = mulberry32(42);

    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });

  it('produces a variety of values', () => {
    const rng = mulberry32(99);
    const values = new Set<number>();

    for (let i = 0; i < 100; i++) {
      values.add(rng());
    }

    // Should produce mostly unique values
    expect(values.size).toBeGreaterThan(95);
  });
});

describe('stringToSeed', () => {
  it('produces consistent hash for same string', () => {
    expect(stringToSeed('hello')).toBe(stringToSeed('hello'));
    expect(stringToSeed('user@email.com')).toBe(stringToSeed('user@email.com'));
  });

  it('produces different hashes for different strings', () => {
    expect(stringToSeed('hello')).not.toBe(stringToSeed('world'));
    expect(stringToSeed('abc')).not.toBe(stringToSeed('cba'));
  });

  it('returns non-negative values', () => {
    const testStrings = ['', 'a', 'test', 'hello world', '12345', 'ñoño', '你好'];

    for (const str of testStrings) {
      expect(stringToSeed(str)).toBeGreaterThanOrEqual(0);
    }
  });

  it('handles empty string', () => {
    expect(stringToSeed('')).toBe(0);
  });

  it('produces different hashes for similar strings', () => {
    expect(stringToSeed('test1')).not.toBe(stringToSeed('test2'));
    expect(stringToSeed('test')).not.toBe(stringToSeed('Test'));
  });
});

describe('createRng', () => {
  it('creates deterministic RNG from string seed', () => {
    const rng1 = createRng('test-seed');
    const rng2 = createRng('test-seed');

    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('creates deterministic RNG from numeric seed', () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);

    expect(rng1()).toBe(rng2());
    expect(rng1()).toBe(rng2());
  });

  it('creates non-deterministic RNG when no seed provided', () => {
    const rng1 = createRng();
    const rng2 = createRng();

    // While theoretically these could be equal, it's extremely unlikely
    const values1 = [rng1(), rng1(), rng1()];
    const values2 = [rng2(), rng2(), rng2()];

    expect(values1).not.toEqual(values2);
  });

  it('returns values in valid range', () => {
    const rng = createRng('seed');

    for (let i = 0; i < 100; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});


