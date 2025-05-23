using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(User user);
        Task<Result<bool>> UpdateAsync(User user);
        Task<Result<bool>> DeleteAsync(Guid id);
        Task<Result<string>> LoginAsync(User user);
        Task<Result<string>> RefreshTokenAsync(string token);

    }
}
