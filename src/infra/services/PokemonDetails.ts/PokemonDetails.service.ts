import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { POKEMON_API } from '../../constants/variables';
import { PokemonDetails } from '../../models/PokemonDetails';
import { map, mergeMap, Observable, of } from 'rxjs';
import { PokemonSpecie } from '../../models/PokemonSpecie';
import { CacheService } from '../Cache/Cache.service';

@Injectable({
  providedIn: 'root'
})
export class PokemonDetailsService {
  constructor(private httpClient: HttpClient, private cacheService: CacheService) {}

  getPokemon(id: string): Observable<PokemonDetails & PokemonSpecie> {
    const url = POKEMON_API + 'pokemon' + `/${id}/`;

    const cachedData = this.cacheService.getCachedData<PokemonDetails & PokemonSpecie>(url);

    if (cachedData) {
      return of(cachedData);
    }

    return this.httpClient.get<PokemonDetails>(url).pipe(
      mergeMap(response => {
        return this.getNextUrl<PokemonSpecie>(response.species.url).pipe(
          map((specieInfo) => ({
            ...response,
            ...specieInfo,
          }))
        );
      }),
      map(pokemonDetails => {
        this.cacheService.cacheData(id, pokemonDetails);
        return pokemonDetails;
      })
    );
  }

  getNextUrl<TResult>(url: string): Observable<TResult> {
    const cachedData = this.cacheService.getCachedData<TResult>(url);

    if (cachedData) {
      return of(cachedData);
    }

    return this.httpClient.get<TResult>(url).pipe(
      map(response => {
        this.cacheService.cacheData(url, response);
        return response;
      })
    );
  }
}
