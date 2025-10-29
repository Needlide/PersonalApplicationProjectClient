// import {
//   Component,
//   ElementRef,
//   inject,
//   OnInit,
//   ViewChild,
// } from '@angular/core';
// import {
//   FormBuilder,
//   FormControl,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { EventsService } from '../../../../core/services/events.service';
// import { CreateEventRequestDto } from '../../../../shared/models/event/create-event-request.dto';
// import { MatCardModule } from '@angular/material/card';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatInputModule } from '@angular/material/input';
// import { TagService } from '../../../../core/services/tag.service';
// import { LiveAnnouncer } from '@angular/cdk/a11y';
// import { combineLatest, map, Observable, startWith } from 'rxjs';
// import { TagDto } from '../../../../shared/models/tag/tag.dto';
// import {
//   MatAutocompleteSelectedEvent,
//   MatAutocompleteModule,
// } from '@angular/material/autocomplete';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { AsyncPipe } from '@angular/common';
// import { COMMA, ENTER } from '@angular/cdk/keycodes';

// @Component({
//   selector: 'app-event-create',
//   imports: [
//     MatCardModule,
//     MatButtonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatRadioModule,
//     MatDatepickerModule,
//     MatNativeDateModule,
//     MatInputModule,
//     MatAutocompleteModule,
//     MatChipsModule,
//     MatIconModule,
//     AsyncPipe,
//   ],
//   templateUrl: './event-create.component.html',
//   styleUrl: './event-create.component.scss',
// })
// export class EventCreateComponent implements OnInit {
//   private readonly eventService = inject(EventsService);
//   private readonly fb = inject(FormBuilder);
//   private readonly router = inject(Router);

//   private readonly tagsService = inject(TagService);
//   private readonly announcer = inject(LiveAnnouncer);

//   allTags$!: Observable<TagDto[]>;
//   filteredTags$!: Observable<TagDto[]>;

//   selectedTags: TagDto[] = [];
//   tagInputControl = new FormControl<string | TagDto | null>('');

//   @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

//   readonly separatorKeysCodes = [ENTER, COMMA] as const;

//   ngOnInit(): void {
//     this.allTags$ = this.tagsService.getAllTags();

//     const tagInputValue$ = this.tagInputControl.valueChanges.pipe(
//       startWith('')
//     );

//     this.filteredTags$ = combineLatest([this.allTags$, tagInputValue$]).pipe(
//       map(([allTags, filterValue]) => {
//         const filterString = typeof filterValue === 'string' ? filterValue : '';

//         const filterText = filterString.toLowerCase();

//         return allTags.filter(
//           (tag) =>
//             !this.selectedTags.some((selected) => selected.name === tag.name) &&
//             tag.name.toLowerCase().includes(filterText)
//         );
//       })
//     );
//   }

//   createEventForm = this.fb.group({
//     name: ['', [Validators.required, Validators.maxLength(255)]],
//     description: ['', [Validators.maxLength(255)]],
//     eventTimestamp: [null, [Validators.required]],
//     location: [''],
//     capacity: [null],
//     visibility: [''],
//     tags: [[] as TagDto[]],
//   });

//   isLoading = false;

//   selected(event: MatAutocompleteSelectedEvent): void {
//     const tagToAdd = event.option.value as TagDto;

//     if (!this.selectedTags.some((t) => t.name === tagToAdd.name)) {
//       this.selectedTags.push(tagToAdd);
//     }

//     this.createEventForm.get('tags')?.setValue(this.selectedTags);

//     this.tagInput.nativeElement.value = '';

//     this.tagInputControl.setValue('');
//   }

//   removeTag(tagToRemove: TagDto): void {
//     this.selectedTags = this.selectedTags.filter(
//       (tag) => tag.name !== tagToRemove.name
//     );
//     this.createEventForm.get('tags')?.setValue(this.selectedTags);
//     this.announcer.announce(`Removed ${tagToRemove.name}`);

//     this.tagInputControl.setValue(this.tagInputControl.value);
//   }

//   onSubmit(): void {
//     if (this.createEventForm.invalid) {
//       return;
//     }

//     this.isLoading = true;

//     const request = this.createEventForm.value as CreateEventRequestDto;

//     this.eventService.createEvent(request).subscribe({
//       next: (createdEvent) => {
//         this.isLoading = false;
//         this.router.navigate(['/events', createdEvent.id]);
//       },
//       error: () => {
//         this.isLoading = false;
//       },
//     });
//   }
// }

import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { TagService } from '../../../../core/services/tag.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { TagDto } from '../../../../shared/models/tag/tag.dto';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

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
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    AsyncPipe,
  ],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.scss',
})
export class EventCreateComponent implements OnInit {
  private readonly eventService = inject(EventsService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly tagsService = inject(TagService);
  private readonly announcer = inject(LiveAnnouncer);

  allTags$!: Observable<TagDto[]>;
  filteredTags$!: Observable<TagDto[]>;

  selectedTags: TagDto[] = [];
  tagInputControl = new FormControl<string | TagDto | null>('');

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  ngOnInit(): void {
    this.allTags$ = this.tagsService.getAllTags();

    const tagInputValue$ = this.tagInputControl.valueChanges.pipe(
      startWith('')
    );

    this.filteredTags$ = combineLatest([this.allTags$, tagInputValue$]).pipe(
      map(([allTags, filterValue]) => {
        const filterString = typeof filterValue === 'string' ? filterValue : '';
        const filterText = filterString.toLowerCase().trim();

        // Don't show suggestions if input is empty
        if (!filterText) {
          return [];
        }

        return allTags.filter(
          (tag) =>
            !this.selectedTags.some((selected) => selected.name === tag.name) &&
            tag.name.toLowerCase().includes(filterText)
        );
      })
    );
  }

  createEventForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    eventTimestamp: [null, [Validators.required]],
    location: [''],
    capacity: [null],
    visibility: [''],
    tags: [[] as TagDto[]],
  });

  isLoading = false;

  /**
   * Called when user selects a tag from autocomplete
   */
  selected(event: MatAutocompleteSelectedEvent): void {
    const tagToAdd = event.option.value as TagDto;
    this.addTag(tagToAdd);
    this.clearTagInput();
  }

  /**
   * Called when user presses Enter, comma, or when input loses focus
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (!value) {
      return;
    }

    // Create a new tag
    const newTag: TagDto = { name: value.toLowerCase() };
    this.addTag(newTag);

    // Clear input
    event.chipInput!.clear();
    this.tagInputControl.setValue('');
  }

  /**
   * Helper method to add a tag to selected tags
   */
  private addTag(tag: TagDto): void {
    // Normalize the tag name
    const normalizedName = tag.name.toLowerCase().trim();

    // Check if tag already exists (case-insensitive)
    if (
      this.selectedTags.some((t) => t.name.toLowerCase() === normalizedName)
    ) {
      this.announcer.announce(`${tag.name} is already added`);
      return;
    }

    // Add the tag
    this.selectedTags.push({ name: normalizedName });
    this.createEventForm.get('tags')?.setValue(this.selectedTags);
    this.announcer.announce(`Added ${normalizedName}`);
  }

  /**
   * Remove a tag from selected tags
   */
  removeTag(tagToRemove: TagDto): void {
    this.selectedTags = this.selectedTags.filter(
      (tag) => tag.name !== tagToRemove.name
    );
    this.createEventForm.get('tags')?.setValue(this.selectedTags);
    this.announcer.announce(`Removed ${tagToRemove.name}`);

    // Trigger filtering update
    this.tagInputControl.setValue(this.tagInputControl.value);
  }

  /**
   * Clear the tag input field
   */
  private clearTagInput(): void {
    this.tagInput.nativeElement.value = '';
    this.tagInputControl.setValue('');
  }

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
