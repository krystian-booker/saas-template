using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SaaSTemplate.Server.Model;

namespace SaaSTemplate.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // This must be called first to configure the Identity model
            base.OnModelCreating(builder);

            // Manually override the table names
            builder.Entity<ApplicationUser>(b => { b.ToTable("asp_net_users"); });
            builder.Entity<IdentityUserClaim<string>>(b => { b.ToTable("asp_net_user_claims"); });
            builder.Entity<IdentityUserLogin<string>>(b => { b.ToTable("asp_net_user_logins"); });
            builder.Entity<IdentityUserToken<string>>(b => { b.ToTable("asp_net_user_tokens"); });
            builder.Entity<IdentityRole>(b => { b.ToTable("asp_net_roles"); });
            builder.Entity<IdentityRoleClaim<string>>(b => { b.ToTable("asp_net_role_claims"); });
            builder.Entity<IdentityUserRole<string>>(b => { b.ToTable("asp_net_user_roles"); });

            // Constraints
            builder.Entity<UserSetting>()
                .HasIndex(us => new { us.UserId, us.SettingId })
                .IsUnique();
        }

        public DbSet<Setting> Settings { get; set; }
        public DbSet<SettingOption> SettingOptions { get; set; }
        public DbSet<UserSetting> UserSettings { get; set; }
        public DbSet<Game> Games { get; set; }
    }
}
