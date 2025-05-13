using Application.Use_Cases.Commands.ReviewCommands;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.ReviewCommandHandlers
{
    public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand, Result<bool>>
    {
        private readonly IReviewRepository repository;
        private readonly IMapper mapper;

        public DeleteReviewCommandHandler(IReviewRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<bool>> Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
        {
            var result = await repository.DeleteAsync(request.Id);
            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.ErrorMessage);
            }
            return Result<bool>.Success(result.Data);
        }
    }
}
