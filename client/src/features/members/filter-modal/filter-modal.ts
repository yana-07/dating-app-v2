import { Component, ElementRef, model, OnInit, output, viewChild } from '@angular/core';
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
  memberParams = model.required<MemberParams>();
  submitFilters = output<MemberParams>();
  
  open() {
    this.modalRef().nativeElement.showModal();
  }

  close() {
    this.modalRef().nativeElement.close();
  }

  submit() {
    this.submitFilters.emit(this.memberParams());

    this.close();
  }

  onMinAgeChange() {
    if (this.memberParams().minAge < FilterModal.MIN_AGE) {
      this.updateMemberParams({ minAge: FilterModal.MIN_AGE });
    }

    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.updateMemberParams({ maxAge: this.memberParams().minAge });
    }
  }

  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.updateMemberParams({ maxAge: this.memberParams().minAge });
    }
  }

  updateMemberParams(newParams: Partial<MemberParams>) {
    this.memberParams.update(prevParams => {
      return prevParams ? { ...prevParams, ...newParams } : prevParams;
    });
  }

  updateMemberParamsFromEvent(newParams: Partial<MemberParams>) {
    this.memberParams.update(prevParams => {
      return prevParams ? { ...prevParams, ...newParams } : prevParams;
    });
  }
}
