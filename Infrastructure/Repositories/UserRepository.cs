using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext context;
        public UserRepository(ApplicationDbContext context) 
        {
            this.context = context;        
        }
        public async Task<Result<Guid>> AddAsync(User user)
        {
            try 
            { 
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(user.Id);
            }
            catch (Exception e)
            {
                return Result<Guid>.Failure(e.InnerException!.ToString());  
            }
        }

        public Task DeleteAsynnc(Guid id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<Result<Guid>> UpdateAsync(User user)
        {
            try
            {
                context.Entry(user).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Result<Guid>.Success(user.Id);
            }
            catch (Exception e)
            {
                return Result<Guid>.Failure(e.InnerException!.ToString());
            }
        }
    }
}
