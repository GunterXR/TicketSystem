using Microsoft.EntityFrameworkCore;
using tsbackend.Entities;
using Task = tsbackend.Entities.Task;

namespace tsbackend.Data;

public class DataBaseContext : DbContext
{
    public DataBaseContext(DbContextOptions<DataBaseContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }
    
    //Создание контекста сущностей в БД
    public DbSet<User> Users { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<Task> Tasks { get; set; }
}