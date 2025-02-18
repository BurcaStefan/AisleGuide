using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("uuid-ossp");
            modelBuilder.Entity<User>(
                    entity=>
                    {
                        entity.ToTable("users");
                        entity.HasKey(e => e.Id);
                        entity.Property(e => e.Id)
                        .HasColumnType("uuid")
                        .HasDefaultValueSql("uuid_generate_v4()")
                        .ValueGeneratedOnAdd();
                        entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                        entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                        entity.Property(e => e.Email).IsRequired();
                        entity.Property(e => e.Password).IsRequired();
                        entity.Property(e => e.isAdmin).IsRequired().HasDefaultValue(false);
                    }
                );
        }
    }
}
