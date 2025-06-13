using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateImageCommandHandler : IRequestHandler<CreateImageCommand, Result<Guid>>
    {
        private readonly IImageRepository repository;
        private readonly IMapper mapper;

        public CreateImageCommandHandler(IImageRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<Guid>> Handle(CreateImageCommand request, CancellationToken cancellationToken)
        {
            var image = mapper.Map<Image>(request);
            var result = await repository.AddAsync(image);
            if (result.IsSuccess)
            {
                return Result<Guid>.Success(image.Id);
            }
            return Result<Guid>.Failure(result.ErrorMessage);
        }
    }
}
