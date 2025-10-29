import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserStore } from '../../../../core/store/user.store';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  userStore = inject(UserStore);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.userStore.login({
        email: this.loginForm.value.email ?? '',
        password: this.loginForm.value.password ?? '',
      });
    }
  }
}
