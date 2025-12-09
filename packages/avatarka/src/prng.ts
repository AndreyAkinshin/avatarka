/**
 * Mulberry32 PRNG - A simple, fast 32-bit seeded PRNG
 * Creates a deterministic random number generator from a numeric seed
 */
export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Converts a string to a numeric seed using a simple hash function
 */
export function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Creates a seeded RNG from either a number or string seed
 */
export function createRng(seed?: string | number): () => number {
  if (seed === undefined) {
    // Use current timestamp + random for non-deterministic generation
    seed = Date.now() + Math.random() * 1000000;
  } else if (typeof seed === 'string') {
    seed = stringToSeed(seed);
  }
  return mulberry32(seed);
}
