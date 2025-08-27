namespace API.DTOs;

public record CreateMessageDto(
    string RecipientId,
    string Content);
