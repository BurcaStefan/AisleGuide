using Application.DTOs;
using Application.Use_Cases.Commands.RecipeCommands;
using Domain.Common;
using Domain.Repositories;
using MediatR;

namespace Application.Use_Cases.CommandHandlers.RecipeCommandHandlers
{
    public class GenerateRecipeCommandHandler : IRequestHandler<GenerateRecipeCommand, Result<RecipeResponseDto>>
    {
        private readonly IRecipeRepository recipeRepository;

        public GenerateRecipeCommandHandler(IRecipeRepository recipeRepository)
        {
            this.recipeRepository = recipeRepository;
        }

        public async Task<Result<RecipeResponseDto>> Handle(GenerateRecipeCommand request, CancellationToken cancellationToken)
        {
            var recipeResult = await recipeRepository.GenerateRecipeAsync(request.Ingredients, cancellationToken);

            if (!recipeResult.IsSuccess)
            {
                return Result<RecipeResponseDto>.Failure(recipeResult.ErrorMessage);
            }

            var recipeResponseDto = new RecipeResponseDto
            {
                Ingredients = recipeResult.Data.Ingredients,
                AdditionalIngredients = recipeResult.Data.AdditionalIngredients,
                Steps = recipeResult.Data.Steps
            };

            return Result<RecipeResponseDto>.Success(recipeResponseDto);
        }
    }
}