using Application.Use_Cases.Commands.HistoryListCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.HistoryListCommandHandlers
{
    public class UpdateHistoryListCommandHandler : IRequestHandler<UpdateHistoryListCommand, Result<bool>>
    {
        private readonly IHistoryListRepository repository;
        private readonly IMapper mapper;

        public UpdateHistoryListCommandHandler(IHistoryListRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<bool>> Handle(UpdateHistoryListCommand request, CancellationToken cancellationToken)
        {
            var entries = await repository.GetAllEntriesByListIdAsync(request.Id);
            if (!entries.Any())
            {
                return Result<bool>.Failure("History list not found");
            }

            var historyList = mapper.Map<HistoryList>(request);

            return await repository.UpdateAsync(historyList);
        }
    }
}
