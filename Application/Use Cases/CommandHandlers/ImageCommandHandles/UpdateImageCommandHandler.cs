using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateImageCommandHandler : IRequestHandler<UpdateImageCommand, Result<bool>>
    {
        private readonly IImageRepository repository;
        private readonly IMapper mapper;

        public UpdateImageCommandHandler(IImageRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }

        public async Task<Result<bool>> Handle(UpdateImageCommand request, CancellationToken cancellationToken)
        {
            var image = mapper.Map<Image>(request);
            var result = await repository.UpdateAsync(image);
            if (result == null)
            {
                return Result<bool>.Failure("Update operation failed.");
            }
            if (result.IsSuccess)
            {
                return Result<bool>.Success(true);
            }
            return Result<bool>.Failure(result.ErrorMessage);
        }
    }
}