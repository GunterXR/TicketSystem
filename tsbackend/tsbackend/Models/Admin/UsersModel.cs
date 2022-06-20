namespace tsbackend.Models.Admin;

public class UsersModel
{
    public int ID { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Patronymic { get; set; }
    public string Role { get; set; }
    public string Post { get; set; }
}