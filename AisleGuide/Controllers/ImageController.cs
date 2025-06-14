using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using Domain.Common;
using Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ImagesController : ControllerBase
    {
        private readonly IMediator mediator;
        private readonly IImageRepository imageRepository;

        public ImagesController(IMediator mediator, IImageRepository imageRepository)
        {
            this.mediator = mediator;
            this.imageRepository = imageRepository;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Result<Guid>>> CreateImage(CreateImageCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpGet("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ImageDto>> GetImageById(Guid id)
        {
            var query = new GetImageByIdQuery { Id = id };
            var result = await mediator.Send(query);
            if (result == null)
            {
                return BadRequest("Image not found");
            }
            return Ok(result);
        }

        [HttpGet("entity/{entityId:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<ImageDto>> GetImageByEntityId(Guid entityId)
        {
            var query = new GetImageByEntityIdQuery { EntityId = entityId };
            var result = await mediator.Send(query);
            if (result == null)
            {
                return NotFound("Image not found");
            }
            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<Result<bool>>> DeleteImage(Guid id)
        {
            var result = await mediator.Send(new DeleteImageCommand(id));
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status200OK, result.Data);
        }

        [HttpPut("{id:guid}")]
        [AllowAnonymous]
        public async Task<ActionResult<Result<bool>>> UpdateImage(Guid id, [FromBody] UpdateImageCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("The id should be identical with command.Id");
            }
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status200OK, result.Data);
        }
    }
}