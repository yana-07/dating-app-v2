import { afterNextRender, AfterViewChecked, AfterViewInit, Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {
  private messageService = inject(MessageService);
  private memberService = inject(MemberService);
  private messageEndRef = viewChild.required<ElementRef<HTMLDivElement>>('messageEnd');
  protected accountService = inject(AccountService);
  protected messages = signal<Message[]>([]);
  protected messageContent = signal('');

  constructor() {
    effect(() => {
      if (this.messages().length > 0) {
        requestAnimationFrame(() => {
          this.scrollToBottom();
        });
      }
    });
  }
  
  ngOnInit(): void {
    this.loadMessages();
  }

  isCurrentUserSender(senderId: string) {
    return this.accountService.currentUser()?.id === senderId;
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;

    this.messageService.sendMessage(recipientId, this.messageContent()).subscribe({
      next: message => {
        this.messages.update(prevMessages => [...prevMessages, message]);
        this.messageContent.set('');
      }
    });
  }

  scrollToBottom() {
    this.messageEndRef().nativeElement.scrollIntoView({ behavior: 'smooth' });      
  }

  private loadMessages() {
    const memberId = this.memberService.member()?.id;
    if (memberId){
      this.messageService.getMessageThread(memberId).subscribe({
        next: messages => this.messages.set(messages)
      });
    }
  }
}
