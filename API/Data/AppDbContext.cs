using API.Data.ValueConverters;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) 
    : DbContext(options)
{
    public DbSet<AppUser> Users { get; set; }

    public DbSet<Member> Members { get; set; }

    public DbSet<Photo> Photos { get; set; }

    public DbSet<MemberLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
