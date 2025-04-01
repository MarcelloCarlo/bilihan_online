using bilihan_online.Models;

namespace bilihan_online.Services.Interfaces
{
    public interface IPurchaseItemService
    {
        Task<ResultModel> GetPurchaseItemsByOrderId(int orderId);
        Task<ResultModel> GetPurchaseItemById(int id);
        Task<ResultModel> GetCustomerByNameNumber(string? nameNumber);
        Task<ResultModel> CreatePurchaseItem(OrderFormModel orderForm);
        Task<ResultModel> CreatePurchaseOrder(OrderFormModel orderFormModel);
        Task<ResultModel> UpdatePurchaseItem(PurchaseItemModel purchaseItem);
    }
}
