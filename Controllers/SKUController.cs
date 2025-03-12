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
    public class SKUController : Controller
    {
        private readonly bilihanonlineContext _context;
        private readonly string DEFAULT_USER_ID = "Admin";

        public SKUController(bilihanonlineContext context)
        {
            _context = context;
        }

        // GET: SKU
        public async Task<IActionResult> Index()
        {

            return View(await _context.SKUModel.Select(s => new SKUModel{
                ID = s.ID,
                Name = s.Name,
                Code = s.Code,
                UnitPrice = s.UnitPrice,
                ProductImageString = "data:image/png;base64," + Convert.ToBase64String(s.ProductImage),
                DateCreated = s.DateCreated,
                CreatedBy = s.CreatedBy,
                Timestamp = s.Timestamp,
                UserID = s.UserID,
                IsActive = s.IsActive
            }).ToListAsync());
        }

        // GET: SKU/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sKUModel = await _context.SKUModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (sKUModel == null)
            {
                return NotFound();
            }

            return View(sKUModel);
        }

        // GET: SKU/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: SKU/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Name,Code,UnitPrice,ProductImageHolder,IsActive")] SKUModel sKUModel)
        {
            if (!SKUModelExists(sKUModel))
            {
                using (var memoryStream = new MemoryStream())
                {
                    sKUModel.ProductImageHolder.OpenReadStream().CopyTo(memoryStream);

                    if (memoryStream.Length < 2097152)
                    {
                        sKUModel.ProductImage = memoryStream.ToArray();
                    }
                    else
                    {
                        return View(sKUModel);
                    }

                }
                sKUModel.DateCreated = DateTime.Now;
                sKUModel.CreatedBy = DEFAULT_USER_ID;
                sKUModel.Timestamp = DateTime.Now;
                sKUModel.UserID = DEFAULT_USER_ID;
                _context.Add(sKUModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(sKUModel);
        }

        // GET: SKU/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sKUModel = await _context.SKUModel.FindAsync(id);
            if (sKUModel == null)
            {
                return NotFound();
            }
            return View(sKUModel);
        }

        // POST: SKU/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,Name,Code,UnitPrice,ProductImage,DateCreated,CreatedBy,Timestamp,UserID,IsActive")] SKUModel sKUModel)
        {
            if (id != sKUModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(sKUModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!SKUModelExists(sKUModel.ID))
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
            return View(sKUModel);
        }

        // GET: SKU/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var sKUModel = await _context.SKUModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (sKUModel == null)
            {
                return NotFound();
            }

            return View(sKUModel);
        }

        // POST: SKU/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var sKUModel = await _context.SKUModel.FindAsync(id);
            if (sKUModel != null)
            {
                _context.SKUModel.Remove(sKUModel);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool SKUModelExists(int id)
        {
            return _context.SKUModel.Any(e => e.ID == id);
        }

        private bool SKUModelExists(SKUModel skuModel)
        {
            return _context.SKUModel.Any(e => (e.Code == skuModel.Code || e.Name == skuModel.Name));
        }
    }
}
