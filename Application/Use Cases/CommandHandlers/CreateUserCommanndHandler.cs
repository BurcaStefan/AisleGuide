using Application.Use_Cases.Commands;
using MediatR;
using Domain.Repositories;
using Domain.Entities;
using AutoMapper;
using System.ComponentModel.DataAnnotations;

namespace Application.Use_Cases.CommandHandlers
{
    public class CreateUserCommanndHandler : IRequestHandler<CreateUserCommand, Guid>
    {
        private readonly IUserRepository repository;
        private readonly IMapper mapper;
        public CreateUserCommanndHandler(IUserRepository repository, IMapper mapper)
        {
            this.repository = repository;
            this.mapper = mapper;
        }
        public async Task<Guid> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            //CreateUserCommandValidator validationRules = new CreateUserCommandValidator();
            //var validator=validationRules.Validate(request);
            //if (!validator.IsValid) 
            //{ 
            //    var errorResult = new List<string>();
            //    foreach (var error in validator.Errors)
            //    {
            //        errorResult.Add(error.ErrorMessage);
            //    }
            //    throw new ValidationException(errorResult.ToString());
            //}


            var newUser=mapper.Map<User>(request);
            return await repository.AddAsync(newUser);
        }
    }
}
