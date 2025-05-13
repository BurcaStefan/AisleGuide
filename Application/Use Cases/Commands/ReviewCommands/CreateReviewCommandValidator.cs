using Application.Utils;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Use_Cases.Commands.ReviewCommands
{
    public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
    {
        public CreateReviewCommandValidator() 
        {
            RuleFor(x => x.ProductId)
                .NotEmpty()
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("Product ID must be a valid Guid.");
            RuleFor(x => x.UserId)
                .NotEmpty()
                .Must(GuidValidator.BeAValidGuid)
                .WithMessage("User ID must be a valid Guid.");
            RuleFor(x => x.Context)
                .MaximumLength(200)
                .WithMessage("Review content cannot exceed 200 characters.");
            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5)
                .WithMessage("Rating must be between 1 and 5.");
        }
    }
}
