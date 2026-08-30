import type { AvatarRandom } from './types';

export const GALLERY_CANDIDATE_POOL_SIZE = 10;
export const FOLKS_GALLERY_CANDIDATE_POOL_SIZE = 14;

export function createGalleryCandidateSeeds(
  index: number,
  count: number,
  random: AvatarRandom,
): number[] {
  if (!Number.isSafeInteger(index) || index < 0) {
    throw new RangeError('Gallery item index must be a non-negative safe integer');
  }
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new RangeError('Gallery candidate count must be a positive safe integer');
  }

  return Array.from(
    { length: count },
    (_, attempt) => random.int(
      `item-seed:${index}:${attempt}`,
      0,
      0x7fffffff,
    ),
  );
}

/**
 * Selects only from the caller's fixed candidate window. A new semantic
 * identity always wins over a repeated one; ties preserve deterministic input
 * order after applying the gallery-balance score.
 */
export function selectGalleryCandidate<
  Candidate extends {
    readonly signature: string;
    readonly score: number;
  },
>(
  candidates: readonly Candidate[],
  usedSignatures: ReadonlySet<string>,
): Candidate {
  const selected = candidates.reduce<Candidate | undefined>((best, candidate) => {
    if (!best) return candidate;
    const candidateDuplicate = usedSignatures.has(candidate.signature);
    const bestDuplicate = usedSignatures.has(best.signature);
    if (candidateDuplicate !== bestDuplicate) {
      return candidateDuplicate ? best : candidate;
    }
    return candidate.score < best.score ? candidate : best;
  }, undefined);

  if (!selected) throw new Error('Unable to generate gallery item');
  return selected;
}

/**
 * Builds one theme's primary-trait schedule independently from every other
 * theme in a gallery. Sampling decides membership for a partial cycle; the
 * sampled set is restored to catalog order before a separate named stream
 * decides presentation order.
 */
export function createBaseTypeSchedule<Value extends string>(
  theme: string,
  catalog: readonly Value[],
  count: number,
  random: AvatarRandom,
): Value[] {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('Base-type schedule count must be a non-negative safe integer');
  }
  if (new Set(catalog).size !== catalog.length) {
    throw new Error(`Base-type catalog for ${theme} contains duplicate values`);
  }
  if (count > 0 && catalog.length === 0) {
    throw new Error(`Base-type catalog for ${theme} is empty`);
  }

  const schedule: Value[] = [];
  for (let cycle = 0; schedule.length < count; cycle += 1) {
    const blockSize = Math.min(catalog.length, count - schedule.length);
    const sampled = random.sample(
      `base-type-members:${theme}:${cycle}`,
      catalog,
      blockSize,
    );
    const sampledMembers = new Set(sampled);
    const selected = catalog.filter((value) => sampledMembers.has(value));
    if (selected.length !== blockSize) {
      throw new Error(`Invalid base-type sample for ${theme} cycle ${cycle}`);
    }

    let ordered = random.shuffle(
      `base-type-order:${theme}:${cycle}`,
      selected,
    );
    if (
      ordered.length !== blockSize
      || new Set(ordered).size !== blockSize
      || ordered.some((value) => !sampledMembers.has(value))
    ) {
      throw new Error(`Invalid base-type order for ${theme} cycle ${cycle}`);
    }

    const previous = schedule[schedule.length - 1];
    if (
      previous !== undefined
      && ordered.length > 1
      && ordered[0] === previous
    ) {
      const rotation = ordered.findIndex((value) => value !== previous);
      ordered = [
        ...ordered.slice(rotation),
        ...ordered.slice(0, rotation),
      ];
    }
    schedule.push(...ordered);
  }

  return schedule;
}
