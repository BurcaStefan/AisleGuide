using Application.Utils;
using FluentValidation;

namespace Application.Use_Cases.Commands.ReviewCommands
{
    public class UpdateReviewCommandValidator : AbstractValidator<UpdateReviewCommand>
    {
        public UpdateReviewCommandValidator() 
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("ID must be a valid Guid.");
            RuleFor(x => x.Content)
                .MaximumLength(200)
                .WithMessage("Review content cannot exceed 200 characters.");
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5.");
        }
    }
}
