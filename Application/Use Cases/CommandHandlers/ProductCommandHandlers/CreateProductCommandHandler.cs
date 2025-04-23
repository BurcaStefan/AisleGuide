using Application.Use_Cases.Commands.ProductCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.ProductCommandHandlers
{
    public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<Guid>>
    {
        private readonly IProductRepository repository;
        private readonly IMapper mapper;
        public CreateProductCommandHandler(IProductRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<Guid>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var newProduct = mapper.Map<Product>(request);
            var result = await repository.AddAsync(newProduct);
            if (!result.IsSuccess)
            {
                return Result<Guid>.Failure(result.ErrorMessage);
            }
            return Result<Guid>.Success(result.Data);
        }
    }
}
