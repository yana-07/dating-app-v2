import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { JsonPipe } from '@angular/common';

import { AccountService } from '../../../core/services/account-service';
import { TextInput } from "../../../shared/text-input/text-input";

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, JsonPipe, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private accountService = inject(AccountService);
  private formBuilder = inject(FormBuilder);
  protected currentStep = signal(1);
  protected credentialsForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    displayName: ['', Validators.required],
    password: ['', [
      Validators.required,
      Validators.minLength(4),
    ]],
    confirmPassword: ['', [
      Validators.required, 
      this.matchValues('password')
    ]],
  });
  protected profileForm = this.formBuilder.group({
    gender: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
    country: ['', Validators.required],
    city: ['', Validators.required],
  });
  cancelRegister = output<boolean>();

  ngOnInit(): void {
    this.credentialsForm.get('password')?.valueChanges.subscribe(() => {
      this.credentialsForm.get('confirmPassword')?.updateValueAndValidity();
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

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep + 1);
    }
  }

  previousStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.update(prevStep => prevStep - 1);
    }
  }

  getMaxDate() {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);

    return maxDate.toISOString().split('T')[0];
  }

  register() {
    if (this.profileForm.valid && this.credentialsForm.valid) {
      const formData = {
        ...this.profileForm.value,
        ...this.credentialsForm.value
      };

      console.log(formData);
    }
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
