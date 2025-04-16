using Application.DTOs;
using Application.Use_Cases.Queries.ProductQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.ProductQueryHandlers
{
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
    {
        private readonly IProductRepository repository;
        private readonly IMapper mapper;
        public GetAllProductsQueryHandler(IProductRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await repository.GetAllAsync();
            return mapper.Map<List<ProductDto>>(products);
        }
    }
}
