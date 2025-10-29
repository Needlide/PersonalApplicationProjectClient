import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  console.error('API Error:', error);

  let userMessage = 'An unknown error occurred. Please try again.';

  if (error.error && typeof error.error.detail === 'string') {
    userMessage = error.error.detail;
  } else if (error.error && typeof error.error.message === 'string') {
    userMessage = error.error.message;
  } else if (typeof error.error === 'string') {
    userMessage = error.error;
  }

  return throwError(() => new Error(userMessage));
}
