namespace API.DTOs;

public record MessageDto(
    string Id,
    string SenderId,
    string SenderDisplayName,
    string? SenderImageUrl,
    string RecipientId,
    string RecipientDisplayName,
    string? RecipientImageUrl,
    string Content,
    DateTime DateSent,
    DateTime? DateRead);
