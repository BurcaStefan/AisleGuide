using Domain.Common;

public interface IEmailSender
{
    Task<Result<bool>> SendEmailAsync(string to, string subject, string body);
}
