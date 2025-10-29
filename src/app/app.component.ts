import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChatWidgetComponent } from './features/ai-assistant/ai-assistant.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AiChatWidgetComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PersonalApplicationProjectClient';
}
