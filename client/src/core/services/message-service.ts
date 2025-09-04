import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { PaginatedResult, PagingParams } from '../../types/pagination';
import { Message } from '../../types/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getMessages(container: string, pagingParams: PagingParams) {
    const params = new HttpParams()
    .append('page', pagingParams.page)
    .append('pageSize', pagingParams.pageSize)
    .append('container', container);

    return this.http.get<PaginatedResult<Message>>(
      `${this.baseUrl}/messages`, { params });
  }

  getMessageThread(otherMemberId: string) {
    return this.http.get<Message[]>(
      `${this.baseUrl}/messages/thread/${otherMemberId}`);
  }

  sendMessage(recipientId: string, content: string) {
    return this.http.post<Message>(
      `${this.baseUrl}/messages`, { recipientId, content });
  }

  deleteMessage(messageId: string) {
    return this.http.delete(
      `${this.baseUrl}/messages/${messageId}`);
  }
}
