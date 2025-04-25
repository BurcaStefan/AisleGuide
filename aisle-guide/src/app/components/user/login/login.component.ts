import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [UserService],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    const { email, password } = this.loginForm.value;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.login(email, password).subscribe({
      next: (token) => {
        this.successMessage = 'Login successful!';
        this.loading = false;
        localStorage.setItem('token', token);
        console.log('Token:', token);

        const userId = this.userService.getUserIdFromToken(token);

        this.userService.getUserById(userId).subscribe({
          next: (user) => {
            if (user.isAdmin) {
              setTimeout(() => {
                this.router.navigate(['/admin-home']);
              }, 1000);
            } else {
              setTimeout(() => {
                this.router.navigate(['/home']);
              }, 1000);
            }
          },
        });
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage =
          error.error || 'Login failed. Please check your credentials.';
        this.loading = false;
      },
    });
  }
}
