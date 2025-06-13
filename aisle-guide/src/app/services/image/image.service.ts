import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from '../../models/image.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private imageUrl = 'http://localhost:5045/api/Images';

  constructor(private http: HttpClient, private authService: AuthService) {}

  public createImage(image: {
    entityId: string;
    entityType: string;
  }): Observable<string> {
    return this.http.post<string>(this.imageUrl, image, {
      headers: this.authService.getHeaders(),
    });
  }

  public getImageById(id: string): Observable<Image> {
    return this.http.get<Image>(`${this.imageUrl}/${id}`);
  }

  public getImageByEntityId(entityId: string): Observable<Image> {
    return this.http.get<Image>(`${this.imageUrl}/entity/${entityId}`);
  }

  public updateImage(id: string, image: Image): Observable<boolean> {
    return this.http.put<boolean>(`${this.imageUrl}/${id}`, image, {
      headers: this.authService.getHeaders(),
    });
  }

  public deleteImage(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.imageUrl}/${id}`, {
      headers: this.authService.getHeaders(),
    });
  }

  
}
