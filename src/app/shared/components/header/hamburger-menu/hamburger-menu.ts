import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { filter, fromEvent, map, merge, Observable, scan, startWith, Subject } from 'rxjs';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../../../../core/services/navigation';
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-hamburger-menu',
  imports: [AsyncPipe, RouterLink, RouterLinkActive, ThemeSwitcher],
  templateUrl: './hamburger-menu.html',
  styleUrl: './hamburger-menu.css',
})
export class HamburgerMenu {
  private readonly elementRef = inject(ElementRef);
  protected readonly navService = inject(NavigationService);
  private readonly supabase = inject(SupabaseService);
  vm$ = this.supabase.vm$;
  private readonly documentClick$ = fromEvent<MouseEvent>(document, 'click');

  protected readonly isMenuShown$ = this.documentClick$.pipe(
    map((event) => {
      const clickedInside = this.elementRef.nativeElement.contains(event.target);
      const isMenuIcon = (event.target as HTMLElement).classList.contains('menuSpan');

      if (isMenuIcon) return 'toggle';
      if (!clickedInside) return 'close';
      return 'nothing';
    }),
    scan((state, action) => {
      if (action === 'toggle') return !state;
      if (action === 'close') return false;
      return state;
    }, false),
    startWith(false),
  );
}
