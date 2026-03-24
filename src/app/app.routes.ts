import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'lobby', pathMatch: 'full' },
  {
    path: 'lobby',
    loadComponent: () => import('./features/lobby/lobby').then((m) => m.Lobby),
  },
  { path: 'guide', loadComponent: () => import('./features/guide/guide').then((m) => m.Guide) },
  {
    path: 'heroes',
    loadComponent: () => import('./features/heroes/heroes').then((m) => m.Heroes),
  },
  { path: '**', redirectTo: 'lobby' },
];
