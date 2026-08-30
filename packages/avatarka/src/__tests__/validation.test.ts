import { describe, expect, it } from 'vitest';
import { assertParamValue, assertSeed } from '../internal/validation';

describe('core runtime validation', () => {
  it.each(['#abc', '#abcd', '#abcdef', '#ABCDEF12'])(
    'accepts exact CSS hex color %s',
    (color) => {
      expect(() => assertParamValue('test', 'color', {
        type: 'color',
        default: '#000000',
      }, color)).not.toThrow();
    },
  );

  it.each(['#ab', '#abcde', '#abcdefg', '#abcdefghi', 'red', '#fff" onload="x']) (
    'rejects malformed hex color %s',
    (color) => {
      expect(() => assertParamValue('test', 'color', {
        type: 'color',
        default: '#000000',
      }, color)).toThrow('Invalid avatar value for test.color');
    },
  );

  it.each([0, 0.25, 0.5, 0.75, 1])('accepts in-range stepped number %s', (value) => {
    expect(() => assertParamValue('test', 'amount', {
      type: 'number',
      default: 0,
      min: 0,
      max: 1,
      step: 0.25,
    }, value)).not.toThrow();
  });

  it.each([-0.25, 0.1, 1.25, Number.NaN, Number.POSITIVE_INFINITY, '0.5'])(
    'rejects invalid stepped number %s',
    (value) => {
      expect(() => assertParamValue('test', 'amount', {
        type: 'number',
        default: 0,
        min: 0,
        max: 1,
        step: 0.25,
      }, value)).toThrow('Invalid avatar value for test.amount');
    },
  );

  it('uses a step of one when the schema omits it', () => {
    const definition = { type: 'number', default: 0, min: 0, max: 3 } as const;

    expect(() => assertParamValue('test', 'count', definition, 2)).not.toThrow();
    expect(() => assertParamValue('test', 'count', definition, 2.5)).toThrow();
  });

  it.each(['', 'identity', 0, -12, 1.5])('accepts finite seed %s', (seed) => {
    expect(() => assertSeed(seed)).not.toThrow();
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, null, {}])(
    'rejects invalid seed %s',
    (seed) => {
      expect(() => assertSeed(seed)).toThrow('Invalid avatar seed');
    },
  );
});
