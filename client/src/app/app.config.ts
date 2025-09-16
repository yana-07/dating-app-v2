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
import { loadingInterceptor } from '../core/interceptors/loading-interceptor';
import { LikeService } from '../core/services/like-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(
      withInterceptors([errorInterceptor, jwtInterceptor, loadingInterceptor])
    ),
    provideAppInitializer(() => {
      const accountService = inject(AccountService);
      const likeService = inject(LikeService);

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          accountService.refreshToken()
            .subscribe(user => {
              accountService.setUser(user);
              likeService.getLikedMemberIds();
              accountService.startTokenRefreshInterval();
            }
          );

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
