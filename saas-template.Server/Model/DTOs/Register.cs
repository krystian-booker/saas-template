using System.ComponentModel.DataAnnotations;

namespace SaaSTemplate.Server.Model.DTOs
{
    public class Register
    {
        [Required]
        [EmailAddress]
        public string? Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 8)]
        public string? Password { get; set; }
    }
}
