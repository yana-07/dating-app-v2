using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MemberRepository(AppDbContext context) : IMemberRepository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParams memberParams)
    {
        var query = context.Members
            .Where(member => member.Id != memberParams.CurrentMemberId);

        if (memberParams.Gender is not null)
        {
            query = query.Where(member => member.Gender == memberParams.Gender);
        }

        var minDateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        query = query.Where(member => member.DateOfBirth >= minDateOfBirth);

        var maxDateOfBirth = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
        query = query.Where(member => member.DateOfBirth <= maxDateOfBirth);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(member => member.Created),
            _ => query.OrderByDescending(member => member.LastActive)
        };
        
        return await PaginationHelper.CreateAsync(
            query, memberParams.Page, memberParams.PageSize);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMeberAsync(
        string memberId)
    {
        return await context.Members
            .Where(member => member.Id == memberId)
            .SelectMany(member => member.Photos)
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }

    public async Task<Member?> GetMemberForUpdateAsync(string id)
    {
        return await context.Members
            .Include(member => member.AppUser)
            .Include(member => member.Photos)
            .SingleOrDefaultAsync(member => member.Id == id);
    }
}
