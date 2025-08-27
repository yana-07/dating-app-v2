using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;

namespace API.Data;

public class MessageRepository(AppDbContext dbContext) 
    : IMessageRepositorycs
{
    public void AddMessage(Message message)
    {
        dbContext.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        dbContext.Messages.Remove(message);
    }

    public async Task<Message?> GetByIdAsync(string messageId)
    {
        return await dbContext.Messages.FindAsync(messageId);
    }

    public Task<PaginatedResult<MessageDto>> GetMessagesForMemberAsync()
    {
        throw new NotImplementedException();
    }

    public Task<IReadOnlyList<MessageDto>> GetMessageThreadAsync(
        string currentMemberId, string recipientId)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }
}
