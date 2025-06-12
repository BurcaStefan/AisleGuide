using Domain.Common;
using Domain.Entities;

namespace Domain.Repositories
{
    public interface IRecipeRepository
    {
        Task<Result<RecipeResponse>> GenerateRecipeAsync(string ingredients, CancellationToken cancellationToken);
    }
}