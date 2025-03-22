using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;
using bilihanonline.Data;
using Microsoft.CodeAnalysis.CSharp.Syntax;

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
            try
            {
                if (HttpContext.Session.GetInt32("PurchaseOrderID") == 0)
                {
                    return View(await _context.PurchaseItemModel.Where(pi => pi.PurchaseOrderID.ID == 0).ToListAsync());
                }
                else
                {
                    var purchaseOrderID = HttpContext.Session.GetInt32("PurchaseOrderID");
                    if (purchaseOrderID == null)
                    {
                        return NotFound();
                    }

                    var purchaseOrderModel = await _context.PurchaseOrderModel.FindAsync(purchaseOrderID);
                    if (purchaseOrderModel == null)
                    {
                        return NotFound();
                    }

                    var purchaseItemList = await _context.PurchaseItemModel
                        .Include(pi => pi.SKUID)
                        .Where(pi => pi.PurchaseOrderID == purchaseOrderModel)
                        .ToListAsync();
                    return View(purchaseItemList);
                }
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
            try
            {
                if (id == null || id == 0)
                {
                    return NotFound();
                }
                PurchaseItemModel purchaseItemModel = await _context.PurchaseItemModel.Include(sku => sku.SKUID).FirstAsync(pi => pi.ID == id) ?? throw new Exception("Order item not found");
                UpdateResultModel(true, false, purchaseItemModel);
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
            }

            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonCreate(OrderFormModel orderFormModel)
        {
            try
            {
                if (orderFormModel.PurchaseOrderModel.ID == 0)
                {
                    orderFormModel.PurchaseOrderModel.CustomerID = _context.CustomerModel.Find(orderFormModel.PurchaseOrderModel.CustomerID.ID) ?? throw new InvalidOperationException("Customer not found");
                    orderFormModel.PurchaseOrderModel.DateCreated = DateTime.Now;
                    orderFormModel.PurchaseOrderModel.CreatedBy = DEFAULT_USER_ID;
                    orderFormModel.PurchaseOrderModel.Timestamp = DateTime.Now;
                    orderFormModel.PurchaseOrderModel.UserID = DEFAULT_USER_ID;
                    orderFormModel.PurchaseOrderModel.IsActive = true;

                    _context.Add(orderFormModel.PurchaseOrderModel);
                    await _context.SaveChangesAsync();

                    int purchaseOrderID = orderFormModel.PurchaseOrderModel.ID;

                    if (purchaseOrderID >= 1)
                    {
                        orderFormModel.PurchaseItemModel.Timestamp = DateTime.Now;
                        orderFormModel.PurchaseItemModel.UserID = DEFAULT_USER_ID;
                        orderFormModel.PurchaseItemModel.SKUID = _context.SKUModel.Find(orderFormModel.PurchaseItemModel.SKUID.ID) ?? throw new InvalidOperationException("Product not found");

                        orderFormModel.PurchaseItemModel.PurchaseOrderID = orderFormModel.PurchaseOrderModel;
                        _context.Add(orderFormModel.PurchaseItemModel);
                        await _context.SaveChangesAsync();

                        UpdateResultModel(true, false, orderFormModel.PurchaseOrderModel);
                    }
                    else
                    {
                        UpdateResultModel(false, false, "Order saving failed");
                    }

                    HttpContext.Session.SetInt32("PurchaseOrderID", purchaseOrderID);
                }
                else
                {
                    bool purchaseItemCheck = _context.PurchaseItemModel.Any(pi => pi.PurchaseOrderID.ID == orderFormModel.PurchaseOrderModel.ID && pi.SKUID.ID == orderFormModel.PurchaseItemModel.SKUID.ID);

                    if (!purchaseItemCheck)
                    {
                        orderFormModel.PurchaseItemModel.PurchaseOrderID = _context.PurchaseOrderModel.FirstOrDefault(po => po.ID == orderFormModel.PurchaseOrderModel.ID) ?? throw new Exception("Order not found");
                        orderFormModel.PurchaseItemModel.SKUID = _context.SKUModel.FirstOrDefault(sku => sku.ID == orderFormModel.PurchaseItemModel.SKUID.ID) ?? throw new Exception("Product not found");
                        orderFormModel.PurchaseItemModel.Timestamp = DateTime.Now;
                        orderFormModel.PurchaseItemModel.UserID = DEFAULT_USER_ID;
                        _context.PurchaseItemModel.Add(orderFormModel.PurchaseItemModel);
                        _context.PurchaseOrderModel
                            .Where(po => po.ID == orderFormModel.PurchaseOrderModel.ID)
                                .ExecuteUpdate(s => s
                                    .SetProperty(po => po.AmountDue, orderFormModel.PurchaseOrderModel.AmountDue + orderFormModel.PurchaseItemModel.Price)
                                    .SetProperty(po => po.Timestamp, DateTime.Now)
                                    .SetProperty(po => po.UserID, DEFAULT_USER_ID));

                        await _context.SaveChangesAsync();

                        UpdateResultModel(true, false, orderFormModel.PurchaseOrderModel);
                    }
                    else
                    {
                        UpdateResultModel(false, false, "Item already exists in the order");
                    }

                    HttpContext.Session.SetInt32("PurchaseOrderID", orderFormModel.PurchaseOrderModel.ID);

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
        public async Task<IActionResult> JsonEdit(PurchaseItemModel purchaseItemModel)
        {
            try
            {
                if (purchaseItemModel.ID == 0)
                {
                    return NotFound();
                }

                var currentPurchaseItem = _context.PurchaseItemModel.Include(sku => sku.SKUID).Include(po => po.PurchaseOrderID).First(pi => pi.ID == purchaseItemModel.ID);

                _context.PurchaseItemModel
                .Where(pi => pi.ID == currentPurchaseItem.ID)
                    .ExecuteUpdate(u => u
                        .SetProperty(pi => pi.Quantity, purchaseItemModel.Quantity)
                        .SetProperty(pi => pi.Price, purchaseItemModel.Price)
                        .SetProperty(pi => pi.Timestamp, DateTime.Now)
                        .SetProperty(pi => pi.UserID, DEFAULT_USER_ID)
                        );

                decimal newAmountDue = (currentPurchaseItem.PurchaseOrderID.AmountDue - currentPurchaseItem.Price) + purchaseItemModel.Price;
                currentPurchaseItem.PurchaseOrderID.AmountDue = newAmountDue;

                _context.PurchaseOrderModel
                    .Where(po => po.ID == currentPurchaseItem.PurchaseOrderID.ID)
                .ExecuteUpdate(u => u
                    .SetProperty(pi => pi.AmountDue, newAmountDue)
                    .SetProperty(pi => pi.Timestamp, DateTime.Now)
                    .SetProperty(pi => pi.UserID, DEFAULT_USER_ID));


                await _context.SaveChangesAsync();

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
        public async Task<IActionResult> JsonGetCustomer(string? name)
        {
            try
            {
                if (!string.IsNullOrEmpty(name))
                {
                    var customerModel = await _context.CustomerModel.Where(c => (c.FullName.Contains(name) || c.MobileNumber.ToString().Contains(name)) && c.IsActive).AsQueryable().ToListAsync();
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
        public async Task<IActionResult> JsonGetSKU(string? product)
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
                UpdateResultModel(true, false, purchaseOrderModel);

            }
            catch (System.Exception ex)
            {
                UpdateResultModel(true, false, ex);
            }

            return Json(_resultModel);
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

                UpdateResultModel(true, false, purchaseOrder);
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
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
