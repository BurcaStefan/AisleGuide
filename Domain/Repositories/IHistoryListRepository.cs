using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IHistoryListRepository
    {
        Task<IEnumerable<HistoryList>> GetAllByUserIdAsync(Guid userId, int PageNumber, int PageSize);
        Task<IEnumerable<HistoryList>> GetAllEntriesByListIdAsync(Guid id);
        Task<Result<Guid>> AddAsync(HistoryList historyList);
        Task<Result<bool>> UpdateAsync(HistoryList historyList);
        Task<Result<bool>> DeleteAsync(Guid id, Guid userId, Guid productId);
    }
}
