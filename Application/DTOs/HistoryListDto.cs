namespace Application.DTOs
{
    public class HistoryListDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid ProductId { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
