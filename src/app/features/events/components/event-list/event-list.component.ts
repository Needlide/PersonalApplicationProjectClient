import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { Observable } from 'rxjs';
import { EventSummaryDto } from '../../../../shared/models/event/event-summary.dto';

@Component({
  selector: 'app-event-list',
  imports: [
    MatIconModule,
    AsyncPipe,
    MatCardModule,
    DatePipe,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
})
export class EventListComponent implements OnInit {
  private readonly eventService = inject(EventsService);

  loadingEvents = new Set<number>();
  events$!: Observable<EventSummaryDto[]>;

  ngOnInit(): void {
    this.refreshEvents();
  }

  joinEvent(id: number): void {
    if (this.loadingEvents.has(id)) {
      return;
    }
    this.loadingEvents.add(id);

    this.eventService.joinEvent(id).subscribe({
      next: () => {
        console.log(`Successfully joined event ${id}`);
        this.refreshEvents();

        this.loadingEvents.delete(id);
      },
      error: (err: Error) => {
        console.error(`Failed to join event ${id}:`, err.message);
        this.loadingEvents.delete(id);
      },
    });
  }

  private refreshEvents(): void {
    this.events$ = this.eventService.getAllEvents();
  }
}
