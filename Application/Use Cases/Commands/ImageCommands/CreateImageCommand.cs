using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class CreateImageCommand : IRequest<Result<Guid>>
    {
        public Guid EntityId { get; set; }
        public string EntityType { get; set; }
        public string FileExtension { get; set; }
    }
}