$(document).ready(function() {

    // Fetch product data from the backend
    function loadProducts() {
        $.ajax({
            url: 'https://localhost:7285/api/Product',  // Endpoint to fetch products
            method: 'GET',
            success: function(data) {
                renderProducts(data);
            },
            error: function(error) {
                console.error("Error fetching products:", error);
            }
        });
    }

    // Render products dynamically into the HTML
    function renderProducts(products) {
        // Clear existing products
        $('#product-list').empty();

        products.forEach(function(product) {
            const productHtml = `
                <div class="product">
                    <img src="${product.ImageURL}" >
                    <h3>${product.productName}</h3>
                    <p>Price: ₹${product.price}</p>
                    <button class="add-to-cart-btn" 
                     data-id="${product.ProductId}" 
                     data-name="${product.productName}" 
                      data-price="${product.price}">
                              Add to Cart
                            </button>

                </div>
            `;
            $('#product-list').append(productHtml);
        });
    }
    $(document).on('click', '.add-to-cart-btn', function() {
        const productId = $(this).data('id');
        const productName = $(this).data('name');
        const productPrice = $(this).data('price');  // Use 'data-price' attribute here
    
        // Validate data
        if (!productId || !productName || !productPrice) {
            alert("Missing product data! Please try again.");
            return;  // Exit the function if data is incomplete
        }
    
        // Assuming default quantity of 1
        const quantity = 1;
        const totalAmount = parseFloat(productPrice) * quantity;  // Ensure price is a number
    
        // Validate totalAmount calculation
        if (isNaN(totalAmount) || totalAmount <= 0) {
            alert("Invalid product price!");
            return;
        }
    
        const cartData = {
            CustomerID: 1,  // Static customer ID
            ProductId: productId,
            ProductName: productName,  // Corrected property name
            Quantity: quantity,  // Corrected property name
            Price: productPrice,
            TotalAmount: totalAmount,  // Dynamically calculated total amount
        };
        
    
        console.log("Sending cart data:", cartData);  // Log cart data to verify
    
        $.ajax({
            url: 'https://localhost:7285/api/Cart/add',  // API URL to add to cart
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cartData),
            success: function(response) {
                alert("Product added to cart!");
                window.location.href = '/Cart';  // Redirect after success
            },
            error: function(error) {
                console.error("Error adding product to cart:", error);
            }
        });
    });
    
    

    // Load products on page load
    loadProducts();

});
