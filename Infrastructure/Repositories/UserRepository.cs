using Domain.Common;
using Domain.Entities;
using Domain.Repositories;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;
        private readonly AccessTokenGenerator accessTokenGenerator;
        private readonly RefreshTokenGenerator refreshTokenGenerator;

        public UserRepository(
            ApplicationDbContext context,
            IConfiguration configuration,
            AccessTokenGenerator accessTokenGenerator,
            RefreshTokenGenerator refreshTokenGenerator)
        {
            this.context = context;
            this.configuration = configuration;
            this.accessTokenGenerator = accessTokenGenerator;
            this.refreshTokenGenerator = refreshTokenGenerator;
        }

        public async Task<Result<Guid>> AddAsync(User user)
        {
            try
            {
                var existinngUser = await context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
                if (existinngUser != null)
                {
                    return Result<Guid>.Failure("This email is already taken");
                }

                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(user.Id);
            }
            catch (Exception e)
            {
                return Result<Guid>.Failure(e.InnerException!.ToString());
            }
        }

        public async Task<Result<bool>> DeleteAsync(Guid id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null)
            {
                return Result<bool>.Failure("User not found");
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return Result<bool>.Success(true);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<Result<bool>> UpdateAsync(User user)
        {
            try
            {
                var existingUser = await context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == user.Id);
                if (existingUser == null)
                {
                    return Result<bool>.Failure("User not found");
                }

                if (user.Password != existingUser.Password)
                {
                    user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                }

                context.Entry(user).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Result<bool>.Success(true);
            }
            catch (Exception e)
            {
                return Result<bool>.Failure(e.InnerException?.ToString() ?? e.Message);
            }
        }

        public async Task<Result<string>> LoginAsync(User user)
        {
            var userInDb = await context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (userInDb == null || !BCrypt.Net.BCrypt.Verify(user.Password, userInDb.Password))
            {
                return Result<string>.Failure("Invalid credentials");
            }

            var accessToken = accessTokenGenerator.Generate(userInDb);
            var refreshToken = refreshTokenGenerator.Generate();

            var refreshTokenEntity = new RefreshToken
            {
                Token = refreshToken,
                UserId = userInDb.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            await context.RefreshTokens.AddAsync(refreshTokenEntity);
            await context.SaveChangesAsync();

            var response = JsonSerializer.Serialize(new
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });

            return Result<string>.Success(response);
        }


        public async Task<Result<string>> RefreshTokenAsync(string token)
        {
            var refreshToken = await context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == token);

            if (refreshToken == null)
            {
                return Result<string>.Failure("Invalid refresh token");
            }

            if (refreshToken.ExpiresAt < DateTime.UtcNow || refreshToken.IsRevoked)
            {
                return Result<string>.Failure("Refresh token expired or revoked");
            }

            var user = refreshToken.User;
            if (user == null)
            {
                return Result<string>.Failure("User not found");
            }

            refreshToken.IsRevoked = true;
            context.RefreshTokens.Update(refreshToken);

            var accessToken = accessTokenGenerator.Generate(user);
            var newRefreshToken = refreshTokenGenerator.Generate();

            var refreshTokenEntity = new RefreshToken
            {
                Token = newRefreshToken,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            await context.RefreshTokens.AddAsync(refreshTokenEntity);
            await context.SaveChangesAsync();

            var response = JsonSerializer.Serialize(new
            {
                AccessToken = accessToken,
                RefreshToken = newRefreshToken
            });

            return Result<string>.Success(response);
        }
    }
}
