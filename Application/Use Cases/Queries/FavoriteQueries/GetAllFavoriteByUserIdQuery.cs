using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries.FavoriteQueries
{
    public class GetAllFavoriteByUserIdQuery : IRequest<List<FavoriteDto>>
    {
        public Guid UserId { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
    }

}
