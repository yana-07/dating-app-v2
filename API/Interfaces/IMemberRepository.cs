using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRepository
{
    Task<Member?> GetMemberByIdAsync(string id);

    Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams);

    Task<IReadOnlyList<Photo>> GetPhotosForMeberAsync(string memberId); 

    Task<bool> SaveAllAsync();

    void Update(Member member);

    Task<Member?> GetMemberForUpdateAsync(string id);
}
