using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Models;
using tsbackend.Models.Admin;

namespace tsbackend.Controllers;

public class AdminController : Controller
{
    private readonly DataBaseContext context;

    public AdminController(DataBaseContext context)
    {
        this.context = context;
    }
    
    //Получить данные о пользователе
    [Authorize(Roles="admin")]
    [HttpPost("api/admin/user")]
    public IActionResult GetUser([FromBody] int id)
    {
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.ID.ToString() == id.ToString());
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
                birthday = user.Birthday,
                gender = user.Gender,
            };
            return Json(response);
        }
        return Json(null);
    }
    
    //Список пользователей
    [Authorize(Roles="admin")]
    [HttpGet("api/admin/users")]
    public IActionResult GetUsers()
    {
        var users = context.Users.ToList(); 
        var usersNotAdmin = users.Where(x => x.Role != "admin").ToList();
        if (usersNotAdmin != null)
        {
            usersNotAdmin = usersNotAdmin.OrderBy(w => w.ID).ToList();
            List<UsersModel> usersResponse = new List<UsersModel>();
            for (int i = 0; i < usersNotAdmin.Count; i++)
            {
                usersResponse.Add(new UsersModel { ID = usersNotAdmin[i].ID, Email = usersNotAdmin[i].Email, Name = usersNotAdmin[i].Name, Surname = usersNotAdmin[i].Surname, Patronymic = usersNotAdmin[i].Patronymic, Role = usersNotAdmin[i].Role, Post = usersNotAdmin[i].Post});
            }
            return Json(usersResponse);
        }
        return Json(null);
    }
    
    //Сменить роль пользователю
    [Authorize(Roles="admin")]
    [HttpPost("api/admin/changerole")]
    public IActionResult ChangeUserRole([FromBody] RoleModel model)
    {
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.ID.ToString() == model.ID.ToString());
        if (user != null)
        {
            user.Role = model.Role;
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Восстановить пользователя
    [Authorize(Roles="admin")]
    [HttpPost("api/admin/restore")]
    public IActionResult UserRestore([FromBody] RestoreModel model)
    {
        var users = context.Users.ToList(); 
        var userEmail = users.FirstOrDefault(x => x.Email == model.Email);
        if (userEmail == null)
        {
            var user = users.FirstOrDefault(x => x.ID.ToString() == model.ID.ToString());
            if (user != null)
            {
                user.Deleted = false;
                user.Email = model.Email;
                user.Hash = user.Hash.Remove(user.Hash.Length - 1);
                user.Name = user.Name.Remove(user.Name.Length - 1).Remove(0, 1);
                user.Surname = user.Surname.Remove(user.Surname.Length - 1).Remove(0, 1);
                context.SaveChanges();
                return StatusCode(200);
            }
        }
        else
        {
            return StatusCode(400);
        }
        return StatusCode(501);
    }
}