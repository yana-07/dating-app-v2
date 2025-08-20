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
export class MemberList {
  private memberService = inject(MemberService);
  protected paginatedResult = signal<PaginatedResult<Member> | undefined>(undefined);
  protected page = signal(1);
  protected pageSize = signal(10);

  constructor() {
    effect(() => {  
      this.memberService
        .getMembers(this.page(), this.pageSize())
        .subscribe({
          next: (result: PaginatedResult<Member>) => {
            this.paginatedResult.set(result);
          }
        });
    });
  }
}
