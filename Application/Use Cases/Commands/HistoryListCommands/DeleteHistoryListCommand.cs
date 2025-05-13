using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.HistoryListCommands
{
    public class DeleteHistoryListCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
    }
}
