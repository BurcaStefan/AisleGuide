using Application.DTOs;
using Application.Use_Cases.Commands.ReviewCommands;
using Application.Use_Cases.Queries.ReviewQueries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IMediator mediator;
        public ReviewsController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet("{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetAllReviewsByProductId(Guid productId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 5)
        {
            var query = new GetAllReviewByProductIdQuery
            {
                ProductId = productId,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
            var result = await mediator.Send(query);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateReview(CreateReviewCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<bool>> UpdateReview(Guid id,UpdateReviewCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("Product ID mismatch");
            }

            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<bool>> DeleteReview(Guid id)
        {
            var command = new DeleteReviewCommand { Id = id };
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }

    }
}
