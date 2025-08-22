namespace API.DTOs;

public record UserDto(
    string Id,
    string Email,
    string DisplayName,
    string Token,
    string? ImageUrl);
