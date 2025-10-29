import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import {
  AiAssistantService,
  AssistantContext,
} from '../../core/services/ai-assistant.service';
import { AuthService } from '../../core/services/auth.service';
import { EventsService } from '../../core/services/events.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0)', opacity: 1 })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ transform: 'translateY(100%)', opacity: 0 })
        ),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class AiChatWidgetComponent {
  private aiService = inject(AiAssistantService);
  private eventsService = inject(EventsService);
  private authService = inject(AuthService);

  isOpen = signal(false);
  messages = signal<Message[]>([]);
  isLoading = signal(false);
  isLoadingContext = signal(true);
  questionControl = new FormControl('');
  context!: AssistantContext;

  toggleChat(): void {
    this.isOpen.update((v) => !v);

    if (this.isOpen() && this.messages().length === 0) {
      this.initializeChat();
    }
  }

  private initializeChat(): void {
    this.messages.set([
      {
        role: 'assistant',
        content:
          '👋 Hi! I can help you with your events. What would you like to know?',
        timestamp: new Date(),
      },
    ]);
    this.loadContext();
  }

  loadContext(): void {
    this.isLoadingContext.set(true);

    const currentUserId = this.authService.getCurrentUserId();

    if (!currentUserId) {
      console.error('User not authenticated');
      this.isLoadingContext.set(false);
      return;
    }

    forkJoin({
      myEvents: this.eventsService.getMyParticipatingEvents(),
      organizedEvents: this.eventsService.getMyOrganizedEvents(),
      publicEvents: this.eventsService.getAllEvents(),
    }).subscribe({
      next: (data) => {
        this.context = {
          myEvents: data.myEvents,
          organizedEvents: data.organizedEvents,
          publicEvents: data.publicEvents,
          currentDate: new Date().toISOString(),
        };
        this.isLoadingContext.set(false);
      },
      error: (err) => {
        console.error('Failed to load context:', err);
        this.isLoadingContext.set(false);
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content:
              'Sorry, I had trouble loading your event data. Please try again.',
            timestamp: new Date(),
          },
        ]);
      },
    });
  }

  sendQuestion(): void {
    const question = this.questionControl.value?.trim();
    if (!question || this.isLoading() || this.isLoadingContext()) return;

    this.messages.update((msgs) => [
      ...msgs,
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
      },
    ]);

    this.isLoading.set(true);
    this.questionControl.setValue('');

    this.aiService.askQuestion(question, this.context).subscribe({
      next: (answer) => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          },
        ]);
        this.isLoading.set(false);
        console.error('AI Error:', err);
      },
    });
  }

  askPredefined(question: string): void {
    this.questionControl.setValue(question);
    this.sendQuestion();
  }
}
