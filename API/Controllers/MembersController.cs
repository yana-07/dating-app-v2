using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers;

[Authorize]
public class MembersController(IMemberRepository memberRepository) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers()
    {
        return Ok(await memberRepository.GetMembersAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Member>> GetMember(string id)
    {
        var member = await memberRepository.GetMemberByIdAsync(id);

        if (member is null) return NotFound();

        return member;
    }

    [HttpGet("{id}/photos")]
    public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
    {
        return Ok(await memberRepository.GetPhotosForMeberAsync(id));
    }

    [HttpPut]
    public async Task<ActionResult> UpdateMemberAsync(MemberUpdateDto memberUpdateDto)
    {
        var memberId = User.GetMemberId();

        var member = await memberRepository.GetMemberForUpdateAsync(memberId);

        if (member is null)
        {
            return BadRequest("Could not get member.");
        }

        member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
        member.Description = memberUpdateDto.Description ?? member.Description;
        member.Country = memberUpdateDto.Country ?? member.Country;
        member.City = memberUpdateDto.City ?? member.City;

        member.AppUser.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;

        memberRepository.Update(member);

        if (await memberRepository.SaveAllAsync())
        {
            return NoContent();
        }

        return BadRequest("Failed to update member.");
    }
}
