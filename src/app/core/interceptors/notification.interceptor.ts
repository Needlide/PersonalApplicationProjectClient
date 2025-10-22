import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

export function notificationInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap((event: HttpEvent<any>) => {
      if (
        event instanceof HttpResponse &&
        event.status >= 200 &&
        event.status < 300
      ) {
        if (req.method === 'GET') {
          return;
        }

        let successMessage = 'Operation successful!';
        if (req.method === 'POST') {
          successMessage = 'Item created successfully!';
        } else if (req.method === 'PUT' || req.method === 'PATCH') {
          successMessage = 'Item updated successfully!';
        } else if (req.method === 'DELETE') {
          successMessage = 'Item deleted successfully!';
        }

        notificationService.showSuccess(successMessage);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred.';

      if (error.error && typeof error.error.detail === 'string') {
        errorMessage = error.error.detail;
      } else if (error.error && typeof error.error.message === 'string') {
        errorMessage = error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.statusText) {
        errorMessage = `Error: ${error.statusText}`;
      }

      notificationService.showError(errorMessage);

      return throwError(() => error);
    })
  );
}
