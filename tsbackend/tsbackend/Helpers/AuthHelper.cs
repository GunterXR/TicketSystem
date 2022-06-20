using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace tsbackend.Helpers;

public class AuthHelper
{
    public const string ISSUER = "2022TicketServer";
    public const string AUDIENCE = "2022TicketClient";
    const string KEY = "2022TicketSystem2022"; 
    public const int LIFETIME = 720;
    public static SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
    }
}
