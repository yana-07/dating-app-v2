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

export class PagingParams {
  page = 1;
  pageSize = 10;
}