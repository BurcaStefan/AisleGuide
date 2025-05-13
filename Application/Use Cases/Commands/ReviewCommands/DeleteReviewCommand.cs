using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.ReviewCommands
{
    public class DeleteReviewCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
    }
}
