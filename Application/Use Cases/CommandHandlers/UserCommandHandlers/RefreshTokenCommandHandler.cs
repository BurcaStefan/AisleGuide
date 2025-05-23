using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.Commands.Handlers
{
    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, Result<string>>
    {
        private readonly IUserRepository userRepository;

        public RefreshTokenCommandHandler(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<Result<string>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            return await userRepository.RefreshTokenAsync(request.Token);
        }
    }
}