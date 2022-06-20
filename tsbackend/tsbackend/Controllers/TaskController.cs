using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Models;
using Task = tsbackend.Entities.Task;

namespace tsbackend.Controllers;

public class TaskController : Controller
{
    private readonly DataBaseContext context;

    public TaskController(DataBaseContext context)
    {
        this.context = context;
    }
    
    //Список задач
    [Authorize]
    [HttpPost("api/tasks")]
    public IActionResult GetTasks([FromBody] int ticketID)
    {
        var tasks = context.Tasks.ToList();
        var taskList = tasks.Where(x => x.TicketID.ToString() == ticketID.ToString());
        if (taskList != null)
        {
            taskList = taskList.OrderBy(w => w.ID).ToList();
            return Json(taskList);
        }
        return Json(null);
    }
    
    //Создание задачи
    [Authorize]
    [HttpPost("api/tasks/create")]
    public IActionResult CreateTask([FromBody] TaskCreateModel model)
    {
        var tickets = context.Tickets.ToList(); 
        var ticket = tickets.FirstOrDefault(x => x.ID == model.TicketID);
        if (ticket != null)
        {
            Task task = new Task { Name = model.Name, Description = model.Description, Status = false};
            ticket.Tasks = new List<Task>();
            ticket.Tasks.Add(task);
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }

    //Изменение задачи
    [Authorize]
    [HttpPost("api/task/edit")]
    public IActionResult EditTask([FromBody] TaskEditModel model)
    {
        var tasks = context.Tasks.ToList();
        var task = tasks.FirstOrDefault(x => x.ID == model.ID);
        if (task != null)
        {
            task.Name = model.Name;
            task.Description = model.Description;
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Завершение задачи
    [Authorize]
    [HttpPost("api/task/complete")]
    public IActionResult CompleteTask([FromBody] TaskCompleteModel model)
    {
        var tasks = context.Tasks.ToList();
        var task = tasks.FirstOrDefault(x => x.ID == model.ID);
        if (task != null)
        {
            task.Status = model.Status;
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }
    
    //Удаление задачи
    [Authorize]
    [HttpPost("api/task/delete")]
    public IActionResult DeleteTask([FromBody] int taskID)
    {
        var tasks = context.Tasks.ToList();
        var task = tasks.FirstOrDefault(x => x.ID == taskID);
        if (task != null)
        {
            context.Tasks.Remove(task);
            context.SaveChanges();
            return StatusCode(200);
        }
        return StatusCode(501);
    }
}