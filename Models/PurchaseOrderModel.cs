using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace bilihan_online.Models;

public class PurchaseOrderModel
{

    public int ID { get; set; }
    public CustomerModel CustomerID { get; set; }

    [DisplayName("Deliver Date")]
    public DateTime DateOfDelivery { get; set; }

    [DisplayName("Status")]
    public string Status { get; set; }

    [DisplayName("Amount Due")]
    public decimal AmountDue { get; set; }    
    
    [DisplayName("Date Created")]
    public DateTime DateCreated { get; set; }

    [DisplayName("Created By")]
    [DefaultValue("Admin")]
    public string CreatedBy { get; set; }

    [DisplayName("Timestamp")]
    public DateTime Timestamp { get; set; }

    [DisplayName("User ID")]
    [DefaultValue("Admin")]
    public string UserID { get; set; }

    [DisplayName("Is Active?")]
    public Boolean IsActive { get; set; }
    
}