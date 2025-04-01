using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;
using bilihanonline.Data;
using bilihan_online.Services.Interfaces;

namespace bilihan_online.Controllers
{
    public class PurchaseOrderController : Controller
    {
        private readonly bilihanonlineContext _context;
        private readonly IPurchaseOrderService _purchaseOrderService;

        public PurchaseOrderController(bilihanonlineContext context, IPurchaseOrderService purchaseOrderService)
        {
            _context = context;
            _purchaseOrderService = purchaseOrderService;
        }

        // GET: PurchaseOrder
        public async Task<IActionResult> Index()
        {
            try
            {
                HttpContext.Session.SetInt32("PurchaseOrderID", 0);
                List<PurchaseOrderModel>? purchaseOrderList = new List<PurchaseOrderModel>();
                ResultModel resultModel = await _purchaseOrderService.GetAllPurchaseOrders();
                purchaseOrderList = resultModel.Result as List<PurchaseOrderModel>;
                if (purchaseOrderList == null)
                {
                    return NotFound();
                }
                return View(purchaseOrderList);
            }
            catch (System.Exception ex)
            {

                return BadRequest(ex);
            }

        }

        // GET: PurchaseOrder/Create
        public IActionResult Create()
        {
            return RedirectToAction("Index", "PurchaseItem", new { area = "Create" });
        }

        // GET: PurchaseOrder/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            try
            {
                if (id == null)
                {
                    return NotFound();
                }

                ResultModel resultModel = await _purchaseOrderService.GetPurchaseOrderById(id.Value);
                PurchaseOrderModel? purchaseOrderModel = resultModel.Result as PurchaseOrderModel;

                if (purchaseOrderModel == null)
                {
                    return NotFound();
                }

                HttpContext.Session.SetInt32("PurchaseOrderID", purchaseOrderModel.ID);

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

            return RedirectToAction("Index", "PurchaseItem", new { area = "Edit" });
        }

    }
}
