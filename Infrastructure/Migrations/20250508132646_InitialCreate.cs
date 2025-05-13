using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:uuid-ossp", ",,");

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    price = table.Column<decimal>(type: "numeric", nullable: false),
                    description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    isbn = table.Column<string>(type: "character varying(13)", maxLength: 13, nullable: false),
                    shelving_unit = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    average_rating = table.Column<float>(type: "real", nullable: true, defaultValue: 0f),
                    calories = table.Column<int>(type: "integer", nullable: false),
                    protein = table.Column<float>(type: "real", nullable: false),
                    carbohydrates = table.Column<float>(type: "real", nullable: false),
                    sugars = table.Column<float>(type: "real", nullable: false),
                    fat = table.Column<float>(type: "real", nullable: false),
                    saturated_fat = table.Column<float>(type: "real", nullable: false),
                    fiber = table.Column<float>(type: "real", nullable: false),
                    salt = table.Column<float>(type: "real", nullable: false),
                    cholesterol = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    first_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    last_name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "text", nullable: false),
                    password = table.Column<string>(type: "text", nullable: false),
                    is_admin = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "favorites",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_favorites", x => new { x.user_id, x.product_id });
                    table.ForeignKey(
                        name: "FK_favorites_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_favorites_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "history_list",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_history_list", x => new { x.id, x.user_id, x.product_id });
                    table.ForeignKey(
                        name: "FK_history_list_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_history_list_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "images",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    entity_id = table.Column<Guid>(type: "uuid", nullable: false),
                    entity_type = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    file_extension = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_images", x => x.id);
                    table.ForeignKey(
                        name: "FK_Image_Product",
                        column: x => x.entity_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Image_User",
                        column: x => x.entity_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "reviews",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "uuid_generate_v4()"),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    product_id = table.Column<Guid>(type: "uuid", nullable: false),
                    content = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    star_rating = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_reviews", x => x.id);
                    table.ForeignKey(
                        name: "FK_reviews_products_product_id",
                        column: x => x.product_id,
                        principalTable: "products",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_reviews_users_user_id",
                        column: x => x.user_id,
                        principalTable: "users",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_favorites_product_id",
                table: "favorites",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_history_list_product_id",
                table: "history_list",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_history_list_user_id",
                table: "history_list",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_images_entity_id",
                table: "images",
                column: "entity_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_product_id",
                table: "reviews",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "IX_reviews_user_id",
                table: "reviews",
                column: "user_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "favorites");

            migrationBuilder.DropTable(
                name: "history_list");

            migrationBuilder.DropTable(
                name: "images");

            migrationBuilder.DropTable(
                name: "reviews");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
