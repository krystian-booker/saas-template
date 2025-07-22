using System.ComponentModel.DataAnnotations;

namespace SaaSTemplate.Server.Model
{
    public class SettingOption
    {
        public int Id { get; set; }

        public int SettingId { get; set; }
        public Setting Setting { get; set; }

        [Required]
        [StringLength(100)]
        public string Value { get; set; }

        [StringLength(100)]
        public string? Label { get; set; }
    }
}
