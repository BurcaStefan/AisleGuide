using Application.Use_Cases.Commands.HistoryListCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.HistoryListCommandHandlers
{
    public class CreateHistoryListCommandHandler : IRequestHandler<CreateHistoryListCommand, Result<Guid>>
    {
        private readonly IHistoryListRepository repository;
        private readonly IMapper mapper;

        public CreateHistoryListCommandHandler(IHistoryListRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<Guid>> Handle(CreateHistoryListCommand request, CancellationToken cancellationToken)
        {
            var historyList = mapper.Map<HistoryList>(request);
            var result = await repository.AddAsync(historyList);
            if (!result.IsSuccess)
            {
                return Result<Guid>.Failure(result.ErrorMessage);
            }
            return Result<Guid>.Success(result.Data);
        }
    }
}
