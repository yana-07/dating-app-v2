import { Component, effect, inject, signal } from '@angular/core';

import { LikeService } from '../../core/services/like-service';
import { Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";
import { Paginator } from '../../shared/paginator/paginator';
import { PaginatedResult, PagingParams } from '../../types/pagination';

@Component({
  selector: 'app-lists',
  imports: [MemberCard, Paginator],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists {
  private likeService = inject(LikeService);
  protected predicate = signal('liked');
  protected pagingParams = signal(new PagingParams());
  protected paginatedResult = signal<PaginatedResult<Member> | undefined>(undefined);
  protected tabs = [
    { label: 'Liked', value: 'liked' },
    { label: 'Liked me', value: 'likedBy' },
    { label: 'Mutual', value: 'mutual' }
  ];

  constructor() {
    effect(() => {
      this.loadLikes();
    });  
  }

  loadLikes() {
    this.likeService.getLikes(this.predicate(), this.pagingParams()).subscribe({
      next: paginatedResult => this.paginatedResult.set(paginatedResult)  
    });
  }

  setPredicate(predicate: string) {
    if (predicate !== this.predicate()) {
      this.predicate.set(predicate);
      this.pagingParams.update(prevParams => {
        return prevParams ?
          { ...prevParams, page: 1 } :
          prevParams;
      });
    }
  }

  onPageChange(newPage: number) {
    this.pagingParams.update(prevParams => {
      return prevParams ?
        { ...prevParams, page: newPage } : 
        prevParams;
    });
  }

  onPageSizeChange(newPageSize: number) {
    this.pagingParams.update(prevParams => {
      return prevParams ? 
        { ...prevParams, pageSize: newPageSize } : 
        prevParams;
    });
  }
}
