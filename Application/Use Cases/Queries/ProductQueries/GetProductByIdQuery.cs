using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetProductByIdQuery : IRequest<ProductDto>
    {
        public Guid Id { get; set; }
    }
}
