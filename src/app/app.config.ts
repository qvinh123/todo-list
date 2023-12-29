import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/interceptor/http-error.interceptor';
import { AuthInterceptor } from './shared/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor, HttpErrorInterceptor])
    ),
  ],
};
