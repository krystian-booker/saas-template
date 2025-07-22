using System.ComponentModel.DataAnnotations;

namespace SaaSTemplate.Server.Model
{
    public class Game
    {
        [Key]
        public int Id { get; set; }
        public long IgdbId { get; set; }
        public string? Name { get; set; }
        public string? Summary { get; set; }
        public string? Storyline { get; set; }
        public string? CoverUrl { get; set; }
        public double? Rating { get; set; }
    }
}
