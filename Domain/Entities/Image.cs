namespace Domain.Entities
{
    public class Image
    {
        public Guid Id { get; set; }
        public Guid EntityId { get; set; }
        public string FileExtension { get; set; }
    }
}
