import { Component, ElementRef, output, viewChild } from '@angular/core';
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
  private modalRef = viewChild.required<ElementRef<HTMLDialogElement>>('filterModal');
  protected memberParams = new MemberParams();
  submitFilters = output<MemberParams>();
  
  open() {
    this.modalRef().nativeElement.showModal();
  }

  close() {
    this.modalRef().nativeElement.close();
  }

  submit() {
    this.submitFilters.emit(this.memberParams);

    this.close();
  }

  onMinAgeChange() {
    if (this.memberParams.minAge < FilterModal.MIN_AGE) {
      this.memberParams.minAge = FilterModal.MIN_AGE;
    }

    if (this.memberParams.maxAge < this.memberParams.minAge) {
      this.memberParams.maxAge = this.memberParams.minAge;
    }
  }

  onMaxAgeChange() {
    if (this.memberParams.maxAge < this.memberParams.minAge) {
      this.memberParams.maxAge = this.memberParams.minAge;
    }
  }
}
