import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistorylistService {
  private historyUrl = 'http://localhost:5045/api/HistoryLists';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

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
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.historyUrl, command, { headers });
  }

  deleteHistoryList(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.historyUrl}/${id}`, { headers });
  }

  updateHistoryList(id: string, command: any): Observable<any> {
    const headers = this.getAuthHeaders();
    command.id = id;

    return this.http.put<any>(`${this.historyUrl}/${id}`, command, { headers });
  }
}
