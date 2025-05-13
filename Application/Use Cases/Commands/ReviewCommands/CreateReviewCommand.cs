using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.ReviewCommands
{
    public class CreateReviewCommand : IRequest<Result<Guid>>
    {
        public Guid ProductId { get; set; }
        public Guid UserId { get; set; }
        public string? Context { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
