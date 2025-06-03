import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  returnUrl: string = '/';

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
      next: (response) => {
        this.successMessage = 'Login successful!';
        this.loading = false;

        localStorage.setItem('token', response.AccessToken);
        localStorage.setItem('refreshToken', response.RefreshToken);

        const payload = JSON.parse(atob(response.AccessToken.split('.')[1]));
        const userId = payload.unique_name;
        const isAdmin = payload.IsAdmin === 'True' || payload.IsAdmin === true;

        if (
          this.returnUrl !== '/' &&
          this.returnUrl !== '/home' &&
          this.returnUrl !== '/admin-home'
        ) {
          setTimeout(() => {
            this.router.navigateByUrl(this.returnUrl);
          }, 1000);
        } else {
          if (isAdmin) {
            setTimeout(() => {
              this.router.navigate(['/admin-home']);
            }, 1000);
          } else {
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1000);
          }
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.loading = false;
      },
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
