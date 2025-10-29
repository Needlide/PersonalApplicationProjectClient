import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Operation } from 'fast-json-patch';
import { EventSummaryDto } from '../../shared/models/event/event-summary.dto';
import { EventDetailsDto } from '../../shared/models/event/event-details.dto';
import { CreateEventRequestDto } from '../../shared/models/event/create-event-request.dto';
import { handleError } from '../../shared/handle-error';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private http = inject(HttpClient);
  private readonly rootUrl = 'http://localhost:5047';

  getAllEvents(): Observable<EventSummaryDto[]> {
    return this.http
      .get<EventSummaryDto[]>(`${this.rootUrl}/api/events`)
      .pipe(catchError(handleError));
  }

  getEventById(id: number): Observable<EventDetailsDto> {
    return this.http
      .get<EventDetailsDto>(`${this.rootUrl}/api/events/${id}`)
      .pipe(catchError(handleError));
  }

  createEvent(createEvent: CreateEventRequestDto): Observable<EventDetailsDto> {
    return this.http
      .post<EventDetailsDto>(`${this.rootUrl}/api/events`, createEvent)
      .pipe(catchError(handleError));
  }

  patchEvent(id: number, patchOperations: Operation[]): Observable<void> {
    return this.http
      .patch<void>(`${this.rootUrl}/api/events/${id}`, patchOperations)
      .pipe(catchError(handleError));
  }

  deleteEvent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.rootUrl}/api/events/${id}`)
      .pipe(catchError(handleError));
  }

  joinEvent(id: number): Observable<void> {
    return this.http
      .post<void>(`${this.rootUrl}/api/events/${id}/join`, null)
      .pipe(catchError(handleError));
  }

  leaveEvent(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.rootUrl}/api/events/${id}/join`)
      .pipe(catchError(handleError));
  }

  getMyEvents(): Observable<EventSummaryDto[]> {
    return this.http
      .get<EventSummaryDto[]>(`${this.rootUrl}/api/users/me/events`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([] as EventSummaryDto[]);
          }

          return handleError(error);
        })
      );
  }

  getMyOrganizedEvents(): Observable<EventDetailsDto[]> {
    return this.http
      .get<EventDetailsDto[]>(`${this.rootUrl}/api/users/me/organized`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([] as EventDetailsDto[]);
          }

          return handleError(error);
        })
      );
  }

  getMyParticipatingEvents(): Observable<EventDetailsDto[]> {
    return this.http
      .get<EventDetailsDto[]>(`${this.rootUrl}/api/users/me/participating`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([] as EventDetailsDto[]);
          }

          return handleError(error);
        })
      );
  }
}
