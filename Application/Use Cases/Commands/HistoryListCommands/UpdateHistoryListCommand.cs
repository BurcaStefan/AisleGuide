using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.HistoryListCommands
{
    public class UpdateHistoryListCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
