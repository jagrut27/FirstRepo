$(document).ready(function () {
    // Assuming CustomerID is available, replace this with dynamic logic to fetch the actual ID
    const customerID = 1;  // You can change this or get dynamically from local storage or session

    // Fetch cart items from the backend
    function loadCartItems() {
        $.ajax({
            url: `https://localhost:7285/api/Cart/${customerID}`,  // Correctly insert CustomerID
            method: 'GET',
            success: function (data) {
                renderCartItems(data);  // Render the fetched cart items
            },
            error: function (error) {
                console.error("Error fetching cart items:", error);
            }
        });
    }

    // Render cart items dynamically in the HTML
    function renderCartItems(cartItems) {
        let totalAmount = 0;
        $(".cart-items").empty();  // Clear the cart items section

        if (cartItems.length === 0) {
            $(".cart-items").html('<p>Your cart is empty!</p>');  // Display message if the cart is empty
        }

        cartItems.forEach(function (item) {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;

            const cartItemHtml = `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.productName}">
                    <div class="product-info">
                        <h3>${item.productName}</h3>
                        <p>Price: ₹${item.price}</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <p>Total: ₹<span class="item-total">${itemTotal.toFixed(2)}</span></p>
                </div>
            `;
            $(".cart-items").append(cartItemHtml);  // Append each cart item to the cart
        });

        $("#totalAmount").text(totalAmount.toFixed(2));  // Display the total amount in the cart
    }

    // Empty the cart (via DELETE request)
    $("#Empty-Cart").click(function () {
        $.ajax({
            url: 'https://localhost:7285/api/Cart/empty',  // Update with your empty cart endpoint
            method: 'DELETE',
            success: function (response) {
                alert("Your cart has been emptied.");
                loadCartItems();  // Reload the cart after emptying it
            },
            error: function (error) {
                console.error("Error emptying cart:", error);
            }
        });
    });

    // Load cart items when the page loads
    loadCartItems();

    // Checkout button action
    $("#checkoutButton").click(function () {
        // You can implement checkout process here, like navigating to a checkout page or calling a checkout API
        alert("Proceeding to checkout...");
    });
});
