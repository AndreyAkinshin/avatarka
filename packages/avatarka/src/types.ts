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
  options: string[];
};

export type ParamDefinition = ColorParam | NumberParam | SelectParam;

export type ParamSchema = {
  [key: string]: ParamDefinition;
};

/**
 * Extract the parameter values type from a schema
 */
export type ParamsFromSchema<T extends ParamSchema> = {
  [K in keyof T]: T[K] extends ColorParam
    ? string
    : T[K] extends NumberParam
      ? number
      : T[K] extends SelectParam
        ? T[K]['options'][number]
        : never;
};

/**
 * Theme definition interface
 */
export interface Theme<T extends ParamSchema = ParamSchema> {
  name: string;
  schema: T;
  generate: (params: ParamsFromSchema<T>) => string;
  randomize: (rng: () => number) => ParamsFromSchema<T>;
}

/**
 * Generic params type for external use
 */
export type AvatarParams = Record<string, string | number>;
