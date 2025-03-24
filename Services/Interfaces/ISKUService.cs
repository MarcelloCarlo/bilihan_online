using bilihan_online.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace bilihan_online.Services.Interfaces
{
    public interface ISKUService
    {
        Task<IEnumerable<SKUModel>> GetAllSKUsAsync();
        Task<SKUModel> GetSKUByIdAsync(int id);
        Task<ResultModel> CreateSKUAsync(SKUModel model);
        Task<ResultModel> UpdateSKUAsync(SKUModel model);
        Task<bool> ValidateProductImage(Stream imageStream);
    }
}
