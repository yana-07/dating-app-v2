export type PaginationMetadata = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export type PaginatedResult<T> = {
  metadata: PaginationMetadata;
  items: T[];
}