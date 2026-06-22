import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PokemonListPage } from './pages/pokemon-list-page/pokemon-list-page';
import { PokemonCard } from './components/pokemon-card/pokemon-card';
import { PokemonDetailPage } from './pages/pokemon-detail-page/pokemon-detail-page';

@NgModule({
  declarations: [
    PokemonListPage,
    PokemonCard,
    PokemonDetailPage
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    PokemonListPage,
    PokemonCard
  ]
})
export class PokemonModule { }