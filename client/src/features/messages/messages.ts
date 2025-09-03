import { Component, effect, inject, signal } from '@angular/core';

import { MessageService } from '../../core/services/message-service';
import { PaginatedResult, PagingParams } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-messages',
  imports: [Paginator],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {
  private messageService = inject(MessageService);
  private pagingParams = signal(new PagingParams());
  protected container = signal('Inbox');
  protected paginatedMessages = signal<PaginatedResult<Message> | undefined>(undefined);
  protected tabs = [
    { label: 'Inbox', value: 'Inbox' },
    { label: 'Outbox', value: 'Outbox' }
  ];

  constructor() {
    effect(() => {
      this.loadMessages();
    });  
  }

  loadMessages() {
    this.messageService.getMessages(this.container(), this.pagingParams()).subscribe({
      next: paginatedResult => this.paginatedMessages.set(paginatedResult)  
    });
  }

  onPageChange(newPage: number) {
    this.pagingParams.update(prevParams => {
      return prevParams ?
        { ...prevParams, page: newPage } : 
        prevParams;
    });
  }

  onPageSizeChange(newPageSize: number) {
    this.pagingParams.update(prevParams => {
      return prevParams ? 
        { ...prevParams, pageSize: newPageSize } : 
        prevParams;
    });
  }

  onContainerChange(newContainer: string) {
    if (newContainer !== this.container()) {
      this.container.set(newContainer);
      this.pagingParams.update(prevParams => {
        return prevParams ?
          { ...prevParams, page: 1 } :
          prevParams;
      });
    }
  }

  get isInbox() {
    return this.container() === 'Inbox';
  }
}
