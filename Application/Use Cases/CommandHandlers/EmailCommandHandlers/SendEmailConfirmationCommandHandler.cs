using Application.Use_Cases.Commands.EmailCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.EmailCommandHandlers
{
    public class SendEmailConfirmationCommandHandler : IRequestHandler<SendEmailConfirmationCommand, Result<bool>>
    {
        private readonly IEmailRepository emailRepository;
        public SendEmailConfirmationCommandHandler(IEmailRepository emailRepository)
        {
            this.emailRepository = emailRepository;
        }

        public async Task<Result<bool>> Handle(SendEmailConfirmationCommand request, CancellationToken cancellationToken)
        {
            return await emailRepository.SendEmailConfirmationAsync(request.UserEmail, request.Code);
        }
    }
}
