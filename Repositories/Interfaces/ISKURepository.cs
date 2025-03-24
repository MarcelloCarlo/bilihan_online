using bilihan_online.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace bilihan_online.Repositories.Interfaces
{
    public interface ISKURepository
    {
        Task<IEnumerable<SKUModel>> GetAllAsync();
        Task<SKUModel> GetByIdAsync(int id);
        Task<int> CreateAsync(SKUModel model);
        Task UpdateAsync(SKUModel model);
        Task<bool> ExistsAsync(int id);
        Task<bool> ExistsNameOrCodeAsync(string name, string code, int? excludeId = null);
        Task<byte[]> GetProductImageAsync(int id);
    }
}
