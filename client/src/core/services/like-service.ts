import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../types/member';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private _likedMemberIds = signal<string[]>([]);
  likedMemberIds = this._likedMemberIds.asReadonly();

  toggleLike(memberId: string) {
    return this.http.post(`${this.baseUrl}/likes/${memberId}`, {});
  }

  getLikes(predicate: string) {
    return this.http.get<Member[]>(`${this.baseUrl}/likes?predicate=${predicate}`);
  }

  getLikedMemberIds() {
    return this.http.get<string[]>(`${this.baseUrl}/likes/list`).subscribe({
      next: ids => this._likedMemberIds.set(ids)
    });
  }

  addLikedMemberId(memberId: string) {
    this._likedMemberIds.update(prevIds => [...prevIds, memberId]);
  }

  removeLikedMemberId(memberId: string) {
    this._likedMemberIds.update(prevIds => prevIds.filter(id => id !== memberId));
  }

  clearLikedMemberIds() {
    this._likedMemberIds.set([]);  
  }
}
