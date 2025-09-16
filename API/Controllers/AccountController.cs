using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(
    UserManager<AppUser> userManager, ITokenService tokenService) 
    : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            UserName = registerDto.Email,
            Member = new Member
            {
                DisplayName = registerDto.DisplayName,
                Gender = registerDto.Gender,
                Country = registerDto.Country,
                City = registerDto.City,
                DateOfBirth = registerDto.DateOfBirth
            }
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("identity", error.Description);
            }

            return ValidationProblem();
        }

        await userManager.AddToRoleAsync(user, nameof(UserRoles.Member));

        await SetRefreshTokenCookie(user);

        return await user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);

        if (user is null)
        {
            return Unauthorized("Invalid email address.");
        }

        var isValidPassword = await userManager.CheckPasswordAsync(user, loginDto.Password);

        if (!isValidPassword)
        {
            return Unauthorized("Invalid password.");
        }

        await SetRefreshTokenCookie(user);

        return await user.ToDto(tokenService);
    }

    [HttpPost("refresh-token")]
    public async Task<ActionResult<UserDto>> RefreshToken()
    {
        var refreshTokenExists = Request.Cookies.TryGetValue("refreshToken", out var refreshToken);
        if (!refreshTokenExists) return NoContent();

        var user = await userManager.Users
            .FirstOrDefaultAsync(user => 
                user.RefreshToken == refreshToken && 
                user.RefreshTokenExpiry > DateTime.UtcNow);

        if (user is null) return Unauthorized();

        await SetRefreshTokenCookie(user);

        return await user.ToDto(tokenService);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult> Logout()
    {
        await userManager.Users
            .Where(user => user.Id == User.GetMemberId())
            .ExecuteUpdateAsync(setters => 
                setters.SetProperty(user => user.RefreshToken, _ => null)
                    .SetProperty(user => user.RefreshTokenExpiry, _ => null));

        Response.Cookies.Delete("refreshToken");

        return Ok();
    }

    private async Task SetRefreshTokenCookie(AppUser user)
    {
        var refreshToken = tokenService.GenerateRefreshToken();
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await userManager.UpdateAsync(user);

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(7),
        };

        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}
