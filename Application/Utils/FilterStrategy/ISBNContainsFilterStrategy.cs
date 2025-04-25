using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public class ISBNContainsFilterStrategy : IProductFilterStrategy
    {
        private readonly string isbnFragment;

        public ISBNContainsFilterStrategy(string isbnFragment)
        {
            this.isbnFragment = isbnFragment;
        }

        public IQueryable<Product> ApplyFilter(IQueryable<Product> query)
        {
            if (string.IsNullOrEmpty(isbnFragment))
                return query;

            return query.Where(p => p.ISBN.Contains(isbnFragment));
        }
    }
}
