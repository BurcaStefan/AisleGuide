using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.ReviewCommands
{
    public class UpdateReviewCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public string? Content { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
