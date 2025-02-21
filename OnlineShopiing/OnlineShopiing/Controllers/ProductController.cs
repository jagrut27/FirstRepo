using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineShopiing.Model;

namespace OnlineShopiing.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
    private readonly string connectionString;

    public ProductController(IConfiguration configuration)
    {
      connectionString = configuration.GetConnectionString("DefaultConnection");
    }

    // POST: api/products/add 
    [HttpPost("add")]
    public IActionResult AddProduct([FromBody] Ajio_Products product)
    {
      try
      {
        using (SqlConnection conn = new SqlConnection(connectionString))
        {
          conn.Open();
          SqlCommand cmd = new SqlCommand("AddProduct", conn)
          {
            CommandType = CommandType.StoredProcedure
          };

          cmd.Parameters.AddWithValue("@ProductName", product.productName);
          cmd.Parameters.AddWithValue("@Price", product.price);
          cmd.Parameters.AddWithValue("@Image", product.ImageURL);
  
          cmd.ExecuteNonQuery();
        }
        return Ok("Product added successfully.");
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }
    [HttpGet]
    public IActionResult GetProducts()
    {
      try
      {
        List<Ajio_Products> products = new List<Ajio_Products>();

        using (SqlConnection conn = new SqlConnection(connectionString))
        {
          conn.Open();
          SqlCommand cmd = new SqlCommand("GetProducts", conn)
          {
            CommandType = CommandType.StoredProcedure
          };

          SqlDataReader reader = cmd.ExecuteReader();

          while (reader.Read())
          {
            products.Add(new Ajio_Products
            {
              ProductID = reader.GetInt32(0),
              productName = reader.GetString(1),
              price = reader.GetDecimal(2),
              ImageURL = reader.GetString(3)
            });
          }
        }

        return Ok(products);
      }
      catch (Exception ex)
      {
        return StatusCode(500, $"Internal server error: {ex.Message}");
      }
    }
  }
}
