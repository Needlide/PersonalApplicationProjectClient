import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { UserStore } from '../../../../core/store/user.store';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  userStore = inject(UserStore);
  private readonly fb = inject(FormBuilder);

  registerForm = this.fb.group({
    firstName: [undefined, Validators.required],
    lastName: [undefined, Validators.required],
    email: [undefined, [Validators.required, Validators.email]],
    password: [undefined, Validators.required],
  });

  isLoading = false;

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.userStore.register({
        firstName: this.registerForm.value.firstName ?? '',
        lastName: this.registerForm.value.lastName ?? '',
        email: this.registerForm.value.email ?? '',
        password: this.registerForm.value.password ?? '',
      });
    }
  }
}
