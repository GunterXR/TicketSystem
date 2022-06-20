namespace tsbackend.Models;

public class TicketModel
{
    public string Name { get; set; }
    public string Info { get; set; }
    public string ProblemType { get; set; }
    public string Priority { get; set; }
    public string Browser { get; set; }
    public string IP { get; set; }
    public string Deadline { get; set; }
    public string DateSent { get; set; }
}