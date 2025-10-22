import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { EventsService } from '../../../../core/services/events.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, DatePipe } from '@angular/common';
import { catchError, Observable, of, switchMap, take, tap } from 'rxjs';
import { EventDetailsDto } from '../../../../shared/models/event/event-details.dto';
import { AuthService } from '../../../../core/services/auth.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Operation } from 'fast-json-patch/module/core';
import { compare } from 'fast-json-patch/module/duplex';
import { UpdateEventRequestDto } from '../../../../shared/models/event/update-event-request.dto';

@Component({
  selector: 'app-event-details',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatIconModule,
    DatePipe,
    AsyncPipe,
    MatDialogModule,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
})
export class EventDetailsComponent implements OnInit {
  private readonly eventService = inject(EventsService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  event$!: Observable<EventDetailsDto | null>;

  isEditing = false;
  isOrganizer = false;
  isLoading = false;
  private originalEditableEvent!: UpdateEventRequestDto;
  private eventId?: number;

  editEventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    eventTimestamp: [null as Date | null, [Validators.required]],
    location: [''],
    capacity: [null as number | null],
  });

  ngOnInit(): void {
    this.event$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const idString = params.get('id');
        if (!idString) {
          this.router.navigate(['/events']);
          throw new Error('Event ID not found in route.');
        }

        const id = Number(idString);
        this.eventId = id;

        return this.eventService.getEventById(id);
      }),
      tap((event) => {
        this.authService.currentUser$.subscribe((user) => {
          this.isOrganizer = user?.id === event.organizer.id;
        });

        this.originalEditableEvent = {
          name: event.name,
          description: event.description,
          eventTimestamp: event.eventTimestamp,
          location: event.location,
          capacity: event.capacity,
          visible: event.visible,
        };

        this.editEventForm.patchValue({
          name: this.originalEditableEvent.name,
          description: this.originalEditableEvent.description,
          eventTimestamp: new Date(this.originalEditableEvent.eventTimestamp),
          location: this.originalEditableEvent.location,
          capacity: this.originalEditableEvent.capacity,
        });
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.event$.pipe(take(1)).subscribe((event) => {
        if (event)
          this.editEventForm.patchValue({
            name: event.name,
            description: event.description,
            eventTimestamp: event.eventTimestamp,
            location: event.location,
            capacity: event.capacity,
          });
      });
    }
  }

  onSubmit(): void {
    if (
      !this.eventId ||
      !this.editEventForm.dirty ||
      this.editEventForm.invalid
    ) {
      return;
    }

    console.log('Submitting form for event ID:', this.eventId);
    console.log('Form value:', this.editEventForm.value);

    this.isLoading = true;

    const updatedEventDto = this.editEventForm.value as UpdateEventRequestDto;

    const patchOperations: Operation[] = compare(
      this.originalEditableEvent,
      updatedEventDto
    );

    if (patchOperations.length === 0) {
      this.isEditing = false;
      this.isLoading = false;
      return;
    }

    console.log('Generated Patch Document:', patchOperations);

    this.eventService.patchEvent(this.eventId, patchOperations).subscribe({
      next: () => {
        this.isLoading = false;
        this.isEditing = false;

        this.event$ = this.route.paramMap.pipe(
          switchMap((params) => {
            const idString = params.get('id');
            if (!idString) {
              this.router.navigate(['/events']);
              throw new Error('Event ID not found in route.');
            }

            const id = Number(idString);
            this.eventId = id;

            return this.eventService.getEventById(id);
          }),
          catchError(() => {
            return of(null);
          })
        );
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open<
      ConfirmationDialogComponent,
      ConfirmationDialogData
    >(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete the event? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log('User confirmed deletion. Deleting event...');
        this.deleteEvent();
      }
    });
  }

  private deleteEvent(): void {
    if (!this.eventId) return;

    this.isLoading = true;
    this.eventService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/events']);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
