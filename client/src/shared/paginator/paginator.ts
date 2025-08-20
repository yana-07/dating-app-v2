import { Component, computed, input, model } from '@angular/core';

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

  onPageChange(newPage: number) {
    this.page.set(newPage);
  }

  onPageSizeChange(eventTarget: EventTarget | null) {
    const newPageSize = Number((eventTarget as HTMLSelectElement).value);
    this.pageSize.set(newPageSize);
  }
}
