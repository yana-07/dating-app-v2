import {
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { MemberService } from '../../../core/services/member-service';

@Component({
  selector: 'app-member-detailed',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css'
})
export class MemberDetailed implements OnInit {
  private route = inject(ActivatedRoute);
  private accountService = inject(AccountService);
  private router = inject(Router);
  protected memberService = inject(MemberService);
  protected title = signal<string | undefined>('Profile');
  private routeId: Signal<string | null | undefined>;
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId();
  });

  constructor() {
    this.routeId = toSignal(
      this.route.paramMap.pipe(map((params) => params.get('id')))
    );
  }

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot.title);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe({
        next: () => this.title.set(this.route.firstChild?.snapshot.title)
      });
  }
}
