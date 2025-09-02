using API.DTOs;
using API.Entities;
using System.Linq.Expressions;

namespace API.Extensions;

public static class MessageExtensions
{
    public static MessageDto ToDto(this Message message)
    {
        return new MessageDto(
            message.Id,
            message.SenderId,
            message.Sender.DisplayName,
            message.Sender.ImageUrl,
            message.RecipientId,
            message.Recipient.DisplayName,
            message.Recipient.ImageUrl,
            message.Content,
            message.DateSent,
            message.DateRead);
    }

    public static Expression<Func<Message, MessageDto>> ToDtoProjection()
    {
        return message => new MessageDto(
            message.Id,
            message.SenderId,
            message.Sender.DisplayName,
            message.Sender.ImageUrl,
            message.RecipientId,
            message.Recipient.DisplayName,
            message.Recipient.ImageUrl,
            message.Content,
            message.DateSent,
            message.DateRead);
    }
}
