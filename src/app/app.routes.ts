import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/public-layout/public-layout').then((m) => m.PublicLayout),
    children: [
      { path: '', redirectTo: 'lobby', pathMatch: 'full' },
      {
        path: 'lobby',
        loadComponent: () => import('./features/lobby/lobby').then((m) => m.Lobby),
      },
      {
        path: 'guide',
        loadComponent: () => import('./features/guide/guide').then((m) => m.Guide),
      },
      {
        path: 'heroes',
        loadComponent: () => import('./features/heroes/heroes').then((m) => m.Heroes),
      },
      {
        path: 'profile',
        canMatch: [authGuard],
        loadComponent: () => import('./features/profile/profile').then((m) => m.Profile),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/auth-layout/auth-layout').then((m) => m.AuthLayout),
    children: [
      {
        path: 'auth',
        loadComponent: () => import('./features/sign-up/sign-up').then((m) => m.SignUp),
      },
    ],
  },
  { path: '**', redirectTo: 'lobby' },
];
