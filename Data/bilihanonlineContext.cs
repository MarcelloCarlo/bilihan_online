using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using bilihan_online.Models;

namespace bilihanonline.Data
{
    public class bilihanonlineContext : DbContext
    {
        public bilihanonlineContext (DbContextOptions<bilihanonlineContext> options)
            : base(options)
        {
        }

        public DbSet<bilihan_online.Models.CustomerModel> CustomerModel { get; set; } = default!;
        public DbSet<bilihan_online.Models.PurchaseItemModel> PurchaseItemModel { get; set; } = default!;
        public DbSet<bilihan_online.Models.PurchaseOrderModel> PurchaseOrderModel { get; set; } = default!;
        public DbSet<bilihan_online.Models.SKUModel> SKUModel { get; set; } = default!;
    }
}
