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

        // GET: PurchaseOrder/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseOrderModel = await _context.PurchaseOrderModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (purchaseOrderModel == null)
            {
                return NotFound();
            }

            return View(purchaseOrderModel);
        }

        // GET: PurchaseOrder/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: PurchaseOrder/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,DateOfDelivery,Status,AmountDue,DateCreated,CreatedBy,Timestamp,UserID,IsActive")] PurchaseOrderModel purchaseOrderModel)
        {
            if (ModelState.IsValid)
            {
                _context.Add(purchaseOrderModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(purchaseOrderModel);
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

        // POST: PurchaseOrder/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,DateOfDelivery,Status,AmountDue,DateCreated,CreatedBy,Timestamp,UserID,IsActive")] PurchaseOrderModel purchaseOrderModel)
        {
            if (id != purchaseOrderModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(purchaseOrderModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PurchaseOrderModelExists(purchaseOrderModel.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(purchaseOrderModel);
        }

        // GET: PurchaseOrder/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseOrderModel = await _context.PurchaseOrderModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (purchaseOrderModel == null)
            {
                return NotFound();
            }

            return View(purchaseOrderModel);
        }

        // POST: PurchaseOrder/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var purchaseOrderModel = await _context.PurchaseOrderModel.FindAsync(id);
            if (purchaseOrderModel != null)
            {
                _context.PurchaseOrderModel.Remove(purchaseOrderModel);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PurchaseOrderModelExists(int id)
        {
            return _context.PurchaseOrderModel.Any(e => e.ID == id);
        }
    }
}
