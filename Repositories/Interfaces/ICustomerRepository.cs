using bilihan_online.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace bilihan_online.Repositories
{
    public interface ICustomerRepository
    {
        Task<IEnumerable<CustomerModel>> GetAllAsync();
        Task<CustomerModel> GetByIdAsync(int id);
        Task<bool> CreateAsync(CustomerModel customer);
        Task UpdateAsync(CustomerModel customer);
        Task<bool> ExistsByIdAsync(int id);
        Task<bool> ExistsByFullNameOrMobileAsync(string fullName, string mobile);
        Task<bool> ExistsByFullNameOrMobileExceptIdAsync(int id, string fullName, string mobile);
    }
}
