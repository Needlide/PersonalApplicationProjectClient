import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Guard is working');
  console.log(authService.isLoggedIn());

  if (authService.isLoggedIn()) {
    return true;
  }

  console.log('Guard redirects to login');

  router.navigate(['/auth/login']);
  return false;
};
