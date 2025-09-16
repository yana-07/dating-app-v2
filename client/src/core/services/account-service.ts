import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

import { LoginCredentials, RegisterCredentials, User } from '../../types/user';
import { environment } from '../../environments/environment';
import { LikeService } from './like-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private likeService = inject(LikeService);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private user = signal<User | null>(null);
  private router = inject(Router);
  readonly currentUser = this.user.asReadonly();

  register(credentials: RegisterCredentials) {
    return this.http
      .post<User>(`${this.baseUrl}/account/register`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap(user => {
          if (user) {
            this.setUser(user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  login(credentials: LoginCredentials) {
    return this.http
      .post<User>(`${this.baseUrl}/account/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap(user => {
          if (user) {
            this.setUser(user);
            this.likeService.getLikedMemberIds();
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  logout() {
    this.http
      .post(`${this.baseUrl}/account/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem('filters');
          this.likeService.clearLikedMemberIds();
          this.user.set(null);
          this.router.navigateByUrl('');
        },
      });
  }

  updateUserState(user: Partial<User>) {
    let updatedUser: User | undefined;

    this.user.update(prevUser => {
      if (!prevUser) return prevUser;

      updatedUser = { ...prevUser, ...user };

      return updatedUser;
    });
  }

  setUser(user: User) {
    user.roles = this.getRolesFromToken(user.token);
    this.user.set(user);
  }

  refreshToken() {
    return this.http.post<User>(
      `${this.baseUrl}/account/refresh-token`,
      {},
      { withCredentials: true }
    );
  }

  startTokenRefreshInterval() {
    setInterval(() => {
      this.refreshToken().subscribe({
        next: user => this.setUser(user),
        error: () => this.logout(),
      });
    }, 5 * 60 * 1000);
  }

  private getRolesFromToken(token: string): string[] {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const jsonPayload = JSON.parse(decodedPayload);
    return jsonPayload['role']
      ? Array.isArray(jsonPayload['role'])
        ? jsonPayload['role']
        : [jsonPayload['role']]
      : [];
  }
}
