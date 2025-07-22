using System.ComponentModel.DataAnnotations;

namespace SaaSTemplate.Server.Model
{
    public class UserSetting
    {
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public int SettingId { get; set; }
        public Setting Setting { get; set; }

        public string? Value { get; set; }
    }
}
