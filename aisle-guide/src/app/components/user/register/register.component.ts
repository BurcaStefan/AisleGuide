import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { EmailsenderService } from '../../../services/email-sender/emailsender.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  validationCodeSent: boolean = false;
  validationCode: string = '';
  validationCodeValid: boolean = false;

  constructor(
    private userService: UserService,
    private emailSender: EmailsenderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        validationCode: [''],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      if (form.get('confirmPassword')?.hasError('mismatch')) {
        form.get('confirmPassword')?.setErrors(null);
      }
      return null;
    }
  }

  async sendValidationCode() {
    const emailControl = this.registerForm.get('email');
    if (!emailControl?.valid) return;

    this.validationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    this.validationCodeSent = false;
    this.validationCodeValid = false;

    const hash = await this.hashCode(this.validationCode);
    sessionStorage.setItem('registerValidationCodeHash', hash);

    this.emailSender
      .sendEmailConfirmation({
        UserEmail: emailControl.value,
        Code: this.validationCode,
      })
      .subscribe({
        next: () => {
          this.validationCodeSent = true;
        },
        error: () => {
          this.errorMessage =
            'Failed to send validation code. Please try again.';
        },
      });
  }

  async register() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.validationCodeSent) {
      this.errorMessage =
        'Please request and enter the validation code sent to your email.';
      return;
    }

    const inputCode = this.registerForm.value.validationCode?.trim();
    if (!inputCode) {
      this.errorMessage = 'Validation code is required.';
      return;
    }

    const inputHash = await this.hashCode(inputCode);
    const savedHash = sessionStorage.getItem('registerValidationCodeHash');

    if (inputHash !== savedHash) {
      this.errorMessage = 'Invalid validation code.';
      this.validationCodeValid = false;
      return;
    } else {
      this.validationCodeValid = true;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const user = {
      id: '',
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      isAdmin: false,
    };

    this.userService.register(user).subscribe({
      next: (id) => {
        this.successMessage =
          'Registration successful! Redirecting to login...';
        this.loading = false;
        sessionStorage.removeItem('registerValidationCodeHash');

        setTimeout(() => {
          this.router.navigate(['']);
        }, 1000);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage =
          error.error || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['']);
  }

  async hashCode(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
}
