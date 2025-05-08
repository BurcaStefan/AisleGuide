using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly ApplicationDbContext context;
        public FavoriteRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Favorite>> GetAllPaginatedByUserIdAsync(Guid id, int pageNumber, int pageSize)
        {
            return await context.Favorites
                .Where(f => f.UserId == id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<Result<Guid>> AddAsync(Favorite favorite)
        {
            try
            {
                var existingFavorite = context.Favorites.SingleOrDefault(f => f.UserId == favorite.UserId && f.ProductId == favorite.ProductId);
                if (existingFavorite != null)
                {
                    return Result<Guid>.Failure("This product is in your favorite list.");
                }
                await context.Favorites.AddAsync(favorite);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(favorite.ProductId);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.Message);
            }
        }

        public async Task<Result<bool>> DeleteAsync(Guid userId, Guid productId)
        {
            var favorite = await context.Favorites
                .SingleOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId);
            if (favorite == null)
            {
                return Result<bool>.Failure("Favorite not found");
            }
            context.Favorites.Remove(favorite);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }
    }
}
