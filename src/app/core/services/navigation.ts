import { inject, Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);

  readonly links = [
    { label: 'Lobby', icon: 'swords', path: '/lobby' },
    { label: 'Guide', icon: 'help', path: '/guide' },
    { label: 'Heroes', icon: 'domino_mask', path: '/heroes' },
  ];

  activeLabel$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => {
      const url = (event as NavigationEnd).urlAfterRedirects;
      return this.links.find((link) => url.startsWith(link.path))?.label ?? '';
    }),
    startWith(''),
  );
}
