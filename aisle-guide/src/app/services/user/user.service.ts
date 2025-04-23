import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private loginUrl = 'http://localhost:5045/api/Users/login';

  constructor(private http: HttpClient) {}

  public login(email: string, password: string): Observable<string> {
    return this.http.post(
      this.loginUrl,
      { email, password },
      { responseType: 'text' }
    );
  }
}
