import type { ParamDefinition, Seed } from '../types';

export function assertSeed(seed: unknown): asserts seed is Seed {
  if (
    (typeof seed !== 'string' && typeof seed !== 'number')
    || (typeof seed === 'number' && !Number.isFinite(seed))
  ) {
    throw new Error(`Invalid avatar seed: ${String(seed)}`);
  }
}

export function assertParamValue(
  theme: string,
  key: string,
  definition: ParamDefinition,
  value: unknown,
): void {
  if (
    definition.type === 'select'
    && (typeof value !== 'string' || !definition.options.includes(value))
  ) {
    throw new Error(`Invalid avatar value for ${theme}.${key}: ${String(value)}`);
  }
  if (definition.type === 'number') {
    const step = definition.step ?? 1;
    const stepsFromMinimum = typeof value === 'number'
      ? (value - definition.min) / step
      : Number.NaN;
    if (
      typeof value !== 'number'
      || !Number.isFinite(value)
      || !Number.isFinite(step)
      || step <= 0
      || value < definition.min
      || value > definition.max
      || Math.abs(stepsFromMinimum - Math.round(stepsFromMinimum)) > 1e-9
    ) {
      throw new Error(`Invalid avatar value for ${theme}.${key}: ${String(value)}`);
    }
  }
  if (
    definition.type === 'color'
    && (
      typeof value !== 'string'
      || !/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)
    )
  ) {
    throw new Error(`Invalid avatar value for ${theme}.${key}: ${String(value)}`);
  }
}
