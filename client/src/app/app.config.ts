import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AccountService } from '../core/services/account-service';
import { errorInterceptor } from '../core/interceptors/error-interceptor';
import { jwtInterceptor } from '../core/interceptors/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorInterceptor, jwtInterceptor])),
    provideAppInitializer(() => {
      const accountService = inject(AccountService);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          accountService.loadUserFromLocalStorage();
          const splash = document.getElementById('initial-splash');
          if (splash) {
            splash.remove();
          }
          resolve();
        }, 500);
      });
    }),
  ],
};
