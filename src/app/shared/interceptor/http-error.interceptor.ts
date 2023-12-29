import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError, retry } from 'rxjs';

export const HttpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  return next(req).pipe(
    retry(1),
    catchError((error: HttpErrorResponse) => {
      let errorMsg;

      switch (error.status) {
        // case 401:
        // case 403: {
        //   errorMsg = 'Permission denied';
        //   router.navigate(['/auth']);
        //   break;
        // }
        case 404: {
          errorMsg = 'Page not found';
          break;
        }
        default:
          errorMsg = `${error.error.error.code}, Message: ${error.error.error.message}`;
          break;
      }
      alert(errorMsg);
      return throwError(() => errorMsg);
    })
  );
};
