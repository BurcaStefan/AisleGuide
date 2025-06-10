using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.EmailCommands
{
    public class SendContactEmailCommand : IRequest<Result<bool>>
    {
        public string UserEmail { get; set; }
        public string Subject { get; set; }
        public string Message { get; set; }
    }
}
