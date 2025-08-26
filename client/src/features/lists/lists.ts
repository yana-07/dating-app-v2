import { Component, effect, inject, signal } from '@angular/core';

import { LikeService } from '../../core/services/like-service';
import { Member } from '../../types/member';
import { MemberCard } from "../members/member-card/member-card";

@Component({
  selector: 'app-lists',
  imports: [MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists {
  private likeService = inject(LikeService);
  protected predicate = signal('liked');
  protected members = signal<Member[]>([]);
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
    this.likeService.getLikes(this.predicate()).subscribe({
      next: members => this.members.set(members)  
    });
  }

  setPredicate(predicate: string) {
    if (predicate !== this.predicate()) {
      this.predicate.set(predicate);
    }
  }
}
