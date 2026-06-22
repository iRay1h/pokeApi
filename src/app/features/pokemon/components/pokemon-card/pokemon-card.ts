import { Component, Input } from '@angular/core';
import { Pokemon } from '../../model/PokemonModel';

@Component({
  selector: 'app-pokemon-card',
  standalone: false,
  templateUrl: './pokemon-card.html',
  styleUrls: ['./pokemon-card.scss'],
})
export class PokemonCard {

  /**
   * Recibe el `Pokemon` a mostrar en la tarjeta. El componente solo
   * se encarga de presentar los datos (imagen, tipos, habilidades, stats).
   */
  @Input() pokemon!: Pokemon;

}