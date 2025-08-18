import { Component, input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule],
  templateUrl: './text-input.html',
  styleUrl: './text-input.css'
})
export class TextInput implements ControlValueAccessor {
  label =  input.required<string>();
  type =  input('text');
  maxDate = input<string>('');

  constructor(@Self() protected ngControl: NgControl) {
    ngControl.valueAccessor = this;
  }
  
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  get control() {
    return this.ngControl.control as FormControl;
  }
}
