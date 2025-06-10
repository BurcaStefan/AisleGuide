using Application.Use_Cases.Commands.EmailCommands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmailController : ControllerBase
    {
        private readonly IMediator mediator;
        public EmailController(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpPost("contact")]
        public async Task<IActionResult> SendContactEmail([FromBody] SendContactEmailCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);
            return Ok();
        }

        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> SendForgotPasswordEmail([FromBody] SendForgotPasswordEmailCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);
            return Ok();
        }

        [HttpPost("confirm-email")]
        [AllowAnonymous]
        public async Task<IActionResult> SendEmailConfirmation([FromBody] SendEmailConfirmationCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess) return BadRequest(result.ErrorMessage);
            return Ok();
        }
    }
}
