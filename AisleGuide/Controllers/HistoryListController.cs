using Application.DTOs;
using Application.Use_Cases.Commands.HistoryListCommands;
using Application.Use_Cases.Queries.HistoryListQueries;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistoryListController : ControllerBase
    {
        private readonly IMediator mediator;

        public HistoryListController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<HistoryListDto>>> GetHistoryList(Guid userId, [FromQuery] int PageNumber = 1, [FromQuery] int PageSize = 10)
        {
            var query = new GetAllPaginatedHistoryListByUserIdQuery
            {
                UserId = userId,
                PageNumber = PageNumber,
                PageSize = PageSize
            };

            var result = await mediator.Send(query);
            if (result == null || result.Count == 0)
            {
                return BadRequest("No product found.");
            }
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<HistoryListDto>> GetHistoryListById(Guid id)
        {
            var query = new GetHistoryListByIdQuery { Id = id };
            var result = await mediator.Send(query);
            if (result == null)
            {
                return BadRequest("No product found.");
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Result<Guid>>> CreateHistoryList(CreateHistoryListCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Result<bool>>> DeleteHistoryList(Guid id)
        {
            var command = new DeleteHistoryListCommand { Id = id };
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return Ok(result.Data);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Result<bool>>> UpdateHistoryList(Guid id, UpdateHistoryListCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("History list ID mismatch");
            }

            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

    }
}
