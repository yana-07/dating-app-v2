import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  page = model(1);
  pageSize = model(10);
  totalCount = input.required<number>();
  totalPages = input.required()
  pageSizeOptions = input([5, 10, 20, 50]);
  lastItemIndex = computed(() => {
    return Math.min(
      this.page() * this.pageSize(),
      this.totalCount());
  });

  onPageChange(newPage?: number, eventTarget?: EventTarget | null) {
    if (newPage) this.page.set(newPage);
    if (eventTarget) {
      const newPageSize = Number((eventTarget as HTMLSelectElement).value);
      this.pageSize.set(newPageSize);
    }
  }
}
