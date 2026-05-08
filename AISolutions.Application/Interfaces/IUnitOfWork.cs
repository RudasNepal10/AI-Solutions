using System;
using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        Task<int> SaveChangesAsync();
    }
}
