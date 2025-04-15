class ProductManager {
    constructor() {
        this.products = new Map();
        this.productNames = new Map();
        this.orders = new Map();
        this.productHistory = new WeakMap();
    }

    addProduct(name, price, stock) {
        const id = `prod_${Date.now()}`;
        const product = { id, name, price, stock };

        this.products.set(id, product);
        this.updateNameIndex(name, id);
        this.recordHistory(product, 'Додано новий продукт');
        return id;
    }

    removeProduct(id) {
        const product = this.products.get(id);
        if (!product) return false;

        this.products.delete(id);
        this.updateNameIndex(product.name, id, true);
        return true;
    }

    updateProduct(id, newPrice, newStock) {
        const product = this.products.get(id);
        if (!product) return false;

        const changes = [];
        if (newPrice !== undefined) {
            changes.push(`Ціна змінена з ${product.price} на ${newPrice}`);
            product.price = newPrice;
        }
        if (newStock !== undefined) {
            changes.push(`Кількість змінена з ${product.stock} на ${newStock}`);
            product.stock = newStock;
        }

        if (changes.length > 0) {
            this.recordHistory(product, changes.join('\n'));
        }
        return true;
    }

    searchByName(name) {
        const ids = this.productNames.get(name.toLowerCase()) || new Set();
        return Array.from(ids).map(id => this.products.get(id));
    }

    placeOrder(productId, quantity) {
        const product = this.products.get(productId);
        if (!product) return null;
        if (product.stock < quantity) return null;

        product.stock -= quantity;
        const orderId = `order_${Date.now()}`;
        this.orders.set(orderId, {
            productId,
            quantity,
            date: new Date().toLocaleString(),
            productName: product.name
        });
        this.recordHistory(product, `Продано ${quantity} од. Залишок: ${product.stock}`);
        return orderId;
    }

    getOrderHistory() {
        return Array.from(this.orders.entries());
    }

    updateNameIndex(name, id, remove = false) {
        const key = name.toLowerCase();
        if (!this.productNames.has(key)) {
            this.productNames.set(key, new Set());
        }
        const ids = this.productNames.get(key);
        remove ? ids.delete(id) : ids.add(id);
    }

    recordHistory(product, message) {
        const history = this.productHistory.get(product) || [];
        history.push({
            date: new Date().toLocaleString(),
            message
        });
        this.productHistory.set(product, history);
    }
}


const shop = new ProductManager();

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);

    if (name && price > 0 && stock >= 0) {
        const id = shop.addProduct(name, price, stock);
        updateUI();
    }
}

function searchProduct() {
    const name = document.getElementById('searchInput').value;
    const results = shop.searchByName(name);
    displayResults(results);
}

function updateProduct() {
    const id = document.getElementById('updateId').value;
    const price = parseFloat(document.getElementById('updatePrice').value);
    const stock = parseInt(document.getElementById('updateStock').value);

    if (shop.updateProduct(id, price, stock)) {
        updateUI();
    }
}
function deleteProduct() {
    const id = document.getElementById('deleteProductId').value;
    if (!id) {
        alert("Будь ласка, введіть ID продукту");
        return;
    }

    const success = shop.removeProduct(id);
    if (success) {
        alert("Продукт успішно видалено!");
        updateUI();
    } else {
        alert("Продукт з таким ID не знайдено");
    }
}

function placeOrder() {
    const productId = document.getElementById('orderProductId').value.trim();
    const quantityInput = document.getElementById('orderQuantity').value.trim();
    const quantity = parseInt(quantityInput, 10);

    if (!productId) {
        alert("Будь ласка, введіть ID продукту");
        return;
    }
    if (isNaN(quantity)) {
        alert("Будь ласка, введіть коректну кількість");
        return;
    }
    if (quantity <= 0) {
        alert("Кількість має бути більше 0");
        return;
    }

    const product = shop.products.get(productId);
    if (!product) {
        alert("Продукт з таким ID не знайдено");
        return;
    }
    if (product.stock < quantity) {
        alert(`Недостатньо товару на складі. Доступно: ${product.stock}`);
        return;
    }

    const orderId = shop.placeOrder(productId, quantity);
    if (orderId) {
        alert(`Замовлення #${orderId} успішно оформлено!`);
        updateUI();
    } else {
        alert("Сталася невідома помилка при оформленні замовлення");
    }
}

function displayResults(products) {
    const container = document.getElementById('searchResults');
    container.innerHTML = products.map(p => `
        <div class="product-item">
            <h3>${p.name} (ID: ${p.id})</h3>
            <p>Ціна: ${p.price} грн</p>
            <p>На складі: ${p.stock} шт</p>
        </div>
    `).join('');
}

function updateUI() {
    const productContainer = document.getElementById('productList');
    productContainer.innerHTML = Array.from(shop.products.values()).map(p => `
        <div class="product-item">
            <h3>${p.name}</h3>
            <p>ID: ${p.id}</p>
            <p>Ціна: ${p.price} грн</p>
            <p>Залишок: ${p.stock} шт</p>
        </div>
    `).join('');

    const orderContainer = document.getElementById('orderHistory');
    orderContainer.innerHTML = shop.getOrderHistory().map(([id, order]) => `
        <div class="order-item">
            <h4>Замовлення #${id}</h4>
            <p>Продукт: ${order.productName} (ID: ${order.productId})</p>
            <p>Кількість: ${order.quantity}</p>
            <p>Дата: ${order.date}</p>
        </div>
    `).join('') || '<p>Історія замовлень порожня</p>';
}

updateUI();