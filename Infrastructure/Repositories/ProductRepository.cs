using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Utils;

namespace Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext context;
        public ProductRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Result<Guid>> AddAsync(Product product)
        {
            try
            {
                var existingProduct = await context.Products.SingleOrDefaultAsync(p => p.ISBN == product.ISBN);
                if (existingProduct != null)
                {
                    return Result<Guid>.Failure("A product with this ISBN exists.");
                }

                await context.Products.AddAsync(product);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(product.Id);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.Message);
            }
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await context.Products.ToListAsync();
        }

        public async Task<Product> GetByIdAsync(Guid id)
        {
            return await context.Products.FindAsync(id);
        }

        public async Task<Result<bool>> DeleteAsync(Guid id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null)
            {
                return Result<bool>.Failure("Product not found");
            }

            context.Products.Remove(product);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<Result<bool>> UpdateAsync(Product product)
        {
            try
            {
                context.Entry(product).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure(ex.Message);
            }
        }

        public async Task<Result<IEnumerable<Product>>> GetRecommendedProductsAsync(Guid userId, int topN = 20)
        {
            try
            {
                var favorites = await context.Favorites
                    .Where(f => f.UserId == userId)
                    .Join(context.Products,
                        fav => fav.ProductId,
                        prod => prod.Id,
                        (fav, prod) => prod)
                    .ToArrayAsync();

                if (favorites.Length == 0)
                {
                    return Result<IEnumerable<Product>>.Failure("User has no favorites to base recommendations on");
                }

                var candidates = await context.Products
                    .Where(p => !favorites.Select(f => f.Id).Contains(p.Id))
                    .ToArrayAsync();

                if (candidates.Length == 0)
                {
                    return Result<IEnumerable<Product>>.Failure("No products available for recommendation");
                }

                var recommendations = RecommendProductsAIAlgorithm.Recommend(favorites, candidates, topN);

                return Result<IEnumerable<Product>>.Success(recommendations);
            }
            catch (Exception ex)
            {
                return Result<IEnumerable<Product>>.Failure(ex.Message);
            }
        }
    }
}
