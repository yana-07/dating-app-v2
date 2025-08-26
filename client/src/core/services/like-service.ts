import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Member } from '../../types/member';
import { PaginatedResult, PagingParams } from '../../types/pagination';

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

  getLikes(predicate: string, pagingParams: PagingParams) {
    const params = new HttpParams()
      .append('predicate', predicate)
      .append('page', pagingParams.page)
      .append('pageSize', pagingParams.pageSize);

    return this.http.get<PaginatedResult<Member>>(`${this.baseUrl}/likes`, { params });
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
