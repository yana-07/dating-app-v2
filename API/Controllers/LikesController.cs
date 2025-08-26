using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(ILikeRepository likeRepository) :
    BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (sourceMemberId == targetMemberId)
            return BadRequest("You cannot like yourself.");

        var existingLike = await likeRepository
            .GetLikeAsync(sourceMemberId, targetMemberId);

        if (existingLike is null)
        {
            var like = new MemberLike
            { 
                SourceMemberId = sourceMemberId, 
                TargetMemberId = targetMemberId 
            };

            likeRepository.AddLike(like);
        }
        else
        {
            likeRepository.DeleteLike(existingLike);
        }

        if (await likeRepository.SaveAllAsync()) return Ok();

        return BadRequest("Failed to update like.");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetLikedMemberIds()
    {
        return Ok(await likeRepository.GetLikedMemberIdsAsync(User.GetMemberId()));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetLikes(string predicate)
    {
        var memberId = User.GetMemberId();

        return predicate.ToLower() switch
        {
            "liked" => Ok(await likeRepository.GetLikedMembersAsync(memberId)),
            "likedby" => Ok(await likeRepository.GetLikedByMembersAsync(memberId)),
            "mutual" => Ok(await likeRepository.GetMutualLikesAsync(memberId)),
            _ => BadRequest("Invalid predicate. Use 'liked', 'likedby', or 'mutual'.")
        };
    }
}
