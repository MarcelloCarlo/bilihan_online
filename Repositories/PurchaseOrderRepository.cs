using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihanonline.Data;
using Microsoft.EntityFrameworkCore;

namespace bilihan_online.Repositories
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly bilihanonlineContext _context;

        public PurchaseOrderRepository(bilihanonlineContext context)
        {
            _context = context;
        }

        public async Task<List<PurchaseOrderModel>> GetAllPurchaseOrders()
        {
            return await _context.PurchaseOrderModel.Include(cust => cust.CustomerID).ToListAsync();
        }

        public async Task<PurchaseOrderModel> GetPurchaseOrderById(int id)
        {
            return await _context.PurchaseOrderModel.FindAsync(id);
        }
    }
}