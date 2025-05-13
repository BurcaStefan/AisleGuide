using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.HistoryListQueries
{
    public class GetHistoryListByIdQuery : IRequest<List<HistoryListDto>>
    {
        public Guid Id { get; set; }
    }
}
