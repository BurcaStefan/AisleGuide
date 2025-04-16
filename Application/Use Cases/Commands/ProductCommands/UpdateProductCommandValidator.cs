using FluentValidation;

namespace Application.Use_Cases.Commands.ProductCommands
{
    public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
    {
        public UpdateProductCommandValidator()
        {
            RuleFor(x => x.Id)
                .NotEmpty()
                .WithMessage("Product ID is required.");
            RuleFor(x => x.Name)
                .NotEmpty()
                .MaximumLength(100);
            RuleFor(x => x.Price)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Description)
                .NotEmpty()
                .MaximumLength(200);
            RuleFor(x => x.Category)
                .NotEmpty()
                .MaximumLength(50);
            RuleFor(x => x.ISBN)
                .NotEmpty()
                .MaximumLength(13);
            RuleFor(x => x.ShelvingUnit)
                .MaximumLength(10);
            RuleFor(x => x.AverageRating)
                .InclusiveBetween(0, 5);
            RuleFor(x => x.Calories)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Protein)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Carbohydrates)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Sugars)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Fat)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.SaturatedFat)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Fiber)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Salt)
                .GreaterThanOrEqualTo(0);
            RuleFor(x => x.Cholesterol)
                .GreaterThanOrEqualTo(0);
        }
    }
}
