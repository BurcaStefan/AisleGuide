using Application.Use_Cases.Commands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteImageCommandHandler : IRequestHandler<DeleteImageCommand, Result<bool>>
    {
        private readonly IImageRepository repository;

        public DeleteImageCommandHandler(IImageRepository repository)
        {
            this.repository = repository;
        }

        public async Task<Result<bool>> Handle(DeleteImageCommand request, CancellationToken cancellationToken)
        {
            var result = await repository.DeleteAsync(request.Id);
            if (result.IsSuccess)
            {
                return Result<bool>.Success(result.Data);
            }
            return Result<bool>.Failure(result.ErrorMessage);
        }
    }
}
