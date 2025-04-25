using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public class NameContainsFilterStrategy : IProductFilterStrategy
    {
        private readonly string nameFragment;

        public NameContainsFilterStrategy(string nameFragment)
        {
            this.nameFragment = nameFragment;
        }

        public IQueryable<Product> ApplyFilter(IQueryable<Product> query)
        {
            if (string.IsNullOrEmpty(nameFragment))
                return query;

            return query.Where(p => p.Name.Contains(nameFragment));
        }
    }
}
