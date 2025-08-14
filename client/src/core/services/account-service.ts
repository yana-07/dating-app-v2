import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { LoginCredentials, RegisterCredentials, User } from '../../types/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private user = signal<User | null>(null);
  readonly currentUser = this.user.asReadonly();

  register(credentials: RegisterCredentials) {
    return this.http.post<User>(`${this.baseUrl}/account/register`, credentials).pipe(
      tap(user => {
        if (user) {
          this.saveUserToLocalStorage(user);
          this.user.set(user);
        }
      })
    );
  }

  login(credentials: LoginCredentials) {
    return this.http.post<User>(`${this.baseUrl}/account/login`, credentials).pipe(
      tap(user => {
        if (user) {
          this.saveUserToLocalStorage(user);
          this.user.set(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
  }

  loadUserFromLocalStorage() {
    var user = this.getUserFromLocalStorage();
    if (user) { 
      this.user.set(user);
    }
  }

  updateUser(user: User) {
    this.saveUserToLocalStorage(user);
    this.user.set(user);
  }

  private saveUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private getUserFromLocalStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
