import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { POKEMON_API } from '../../constants/variables';
import { PokemonEntry } from '../../models/PokemonEntry';
import { PokemonDetails } from '../../models/PokemonDetails';
import { map, mergeMap, Observable } from 'rxjs';
import { PokemonSpecie } from '../../models/PokemonSpecie';

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailsService {

  constructor(private httpClient: HttpClient) { }

  getPokemon(id: string) {
    return this.httpClient.get<PokemonDetails>(POKEMON_API + 'pokemon' + `/${id}`)
      .pipe(
        mergeMap(response => {
          return this.getNextUrl<PokemonSpecie>(response.species.url).pipe(
            map((specieInfo) => ({
              ...response,
              ...specieInfo,
            }))
          ) as unknown as Observable<PokemonDetails & PokemonSpecie>;
        })
      );
  }

  getNextUrl<TResult>(url: string) {
    return this.httpClient.get<TResult>(url);
  }

}
