namespace Domain.Entities
{
    public class HistoryList
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
