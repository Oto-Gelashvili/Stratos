import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from './header';
import { NavigationService } from '../../../core/services/navigation';
import { BehaviorSubject, of } from 'rxjs';

const mockNavigationService = {
  links: [
    { label: 'Lobby', icon: 'swords', path: '/lobby' },
    { label: 'Guide', icon: 'help', path: '/guide' },
    { label: 'Heroes', icon: 'domino_mask', path: '/heroes' },
  ],
  activeLabel$: new BehaviorSubject<string>(''),
};

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let nativeEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: NavigationService, useValue: mockNavigationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;

    mockNavigationService.activeLabel$.next('');

    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all nav links', () => {
    const links = nativeEl.querySelectorAll('nav a');
    expect(links.length).toBe(3);
  });

  it('should render correct link labels', () => {
    const paragraphs = nativeEl.querySelectorAll('nav a p');
    const labels = Array.from(paragraphs).map((p) => p.textContent?.trim());
    expect(labels).toContain('Lobby');
    expect(labels).toContain('Guide');
    expect(labels).toContain('Heroes');
  });

  it('should set hoveredLabel$ when mouse enters a link', () => {
    const firstLink = nativeEl.querySelectorAll('nav a')[0] as HTMLElement;
    firstLink.dispatchEvent(new MouseEvent('mouseenter'));
    expect(component.hoveredLabel$.getValue()).toBe('Lobby');
  });

  it('should clear hoveredLabel$ when mouse leaves a link', () => {
    const firstLink = nativeEl.querySelectorAll('nav a')[0] as HTMLElement;
    firstLink.dispatchEvent(new MouseEvent('mouseenter'));
    firstLink.dispatchEvent(new MouseEvent('mouseleave'));
    expect(component.hoveredLabel$.getValue()).toBe('');
  });

  it('should show label as visible when link is hovered', async () => {
    const firstLink = nativeEl.querySelectorAll('nav a')[0] as HTMLElement;
    firstLink.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();

    const label = firstLink.querySelector('p');
    expect(label?.classList.contains('visible')).toBe(true);
  });

  it('should show label as visible when link is active', async () => {
    mockNavigationService.activeLabel$.next('Guide');
    fixture.detectChanges();
    await fixture.whenStable();

    const links = nativeEl.querySelectorAll('nav a');
    const guideLabel = links[1].querySelector('p');
    expect(guideLabel?.classList.contains('visible')).toBe(true);
  });

  it('should not show label as visible when link is neither hovered nor active', async () => {
    mockNavigationService.activeLabel$.next('');
    fixture.detectChanges();
    await fixture.whenStable();

    const firstLabel = nativeEl.querySelector('nav a p');
    expect(firstLabel?.classList.contains('visible')).toBe(false);
  });
});
