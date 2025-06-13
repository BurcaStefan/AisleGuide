using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetImageByEntityIdQuery : IRequest<ImageDto>
    {
        public Guid Id { get; set; }
    }
}
