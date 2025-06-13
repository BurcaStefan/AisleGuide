using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IImageRepository
    {
        Task<Result<Guid>> AddAsync(Image image);
        Task<Image> GetByIdAsync(Guid id);
        Task<Image> GetByEntityIdAsync(Guid entityId);
        Task<Result<bool>> DeleteAsync(Guid id);
        Task<Result<bool>> UpdateAsync(Image image);
    }
}