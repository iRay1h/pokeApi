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
