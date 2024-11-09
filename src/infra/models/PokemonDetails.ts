import { PokemonEntry } from "./PokemonEntry";
import { SprintImage, SprintOthers } from "./PokemonSprint";

export interface PokemonDetails {
  // Primary information's
  id: number;
  name: string;
  order: number;
  height: number;
  weight: number;
  is_default: boolean;
  base_experience: number;
  location_area_encounters: string;

  // Secondary information's
  cries: {
    latest: string;
    legacy: string;
  };
  species: {
    name: string;
    url: string;
  };
  sprites: SprintImage & {
    other: SprintOthers;
    versions: Generations;
  }

  // Tertiary information's Not Typed
  held_items: any[];
  past_types: any[];
  past_abilities: any[];

  // Tertiary information's Typed
  moves: Array<Move>;
  stats: Array<Stat>;
  types: Array<Type>;
  abilities: Array<Ability>;
  forms: Array<PokemonEntry>;
  game_indices: Array<GameIndices>;
}

// Other types
export interface Ability {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface GameIndices {
  game_index: number;
  version: PokemonEntry;
}

export interface Move {
  move: PokemonEntry;
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: PokemonEntry;
    version_group: PokemonEntry;
  }>
}

export interface Stat {
  effort: number;
  base_stat: number;
  stat: PokemonEntry;
}

export interface Type {
  slot: number;
  type: PokemonEntry;
}
