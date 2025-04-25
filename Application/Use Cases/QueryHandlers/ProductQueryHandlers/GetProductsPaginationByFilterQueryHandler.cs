using Application.DTOs;
using Application.Use_Cases.Queries.ProductQueries;
using Application.Utils;
using Application.Utils.FilterStrategy;
using AutoMapper;
using Domain.Common;
using Infrastructure.Persistence;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Use_Cases.QueryHandlers.ProductQueryHandlers
{
    public class GetProductsPaginationByFilterQueryHandler : IRequestHandler<GetProductsPaginationByFilterQuery, Result<PagedResult<ProductDto>>>
    {
        private readonly IMapper mapper;
        private readonly ApplicationDbContext context;

        public GetProductsPaginationByFilterQueryHandler(IMapper mapper, ApplicationDbContext context)
        {
            this.mapper = mapper;
            this.context = context;
        }


        public async Task<Result<PagedResult<ProductDto>>> Handle(GetProductsPaginationByFilterQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var query = context.Products.AsQueryable();

                var filterStrategies = new List<IProductFilterStrategy>
                {
                    new ISBNContainsFilterStrategy(request.ISBN),
                    new NameContainsFilterStrategy(request.Name),
                    new CategoryExactFilterStrategy(request.Category),
                    new ShelvingUnitExactFilterStrategy(request.ShelvingUnit)
                };


                foreach (var strategy in filterStrategies)
                {
                    query = strategy.ApplyFilter(query);
                }

                var sortStrategy = new ProductSortStrategy(request.SortBy);
                query = sortStrategy.ApplySort(query);

                var pagedProducts = await query
                    .Skip((request.PageNumber - 1) * request.PageSize)
                    .Take(request.PageSize)
                    .ToListAsync(cancellationToken);

                var productDtos = mapper.Map<List<ProductDto>>(pagedProducts);
                var pagedResult = new PagedResult<ProductDto>(productDtos, pagedProducts.Count);

                return Result<PagedResult<ProductDto>>.Success(pagedResult);
            }
            catch (Exception ex)
            {
                return Result<PagedResult<ProductDto>>.Failure($"Error retrieving filtered products: {ex.Message}");
            }
        }
    }
}
