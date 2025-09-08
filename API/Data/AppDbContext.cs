using API.Data.ValueConverters;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) 
    : IdentityDbContext<AppUser>(options)
{
    public DbSet<Member> Members { get; set; }

    public DbSet<Photo> Photos { get; set; }

    public DbSet<MemberLike> Likes { get; set; }

    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole 
                { 
                    Id = "member-id", 
                    Name = nameof(Enums.UserRoles.Member), 
                    NormalizedName = "MEMBER" 
                },
                new IdentityRole 
                { 
                    Id = "moderator-id", 
                    Name = nameof(Enums.UserRoles.Moderator), 
                    NormalizedName = "MODERATOR" 
                },
                new IdentityRole 
                { 
                    Id="admin-id", 
                    Name = nameof(Enums.UserRoles.Admin), 
                    NormalizedName = "ADMIN" 
                }
            );

        modelBuilder.Entity<MemberLike>()
            .HasKey(memberLike => new 
            { 
                memberLike.SourceMemberId, 
                memberLike.TargetMemberId 
            });

        modelBuilder.Entity<MemberLike>()
            .HasOne(memberLike => memberLike.SourceMember)
            .WithMany(member => member.LikedMembers)
            .HasForeignKey(memberLike => memberLike.SourceMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MemberLike>()
            .HasOne(memberLike => memberLike.TargetMember)
            .WithMany(member => member.LikedByMembers)
            .HasForeignKey(memberLike => memberLike.TargetMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Message>()
            .HasOne(message => message.Sender)
            .WithMany(member => member.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(message => message.Recipient)
            .WithMany(member => member.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
    }

    protected override void ConfigureConventions(
        ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder
            .Properties<DateTime>()
            .HaveConversion<DateTimeUtcConverter>();
    }
}
