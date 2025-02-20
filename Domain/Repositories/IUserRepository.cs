using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(User user);
        Task<Result<Guid>> UpdateAsync(User user);
        Task<Result<Guid>> DeleteAsync(Guid id);
    }
}
