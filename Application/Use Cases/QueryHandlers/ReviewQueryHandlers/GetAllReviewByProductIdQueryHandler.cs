using Application.DTOs;
using Application.Use_Cases.Queries.ReviewQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.ReviewQueryHandlers
{
    public class GetAllReviewByProductIdQueryHandler : IRequestHandler<GetAllReviewByProductIdQuery, IEnumerable<ReviewDto>>
    {
        private readonly IReviewRepository reviewRepository;
        private readonly IMapper mapper;
        public GetAllReviewByProductIdQueryHandler(IReviewRepository reviewRepository, IMapper mapper)
        {
            this.reviewRepository = reviewRepository;
            this.mapper = mapper;
        }
        public async Task<IEnumerable<ReviewDto>> Handle(GetAllReviewByProductIdQuery request, CancellationToken cancellationToken)
        {
            var reviews = await reviewRepository.GetAllByProductIdAsync(request.ProductId, request.PageNumber, request.PageSize);
            return mapper.Map<IEnumerable<ReviewDto>>(reviews); 
        }
    }
}
