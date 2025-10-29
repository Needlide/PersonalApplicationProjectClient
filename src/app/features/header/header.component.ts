import { Component, inject } from '@angular/core';
import { UserStore } from '../../core/store/user.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [MatIconModule],
})
export class HeaderComponent {
  userStore = inject(UserStore);
}
