using bilihan_online.Models;

namespace bilihan_online.Services.Interfaces
{
    public interface IPurchaseOrderService
    {
        Task<ResultModel> GetAllPurchaseOrders();
        Task<ResultModel> GetPurchaseOrderById(int id);
    }
}
