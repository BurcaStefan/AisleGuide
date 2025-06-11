using Domain.Common;
using Domain.Entities;
using MediatR;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetProductRecommendationsQuery : IRequest<Result<IEnumerable<Product>>>
    {
        public Guid UserId { get; set; }
        public int TopN { get; set; } = 30;
    }
}