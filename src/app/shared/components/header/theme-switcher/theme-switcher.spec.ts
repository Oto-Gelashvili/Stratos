import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThemeSwitcher } from './theme-switcher';
import { DOCUMENT } from '@angular/common';

describe('ThemeSwitcher', () => {
  let component: ThemeSwitcher;
  let fixture: ComponentFixture<ThemeSwitcher>;
  let documentMock: Document;

  beforeEach(async () => {
    documentMock = document;

    await TestBed.configureTestingModule({
      imports: [ThemeSwitcher],
      providers: [{ provide: DOCUMENT, useValue: documentMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('disable-transitions');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set icon based on initial theme (dark)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const newFixture = TestBed.createComponent(ThemeSwitcher);
    const newComponent = newFixture.componentInstance;

    expect(newComponent['icon']).toBe('light_mode');
  });

  it('should set icon based on initial theme (light)', () => {
    document.documentElement.setAttribute('data-theme', 'light');

    const newFixture = TestBed.createComponent(ThemeSwitcher);
    const newComponent = newFixture.componentInstance;

    expect(newComponent['icon']).toBe('dark_mode');
  });

  it('should toggle theme from light to dark', () => {
    document.documentElement.setAttribute('data-theme', 'light');

    component.setTheme();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should toggle theme from dark to light', () => {
    document.documentElement.setAttribute('data-theme', 'dark');

    component.setTheme();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should update icon after toggling theme', () => {
    document.documentElement.setAttribute('data-theme', 'light');

    component.setTheme();

    expect(component['icon']).toBe('light_mode');
  });

  it('should store theme in localStorage', () => {
    document.documentElement.setAttribute('data-theme', 'light');

    component.setTheme();

    expect(localStorage.getItem('theme')).toBe('dark');
  });
});
