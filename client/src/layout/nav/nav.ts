import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected accountService = inject(AccountService);
  protected credentials: any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  constructor() {
    effect(() => {
      const theme = this.selectedTheme();
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    });
  }

  login() {
    this.accountService.login(this.credentials).subscribe({
      next: () => {
        this.credentials = {};
        this.toastService.success('Login successful');
        this.router.navigateByUrl('/members');
      },
      error: error => {
        this.toastService.error(error.error);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);

    const element = document.activeElement as HTMLDialogElement;
    if (element) {
      element.blur();
    }
  }
}
