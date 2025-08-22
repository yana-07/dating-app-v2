import { Component, computed, inject, OnInit, signal, viewChild } from '@angular/core';

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
export class MemberList implements OnInit {
  private memberService = inject(MemberService);
  private modalRef = viewChild.required<FilterModal>('filterModal');
  private memberParams = signal(new MemberParams());
  protected paginatedResult = signal<PaginatedResult<Member> | undefined>(undefined);
  protected displayMessage = computed(() => {
    const defaultParams = new MemberParams();

    const filters: string[] = [];

    if (this.memberParams().gender) {
      filters.push(`${this.memberParams().gender}s`);
    } else {
      filters.push('Males, Females');
    }

    if (this.memberParams().minAge !== defaultParams.minAge ||
      this.memberParams().maxAge !== defaultParams.maxAge) {
      filters.push(` ages ${this.memberParams().minAge}-${this.memberParams().maxAge}`);
    }

    filters.push(this.memberParams().orderBy == 'lastActive' ? 'Recently active' : 'Newest members');

    return filters.length > 0 ? `Selected: ${filters.join(' | ')}` : 'All members';
  });

  ngOnInit(): void {
    this.loadMembers(this.memberParams());
  }

  openModal() {
    this.modalRef().open();
  }

  resetFilters() {
    this.loadMembers(new MemberParams());
  }

  onSubmit(memberParams: MemberParams) {
    this.memberParams.set(memberParams);
    this.loadMembers(this.memberParams());
  }

  onPageChange(newPage: number) {
    this.memberParams.update(prevParams => {
      return prevParams ? { ...prevParams, page: newPage } : prevParams;
    });

    this.loadMembers(this.memberParams());
  }

  onPageSizeChange(newPageSize: number) {
    this.memberParams.update(prevParams => {
      return prevParams ? { ...prevParams, pageSize: newPageSize } : prevParams;
    });

    this.loadMembers(this.memberParams());
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
