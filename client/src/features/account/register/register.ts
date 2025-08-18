import { Component, inject, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { RegisterCredentials } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService);
  protected credentials = {} as RegisterCredentials;
  protected registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    displayName: new FormControl('', Validators.required),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required, 
      this.matchValues('password')
    ]),
  });
  cancelRegister = output<boolean>();

  ngOnInit(): void {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    });
  }

  matchValues(matchToControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var parent = control.parent;
      if (!parent) return null;

      const matchToControl = parent.get(matchToControlName);
      if (!matchToControl) return null;
      
      return control.value === matchToControl.value ? 
        null : 
        { passwordMismatch: true };
    }
  }

  register() {
    console.log(this.registerForm);
    // this.accountService.register(this.credentials).subscribe({
    //   next: response => {
    //     console.log('Registration successful:', response);
    //     this.cancel();
    //   },
    //   error: error => {
    //     console.error('Registration failed:', error);
    //   },
    // });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
