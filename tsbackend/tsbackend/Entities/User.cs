using System.ComponentModel.DataAnnotations;

namespace tsbackend.Entities;

public class User
{
    public int ID { get; set; }
    [Required]
    public string Email { get; set; }
    public string Hash { get; set; }
    public byte[] Salt { get; set; }
    public string Role { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string? Patronymic { get; set; }
    public string? Gender { get; set; }
    public string? Birthday { get; set; }
    public string? PhoneNumber { get; set; }
    public string? AboutMe { get; set; }
    public string? Post { get; set; }
    public bool Deleted { get; set; }
    
    public List<Ticket> Tickets { get; set; }
}