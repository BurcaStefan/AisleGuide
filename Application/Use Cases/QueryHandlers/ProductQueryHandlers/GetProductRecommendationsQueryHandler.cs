using Application.Use_Cases.Queries.ProductQueries;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.ProductQueryHandlers
{
    public class GetProductRecommendationsQueryHandler : IRequestHandler<GetProductRecommendationsQuery, Result<IEnumerable<Product>>>
    {
        private readonly IProductRepository productRepository;

        public GetProductRecommendationsQueryHandler(IProductRepository productRepository)
        {
            this.productRepository = productRepository;
        }

        public async Task<Result<IEnumerable<Product>>> Handle(
            GetProductRecommendationsQuery request,
            CancellationToken cancellationToken)
        {
            return await productRepository.GetRecommendedProductsAsync(request.UserId, request.TopN);
        }
    }
}