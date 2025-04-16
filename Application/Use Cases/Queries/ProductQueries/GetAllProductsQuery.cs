using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetAllProductsQuery : IRequest<List<ProductDto>>
    {
    }
}
