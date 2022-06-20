using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.IdentityModel.Tokens;
using tsbackend.Entities;
using tsbackend.Helpers;
using tsbackend.Models;

namespace tsbackend.Services;

public interface IAuthService
{
    public ClaimsIdentity GetIdentity(User user);
    public string? GetToken(ClaimsIdentity identity);
    public HashModel EncryptPassword(string password);
    public string HashPassword(string enteredPassword, byte[] salt);
}

public class AuthService : IAuthService
{
    //Создание отпечатка пользователя
    public ClaimsIdentity GetIdentity(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimsIdentity.DefaultNameClaimType, user.ID.ToString()),
            new Claim(ClaimsIdentity.DefaultRoleClaimType, user.Role.ToString())
        };
        var claimsIdentity = new ClaimsIdentity(
            claims, "Token", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
        return claimsIdentity;
    }

    //Генерация токена
    public string? GetToken(ClaimsIdentity identity)
    {
        var now = DateTime.UtcNow;
        var jwt = new JwtSecurityToken(
            issuer: AuthHelper.ISSUER,
            audience: AuthHelper.AUDIENCE,
            notBefore: now,
            claims: identity.Claims,
            expires: now.Add(TimeSpan.FromMinutes(AuthHelper.LIFETIME)),
            signingCredentials: new SigningCredentials(AuthHelper.GetSymmetricSecurityKey(),
                SecurityAlgorithms.HmacSha256));
        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
    
    //Шифрование пароля
    public HashModel EncryptPassword(string password)
    {
        byte[] salt = new byte[128 / 8]; // Generate a 128-bit salt using a secure PRNG
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }
        string encryptedPassw = HashPassword(password, salt);
        return new HashModel { Hash = encryptedPassw , Salt = salt };
    }
    
    //Сверка пароля
    public string HashPassword(string enteredPassword, byte[] salt)
    {
        string encryptedPassw = Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: enteredPassword,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8
        ));
        return encryptedPassw;
    }
}