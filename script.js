function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

function addToCart(item) {
    if (!isLoggedIn()) {
        alert(" Please login first to add items to cart.");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(" Item added to cart!");
}
function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert(" Your cart is empty!");
        return;
    }

    window.location.href = "order.html";
}

function checkout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart || cart.length === 0) {
        alert("🛒 Please add items to your cart before proceeding!");
        return;
    }

    window.location.href = "order.html";
}

function addToCart(name, price) {
    if (!isLoggedIn()) {
        alert("⚠️ Please login first");
        return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
        name: name,
        price: Number(price)
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart!");
}
