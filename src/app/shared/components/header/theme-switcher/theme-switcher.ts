import { Component, DOCUMENT, inject } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  imports: [],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
})
export class ThemeSwitcher {
  private readonly document = inject(DOCUMENT);
  protected icon: 'dark_mode' | 'light_mode' =
    this.document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'light_mode'
      : 'dark_mode';
  setTheme() {
    const html = this.document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.icon = newTheme === 'light' ? 'dark_mode' : 'light_mode';
    // disable stransition so whole document doesnt transit/ looks weird
    html.classList.add('disable-transitions');

    html.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);

    requestAnimationFrame(() => {
      html.classList.remove('disable-transitions');
    });
  }
}
