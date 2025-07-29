import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginCredentials, RegisterCredentials } from '../../../types/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected credentials = {} as RegisterCredentials;

  register() {
    console.log(this.credentials);
  }

  cancel() {
    console.log('Registration cancelled');
  }
}
