$(document).ready(function () {
    const customerID = 1;  

    function loadCartItems() {
        $.ajax({
            url: `https://localhost:7285/api/Cart/${customerID}`,  
            method: 'GET',
            success: function (data) {
                console.log("Cart API Response:", data);
                renderCartItems(data);  
            },
            error: function (error) {
                console.error("Error fetching cart products:", error);
            }
        });
    }

    function renderCartItems(cartProducts) {
        let totalAmount = 0;
        $(".cart-items").empty(); 
        if (!cartProducts || cartProducts.length === 0) {
            $(".cart-items").html('<p>Your cart is empty!</p>');  
            $("#totalAmount").text("0.00");
            return;
        }

        cartProducts.forEach(function (product) {  
            const price = product.totalAmount / product.quantity;  
            const productTotal = product.totalAmount;
            totalAmount += productTotal; 

            const cartProductHtml = `
                <div class="cart-item" data-cartid="${product.cartId}">
                    <img src="https://localhost:7285${product.imageUrl}" alt="Product Image"> 
                    <div class="product-info">
                        <h3>${product.productName}</h3> 
                        <p>Price: ₹${price.toFixed(2)}</p>
                        <div class="quantity-controls">
                            <button class="decrease-qty">−</button>
                            <span class="quantity">${product.quantity}</span>
                            <button class="increase-qty">+</button>
                        </div>
                    </div>
                    <p>Total: ₹<span class="item-total">${productTotal.toFixed(2)}</span></p>
                    <button class ="remove-btn" data-cart-id="${product.cartId}">Remove</button>
                    </div>
            `;

            $(".cart-items").append(cartProductHtml); 
        });

        $("#totalAmount").text(totalAmount.toFixed(2));  
    }

    
    $(document).on("click", ".increase-qty", function () {
        let cartItem = $(this).closest(".cart-item");
        let cartId = cartItem.data("cartid");
        let currentQty = parseInt(cartItem.find(".quantity").text());
        updateCartQuantity(cartId, currentQty + 1);
    });

    
    $(document).on("click", ".decrease-qty", function () {
        let cartItem = $(this).closest(".cart-item");
        let cartId = cartItem.data("cartid");
        let currentQty = parseInt(cartItem.find(".quantity").text());
        if (currentQty > 1) {
            updateCartQuantity(cartId, currentQty - 1);
        } else {
            alert("Quantity cannot be less than 1.");
        }
    });

    function updateCartQuantity(cartId, newQuantity) {
        $.ajax({
            url: `https://localhost:7285/api/Cart/update?cartId=${cartId}&quantity=${newQuantity}`,
            method: 'PUT',
            success: function (response) {
                loadCartItems(); // Reload cart after updating quantity
            },
            error: function (error) {
                console.error("Error updating cart quantity:", error);
            }
        });
    }

    $(document).on("click", ".remove-btn", function () {
        const cartId = $(this).data("cart-id"); 
    
        $.ajax({
            url: `  https://localhost:7285/api/Cart/remove?cartId=${cartId}`,
            method: "DELETE",
            success: function (response) {  
                alert("Item removed from cart.");
                $(`button[data-cart-id="${cartId}"]`).closest(".cart-item").remove();
                if ($(".cart-item").length === 0) {
                    $(".cart-items").html('<p>Your cart is empty!</p>');
                    $("#totalAmount").text("0.00"); 
                }
                loadCartItems();  
            },
            error: function (error) {
                console.error("Error removing cart item:", error);
            }
        });
    });
    

    $("#emptyCartButton").click(function () {
        if ($(".cart-items").children().length === 0) {
            alert("Your cart is already empty. Nothing to remove.");
            return;
        }

        $.ajax({
            url: `https://localhost:7285/api/Cart/empty?CustomerID=${customerID}`,  
            method: 'DELETE',
            success: function (response) {
                alert("Your cart has been emptied.");
                $(".cart-items").empty().html('<p>Your cart is empty!</p>');
                $("#totalAmount").text("0.00"); 
            },
            error: function (error) {
                console.error("Error emptying cart:", error);
            }
        });
    });

    loadCartItems();
});
