import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://localhost:5045/api/Users';

  constructor(private http: HttpClient) {}

  public login(
    email: string,
    password: string
  ): Observable<{ AccessToken: string; RefreshToken: string }> {
    return this.http
      .post<{ AccessToken: string; RefreshToken: string }>(
        `${this.userUrl}/login`,
        { email, password }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.AccessToken);
          localStorage.setItem('refreshToken', response.RefreshToken);

          this.getUserIdFromToken(response.AccessToken);
        })
      );
  }

  public register(user: User): Observable<string> {
    return this.http.post<string>(this.userUrl, user);
  }

  public getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  public updateUser(id: string, user: User): Observable<boolean> {
    const headers = this.getAuthHeaders();
    return this.http.put<boolean>(`${this.userUrl}/id?id=${id}`, user, {
      headers,
    });
  }

  public deleteUser(id: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.userUrl}/${id}`, { headers });
  }

  public refreshToken(
    token: string
  ): Observable<{ AccessToken: string; RefreshToken: string }> {
    return this.http.post<{ AccessToken: string; RefreshToken: string }>(
      `${this.userUrl}/refresh`,
      { token }
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  public getUserIdFromToken(token: string): string {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload.unique_name;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }
}
