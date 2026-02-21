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

export { ocean, schema as oceanSchema } from './ocean';
export type { OceanParams } from './ocean';

export { dinosaurs, schema as dinosaursSchema } from './dinosaurs';
export type { DinosaurParams } from './dinosaurs';

export { mythical, schema as mythicalSchema } from './mythical';
export type { MythicalParams } from './mythical';

export { insects, schema as insectsSchema } from './insects';
export type { InsectsParams } from './insects';

export { birds, schema as birdsSchema } from './birds';
export type { BirdsParams } from './birds';

export { plants, schema as plantsSchema } from './plants';
export type { PlantsParams } from './plants';

export { food, schema as foodSchema } from './food';
export type { FoodParams } from './food';

export { weather, schema as weatherSchema } from './weather';
export type { WeatherParams } from './weather';

export { gems, schema as gemsSchema } from './gems';
export type { GemsParams } from './gems';

import { people, type PeopleParams } from './people';
import { animals, type AnimalParams } from './animals';
import { monsters, type MonsterParams } from './monsters';
import { robots, type RobotParams } from './robots';
import { aliens, type AliensParams } from './aliens';
import { ocean, type OceanParams } from './ocean';
import { dinosaurs, type DinosaurParams } from './dinosaurs';
import { mythical, type MythicalParams } from './mythical';
import { insects, type InsectsParams } from './insects';
import { birds, type BirdsParams } from './birds';
import { plants, type PlantsParams } from './plants';
import { food, type FoodParams } from './food';
import { weather, type WeatherParams } from './weather';
import { gems, type GemsParams } from './gems';

export const themes = {
  people,
  animals,
  monsters,
  robots,
  aliens,
  ocean,
  dinosaurs,
  mythical,
  insects,
  birds,
  plants,
  food,
  weather,
  gems,
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
  ocean: OceanParams;
  dinosaurs: DinosaurParams;
  mythical: MythicalParams;
  insects: InsectsParams;
  birds: BirdsParams;
  plants: PlantsParams;
  food: FoodParams;
  weather: WeatherParams;
  gems: GemsParams;
}

/**
 * Extract the params type for a given theme name.
 * @example
 * type MonsterP = ThemeParams<'monsters'>; // MonsterParams
 */
export type ThemeParams<T extends ThemeName> = ThemeParamsMap[T];
