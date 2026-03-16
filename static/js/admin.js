// ================= DATA =================
function getProducts() {
    return JSON.parse(localStorage.getItem("products")) || {};
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function getOrders() {
    return JSON.parse(localStorage.getItem("orders")) || [];
}

function saveOrders(orders) {
    localStorage.setItem("orders", JSON.stringify(orders));
}

// ================= DASHBOARD =================
function loadDashboard() {

    const orders = getOrders();
    const products = getProducts();

    const today = new Date().toISOString().split("T")[0];

    let earningsToday = 0;
    let ordersToday = 0;
    let pendingOrders = 0;

    orders.forEach(order => {
        if (order.status === "Pending") pendingOrders++;
        if (order.date === today && order.status === "Delivered") {
            earningsToday += order.total;
            ordersToday++;
        }
    });

    const totalProducts = Object.values(products).flat().length;

    document.getElementById("totalProducts").innerText = totalProducts;
    document.getElementById("ordersToday").innerText = ordersToday;
    document.getElementById("earningsToday").innerText = earningsToday.toFixed(2);
    document.getElementById("pendingOrders").innerText = pendingOrders;
}

// ================= ADD PRODUCT =================
function addProduct() {

    const name = document.getElementById("pName").value.trim();
    const price = parseFloat(document.getElementById("pPrice").value);
    const stock = parseFloat(document.getElementById("pStock").value);
    const category = document.getElementById("pCategory").value;
    const imageFile = document.getElementById("pImage").files[0];

    if (!name || !price || !stock || !imageFile) {
        alert("Fill all fields including image");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

        const imageBase64 = e.target.result;

        const products = getProducts();

        const newProduct = {
            id: name.toLowerCase().replace(/\s/g, "") + Date.now(),
            name,
            price,
            stock,
            unit: "piece",
            step: 1,
            img: imageBase64
        };

        if (!products[category]) {
            products[category] = [];
        }

        products[category].push(newProduct);

        saveProducts(products);

        document.getElementById("pName").value = "";
        document.getElementById("pPrice").value = "";
        document.getElementById("pStock").value = "";
        document.getElementById("pImage").value = "";

        renderProducts();
        loadDashboard();
    };

    reader.readAsDataURL(imageFile);
}


// ================= RENDER PRODUCTS =================
function renderProducts() {

    const products = getProducts();
    const container = document.getElementById("productList");
    container.innerHTML = "";

    Object.keys(products).forEach(category => {

        products[category].forEach(product => {

            const div = document.createElement("div");
            div.className = "product-row";

            div.innerHTML = `
                <strong>${product.name}</strong> 
                (₹${product.price}) 
                | Stock: ${product.stock ?? 0}
                <button class="btn btn-sm btn-danger float-end"
                    onclick="deleteProduct('${product.id}')">
                    Delete
                </button>
            `;

            container.appendChild(div);
        });
    });
}

// ================= DELETE PRODUCT =================
function deleteProduct(id) {

    const products = getProducts();

    Object.keys(products).forEach(category => {
        products[category] = products[category].filter(p => p.id !== id);
    });

    saveProducts(products);
    renderProducts();
    loadDashboard();
}

// ================= RENDER ORDERS =================
function renderOrders() {

    const orders = getOrders();
    const container = document.getElementById("ordersList");
    container.innerHTML = "";

    orders.slice().reverse().forEach(order => {

        const div = document.createElement("div");
        div.className = "product-row";

        div.innerHTML = `
            <strong>Order ID:</strong> ${order.id}
            | Date: ${order.date}
            | ₹${order.total}
            | Status: ${order.status}
            ${order.status === "Pending"
                ? `<button class="btn btn-sm btn-success float-end"
                        onclick="markDelivered(${order.id})">
                        Deliver
                   </button>`
                : ""}
        `;

        container.appendChild(div);
    });
}

// ================= MARK DELIVERED =================
function markDelivered(id) {

    let orders = getOrders();

    orders = orders.map(order => {
        if (order.id === id) order.status = "Delivered";
        return order;
    });

    saveOrders(orders);

    loadDashboard();
    renderOrders();
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", function() {
    loadDashboard();
    renderProducts();
    renderOrders();
});
