import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { ToastService } from '../services/toast-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 400:
          if (error.error.errors) {
            const modelStateErrors = Object.values(error.error.errors).flat();
            return throwError(() => modelStateErrors);
          } else {
            toastService.error(error.error);
          }
          break;
        case 401:
          toastService.error('Unauthorized');
          break;
        case 404:
          router.navigateByUrl('/not-found');
          break;
        case 500:
          toastService.error('Server error');
          break;
        default:
          toastService.error('An unexpected error occurred');
      }

      return throwError(() => error);
    })
  )
};
