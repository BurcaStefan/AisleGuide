using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        Task<Product> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(Product product);
        Task<Result<bool>> UpdateAsync(Product product);
        Task<Result<bool>> DeleteAsync(Guid id);
        Task<Result<IEnumerable<Product>>> GetRecommendedProductsAsync(Guid userId, int topN = 20);
    }
}
