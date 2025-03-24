using bilihan_online.Models;
using bilihan_online.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace bilihan_online.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        public async Task<IActionResult> Index()
        {
            var result = await _customerService.GetAllAsync();
            return View(result.Result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonCreate(CustomerModel customer)
        {
            var result = await _customerService.CreateAsync(customer);
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonDetails(int? id)
        {
            var result = await _customerService.GetByIdAsync(id);
            return Json(result);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> JsonEdit(CustomerModel customer)
        {
            var result = await _customerService.UpdateAsync(customer);
            return Json(result);
        }
    }
}
