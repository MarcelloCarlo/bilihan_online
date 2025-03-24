using bilihan_online.Models;
using bilihan_online.Repositories;
using System;
using System.Threading.Tasks;

namespace bilihan_online.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;
        private const string DEFAULT_USER_ID = "Admin";

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<ResultModel> GetAllAsync()
        {
            try
            {
                var customers = await _customerRepository.GetAllAsync();
                return new ResultModel { IsSuccess = true, IsListResult = true, Result = customers };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, IsListResult = false, Result = ex };
            }
        }

        public async Task<ResultModel> GetByIdAsync(int? id)
        {
            try
            {
                if (id == null)
                    return new ResultModel { IsSuccess = false, Result = "Not A Valid ID." };

                var customer = await _customerRepository.GetByIdAsync(id.Value);
                if (customer == null)
                    return new ResultModel { IsSuccess = false, Result = "No Customer Found." };

                return new ResultModel { IsSuccess = true, Result = customer };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex };
            }
        }

        public async Task<ResultModel> CreateAsync(CustomerModel customer)
        {
            try
            {
                customer.FullName = $"{customer.LastName}, {customer.FirstName}";

                if (await _customerRepository.ExistsByFullNameOrMobileAsync(customer.FullName, customer.MobileNumber.ToString()))
                    return new ResultModel { IsSuccess = false, Result = "Full Name/Mobile Number Already Exists." };

                customer.DateCreated = DateTime.Now;
                customer.CreatedBy = DEFAULT_USER_ID;
                customer.Timestamp = DateTime.Now;
                customer.UserID = DEFAULT_USER_ID;

                bool created = await _customerRepository.CreateAsync(customer);
                return new ResultModel
                {
                    IsSuccess = created,
                    Result = created ? "Creation Success." : "Creation Failed.",
                    ItemsGenerated = created ? 1 : 0
                };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex };
            }
        }

        public async Task<ResultModel> UpdateAsync(CustomerModel customer)
        {
            try
            {
                customer.FullName = $"{customer.LastName}, {customer.FirstName}";

                if (!await _customerRepository.ExistsByIdAsync(customer.ID))
                    return new ResultModel { IsSuccess = false, Result = "Customer Doesn't Exist" };

                if (await _customerRepository.ExistsByFullNameOrMobileExceptIdAsync(customer.ID, customer.FullName, customer.MobileNumber.ToString()))
                    return new ResultModel { IsSuccess = false, Result = "Full Name/Mobile Number Already Exists on Other Records." };

                customer.Timestamp = DateTime.Now;
                await _customerRepository.UpdateAsync(customer);
                return new ResultModel { IsSuccess = true, Result = "Edit Success." };
            }
            catch (Exception ex)
            {
                return new ResultModel { IsSuccess = false, Result = ex };
            }
        }
    }
}
