using System.Runtime.InteropServices;

namespace OnlineShopiing.Model
{
  public class Cart
  {

    public int CartID { get; set; }
    public int CustomerID { get; set; }

    public int ProductID { get; set; }
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }

    public string productName { get; set; }

     public string ImageUrl { get; set; }


 
  }
}
