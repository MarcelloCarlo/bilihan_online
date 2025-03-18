using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;
using bilihanonline.Data;

namespace bilihan_online.Controllers
{
    public class PurchaseItemController : Controller
    {
        private readonly bilihanonlineContext _context;
        private readonly string DEFAULT_USER_ID = "Admin";
        private readonly ResultModel _resultModel = new ResultModel();

        public PurchaseItemController(bilihanonlineContext context)
        {
            _context = context;
        }

        // GET: PurchaseItem
        public async Task<IActionResult> Index()
        {
            return View(await _context.PurchaseItemModel.ToListAsync());
        }

        // GET: PurchaseItem/Create
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonCreate(PurchaseOrderModel purchaseOrderModel, PurchaseItemModel purchaseItemModel)
        {
            try
            {
                if (purchaseOrderModel.ID == 0)
                {
                    purchaseOrderModel.DateCreated = DateTime.Now;
                    purchaseOrderModel.CreatedBy = DEFAULT_USER_ID;
                    purchaseOrderModel.Timestamp = DateTime.Now;
                    purchaseOrderModel.UserID = DEFAULT_USER_ID;

                    _context.Add(purchaseOrderModel);
                    await _context.SaveChangesAsync();

                    int purchaseOrderID = purchaseOrderModel.ID;

                    if (purchaseOrderID >= 1)
                    {
                        purchaseItemModel.Timestamp = DateTime.Now;
                        purchaseItemModel.UserID = DEFAULT_USER_ID;

                        purchaseItemModel.PurchaseOrderID = purchaseOrderModel;
                        _context.Add(purchaseItemModel);
                        await _context.SaveChangesAsync();

                        _resultModel.Result = purchaseOrderModel;
                    }
                    else
                    {
                        UpdateResultModel(false, false, "Order saving failed");
                    }
                }
                else
                {
                    var purchaseItemCheck = _context.PurchaseItemModel.SingleOrDefaultAsync(pi => pi.PurchaseOrderID == purchaseOrderModel && pi.SKUID == purchaseItemModel.SKUID);

                    if (purchaseItemCheck == null)
                    {
                        purchaseItemModel.PurchaseOrderID = purchaseOrderModel;
                        _context.Add(purchaseItemModel);
                        _context.PurchaseOrderModel
                            .Where(po => po.ID == purchaseItemModel.ID)
                                .ExecuteUpdate(s => s
                                    .SetProperty(po => po.AmountDue, purchaseOrderModel.AmountDue)
                                    .SetProperty(po => po.Timestamp, DateTime.Now)
                                    .SetProperty(po => po.UserID, DEFAULT_USER_ID));

                        await _context.SaveChangesAsync();

                        _resultModel.Result = purchaseOrderModel;
                    }
                    else
                    {
                        UpdateResultModel(false, false, "Item already exists on the order");
                    }

                }
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
            }

            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonEdit(PurchaseItemModel purchaseItemModel)
        {
            try
            {
                _context.PurchaseItemModel
                .Where(pi => pi.ID == purchaseItemModel.ID)
                    .ExecuteUpdate(u => u
                        .SetProperty(pi => pi.Quantity, purchaseItemModel.Quantity)
                        .SetProperty(pi => pi.Price, purchaseItemModel.Price)
                        .SetProperty(pi => pi.Timestamp, DateTime.Now)
                        .SetProperty(pi => pi.UserID, DEFAULT_USER_ID)
                        );

                var orderToBeComputed = _context.PurchaseOrderModel.Find(purchaseItemModel.PurchaseOrderID);

                if (orderToBeComputed != null)
                {
                    orderToBeComputed.AmountDue += purchaseItemModel.Price;
                    _context.PurchaseOrderModel.Update(orderToBeComputed);
                }

                await _context.SaveChangesAsync();

                _resultModel.Result = purchaseItemModel;

                UpdateResultModel(true, false, "Edit Success.");
            }
            catch (System.Exception ex)
            {
                UpdateResultModel(false, false, ex);
            }
            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonGetCustomer(string? name)
        {
            try
            {
                if (!string.IsNullOrEmpty(name))
                {
                    var customerModel = await _context.CustomerModel.Where(c => c.FullName.Contains(name)).AsQueryable().ToListAsync();
                    if (customerModel != null)
                    {
                        UpdateResultModel(true, false, customerModel);
                    }
                    else
                    {
                        UpdateResultModel(false, false, "No Customer Found.");
                    }
                }
                else
                {
                    UpdateResultModel(false, false, "No Customer Found.");
                }

            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
            }

            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonGetSKU(string? product)
        {
            try
            {
                if (!string.IsNullOrEmpty(product))
                {
                    var skuModel = await _context.SKUModel
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
                        .Where(c => (c.Name.Contains(product) || c.Code.Contains(product)) && c.IsActive).AsQueryable().ToListAsync();
                    if (skuModel != null)
                    {
                        UpdateResultModel(true, false, skuModel);
                    }
                    else
                    {
                        UpdateResultModel(false, false, "No Product Found.");
                    }
                }
                else
                {
                    UpdateResultModel(false, false, "No Product Found.");
                }
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
            }
            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonUpdateOrderStatus(PurchaseOrderModel purchaseOrderModel)
        {
            try
            {

                _context.PurchaseOrderModel
                    .Where(po => po.ID == purchaseOrderModel.ID)
                        .ExecuteUpdate(s => s
                            .SetProperty(po => po.Status, purchaseOrderModel.Status)
                            .SetProperty(po => po.Timestamp, DateTime.Now)
                            .SetProperty(po => po.UserID, DEFAULT_USER_ID));

                await _context.SaveChangesAsync();
                _resultModel.Result = purchaseOrderModel;
                UpdateResultModel(true, false, "Updated");

            }
            catch (System.Exception ex)
            {
                UpdateResultModel(true, false, ex);
            }

            return Json(_resultModel);
        }

        public ResultModel UpdateResultModel(bool isSuccess, bool isListResult, object resultObject)
        {
            _resultModel.IsSuccess = isSuccess;
            _resultModel.IsListResult = isListResult;
            _resultModel.Result = resultObject;

            return _resultModel;
        }
    }
}
