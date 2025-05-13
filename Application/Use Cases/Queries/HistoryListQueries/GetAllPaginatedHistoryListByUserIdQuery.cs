using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.HistoryListQueries
{
    public class GetAllPaginatedHistoryListByUserIdQuery : IRequest<List<HistoryListDto>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }
}
