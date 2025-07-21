using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SaaSTemplate.Server.Model;
using SaaSTemplate.Server.Model.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AccountsController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    // POST: api/accounts/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] Register model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
        var result = await _userManager.CreateAsync(user, model.Password);

        if (result.Succeeded)
        {
            return Ok(new { Message = "Registration successful" });
        }

        foreach (var error in result.Errors)
        {
            ModelState.AddModelError(string.Empty, error.Description);
        }
        return BadRequest(ModelState);
    }

    // POST: api/accounts/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] Login model)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null)
        {
            // Don't reveal that the user doesn't exist
            return Unauthorized(new { Message = "Invalid credentials" });
        }

        var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: false);

        if (result.Succeeded)
        {
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        return Unauthorized(new { Message = "Invalid credentials" });
    }

    // GET: api/accounts/externalsignin
    [HttpGet("externalsignin")]
    public IActionResult ExternalSignIn(string provider, string returnUrl = null)
    {
        // Request a redirect to the external login provider.
        var redirectUrl = Url.Action(nameof(ExternalSignInCallback), "Accounts", new { returnUrl });
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
        return Challenge(properties, provider);
    }

    // GET: api/accounts/externalsignincallback
    [HttpGet("externalsignincallback")]
    public async Task<IActionResult> ExternalSignInCallback(string returnUrl = null, string remoteError = null)
    {
        if (remoteError != null)
        {
            return BadRequest(new { Message = $"Error from external provider: {remoteError}" });
        }

        var info = await _signInManager.GetExternalLoginInfoAsync();
        if (info == null)
        {
            return Redirect("/login");
        }

        // Sign in the user with this external login provider if the user already has a login.
        var result = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
        if (result.Succeeded)
        {
            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);
            var token = GenerateJwtToken(user);
            return Redirect($"/login?token={token}");
        }
        if (result.IsLockedOut)
        {
            return Redirect("/lockout");
        }
        else
        {
            // If the user does not have an account, then ask the user to create an account.
            var email = info.Principal.FindFirstValue(ClaimTypes.Email);
            var user = new ApplicationUser { UserName = email, Email = email };
            var createUserResult = await _userManager.CreateAsync(user);
            if (createUserResult.Succeeded)
            {
                var addLoginResult = await _userManager.AddLoginAsync(user, info);
                if (addLoginResult.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    var token = GenerateJwtToken(user);
                    return Redirect($"/login?token={token}");
                }
            }
            return Redirect("/login");
        }
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        // Your secret key should be stored in appsettings.json and be longer/more complex
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            // Jti is a unique identifier for the token
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(1), // Token expiration
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}