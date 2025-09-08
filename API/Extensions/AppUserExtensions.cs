using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static async Task<UserDto> ToDto(
        this AppUser user, ITokenService tokenService)
    {
        return new UserDto(
            user.Id,user.Email!,
            user.DisplayName,
            await tokenService.CreateToken(user),
            user.ImageUrl);
    }
}
