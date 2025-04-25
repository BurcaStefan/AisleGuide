using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public class ProductSortStrategy : IProductSortStrategy
    {
        private readonly string? sortCriterion;

        public ProductSortStrategy(string? sortCriterion)
        {
            this.sortCriterion = sortCriterion;
        }

        public IQueryable<Product> ApplySort(IQueryable<Product> query)
        {
            return sortCriterion switch
            {
                "price ascending" => query.OrderBy(p => p.Price),
                "price descending" => query.OrderByDescending(p => p.Price),
                "avg rating ascending" => query.OrderBy(p => p.AverageRating),
                "avg rating descending" => query.OrderByDescending(p => p.AverageRating),
                _ => query
            };
        }
    }
}
