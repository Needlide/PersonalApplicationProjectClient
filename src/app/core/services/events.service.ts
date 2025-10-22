import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Operation } from 'fast-json-patch';
import { EventSummaryDto } from '../../shared/models/event/event-summary.dto';
import { EventDetailsDto } from '../../shared/models/event/event-details.dto';
import { CreateEventRequestDto } from '../../shared/models/event/create-event-request.dto';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private readonly rootUrl = 'http://localhost:8080';

  getAllEvents(): Observable<EventSummaryDto[]> {
    return this.http
      .get<EventSummaryDto[]>(`${this.rootUrl}/api/events`)
      .pipe(catchError(this.handleError));
  }

  getEventById(id: number): Observable<EventDetailsDto> {
    return this.http
      .get<EventDetailsDto>(`${this.rootUrl}/api/events/${id}`)
      .pipe(catchError(this.handleError));
  }

  createEvent(createEvent: CreateEventRequestDto): Observable<EventDetailsDto> {
    return this.http
      .post<EventDetailsDto>(`${this.rootUrl}/api/events`, createEvent)
      .pipe(catchError(this.handleError));
  }

  patchEvent(id: number, patchOperations: Operation[]): Observable<void> {
    return this.http
      .patch<void>(`${this.rootUrl}/api/events/${id}`, patchOperations)
      .pipe(catchError(this.handleError));
  }

  deleteEvent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.rootUrl}/api/events/${id}`)
      .pipe(catchError(this.handleError));
  }

  joinEvent(id: number): Observable<void> {
    return this.http
      .post<void>(`${this.rootUrl}/api/events/${id}/join`, null)
      .pipe(catchError(this.handleError));
  }

  leaveEvent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.rootUrl}/api/events/${id}/join`)
      .pipe(catchError(this.handleError));
  }

  getMyEvents(): Observable<EventDetailsDto[]> {
    return this.http
      .get<EventDetailsDto[]>(`${this.rootUrl}/api/events/me`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([] as EventDetailsDto[]);
          }

          return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
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
}
