namespace Application.DTOs
{
    public class ImageDto
    {
        public Guid Id { get; set; }
        public Guid EntityId { get; set; }
        public string EntityType { get; set; }
        public string FileExtension { get; set; }
    }
}
