namespace API.DTOs;

public class SeedMemberDto
{
    public required string Id { get; init; }

    public required string Email { get; init; }

    public DateOnly DateOfBirth { get; init; }

    public string? ImageUrl { get; init; }

    public required string DisplayName { get; init; }

    public DateTime Created { get; init; }

    public DateTime LastActive { get; init; }

    public required string Gender { get; init; }

    public string? Description { get; init; }

    public required string Country { get; init; }

    public required string City { get; init; }
}
