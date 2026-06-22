import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  isPlaying = false;

  @ViewChild('cryPlayer') cryPlayer?: ElementRef<HTMLAudioElement>;

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
        this.isPlaying = false;
        if (this.cryPlayer?.nativeElement) {
          this.cryPlayer.nativeElement.pause();
          this.cryPlayer.nativeElement.currentTime = 0;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  playCry(): void {
    if (!this.pokemon || !this.cryPlayer) {
      return;
    }

    const audio = this.cryPlayer.nativeElement;
    if (this.isPlaying) {
      audio.pause();
      this.isPlaying = false;
    } else {
      audio.play();
      this.isPlaying = true;
    }
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

  getEvolutionStatus(): string {
    if (!this.pokemon?.evolutionChain || this.pokemon.evolutionStageIndex === undefined) {
      return 'Sin datos de evolución';
    }

    const stage = this.pokemon.evolutionStageIndex + 1;
    const total = this.pokemon.evolutionChain.length;
    if (stage === 1) {
      return 'Etapa inicial';
    }
    if (stage === total) {
      return 'Etapa final';
    }
    return `Etapa intermedia (${stage}/${total})`;
  }
}
