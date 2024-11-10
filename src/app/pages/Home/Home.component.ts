import { Component, OnInit } from '@angular/core';
import { ListPokemonService } from '../../../infra/services/ListPokemon/ListPokemon.service';
import { PokemonDetails } from '../../../infra/models/PokemonDetails';
import { PokemonCardComponent } from "../../components/PokemonCard/PokemonCard.component";
import { FlavorText, PokemonSpecie } from '../../../infra/models/PokemonSpecie';
import { LANGUAGE } from '../../../infra/constants/language';

@Component({
  selector: 'app-Home',
  standalone: true,
  providers: [ListPokemonService],
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss'],
  imports: [PokemonCardComponent]
})
export class HomeComponent implements OnInit {
  public pokemons: Array<PokemonDetails & PokemonSpecie> = [];

  constructor(private listPokemon: ListPokemonService) { }

  ngOnInit() {
    this.listPokemon.getPokemonList().subscribe({
      next: (data) => {
        this.pokemons = data;
      },
      error: (err) => console.log(err)
    })
  }

  getDescription(flavorText: Array<FlavorText>) {
    return flavorText.find((flavor) => flavor.language.name === LANGUAGE)?.flavor_text || '';
  }

}
