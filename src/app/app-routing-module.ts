import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PokemonListPage } from './features/pokemon/pages/pokemon-list-page/pokemon-list-page';
import { PokemonDetailPage } from './features/pokemon/pages/pokemon-detail-page/pokemon-detail-page';

const routes: Routes = [

  {
    path: '',
    component: PokemonListPage
  },

  {
    path: 'pokemon/:name',
    component: PokemonDetailPage
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}