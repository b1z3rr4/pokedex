import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Type } from '../../../infra/models/PokemonDetails';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-PokemonCard',
  templateUrl: './PokemonCard.component.html',
  styleUrls: ['./PokemonCard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class PokemonCardComponent implements OnInit {
  @Input() id: number = 0;
  @Input() name: string = '';
  @Input() imageUrl: string = '';
  @Input() number: string = "000";
  @Input() description: string = '';
  @Input() types: Array<Type> = [];

  constructor() { }

  ngOnInit() {
    this.number = this.number.toString().padStart(3, "0");
  }

}
