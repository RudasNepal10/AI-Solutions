using AISolutions.Application.DTOs;
using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface IAdminService
    {
        Task<DashboardDto> GetDashboardStatsAsync();
        Task<bool> RegisterUserAsync(string username, string password, string role);
    }
}
