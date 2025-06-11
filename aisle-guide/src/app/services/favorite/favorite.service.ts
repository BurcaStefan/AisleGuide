import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../../models/favorite.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private http: HttpClient) {}

  favoriteUrl = 'http://localhost:5045/api/Favorites';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  public getFavoriteProductsByUserId(
    userId: string,
    pageNumber: number,
    pageSize: number
  ): Observable<Favorite[]> {
    const params = new HttpParams()
      .set('id', userId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<any[]>(this.favoriteUrl, {
      headers: this.getHeaders(),
      params: params,
    });
  }

  public createFavorite(userId: string, productId: string): Observable<any> {
    const command = {
      userId: userId,
      productId: productId,
    };

    return this.http.post<any>(this.favoriteUrl, command, {
      headers: this.getHeaders(),
    });
  }

  public deleteFavorite(
    userId: string,
    productId: string
  ): Observable<boolean> {
    return this.http.delete<boolean>(
      `${this.favoriteUrl}/${userId}/${productId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
