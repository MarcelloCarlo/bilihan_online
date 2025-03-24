using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihan_online.Services.Interfaces;

namespace bilihan_online.Services
{
    public class PurchaseItemService : IPurchaseItemService
    {
        private readonly IPurchaseItemRepository _repository;
        private readonly string DEFAULT_USER_ID = "Admin";

        public PurchaseItemService(IPurchaseItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<ResultModel> GetPurchaseItemsByOrderId(int orderId)
        {
            try
            {
                var items = await _repository.GetPurchaseItemsByOrderId(orderId);
                return new ResultModel { IsSuccess = true, Result = items };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

        public async Task<ResultModel> GetPurchaseItemById(int id)
        {
            try
            {
                var item = await _repository.GetPurchaseItemById(id);
                return new ResultModel { IsSuccess = true, Result = item };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

        public async Task<ResultModel> CreatePurchaseItem(OrderFormModel orderForm)
        {
            try
            {
                if (await _repository.CheckItemExists(orderForm.PurchaseOrderModel.ID,
                    orderForm.PurchaseItemModel.SKUID.ID))
                {
                    return new ResultModel { IsSuccess = false, Result = "Item already exists in the order" };
                }

                orderForm.PurchaseItemModel.Timestamp = DateTime.Now;
                orderForm.PurchaseItemModel.UserID = DEFAULT_USER_ID;

                orderForm.PurchaseItemModel.SKUID = await _repository.GetSKUById(orderForm.PurchaseItemModel.SKUID.ID);

                orderForm.PurchaseItemModel.PurchaseOrderID = await _repository.GetPurchaseOrderById(orderForm.PurchaseOrderModel.ID);

                if (await _repository.CreatePurchaseItem(orderForm.PurchaseItemModel))
                {
                    await _repository.UpdateOrderAmount(orderForm.PurchaseOrderModel.ID,
                        orderForm.PurchaseOrderModel.AmountDue + orderForm.PurchaseItemModel.Price);
                }

                return new ResultModel { IsSuccess = true, Result = orderForm.PurchaseOrderModel };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

        public async Task<ResultModel> CreatePurchaseOrder(OrderFormModel orderFormModel)
        {
            try
            {
                orderFormModel.PurchaseOrderModel.CustomerID = await _repository.GetCustomerById(orderFormModel.PurchaseOrderModel.CustomerID.ID);
                orderFormModel.PurchaseOrderModel.DateCreated = DateTime.Now;
                orderFormModel.PurchaseOrderModel.CreatedBy = DEFAULT_USER_ID;
                orderFormModel.PurchaseOrderModel.Timestamp = DateTime.Now;
                orderFormModel.PurchaseOrderModel.UserID = DEFAULT_USER_ID;
                orderFormModel.PurchaseOrderModel.IsActive = true;

                await _repository.CreatePurchaseOrder(orderFormModel);
                int purchaseOrderID = orderFormModel.PurchaseOrderModel.ID;

                if (purchaseOrderID >= 1)
                {
                    orderFormModel.PurchaseItemModel.Timestamp = DateTime.Now;
                    orderFormModel.PurchaseItemModel.UserID = DEFAULT_USER_ID;
                    orderFormModel.PurchaseItemModel.SKUID = await _repository.GetSKUById(orderFormModel.PurchaseItemModel.SKUID.ID) ?? throw new InvalidOperationException("Product not found");

                    orderFormModel.PurchaseItemModel.PurchaseOrderID = orderFormModel.PurchaseOrderModel;
                    await _repository.CreatePurchaseItem(orderFormModel.PurchaseItemModel);

                    return new ResultModel { IsSuccess = true, Result = orderFormModel.PurchaseOrderModel };
                }
                else
                {
                    return new ResultModel { IsSuccess = false, Result = "Failed to create order" };
                }
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

        public async Task<ResultModel> UpdatePurchaseItem(PurchaseItemModel purchaseItem)
        {
            try
            {
                if (purchaseItem == null || purchaseItem.ID <= 0)
                {
                    return new ResultModel { IsSuccess = false, Result = "Invalid purchase item" };
                }

                purchaseItem.Timestamp = DateTime.Now;
                purchaseItem.UserID = DEFAULT_USER_ID;
                PurchaseItemModel PurchaseOrderID = await _repository.GetPurchaseItemById(purchaseItem.ID);
                purchaseItem.PurchaseOrderID = PurchaseOrderID.PurchaseOrderID;

                var currentPurchaseItem = await _repository.GetPurchaseItemById(purchaseItem.ID);

                // Calculate price difference
                var priceDifference = purchaseItem.Price - currentPurchaseItem.Price;

                if (await _repository.UpdatePurchaseItem(purchaseItem))
                {
                    // Adjust amount due based on price difference
                    var newAmountDue = purchaseItem.PurchaseOrderID.AmountDue + priceDifference;

                    // Ensure amount due never goes below zero
                    newAmountDue = Math.Max(0, newAmountDue);

                    await _repository.UpdateOrderAmount(purchaseItem.PurchaseOrderID.ID, newAmountDue);
                }
                return new ResultModel { IsSuccess = true, Result = "Edit Success." };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }
    }
}
