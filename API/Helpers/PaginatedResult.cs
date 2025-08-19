namespace API.Helpers;

public record PaginatedResult<T>
{
    public PaginationMetadata Metadata { get; init; } = null!;

    public List<T> Items { get; init; } = [];
}
