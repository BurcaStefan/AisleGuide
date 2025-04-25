using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public interface IProductFilterStrategy
    {
        IQueryable<Product> ApplyFilter(IQueryable<Product> query);
    }
}
