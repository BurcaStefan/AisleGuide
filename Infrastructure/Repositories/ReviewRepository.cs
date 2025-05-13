using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext context;
        public ReviewRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Result<bool>> DeleteAsync(Guid id)
        {
            var review = await context.Reviews.FindAsync(id);

            if (review == null)
            {
                return Result<bool>.Failure("Review not found!");
            }

            context.Reviews.Remove(review);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }
        public async Task<Result<Guid>> AddAsync(Review review)
        {
            try
            {
                
                var userExists = await context.Users.AnyAsync(u => u.Id == review.UserId);
                if (!userExists)
                {
                    return Result<Guid>.Failure($"User with ID {review.UserId} does not exist.");
                
                }
                var productExists = await context.Products.AnyAsync(p => p.Id == review.ProductId);
                if (!productExists)
                {
                    return Result<Guid>.Failure($"Product with ID {review.ProductId} does not exist.");
                }
                
                await context.Reviews.AddAsync(review);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(review.Id);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.Message);
            }
        }
        public async Task<IEnumerable<Review>> GetAllByProductIdAsync(Guid productId, int pageNumber, int pageSize)
        {
            return await context.Reviews
                .Where(r => r.ProductId == productId)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

        }
        public async Task<Result<bool>> UpdateAsync(Review review)
        {
            try
            {
                var existingReview = await context.Reviews.FindAsync(review.Id);
                if (existingReview == null)
                    return Result<bool>.Failure($"Review with ID {review.Id} not found.");

                existingReview.Content = review.Content;
                existingReview.Rating = review.Rating;


                context.Reviews.Update(existingReview);
                await context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure(ex.Message);
            }
        }
    }
}
