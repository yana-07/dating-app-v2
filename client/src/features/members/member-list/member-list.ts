import { Component, effect, inject, OnInit, signal } from '@angular/core';

import { MemberService } from '../../../core/services/member-service';
import { Member } from '../../../types/member';
import { MemberCard } from "../member-card/member-card";
import { PaginatedResult } from '../../../types/pagination';
import { Paginator } from "../../../shared/paginator/paginator";

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  private memberService = inject(MemberService);
  protected paginatedResult = signal<PaginatedResult<Member> | undefined>(undefined);
  protected page = signal(1);
  protected pageSize = signal(5);

  ngOnInit(): void {
    this.memberService.getMembers().subscribe({
      next: (result: PaginatedResult<Member>) => {
        this.paginatedResult.set(result);
        this.page.set(result.metadata.page);
        this.pageSize.set(result.metadata.pageSize);
      }
    });
  }

  onPageChange(newPage: number) {
    this.page.set(newPage);
    this.memberService.getMembers(this.page(), this.pageSize()).subscribe({
      next: (result: PaginatedResult<Member>) => {
        this.paginatedResult.set(result);
      }
    });
  }

  onPageSizeChange(newPageSize: number) {
    this.pageSize.set(newPageSize);
    this.memberService.getMembers(this.page(), this.pageSize()).subscribe({
      next: (result: PaginatedResult<Member>) => {
        this.paginatedResult.set(result);
      }
    });
  }
}
