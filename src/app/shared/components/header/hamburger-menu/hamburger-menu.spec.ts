import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HamburgerMenu } from './hamburger-menu';
import { NavigationService } from '../../../../core/services/navigation';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('HamburgerMenu', () => {
  let component: HamburgerMenu;
  let fixture: ComponentFixture<HamburgerMenu>;
  let supabaseService: any;
  let router: Router;

  const mockNavService = {
    links: [
      { label: 'Lobby', icon: 'swords', path: '/lobby' },
      { label: 'Guide', icon: 'help', path: '/guide' },
    ],
    activeLabel$: of('Lobby'),
  };

  const mockSupabaseService = {
    vm$: of({
      user: { id: '123' },
      username: 'TestUser',
      loading: false,
      avatarUrl: 'http://example.com/avatar.png',
    }),
    signOut: vi.fn(() => of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburgerMenu],
      providers: [
        { provide: NavigationService, useValue: mockNavService },
        { provide: SupabaseService, useValue: mockSupabaseService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburgerMenu);
    component = fixture.componentInstance;
    supabaseService = TestBed.inject(SupabaseService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show the menu by default', () => {
    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).toBeNull();
  });

  it('should toggle the menu when the menu icon is clicked', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;

    menuIcon.click();
    fixture.detectChanges();
    let menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).not.toBeNull();

    menuIcon.click();
    fixture.detectChanges();
    menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).toBeNull();
  });

  it('should close the menu when clicking outside', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const outsideClick = new MouseEvent('click', { bubbles: true, cancelable: true });
    Object.defineProperty(outsideClick, 'target', { value: document.body, enumerable: true });

    document.dispatchEvent(outsideClick);
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).toBeNull();
  });

  it('should NOT close the menu when clicking inside the menu content', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const menuList = fixture.debugElement.query(By.css('ul')).nativeElement;
    menuList.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).not.toBeNull();
  });

  it('should render user information when logged in', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const username = fixture.debugElement.query(By.css('.username')).nativeElement;
    const avatar = fixture.debugElement.query(By.css('img.avatar')).nativeElement;

    expect(username.textContent).toContain('TestUser');
    expect(avatar.getAttribute('src')).toBe('http://example.com/avatar.png');
  });

  it('should show guest and register button when logged out', () => {
    component.vm$ = of({
      user: null,
      username: undefined,
      loading: false,
      avatarUrl: null,
    });

    fixture.detectChanges();

    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const username = fixture.debugElement.query(By.css('.username')).nativeElement;
    expect(username.textContent).toContain('Guest');

    const registerBtn = fixture.debugElement.query(By.css('.signLink'));
    expect(registerBtn).not.toBeNull();
  });

  it('should call signOut and navigate on logout click', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const logoutBtn = fixture.debugElement.query(By.css('.signBtn')).nativeElement;
    logoutBtn.click();

    expect(supabaseService.signOut).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/lobby']);
  });

  it('should render navigation links from service', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const linkTextNodes = fixture.debugElement.queryAll(By.css('li a p'));
    const labels = linkTextNodes.map((el) => el.nativeElement.textContent.trim());

    expect(labels).toContain('Lobby');
    expect(labels).toContain('Guide');
  });
});
