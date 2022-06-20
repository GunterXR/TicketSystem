using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Models;

namespace tsbackend.Controllers;

public class UserController : Controller
{
    private readonly DataBaseContext context;

    public UserController(DataBaseContext context)
    {
        this.context = context;
    }
    
    //Отображение профиля
    [Authorize]
    [HttpGet("api/profile")]
    public IActionResult GetProfile()
    {
        var userID = User.Identity.Name;
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.ID.ToString() == userID);
        if (user != null)
        {
            var response = new
            {
                id = user.ID,
                email = user.Email,
                role = user.Role,
                name = user.Name,
                surname = user.Surname,
                patronymic = user.Patronymic,
                phoneNumber = user.PhoneNumber,
                aboutMe = user.AboutMe,
                post = user.Post,
                gender = user.Gender,
                birthday = user.Birthday,
            };
            return Json(response);
        }
        return StatusCode(501);
    }
    
    //Изменение профиля
    [Authorize]
    [HttpPost("api/profile/edit")]
    public IActionResult EditProfile([FromBody] UserModel model)
    {
        var userID = User.Identity.Name;
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.ID.ToString() == userID);
        if (user != null)
        {
            user.Name = model.Name;
            user.Surname = model.Surname;
            user.Patronymic = model.Patronymic;
            user.PhoneNumber = model.PhoneNumber;
            user.AboutMe = model.AboutMe;
            user.Post = model.Post;
            user.Birthday = model.Birthday;
            user.Gender = model.Gender;
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Удаление аккаунта
    [Authorize]
    [HttpPost("/api/profile/delete")]
    public IActionResult DeleteProfile([FromBody] int userIDDelete)
    {
        var userID = User.Identity.Name;
        if (userIDDelete == Int32.Parse(userID))
        {
            var users = context.Users.ToList(); 
            var user = users.FirstOrDefault(x => x.ID.ToString() == userID);
            if (user != null)
            {
                user.Email = "[DELETED]";
                user.Hash += "!";
                user.Name = "[" + user.Name + "]";
                user.Surname = "[" + user.Surname + "]";
                user.Patronymic = null;
                user.Post = null;
                user.PhoneNumber = null;
                user.AboutMe = null;
                user.Birthday = null;
                user.Gender = null;
                user.Deleted = true;
                context.SaveChanges(); 
                return StatusCode(200);
            }
            return StatusCode(501);
        }
        return StatusCode(404);
    }
}