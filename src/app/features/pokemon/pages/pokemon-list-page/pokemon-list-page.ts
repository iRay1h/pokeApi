import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, catchError, of, map } from 'rxjs';

import { Pokemon } from '../../model/PokemonModel';
import { PokemonService } from '../../services/pokemonService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list-page',
  standalone: false,
  templateUrl: './pokemon-list-page.html',
  styleUrls: ['./pokemon-list-page.scss']
})
export class PokemonListPage implements OnInit {

  pokemons: Pokemon[] = [];

  loading = true;

  error = '';

  currentPage = 0;

  searchTerm = '';
  private searchSubject = new Subject<string>();
  searching = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term.trim()) {
            this.searching = false;
            this.error = '';
            return this.pokemonService.getPokemonList(this.currentPage * 20);
          }

          this.searching = true;
          return this.pokemonService.getPokemonByName(term.toLowerCase()).pipe(
            map((pokemon) => [pokemon]),
            catchError(() => {
              this.error = 'No se encontró ningún Pokémon con ese nombre';
              this.searching = false;
              return of([] as Pokemon[]);
            })
          );
        })
      )
      .subscribe((data) => {
        this.pokemons = data;
        this.loading = false;
        this.searching = false;
      });

    this.loadPokemons();
  }

  loadPokemons(): void {
    this.loading = true;
    this.error = '';

    this.pokemonService
      .getPokemonList(this.currentPage * 20)
      .subscribe({
        next: (data) => {
          this.pokemons = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al cargar los Pokémon';
          this.loading = false;
        }
      });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  goToPokemon(name: string): void {
    this.router.navigate([
      '/pokemon',
      name
    ]);
  }

  nextPage(): void {
    this.currentPage++;
    this.loadPokemons();
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPokemons();
    }
  }

}
