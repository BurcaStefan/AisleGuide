using Application.Use_Cases.Commands;
using MediatR;
using Domain.Repositories;
using Domain.Entities;
using AutoMapper;
using Domain.Common;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateUserCommanndHandler : IRequestHandler<CreateUserCommand, Result<Guid>>
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;
        public CreateUserCommanndHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<Guid>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var newUser=mapper.Map<User>(request);
            var result= await repository.AddAsync(newUser);
            
            if(result.IsSuccess)
            {
                return Result<Guid>.Success(result.Data);
            }
            return Result<Guid>.Failure(result.ErrorMessage);
        }
    }
}
