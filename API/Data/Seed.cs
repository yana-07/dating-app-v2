using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsersAsync(AppDbContext context)
    {
        if (await context.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/MemberSeedData.json");

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var members = JsonSerializer.Deserialize<List<SeedMemberDto>>(memberData, options);

        if (members is null) return;

        foreach (var member in members)
        {
            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("Pa$$w0rd")),
                PasswordSalt = hmac.Key,
                MemberId = member.Id,
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    Gender = member.Gender,
                    Country = member.Country,
                    City = member.City,
                    LastActive = member.LastActive,
                    Created = member.Created
                }
            };

            user.Member.Photos.Add(new Photo 
            { 
                Url = member.ImageUrl!,
                MemberId = member.Id
            });

            context.Users.Add(user);
        }

        await context.SaveChangesAsync();
    }
}
