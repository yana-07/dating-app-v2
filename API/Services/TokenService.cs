using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API.Services;

public class TokenService(IConfiguration config, UserManager<AppUser> userManager) 
    : ITokenService
{
    public async Task<string> CreateToken(AppUser user)
    {
        var tokenKey = config["Jwt:Key"] ?? throw new Exception("Cannot get token key.");

        if (tokenKey.Length < 64)
        {
            throw new Exception("TokenKey must be at least 64 characters long.");
        }

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha512Signature);

        var roles = await userManager.GetRolesAsync(user);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(
            [
                new(JwtRegisteredClaimNames.Email, user.Email!),
                new(JwtRegisteredClaimNames.Sub, user.Id),
                ..roles.Select(role => new Claim("role", role))
            ]),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = credentials,
            Issuer = config["Jwt:Issuer"],
            Audience = config["Jwt:Audience"]
        };

        var tokenHandler = new JsonWebTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return token;
    }
}
