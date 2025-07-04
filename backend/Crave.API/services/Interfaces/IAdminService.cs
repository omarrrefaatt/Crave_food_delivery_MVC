using Crave.API.DTOS;

namespace Crave.API.Services.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<AdminStatisticsResponse>> GetWebsiteStatistics();

    }
}