import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AccountService } from '../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
  private router = inject(Router);
  protected accountService = inject(AccountService);
  protected credentials: any = {};

  login() {
    this.accountService.login(this.credentials).subscribe({
      next: () => {
        this.credentials = {};
        this.router.navigateByUrl('/members');
      },
      error: error => console.error('Login failed', error)
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
