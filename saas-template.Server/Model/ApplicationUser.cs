using Microsoft.AspNetCore.Identity;

namespace SaaSTemplate.Server.Model
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<UserSetting> UserSettings { get; set; } = new List<UserSetting>();
    }
}
