import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'event/:id',
    loadComponent: () =>
      import(
        './features/events/components/event-details/event-details.component'
      ).then((m) => m.EventDetailsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'events',
    loadComponent: () =>
      import(
        './features/events/components/event-list/event-list.component'
      ).then((m) => m.EventListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'create-event',
    loadComponent: () =>
      import(
        './features/events/components/event-create/event-create.component'
      ).then((m) => m.EventCreateComponent),
    canActivate: [authGuard],
  },
  {
    path: 'my-events',
    loadComponent: () =>
      import(
        './features/my-events/components/my-events-calendar/my-events-calendar.component'
      ).then((m) => m.MyEventsCalendarComponent),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
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
