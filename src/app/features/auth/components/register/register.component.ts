import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequestDto } from '../../../../shared/models/user/register-request.dto';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  registerForm = this.fb.group({
    firstName: [undefined, Validators.required],
    lastName: [undefined, Validators.required],
    email: [undefined, [Validators.required, Validators.email]],
    password: [undefined, Validators.required],
  });

  isLoading = false;

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const registerRequestDto: RegisterRequestDto = {
        firstName: this.registerForm.value.firstName ?? '',
        lastName: this.registerForm.value.lastName ?? '',
        email: this.registerForm.value.email ?? '',
        password: this.registerForm.value.password ?? '',
      };

      if (
        registerRequestDto.firstName &&
        registerRequestDto.lastName &&
        registerRequestDto.email &&
        registerRequestDto.password
      ) {
        this.authService.register(registerRequestDto).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/events']);
          },
          error: (err: Error) => {
            this.isLoading = false;
            console.error('Login failed: ', err.message);
          },
        });
      }
    }
  }
}
