using bilihan_online.Models;
using bilihan_online.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace bilihan_online.Controllers
{
    public class SKUController : Controller
    {
        private readonly ISKUService _skuService;
        private readonly ResultModel _resultModel = new ResultModel();

        public SKUController(ISKUService skuService)
        {
            _skuService = skuService;
        }

        public async Task<IActionResult> Index()
        {
            return View(await _skuService.GetAllSKUsAsync());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonDetails(int? id)
        {
            try
            {
                if (id == null)
                {
                    return Json(UpdateResultModel(false, false, "Not A Valid ID."));
                }

                var skuModel = await _skuService.GetSKUByIdAsync(id.Value);
                if (skuModel != null)
                {
                    return Json(UpdateResultModel(true, false, skuModel));
                }

                return Json(UpdateResultModel(false, false, "No SKU Found."));
            }
            catch (Exception ex)
            {
                return Json(UpdateResultModel(false, true, ex));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonCreate(SKUModel skuModel)
        {
            try
            {
                var result = await _skuService.CreateSKUAsync(skuModel);
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(UpdateResultModel(false, true, ex));
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonEdit(SKUModel skuModel)
        {
            try
            {
                var result = await _skuService.UpdateSKUAsync(skuModel);
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(UpdateResultModel(false, true, ex));
            }
        }

        private ResultModel UpdateResultModel(bool isSuccess, bool isListResult, object resultObject)
        {
            _resultModel.IsSuccess = isSuccess;
            _resultModel.IsListResult = isListResult;
            _resultModel.Result = resultObject;

            return _resultModel;
        }
    }
}
