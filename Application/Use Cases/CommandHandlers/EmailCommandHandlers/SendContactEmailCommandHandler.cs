using Application.Use_Cases.Commands.EmailCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.EmailCommandHandlers
{
    public class SendContactEmailCommandHandler : IRequestHandler<SendContactEmailCommand, Result<bool>>
    {
        private readonly IEmailRepository emailRepository;
        public SendContactEmailCommandHandler(IEmailRepository emailRepository)
        {
            this.emailRepository = emailRepository;
        }

        public async Task<Result<bool>> Handle(SendContactEmailCommand request, CancellationToken cancellationToken)
        {
            return await emailRepository.SendContactEmailAsync(request.UserEmail, request.Subject, request.Message);
        }
    }
}
