using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class DeleteUserCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
    }
}
