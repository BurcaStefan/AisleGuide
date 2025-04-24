// import { Component } from '@angular/core';
// import { UserService } from '../../../services/user/user.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
//   standalone: true,
//   imports: [CommonModule],
//   providers: [UserService],
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';
//   loading: boolean = false;
//   errorMessage: string = '';
//   successMessage: string = '';

//   constructor(private userService: UserService) {}

//   login(email: string, password: string) {
//     this.email = email;
//     this.password = password;
//     this.loading = true;
//     this.errorMessage = '';
//     this.successMessage = '';

//     this.userService.login(this.email, this.password).subscribe({
//       next: (token) => {
//         this.successMessage = 'Login successful!';
//         this.loading = false;
//         localStorage.setItem('token', token);
//         console.log('Token:', token);
//       },
//       error: (error) => {
//         console.error('Login failed:', error);
//         this.errorMessage =
//           error.error || 'Login failed. Please check your credentials.';
//         this.loading = false;
//       },
//     });
//   }
// }

import { Component } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

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

  constructor(private userService: UserService, private fb: FormBuilder) {
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
