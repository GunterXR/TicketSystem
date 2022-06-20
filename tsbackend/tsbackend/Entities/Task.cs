using System.ComponentModel.DataAnnotations;

namespace tsbackend.Entities;

public class Task
{
    public int ID { get; set; }
    [Required]
    public string Name { get; set; }
    public string Description { get; set; }
    public bool? Status { get; set; }
    public int TicketID { get; set; }

}