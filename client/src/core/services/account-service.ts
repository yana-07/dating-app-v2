import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { User } from '../../types/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = "https://localhost:5001/api";
  private user = signal<User | null>(null);
  readonly currentUser = this.user.asReadonly();

  login(credentials: any) {
    return this.http.post<User>(`${this.baseUrl}/account/login`, credentials).pipe(
      tap(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.user.set(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
  }

  setCurrentUser() {
    const userJson = localStorage.getItem('user');
    if (!userJson) return;
    const user: User = JSON.parse(userJson);
    this.user.set(user);
  }
}
