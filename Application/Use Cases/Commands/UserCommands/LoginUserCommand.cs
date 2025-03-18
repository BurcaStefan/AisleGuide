using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class LoginUserCommand : IRequest<Result<string>>
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
