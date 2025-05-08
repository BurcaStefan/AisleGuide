using Application.Utils;
using FluentValidation;

namespace Application.Use_Cases.Commands.FavoriteCommands
{
    public class CreateFavoriteCommandValidator : AbstractValidator<CreateFavoriteCommand>
    {
        public CreateFavoriteCommandValidator()
        {
            RuleFor(x => x.UserId).NotEmpty().Must(GuidValidator.BeAValidGuid).WithMessage("The user id must be a valid Guid.");
            RuleFor(x => x.ProductId).NotEmpty().Must(GuidValidator.BeAValidGuid).WithMessage("The product id must be a valid Guid.");
        }
    }
}
