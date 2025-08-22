using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static UserDto ToDto(
        this AppUser user, ITokenService tokenService)
    {
        return new UserDto(
            user.Id,user.Email,
            user.DisplayName,
            tokenService.CreateToken(user),
            user.ImageUrl);
    }
}
