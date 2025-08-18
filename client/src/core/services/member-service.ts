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
  private _member = signal<Member | undefined>(undefined);
  member = this._member.asReadonly();
  isEditMode = this._isEditMode.asReadonly();

  getMembers() {
    return this.http.get<Member[]>(`${this.baseUrl}/members`);
  }

  getMember(id: string) {
    return this.http.get<Member>(`${this.baseUrl}/members/${id}`).pipe(
      tap({
        next: member => this._member.set(member)
      })
    );
  }

  getMemberPhotos(id: string) {
    return this.http.get<Photo[]>(`${this.baseUrl}/members/${id}/photos`);
  }

  updateMember(member: EditableMember) {
    return this.http.put(`${this.baseUrl}/members`, member);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Photo>(`${this.baseUrl}/members/add-photo`, formData);
  }

  setMainPhoto(photoId: number) {
    return this.http.put(
      `${this.baseUrl}/members/set-main-photo/${photoId}`,
      {}
    );
  }

  toggleEditMode() {
    this._isEditMode.update(prevValue => !prevValue);
  }

  updateMemberState(member: Partial<Member>) {
    this._member.update(prevMember =>
      prevMember ? { ...prevMember, ...member } : prevMember
    );
  }

  deletePhoto(photoId: number) {
    return this.http.delete(`${this.baseUrl}/members/delete-photo/${photoId}`);
  }
}
