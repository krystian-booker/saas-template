using System.ComponentModel.DataAnnotations;

namespace SaaSTemplate.Server.Model
{
    public class Setting
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(50)]
        public string Type { get; set; } // e.g., "boolean", "string", "number", "date"

        public string? Description { get; set; }

        public string? DefaultValue { get; set; }

        public ICollection<SettingOption> Options { get; set; } = new List<SettingOption>();
    }
}