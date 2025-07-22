using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SaaSTemplate.Server.Data;
using SaaSTemplate.Server.Model;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public SettingsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET: api/settings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetSettings()
    {
        var settings = await _context.Settings
            .Include(s => s.Options)
            .Select(s => new
            {
                s.Id,
                s.Name,
                s.Type,
                s.Description,
                s.DefaultValue,
                Options = s.Options.Select(o => new { o.Id, o.Value, o.Label }).ToList()
            })
            .ToListAsync();

        return Ok(settings);
    }

    // GET: api/settings/user
    [HttpGet("user")]
    public async Task<ActionResult<IEnumerable<object>>> GetUserSettings()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var userSettings = await _context.UserSettings
            .Where(us => us.UserId == userId)
            .Include(us => us.Setting)
            .Select(us => new
            {
                us.Setting.Id,
                us.Setting.Name,
                us.Value
            })
            .ToListAsync();

        return Ok(userSettings);
    }

    // PUT: api/settings/user/{settingId}
    [HttpPut("user/{settingId}")]
    public async Task<IActionResult> UpdateUserSetting(int settingId, [FromBody] string value)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var setting = await _context.Settings.FindAsync(settingId);
        if (setting == null)
        {
            return NotFound("Setting not found.");
        }

        var userSetting = await _context.UserSettings
            .FirstOrDefaultAsync(us => us.UserId == userId && us.SettingId == settingId);

        if (userSetting == null)
        {
            userSetting = new UserSetting
            {
                UserId = userId,
                SettingId = settingId,
                Value = value
            };
            _context.UserSettings.Add(userSetting);
        }
        else
        {
            userSetting.Value = value;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}