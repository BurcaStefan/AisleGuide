using Application.Use_Cases.Commands.FavoriteCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.FavoriteCommandHandlers
{
    public class DeleteFavoriteCommandHandler : IRequestHandler<DeleteFavoriteCommand, Result<bool>>
    {
        private readonly IFavoriteRepository repository;
        public DeleteFavoriteCommandHandler(IFavoriteRepository repository)
        {
            this.repository = repository;
        }
        public async Task<Result<bool>> Handle(DeleteFavoriteCommand request, CancellationToken cancellationToken)
        {
            var result = await repository.DeleteAsync(request.UserId, request.ProductId);
            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.ErrorMessage);
            }
            return Result<bool>.Success(result.Data);
        }
    }
}
