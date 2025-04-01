using bilihan_online.Models;

namespace bilihan_online.Repositories.Interfaces
{
    public interface IPurchaseOrderRepository
    {
        Task<List<PurchaseOrderModel>> GetAllPurchaseOrders();
        Task<PurchaseOrderModel> GetPurchaseOrderById(int id);
    }
}
