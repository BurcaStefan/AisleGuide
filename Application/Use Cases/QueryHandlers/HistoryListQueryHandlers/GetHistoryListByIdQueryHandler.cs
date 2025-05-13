using Application.DTOs;
using Application.Use_Cases.Queries.HistoryListQueries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers.HistoryListQueryHandlers
{
    public class GetHistoryListByIdQueryHandler : IRequestHandler<GetHistoryListByIdQuery, List<HistoryListDto>>
    {
        private readonly IHistoryListRepository repository;
        private readonly IMapper mapper;

        public GetHistoryListByIdQueryHandler(IHistoryListRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<List<HistoryListDto>> Handle(GetHistoryListByIdQuery request, CancellationToken cancellationToken)
        {
            var historyList = await repository.GetAllEntriesByListIdAsync(request.Id);
            return mapper.Map<List<HistoryListDto>>(historyList);
        }
    }
}
