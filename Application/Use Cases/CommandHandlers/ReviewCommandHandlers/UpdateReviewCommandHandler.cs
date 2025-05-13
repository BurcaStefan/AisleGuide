using Application.Use_Cases.Commands.ReviewCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.ReviewCommandHandlers
{
    public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, Result<bool>>
    {
        private readonly IReviewRepository repository;
        private readonly IMapper mapper;

        public UpdateReviewCommandHandler(IReviewRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<bool>> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
        {
            var review = new Review
            {
                Id = request.Id,
                Content = request.Content,
                Rating = request.Rating
            };

            return await repository.UpdateAsync(review);
        }
    }
}
