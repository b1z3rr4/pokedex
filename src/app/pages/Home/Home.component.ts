import { Component, HostListener, OnInit } from '@angular/core';
import { ListPokemonService } from '../../../infra/services/ListPokemon/ListPokemon.service';
import { PokemonDetails } from '../../../infra/models/PokemonDetails';
import { PokemonCardComponent } from "../../components/PokemonCard/PokemonCard.component";
import { FlavorText, PokemonSpecie } from '../../../infra/models/PokemonSpecie';
import { LANGUAGE } from '../../../infra/constants/language';
import { PokemonEntry } from '../../../infra/models/PokemonEntry';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-Home',
  standalone: true,
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss'],
  imports: [PokemonCardComponent, FormsModule]
})
export class HomeComponent implements OnInit {
  private pokemonList = new BehaviorSubject<Array<PokemonEntry>>([]);
  pokemonList$ = this.pokemonList.asObservable();

  private pokemonPagination = new BehaviorSubject<Array<PokemonEntry>>([]);
  pokemonPagination$ = this.pokemonPagination.asObservable();

  private offset = new BehaviorSubject<number>(0);
  offset$ = this.offset.asObservable();

  private searchName = new BehaviorSubject<string>('');
  searchName$ = this.searchName.asObservable();

  pokemons: Array<PokemonDetails & PokemonSpecie> = [];
  limit = 21;
  searchTerm: string = '';

  private isLoading: boolean = false;

  constructor(private listPokemon: ListPokemonService) {
    this.listPokemon.getPokemons().subscribe({
      next: (data) => {
        this.pokemonList.next(data.results);
      },
    })

    this.pokemonList$.subscribe((pokemonList) => {
      const list = this.cloneList<PokemonEntry>(pokemonList);

      const listPagination = list.splice(0, this.limit);

      this.pokemonPagination.next(listPagination);
    });

    this.searchName$.subscribe((searchName) => {
      if (searchName.length > 2) {
        const filteredList = this.pokemonList.getValue()
          .filter(({ name }) =>
            name.toLowerCase()
              .search(searchName.toLowerCase()) !== -1);

        this.pokemonPagination.next(filteredList);
      }
      else {
        const list = this.cloneList<PokemonEntry>(this.pokemonList.getValue());

        const listPagination = list.splice(0, this.limit);

        this.offset.next(0);

        this.pokemonPagination.next(listPagination);
      }
    });

    this.offset$.subscribe((offset) => {
      const pokemonList = this.cloneList(this.pokemonList.getValue());
      const previousList = this.pokemonPagination.getValue();
      const spliceList = pokemonList.splice(offset, this.limit);
      const newList = new Set([...previousList, ...spliceList]);

      this.pokemonPagination.next(Array.from(newList));
    });

    this.pokemonPagination$.subscribe((pokemonList) => {
      this.getPokemonsDetails(pokemonList);
    });
  }

  ngOnInit() {}

  onSearchChange(value: string): void {
    this.searchName.next(value);
  }

  getPokemonsDetails(pokemonList: Array<PokemonEntry>) {
    this.isLoading = true;

    this.listPokemon.getPokemonsDetails(pokemonList).subscribe({
      next: (data) => {
        this.pokemons = data
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    })
  }

  cloneList<TList>(list: TList[]) {
    return [...list];
  }

  getDescription(flavorText: Array<FlavorText>) {
    return flavorText.find((flavor) => flavor.language.name === LANGUAGE)?.flavor_text || '';
  }

  nextPage() {
    if (this.isLoading) return;

    this.offset.next(this.offset.getValue() + this.limit);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 200) {
      this.nextPage();
    }
  }

}
