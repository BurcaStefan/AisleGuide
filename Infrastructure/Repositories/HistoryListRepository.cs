using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class HistoryListRepository : IHistoryListRepository
    {
        private readonly ApplicationDbContext context;
        public HistoryListRepository(ApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<Result<Guid>> AddAsync(HistoryList historyList)
        {
            try
            {
                await context.HistoryLists.AddAsync(historyList);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(historyList.Id);
            }
            catch (Exception ex)
            {
                return Result<Guid>.Failure($"Error adding history list: {ex.Message}");
            }
        }

        public async Task<Result<bool>> DeleteAsync(Guid id, Guid userId, Guid productId)
        {
            var historyList = await context.HistoryLists.FindAsync(id, userId, productId);
            if (historyList == null)
            {
                return Result<bool>.Failure("History list entry not found");
            }

            context.HistoryLists.Remove(historyList);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<IEnumerable<HistoryList>> GetAllByUserIdAsync(Guid userId, int PageNumber, int PageSize)
        {
            return await context.HistoryLists
                .Where(x => x.UserId == userId)
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();
        }

        public async Task<IEnumerable<HistoryList>> GetAllEntriesByListIdAsync(Guid listId)
        {
            return await context.HistoryLists
                .Where(x => x.Id == listId)
                .ToListAsync();
        }


        public async Task<Result<bool>> UpdateAsync(HistoryList historyList)
        {
            try
            {
                var entries = await context.HistoryLists
                    .Where(x => x.Id == historyList.Id)
                    .ToListAsync();

                if (!entries.Any())
                {
                    return Result<bool>.Failure("History list not found");
                }

                foreach (var entry in entries)
                {
                    entry.Name = historyList.Name;
                    entry.CreatedAt = historyList.CreatedAt;
                }

                await context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return Result<bool>.Failure($"Error updating history list: {ex.Message}");
            }
        }

    }
}
