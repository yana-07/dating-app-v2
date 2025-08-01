import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { AccountService } from '../core/services/account-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    provideHttpClient(),
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
    })
  ]
};
