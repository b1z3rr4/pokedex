/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PokemonDetailsService } from './PokemonDetails.service';

describe('Service: PokemonDetails', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PokemonDetailsService]
    });
  });

  it('should ...', inject([PokemonDetailsService], (service: PokemonDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
