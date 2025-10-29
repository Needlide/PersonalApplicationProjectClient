import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from, map } from 'rxjs';
import { EventDetailsDto } from '../../shared/models/event/event-details.dto';
import { EventSummaryDto } from '../../shared/models/event/event-summary.dto';
import { environment } from '../../../environments/environment';

export interface AssistantContext {
  myEvents: EventDetailsDto[];
  organizedEvents: EventDetailsDto[];
  publicEvents: EventSummaryDto[];
  currentDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AiAssistantService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(environment.AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  askQuestion(question: string, context: AssistantContext): Observable<string> {
    const prompt = this.buildPrompt(question, context);

    return from(this.model.generateContent(prompt)).pipe(
      map((result) => {
        const response = result.response;
        return response.text();
      })
    );
  }

  private buildPrompt(question: string, context: AssistantContext): string {
    return `You are an event management assistant. Answer the user's question based on the following data.

Current Date: ${context.currentDate}

Events I'm Attending (${context.myEvents.length}):
${this.formatDetailedEvents(context.myEvents)}

Events I Organize (${context.organizedEvents.length}):
${this.formatDetailedEvents(context.organizedEvents)}

Public Events Available (${context.publicEvents.length}):
${this.formatSummaryEvents(context.publicEvents)}

User Question: ${question}

Instructions:
- Provide a clear, concise answer based on the data above.
- For date-related questions, compare event dates with the current date.
- If the data doesn't contain relevant information, say so politely.
- Format lists in a readable way.
- For "this week" questions, only include events within the next 7 days.`;
  }

  private formatDetailedEvents(events: EventDetailsDto[]): string {
    if (events.length === 0) return '- None';

    return events
      .map(
        (e) =>
          `- "${e.name}"
   Date: ${new Date(e.eventTimestamp).toLocaleString()}
   Location: ${e.location || 'Not specified'}
   Organizer: ${e.organizer.firstName} ${e.organizer.lastName}
   Participants: ${e.participants?.length || 0}
   Tags: ${e.tags?.map((t) => t.name).join(', ') || 'none'}
   Description: ${e.description || 'No description'}`
      )
      .join('\n\n');
  }

  private formatSummaryEvents(events: EventSummaryDto[]): string {
    if (events.length === 0) return '- None';

    return events
      .map(
        (e) =>
          `- "${e.name}"
   Date: ${new Date(e.eventTimestamp).toLocaleString()}
   Location: Not specified
   Participants: ${e.participantCount || 0}
   Tags: ${e.tags?.map((t) => t.name).join(', ') || 'none'}
   Description: No description`
      )
      .join('\n\n');
  }
}
