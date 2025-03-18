using Application.Use_Cases.Commands;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class LoginUserCommandHandler : IRequestHandler<LoginUserCommand, Result<string>>
    {
        private readonly IUserRepository repository;

        public LoginUserCommandHandler(IUserRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<string>> Handle(LoginUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Email = request.Email,
                Password = request.Password
            };

            var token = await repository.LoginAsync(user);
            return token;
        }
    }
}
