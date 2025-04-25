import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl = 'http://localhost:5045/api/Users';

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    return this.http.post(
      `${this.userUrl}/login`,
      { email, password },
      { responseType: 'text' }
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
    return this.http.put<boolean>(`${this.userUrl}/id?id=${id}`, user);
  }

  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.userUrl}/${id}`);
  }

  public getUserIdFromToken(token: string): string {
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenPayload);
      return tokenPayload.unique_name;
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }
}
