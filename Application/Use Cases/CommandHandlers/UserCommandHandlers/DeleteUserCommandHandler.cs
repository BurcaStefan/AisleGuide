using Application.Use_Cases.Commands;
using AutoMapper;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers
{
    public class DeleteUserCommandHandler : IRequestHandler<DeleteUserCommand, Result<Guid>>
    {
        readonly IUserRepository repository;
        readonly IMapper mapper;
        public DeleteUserCommandHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Result<Guid>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var result = await repository.DeleteAsync(request.Id);
            if (!result.IsSuccess)
            {
                return Result<Guid>.Failure(result.ErrorMessage);
            }
            return Result<Guid>.Success(result.Data);
        }
    }
}
