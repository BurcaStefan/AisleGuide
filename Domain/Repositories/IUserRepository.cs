using Domain.Entities;

namespace Domain.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> GetByIdAsync(Guid id);
        Task<Guid> AddAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsynnc(Guid id);
    }
}
