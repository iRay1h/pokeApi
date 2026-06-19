import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  Observable,
  forkJoin,
  map,
  switchMap
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

  getPokemonList(): Observable<Pokemon[]> {

  return this.http.get<PokemonListResponse>(`${this.API_URL}?limit=20&offset=0`).pipe(

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

            types: pokemon.types.map(
              (typeInfo) => typeInfo.type.name
            ),

            baseExperience: pokemon.base_experience,
            cry: pokemon.cries.latest

          })
        );

      })

    );

}

}