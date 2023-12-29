import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from './auth.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const auService = inject(AuthService);
  return auService.userInfo.pipe(
    map((user) => {
      const isAuth = !!user;
      if (!isAuth) {
        return router.createUrlTree(['/auth']);
      }
      return true;
    })
  );
};
