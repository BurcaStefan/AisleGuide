using Application.Use_Cases.Commands.EmailCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.EmailCommandHandlers
{
    public class SendForgotPasswordEmailCommandHandler : IRequestHandler<SendForgotPasswordEmailCommand, Result<bool>>
    {
        private readonly IEmailRepository emailRepository;
        public SendForgotPasswordEmailCommandHandler(IEmailRepository emailRepository)
        {
            this.emailRepository = emailRepository;
        }

        public async Task<Result<bool>> Handle(SendForgotPasswordEmailCommand request, CancellationToken cancellationToken)
        {
            return await emailRepository.SendForgotPasswordEmailAsync(request.UserEmail, request.Code);
        }
    }
}
