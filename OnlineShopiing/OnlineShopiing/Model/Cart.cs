using System.Runtime.InteropServices;

namespace OnlineShopiing.Model
{
  public class Cart
  {

    public int CartId { get; set; }
    public int CustomerID { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal TotalAmount { get; set; }
 
  }
}
