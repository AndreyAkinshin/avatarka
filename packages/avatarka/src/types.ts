/**
 * Parameter type definitions for theme schemas
 */
export type ColorParam = {
  type: 'color';
  default: string;
};

export type NumberParam = {
  type: 'number';
  default: number;
  min: number;
  max: number;
  step?: number;
};

export type SelectParam = {
  type: 'select';
  default: string;
  options: readonly string[];
};

export type ParamDefinition = ColorParam | NumberParam | SelectParam;

export type ParamSchema = {
  readonly [key: string]: ParamDefinition;
};

/**
 * Extract the parameter values type from a schema
 */
export type ParamsFromSchema<T extends ParamSchema> = {
  -readonly [K in keyof T]: T[K] extends ColorParam
    ? string
    : T[K] extends NumberParam
      ? number
      : T[K] extends SelectParam
        ? T[K]['options'][number]
        : never;
};

/** A stable identity seed. String and number seeds are intentionally distinct. */
export type Seed = string | number;
