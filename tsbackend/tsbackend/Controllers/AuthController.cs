using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Entities;
using tsbackend.Models;
using tsbackend.Services;

namespace tsbackend.Controllers;

public class AuthController : Controller
{
    public IAuthService _authService;
    private readonly DataBaseContext context;

    public AuthController(IAuthService authService, DataBaseContext context)
    {
        _authService = authService;
        this.context = context;
    }

    //Регистрация
    [HttpPost("api/signup")]
    public IActionResult Register([FromBody] SignUpModel model)
    {
        HashModel hashSalt = _authService.EncryptPassword(model.Password);
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.Email == model.Email);
        if (user == null)
        {
            User userNew = new User();
            if (model.AdminKey == "!admin2022")
            {
                userNew = new User { 
                    Email = model.Email, 
                    Hash = hashSalt.Hash, 
                    Salt = hashSalt.Salt, 
                    Role = "admin", 
                    Name = model.Name, 
                    Surname = model.Surname, 
                    Patronymic = model.Patronymic,
                    Deleted = false
                };
            }
            else if (model.AdminKey == "" || model.AdminKey == null)
            {
                userNew = new User { 
                    Email = model.Email, 
                    Hash = hashSalt.Hash, 
                    Salt = hashSalt.Salt, 
                    Role = "worker", 
                    Name = model.Name, 
                    Surname = model.Surname, 
                    Patronymic = model.Patronymic,
                    Deleted = false
                };
            }
            else return StatusCode(404);

            context.Users.Add(userNew);
            context.SaveChanges();

            var identity = _authService.GetIdentity(userNew);

            //Формирование JSON
            var response = new
            {
                access_token = _authService.GetToken(identity),
                email = identity.Name,
                role = userNew.Role
            };
            return Json(response);
        }
        return StatusCode(400);
    }

    //Вход
    [HttpPost("api/signin")]
    public IActionResult Login([FromBody] SignInModel model)
    {
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.Email == model.Email);
        if (user != null)
        {
            //Проверка пароля
            string isPasswordMatched = _authService.HashPassword(model.Password, user.Salt);
            if (isPasswordMatched == user.Hash)
            {
                var identity = _authService.GetIdentity(user);

                //Формирование JSON
                var response = new
                {
                    access_token = _authService.GetToken(identity),
                    email = identity.Name,
                    role = user.Role
                };
                return Json(response);
            } 
            return StatusCode(400);
        }
        return StatusCode(404);
    }
}