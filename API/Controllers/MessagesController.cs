using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(
    IMessageRepository messageRepository,
    IMemberRepository memberRepository) 
    : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> CreateMessage(
        CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (sender is null || recipient is null || sender.Id == createMessageDto.RecipientId)
        {
            return BadRequest("Cannot send this message.");
        }

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        messageRepository.AddMessage(message);

        if (await messageRepository.SaveAllAsync()) return message.ToDto();

        return BadRequest("Failed to send message.");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessagesByContainer(
        [FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();

        return await messageRepository
            .GetMessagesForMemberAsync(messageParams);
    }

    [HttpGet("thread/{otherMemberId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageThread(string otherMemberId)
    {
        return Ok(await messageRepository
            .GetMessageThreadAsync(User.GetMemberId(), otherMemberId));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(string id)
    {
        var memberId = User.GetMemberId();

        var message = await messageRepository.GetByIdAsync(id);

        if (message is null) return BadRequest("Cannot delete this message.");

        if (message.SenderId != memberId && message.RecipientId != memberId)
        {
            return BadRequest("You cannot delete this message.");
        }

        if (message.SenderId == memberId)
        {
            message.SenderDeleted = true;
        }

        if (message.RecipientId == memberId)
        {
            message.RecipientDeleted = true;
        }

        if (message is { RecipientDeleted: true, SenderDeleted: true })
        {
            messageRepository.DeleteMessage(message);
        }

        if (await messageRepository.SaveAllAsync()) return Ok();

        return BadRequest("Problem deleting the message.");
    }
}
