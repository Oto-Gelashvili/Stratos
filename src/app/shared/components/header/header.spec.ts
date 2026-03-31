import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from './header';
import { NavigationService } from '../../../core/services/navigation';
import { SupabaseService } from '../../../core/services/supabase.service';
import { BehaviorSubject } from 'rxjs';

const mockNavigationService = {
  links: [
    { label: 'Lobby', icon: 'swords', path: '/lobby' },
    { label: 'Guide', icon: 'help', path: '/guide' },
    { label: 'Heroes', icon: 'domino_mask', path: '/heroes' },
  ],
  activeLabel$: new BehaviorSubject<string>(''),
};

const mockSupabaseService = {
  vm$: new BehaviorSubject<any>(null),
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
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    nativeEl = fixture.nativeElement;

    mockNavigationService.activeLabel$.next('');

    await fixture.whenStable();
    fixture.detectChanges();
  });

  beforeEach(() => {
    mockSupabaseService.vm$.next(null);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show Register when user is not logged in', () => {
    mockSupabaseService.vm$.next({ user: null });
    fixture.detectChanges();

    const btn = nativeEl.querySelector('.authBtn');
    expect(btn).toBeTruthy();
  });

  it('should show skeleton when loading', () => {
    mockSupabaseService.vm$.next({
      user: { id: '1' },
      loading: true,
    });
    fixture.detectChanges();

    const skeleton = nativeEl.querySelector('.skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should show fallback avatar when no avatarUrl', () => {
    mockSupabaseService.vm$.next({
      user: { id: '1' },
      loading: false,
      avatarUrl: null,
      username: 'Oto',
    });
    fixture.detectChanges();

    const avatarText = nativeEl.querySelector('.avatar p');
    expect(avatarText?.textContent).toBe('O');
  });

  it('should show avatar image when avatarUrl exists', () => {
    mockSupabaseService.vm$.next({
      user: { id: '1' },
      loading: false,
      avatarUrl: 'test.jpg',
    });
    fixture.detectChanges();

    const img = nativeEl.querySelector('img.avatar');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('test.jpg');
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
});
