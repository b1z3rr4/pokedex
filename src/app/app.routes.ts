import { Routes } from '@angular/router';
import { HomeComponent } from './pages/Home/Home.component';
import { PokemonComponent } from './pages/Pokemon/Pokemon.component';

export const routes: Routes = [
  {
    path: '',
    title: 'PokeDex | Home',
    component: HomeComponent
  },
  {
    path: 'details/:id',
    component: PokemonComponent
  }
];
