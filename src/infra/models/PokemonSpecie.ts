import { PokemonEntry } from "./PokemonEntry";

export interface PokemonSpecie {
  base_happiness: number;
  capture_rate: number;
  color: PokemonEntry;
  egg_groups: Array<PokemonEntry>;
  evolution_chain: {
    url: string;
  };
  flavor_text_entries: Array<FlavorText>;
}

export interface FlavorText {
  flavor_text: string;
  language: PokemonEntry;
  version: PokemonEntry;
}
