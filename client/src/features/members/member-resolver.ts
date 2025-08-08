import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';

import { MemberService } from '../../core/services/member-service';
import { Member } from '../../types/member';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(MemberService);
  const router = inject(Router);
  const memberId = route.paramMap.get('ids');

  if (!memberId) {
    return new RedirectCommand(router.parseUrl('/not-found'));
  }

  return memberService.getMember(memberId);
};
