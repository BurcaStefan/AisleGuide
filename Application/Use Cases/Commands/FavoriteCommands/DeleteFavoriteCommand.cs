using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.FavoriteCommands
{
    public class DeleteFavoriteCommand : IRequest<Result<bool>>
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
