import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CalendarEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { Observable, map } from 'rxjs';
import { EventDetailsDto } from '../../../../shared/models/event/event-details.dto';
import { EventsService } from '../../../../core/services/events.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-events-calendar',
  imports: [CommonModule, CalendarModule, RouterLink],
  templateUrl: './my-events-calendar.component.html',
  styleUrls: ['./my-events-calendar.component.scss'],
})
export class MyEventsCalendarComponent implements OnInit {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  calendarEvents$!: Observable<CalendarEvent<{ event: EventDetailsDto }>[]>;

  eventService = inject(EventsService);
  router = inject(Router);

  ngOnInit(): void {
    this.fetchAndMapEvents();
  }

  fetchAndMapEvents(): void {
    this.calendarEvents$ = this.eventService.getMyEvents().pipe(
      map((apiEvents: EventDetailsDto[]) => {
        return apiEvents.map((apiEvent) => {
          return {
            title: `${apiEvent.name} (${this.formatTime(
              apiEvent.eventTimestamp
            )})`,
            start: new Date(apiEvent.eventTimestamp),
            meta: {
              event: apiEvent,
            },
            color: { primary: '#1e90ff', secondary: '#D1E8FF' },
          };
        });
      })
    );
  }

  private formatTime(dateString: string | Date): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  eventClicked({
    event,
  }: {
    event: CalendarEvent<{ event: EventDetailsDto }>;
  }): void {
    const eventId = event.meta?.event.id;
    this.router.navigate(['/event', eventId]);
  }
}
