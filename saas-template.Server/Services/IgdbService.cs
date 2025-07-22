using System.Net.Http.Headers;
using System.Text.Json;
using SaaSTemplate.Server.Model.DTOs;
namespace SaaSTemplate.Server.Services
{
    public class IgdbService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private string _accessToken;

        public IgdbService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        private async Task Authenticate()
        {
            var clientId = _configuration["IGDB:ClientId"];
            var clientSecret = _configuration["IGDB:ClientSecret"];

            var response = await _httpClient.PostAsync($"https://id.twitch.tv/oauth2/token?client_id={clientId}&client_secret={clientSecret}&grant_type=client_credentials", null);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var token = JsonDocument.Parse(content).RootElement.GetProperty("access_token").GetString();
            _accessToken = token;
        }

        public async Task<IgdbGame[]> GetGames()
        {
            if (string.IsNullOrEmpty(_accessToken))
            {
                await Authenticate();
            }

            var request = new HttpRequestMessage(HttpMethod.Post, "https://api.igdb.com/v4/games");
            request.Headers.Add("Client-ID", _configuration["IGDB:ClientId"]);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
            request.Content = new StringContent("fields name,summary,storyline,cover.url,rating; limit 50;");

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync();
            var games = JsonSerializer.Deserialize<IgdbGame[]>(content);

            return games;
        }
    }
}