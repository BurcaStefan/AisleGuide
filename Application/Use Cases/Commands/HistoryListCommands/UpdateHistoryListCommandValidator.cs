using Application.Utils;
using FluentValidation;

namespace Application.Use_Cases.Commands.HistoryListCommands
{
    public class UpdateHistoryListCommandValidator : AbstractValidator<UpdateHistoryListCommand>
    {
        public UpdateHistoryListCommandValidator() 
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Id is required.")
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("Id must be a valid GUID.");
            RuleFor(x => x.Name)
                .MaximumLength(50)
                .WithMessage("Name cannot exceed 50 characters.");
        }
    }
}
