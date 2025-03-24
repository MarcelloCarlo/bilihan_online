using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;
using bilihan_online.Services.Interfaces;
using bilihanonline.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace bilihan_online.Controllers
{
    public class PurchaseItemController : Controller
    {
        private readonly bilihanonlineContext _context;
        private readonly IPurchaseItemService _purchaseItemService;
        private readonly string DEFAULT_USER_ID = "Admin";

        public PurchaseItemController(bilihanonlineContext context, IPurchaseItemService purchaseItemService)
        {
            _context = context;
            _purchaseItemService = purchaseItemService;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                var purchaseOrderID = HttpContext.Session.GetInt32("PurchaseOrderID");
                if (purchaseOrderID == null || purchaseOrderID == 0)
                {
                    return View(new List<PurchaseItemModel>());
                }

                var result = await _purchaseItemService.GetPurchaseItemsByOrderId(purchaseOrderID.Value);
                return View(result.Result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonGetItemDetails(int? id)
        {
            if (id == null || id == 0)
            {
                return NotFound();
            }

            var result = await _purchaseItemService.GetPurchaseItemById(id.Value);
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonCreate(OrderFormModel orderFormModel)
        {
            try
            {
                var result = new ResultModel();

                if (orderFormModel.PurchaseOrderModel.ID == 0)
                {
                    await _purchaseItemService.CreatePurchaseOrder(orderFormModel);

                    HttpContext.Session.SetInt32("PurchaseOrderID", orderFormModel.PurchaseOrderModel.ID);
                    result = new ResultModel { IsSuccess = true, Result = orderFormModel.PurchaseOrderModel };
                }
                else
                {
                    result = await _purchaseItemService.CreatePurchaseItem(orderFormModel);
                    result = new ResultModel { IsSuccess = true, Result = result.Result };
                }

                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new ResultModel { IsSuccess = false, Result = ex.Message });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonEdit(PurchaseItemModel purchaseItemModel)
        {
            if (purchaseItemModel.ID == 0)
            {
                return NotFound();
            }

            var result = await _purchaseItemService.UpdatePurchaseItem(purchaseItemModel);
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonGetCustomer(string? name)
        {
            try
            {
                if (!string.IsNullOrEmpty(name))
                {
                    var customerModel = await _context.CustomerModel.Where(c => (c.FullName.Contains(name) || c.MobileNumber.ToString().Contains(name)) && c.IsActive).AsQueryable().ToListAsync();
                    if (customerModel != null)
                    {
                        return Json(new ResultModel { IsSuccess = true, Result = customerModel });
                    }
                    else
                    {
                        return Json(new ResultModel { IsSuccess = false, Result = "No Customer Found." });
                    }
                }
                else
                {
                    return Json(new ResultModel { IsSuccess = false, Result = "No Customer Found." });
                }

            }
            catch (Exception ex)
            {
                return Json(new ResultModel { IsSuccess = false, Result = ex.Message });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonGetSKU(string? product)
        {
            try
            {
                if (!string.IsNullOrEmpty(product))
                {
                    var skuModel = await _context.SKUModel
                        .Where(c => c.IsActive &&
                            (EF.Functions.Like(c.Name, $"%{product}%") ||
                             EF.Functions.Like(c.Code, $"%{product}%")))
                        .Select(s => new SKUModel
                        {
                            ID = s.ID,
                            Name = s.Name,
                            Code = s.Code,
                            UnitPrice = s.UnitPrice,
                            ProductImageString = "data:image/jpg;base64," + Convert.ToBase64String(s.ProductImage),
                            DateCreated = s.DateCreated,
                            CreatedBy = s.CreatedBy,
                            Timestamp = s.Timestamp,
                            UserID = s.UserID,
                            IsActive = s.IsActive
                        })
                        .Take(5)
                        .ToListAsync();

                    return Json(new ResultModel
                    {
                        IsSuccess = skuModel.Any(),
                        Result = skuModel.Any() ? skuModel : "No Product Found."
                    });
                }

                return Json(new ResultModel { IsSuccess = false, Result = "No Product Found." });
            }
            catch (Exception ex)
            {
                return Json(new ResultModel { IsSuccess = false, Result = ex.Message });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonUpdateOrderStatus(PurchaseOrderModel purchaseOrderModel)
        {
            try
            {
                if (purchaseOrderModel.ID == 0)
                {
                    return NotFound();
                }

                var currentPurchaseOrder = _context.PurchaseOrderModel.First(po => po.ID == purchaseOrderModel.ID);

                _context.PurchaseOrderModel
                    .Where(po => po.ID == currentPurchaseOrder.ID)
                        .ExecuteUpdate(s => s
                            .SetProperty(po => po.Status, purchaseOrderModel.Status)
                            .SetProperty(po => po.Timestamp, DateTime.Now)
                            .SetProperty(po => po.UserID, DEFAULT_USER_ID));

                await _context.SaveChangesAsync();
                return Json(new ResultModel { IsSuccess = true, Result = purchaseOrderModel });

            }
            catch (System.Exception ex)
            {
                return Json(new ResultModel { IsSuccess = false, Result = ex.Message });
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonGetOrderDetails(int? id)
        {
            try
            {
                if (id == null || id == 0)
                {
                    return NotFound();
                }

                var purchaseOrder = await _context.PurchaseOrderModel
                    .Include(po => po.CustomerID)
                    .Where(po => po.ID == id)
                    .ToListAsync();

                return Json(new ResultModel { IsSuccess = true, Result = purchaseOrder });
            }
            catch (Exception ex)
            {
                return Json(new ResultModel { IsSuccess = false, Result = ex.Message });
            }
        }
    }
}
