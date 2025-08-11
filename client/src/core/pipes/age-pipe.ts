import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(value: string): number {
    const today = new Date();
    const dateOfBirt = new Date(value);

    let age = today.getFullYear() - dateOfBirt.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirt.getMonth();

    if (monthDiff < 0 || 
      (monthDiff === 0 && today.getDate() < dateOfBirt.getDate())) {
      age--;
    }

    return age;
  }
}
