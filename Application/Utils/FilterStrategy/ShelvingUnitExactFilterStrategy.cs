using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public class ShelvingUnitExactFilterStrategy : IProductFilterStrategy
    {
        private readonly string shelvingUnit;

        public ShelvingUnitExactFilterStrategy(string shelvingUnit)
        {
            this.shelvingUnit = shelvingUnit;
        }

        public IQueryable<Product> ApplyFilter(IQueryable<Product> query)
        {
            if (string.IsNullOrEmpty(shelvingUnit))
                return query;

            return query.Where(p => p.ShelvingUnit == shelvingUnit);
        }
    }
}
