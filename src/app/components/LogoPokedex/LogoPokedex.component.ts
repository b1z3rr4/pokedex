import { Component, Input, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-logo',
  templateUrl: './LogoPokedex.component.html',
  styleUrls: ['./LogoPokedex.component.scss'],
})
export class LogoPokedexComponent implements OnInit {
  @Input() width = 495;
  @Input() height = 152;

  constructor() {}

  ngOnInit() {
    const width = 495;
    const height = 152;
    const aspectRatioOriginal = width / height;

    const newWidth = this.width;
    const newHeight = this.height;
    const aspectRatioSent = newWidth / newHeight;

    if (aspectRatioSent !== aspectRatioOriginal) {
      const adjustedHeight = newWidth / aspectRatioOriginal;
      this.height = adjustedHeight;
    }
  }
}
