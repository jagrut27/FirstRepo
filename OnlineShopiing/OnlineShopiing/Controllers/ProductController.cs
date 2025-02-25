using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnlineShopiing.Model;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

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
          cmd.Parameters.AddWithValue("@productId", product.ProductID);
          cmd.Parameters.AddWithValue("@ProductName", product.productName);
          cmd.Parameters.AddWithValue("@Price", product.price);
          cmd.Parameters.AddWithValue("@Quantity", product.Quantity);  
          cmd.Parameters.AddWithValue("@ImageUrl", product.ImageUrl);
  
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

               /*     //Checking image path trying not grtting images RN 
                    String ImagePath = reader.GetString(3);
                    if(!ImagePath.StartsWith("/images/"))
                    {
                        ImagePath = $"/images/{ImagePath}";
                    }*/


              while (reader.Read())
              {
                products.Add(new Ajio_Products
                {
                  ProductID = reader.GetInt32(0),
                  productName = reader.GetString(1),
                  price = reader.GetDecimal(2),
                  ImageUrl = reader.GetString(3), //trim the extra path 
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
