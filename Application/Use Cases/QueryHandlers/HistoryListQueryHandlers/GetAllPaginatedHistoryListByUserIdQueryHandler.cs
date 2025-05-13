using Application.DTOs;
using Application.Use_Cases.Queries.HistoryListQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.HistoryListQueryHandlers
{
    public class GetAllPaginatedHistoryListByUserIdQueryHandler : IRequestHandler<GetAllPaginatedHistoryListByUserIdQuery, List<HistoryListDto>>
    {
        private readonly IHistoryListRepository repository;
        private readonly IMapper mapper;
        public GetAllPaginatedHistoryListByUserIdQueryHandler(IHistoryListRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<List<HistoryListDto>> Handle(GetAllPaginatedHistoryListByUserIdQuery request, CancellationToken cancellationToken)
        {
            var historyLists = await repository.GetAllByUserIdAsync(request.UserId, request.PageNumber, request.PageSize);
            return mapper.Map<List<HistoryListDto>>(historyLists);
        }
    }
}
