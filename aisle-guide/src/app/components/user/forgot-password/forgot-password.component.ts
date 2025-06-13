import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { EmailsenderService } from '../../../services/email-sender/emailsender.service';
import { UserService } from '../../../services/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  validationCodeSent = false;
  validationCode = '';
  codeValidated = false;

  constructor(
    private fb: FormBuilder,
    private emailSender: EmailsenderService,
    private userService: UserService,
    private router: Router
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: [''],
      newPassword: [''],
      confirmPassword: [''],
    });
  }

  async hashCode(code: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(code);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async sendValidationCode() {
    sessionStorage.removeItem('forgotValidationCode');
    const emailControl = this.forgotForm.get('email');
    if (!emailControl?.valid) return;

    this.validationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    this.validationCodeSent = false;
    this.codeValidated = false;

    const hash = await this.hashCode(this.validationCode);
    sessionStorage.setItem('forgotValidationCode', hash);

    this.emailSender
      .sendForgotPasswordEmail({
        UserEmail: emailControl.value,
        Code: this.validationCode,
      })
      .subscribe({
        next: () => {
          this.validationCodeSent = true;
          this.successMessage = 'Validation code sent!';
          this.errorMessage = '';
        },
        error: () => {
          this.errorMessage =
            'Failed to send validation code. Please try again.';
          this.successMessage = '';
        },
      });
  }

  async validateCode() {
    const inputCode = this.forgotForm.value.code?.trim();
    if (!inputCode) {
      this.errorMessage = 'Validation code is required.';
      this.successMessage = '';
      return;
    }
    const inputHash = await this.hashCode(inputCode);
    const savedHash = sessionStorage.getItem('forgotValidationCode');
    if (inputHash !== savedHash) {
      this.errorMessage = 'Invalid validation code.';
      this.successMessage = '';
      this.codeValidated = false;
      return;
    }
    this.successMessage = 'Code validated! You can now reset your password.';
    this.errorMessage = '';
    this.codeValidated = true;
  }

  async updatePassword() {
    if (!this.codeValidated) {
      this.errorMessage = 'Please validate the code first.';
      this.successMessage = '';
      return;
    }
    const newPassword = this.forgotForm.value.newPassword;
    const confirmPassword = this.forgotForm.value.confirmPassword;
    if (!newPassword || !confirmPassword) {
      this.errorMessage = 'Please fill in both password fields.';
      this.successMessage = '';
      return;
    }
    if (newPassword !== confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      this.successMessage = '';
      return;
    }
    if (newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      this.successMessage = '';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const user = users.find((u) => u.email === this.forgotForm.value.email);
        if (!user) {
          this.errorMessage = 'User not found.';
          this.loading = false;
          return;
        }
        const updatedUser = { ...user, password: newPassword };
        this.userService.updateUser(user.id, updatedUser).subscribe({
          next: () => {
            this.successMessage =
              'Password updated successfully! Redirecting to login...';
            this.loading = false;
            sessionStorage.removeItem('forgotValidationCode');
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1200);
          },
          error: () => {
            this.errorMessage = 'Failed to update password. Please try again.';
            this.loading = false;
          },
        });
      },
      error: () => {
        this.errorMessage = 'Failed to find user. Please try again.';
        this.loading = false;
      },
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
