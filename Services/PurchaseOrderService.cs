using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihan_online.Services.Interfaces;

namespace bilihan_online.Services
{
    public class PurchaseOrderService : IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _repository;
        private readonly string DEFAULT_USER_ID = "Admin";

        public PurchaseOrderService(IPurchaseOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<ResultModel> GetAllPurchaseOrders()
        {
            try
            {
                var items = await _repository.GetAllPurchaseOrders();
                return new ResultModel { IsSuccess = true, Result = items };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

        public async Task<ResultModel> GetPurchaseOrderById(int id)
        {
            try
            {
                var item = await _repository.GetPurchaseOrderById(id);
                return new ResultModel { IsSuccess = true, Result = item };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex.Message };
            }
        }

    }
}
