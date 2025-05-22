using Application.DTOs;
using Application.Use_Cases.Commands.FavoriteCommands;
using Application.Use_Cases.Queries.FavoriteQueries;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly IMediator mediator;
        public FavoritesController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<FavoriteDto>>> GetAllFavorites(
            Guid id,
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = new GetAllFavoriteByUserIdQuery
            {
                UserId = id,
                PageNumber = pageNumber,
                PageSize = pageSize
            };

            var result = await mediator.Send(query);

            if (result == null || result.Count == 0)
            {
                return BadRequest("No favorites found");
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Result<Guid>>> CreateFavorite(CreateFavoriteCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpDelete("{userId:guid}/{productId:guid}")]
        public async Task<ActionResult<Result<bool>>> DeleteFavorite(Guid userId, Guid productId)
        {
            var command = new DeleteFavoriteCommand { UserId = userId, ProductId = productId };
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }

    }
}
