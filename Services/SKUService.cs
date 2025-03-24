using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihan_online.Services.Interfaces;

namespace bilihan_online.Services
{
    public class SKUService : ISKUService
    {
        private readonly ISKURepository _skuRepository;
        private readonly string DEFAULT_USER_ID = "Admin";
        private const int MAX_IMAGE_SIZE = 2097152; // 2MB in bytes

        public SKUService(ISKURepository skuRepository)
        {
            _skuRepository = skuRepository;
        }

        public async Task<IEnumerable<SKUModel>> GetAllSKUsAsync()
        {
            return await _skuRepository.GetAllAsync();
        }

        public async Task<SKUModel> GetSKUByIdAsync(int id)
        {
            return await _skuRepository.GetByIdAsync(id);
        }

        public async Task<ResultModel> CreateSKUAsync(SKUModel model)
        {
            var result = new ResultModel();

            if (await _skuRepository.ExistsNameOrCodeAsync(model.Name, model.Code))
            {
                return new ResultModel { IsSuccess = false, Result = "Product Name/SKU already exists." };
            }

            if (model.ProductImageHolder != null)
            {
                using var memoryStream = new MemoryStream();
                await model.ProductImageHolder.OpenReadStream().CopyToAsync(memoryStream);

                if (!await ValidateProductImage(memoryStream))
                {
                    return new ResultModel { IsSuccess = false, Result = "File is more than 2MB." };
                }

                model.ProductImage = memoryStream.ToArray();
            }

            model.DateCreated = DateTime.Now;
            model.CreatedBy = DEFAULT_USER_ID;
            model.Timestamp = DateTime.Now;
            model.UserID = DEFAULT_USER_ID;

            var itemsGenerated = await _skuRepository.CreateAsync(model);
            return new ResultModel
            {
                IsSuccess = itemsGenerated > 0,
                Result = itemsGenerated > 0 ? "Creation success." : "Creation failed.",
                ItemsGenerated = itemsGenerated
            };
        }

        public async Task<ResultModel> UpdateSKUAsync(SKUModel model)
        {
            if (!await _skuRepository.ExistsAsync(model.ID))
            {
                return new ResultModel { IsSuccess = false, Result = "SKU doesn't exist" };
            }

            if (await _skuRepository.ExistsNameOrCodeAsync(model.Name, model.Code, model.ID))
            {
                return new ResultModel { IsSuccess = false, Result = "Product Name/SKU Already Exists on Other Records." };
            }

            if (model.ProductImageHolder != null)
            {
                using var memoryStream = new MemoryStream();
                await model.ProductImageHolder.OpenReadStream().CopyToAsync(memoryStream);

                if (!await ValidateProductImage(memoryStream))
                {
                    return new ResultModel { IsSuccess = false, Result = "File is more than 2MB." };
                }

                model.ProductImage = memoryStream.ToArray();
            }
            else
            {
                model.ProductImage = await _skuRepository.GetProductImageAsync(model.ID);
            }

            await _skuRepository.UpdateAsync(model);
            return new ResultModel { IsSuccess = true, Result = "Edit Success." };
        }

        public async Task<bool> ValidateProductImage(Stream imageStream)
        {
            return imageStream.Length < MAX_IMAGE_SIZE;
        }
    }
}
