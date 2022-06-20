namespace tsbackend.Models;

public class TicketsModel
{
    public int ID { get; set; }
    public string Name { get; set; }
    public string Deadline { get; set; }
    public string DateSent { get; set; }
    public string Priority { get; set; }
    public string Status { get; set; }
}