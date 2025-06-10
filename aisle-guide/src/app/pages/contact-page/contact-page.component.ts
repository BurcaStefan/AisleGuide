import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientFooterComponent } from '../../components/layout/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../components/layout/client-header/client-header.component';
import { EmailsenderService } from '../../services/email-sender/emailsender.service';
import { SendContactEmailCommand } from '../../models/emailsender.model';
import { UserService } from '../../services/user/user.service';

interface ContactForm {
  subject: string;
  phone: string;
  contactMethod: string;
  message: string;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ClientHeaderComponent,
    ClientFooterComponent,
  ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit {
  contactForm: ContactForm = {
    subject: '',
    phone: '',
    contactMethod: '',
    message: '',
  };

  isSubmitting: boolean = false;
  submitError: string = '';
  submitSuccess: string = '';
  userData: UserData | null = null;

  fieldErrors = {
    subject: '',
    contactMethod: '',
    message: '',
  };

  constructor(
    private emailService: EmailsenderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.unique_name || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  loadUserData(): void {
    const userId = this.getUserId();
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userData = {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
        };
      },
      error: (error) => {
        console.error('Error loading user data:', error);
      },
    });
  }

  composeMessage(): string {
    if (!this.userData) return this.contactForm.message.trim();

    let composedMessage = '';
    composedMessage += `First Name: ${this.userData.firstName}<br>`;
    composedMessage += `Last Name: ${this.userData.lastName}<br>`;

    if (this.contactForm.phone.trim()) {
      composedMessage += `Phone number: ${this.contactForm.phone.trim()}<br>`;
    }

    const contactMethodText = this.getContactMethodText(
      this.contactForm.contactMethod
    );
    composedMessage += `Contact method: ${contactMethodText}<br><br>`;
    composedMessage += this.contactForm.message.trim();

    return composedMessage;
  }

  getContactMethodText(method: string): string {
    switch (method) {
      case 'phone':
        return 'Phone';
      case 'email':
        return 'Email';
      case 'no-contact':
        return 'I do not wish to be contacted';
      default:
        return method;
    }
  }

  isFormValid(): boolean {
    return (
      this.contactForm.subject.trim().length > 0 &&
      this.contactForm.contactMethod.length > 0 &&
      this.contactForm.message.trim().length > 0
    );
  }
  validateField(fieldName: string): void {
    switch (fieldName) {
      case 'subject':
        this.fieldErrors.subject =
          this.contactForm.subject.trim().length === 0
            ? 'Subject is required'
            : '';
        break;
      case 'contactMethod':
        this.fieldErrors.contactMethod =
          this.contactForm.contactMethod.length === 0
            ? 'Please select a contact method'
            : '';
        break;
      case 'message':
        this.fieldErrors.message =
          this.contactForm.message.trim().length === 0
            ? 'Message is required'
            : '';
        break;
    }
  }

  clearFieldError(fieldName: string): void {
    if (fieldName === 'subject') this.fieldErrors.subject = '';
    if (fieldName === 'contactMethod') this.fieldErrors.contactMethod = '';
    if (fieldName === 'message') this.fieldErrors.message = '';
  }

  submitContactForm(): void {
    this.validateField('subject');
    this.validateField('contactMethod');
    this.validateField('message');

    if (!this.isFormValid()) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    if (!this.userData || !this.userData.email) {
      this.submitError = 'Unable to retrieve user email. Please try again.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitSuccess = '';

    const composedMessage = this.composeMessage();

    const command: SendContactEmailCommand = {
      userEmail: this.userData.email,
      subject: this.contactForm.subject.trim(),
      message: composedMessage,
    };

    this.emailService.sendContactEmail(command).subscribe({
      next: (response) => {
        this.submitSuccess =
          'Your message has been sent successfully! We will get back to you soon.';
        this.isSubmitting = false;

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      },
      error: (error) => {
        console.error('Error sending contact email:', error);
        this.submitError =
          error.error?.message ||
          'Failed to send message. Please try again later.';
        this.isSubmitting = false;
      },
    });
  }

  resetForm(): void {
    this.contactForm = {
      subject: '',
      phone: '',
      contactMethod: '',
      message: '',
    };
    this.submitError = '';
    this.submitSuccess = '';
  }
}
