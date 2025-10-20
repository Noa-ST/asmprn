using ASMPRN232.Data;
using ASMPRN232.Models;
using ASMPRN232.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ASMPRN232.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AppDbContext context, IConfiguration configuration, ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            try
            {
                if (_context.Users.Any(u => u.Email == dto.Email))
                    return BadRequest(new { message = "Email already exists" });

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

                var user = new User
                {
                    Email = dto.Email,
                    PasswordHash = passwordHash
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User registered successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "Internal Server Error during registration" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            try
            {
                _logger.LogInformation($"[LOGIN] Attempt for email: {dto.Email}");

                var user = _context.Users.FirstOrDefault(u => u.Email == dto.Email);
                if (user == null)
                {
                    _logger.LogWarning("[LOGIN] Email not found: {Email}", dto.Email);
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                {
                    _logger.LogWarning("[LOGIN] Wrong password for email: {Email}", dto.Email);
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                // --- Validate JWT Config ---
                var keyValue = _configuration["Jwt:Key"];
                var issuer = _configuration["Jwt:Issuer"];
                var audience = _configuration["Jwt:Audience"];

                if (string.IsNullOrEmpty(keyValue) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
                {
                    _logger.LogError("[JWT ERROR] Missing JWT configuration. Key: {Key}, Issuer: {Issuer}, Audience: {Audience}",
                        keyValue, issuer, audience);
                    return StatusCode(500, new { message = "Server misconfigured: missing JWT settings" });
                }

                // --- Create JWT ---
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyValue));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                var token = new JwtSecurityToken(
                    issuer: issuer,
                    audience: audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddHours(1),
                    signingCredentials: creds
                );

                var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

                _logger.LogInformation("[LOGIN SUCCESS] User {Email} logged in successfully", dto.Email);

                return Ok(new { token = tokenString });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[LOGIN ERROR] Unexpected server error during login");
                return StatusCode(500, new { message = "Internal Server Error during login" });
            }
        }
    }
}
