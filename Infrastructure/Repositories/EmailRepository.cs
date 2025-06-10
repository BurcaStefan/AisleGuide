using Domain.Common;
using Domain.Repositories;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Repositories
{
    public class EmailRepository : IEmailRepository
    {
        private readonly IEmailSender emailSender;
        private readonly IConfiguration configuration;
        public EmailRepository(IEmailSender emailSender, IConfiguration configuration)
        {
            this.emailSender = emailSender;
            this.configuration = configuration;
        }

        public async Task<Result<bool>> SendContactEmailAsync(string userEmail, string subject, string message)
        {
            var to = configuration["Contact:Email"];
            var body = $"From: {userEmail}<br/>{message}";
            return await emailSender.SendEmailAsync(to, subject, body);
        }

        public async Task<Result<bool>> SendForgotPasswordEmailAsync(string userEmail, string code)
        {
            var subject = "Password Reset Code";
            var body = $"Your password reset code is: <b>{code}</b>";
            return await emailSender.SendEmailAsync(userEmail, subject, body);
        }

        public async Task<Result<bool>> SendEmailConfirmationAsync(string userEmail, string code)
        {
            var subject = "Email Confirmation Code";
            var body = $"Your confirmation code is: <b>{code}</b>";
            return await emailSender.SendEmailAsync(userEmail, subject, body);
        }
    }

}
