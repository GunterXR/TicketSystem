using System.Diagnostics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using tsbackend.Data;
using tsbackend.Entities;
using tsbackend.Models;
using tsbackend.Models.Stats;

namespace tsbackend.Controllers;

public class StatsController : Controller
{
    private readonly DataBaseContext context;

    public StatsController(DataBaseContext context)
    {
        this.context = context;
    }
    
    //Статистика по заявкам
    [Authorize(Roles="admin,spreader")]
    [HttpPost("api/stats")]
    public IActionResult GetStats([FromBody]StatsModel model)
    {
         List<DaysCount> daysCountResponse = new List<DaysCount>();
         List<MonthsCount> monthsCountResponse = new List<MonthsCount>();
         List<Ticket> ticketsSameMonth = new List<Ticket>();
         List<Ticket> ticketsSameYear = new List<Ticket>();
         
         int[] daysCount = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
         string[] daysNumber = { "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", 
             "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31" };
         string[] monthNumber = { "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12" };
         string[] monthNames = { "янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек" };

         //Количество заявок по дням (нынешний месяц) или месяцам (нынешний год)
         string searchMonth = model.Month + "." + model.Year;
         string searchYear = model.Year;
         var tickets = context.Tickets.ToList();
         for (int i = 0; i < tickets.Count; i++)
         {
             if (tickets[i].DateSent.Contains(searchMonth)) {ticketsSameMonth.Add(tickets[i]);}
             if (tickets[i].DateSent.Contains(searchYear)) ticketsSameYear.Add(tickets[i]);
         }

         if (ticketsSameYear != null && ticketsSameMonth != null)
         {
             int dayCount = daysCount[Int32.Parse(model.Month) - 1];
             
             //Количество заявок по дням (нынешний месяц)
             int dayCountTotal = 0;
             for (int i = 0; i < dayCount; i++)
             {
                 int count = 0;
                 for (int j = 0; j < ticketsSameMonth.Count; j++)
                 {
                     if (daysNumber[i] == ticketsSameMonth[j].DateSent.Substring(0, 2)) count++;
                 }
                 daysCountResponse.Add(new DaysCount { DaysString = daysNumber[i], DaysAmount = count });
                 dayCountTotal += count;
             }
             
             //Количество заявок по месяцам (нынешний год)
             int monthCountTotal = 0;
             for (int i = 0; i < 12; i++)
             {
                 int count = 0;
                 for (int j = 0; j < ticketsSameYear.Count; j++)
                 {
                     if (monthNumber[i] == ticketsSameYear[j].DateSent.Substring(3, 2)) count++;
                 }
                 monthsCountResponse.Add(new MonthsCount { MonthsString = monthNames[i], MonthsAmount = count });
                 monthCountTotal += count;
             }
        
             //Количество заявок по статусу и приоритету (нынешний год)
             int statusCountOpened = 0;
             int statusCountProcess = 0;
             int statusCountClosed = 0;
             
             int priorityCountLow = 0;
             int priorityCountMedium = 0;
             int priorityCountHigh = 0;
             int priorityCountCritical = 0;
             
             for (int i = 0; i < ticketsSameYear.Count; i++)
             {
                 if (ticketsSameYear[i].Status == "opened") statusCountOpened++;
                 else if (ticketsSameYear[i].Status == "process") statusCountProcess++;
                 else if (ticketsSameYear[i].Status == "closed") statusCountClosed++;
                 if (ticketsSameYear[i].Priority == "low") priorityCountLow++;
                 
                 else if (ticketsSameYear[i].Priority == "medium") priorityCountMedium++;
                 else if (ticketsSameYear[i].Priority == "high") priorityCountHigh++;
                 else if (ticketsSameYear[i].Priority == "critical") priorityCountCritical++;
             }
             int statusCountTotal = statusCountOpened + statusCountProcess + statusCountClosed;
             int priorityCountTotal = priorityCountLow + priorityCountMedium + priorityCountHigh + priorityCountCritical;
             
             //Занесение значений в списки
             StatusCount statusCountResponse = new StatusCount()
             {
                 CountOpened = statusCountOpened, CountProcess = statusCountProcess, CountClosed = statusCountClosed,
                 CountTotal = statusCountTotal
             };
             PriorityCount priorityCountResponse = new PriorityCount()
             {
                 CountLow = priorityCountLow, CountMedium = priorityCountMedium, CountHigh = priorityCountHigh,
                 CountCritical = priorityCountCritical, CountTotal = priorityCountTotal
             };
        
             //Формирование JSON
             var response = new
             {
                 daysCount = daysCountResponse,
                 monthsCount = monthsCountResponse,
                 statusCount = statusCountResponse,
                 priorityCount = priorityCountResponse
             };
             return Json(response);
         }

         return StatusCode(501);
    }
}