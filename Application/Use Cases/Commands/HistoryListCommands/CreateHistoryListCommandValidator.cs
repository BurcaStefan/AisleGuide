using Application.Utils;
using FluentValidation;

namespace Application.Use_Cases.Commands.HistoryListCommands
{
    public class CreateHistoryListCommandValidator : AbstractValidator<CreateHistoryListCommand>
    {
        public CreateHistoryListCommandValidator() 
        {
            RuleFor(x => x.UserId)
                .NotEmpty()
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("UserId is required.");
            RuleFor(x => x.ProductId)
                .NotEmpty()
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("ProductId is required.");
            RuleFor(x => x.Name)
                .MaximumLength(100)
                .WithMessage("Name cannot exceed 100 characters.");
            RuleFor(x => x.CreatedAt)
                .NotEmpty()
                .WithMessage("CreatedAt is required.");
        }
    }
}
