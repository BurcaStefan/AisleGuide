using Domain.Common;

namespace Domain.Repositories
{
    public interface IEmailRepository
    {
        Task<Result<bool>> SendContactEmailAsync(string userEmail, string subject, string message);
        Task<Result<bool>> SendForgotPasswordEmailAsync(string userEmail, string code);
        Task<Result<bool>> SendEmailConfirmationAsync(string userEmail, string code);
    }

}
