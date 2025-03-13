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
        private readonly ResultModel _resultModel = new ResultModel();

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
            try
            {
                customerModel.FullName = string.Concat(customerModel.LastName, ", ", customerModel.FirstName);

                if (!CustomerModelExists(customerModel, "Create"))
                {
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
            catch (Exception ex)
            {

                throw ex;
            }

        }

        [HttpPost]
        [RequireHttps]
        [ValidateAntiForgeryToken]
        public async Task<JsonResult> JsonCreate([Bind("FirstName,LastName,MobileNumber,City,IsActive")] CustomerModel customer)
        {
            try
            {
                customer.FullName = string.Concat(customer.LastName, ", ", customer.FirstName);

                if (!CustomerModelExists(customer, "Create"))
                {
                    customer.DateCreated = DateTime.Now;
                    customer.CreatedBy = DEFAULT_USER_ID;
                    customer.Timestamp = DateTime.Now;
                    customer.UserID = DEFAULT_USER_ID;
                    _context.Add(customer);
                    _resultModel.ItemsGenerated =  await _context.SaveChangesAsync();

                    if (_resultModel.ItemsGenerated < 1)
                    {
                        UpdateResultModel(false, false, "Creation Failed.");
                    }
                    else
                    {
                        UpdateResultModel(true, false, "Creation Success.");
                    }
                }
                //return View(customerModel);
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, false, ex);
                throw ex;
            }

            return Json(_resultModel);
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
        public async Task<IActionResult> Edit(int id, [Bind("ID,FirstName,LastName,FullName,MobileNumber,City,IsActive")] CustomerModel customerModel)
        {
            if (id != customerModel.ID)
            {
                return NotFound();
            }

            customerModel.FullName = string.Concat(customerModel.LastName, ", ", customerModel.FirstName);
            if (CustomerModelExists(customerModel, "Edit"))
            {
                try
                {
                    
                    _context.CustomerModel
                        .Where(c => c.ID == customerModel.ID)
                        .ExecuteUpdate(s => s
                            .SetProperty(c => c.FirstName, customerModel.FirstName)
                            .SetProperty(c => c.LastName, customerModel.LastName)
                            .SetProperty(c => c.FullName, customerModel.FullName)
                            .SetProperty(c => c.MobileNumber, customerModel.MobileNumber)
                            .SetProperty(c => c.City, customerModel.City)
                            .SetProperty(c => c.IsActive, customerModel.IsActive)
                            .SetProperty(c => c.Timestamp, DateTime.Now)
                            .SetProperty(c => c.UserID, DEFAULT_USER_ID));
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    if (!CustomerModelExists(customerModel, "Edit"))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw ex;
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

        private bool CustomerModelExists(CustomerModel customerModel, string checkType)
        {
            if (checkType.Equals("Create", StringComparison.OrdinalIgnoreCase))
            {
                return _context.CustomerModel.Any(e => (e.MobileNumber == customerModel.MobileNumber || e.FullName == customerModel.FullName));
            }
            else
            {
                return _context.CustomerModel.Any(e => e.ID == customerModel.ID || e.MobileNumber == customerModel.MobileNumber || e.FullName == customerModel.FullName);
            }
        }

        private CustomerModel GetCustomerModel(int id)
        {

            var customerModel = _context.CustomerModel
        .FirstOrDefault(m => m.ID == id);

            return customerModel;
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
