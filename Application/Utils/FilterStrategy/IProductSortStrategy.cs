using Domain.Entities;

namespace Application.Utils.FilterStrategy
{
    public interface IProductSortStrategy
    {
        IQueryable<Product> ApplySort(IQueryable<Product> query);
    }
}
