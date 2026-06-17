import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonListPage } from './pages/pokemon-list-page/pokemon-list-page';
import { PokemonCard } from './components/pokemon-card/pokemon-card';



@NgModule({
  declarations: [
    PokemonListPage,
    PokemonCard
  ],
  imports: [
    CommonModule
  ]
})
export class PokemonModule { }
