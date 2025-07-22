using Microsoft.AspNetCore.Mvc;
using SaaSTemplate.Server.Data;
using SaaSTemplate.Server.Model;
using SaaSTemplate.Server.Services;

[ApiController]
[Route("api/[controller]")]
public class GamesController : ControllerBase
{
    private readonly IgdbService _igdbService;
    private readonly ApplicationDbContext _context;

    public GamesController(IgdbService igdbService, ApplicationDbContext context)
    {
        _igdbService = igdbService;
        _context = context;
    }

    [HttpPost("import")]
    public async Task<IActionResult> ImportGames()
    {
        var igdbGames = await _igdbService.GetGames();
        if (igdbGames != null && igdbGames.Length > 0)
        {
            var games = igdbGames.Select(g => new Game
            {
                IgdbId = g.Id,
                Name = g.Name,
                Summary = g.Summary,
                Storyline = g.Storyline,
                CoverUrl = g.Cover?.Url,
                Rating = g.Rating
            });

            await _context.Games.AddRangeAsync(games);
            await _context.SaveChangesAsync();
        }
        return Ok();
    }
}