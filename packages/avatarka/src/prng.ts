import { Rng } from 'pragmastat';
export { Rng } from 'pragmastat';

/**
 * Creates a seeded RNG from either a number or string seed
 */
export function createRng(seed?: string | number): Rng {
  return new Rng(seed);
}
