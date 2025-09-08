using API.DTOs;
using API.Entities;
using API.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var memberData = await File.ReadAllTextAsync("Data/MemberSeedData.json");

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var members = JsonSerializer.Deserialize<List<SeedMemberDto>>(memberData, options);

        if (members is null) return;

        foreach (var member in members)
        {
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                UserName = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,
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

            var addMemberResult = await userManager.CreateAsync(user, "Pa$$w0rd");

            if (!addMemberResult.Succeeded)
            {
                Console.WriteLine(addMemberResult.Errors.First().Description);
            }

            await userManager.AddToRoleAsync(user, nameof(UserRoles.Member));
        }

        var admin = new AppUser
        {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            DisplayName = "Admin"
        };

        var addAdminResult = await userManager.CreateAsync(admin, "Pa$$w0rd");
        if (!addAdminResult.Succeeded)
        {
            Console.WriteLine(addAdminResult.Errors.First().Description);
        }

        await userManager.AddToRolesAsync(admin,
            [nameof(UserRoles.Admin), nameof(UserRoles.Moderator)]);
    }
}
