using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Entities;
using tsbackend.Models;
using tsbackend.Services;

namespace tsbackend.Controllers;

public class TicketController : Controller
{
    public IEmailService _emailService;
    private readonly DataBaseContext context;

    public TicketController(IEmailService emailService, DataBaseContext context)
    {
        _emailService = emailService;
        this.context = context;
    }
    
    //Создание заявки
    [Authorize]
    [HttpPost("api/tickets/create")]
    public IActionResult CreateTicket([FromBody] TicketModel model)
    {
        var userID = User.Identity.Name;
        var users = context.Users.ToList(); 
        var user = users.FirstOrDefault(x => x.ID.ToString() == userID);
        if (user != null)
        {
            Ticket ticket = new Ticket { Name = model.Name, Info = model.Info, DateSent = model.DateSent, Status = "opened", Priority = model.Priority, Deadline = model.Deadline, ProblemType = model.ProblemType, IP = model.IP, Browser = model.Browser, SpecialistID = -1};
            user.Tickets = new List<Ticket>();
            user.Tickets.Add(ticket);
            context.SaveChanges();
            
            //Извлечение данных о созданной заявке для Email письма
            var tickets = context.Tickets.ToList();
            var ticketEmail = tickets.FirstOrDefault(x => x.Name == model.Name && x.Info == model.Info && x.DateSent == model.DateSent && x.Deadline == model.Deadline && x.ProblemType == model.ProblemType);
            if (ticketEmail != null)
            {
                string body = "<div>Здравствуйте, <b>" + user.Name + "</b> <b>" + user.Surname +
                              "</b>!<br>Ваша заявка №<b>" + ticketEmail.ID + " была создана.<br><br>----------------------------------------<br>С уважением, Ticket System.</div>";
                _emailService.SendEmail(user.Name, user.Surname, user.Email, ticketEmail.ID.ToString(), body);
            }
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Распределение заявки
    [Authorize]
    [HttpPost("api/ticket/spread")]
    public IActionResult SpreadTicket([FromBody] SpreadModel model)
    {
        var tickets = context.Tickets.ToList();
        var ticket = tickets.FirstOrDefault(x => x.ID == model.ID);
        if (ticket != null)
        {
            ticket.Deadline = model.Deadline;
            ticket.SpecialistID = model.SpecialistID;
            ticket.Priority = model.Priority;
            ticket.Status = "process";
            context.SaveChanges();
            
            //Извлечение данных о пользователе для Email письма
            var users = context.Users.ToList();
            var user = users.FirstOrDefault(x => x.ID == ticket.UserID);
            if (user != null)
            {
                string body = "<div>Здравствуйте, <b>" + user.Name + "</b> <b>" + user.Surname +
                              "</b>!<br>Статус вашей заявки №<b>" + ticket.ID + "</b> был изменен на <b>В обработке</b>.<br><br>----------------------------------------<br>С уважением, Ticket System.</div>";
                _emailService.SendEmail(user.Name, user.Surname, user.Email, ticket.ID.ToString(), body);
            }
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Список специалистов
    [Authorize]
    [HttpGet("api/ticket/specialists")]
    public IActionResult GetSpecialistsTicket()
    {
        var users = context.Users.ToList(); 
        var specialists = users.Where(x => x.Role == "specialist" && x.Deleted == false);
        if (specialists != null)
        {
            return Json(specialists);
        }
        return Json(null);
    }
    
    //Закрытие заявки
    [Authorize]
    [HttpPost("api/ticket/close")]
    public IActionResult CloseTicket([FromBody] CloseModel model)
    {
        var tickets = context.Tickets.ToList();
        var ticket = tickets.FirstOrDefault(x => x.ID == model.ID);
        if (ticket != null)
        {
            ticket.Status = "closed";
            ticket.CloseReason = model.CloseReason;
            context.SaveChanges();
            
            //Извлечение данных о пользователе для Email письма
            var users = context.Users.ToList();
            var user = users.FirstOrDefault(x => x.ID == ticket.UserID);
            if (user != null)
            {
                string body = "<div>Здравствуйте, <b>" + user.Name + "</b> <b>" + user.Surname +
                              "</b>!<br>Ваша заявка №<b>" + ticket.ID + "</b> была закрыта.<br>Прична закрытия: " + model.CloseReason + "<br><br>----------------------------------------<br>С уважением, Ticket System.</div>";
                _emailService.SendEmail(user.Name, user.Surname, user.Email, ticket.ID.ToString(), body);
            }
            return StatusCode(200);
        }
        return StatusCode(501);
    }

    //Получение спсика заявок по ролям
    [Authorize]
    [HttpPost("api/tickets")]
    public IActionResult GetTickets([FromBody] string role)
    {
        var userID = User.Identity.Name;
        var tickets = context.Tickets.ToList();
        
        //Список заявок пользователя
        if (role == "worker")
        {
            var ticket = tickets.Where(x => x.UserID.ToString() == userID).ToList();
            if (ticket != null)
            {
                ticket = ticket.OrderBy(w => w.ID).ToList();
                List<TicketsModel> ticketsResponse = new List<TicketsModel>();
                for (int i = 0; i < ticket.Count; i++)
                {
                    ticketsResponse.Add(new TicketsModel { ID = ticket[i].ID, Name = ticket[i].Name, Deadline = ticket[i].Deadline, DateSent = ticket[i].DateSent, Priority = ticket[i].Priority, Status = ticket[i].Status});
                }
                return Json(ticketsResponse);
            }
        }
        
        //Список заявок специалиста
        else if (role == "specialist")
        {
            var ticket = tickets.Where(x => x.SpecialistID.ToString() == userID).ToList();
            if (ticket != null)
            {
                ticket = ticket.OrderBy(w => w.ID).ToList();
                List<TicketsModel> ticketsResponse = new List<TicketsModel>();
                for (int i = 0; i < ticket.Count; i++)
                {
                    ticketsResponse.Add(new TicketsModel { ID = ticket[i].ID, Name = ticket[i].Name, Deadline = ticket[i].Deadline, DateSent = ticket[i].DateSent, Priority = ticket[i].Priority, Status = ticket[i].Status});
                }
                return Json(ticketsResponse);
            }
        }
        
        //Список заявок распределителя
        else if (role == "spreader" || role == "admin")
        {
            if (tickets != null)
            {
                var ticket = tickets.OrderBy(w => w.ID).ToList();
                List<TicketsModel> ticketsResponse = new List<TicketsModel>();
                for (int i = 0; i < ticket.Count; i++)
                {
                    ticketsResponse.Add(new TicketsModel { ID = ticket[i].ID, Name = ticket[i].Name, Deadline = ticket[i].Deadline, DateSent = ticket[i].DateSent, Priority = ticket[i].Priority, Status = ticket[i].Status});
                }
                return Json(ticketsResponse);
            }
        }
        return Json(null);
    }

    //Информация о заявке
    [Authorize]
    [HttpPost("api/ticket")]
    public IActionResult GetTicket([FromBody] int id)
    {
        var specFlag = false;
        var tickets = context.Tickets.ToList();
        var ticket = tickets.FirstOrDefault(x => x.ID.ToString() == id.ToString());
        if (ticket != null)
        {
            //Формирование данных о заявке
            var responseTicket = new
            {
                id = ticket.ID,
                name = ticket.Name,
                dateSent = ticket.DateSent,
                deadline = ticket.Deadline,
                problemType = ticket.ProblemType,
                ip = ticket.IP,
                browser = ticket.Browser,
                info = ticket.Info,
                closeReason = ticket.CloseReason,
                priority = ticket.Priority,
                status = ticket.Status,
            };
            
            //Формирование данных о пользователе
            var users = context.Users.ToList();
            var user = users.FirstOrDefault(x => x.ID.ToString() == ticket.UserID.ToString());
            var responseUser = new
            {
                name = user.Name,
                surname = user.Surname,
                patronymic = user.Patronymic,
                email = user.Email,
                phoneNumber = user.PhoneNumber,
                post = user.Post,
            };
            
            var specialists = context.Users.ToList();
            if (ticket.SpecialistID.ToString() != "-1")
            {
                //Формирование данных о специалисте
                var specialist = specialists.FirstOrDefault(x => x.ID.ToString() == ticket.SpecialistID.ToString());
                var responseSpecialist = new
                {
                    name = specialist.Name,
                    surname = specialist.Surname,
                    email = specialist.Email,
                    phoneNumber = specialist.PhoneNumber,
                };

                //Формирование итогового запроса (если специалист назначен)
                var response = new
                {
                    ticket = responseTicket,
                    user = responseUser,
                    specialist = responseSpecialist,
                };
                return Json(response);
            }
            else {
                //Формирование итогового запроса (если нет пока специалиста)
                var response = new
                {
                    ticket = responseTicket,
                    user = responseUser,
                    specialist = 0,
                };
                return Json(response);
            }
        }
        return Json(null);
    }
}