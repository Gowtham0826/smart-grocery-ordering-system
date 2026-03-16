(function upgradeStockField() {

    const products = JSON.parse(localStorage.getItem("products"));

    if (!products) return;

    Object.keys(products).forEach(category => {
        products[category].forEach(p => {
            if (p.stock === undefined) {
                p.stock = 100; // default stock
            }
        });
    });

    localStorage.setItem("products", JSON.stringify(products));

})();

// ===============================
// SEED DATA (ONLY FIRST TIME)
// ===============================
(function seedProducts() {
    if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify({

            vegetables: [
                { id: "tomato", name: "Tomato", price: 30, img: "tomato.png", unit: "kg", step: 0.25, stock: 100 },
                { id: "potato", name: "Potato", price: 25, img: "potato.png", unit: "kg", step: 0.25, stock: 100 },
                { id: "onion", name: "Onion", price: 28, img: "onion.png", unit: "kg", step: 0.25, stock: 100 },
                { id: "carrot", name: "Carrot", price: 20, img: "carrot.png", unit: "kg", step: 0.25, stock: 100 }
            ],

            fruits: [
                { id: "apple", name: "Apple", price: 120, img: "apple.png", unit: "kg", step: 0.25, stock: 80 },
                { id: "banana", name: "Banana", price: 40, img: "banana.png", unit: "kg", step: 0.25, stock: 80 },
                { id: "orange", name: "Orange", price: 60, img: "orange.png", unit: "kg", step: 0.25, stock: 80 },
                { id: "grapes", name: "Grapes", price: 90, img: "grapes.png", unit: "kg", step: 0.25, stock: 80 }
            ],

            dairy: [
                { id: "milk", name: "Milk", price: 30, img: "milk.png", unit: "litre", step: 0.5, stock: 60 },
                { id: "curd", name: "Curd", price: 40, img: "curd.png", unit: "kg", step: 0.25, stock: 60 },
                { id: "cheese", name: "Cheese", price: 120, img: "cheese.png", unit: "kg", step: 0.25, stock: 50 },
                { id: "butter", name: "Butter", price: 55, img: "butter.png", unit: "kg", step: 0.25, stock: 50 }
            ],

            groceries: [
                { id: "rice", name: "Rice", price: 60, img: "rice.png", unit: "kg", step: 0.5, stock: 200 },
                { id: "dal", name: "Dal", price: 80, img: "dal.png", unit: "kg", step: 0.5, stock: 150 },
                { id: "oil", name: "Oil", price: 140, img: "oil.png", unit: "litre", step: 0.5, stock: 120 },
                { id: "sugar", name: "Sugar", price: 45, img: "sugar.png", unit: "kg", step: 0.5, stock: 180 }
            ],

            snacks: [
                { id: "chips", name: "Chips", price: 20, img: "chips.png", unit: "piece", step: 1, stock: 100 },
                { id: "biscuits", name: "Biscuits", price: 25, img: "biscuits.png", unit: "piece", step: 1, stock: 100 },
                { id: "chocolates", name: "Chocolates", price: 50, img: "chocolates.png", unit: "piece", step: 1, stock: 100 },
                { id: "namkeen", name: "Namkeen", price: 35, img: "namkeen.png", unit: "piece", step: 1, stock: 100 }
            ],
            beverages: [
                { id: "cola", name: "Coca Cola", price: 40, img: "cola.png", unit: "piece", step: 1, stock: 100 },
                { id: "juice", name: "Fruit Juice", price: 60, img: "juice.png", unit: "piece", step: 1, stock: 100 },
                { id: "coffee", name: "Coffee", price: 80, img: "coffee.png", unit: "piece", step: 1, stock: 100 },
                { id: "tea", name: "Tea", price: 50, img: "tea.png", unit: "piece", step: 1, stock: 100 }
            ],

            household: [
                { id: "detergent", name: "Detergent", price: 90, img: "detergent.png", unit: "piece", step: 1, stock: 80 },
                { id: "dishwash", name: "Dish Wash", price: 70, img: "dishwash.png", unit: "piece", step: 1, stock: 80 },
                { id: "cleaner", name: "Floor Cleaner", price: 120, img: "cleaner.png", unit: "piece", step: 1, stock: 80 }
            ],

            personalcare: [
                { id: "soap", name: "Soap", price: 35, img: "soap.png", unit: "piece", step: 1, stock: 100 },
                { id: "shampoo", name: "Shampoo", price: 120, img: "shampoo.png", unit: "piece", step: 1, stock: 100 },
                { id: "toothpaste", name: "Toothpaste", price: 85, img: "toothpaste.png", unit: "piece", step: 1, stock: 100 }
            ]

        }));
    }
})();


// ===============================
// HELPERS
// ===============================
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || {};
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getCart() {
    return JSON.parse(localStorage.getItem("apartment_cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("apartment_cart", JSON.stringify(cart));
}


// ===============================
// URL CATEGORY
// ===============================
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

const title = document.getElementById("categoryTitle");
const grid = document.getElementById("productGrid");


// ===============================
// RENDER PRODUCTS
// ===============================
function renderProducts(list) {
    grid.innerHTML = "";
    const cart = getCart();

    list.forEach(p => {

        const cartItem = cart.find(item => item.id === p.id);
        const qty = cartItem ? cartItem.quantity : 0;

        const col = document.createElement("div");
        col.className = "col-6 col-md-4 col-lg-3";

        col.innerHTML = `
            <div class="card product-card p-3">
                <img src="../static/images/products/${p.img}" class="product-img">
                <h6 class="mt-2">${p.name}</h6>
                <p class="fw-bold">Rs. ${p.price} per ${p.unit}</p>
                <p class="text-muted">Stock: ${p.stock} ${p.unit}</p>

                ${p.stock <= 0 ?
                `<p class="text-danger fw-bold">Out of Stock</p>` :
                `
                <div id="add-${p.id}" class="${cartItem ? "d-none" : ""}">
                    <button class="btn btn-success btn-sm w-100 add-btn"
                        data-id="${p.id}">
                        ADD
                    </button>
                </div>

                <div id="qty-box-${p.id}" class="${cartItem ? "" : "d-none"}">
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-secondary btn-sm dec-btn" data-id="${p.id}">-</button>
                        <span id="qty-${p.id}" class="fw-bold">${qty} ${p.unit}</span>
                        <button class="btn btn-outline-secondary btn-sm inc-btn" data-id="${p.id}">+</button>
                    </div>
                </div>
                `}
            </div>
        `;

        grid.appendChild(col);
    });

    bindEvents();
}


// ===============================
// EVENTS
// ===============================
function bindEvents() {
    document.querySelectorAll(".add-btn").forEach(btn => {
        btn.onclick = () => addFirstTime(btn.dataset.id);
    });

    document.querySelectorAll(".inc-btn").forEach(btn => {
        btn.onclick = () => increaseQty(btn.dataset.id);
    });

    document.querySelectorAll(".dec-btn").forEach(btn => {
        btn.onclick = () => decreaseQty(btn.dataset.id);
    });
}


// ===============================
// CART ACTIONS WITH STOCK CONTROL
// ===============================
function findProductById(id) {
    const products = getProducts();
    return Object.values(products).flat().find(p => p.id === id);
}

function updateProductStock(id, quantityChange) {
    const products = getProducts();

    Object.keys(products).forEach(category => {
        products[category].forEach(p => {
            if (p.id === id) {
                p.stock += quantityChange;
            }
        });
    });

    saveProducts(products);
}

function addFirstTime(id) {

    let cart = getCart();
    const product = findProductById(id);

    if (product.stock < product.step) {
        alert("Not enough stock!");
        return;
    }

    cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity: product.step,
        unit: product.unit,
        step: product.step
    });

    updateProductStock(id, -product.step);
    saveCart(cart);
    renderCurrentCategory();
}

function increaseQty(id) {

    let cart = getCart();
    const item = cart.find(p => p.id === id);
    const product = findProductById(id);

    if (!item) return;

    if (product.stock < item.step) {
        alert("No more stock available!");
        return;
    }

    item.quantity = parseFloat((item.quantity + item.step).toFixed(2));
    updateProductStock(id, -item.step);

    saveCart(cart);
    renderCurrentCategory();
}

function decreaseQty(id) {

    let cart = getCart();
    const index = cart.findIndex(p => p.id === id);
    if (index === -1) return;

    const item = cart[index];

    item.quantity = parseFloat((item.quantity - item.step).toFixed(2));
    updateProductStock(id, item.step);

    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCurrentCategory();
}


// ===============================
// RENDER CURRENT CATEGORY
// ===============================
function renderCurrentCategory() {
    const products = getProducts();

    if (!category || category === "all") {
        renderProducts(Object.values(products).flat());
    } else if (products[category]) {
        renderProducts(products[category]);
    }
}


// ===============================
// PAGE LOAD
// ===============================
const products = getProducts();

if (!category || category === "all") {
    title.innerText = "All Products";
    renderProducts(Object.values(products).flat());
}
else if (products[category]) {
    title.innerText =
        category.charAt(0).toUpperCase() + category.slice(1);
    renderProducts(products[category]);
}
else {
    title.innerText = "Category Not Found";
    grid.innerHTML = "";
}
