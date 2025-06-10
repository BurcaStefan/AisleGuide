import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SendContactEmailCommand,
  SendForgotPasswordEmailCommand,
  SendEmailConfirmationCommand,
} from '../../models/emailsender.model';

@Injectable({
  providedIn: 'root',
})
export class EmailsenderService {
  private baseUrl = 'http://localhost:5045/api/Email';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  private getAnonymousHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  sendContactEmail(command: SendContactEmailCommand): Observable<any> {
    return this.http.post(`${this.baseUrl}/contact`, command, {
      headers: this.getHeaders(),
    });
  }

  sendForgotPasswordEmail(
    command: SendForgotPasswordEmailCommand
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, command, {
      headers: this.getAnonymousHeaders(),
    });
  }

  sendEmailConfirmation(
    command: SendEmailConfirmationCommand
  ): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm-email`, command, {
      headers: this.getAnonymousHeaders(),
    });
  }
}
