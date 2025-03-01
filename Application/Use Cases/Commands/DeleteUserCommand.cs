using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteUserCommand : IRequest<Result<Guid>>
    {
        public Guid Id { get; set; }
    }
}
