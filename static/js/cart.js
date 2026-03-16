// ===============================
// GET CART
// ===============================
function getCart() {
    return JSON.parse(localStorage.getItem("apartment_cart")) || [];
}

// ===============================
// SAVE CART
// ===============================
function saveCart(cart) {
    localStorage.setItem("apartment_cart", JSON.stringify(cart));
}

// ===============================
// GET ORDERS
// ===============================
function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

// ===============================
// SAVE ORDERS
// ===============================
function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// ===============================
// RENDER CART
// ===============================
function renderCart() {

    const cartContainer = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if (!cartContainer || !totalEl) return;

    const cart = getCart();
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="alert alert-info text-center">
                Your cart is empty.
            </div>
        `;
        totalEl.innerText = "0";
        return;
    }

    let total = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement("div");
        div.className = "card mb-3 p-3 shadow-sm";

        div.innerHTML = `
            <div class="row align-items-center">

                <div class="col-md-2 col-3">
                    <img src="../static/images/products/${item.img}"
                         class="img-fluid rounded"
                         style="height:60px;object-fit:contain;">
                </div>

                <div class="col-md-3 col-9">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <small class="text-muted">
                        ₹${item.price} per ${item.unit}
                    </small>
                </div>

                <div class="col-md-3 col-6 mt-2 mt-md-0">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary btn-sm"
                            onclick="changeQty('${item.id}', -1)">
                            −
                        </button>

                        <span class="fw-bold mx-3">
                            ${item.quantity} ${item.unit}
                        </span>

                        <button class="btn btn-outline-secondary btn-sm"
                            onclick="changeQty('${item.id}', 1)">
                            +
                        </button>
                    </div>
                </div>

                <div class="col-md-2 col-3 fw-bold text-md-center mt-2 mt-md-0">
                    ₹${itemTotal.toFixed(2)}
                </div>

                <div class="col-md-2 col-3 text-end mt-2 mt-md-0">
                    <button class="btn btn-danger btn-sm"
                        onclick="removeItem('${item.id}')">
                        Remove
                    </button>
                </div>

            </div>
        `;

        cartContainer.appendChild(div);
    });

    totalEl.innerText = total.toFixed(2);
}

// ===============================
// CHANGE QUANTITY
// ===============================
function changeQty(id, direction) {

    let cart = getCart();
    const index = cart.findIndex(item => item.id === id);
    if (index === -1) return;

    const item = cart[index];

    item.quantity = parseFloat(
        (item.quantity + (item.step * direction)).toFixed(2)
    );

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

// ===============================
// REMOVE ITEM
// ===============================
function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCart();
}

// ===============================
// PLACE ORDER (UPDATED)
// ===============================
function placeOrder() {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const orders = getOrders();

    const newOrder = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        total: parseFloat(total.toFixed(2)),
        items: cart,
        status: "Pending"
    };

    orders.push(newOrder);
    saveOrders(orders);

    // Clear cart
    localStorage.removeItem("apartment_cart");

    alert("Order Placed Successfully!");

    window.location.href = "success.html";
}

// ===============================
// PAGE LOAD
// ===============================
document.addEventListener("DOMContentLoaded", renderCart);
