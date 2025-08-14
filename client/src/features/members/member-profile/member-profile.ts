import { Component, inject, OnDestroy, OnInit, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import { EditableMember } from '../../../types/member';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
  host: {
    '(window:beforeunload)': 'notify($event)' 
  }
})
export class MemberProfile implements OnInit, OnDestroy {
  private toast = inject(ToastService);
  private accountService = inject(AccountService);
  protected memberService = inject(MemberService);
  protected editableMember: EditableMember = {
    displayName: '',
    description: '',
    country: '',
    city: ''
  };
  editForm = viewChild<NgForm>('editForm');

  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName ?? '',
      description: this.memberService.member()?.description,
      country: this.memberService.member()?.country ?? '',
      city: this.memberService.member()?.city || '',
    };
  }

  ngOnDestroy(): void {
    if (this.memberService.isEditMode()) {
      this.memberService.toggleEditMode();
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;

    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        this.toast.success('Profile updated successfully.');
        
        const currentUser = this.accountService.currentUser();
        if (
          currentUser &&
          currentUser.displayName !== this.editableMember.displayName
        ) {
          this.accountService.updateUser({
            ...currentUser,
            displayName: this.editableMember.displayName,
          });
        }

        this.memberService.toggleEditMode();
        this.memberService.member.update(prevValue => {
          if (!prevValue) return prevValue;

          return {
            ...prevValue,
            ...this.editableMember
          }; 
        });

        this.editForm()?.reset(this.editableMember);
      }
    });  
  }

  notify($event: BeforeUnloadEvent) {
    if (this.editForm()?.dirty) {
      $event.preventDefault();
    }
  }
}
