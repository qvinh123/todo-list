import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRequest, AuthResponse } from './auth.model';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { UserInfo } from './user-info';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  key = 'AIzaSyDkZP-exSsN6zso0Xf6UQSMONorV9alCh0';

  userInfo = new BehaviorSubject<UserInfo>(null);

  timerExpiration;
  constructor(private http: HttpClient, private router: Router) {}

  handleAuthen(res: AuthResponse) {
    const { localId, email, idToken, expiresIn } = res;
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);

    const userInfo = new UserInfo(localId, email, idToken, expirationDate);

    this.userInfo.next(userInfo);
    this.autoLogout(+expiresIn * 1000);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }

  signup(user: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}:signUp?key=${this.key}`, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(
        tap((res) => {
          this.handleAuthen(res);
        })
      );
  }

  logout() {
    this.userInfo.next(null);
    localStorage.removeItem('userInfo');
    this.router.navigate(['/auth']);

    if (this.timerExpiration) {
      clearTimeout(this.timerExpiration);
    }
    this.timerExpiration = null;
  }

  login(user: AuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}:signInWithPassword?key=${this.key}`, {
        ...user,
        returnSecureToken: true,
      })
      .pipe(
        tap((res) => {
          this.handleAuthen(res);
        })
      );
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userInfo'));

    if (!userData) {
      return;
    }

    if (userData._token) {
      this.userInfo.next(
        new UserInfo(
          userData.id,
          userData.email,
          userData._token,
          userData._tokenExpireDate
        )
      );
      const expirationDuration =
        new Date(userData._tokenExpireDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.timerExpiration = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
