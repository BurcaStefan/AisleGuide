using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public class CategoryExactFilterStrategy : IProductFilterStrategy
    {
        private readonly string category;

        public CategoryExactFilterStrategy(string category)
        {
            this.category = category;
        }

        public IQueryable<Product> ApplyFilter(IQueryable<Product> query)
        {
            if (string.IsNullOrEmpty(category))
                return query;

            return query.Where(p => p.Category == category);
        }
    }
}
