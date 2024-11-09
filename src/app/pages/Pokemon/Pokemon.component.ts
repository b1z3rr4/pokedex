import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { PokemonDetailsService } from '../../../infra/services/PokemonDetails/PokemonDetails.service';
import { PokemonDetails } from '../../../infra/models/PokemonDetails';
import { PokemonSpecie } from '../../../infra/models/PokemonSpecie';

@Component({
  standalone: true,
  selector: 'app-Pokemon',
  templateUrl: './Pokemon.component.html',
  styleUrls: ['./Pokemon.component.scss'],
  imports: [CommonModule],
})
export class PokemonComponent implements OnInit {
  private id: string = '';
  public pokemon: (PokemonDetails & PokemonSpecie) | null = null;

  constructor(private route: ActivatedRoute, private pokemonDetails: PokemonDetailsService) { }

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) => {
        this.id = params['id']
      }
    });

    this.pokemonDetails.getPokemon(this.id).subscribe({
      next: (response) => {
        console.log(response)
        this.pokemon = response;
      }
    })
  }

}
