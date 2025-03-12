using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;
using bilihanonline.Data;
using System.ComponentModel;

namespace bilihan_online.Controllers
{
    public class CustomerController : Controller
    {
        private readonly bilihanonlineContext _context;
        private readonly string DEFAULT_USER_ID = "Admin";

        public CustomerController(bilihanonlineContext context)
        {
            _context = context;
        }

        // GET: Customer
        public async Task<IActionResult> Index()
        {
            return View(await _context.CustomerModel.ToListAsync());
        }

        // GET: Customer/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerModel = await _context.CustomerModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (customerModel == null)
            {
                return NotFound();
            }

            return View(customerModel);
        }

        // GET: Customer/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Customer/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("FirstName,LastName,FullName,MobileNumber,City,IsActive")] CustomerModel customerModel)
        {
            if (ModelState.IsValid && !CustomerModelExists(customerModel.FullName) && !CustomerModelExists(customerModel.MobileNumber))
            {
                customerModel.FullName = string.Concat(customerModel.LastName, ", ", customerModel.FirstName);
                customerModel.DateCreated = DateTime.Now;
                customerModel.CreatedBy = DEFAULT_USER_ID;
                customerModel.Timestamp = DateTime.Now;
                customerModel.UserID = DEFAULT_USER_ID;
                _context.Add(customerModel);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(customerModel);
        }

        // GET: Customer/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerModel = await _context.CustomerModel.FindAsync(id);
            if (customerModel == null)
            {
                return NotFound();
            }
            return View(customerModel);
        }

        // POST: Customer/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,FirstName,LastName,FullName,MobileNumber,City,DateCreated,CreatedBy,Timestamp,UserID,IsActive")] CustomerModel customerModel)
        {
            if (id != customerModel.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(customerModel);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CustomerModelExists(customerModel.ID))
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
            return View(customerModel);
        }

        // GET: Customer/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var customerModel = await _context.CustomerModel
                .FirstOrDefaultAsync(m => m.ID == id);
            if (customerModel == null)
            {
                return NotFound();
            }

            return View(customerModel);
        }

        // POST: Customer/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var customerModel = await _context.CustomerModel.FindAsync(id);
            if (customerModel != null)
            {
                _context.CustomerModel.Remove(customerModel);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CustomerModelExists(int id)
        {
            return _context.CustomerModel.Any(e => e.ID == id);
        }

        private bool CustomerModelExists(string fullName)
        {
            return _context.CustomerModel.Any(e => e.FullName == fullName);
        }

        private bool CustomerModelExists(long mobileNumber)
        {
            return _context.CustomerModel.Any(e => e.MobileNumber == mobileNumber);
        }
    }
}
