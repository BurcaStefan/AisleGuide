using Application.DTOs;
using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands.RecipeCommands
{
    public class GenerateRecipeCommand : IRequest<Result<RecipeResponseDto>>
    {
        public string Ingredients { get; set; }
    }
}