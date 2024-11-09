import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { POKEMON_API } from '../../constants/variables';
import { ResponseApi } from '../../utils/types';
import { PokemonEntry } from '../../models/PokemonEntry';
import { PokemonDetails } from '../../models/PokemonDetails';
import { forkJoin, map, mergeMap } from 'rxjs';
import { PokemonSpecie } from '../../models/PokemonSpecie';

@Injectable({
  providedIn: 'root'
})
export class ListPokemonService {

  constructor(private httpClient: HttpClient) { }

  getPokemonList() {
    return this.httpClient.get<ResponseApi<Array<PokemonEntry>>>(POKEMON_API + 'pokemon?limit=21')
      .pipe(
        mergeMap(response => {
          const detailRequests = response.results.map(entry =>
            this.getNextUrl<PokemonDetails>(entry.url).pipe(
              mergeMap(details => {
                return this.getNextUrl<PokemonSpecie>(details.species.url).pipe(
                  map(speciesInfo => ({
                    ...details,
                    ...speciesInfo
                  }))
                ) as unknown as Array<PokemonDetails & PokemonSpecie>;
              })
            )
          );

          return forkJoin(detailRequests);
        })
      );
  }

  getNextUrl<TResult>(url: string) {
    return this.httpClient.get<TResult>(url);
  }
}
