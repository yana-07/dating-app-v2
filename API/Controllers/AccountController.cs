using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers;

public class AccountController(
    AppDbContext dbContext, ITokenService tokenService) 
    : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await EmailExists(registerDto.Email))
        {
            return BadRequest("Email is taken.");
        }

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key,
            Member = new Member
            {
                DisplayName = registerDto.DisplayName,
                Gender = registerDto.Gender,
                Country = registerDto.Country,
                City = registerDto.City,
                DateOfBirth = registerDto.DatOfBirth
            }
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return user.ToDto(tokenService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await dbContext.Users
            .SingleOrDefaultAsync(user =>
                user.Email.ToLower() == loginDto.Email.ToLower());

        if (user is null)
        {
            return Unauthorized("Invalid email address.");
        }

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i])
            {
                return Unauthorized("Invalid password.");
            }
        }

        return user.ToDto(tokenService);
    }

    private async Task<bool> EmailExists(string email)
    {
        return await dbContext.Users
            .AnyAsync(user => user.Email.ToLower() == email.ToLower());
    }
}
