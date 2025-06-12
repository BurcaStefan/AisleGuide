using Application.DTOs;
using Application.Use_Cases.Commands.RecipeCommands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RecipeController : ControllerBase
    {
        private readonly IMediator mediator;
        public RecipeController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("generate-recipe")]
        public async Task<ActionResult<RecipeResponseDto>> GenerateRecipe([FromBody] RecipeRequestDto request)
        {

            var command = new GenerateRecipeCommand { Ingredients = request.Ingredients };
            var result = await mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }
    }
}
