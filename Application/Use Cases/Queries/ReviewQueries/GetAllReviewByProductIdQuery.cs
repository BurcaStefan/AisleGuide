using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.ReviewQueries
{
    public class GetAllReviewByProductIdQuery : IRequest<IEnumerable<ReviewDto>>
    {
        public Guid ProductId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
