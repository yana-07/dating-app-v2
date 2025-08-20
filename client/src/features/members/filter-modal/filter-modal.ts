import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { MemberParams } from '../../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {
  private static readonly MIN_AGE = 18;
  private static readonly MAX_AGE = 100;
  modalRef = viewChild<ElementRef<HTMLDialogElement>>('filterModal');
  submitFilters = output<MemberParams>();
  gender = signal('');
  minAge = signal(FilterModal.MIN_AGE);
  maxAge = signal(FilterModal.MAX_AGE);
  
  open() {
    this.modalRef()?.nativeElement.showModal();
  }

  close() {
    this.modalRef()?.nativeElement.close();
  }

  submit() {
    const memberParams = new MemberParams();
    memberParams.gender = this.gender();
    memberParams.minAge = this.minAge();
    memberParams.maxAge = this.maxAge();

    this.submitFilters.emit(memberParams);

    this.close();
  }

  reset() {
    this.gender.set('');
    this.minAge.set(FilterModal.MIN_AGE);
    this.maxAge.set(FilterModal.MAX_AGE);
  
    this.submitFilters.emit(new MemberParams());
  }

  onMinAgeChange() {
    if (this.minAge() < FilterModal.MIN_AGE) {
      this.minAge.set(FilterModal.MIN_AGE);
    }

    if (this.maxAge() < this.minAge()) {
      this.maxAge.set(this.minAge());
    }
  }

  onMaxAgeChange() {
    if (this.maxAge() < this.minAge()) {
      this.maxAge.set(this.minAge());
    }
  }
}
