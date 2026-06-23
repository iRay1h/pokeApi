import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Pokemon } from '../../model/PokemonModel';
import { PokemonService } from '../../services/pokemonService';

@Component({
  selector: 'app-pokemon-detail-page',
  standalone: false,
  templateUrl: './pokemon-detail-page.html',
  styleUrls: ['./pokemon-detail-page.scss']
})
export class PokemonDetailPage implements OnInit {

  pokemon?: Pokemon;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const name = params.get('name');
      if (name) {
        this.loadPokemon(name);
      }
    });
  }

  loadPokemon(name: string): void {
    this.pokemonService
      .getPokemonByName(name)
      .subscribe((data) => {
        this.pokemon = data;
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  previousPokemon(): void {
    if (!this.pokemon || this.pokemon.id <= 1) {
      return;
    }
    const previousId = this.pokemon.id - 1;
    this.router.navigate(['/pokemon', previousId]);
  }

  nextPokemon(): void {
    if (!this.pokemon) {
      return;
    }
    const nextId = this.pokemon.id + 1;
    this.router.navigate(['/pokemon', nextId]);
  }

}
