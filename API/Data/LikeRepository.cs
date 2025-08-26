using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikeRepository(AppDbContext dbContext) : ILikeRepository
{
    public async Task<MemberLike?> GetLikeAsync(
        string sourceMemberId, string targetMemberId)
    {
        return await dbContext.Likes
            .FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<IReadOnlyList<string>> GetLikedMemberIdsAsync(
        string memberId)
    {
        return await dbContext.Likes
            .Where(like => like.SourceMemberId == memberId)
            .Select(like => like.TargetMemberId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Member>> GetLikedMembersAsync(string memberId)
    {
        return await dbContext.Likes
            .Where(like => like.SourceMemberId == memberId)
            .Select(like => like.TargetMember)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Member>> GetLikedByMembersAsync(string memberId)
    {
        return await dbContext.Likes
            .Where(like => like.TargetMemberId == memberId)
            .Select(like => like.SourceMember)
            .ToListAsync();
    }  

    public async Task<IReadOnlyList<Member>> GetMutualLikesAsync(string memberId)
    {
        var memberLikedMemberIds = await GetLikedMemberIdsAsync(memberId);

        return await dbContext.Likes
            .Where(like => like.TargetMemberId == memberId &&
                memberLikedMemberIds.Contains(like.SourceMemberId))
            .Select(like => like.SourceMember)
            .ToListAsync();
    }

    public void AddLike(MemberLike like)
    {
        dbContext.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        dbContext.Likes.Remove(like);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }
}
