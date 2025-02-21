using System;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Mvc; 
using Microsoft.Extensions.Configuration;
using OnlineShopiing.Model;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
  private readonly string connectionString;

  public CartController(IConfiguration configuration)
  {
    connectionString = configuration.GetConnectionString("DefaultConnection");
  }

  [HttpPost("add")]
  public IActionResult AddToCart([FromBody] Cart cartItem)
  {
    try
    {
      int cartId = cartItem.CartId;
      int customerId = cartItem.CustomerID;
      int productId = cartItem.ProductId;
      int quantity = cartItem.Quantity;
    
      decimal totalAmount = cartItem.TotalAmount;

      using (SqlConnection conn = new SqlConnection(connectionString))
      {
        conn.Open();
        SqlCommand cmd = new SqlCommand("AddToCart", conn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@CustomerID", cartItem.CustomerID);
        cmd.Parameters.AddWithValue("@ProductID", cartItem.ProductId);
        cmd.Parameters.AddWithValue("@Quantity", cartItem.Quantity);
         
        cmd.Parameters.AddWithValue("@TotalAmount", cartItem.TotalAmount);  
        cmd.ExecuteNonQuery();
      }

      return Ok("Product added to cart successfully.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }



  [HttpGet("{CustomerID}")]
  public IActionResult GetCartItems(int CustomerID)
  {
    try
    {
      List<Cart> cartItems = new List<Cart>();
      using (SqlConnection conn = new SqlConnection(connectionString))
      {
        conn.Open();
        SqlCommand cmd = new SqlCommand("GetCartItem", conn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@CustomerID", CustomerID);
        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
        DataTable CartTable = new DataTable();
        adapter.Fill(CartTable);
          
        foreach (DataRow row in CartTable.Rows)
        {
          cartItems.Add(new Cart {
            CartId = Convert.ToInt32(row["CartId"]),
            CustomerID = Convert.ToInt32(row["CustomerID"]),
            ProductId = Convert.ToInt32(row["ProductId"]),
            Quantity = Convert.ToInt32(row["Quantity"]),
            TotalAmount = Convert.ToDecimal(row["TotalAmount"]),
          
          });
        }
        if (CartTable.Rows.Count == 0)
        {
          return NotFound();
        }

        return Ok(cartItems);
      }
    }
    catch (Exception ex)
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }

  
  [HttpPut("update")]
  public IActionResult UpdateCartQuantity(int cartId, int quantity)
  {
    try
    {
      using (SqlConnection conn = new SqlConnection(connectionString))
      {
        conn.Open();
        SqlCommand cmd = new SqlCommand("UpdateQuantity", conn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@CartID", cartId);
        cmd.Parameters.AddWithValue("@Quantity", quantity);
        cmd.ExecuteNonQuery();
      }

      return Ok("Cart quantity updated successfully.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }

  [HttpDelete("remove")]
  public IActionResult RemoveItemFromCart(int cartId)
  {
    try
    {
      using (SqlConnection conn = new SqlConnection(connectionString))
      {
        conn.Open();
        SqlCommand cmd = new SqlCommand("RemoveItemFromCart", conn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@CartID", cartId);
        cmd.ExecuteNonQuery();
      }

      return Ok("Item removed from cart successfully.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }

  
  [HttpDelete("empty")]
  public IActionResult EmptyCart(int CustomerID)
  {
    try
    {
      using (SqlConnection conn = new SqlConnection(connectionString))
      {
        conn.Open();
        SqlCommand cmd = new SqlCommand("EmptyCart", conn)
        {
          CommandType = CommandType.StoredProcedure
        };
        cmd.Parameters.AddWithValue("@CustomerID", CustomerID);
        cmd.ExecuteNonQuery();
      }

      return Ok("Cart emptied successfully.");
    }
    catch (Exception ex)
    {
      return StatusCode(500, $"Internal server error: {ex.Message}");
    }
  }
}
