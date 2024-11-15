import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonDetails } from '../../../infra/models/PokemonDetails';
import { FlavorText, PokemonSpecie } from '../../../infra/models/PokemonSpecie';
import { PlyrModule, PlyrComponent } from '@atom-platform/ngx-plyr';
import { PokemonDetailsService } from '../../../infra/services/PokemonDetails.ts/PokemonDetails.service';
import { LANGUAGE } from '../../../infra/constants/language';
import { Title } from '@angular/platform-browser';
import { capitalize } from '../../../infra/utils/capitalize';
import { AppHeaderComponent } from '../../components/AppHeader/AppHeader.component';
import { convertToMeters, gramsToKilograms } from '../../../infra/utils/converters';

@Component({
  standalone: true,
  selector: 'app-pokemon',
  templateUrl: './Pokemon.component.html',
  styleUrls: ['./Pokemon.component.scss'],
  imports: [CommonModule, PlyrModule, RouterLink, AppHeaderComponent],
})
export class PokemonComponent implements OnInit {
  id: string = '';

  pokemon: (PokemonDetails & PokemonSpecie) | null = null;

  @ViewChild(PlyrComponent)
  plyr: PlyrComponent | undefined;

  player: Plyr | undefined;

  audioSource: Plyr.Source[] = [];

  isGifLoaded: boolean = false;
  isGifURL: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonDetails: PokemonDetailsService,
    private routerNavigate: Router,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
  ) {}

  ngOnInit() {
    this.route.params.subscribe({
      next: (params) => {
        this.id = params['id'];
        this.getPokemon(this.id);
      },
    });

    this.route.queryParams.subscribe({
      next: (queryParams) => {
        const title = `PokeDex | ${capitalize(queryParams['name'])}`;
        this.titleService.setTitle(title);
      },
    });
  }

  getPokemon(id: string) {
    this.pokemonDetails.getPokemon(id).subscribe({
      next: (response) => {
        this.pokemon = response;
        this.audioSource = [
          {
            src: response?.cries.latest,
            type: 'audio/ogg',
          },
          {
            src: response?.cries.legacy,
            type: 'audio/ogg',
          },
        ];
      },
    });
  }

  goNextPokemon() {
    const pokemonId = (Number(this.id) + 1).toString();

    this.routerNavigate.navigate(['/details', pokemonId]);
  }

  goPreviousPokemon() {
    const pokemonId = Number(this.id) > 1 ? (Number(this.id) - 1).toString() : '1';

    this.routerNavigate.navigate(['/details', pokemonId]);
  }

  getImageUrl() {
    const gifUrl = this.pokemon?.sprites.versions['generation-v']['black-white'].animated.front_default;
    const pngUrl = this.pokemon?.sprites.front_default;

    if (this.isGifLoaded) {
      this.isGifURL = true;
      return gifUrl;
    }

    return pngUrl;
  }

  onGifLoad() {
    this.isGifLoaded = true;
    this.cdr.detectChanges();
  }

  formatNumber() {
    return this.pokemon?.id.toString().padStart(3, '0');
  }

  play(): void {
    this.player?.play();
  }

  getDescription(flavorText?: Array<FlavorText>) {
    return flavorText?.find((flavor) => flavor.language.name === LANGUAGE)?.flavor_text || '';
  }

  getStatsDescription(stats: string) {
    const statsMap: Record<string, string> = {
      hp: 'HP',
      attack: 'ATK',
      defense: 'DEF',
      'special-attack': 'SpA',
      'special-defense': 'SpD',
      speed: 'SPD',
    };

    return statsMap[stats];
  }

  getAbilityFormatted(ability: string) {
    return ability.replace('-', ' ');
  }

  weightFormatted(grams?: number) {
    if (grams) {
      return gramsToKilograms(grams);
    }

    return '0kg';
  }

  heightFormatted(height?: number) {
    if (height) {
      return convertToMeters(height);
    }

    return '0m';
  }
}
