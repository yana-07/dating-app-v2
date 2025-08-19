namespace API.Helpers;

public record PaginationMetadata(
    int Page,
    int PageSize,
    int TotalPages,
    int TotalCount);