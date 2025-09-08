using API.Entities;
using API.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseApiController
{
    [HttpGet("users-with-roles")]
    [Authorize(Roles = nameof(UserRoles.Admin))]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users.ToListAsync();
        var usersWithRoles = new List<object>();

        foreach (var user in users)
        {
            usersWithRoles.Add(new
            {
                user.Id,
                user.Email,
                Roles = await userManager.GetRolesAsync(user)
            });
        }

        return Ok(usersWithRoles);
    }

    [Authorize(Roles = nameof(UserRoles.Admin))]
    [HttpPost("edit-roles/{userId}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userId, string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You must select at least one role.");

        var selectedRoles = roles.Split(',');

        var user = await userManager.FindByIdAsync(userId);
        if (user is null) return BadRequest("Could not retrieve user.");

        var userRoles = await userManager.GetRolesAsync(user);

        var addToRolesResult = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!addToRolesResult.Succeeded) return BadRequest("Failed to add user to roles.");

        var removeFromRoelsResult = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!removeFromRoelsResult.Succeeded) return BadRequest("Failed to remove user from roles.");

        return Ok(await userManager.GetRolesAsync(user));
    }


    [HttpGet("photos-to-moderate")]
    [Authorize(Policy = "ModeratePhoto")]
    public ActionResult<string> GetPhotosForModeration()
    {
        return Ok("Only admins or moderators can see this.");
    }
}
