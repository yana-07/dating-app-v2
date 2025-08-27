using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMessageRepositorycs
{
    void AddMessage(Message message);

    void DeleteMessage(Message message);

    Task<Message?> GetByIdAsync(string messageId);

    Task<PaginatedResult<MessageDto>> GetMessagesForMemberAsync();

    Task<IReadOnlyList<MessageDto>> GetMessageThreadAsync(
        string currentMemberId, string recipientId);

    Task<bool> SaveAllAsync();
}
