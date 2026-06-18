export interface Pokemon {

    id: number;
    name: string;
    image: string;
    height: number;
    weight: number;
    types: string[];
    baseExperience: number;
    cry: string;

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