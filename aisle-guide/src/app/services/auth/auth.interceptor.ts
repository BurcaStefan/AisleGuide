import { Injectable } from '@angular/core';
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

  constructor(private userService: UserService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = this.addToken(request, token);
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

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        this.redirectToLogin();
        return throwError(() => 'No refresh token available');
      }

      return this.userService.refreshToken(refreshToken).pipe(
        switchMap((response) => {
          localStorage.setItem('token', response.AccessToken);
          localStorage.setItem('refreshToken', response.RefreshToken);

          this.refreshTokenSubject.next(response.AccessToken);

          return next.handle(this.addToken(request, response.AccessToken));
        }),
        catchError((error) => {
          console.error('Refresh token failed:', error);
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
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    const currentUrl = this.router.url;

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: currentUrl },
    });
  }
}
