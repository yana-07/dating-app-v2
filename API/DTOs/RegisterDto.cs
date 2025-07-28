using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public record RegisterDto
{
    [Required]
    public string DisplayName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(4)]
    public string Password { get; init; } = string.Empty;
}
