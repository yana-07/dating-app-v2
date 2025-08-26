import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikeService } from '../../../core/services/like-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard {
  private likeService = inject(LikeService);
  protected member = input.required<Member>();
  protected isLiked = computed(() => 
    this.likeService
      .likedMemberIds()
      .includes(this.member().id)
  );

  toggleLike(event: Event) {
    event.stopPropagation();

    this.likeService.toggleLike(this.member().id).subscribe({
      next: () => {
        if (this.isLiked()) {
          this.likeService.removeLikedMemberId(this.member().id);
        } else {
          this.likeService.addLikedMemberId(this.member().id);
        }
      }
    })
  }
}
