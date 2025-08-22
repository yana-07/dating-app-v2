using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public static class PaginationHelper
{

    public static async Task<PaginatedResult<T>> CreateAsync<T>(
        IQueryable<T> query, int page, int pageSize)
    {
        var count = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize).ToListAsync();

        return new PaginatedResult<T>(
            new PaginationMetadata(
                page,
                pageSize,
                (int)Math.Ceiling(count / (double)pageSize),
                count
            ),
            items);
    }
}