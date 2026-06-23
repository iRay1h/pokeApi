import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  forkJoin,
  map,
  switchMap,
  catchError,
  throwError,
  shareReplay
} from 'rxjs';

import {
  Pokemon,
  PokemonListResponse,
  PokemonResult,
  PokemonDetailResponse
} from '../model/PokemonModel';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {

  private API_URL = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemonList(offset: number = 0): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(`${this.API_URL}?limit=20&offset=${offset}`).pipe(
      switchMap((response) => {
        const pokemonRequests = response.results.map(
          (pokemon: PokemonResult) =>
            this.http.get<PokemonDetailResponse>(pokemon.url)
        );

        return forkJoin(pokemonRequests);
      }),
      map((pokemonDetails: PokemonDetailResponse[]) => {
        return pokemonDetails.map(
          (pokemon): Pokemon => ({
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.front_default,
            height: pokemon.height,
            weight: pokemon.weight,
            types: pokemon.types.map((typeInfo) => typeInfo.type.name),
            baseExperience: pokemon.base_experience,
            abilities: pokemon.abilities.map((a) => a.ability.name),
            stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat }))
          })
        );
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
      shareReplay(1)
    );
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http
      .get<PokemonDetailResponse>(
        `${this.API_URL}/${name}`
      )
      .pipe(
        map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.sprites.front_default,
          height: pokemon.height,
          weight: pokemon.weight,
          types: pokemon.types.map((type) => type.type.name),
          baseExperience: pokemon.base_experience,
          abilities: pokemon.abilities.map((a) => a.ability.name),
          stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat }))
        })),
        catchError((err) => throwError(() => err)),
        shareReplay(1)
      );
  }

}
