import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/PokemonModel';

@Component({
  selector: 'app-pokemon-card',
  standalone: false,
  templateUrl: './pokemon-card.html',
  styleUrls: ['./pokemon-card.scss'],
})
export class PokemonCard {

  @Input() pokemon!: Pokemon;

}
