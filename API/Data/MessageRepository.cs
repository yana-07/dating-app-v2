using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository(AppDbContext dbContext) 
    : IMessageRepository
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

    public Task<PaginatedResult<MessageDto>> GetMessagesForMemberAsync(
        MessageParams messageParams)
    {
        var query = dbContext.Messages
            .OrderByDescending(message => message.DateSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            "Outbox" => query.Where(message => message.SenderId == messageParams.MemberId),
            _ => query.Where(message => message.RecipientId == messageParams.MemberId)
        };

        return PaginationHelper.CreateAsync(
            query.Select(MessageExtensions.ToDtoProjection()),
            messageParams.Page,
            messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThreadAsync(
        string currentMemberId, string otherMemberId)
    {
        await MarkAsReadAsync(currentMemberId, otherMemberId);

        return await dbContext.Messages
            .Where(message => (message.RecipientId == currentMemberId && message.SenderId == otherMemberId) ||
                (message.RecipientId == otherMemberId && message.SenderId == currentMemberId))
            .OrderBy(messaage => messaage.DateSent)
            .Select(MessageExtensions.ToDtoProjection())
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }

    private async Task MarkAsReadAsync(string recipientId, string senderId)
    {
        await dbContext.Messages
            .Where(message => message.RecipientId == recipientId &&
                message.SenderId == senderId &&
                message.DateRead == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(
                message => message.DateRead, DateTime.UtcNow));
    }
}
