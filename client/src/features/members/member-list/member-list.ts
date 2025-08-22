import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';

import { MemberService } from '../../../core/services/member-service';
import { Member, MemberParams } from '../../../types/member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";
import { FilterModal } from "../filter-modal/filter-modal";

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModal],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList {
  private memberService = inject(MemberService);
  private modalRef = viewChild.required<FilterModal>('filterModal');
  protected paginatedResult = signal<PaginatedResult<Member> | undefined>(undefined);
  protected page = signal(1);
  protected pageSize = signal(10);

  constructor() {
    effect(() => {  
      const memberParams = new MemberParams();
      memberParams.page = this.page();
      memberParams.pageSize = this.pageSize();
      
      this.loadMembers(memberParams);
    });
  }

  openModal() {
    this.modalRef().open();
  }

  resetFilters() {
    this.loadMembers(new MemberParams());
  }

  onSubmit(memberParams: MemberParams) {
    this.loadMembers(memberParams);
  }

  private loadMembers(memberParams: MemberParams) {
    this.memberService
      .getMembers(memberParams)
      .subscribe({
        next: (result: PaginatedResult<Member>) => {
          this.paginatedResult.set(result);
        }
      });
  }
}
