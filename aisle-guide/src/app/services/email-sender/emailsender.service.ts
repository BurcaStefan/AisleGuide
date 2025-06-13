import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SendContactEmailCommand,
  SendForgotPasswordEmailCommand,
  SendEmailConfirmationCommand,
} from '../../models/emailsender.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmailsenderService {
  private baseUrl = 'http://localhost:5045/api/Email';

  constructor(private http: HttpClient, private authService: AuthService) {}

  sendContactEmail(command: SendContactEmailCommand): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact`, command, {
      headers: this.authService.getHeaders(),
    });
  }

  sendForgotPasswordEmail(
    command: SendForgotPasswordEmailCommand
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, command, {
      headers: this.authService.getAnonymousHeaders(),
    });
  }

  sendEmailConfirmation(
    command: SendEmailConfirmationCommand
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-email`, command, {
      headers: this.authService.getAnonymousHeaders(),
    });
  }
}
