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
  PokemonDetailResponse,
  PokemonSpeciesResponse,
  EvolutionChainResponse,
  EvolutionChainLink,
  EvolutionStage
} from '../model/PokemonModel';

@Injectable({
  providedIn: 'root',
})
/**
 * Servicio responsable de comunicarse con la PokéAPI y transformar
 * las respuestas en modelos tipados consumibles por la UI.
 *
 * Implementa operadores RxJS encadenados (switchMap, forkJoin, map)
 * para obtener la lista y después las llamadas de detalle sin
 * suscripciones anidadas.
 */
export class PokemonService {

  private API_URL = 'https://pokeapi.co/api/v2/pokemon';
  // Publicly available cries (PokemonShowdown) - fallback if API doesn't provide audio
  private CRY_BASE = 'https://play.pokemonshowdown.com/audio/cries';

  constructor(private http: HttpClient) {}

  /**
   * Recupera una página de Pokémon.
   * - Usa el endpoint de lista para obtener `name` y `url`.
   * - Para cada resultado realiza una petición de detalle con `forkJoin`.
   * - Transforma la respuesta en `Pokemon[]` con las propiedades usadas en la UI.
   *
   * @param offset offset para paginación (multiplo de 20)
   */
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
            stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
            cry: `${this.CRY_BASE}/${pokemon.name}.mp3`

          })
        );

      })

      ,

      catchError((err) => {
        return throwError(() => err);
      }),

      shareReplay(1)

    );

}

  /**
   * Recupera el detalle de un Pokémon por nombre o id y lo transforma
   * al modelo `Pokemon` usado por la UI.
   */
  getPokemonByName(name: string): Observable<Pokemon> {

  return this.http
    .get<PokemonDetailResponse>(
      `${this.API_URL}/${name}`
    )
    .pipe(

      switchMap((pokemon) =>
        this.http
          .get<PokemonSpeciesResponse>(pokemon.species.url)
          .pipe(
            switchMap((species) =>
              this.http
                .get<EvolutionChainResponse>(species.evolution_chain.url)
                .pipe(
                  map((chain) => {
                    const { path, index } = this.buildEvolutionPath(chain.chain, pokemon.name);

                    return {
                      id: pokemon.id,
                      name: pokemon.name,
                      image: pokemon.sprites.front_default,
                      height: pokemon.height,
                      weight: pokemon.weight,
                      types: pokemon.types.map((type) => type.type.name),
                      baseExperience: pokemon.base_experience,
                      abilities: pokemon.abilities.map((a) => a.ability.name),
                      stats: pokemon.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
                      cry: `${this.CRY_BASE}/${pokemon.name}.mp3`,
                      evolutionChain: path,
                      evolutionStageIndex: index
                    };
                  })
                )
            )
          )
      ),

      catchError((err) => throwError(() => err)),

      shareReplay(1)

    );

}

  private buildEvolutionPath(
    chain: EvolutionChainLink,
    currentName: string
  ): { path: EvolutionStage[]; index: number } {
    const stageFromNode = (node: EvolutionChainLink): EvolutionStage => {
      const match = node.species.url.match(/pokemon-species\/(\d+)\//);
      return {
        id: match ? Number(match[1]) : 0,
        name: node.species.name,
        minLevel: node.evolution_details?.[0]?.min_level,
        trigger: node.evolution_details?.[0]?.trigger?.name
      };
    };

    const getFirstChain = (node: EvolutionChainLink | undefined): EvolutionStage[] => {
      if (!node) {
        return [];
      }
      const stage = stageFromNode(node);
      if (node.evolves_to.length === 0) {
        return [stage];
      }
      return [stage, ...getFirstChain(node.evolves_to[0])];
    };

    const findBranch = (node: EvolutionChainLink): EvolutionStage[] | null => {
      const currentStage = stageFromNode(node);

      if (node.species.name === currentName) {
        return [currentStage, ...getFirstChain(node.evolves_to[0])];
      }

      for (const next of node.evolves_to) {
        const childBranch = findBranch(next);
        if (childBranch) {
          return [currentStage, ...childBranch];
        }
      }

      return null;
    };

    const path = findBranch(chain) ?? [];
    const index = path.findIndex((stage) => stage.name === currentName);

    if (path.length > 0) {
      return { path, index: index >= 0 ? index : 0 };
    }

    const fallback: EvolutionStage[] = [];
    const collect = (node: EvolutionChainLink) => {
      fallback.push(stageFromNode(node));
      node.evolves_to.forEach((child) => collect(child));
    };
    collect(chain);
    const fallbackIndex = fallback.findIndex((stage) => stage.name === currentName);
    return { path: fallback, index: fallbackIndex >= 0 ? fallbackIndex : 0 };
  }

}