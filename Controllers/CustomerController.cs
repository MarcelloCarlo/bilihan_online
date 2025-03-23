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

        // POST: Customer/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonCreate(CustomerModel customer)
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
                    _resultModel.ItemsGenerated = await _context.SaveChangesAsync();

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
                UpdateResultModel(false, true, ex);
            }

            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonDetails(int? id)
        {
            try
            {
                if (id != null)
                {
                    var customerModel = await _context.CustomerModel.FindAsync(id);
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
                    UpdateResultModel(false, false, "Not A Valid ID.");
                }

            }
            catch (Exception ex)
            {
                UpdateResultModel(false, true, ex);
            }

            return Json(_resultModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonEdit(CustomerModel customer)
        {
            try
            {
                customer.FullName = string.Concat(customer.LastName, ", ", customer.FirstName);

                if (CustomerModelExists(customer, "Edit"))
                {
                    if (!CustomerModelExists(customer, "Duplicate"))
                    {
                        _context.CustomerModel
                             .Where(c => c.ID == customer.ID)
                             .ExecuteUpdate(s => s
                                 .SetProperty(c => c.FirstName, customer.FirstName)
                                 .SetProperty(c => c.LastName, customer.LastName)
                                 .SetProperty(c => c.FullName, customer.FullName)
                                 .SetProperty(c => c.MobileNumber, customer.MobileNumber)
                                 .SetProperty(c => c.City, customer.City)
                                 .SetProperty(c => c.IsActive, customer.IsActive)
                                 .SetProperty(c => c.Timestamp, DateTime.Now)
                                 .SetProperty(c => c.UserID, DEFAULT_USER_ID));

                        await _context.SaveChangesAsync();

                        UpdateResultModel(true, false, "Edit Success.");

                    }
                    else
                    {
                        UpdateResultModel(false, false, "Full Name/Mobile Number Already Exists on Other Records.");
                    }

                }
                else
                {
                    UpdateResultModel(false, false, "Customer Doesn't Exist");
                }
                //return View(customerModel);
            }
            catch (Exception ex)
            {
                UpdateResultModel(false, true, ex);
            }

            return Json(_resultModel);
        }

        private bool CustomerModelExists(CustomerModel customerModel, string checkType)
        {
            if (checkType.Equals("Create", StringComparison.OrdinalIgnoreCase))
            {
                return _context.CustomerModel.Any(e => e.MobileNumber == customerModel.MobileNumber || e.FullName == customerModel.FullName);
            }
            else if (checkType.Equals("Edit", StringComparison.OrdinalIgnoreCase))
            {
                return _context.CustomerModel.Any(e => e.ID == customerModel.ID);

                //ID should exists but its FullName and MobileNumber should not be exists on other records
            }
            else
            {
                return _context.CustomerModel.Any(e => e.ID != customerModel.ID && (e.MobileNumber == customerModel.MobileNumber || e.FullName == customerModel.FullName));
            }
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
