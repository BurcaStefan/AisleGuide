using Application.Use_Cases.Commands.ProductCommands;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.ProductCommandHandlers
{

    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, Result<bool>>
    {
        readonly IProductRepository repository;
        readonly IMapper mapper;
        public DeleteProductCommandHandler(IProductRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<bool>> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            var result = await repository.DeleteAsync(request.Id);
            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.ErrorMessage);
            }
            return Result<bool>.Success(result.Data);
        }

    }
}
