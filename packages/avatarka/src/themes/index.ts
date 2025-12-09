export { people, schema as peopleSchema } from './people';
export type { PeopleParams } from './people';

export { animals, schema as animalsSchema } from './animals';
export type { AnimalParams } from './animals';

export { monsters, schema as monstersSchema } from './monsters';
export type { MonsterParams } from './monsters';

export { robots, schema as robotsSchema } from './robots';
export type { RobotParams } from './robots';

export { aliens, schema as aliensSchema } from './aliens';
export type { AliensParams } from './aliens';

export { geometric, schema as geometricSchema } from './geometric';
export type { GeometricParams } from './geometric';

import { people, type PeopleParams } from './people';
import { animals, type AnimalParams } from './animals';
import { monsters, type MonsterParams } from './monsters';
import { robots, type RobotParams } from './robots';
import { aliens, type AliensParams } from './aliens';
import { geometric, type GeometricParams } from './geometric';

export const themes = {
  people,
  animals,
  monsters,
  robots,
  aliens,
  geometric,
} as const;

export type ThemeMap = typeof themes;
export type ThemeName = keyof ThemeMap;

/**
 * Maps theme names to their strongly-typed parameter types.
 * Use this with generics to get type-safe params for a specific theme.
 */
export interface ThemeParamsMap {
  people: PeopleParams;
  animals: AnimalParams;
  monsters: MonsterParams;
  robots: RobotParams;
  aliens: AliensParams;
  geometric: GeometricParams;
}

/**
 * Extract the params type for a given theme name.
 * @example
 * type MonsterP = ThemeParams<'monsters'>; // MonsterParams
 */
export type ThemeParams<T extends ThemeName> = ThemeParamsMap[T];
