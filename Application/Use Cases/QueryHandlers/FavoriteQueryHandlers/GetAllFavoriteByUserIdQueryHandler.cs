using Application.DTOs;
using Application.Use_Cases.Queries.FavoriteQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.FavoriteQueryHandlers
{
    public class GetAllFavoriteByUserIdQueryHandler : IRequestHandler<GetAllFavoriteByUserIdQuery, List<FavoriteDto>>
    {
        private readonly IFavoriteRepository repository;
        private readonly IMapper mapper;

        public GetAllFavoriteByUserIdQueryHandler(IFavoriteRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<FavoriteDto>> Handle(GetAllFavoriteByUserIdQuery request, CancellationToken cancellationToken)
        {
            var favorites = await repository.GetAllPaginatedByUserIdAsync(
                request.UserId,
                request.PageNumber,
                request.PageSize);

            return mapper.Map<List<FavoriteDto>>(favorites);
        }

    }
}
