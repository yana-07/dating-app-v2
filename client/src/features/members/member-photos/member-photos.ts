import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MemberService } from '../../../core/services/member-service';
import { Photo } from '../../../types/photo';
import { ImageUpload } from '../../../shared/image-upload/image-upload';

@Component({
  selector: 'app-member-photos',
  imports: [ImageUpload],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
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
}
