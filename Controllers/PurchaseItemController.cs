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

        // GET: PurchaseItem/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseItemModel = await _context.PurchaseItemModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (purchaseItemModel == null)
            {
                return NotFound();
            }

            return View(purchaseItemModel);
        }

        // GET: PurchaseItem/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: PurchaseItem/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,Quantity,Price,Timestamp,UserID")] PurchaseItemModel purchaseItemModel)
        {
            if (ModelState.IsValid)
            {
                _context.Add(purchaseItemModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(purchaseItemModel);
        }

        // GET: PurchaseItem/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseItemModel = await _context.PurchaseItemModel.FindAsync(id);
            if (purchaseItemModel == null)
            {
                return NotFound();
            }
            return View(purchaseItemModel);
        }

        // POST: PurchaseItem/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Quantity,Price,Timestamp,UserID")] PurchaseItemModel purchaseItemModel)
        {
            if (id != purchaseItemModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(purchaseItemModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PurchaseItemModelExists(purchaseItemModel.ID))
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
            return View(purchaseItemModel);
        }

        // GET: PurchaseItem/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var purchaseItemModel = await _context.PurchaseItemModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (purchaseItemModel == null)
            {
                return NotFound();
            }

            return View(purchaseItemModel);
        }

        // POST: PurchaseItem/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var purchaseItemModel = await _context.PurchaseItemModel.FindAsync(id);
            if (purchaseItemModel != null)
            {
                _context.PurchaseItemModel.Remove(purchaseItemModel);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
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
                throw ex;
            }

            return Json(_resultModel);
        }

        private bool PurchaseItemModelExists(int id)
        {
            return _context.PurchaseItemModel.Any(e => e.ID == id);
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
