import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { NavigationService } from './navigation';
import { Component } from '@angular/core';

// Blank component just to satisfy the router — tests don't care what renders
@Component({ standalone: true, template: '' })
class BlankComponent {}

describe('NavigationService', () => {
  let service: NavigationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'lobby', component: BlankComponent },
          { path: 'guide', component: BlankComponent },
          { path: 'heroes', component: BlankComponent },
          { path: '**', component: BlankComponent }, // catches /unknown
        ]),
      ],
    });

    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose 3 links', () => {
    expect(service.links.length).toBe(3);
  });

  it('should have correct paths', () => {
    const paths = service.links.map((l) => l.path);
    expect(paths).toContain('/lobby');
    expect(paths).toContain('/guide');
    expect(paths).toContain('/heroes');
  });

  it('should emit empty string initially', () => {
    let result: string | undefined;
    service.activeLabel$.subscribe((label) => (result = label));
    expect(result).toBe('');
  });

  it('should emit correct label after navigating to /lobby', async () => {
    let result: string | undefined;
    service.activeLabel$.subscribe((label) => (result = label));

    await router.navigate(['/lobby']);

    expect(result).toBe('Lobby');
  });

  it('should emit correct label after navigating to /guide', async () => {
    let result: string | undefined;
    service.activeLabel$.subscribe((label) => (result = label));

    await router.navigate(['/guide']);

    expect(result).toBe('Guide');
  });

  it('should emit empty string for unknown route', async () => {
    let result: string | undefined;
    service.activeLabel$.subscribe((label) => (result = label));

    await router.navigate(['/unknown']);

    expect(result).toBe('');
  });
});
