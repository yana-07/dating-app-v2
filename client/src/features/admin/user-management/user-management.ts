import { Component, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';

import { AdminService } from '../../../core/services/admin-service';
import { User } from '../../../types/user';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
  private adminService = inject(AdminService);
  private rolesModal = viewChild.required<ElementRef<HTMLDialogElement>>('rolesModal');
  private toastService = inject(ToastService);
  protected users = signal<User[]>([]);
  protected avaiableRoles = ['Admin', 'Moderator', 'Member'];
  protected selectedUser = signal<User | undefined>(undefined);
  
  ngOnInit(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => this.users.set(users)
    });
  }

  openRolesModal(user: User) {
    this.selectedUser.set(user);
    this.rolesModal().nativeElement.showModal();
  }

  toggleRole(event: Event) {
    if (!this.selectedUser()) return;

    const inputElement = event.target as HTMLInputElement;

    this.selectedUser.update(prevUser => {
      if (!prevUser) return prevUser;

      const roles = inputElement.checked ?
        [...prevUser.roles, inputElement.value] :
        prevUser.roles.filter(role => role !== inputElement.value);

      return {...prevUser, roles};
    }); 
  }

  updateRoles() {
    const selectedUser = this.selectedUser();
    if (!selectedUser) return;

    this.adminService.updateUserRoles(selectedUser.id, selectedUser.roles).subscribe({
      next: updatedRoles => {
        this.users.update(prevUsers => {
          return prevUsers.map(user => 
            user.id === selectedUser.id ? 
              {...selectedUser, roles: updatedRoles} : 
              user
          );
        });

        this.rolesModal().nativeElement.close();
      }    
    });
  }
}
