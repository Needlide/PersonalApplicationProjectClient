import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('/auth/')
      ) {
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            const newReq = req.clone({
              headers: req.headers.set(
                'Authorization',
                `Bearer ${response.token}`
              ),
            });

            return next(newReq);
          }),
          catchError(() => {
            authService.logout();

            router.navigate(['/auth/login'], {
              queryParams: { sessionExpired: 'true' },
            });

            return throwError(
              () => new Error('Your session has expired. Please log in again.')
            );
          })
        );
      }

      return throwError(() => error);
    })
  );
};
