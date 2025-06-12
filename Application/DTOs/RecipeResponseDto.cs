namespace Application.DTOs
{
    public class RecipeResponseDto
    {
        public List<string> Ingredients { get; set; }
        public List<string> AdditionalIngredients { get; set; }
        public List<string> Steps { get; set; }
    }
}