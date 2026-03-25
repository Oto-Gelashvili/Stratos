import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { NavigationService } from '../../../core/services/navigation';
import { Logo } from '../logo/logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, Logo],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private navService = inject(NavigationService);

  links = this.navService.links;
  activeLabel$ = this.navService.activeLabel$;
  hoveredLabel$ = new BehaviorSubject<string>('');
}
