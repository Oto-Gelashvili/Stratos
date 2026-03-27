import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
} else if (systemDark) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
