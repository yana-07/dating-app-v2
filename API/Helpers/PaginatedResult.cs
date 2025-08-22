namespace API.Helpers;

public record PaginatedResult<T>(
    PaginationMetadata Metadata,
    List<T> Items);
