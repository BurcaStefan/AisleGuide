using Application.Use_Cases.Commands.FavoriteCommands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.FavoriteCommandHandlers
{
    public class CreateFavoriteCommandHandler : IRequestHandler<CreateFavoriteCommand, Result<Guid>>
    {
        private readonly IFavoriteRepository repository;
        private readonly IMapper mapper;

        public CreateFavoriteCommandHandler(IFavoriteRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<Guid>> Handle(CreateFavoriteCommand request, CancellationToken cancellationToken)
        {
            var favortie = mapper.Map<Favorite>(request);
            var result = await repository.AddAsync(favortie);
            if (!result.IsSuccess)
            {
                return Result<Guid>.Failure(result.ErrorMessage);
            }

            return Result<Guid>.Success(result.Data);
        }
    }
}
