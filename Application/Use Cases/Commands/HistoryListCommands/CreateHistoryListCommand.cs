using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.HistoryListCommands
{
    public class CreateHistoryListCommand : IRequest<Result<Guid>>
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
