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
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service';
import { ImageService } from '../../../services/image/image.service';

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

  selectedFile: File | null = null;
  uploadingImage: boolean = false;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  createdUserId: string = '';

  constructor(
    private userService: UserService,
    private emailSender: EmailsenderService,
    private fb: FormBuilder,
    private router: Router,
    private cloudinaryService: CloudinaryService,
    private imageService: ImageService
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

    const selectedImageFile = this.selectedFile;
    this.selectedFile = null;

    this.userService.register(user).subscribe({
      next: (id) => {
        this.createdUserId = id;
        this.successMessage = 'Registration successful!';
        sessionStorage.removeItem('registerValidationCodeHash');

        if (!selectedImageFile) {
          this.finishRegistration();
          return;
        }

        if (!this.createdUserId) {
          console.error('User ID is missing, cannot upload profile image');
          this.errorMessage =
            'Registration successful, but unable to upload profile image.';
          this.finishRegistration();
          return;
        }

        const imageMetadata = {
          entityId: this.createdUserId,
          entityType: 'User',
          fileExtension: selectedImageFile.name.split('.').pop() || 'jpg',
        };

        this.imageService.createImage(imageMetadata).subscribe({
          next: (imageId) => {
            this.uploadingImage = true;
            this.successMessage =
              'Registration successful! Uploading profile image...';

            this.cloudinaryService
              .uploadImage(selectedImageFile, this.createdUserId, 'User', imageId)
              .subscribe({
                next: () => {
                  this.uploadingImage = false;
                  this.successMessage =
                    'Registration and profile image upload successful!';
                  this.finishRegistration();
                },
                error: (error) => {
                  this.uploadingImage = false;
                  console.error('Image upload to Cloudinary failed:', error);
                  this.successMessage =
                    'Registration successful, but profile image upload failed.';
                  this.finishRegistration();
                },
              });
          },
          error: (error) => {
            console.error('Failed to create image record in database:', error);
            this.successMessage =
              'Registration successful, but profile image could not be saved.';
            this.finishRegistration();
          },
        });
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.errorMessage =
          error.error || 'Registration failed. Please try again.';
        this.loading = false;
        this.selectedFile = selectedImageFile;
      },
    });
  }

  private finishRegistration() {
    this.loading = false;
    setTimeout(() => {
      this.router.navigate(['']);
    }, 1500);
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.imagePreviewUrl = null;
    }
  }

  removeSelectedImage() {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
  }
}
