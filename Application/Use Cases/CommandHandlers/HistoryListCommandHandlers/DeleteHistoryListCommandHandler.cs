using Application.Use_Cases.Commands.HistoryListCommands;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

public class DeleteHistoryListCommandHandler : IRequestHandler<DeleteHistoryListCommand, Result<bool>>
{
    private readonly IHistoryListRepository repository;
    private readonly IMapper mapper;
    public DeleteHistoryListCommandHandler(IHistoryListRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<Result<bool>> Handle(DeleteHistoryListCommand request, CancellationToken cancellationToken)
    {
        var historyList = await repository.GetAllEntriesByListIdAsync(request.Id);
        if (historyList == null || !historyList.Any())
        {
            return Result<bool>.Failure("History list not found!");
        }
        foreach (var entry in historyList)
        {
            var result = await repository.DeleteAsync(entry.Id, entry.UserId, entry.ProductId);
            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.ErrorMessage);
            }
        }
        return Result<bool>.Success(true);
    }

}
