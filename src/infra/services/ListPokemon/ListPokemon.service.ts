import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { POKEMON_API, POKEMON_LENGTH } from '../../constants/variables';
import { ResponseApi } from '../../utils/types';
import { PokemonEntry } from '../../models/PokemonEntry';
import { PokemonDetails } from '../../models/PokemonDetails';
import { forkJoin, map, mergeMap, Observable, of } from 'rxjs';
import { PokemonSpecie } from '../../models/PokemonSpecie';
import { CacheService } from '../Cache/Cache.service';

@Injectable({
  providedIn: 'root'
})
export class ListPokemonService {
  constructor(private httpClient: HttpClient, private cacheService: CacheService) {}

  getPokemons(url: string = POKEMON_API + 'pokemon?limit=' + POKEMON_LENGTH): Observable<ResponseApi<Array<PokemonEntry>>> {
    const cachedData = this.cacheService.getCachedData<ResponseApi<Array<PokemonEntry>>>(url);

    if (cachedData) {
      return of(cachedData);
    }

    return this.httpClient.get<ResponseApi<Array<PokemonEntry>>>(url).pipe(
      map(response => {
        this.cacheService.cacheData(url, response);
        return response;
      })
    );
  }

  getPokemonsDetails(pokemons: Array<PokemonEntry>): Observable<Array<PokemonDetails & PokemonSpecie>> {
    const detailRequests = pokemons.map(entry =>
      this.getNextUrl<PokemonDetails>(entry.url).pipe(
        mergeMap(details =>
          this.getNextUrl<PokemonSpecie>(details.species.url).pipe(
            map(speciesInfo => ({
              ...details,
              ...speciesInfo
            }))
          )
        )
      )
    );

    return forkJoin(detailRequests);
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
