using Domain.Common;
using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;

public class EmailSender : IEmailSender
{
    private readonly IConfiguration configuration;
    public EmailSender(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public async Task<Result<bool>> SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var smtpClient = new SmtpClient(configuration["Smtp:Host"])
            {
                Port = int.Parse(configuration["Smtp:Port"]),
                Credentials = new NetworkCredential(configuration["Smtp:Username"], configuration["Smtp:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(configuration["Smtp:From"]),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(to);

            await smtpClient.SendMailAsync(mailMessage);
            return Result<bool>.Success(true);
        }
        catch (Exception ex)
        {
            return Result<bool>.Failure($"Email could not be sent: {ex.Message}");
        }
    }
}
