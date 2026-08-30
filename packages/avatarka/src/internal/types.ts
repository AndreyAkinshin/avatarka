import type { ParamSchema, ParamsFromSchema } from '../types';

/** Canonical frame order shared by schemas and schema-driven controls. */
export const backgroundShapeNames = Object.freeze([
  'circle',
  'rounded',
  'square',
] as const);

export type BackgroundShape = (typeof backgroundShapeNames)[number];

export interface AvatarRandom {
  pick<T>(key: string, values: readonly T[]): T;
  weightedPick<T>(key: string, values: readonly (readonly [T, number])[]): T;
  int(key: string, min: number, max: number): number;
  bool(key: string, probability?: number): boolean;
  sample<T>(key: string, values: readonly T[], count: number): T[];
  shuffle<T>(key: string, values: readonly T[]): T[];
}

type SelectParamKey<TSchema extends ParamSchema> = {
  [K in keyof TSchema]: TSchema[K] extends {
    readonly type: 'select';
    readonly options: readonly string[];
  } ? K : never;
}[keyof TSchema] & string;

export interface InternalTheme<
  TSchema extends ParamSchema,
  TKind extends string = string,
  TBaseTypeParam extends SelectParamKey<TSchema> = SelectParamKey<TSchema>,
> {
  name: string;
  description: string;
  kind: TKind;
  baseTypeParam: TBaseTypeParam;
  schema: TSchema;
  generate: (params: ParamsFromSchema<TSchema>) => string;
  randomize: (
    random: AvatarRandom,
    traits?: Partial<ParamsFromSchema<TSchema>>,
  ) => ParamsFromSchema<TSchema>;
}
