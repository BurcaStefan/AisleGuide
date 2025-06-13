using Application.DTOs;
using MediatR;

namespace Application.Use_Cases.Queries
{
    public class GetImageByIdQuery : IRequest<ImageDto>
    {
        public Guid Id { get; set; }
    }
}