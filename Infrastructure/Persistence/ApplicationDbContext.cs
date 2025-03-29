using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using static System.Net.Mime.MediaTypeNames;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<HistoryList> HistoryLists { get; set; }
        public DbSet<Image> Images { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("uuid-ossp");

            modelBuilder.Entity<User>(entity => {
                entity.ToTable("users");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasColumnName("id")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.FirstName)
                    .HasColumnName("first_name")
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.LastName)
                    .HasColumnName("last_name")
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .IsRequired();
                entity.Property(e => e.Password)
                    .HasColumnName("password")
                    .IsRequired();
                entity.Property(e => e.isAdmin)
                    .HasColumnName("is_admin")
                    .IsRequired()
                    .HasDefaultValue(false);
            });

            modelBuilder.Entity<Product>(entity => {
                entity.ToTable("products");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id)
                    .HasColumnType("uuid")
                    .HasColumnName("id")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.Price)
                    .HasColumnName("price")
                    .IsRequired();
                entity.Property(e => e.Description)
                    .HasColumnName("description")
                    .IsRequired()
                    .HasMaxLength(200);
                entity.Property(e => e.Category)
                    .HasColumnName("category")
                    .IsRequired()
                    .HasMaxLength(50);
                entity.Property(e => e.ISBN)
                    .HasColumnName("isbn")
                    .IsRequired()
                    .HasMaxLength(13);
                entity.Property(e => e.ShelvingUnit)
                    .HasColumnName("shelving_unit")
                    .HasMaxLength(10);
                entity.Property(e => e.AverageRating)
                    .HasColumnName("average_rating")
                    .IsRequired()
                    .HasDefaultValue(0);

                entity.Property(e => e.Calories)
                    .HasColumnName("calories")
                    .IsRequired();
                entity.Property(e => e.Protein)
                    .HasColumnName("protein")
                    .IsRequired();
                entity.Property(e => e.Carbohydrates)
                    .HasColumnName("carbohydrates")
                    .IsRequired();
                entity.Property(e => e.Sugars)
                    .HasColumnName("sugars")
                    .IsRequired();
                entity.Property(e => e.Fat)
                    .HasColumnName("fat")
                    .IsRequired();
                entity.Property(e => e.SaturatedFat)
                    .HasColumnName("saturated_fat")
                    .IsRequired();
                entity.Property(e => e.Fiber)
                    .HasColumnName("fiber")
                    .IsRequired();
                entity.Property(e => e.Salt)
                    .HasColumnName("salt")
                    .IsRequired();
                entity.Property(e => e.Cholesterol)
                    .HasColumnName("cholesterol")
                    .IsRequired();
            });

            modelBuilder.Entity<Favorite>(entity => {
                entity.ToTable("favorites");
                entity.HasKey(e => new { e.UserId, e.ProductId });

                entity.Property(e => e.UserId)
                    .HasColumnName("user_id")
                    .HasColumnType("uuid")
                    .IsRequired();

                entity.Property(e => e.ProductId)
                    .HasColumnName("product_id")
                    .HasColumnType("uuid")
                    .IsRequired();

                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(e => e.UserId);

                entity.HasOne<Product>()
                    .WithMany()
                    .HasForeignKey(e => e.ProductId);
            });

            modelBuilder.Entity<Review>(entity => {
                entity.ToTable("reviews");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UserId)
                    .HasColumnName("user_id")
                    .HasColumnType("uuid");

                entity.Property(e => e.ProductId)
                    .HasColumnName("product_id")
                    .HasColumnType("uuid");

                entity.Property(e => e.Message)
                    .HasColumnName("review")
                    .HasMaxLength(200);

                entity.Property(e => e.Rating)
                    .HasColumnName("star_rating")
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(e => e.UserId);

                entity.HasOne<Product>()
                    .WithMany()
                    .HasForeignKey(e => e.ProductId);
            });

            modelBuilder.Entity<HistoryList>(entity => {
                entity.ToTable("history_list");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.UserId)
                    .HasColumnName("user_id")
                    .HasColumnType("uuid")
                    .IsRequired();

                entity.Property(e => e.ProductId)
                    .HasColumnName("product_id")
                    .HasColumnType("uuid")
                    .IsRequired();

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(50);

                entity.Property(e => e.CreatedAt)
                    .HasColumnName("created_at")
                    .IsRequired()
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasOne<User>()
                    .WithMany()
                    .HasForeignKey(e => e.UserId);

                entity.HasOne<Product>()
                    .WithMany()
                    .HasForeignKey(e => e.ProductId);
            });

            // Image configuration
            modelBuilder.Entity<Image>(entity => {
                entity.ToTable("images");
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.EntityId)
                    .HasColumnName("entity_id")
                    .HasColumnType("uuid")
                    .IsRequired();

                entity.Property(e => e.FileExtension)
                    .HasColumnName("file_extension")
                    .HasMaxLength(10)
                    .IsRequired();
            });
        }
    }
}
