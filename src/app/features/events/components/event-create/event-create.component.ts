import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../../../core/services/events.service';
import { CreateEventRequestDto } from '../../../../shared/models/event/create-event-request.dto';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-event-create',
  imports: [
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.scss',
})
export class EventCreateComponent {
  private readonly eventService = inject(EventsService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  createEventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    eventTimestamp: [null, [Validators.required]],
    location: [''],
    capacity: [null],
    visibility: [''],
  });

  isLoading = false;

  onSubmit(): void {
    if (this.createEventForm.invalid) {
      return;
    }

    this.isLoading = true;

    const request = this.createEventForm.value as CreateEventRequestDto;

    this.eventService.createEvent(request).subscribe({
      next: (createdEvent) => {
        this.isLoading = false;
        this.router.navigate(['/events', createdEvent.id]);
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
