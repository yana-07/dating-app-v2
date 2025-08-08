import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';

import { MemberService } from '../../../core/services/member-service';
import { Member } from '../../../types/member';

@Component({
  selector: 'app-member-detailed',
  imports: [AsyncPipe, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected member$?: Observable<Member>;
  protected title = signal<string | undefined>('Profile');

  ngOnInit(): void {
    this.member$ = this.loadMember();

    this.title.set(this.route.firstChild?.snapshot.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => this.title.set(this.route.firstChild?.snapshot.title)
    });
  }

  loadMember(): Observable<Member> | undefined {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return undefined;

    return this.memberService.getMember(id);
  }
}
