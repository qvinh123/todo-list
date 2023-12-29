import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { take } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  authService.userInfo.pipe(take(1)).subscribe((user) => {
    if (user) {
      req = req.clone({
        params: new HttpParams().set('auth', user.token),
      });
    }
  });
  return next(req);
};
