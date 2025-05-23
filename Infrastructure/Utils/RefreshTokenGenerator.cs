using System.Security.Cryptography;

namespace Domain.Common
{
    public class RefreshTokenGenerator
    {
        public string Generate()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
            }
            return Convert.ToBase64String(randomNumber);
        }
    }
}
