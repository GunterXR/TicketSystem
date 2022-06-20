using System.ComponentModel.DataAnnotations;

namespace tsbackend.Entities;

public class Ticket
{
    public int ID { get; set; }
    [Required]
    public string Name { get; set; }
    public string Info { get; set; }
    public string DateSent { get; set; }
    public string? Status { get; set; }
    public string? Priority { get; set; }
    public string? Deadline { get; set; }
    public int? SpecialistID { get; set; }
    public string? ProblemType { get; set; }
    public string? CloseReason { get; set; }
    public string? Browser { get; set; }
    public string? IP { get; set; }
    public int UserID { get; set; }
    
    public List<Task> Tasks { get; set; }
}