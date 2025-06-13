using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class UpdateImageCommand : IRequest<Result<bool>>
    {
        public Guid Id { get; set; }
        public Guid EntityId { get; set; }
        public string EntityType { get; set; }
        public string FileExtension { get; set; }
    }
}