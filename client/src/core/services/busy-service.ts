import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = signal(0);

  busy() {
    this.busyRequestCount
      .update(prevValue => prevValue + 1);
  }

  idle() {
    this.busyRequestCount
      .update(prevValue => Math.max(0, prevValue - 1));
  }
}
