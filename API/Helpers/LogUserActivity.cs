using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity(AppDbContext dbContext) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(
        ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContex = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContex.HttpContext.User.GetMemberId();

        await dbContext.Members
            .Where(member => member.Id == memberId)
            .ExecuteUpdateAsync(setters => 
                setters.SetProperty(member => member.LastActive, DateTime.UtcNow));
    }
}
