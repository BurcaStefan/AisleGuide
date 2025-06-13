using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public record DeleteImageCommand(Guid Id) : IRequest<Result<bool>>;
}
