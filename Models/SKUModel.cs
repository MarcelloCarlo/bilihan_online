using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NuGet.Protocol;

namespace bilihan_online.Models;

public class SKUModel
{

    public int ID { get; set; }

    [DisplayName("Name")]
    public string Name { get; set; }

    [DisplayName("Code")]
    public string Code { get; set; }

    [DisplayName("Unit Price")]
    public decimal UnitPrice { get; set; }

    public byte[] ProductImage { get; set; }

    [NotMapped]
    public IFormFile ProductImageHolder { get; set; }

    [DisplayName("Image")]
    [NotMapped]
    public string ProductImageString { get; set; }

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