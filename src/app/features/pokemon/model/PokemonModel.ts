export interface Pokemon {
    id: number;
    name: string;
    image: string;
    height: number;
    weight: number;
    types: string[];
    baseExperience: number;
    abilities: string[];
    stats: { name: string; value: number }[];
    /** URL to an audio file with the Pokémon cry */
    cry?: string;
    evolutionChain?: EvolutionStage[];
    evolutionStageIndex?: number;
}

export interface EvolutionStage {
    id: number;
    name: string;
    minLevel?: number;
    trigger?: string;
}

export interface PokemonResult {

    name: string;
    url: string;

}

export interface PokemonListResponse {

    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonResult[];

}

export interface PokemonDetailResponse {

    id: number;
    name: string;
    height: number;
    weight: number;
    base_experience: number;
    sprites: {
        front_default: string;
    };
    species: {
        name: string;
        url: string;
    };
    abilities: { ability: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    types: {
        type: {
            name: string;
        };
    }[];

}

export interface PokemonSpeciesResponse {
    evolution_chain: {
        url: string;
    };
}

export interface EvolutionDetail {
    min_level?: number;
    trigger: {
        name: string;
    };
}

export interface EvolutionChainLink {
    species: {
        name: string;
        url: string;
    };
    evolves_to: EvolutionChainLink[];
    evolution_details: EvolutionDetail[];
}

export interface EvolutionChainResponse {
    chain: EvolutionChainLink;
}