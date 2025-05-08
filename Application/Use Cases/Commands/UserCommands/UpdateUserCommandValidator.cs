using FluentValidation;
using Application.Utils;

namespace Application.Use_Cases.Commands
{
    public class UpdateUserCommandValidator : AbstractValidator<UpdateUserCommand>
    {
        public UpdateUserCommandValidator() 
        { 
            RuleFor(x => x.Id).NotEmpty().Must(GuidValidator.BeAValidGuid).WithMessage("The id must be a valid Guid.");
            RuleFor(x => x.FirstName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.LastName).NotEmpty().MaximumLength(50);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
