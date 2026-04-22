import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  // Login / registration: protams galvenā main lapa
  { path: '', component: MainPage, title: 'Pieteikšanās' },
  // Events page - seit man ir cels useriem pec loginas
  {
    path: 'events',
    loadComponent: () => import('./events/events').then((m) => m.Events),
    title: 'Pasākumi',
    canActivate: [authGuard],
  },
  // Admin panel - seit tikai admins tiek ieksha (admin@gmail.com) te es taisishu eventus...
  {
    path: 'admin',
    loadComponent: () => import('./events-admin/events-admin').then((m) => m.EventsAdmin),
    title: 'Admin panelis',
    canActivate: [adminGuard],
  },
  // Catch-all: šeit ja ieraksta users mulkibas url aiziet uz main page
  { path: '**', redirectTo: '' },
];
