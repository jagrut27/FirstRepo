$(document).ready(function() {

    function loadProducts() {
        $.ajax({
            url: 'https://localhost:7285/api/Product',  
            success: function(data) {
                console.log("API Response:", data); 
                renderProducts(data);
            },
            error: function(error) {
                console.error("Error fetching products:", error);
            }
        });
    }

    function renderProducts(products) {
        $('#product-list').empty();
        
        products.forEach(function(product) {
            console.log("Image URL:", product.imageUrl);
            const productHtml = `
                <div class="product">
                   <img src="https://localhost:7285${product.imageUrl}" alt="Product Image">
                    <h3>${product.productName}</h3>
                    <p>Price: ₹${product.price}</p>
                    <button class="add-to-cart-btn" 
                        data-id="${product.productID}"  
                        data-name="${product.productName}"
                        data-price="${product.price}"
                        data-image="${product.imageUrl}">
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
        const productPrice = $(this).data('price'); 
        const CustomerID=1;
        const imageUrl=$(this).data('image');
       
        const cartItem=[{
            CustomerID:CustomerID,
            productId:productId,
            quantity:1,
            TotalAmount:productPrice,
            productName:productName,
            imageUrl:imageUrl


        }];
    
        console.log("Cart item being sent:", JSON.stringify(cartItem)); //getting msg in console 
    
        $.ajax({
            url: 'https://localhost:7285/api/Cart/add',  
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(cartItem),
            success: function(response) {
                alert("Product added to cart!");
                window.location.href = '';  
            },
            error: function(error) {
                console.error("Error adding product to cart:", error.responseJSON);
            }
        });
    });

    loadProducts();
});
