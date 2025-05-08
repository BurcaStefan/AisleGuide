using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.FavoriteCommands
{
    public class CreateFavoriteCommand : IRequest<Result<Guid>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
