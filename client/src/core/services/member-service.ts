import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { EditableMember, Member } from '../../types/member';
import { Photo } from '../../types/photo';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private _isEditMode = signal(false);
  member = signal<Member | undefined>(undefined);
  isEditMode = this._isEditMode.asReadonly();

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}/members`);
  }

  getMember(id: string) {
    return this.http.get<Member>(`${this.baseUrl}/members/${id}`).pipe(
      tap({
        next: member => this.member.set(member)
      })
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}/members/${id}/photos`);
  }

  toggleEditMode() {
    this._isEditMode.update(prevValue => !prevValue);
  }

  updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}/members`, member);
  }
}
