import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { LogoPokedexComponent } from '../LogoPokedex/LogoPokedex.component';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './AppHeader.component.html',
  styleUrls: ['./AppHeader.component.scss'],
  imports: [CommonModule, LogoPokedexComponent],
})
export class AppHeaderComponent {
  screenWidth: number = window.innerWidth;
  prevScreenWidth: number = window.innerWidth;

  minWidth: number = 106;
  maxWidth: number = 192;

  logoWidth: number = this.maxWidth;

  constructor() {
    this.updateLogoWidth();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.prevScreenWidth = this.screenWidth;

    if (event.target instanceof Window) {
      this.screenWidth = event.target.innerWidth;
    }

    this.updateLogoWidth();
  }

  updateLogoWidth() {
    this.logoWidth = Math.max(this.minWidth, Math.min(this.maxWidth, (this.screenWidth / 2) * 0.4));
  }
}
