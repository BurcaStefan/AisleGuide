using Domain.Common;
using MediatR;

namespace Application.Use_Cases.Commands
{
    public class RefreshTokenCommand : IRequest<Result<string>>
    {
        public string Token { get; set; } = string.Empty;
    }
}