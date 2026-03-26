import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HamburgerMenu } from './hamburger-menu';
import { NavigationService } from '../../../../core/services/navigation';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('HamburgerMenu', () => {
  let component: HamburgerMenu;
  let fixture: ComponentFixture<HamburgerMenu>;

  const mockNavService = {
    links: [
      { label: 'Lobby', icon: 'swords', path: '/lobby' },
      { label: 'Guide', icon: 'help', path: '/guide' },
    ],
    activeLabel$: of('Lobby'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HamburgerMenu],
      providers: [{ provide: NavigationService, useValue: mockNavService }, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HamburgerMenu);
    component = fixture.componentInstance;
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

    menuIcon.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).toBeNull();
  });

  it('should NOT close the menu when clicking inside the menu content', () => {
    const menuIcon = fixture.debugElement.query(By.css('.menuSpan')).nativeElement;
    menuIcon.click();
    fixture.detectChanges();

    const menuList = fixture.debugElement.query(By.css('ul')).nativeElement;
    menuList.click();
    fixture.detectChanges();

    const menu = fixture.debugElement.query(By.css('.menu'));
    expect(menu).not.toBeNull();
  });
});
