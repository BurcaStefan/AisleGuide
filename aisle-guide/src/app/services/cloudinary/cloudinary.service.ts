import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Image } from '../../models/image.model';
import { ImageService } from '../image/image.service';
import { environment } from '../../../environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private cloudName = environment.cloudinary.cloudName;
  private apiKey = environment.cloudinary.apiKey;
  private apiSecret = environment.cloudinary.apiSecret;
  private uploadPreset = environment.cloudinary.uploadPreset;

  private uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;
  private destroyUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;

  constructor(private http: HttpClient, private imageService: ImageService) {}

  uploadImage(
    file: File,
    entityId: string,
    entityType: string,
    existingImageId?: string
  ): Observable<Image> {
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const publicId = `${entityType}/${entityId}`;
    formData.append('public_id', publicId);

    const fileExtension = file.name.split('.').pop() || 'jpg';
    return this.http.post<any>(this.uploadUrl, formData).pipe(
      switchMap((cloudinaryResponse) => {
        console.log('Cloudinary response:', cloudinaryResponse);

        if (existingImageId) {
          return this.imageService.getImageById(existingImageId);
        }

        const imageData = {
          entityId: entityId,
          entityType: entityType,
          fileExtension: fileExtension,
        };

        return this.imageService
          .createImage(imageData)
          .pipe(
            switchMap((imageId) => this.imageService.getImageById(imageId))
          );
      }),
      catchError((error) => {
        console.error('Error during image upload:', error);
        return throwError(() => new Error('Upload failed: ' + error.message));
      })
    );
  }

  updateImage(
    file: File,
    imageId: string,
    entityId: string,
    entityType: string
  ): Observable<Image> {
    if (!file) {
      return throwError(() => new Error('No file selected'));
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    const publicId = `${entityType.toLowerCase()}/${entityId}`;
    formData.append('public_id', publicId);
    formData.append('overwrite', 'true');

    const fileExtension = file.name.split('.').pop() || 'jpg';

    return this.http.post<any>(this.uploadUrl, formData).pipe(
      switchMap((response) => {
        const imageData: Image = {
          id: imageId,
          entityId: entityId,
          entityType: entityType,
          fileExtension: fileExtension,
        };

        return this.imageService.updateImage(imageId, imageData);
      }),
      switchMap(() => {
        return this.imageService.getImageById(imageId);
      }),
      catchError((error) => {
        console.error('Error updating image:', error);
        return throwError(
          () => new Error('Failed to update image: ' + error.message)
        );
      })
    );
  }

  deleteImage(entityId: string, entityType: string): Observable<any> {
    console.log(`Deleting image: ${entityType}/${entityId}`);

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `${entityType}/${entityId}`;

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('api_key', this.apiKey);
    formData.append('timestamp', timestamp.toString());
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${this.apiSecret}`;
    const signature = this.generateSHA1(signatureString);

    formData.append('signature', signature);

    return this.http.post(this.destroyUrl, formData).pipe(
      map((response) => {
        console.log('Cloudinary delete response:', response);
        return response;
      }),
      catchError((error) => {
        console.error('Error deleting from Cloudinary:', error);
        return throwError(() => error);
      })
    );
  }

  getImageUrl(image: Image, transformation: string = ''): string {
    const publicId = `${image.entityType.toLowerCase()}/${image.entityId}`;
    const transformPath = transformation ? `${transformation}/` : '';

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transformPath}${publicId}.${image.fileExtension}`;
  }

  getResizedImageUrl(image: Image, width: number, height: number): string {
    return this.getImageUrl(image, `w_${width},h_${height},c_fill`);
  }

  getOptimizedImageUrl(image: Image): string {
    return this.getImageUrl(image, 'f_auto,q_auto');
  }

  private generateSHA1(message: string): string {
    return CryptoJS.SHA1(message).toString();
  }
}
