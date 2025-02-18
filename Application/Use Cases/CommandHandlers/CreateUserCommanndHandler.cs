using Application.Use_Cases.Commands;
using MediatR;
using Domain.Repositories;
using Domain.Entities;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateUserCommanndHandler : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly IUserRepository repository;
        public CreateUserCommanndHandler(IUserRepository repository)
        {
            this.repository = repository;
        }
        public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var newUser = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                Password = request.Password
            };

            return await repository.AddAsync(newUser);
        }
    }
}
