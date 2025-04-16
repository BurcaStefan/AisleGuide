using Application.DTOs;
using Application.Use_Cases.Commands.ProductCommands;
using Application.Use_Cases.Queries.ProductQueries;
using Domain.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AisleGuide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ProductCotroller : ControllerBase
    {
        private readonly IMediator mediator;

        public ProductCotroller(IMediator mediator)
        {
            this.mediator = mediator;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetAllProducts()
        {
            var query = new GetAllProductsQuery();
            var result = await mediator.Send(query);
            if (result == null || !result.Any())
            {
                return BadRequest("No products found");
            }
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProductDto>> GetProductById(Guid id)
        {
            var query = new GetProductByIdQuery { Id = id };
            var result = await mediator.Send(query);
            if (result == null)
            {
                return BadRequest("Product not found");
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Result<Guid>>> CreateProduct(CreateProductCommand command)
        {
            var result = await mediator.Send(command);
            if (!result.IsSuccess)
            {
                return BadRequest(result.ErrorMessage);
            }
            return StatusCode(StatusCodes.Status201Created, result.Data);
        }
    }
}
