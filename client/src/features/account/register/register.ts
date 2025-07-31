import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RegisterCredentials } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private accountService = inject(AccountService);
  protected credentials = {} as RegisterCredentials;
  cancelRegister = output<boolean>();

  register() {
    this.accountService.register(this.credentials).subscribe({
      next: response => {
        console.log('Registration successful:', response);
        this.cancel();
      },
      error: error => {
        console.error('Registration failed:', error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
