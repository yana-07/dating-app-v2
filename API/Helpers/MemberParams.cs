namespace API.Helpers;

public record MemberParams : PagingParams
{
    public string? CurrentMemberId { get; set; }

    public string? Gender { get; init; }

    public int? MinAge { get; init; }

    public int? MaxAge { get; init; }
}
