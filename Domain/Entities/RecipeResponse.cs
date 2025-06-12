namespace Domain.Entities
{
    public class RecipeResponse
    {
        public List<string> Ingredients { get; set; }
        public List<string> AdditionalIngredients { get; set; }
        public List<string> Steps { get; set; }
    }
}
