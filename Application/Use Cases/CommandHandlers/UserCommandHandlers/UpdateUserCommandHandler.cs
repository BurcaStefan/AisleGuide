using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class UpdateUserCommandHandler : IRequestHandler<UpdateUserCommand, Result<bool>>
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;
        public UpdateUserCommandHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<bool>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var updatedUser = mapper.Map<User>(request);
            var result = await repository.UpdateAsync(updatedUser);

            if (!result.IsSuccess)
            {
                return Result<bool>.Failure(result.ErrorMessage);
            }

            return Result<bool>.Success(result.Data);
        }
    }
}
