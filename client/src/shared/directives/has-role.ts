import { Directive, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { AccountService } from '../../core/services/account-service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRole implements OnInit {
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);
  appHasRole = input<string[]>([]);

  ngOnInit(): void {
    if (this.accountService.currentUser()?.roles.some(role => this.appHasRole().includes(role))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
