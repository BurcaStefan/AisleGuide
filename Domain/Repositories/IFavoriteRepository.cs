using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IFavoriteRepository
    {
        Task<IEnumerable<Favorite>> GetAllPaginatedByUserIdAsync(Guid id, int pageNumber, int pageSize);
        Task<Result<Guid>> AddAsync(Favorite favorite);
        Task<Result<bool>> DeleteAsync(Guid userId, Guid productId);
    }
}