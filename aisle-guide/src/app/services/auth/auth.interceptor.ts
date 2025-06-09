import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private userService: UserService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        request = this.addToken(request, token);
      }
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private isAuthEndpoint(url: string): boolean {
    return (
      url.endsWith('/api/Users/login') ||
      url.endsWith('/api/Users/register') ||
      url.endsWith('/api/Users/refresh')
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      if (!isPlatformBrowser(this.platformId)) {
        return throwError(
          () => 'Running on server, no refresh token available'
        );
      }

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        this.redirectToLogin();
        return throwError(() => 'No refresh token available');
      }

      return this.userService.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', response.AccessToken);
            localStorage.setItem('refreshToken', response.RefreshToken);
          }

          this.refreshTokenSubject.next(response.AccessToken);
          return next.handle(this.addToken(request, response.AccessToken));
        }),
        catchError((error) => {
          this.redirectToLogin();
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addToken(request, token)))
      );
    }
  }

  private redirectToLogin(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  }
}
