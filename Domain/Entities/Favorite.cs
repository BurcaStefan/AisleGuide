namespace Domain.Entities
{
    public class Favorite
    {
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
    }
}
