using API.Entities;

namespace API.Interfaces;

public interface ILikeRepository
{
    Task<MemberLike?> GetLikeAsync(string sourceMemberId, string targetMemberId);

    Task<IReadOnlyList<Member>> GetLikedMembersAsync(string memberId);

    Task<IReadOnlyList<Member>> GetLikedByMembersAsync(string memberId);

    Task<IReadOnlyList<Member>> GetMutualLikesAsync(string memberId);

    Task<IReadOnlyList<string>> GetLikedMemberIdsAsync(string memberId);

    void AddLike(MemberLike like);

    void DeleteLike(MemberLike like);

    Task<bool> SaveAllAsync();
}
