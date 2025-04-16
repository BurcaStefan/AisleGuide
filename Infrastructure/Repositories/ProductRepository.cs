using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

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

        Task<Result<bool>> IProductRepository.DeleteAsync(Guid id)
        {
            throw new NotImplementedException();
        }

        Task<Result<bool>> IProductRepository.UpdateAsync(Product product)
        {
            throw new NotImplementedException();
        }
    }
}
