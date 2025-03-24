using bilihan_online.Models;
using bilihanonline.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace bilihan_online.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly bilihanonlineContext _context;

        public CustomerRepository(bilihanonlineContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomerModel>> GetAllAsync()
        {
            return await _context.CustomerModel.ToListAsync();
        }

        public async Task<CustomerModel> GetByIdAsync(int id)
        {
            return await _context.CustomerModel.FindAsync(id);
        }

        public async Task<bool> CreateAsync(CustomerModel customer)
        {
            _context.Add(customer);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task UpdateAsync(CustomerModel customer)
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
                    .SetProperty(c => c.Timestamp, customer.Timestamp)
                    .SetProperty(c => c.UserID, customer.UserID));

            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsByIdAsync(int id)
        {
            return await _context.CustomerModel.AnyAsync(e => e.ID == id);
        }

        public async Task<bool> ExistsByFullNameOrMobileAsync(string fullName, string mobile)
        {
            return await _context.CustomerModel.AnyAsync(e => e.MobileNumber.ToString() == mobile || e.FullName == fullName);
        }

        public async Task<bool> ExistsByFullNameOrMobileExceptIdAsync(int id, string fullName, string mobile)
        {
            return await _context.CustomerModel.AnyAsync(e => e.ID != id && (e.MobileNumber.ToString() == mobile || e.FullName == fullName));
        }
    }
}
