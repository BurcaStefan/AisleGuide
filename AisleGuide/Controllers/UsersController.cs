using Application.Use_Cases.Commands;
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

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateUser(CreateUserCommand command)
        {
            return await mediator.Send(command);
        }

        [HttpPut("id")]
        public async Task<ActionResult> UpdateUser(Guid id, UpdateUserCommand command)
        {
            if(id != command.Id)
            {
                return BadRequest("Id is not identical with command.Id");
            }

            await mediator.Send(command);
            return NoContent();
        }
    }
}
