using System.Text.Json.Serialization;

namespace SaaSTemplate.Server.Model.DTOs
{
    public class IgdbGame
    {
        [JsonPropertyName("id")]
        public long Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; }

        [JsonPropertyName("summary")]
        public string Summary { get; set; }

        [JsonPropertyName("storyline")]
        public string Storyline { get; set; }

        [JsonPropertyName("rating")]
        public double Rating { get; set; }

        [JsonPropertyName("cover")]
        public IgdbCover Cover { get; set; }
    }
}
