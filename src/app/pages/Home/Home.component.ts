import { AfterViewChecked, Component, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ListPokemonService } from '../../../infra/services/ListPokemon/ListPokemon.service';
import { PokemonDetails } from '../../../infra/models/PokemonDetails';
import { PokemonCardComponent } from "../../components/PokemonCard/PokemonCard.component";
import { FlavorText, PokemonSpecie } from '../../../infra/models/PokemonSpecie';
import { LANGUAGE } from '../../../infra/constants/language';
import { PokemonEntry } from '../../../infra/models/PokemonEntry';
import { FormsModule } from '@angular/forms';
import { StateManagerService } from '../../../infra/services/StateManager/StateManager.service';
import { KEYS } from '../../../infra/constants/keys';
import { CARD_HEIGHT } from '../../../infra/constants/variables';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Home',
  standalone: true,
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss'],
  imports: [PokemonCardComponent, FormsModule]
})
export class HomeComponent implements OnInit, AfterViewChecked {
  pokemons: Array<PokemonDetails & PokemonSpecie> = [];
  searchTerm: string = '';
  limit = 42;
  loadMore = 21;
  isLoading = false;

  constructor(private stateManagerService: StateManagerService, private listPokemon: ListPokemonService, private route: ActivatedRoute) { }

  // ng directives
  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollToElement(fragment);
      }
    });

    this.subscribeOnAllPokemons();
    this.subscribePaginatedList();
    this.subscribeOffset();
    this.subscribeSearchName();
  }

  ngAfterViewChecked() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollToElement(fragment);
      }
    });
  }

  // subscribes
  subscribeOnAllPokemons() {
    this.stateManagerService.getState(KEYS.allPokemons, []).subscribe({
      next: (allPokemons) => {
        if (allPokemons.length === 0) {
          this.getPokemonsList(0, this.limit);
        }
      }
    })
  }

  subscribePaginatedList() {
    this.stateManagerService.getState(KEYS.paginatedList, []).subscribe({
      next: (paginatedList) => {
        this.getPokemonsDetails(paginatedList);
      }
    })
  }

  subscribeOffset() {
    this.stateManagerService.getState(KEYS.offset, 0).subscribe({
      next: (offset) => {
        const allPokemons = [...this.stateManagerService.getCurrentState(KEYS.allPokemons, [])];

        const paginated = allPokemons.splice(offset, this.limit);

        if (offset !== 0) {
          const previousValue = this.stateManagerService.getCurrentState(KEYS.paginatedList, []);

          const newValue = [...previousValue, ...paginated];

          this.setPaginatedItems(newValue);
        }
      }
    })
  }

  subscribeSearchName() {
    this.stateManagerService.getState(KEYS.searchName, '').subscribe({
      next: (search) => {
        this.searchTerm = search;

        const offset = this.stateManagerService.getCurrentState(KEYS.offset, 0);
        const allPokemons = [...this.stateManagerService.getCurrentState<PokemonEntry[]>(KEYS.allPokemons, [])];

        if (search.length < 3) {
          const paginated = allPokemons.splice(0, offset + this.limit);

          this.setPaginatedItems(paginated);
        } else {
          const filters = allPokemons.filter(({ name }) => name.toLowerCase().search(search.toLowerCase()) !== -1);
          this.setPaginatedItems(filters);
        }
      }
    })
  }

  // changes
  onSearchChange(value: string): void {
    this.searchTerm = value;
    this.stateManagerService.setState(KEYS.searchName, value);
  }

  onClearInput(value: string) {
    if (value.length < 1) {
      this.stateManagerService.setState(KEYS.searchName, '');
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - (CARD_HEIGHT * 2)) {
      const offset = this.stateManagerService.getCurrentState(KEYS.offset, 0);
      const newOffset = offset + this.loadMore;

      if (!this.isLoading && newOffset < 1011) {
        this.isLoading = true;
        this.stateManagerService.setState(KEYS.offset, newOffset);
      }
    }
  }

  // services
  getPokemonsList(offset: number, limit: number) {
    this.listPokemon.getPokemons().subscribe({
      next: (data) => {
        this.stateManagerService.setState(KEYS.allPokemons, data.results);

        const paginated = [...data.results].splice(offset, limit);

        this.setPaginatedItems(paginated);
      }
    })
  }

  getPokemonsDetails(pokemonList: Array<PokemonEntry>) {
    this.isLoading = true;

    this.listPokemon.getPokemonsDetails(pokemonList).subscribe({
      next: (data) => {
        this.pokemons = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  // utils
  getDescription(flavorText: Array<FlavorText>) {
    return flavorText.find((flavor) => flavor.language.name === LANGUAGE)?.flavor_text || '';
  }

  setPaginatedItems(items: PokemonEntry[]) {
    const newItems = new Set(items);
    const arrayFrom = Array.from(newItems);

    this.stateManagerService.setState(KEYS.paginatedList, arrayFrom);
  }

  private scrollToElement(fragment: string) {
    const element = document.getElementById(fragment);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
