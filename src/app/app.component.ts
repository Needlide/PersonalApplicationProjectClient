import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AiChatWidgetComponent } from './features/ai-assistant/ai-assistant.component';
import { HeaderComponent } from './features/header/header.component';
import { UserStore } from './core/store/user.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AiChatWidgetComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'PersonalApplicationProjectClient';
  private userStore = inject(UserStore);

  ngOnInit(): void {
    this.userStore.loadUserFromStorage();
  }
}
