using bilihan_online.Models;

namespace bilihan_online.Repositories.Interfaces
{
    public interface IPurchaseItemRepository
    {
        Task<List<PurchaseItemModel>> GetPurchaseItemsByOrderId(int orderId);
        Task<PurchaseItemModel> GetPurchaseItemById(int id);
        Task<SKUModel> GetSKUById(int id);
        Task<CustomerModel> GetCustomerById(int id);
        Task<PurchaseOrderModel> GetPurchaseOrderById(int orderId);
        Task<bool> CreatePurchaseItem(PurchaseItemModel purchaseItem);
        Task<OrderFormModel> CreatePurchaseOrder(OrderFormModel orderFormModel);
        Task<bool> UpdatePurchaseItem(PurchaseItemModel purchaseItem);
        Task<bool> CheckItemExists(int orderId, int skuId);
        Task<decimal> UpdateOrderAmount(int orderId, decimal newAmount);
    }
}
