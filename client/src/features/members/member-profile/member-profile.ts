import { Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

import { EditableMember, Member } from '../../../types/member';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  protected member = signal<Member | undefined>(undefined);
  protected memberService = inject(MemberService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    country: '',
    city: ''
  };
  editForm = viewChild<NgForm>('editForm');

  ngOnInit(): void {
    this.route.parent?.data.subscribe({
      next: data => this.member.set(data['member'])
    });

    this.editableMember = {
      displayName: this.member()?.displayName ?? '',
      description: this.member()?.description,
      country: this.member()?.country ?? '',
      city: this.member()?.city || '',
    };
  }

  ngOnDestroy(): void {
    if (this.memberService.isEditMode()) {
      this.memberService.toggleEditMode();
    }
  }

  updateProfile() {
    const updatedMember = { ... this.member(), ...this.editableMember };
    console.log(updatedMember);
    this.toast.success('Profile updated successfully.');
    this.memberService.toggleEditMode();
  }
}
