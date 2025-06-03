import { Injectable } from '@angular/core';
import { Review } from '../../models/review.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewUrl = 'http://localhost:5045/api/Reviews';

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAllReviewsPaginatedById(
    productId: string,
    pageNumber: number = 1,
    pageSize: number = 5
  ): Observable<any> {
    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any>(`${this.reviewUrl}/${productId}`, { params });
  }

  public createReview(review: {
    productId: string;
    userId: string;
    content: string;
    rating: number;
    createdAt: Date;
  }): Observable<string> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<string>(this.reviewUrl, review, { headers });
  }

  public updateReview(
    id: string,
    review: {
      id: string;
      content: string;
      rating: number;
      createdAt: string;
    }
  ): Observable<boolean> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<boolean>(`${this.reviewUrl}/${id}`, review, {
      headers,
    });
  }

  public deleteReview(id: string): Observable<boolean> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<boolean>(`${this.reviewUrl}/${id}`, { headers });
  }
}
