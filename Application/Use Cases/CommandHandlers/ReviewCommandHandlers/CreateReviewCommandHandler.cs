using Application.Use_Cases.Commands.ReviewCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.ReviewCommandHandlers
{
    public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, Result<Guid>>
    {
        private readonly IReviewRepository repository;
        private readonly IMapper mapper;

        public CreateReviewCommandHandler(IReviewRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        
        public async Task<Result<Guid>> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
        {
            var newReview = mapper.Map<Review>(request);
            var result = await repository.AddAsync(newReview);

            if (!result.IsSuccess)
            {
                return Result<Guid>.Failure(result.ErrorMessage);
            }
            return Result<Guid>.Success(result.Data);
        }
    }

}
