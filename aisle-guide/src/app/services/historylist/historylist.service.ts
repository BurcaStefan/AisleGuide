import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HistorylistService {
  private historyUrl = 'http://localhost:5045/api/HistoryLists';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHistoryListByUserId(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    return this.http.get<any[]>(`${this.historyUrl}?userId=${userId}`, {
      params,
    });
  }
  getHistoryListById(id: string): Observable<any> {
    return this.http.get<any>(`${this.historyUrl}/${id}`);
  }

  createHistoryList(command: any): Observable<any> {
    return this.http.post<any>(this.historyUrl, command, {
      headers: this.authService.getHeaders(),
    });
  }

  deleteHistoryList(id: string): Observable<any> {
    return this.http.delete<any>(`${this.historyUrl}/${id}`, {
      headers: this.authService.getHeaders(),
    });
  }

  updateHistoryList(id: string, command: any): Observable<any> {
    command.id = id;

    return this.http.put<any>(`${this.historyUrl}/${id}`, command, {
      headers: this.authService.getHeaders(),
    });
  }
}
