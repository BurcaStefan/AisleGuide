using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.ProductCommands
{
    public class CreateProductCommand: IRequest<Result<Guid>>
    {
        public string Name { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public string ISBN { get; set; }
        public string? ShelvingUnit { get; set; }
        public float? AverageRating { get; set; }

        public int Calories { get; set; }
        public float Protein { get; set; }
        public float Carbohydrates { get; set; }
        public float Sugars { get; set; }
        public float Fat { get; set; }
        public float SaturatedFat { get; set; }
        public float Fiber { get; set; }
        public float Salt { get; set; }
        public float Cholesterol { get; set; }
    }
}
