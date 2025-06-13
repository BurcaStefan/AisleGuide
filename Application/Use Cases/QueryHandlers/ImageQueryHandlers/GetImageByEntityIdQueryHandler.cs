using Application.DTOs;
using Application.Use_Cases.Queries;
using AutoMapper;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.QueryHandlers
{
    public class GetImageByEntityIdQueryHandler : IRequestHandler<GetImageByEntityIdQuery, ImageDto>
    {
        private readonly IImageRepository repository;
        private readonly IMapper mapper;

        public GetImageByEntityIdQueryHandler(IImageRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<ImageDto> Handle(GetImageByEntityIdQuery request, CancellationToken cancellationToken)
        {
            var imageResult = await repository.GetByEntityIdAsync(request.Id);
            return mapper.Map<ImageDto>(imageResult);
        }
    }
}
