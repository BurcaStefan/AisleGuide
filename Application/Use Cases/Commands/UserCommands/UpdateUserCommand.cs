using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
