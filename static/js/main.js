// ===============================
// CART STATE (OBJECT, NOT ARRAY)
// ===============================
let cart = JSON.parse(localStorage.getItem("apartment_cart")) || {};

// ===============================
// SAVE CART
// ===============================
function saveCart() {
    localStorage.setItem("apartment_cart", JSON.stringify(cart));
}

// ===============================
// CART COUNT
// ===============================
function updateCartCount() {
    const badge = document.getElementById("cart-count");
    if (!badge) return;

    let total = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    badge.innerText = total;
    badge.style.display = total > 0 ? "inline-block" : "none";
}

// ===============================
// ADD FIRST TIME
// ===============================
function addFirstTime(id, name, price, img) {
    cart[id] = { id, name, price, img, qty: 1 };
    saveCart();

    document.getElementById(`add-${id}`).classList.add("d-none");
    document.getElementById(`qty-box-${id}`).classList.remove("d-none");
    document.getElementById(`qty-${id}`).innerText = 1;

    updateCartCount();
}

// ===============================
// INCREASE
// ===============================
function increaseQty(id) {
    cart[id].qty++;
    saveCart();

    document.getElementById(`qty-${id}`).innerText = cart[id].qty;
    updateCartCount();
}

// ===============================
// DECREASE
// ===============================
function decreaseQty(id) {
    cart[id].qty--;

    if (cart[id].qty === 0) {
        delete cart[id];
        document.getElementById(`qty-box-${id}`).classList.add("d-none");
        document.getElementById(`add-${id}`).classList.remove("d-none");
    } else {
        document.getElementById(`qty-${id}`).innerText = cart[id].qty;
    }

    saveCart();
    updateCartCount();
}

// ===============================
// ON LOAD
// ===============================
document.addEventListener("DOMContentLoaded", updateCartCount);
