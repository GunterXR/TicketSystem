using System.Diagnostics;
using MailKit.Net.Smtp;
using MimeKit;

namespace tsbackend.Services;

public interface IEmailService
{
    public void SendEmail(string name, string surname, string email, string ticketID, string body);
}

public class EmailService : IEmailService
{
    //Отправка Email письма о смене статуса заявки
    public void SendEmail(string name, string surname, string email, string ticketID, string body)
    {
        try
        {
            Debug.WriteLine(name);
            Debug.WriteLine(surname);
            Debug.WriteLine(email);
            Debug.WriteLine(ticketID);
            Debug.WriteLine(body);
            MimeMessage message = new MimeMessage();
            message.From.Add(new MailboxAddress("Ticket System", "ticket@ts.ru"));
            message.To.Add(new MailboxAddress(name + " " + surname, email));
            message.Subject = "Заявка №" + ticketID;
            message.Body = new BodyBuilder() { HtmlBody = body }.ToMessageBody();

            using (SmtpClient client = new SmtpClient())
            {
                client.Connect("smtp.gmail.com", 465, true);
                client.Authenticate("example@email.com", "password");
                client.Send(message);
                client.Disconnect(true);
            }
        }
        catch { }
    }
}