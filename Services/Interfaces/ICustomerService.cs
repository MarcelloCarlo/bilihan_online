using bilihan_online.Models;
using System.Threading.Tasks;

namespace bilihan_online.Services
{
    public interface ICustomerService
    {
        Task<ResultModel> GetAllAsync();
        Task<ResultModel> GetByIdAsync(int? id);
        Task<ResultModel> CreateAsync(CustomerModel customer);
        Task<ResultModel> UpdateAsync(CustomerModel customer);
    }
}
