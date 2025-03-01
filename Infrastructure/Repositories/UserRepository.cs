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

namespace Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;
        public UserRepository(ApplicationDbContext context, IConfiguration configuration)
        {
            this.context = context;
            this.configuration = configuration;
        }
        public async Task<Result<Guid>> AddAsync(User user)
        {
            try
            {
                await context.Users.AddAsync(user);
                await context.SaveChangesAsync();
                return Result<Guid>.Success(user.Id);
            }
            catch (Exception e)
            {
                return Result<Guid>.Failure(e.InnerException!.ToString());
            }
        }

        public async Task<Result<Guid>> DeleteAsync(Guid id)
        {
            var user = await context.Users.FindAsync(id);

            if (user == null)
            {
                return Result<Guid>.Failure("User not found");
            }

            context.Users.Remove(user);
            await context.SaveChangesAsync();
            return Result<Guid>.Success(user.Id);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<User?> GetByIdAsync(Guid id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<Result<Guid>> UpdateAsync(User user)
        {
            try
            {
                context.Entry(user).State = EntityState.Modified;
                await context.SaveChangesAsync();
                return Result<Guid>.Success(user.Id);
            }
            catch (Exception e)
            {
                return Result<Guid>.Failure(e.InnerException!.ToString());
            }
        }

        public async Task<Result<string>> LoginAsync(User user)
        {
            var userInDb = await context.Users.SingleOrDefaultAsync(u => u.Email == user.Email);
            if (userInDb == null)
            {
                return Result<string>.Failure("Invalid credentials");
            }


            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(configuration["Jwt:Key"]!);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, user.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            //return tokenHandler.WriteToken(token);

            return Result<string>.Success(tokenHandler.WriteToken(token));
        }
    }
}
