using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IReviewRepository
    {
        Task<IEnumerable<Review>> GetAllByProductIdAsync(Guid productId, int pageNumber, int pageSize);
        Task<Result<Guid>> AddAsync(Review review);
        Task<Result<bool>> UpdateAsync(Review review);
        Task<Result<bool>> DeleteAsync(Guid id);
    }
}
