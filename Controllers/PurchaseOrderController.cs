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
    public class PurchaseOrderController : Controller
    {
        private readonly bilihanonlineContext _context;

        public PurchaseOrderController(bilihanonlineContext context)
        {
            _context = context;
        }

        // GET: PurchaseOrder
        public async Task<IActionResult> Index()
        {
            return View(await _context.PurchaseOrderModel.ToListAsync());
        }

        // GET: PurchaseOrder/Create
        public IActionResult Create()
        {
            return RedirectToAction("Index", "PurchaseItem", new { area = "Create" });
            //return View();
        }

        // GET: PurchaseOrder/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseOrderModel = await _context.PurchaseOrderModel.FindAsync(id);
            if (purchaseOrderModel == null)
            {
                return NotFound();
            }
            return View(purchaseOrderModel);
        }

    }
}
