using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace bilihan_online.Models;

public class CustomerModel
{

    public int ID { get; set; }

    [DisplayName("First Name")]
    public string FirstName { get; set; }

    [DisplayName("Last Name")]
    public string LastName { get; set; }

    [DisplayName("Full Name")]
    public string FullName { get; set; }

    [DisplayName("Mobile Number")]
    [RegularExpression(@"^\d{1,10}$", ErrorMessage = "Mobile Number Should Be 10 Digits (Remove the +63 or 0)")] 
    public long MobileNumber { get; set; }

    [DisplayName("City")]
    public string City { get; set; }

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