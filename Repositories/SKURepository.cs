using bilihan_online.Models;
using bilihan_online.Repositories.Interfaces;
using bilihanonline.Data;
using Microsoft.EntityFrameworkCore;

namespace bilihan_online.Repositories
{
    public class SKURepository : ISKURepository
    {
        private readonly bilihanonlineContext _context;

        public SKURepository(bilihanonlineContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SKUModel>> GetAllAsync()
        {
            return await _context.SKUModel
                .Select(s => new SKUModel
                {
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
                }).ToListAsync();
        }

        public async Task<SKUModel> GetByIdAsync(int id)
        {
            return await _context.SKUModel
                .Select(s => new SKUModel
                {
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
                })
                .FirstOrDefaultAsync(s => s.ID == id);
        }

        public async Task<int> CreateAsync(SKUModel model)
        {
            _context.Add(model);
            return await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SKUModel model)
        {
            await _context.SKUModel
                .Where(sk => sk.ID == model.ID)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(sk => sk.Name, model.Name)
                    .SetProperty(sk => sk.Code, model.Code)
                    .SetProperty(sk => sk.UnitPrice, model.UnitPrice)
                    .SetProperty(sk => sk.ProductImage, model.ProductImage)
                    .SetProperty(sk => sk.IsActive, model.IsActive)
                    .SetProperty(sk => sk.Timestamp, DateTime.Now)
                    .SetProperty(sk => sk.UserID, model.UserID));
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SKUModel.AnyAsync(e => e.ID == id);
        }

        public async Task<bool> ExistsNameOrCodeAsync(string name, string code, int? excludeId = null)
        {
            return await _context.SKUModel
                .Where(e => excludeId == null || e.ID != excludeId)
                .AnyAsync(e => e.Code == code || e.Name == name);
        }

        public async Task<byte[]> GetProductImageAsync(int id)
        {
            return await _context.SKUModel
                .Where(s => s.ID == id)
                .Select(s => s.ProductImage)
                .FirstOrDefaultAsync();
        }
    }
}
