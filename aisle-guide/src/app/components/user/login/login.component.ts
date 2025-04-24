import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule],
  providers: [UserService],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private userService: UserService) {}

  login(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.login(this.email, this.password).subscribe({
      next: (token) => {
        this.successMessage = 'Login successful!';
        this.loading = false;
        localStorage.setItem('token', token);
        console.log('Token:', token);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage =
          error.message || 'Login failed. Please check your credentials.';
        this.loading = false;
      },
    });
  }
}
