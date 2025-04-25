using Application.DTOs;
using Application.Utils;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Queries.ProductQueries
{
    public class GetProductsPaginationByFilterQuery : IRequest<Result<PagedResult<ProductDto>>>
    {
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? ISBN { get; set; }
        public string? ShelvingUnit { get; set; }
        public string? SortBy { get; set; }
    }

}
