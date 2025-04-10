using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace bilihan_online.Models;

public class PurchaseItemModel
{

    public int ID { get; set; }
    public PurchaseOrderModel PurchaseOrderID { get; set; }
    public SKUModel SKUID { get; set; }

    // [NotMapped]
    // public int SKU_ID { get; set; }

    [DisplayName("Quantity")]
    public int Quantity { get; set; }

    [DisplayName("Price")]
    public decimal Price { get; set; }

    [DisplayName("Timestamp")]
    public DateTime Timestamp { get; set; }

    [DisplayName("User ID")]
    [DefaultValue("Admin")]
    public string UserID { get; set; }

}