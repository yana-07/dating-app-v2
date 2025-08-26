using API.Entities;
using API.Helpers;
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

    public async Task<PaginatedResult<Member>> GetLikedMembersAsync(
        string memberId, PagingParams pagingParams)
    {
        return await PaginationHelper.CreateAsync(
            dbContext.Likes
                .Where(like => like.SourceMemberId == memberId)
                .Select(like => like.TargetMember),
            pagingParams.Page,
            pagingParams.PageSize);
    }

    public async Task<PaginatedResult<Member>> GetLikedByMembersAsync(
        string memberId, PagingParams pagingParams)
    {
        return await PaginationHelper.CreateAsync(
            dbContext.Likes
                .Where(like => like.TargetMemberId == memberId)
                .Select(like => like.SourceMember),
            pagingParams.Page,
            pagingParams.PageSize);
    }  

    public async Task<PaginatedResult<Member>> GetMutualLikesAsync(
        string memberId, PagingParams pagingParams)
    {
        var memberLikedMemberIds = await GetLikedMemberIdsAsync(memberId);

        return await PaginationHelper.CreateAsync(
            dbContext.Likes
                .Where(like => like.TargetMemberId == memberId &&
                    memberLikedMemberIds.Contains(like.SourceMemberId))
                .Select(like => like.SourceMember),
            pagingParams.Page,
            pagingParams.PageSize);
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
