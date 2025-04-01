using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihanonline.Data;
using Microsoft.EntityFrameworkCore;

namespace bilihan_online.Repositories
{
    public class PurchaseItemRepository : IPurchaseItemRepository
    {
        private readonly bilihanonlineContext _context;

        public PurchaseItemRepository(bilihanonlineContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseItemModel>> GetPurchaseItemsByOrderId(int orderId)
        {
            return await _context.PurchaseItemModel
                .Include(pi => pi.SKUID)
                .Include(pi => pi.PurchaseOrderID)
                .Where(pi => pi.PurchaseOrderID.ID == orderId)
                .ToListAsync();
        }

        public async Task<PurchaseOrderModel> GetPurchaseOrderById(int orderId)
        {
            return await _context.PurchaseOrderModel.FirstOrDefaultAsync(po => po.ID == orderId);
        }

        public async Task<PurchaseItemModel> GetPurchaseItemById(int id)
        {
            return await _context.PurchaseItemModel
                .Include(sku => sku.SKUID)
                .Include(po => po.PurchaseOrderID)
                .FirstAsync(pi => pi.ID == id);
        }

        public async Task<SKUModel> GetSKUById(int id)
        {
            return await _context.SKUModel
                .FirstAsync(sku => sku.ID == id);
        }

        public async Task<CustomerModel> GetCustomerById(int id)
        {
            return await _context.CustomerModel
                .FirstAsync(c => c.ID == id);
        }

        public async Task<List<CustomerModel>> GetCustomerByNameNumber(string nameNumber)
        {
            return await _context.CustomerModel.Where(c => (c.FullName.Contains(nameNumber) || c.MobileNumber.ToString().Contains(nameNumber)) && c.IsActive).AsQueryable().ToListAsync();
        }

        public async Task<bool> CreatePurchaseItem(PurchaseItemModel purchaseItem)
        {
            _context.PurchaseItemModel.Add(purchaseItem);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<OrderFormModel> CreatePurchaseOrder(OrderFormModel orderFormModel)
        {
            _context.Add(orderFormModel.PurchaseOrderModel);
            await _context.SaveChangesAsync();
            return orderFormModel;
        }

        public async Task<bool> UpdatePurchaseItem(PurchaseItemModel purchaseItem)
        {
            var rowsAffected = await _context.PurchaseItemModel
                .Where(pi => pi.ID == purchaseItem.ID)
                .ExecuteUpdateAsync(u => u
                    .SetProperty(pi => pi.Quantity, purchaseItem.Quantity)
                    .SetProperty(pi => pi.Price, purchaseItem.Price)
                    .SetProperty(pi => pi.Timestamp, purchaseItem.Timestamp)
                    .SetProperty(pi => pi.UserID, purchaseItem.UserID));

            return rowsAffected > 0;
        }

        public async Task<bool> CheckItemExists(int orderId, int skuId)
        {
            return await _context.PurchaseItemModel.AnyAsync(pi =>
                pi.PurchaseOrderID.ID == orderId && pi.SKUID.ID == skuId);
        }

        public async Task<decimal> UpdateOrderAmount(int orderId, decimal newAmount)
        {
            await _context.PurchaseOrderModel
                .Where(po => po.ID == orderId)
                .ExecuteUpdateAsync(u => u
                    .SetProperty(po => po.AmountDue, newAmount)
                    .SetProperty(po => po.Timestamp, DateTime.Now));

            return newAmount;
        }
    }
}
