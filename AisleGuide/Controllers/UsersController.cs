using Application.DTOs;
using Application.Use_Cases.Commands;
using Application.Use_Cases.Queries;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IMediator mediator;
        public UsersController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            var query = new GetAllUsersQuery();
            var result = await mediator.Send(query);

            if(result == null) 
            {
                return BadRequest("No users found");
            }
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<UserDto>> GetUserById(Guid id)
        {
            var query = new GetUserByIdQuery { Id = id };
            var result = await mediator.Send(query);

            if(result == null)
            {
                return BadRequest("User not found");
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Result<Guid>>> CreateUser(CreateUserCommand command)
        {
            var result = await mediator.Send(command);
            if(!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }

        [HttpPut("id")]
        public async Task<ActionResult<Result<Guid>>> UpdateUser(Guid id, UpdateUserCommand command)
        {
            if(id != command.Id)
            {
                return BadRequest("Id is not identical with command.Id");
            }

            var result=await mediator.Send(command);

            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status200OK, result.Data);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Result<Guid>>> DeleteUser(Guid id)
        {
            var command = new DeleteUserCommand { Id = id };
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status204NoContent);
        }
    }
}
