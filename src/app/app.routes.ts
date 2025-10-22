import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'events',
    loadChildren: () =>
      import('./features/events/events.module').then((m) => m.EventsModule),
    canActivate: [authGuard],
  },
  {
    path: 'my-events',
    loadChildren: () =>
      import('./features/my-events/my-events.module').then(
        (m) => m.MyEventsModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/events',
  },
];
