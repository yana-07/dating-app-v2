using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;

    public DateOnly DateOfBirth { get; set; }

    public string? ImageUrl { get; set; }

    public required string DisplayName { get; set; }

    public DateTime Created { get; set; } = DateTime.UtcNow;

    public DateTime LastActive { get; set; } = DateTime.UtcNow;

    public required string Gender { get; set; }

    public string? Description { get; set; }

    public required string Country { get; set; }

    public required string City { get; set; }

    public List<Photo> Photos { get; set; } = [];

    [ForeignKey(nameof(AppUser))]
    public string AppUserId { get; set; } = null!;

    public AppUser AppUser { get; set; } = null!;
}
