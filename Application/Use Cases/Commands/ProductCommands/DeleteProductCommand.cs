using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.ProductCommands
{
    public class DeleteProductCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
    }
}
