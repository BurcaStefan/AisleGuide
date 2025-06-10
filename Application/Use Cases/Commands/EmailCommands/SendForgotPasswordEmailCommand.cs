using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.EmailCommands
{
    public class SendForgotPasswordEmailCommand : IRequest<Result<bool>>
    {
        public string UserEmail { get; set; }
        public string Code { get; set; }
    }
}
