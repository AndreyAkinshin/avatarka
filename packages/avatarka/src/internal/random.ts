import { Rng } from 'pragmastat';
import type { AvatarRandom } from './types';

import { RECIPE_PROTOCOL } from '../version';

let entropyCounter = 0;

const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x00000100000001b3n;
const U64_MASK = 0xffffffffffffffffn;
const textEncoder = new TextEncoder();
let cachedNamespace: string | undefined;
let cachedSeedType: string | undefined;
let cachedPrefixHash: bigint | undefined;

function extendFnv1a(hash: bigint, value: string): bigint {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code > 0x7f) {
      // Avatarka's protocol keys are ASCII. Keep arbitrary Unicode seeds and
      // namespaces byte-identical by delegating only the uncommon suffix.
      for (const byte of textEncoder.encode(value.slice(index))) {
        hash ^= BigInt(byte);
        hash = (hash * FNV_PRIME) & U64_MASK;
      }
      return hash;
    }
    hash ^= BigInt(code);
    hash = (hash * FNV_PRIME) & U64_MASK;
  }
  return hash;
}

function sharedPrefixHash(namespace: string, seedType: string): bigint {
  if (
    cachedPrefixHash !== undefined
    && cachedNamespace === namespace
    && cachedSeedType === seedType
  ) {
    return cachedPrefixHash;
  }

  const prefix = `${JSON.stringify([
    RECIPE_PROTOCOL,
    namespace,
    seedType,
  ]).slice(0, -1)},`;
  cachedNamespace = namespace;
  cachedSeedType = seedType;
  cachedPrefixHash = extendFnv1a(FNV_OFFSET_BASIS, prefix);
  return cachedPrefixHash;
}

function randomEntropy(): string {
  entropyCounter += 1;

  if (typeof globalThis.crypto?.getRandomValues === 'function') {
    const values = new Uint32Array(4);
    globalThis.crypto.getRandomValues(values);
    return `${Array.from(values).join('.')}.${entropyCounter}`;
  }

  return `${Date.now()}.${Math.random()}.${entropyCounter}`;
}

/** Materialize entropy so an unseeded generated avatar can still be saved. */
export function createEntropySeed(): string {
  return `random:${randomEntropy()}`;
}

function canonicalSeed(seed: string | number | undefined): readonly [string, string] {
  if (seed === undefined) {
    return ['random', randomEntropy()];
  }
  return [typeof seed, String(seed)];
}

/**
 * Creates named deterministic streams. Adding a new trait does not shift the
 * random choices of existing traits because every key receives its own RNG.
 */
export function createAvatarRandom(
  seed?: string | number,
  namespace = 'default',
): AvatarRandom {
  const [seedType, seedValue] = canonicalSeed(seed);
  // Pragmastat hashes every string seed with FNV-1a. An avatar identity uses a
  // separate named stream for each trait, so passing the complete JSON seed to
  // every Rng used to re-encode and re-hash the same long prefix many times.
  // Hash the shared prefix once, extend it with the key, and pass the identical
  // 64-bit seed directly. This preserves the protocol byte-for-byte while
  // making galleries with thousands of candidate identities substantially
  // cheaper to build.
  const prefixHash = extendFnv1a(
    sharedPrefixHash(namespace, seedType),
    `${JSON.stringify(seedValue)},`,
  );
  const stream = (key: string) => new Rng(
    extendFnv1a(prefixHash, `${JSON.stringify(key)}]`),
  );

  return {
    pick<T>(key: string, values: readonly T[]): T {
      if (values.length === 0) throw new Error(`Cannot pick from an empty list: ${key}`);
      return values[stream(key).uniformInt(0, values.length)]!;
    },

    weightedPick<T>(key: string, values: readonly (readonly [T, number])[]): T {
      if (values.length === 0) throw new Error(`Cannot pick from an empty list: ${key}`);
      const total = values.reduce((sum, [, weight]) => sum + Math.max(0, weight), 0);
      if (total <= 0) throw new Error(`Weighted list has no positive weights: ${key}`);

      let cursor = stream(key).uniformFloatRange(0, total);
      for (const [value, weight] of values) {
        cursor -= Math.max(0, weight);
        if (cursor < 0) return value;
      }
      return values[values.length - 1]![0];
    },

    int(key: string, min: number, max: number): number {
      if (max < min) throw new Error(`Invalid integer range for ${key}: ${min}..${max}`);
      return stream(key).uniformInt(min, max + 1);
    },

    bool(key: string, probability = 0.5): boolean {
      const clamped = Math.max(0, Math.min(1, probability));
      return stream(key).uniformFloat() < clamped;
    },

    sample<T>(key: string, values: readonly T[], count: number): T[] {
      if (
        !Number.isSafeInteger(count)
        || count < 0
        || count > values.length
      ) {
        throw new RangeError(
          `Sample count for ${key} must be an integer between 0 and ${values.length}`,
        );
      }
      if (count === 0) return [];
      return stream(key).sample([...values], count);
    },

    shuffle<T>(key: string, values: readonly T[]): T[] {
      return stream(key).shuffle([...values]);
    },
  };
}
