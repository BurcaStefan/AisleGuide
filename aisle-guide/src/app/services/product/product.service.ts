import { Injectable } from '@angular/core';
import { Product } from '../../models/product.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productUrl = 'http://localhost:5045/api/Products';

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productUrl);
  }

  public createProduct(product: Product): Observable<string> {
    return this.http.post<string>(this.productUrl, product);
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${id}`);
  }

  public updateProduct(id: string, product: any): Observable<boolean> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<boolean>(`${this.productUrl}/${id}`, product, {
      headers,
    });
  }

  public deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.productUrl}/${id}`);
  }

  public getProductsPaginatedByFilter(queryParams: any): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productUrl}/paginated`, {
      params: queryParams,
    });
  }
}
