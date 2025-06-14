using CloudinaryDotNet;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Repositories
{
    public class ImageRepository : IImageRepository
    {
        private readonly ApplicationDbContext context;

        public ImageRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Result<Guid>> AddAsync(Image image)
        {
            try
            {
                await context.Images.AddAsync(image);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(image.Id);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure(ex.InnerException!.ToString());
            }
        }

        public async Task<Result<bool>> DeleteAsync(Guid entiryId)
        {
            var image = await context.Images.FirstOrDefaultAsync(i=>i.EntityId==entiryId);
            if (image == null)
            {
                return Result<bool>.Failure("Image not found");
            }
            context.Images.Remove(image);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<Image> GetByEntityIdAsync(Guid entityId)
        {
            return await context.Images.FirstOrDefaultAsync(i => i.EntityId == entityId);
        }

        public async Task<Image> GetByIdAsync(Guid id)
        {
            return await context.Images.FindAsync(id);
        }

        public async Task<Result<bool>> UpdateAsync(Image image)
        {
            try
            {
                context.Entry(image).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure(ex.InnerException!.ToString());
            }
        }
    }
}