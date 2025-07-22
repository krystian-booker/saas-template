using System.Text.Json.Serialization;

namespace SaaSTemplate.Server.Model.DTOs
{
    public class IgdbCover
    {
        [JsonPropertyName("url")]
        public string Url { get; set; }
    }
}
