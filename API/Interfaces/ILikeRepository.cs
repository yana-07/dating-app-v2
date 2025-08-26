using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikeRepository
{
    Task<MemberLike?> GetLikeAsync(string sourceMemberId, string targetMemberId);

    Task<PaginatedResult<Member>> GetLikedMembersAsync(string memberId, PagingParams pagingParams);

    Task<PaginatedResult<Member>> GetLikedByMembersAsync(string memberId, PagingParams pagingParams);

    Task<PaginatedResult<Member>> GetMutualLikesAsync(string memberId, PagingParams pagingParams);

    Task<IReadOnlyList<string>> GetLikedMemberIdsAsync(string memberId);

    void AddLike(MemberLike like);

    void DeleteLike(MemberLike like);

    Task<bool> SaveAllAsync();
}
