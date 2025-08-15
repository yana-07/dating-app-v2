import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';
import { AccountService } from '../../../core/services/account-service';
import { StarButton } from "../../../shared/star-button/star-button";

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload, StarButton],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected loading = signal(false);
  protected photos = signal<Photo[]>([]);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');
    if (memberId) {
      this.memberService.getMemberPhotos(memberId).subscribe({
        next: photos => this.photos.set(photos)
      });
    }
  }

  onUploadPhoto(file: File) {
    this.loading.set(true);

    this.memberService.uploadPhoto(file).subscribe({
      next: photo => {
        this.memberService.toggleEditMode();
        this.loading.set(false);
        this.photos.update(prevPhotos => 
          [ 
            ...prevPhotos, 
            photo
          ]
        );
      },
      error: error => {
        console.error(error);
        this.loading.set(false);
      }
    })
  }

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        this.accountService.updateUserState({ imageUrl: photo.url });
        this.memberService.updateMemberState({ imageUrl: photo.url });
      }
    });
  }
}
