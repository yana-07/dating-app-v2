using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    public string DisplayName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(4)]
    public string Password { get; init; } = string.Empty;

    [Required]
    public string Gender { get; init; } = string.Empty;

    [Required]
    public string Country { get; init; } = string.Empty;

    [Required]
    public string City { get; init; } = string.Empty;

    [Required]
    public DateOnly DateOfBirth { get; init; }
}
