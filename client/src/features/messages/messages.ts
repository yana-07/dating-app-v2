import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { MessageService } from '../../core/services/message-service';
import { PaginatedResult, PagingParams } from '../../types/pagination';
import { Message } from '../../types/message';
import { Paginator } from "../../shared/paginator/paginator";

@Component({
  selector: 'app-messages',
  imports: [Paginator, RouterLink, DatePipe],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages {
  private messageService = inject(MessageService);
  private pagingParams = signal(new PagingParams());
  private fetchedContainer = signal('inbox');
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
      next: paginatedResult => {
        this.paginatedMessages.set(paginatedResult);
        this.fetchedContainer.set(this.container());
      } 
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

  onDeleteMessage(event: Event, id: string) {
    event.stopPropagation();

    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        if (this.paginatedMessages()?.items.length == 0) return;

        this.paginatedMessages.update(prevMessages => {
          if (!prevMessages) return prevMessages;

          const updatedItems = prevMessages.items.filter(message => message.id !== id);

          const updatedTotalCount = prevMessages.metadata.totalCount - 1;
          const updatedTotalPages = Math.ceil(
            updatedTotalCount / prevMessages.metadata.pageSize);

          const updatedMetadata = {
            ...prevMessages.metadata,
            totalCount: updatedTotalCount,
            totalPages: updatedTotalPages,
            currentPage: Math.min(prevMessages.metadata.page, updatedTotalPages)
          }

          return {
            items: updatedItems,
            metadata: updatedMetadata
          }
        });
      }
    });
  }

  get isInbox() {
    return this.fetchedContainer() === 'Inbox';
  }
}
