let products = [];
let filterCategory = "all";
let sortType = "";

document.addEventListener("DOMContentLoaded", () => {
    const elements = {
        list: document.getElementById("list"),
        form: document.getElementById("form"),
        modal: document.getElementById("modal"),
        toast: document.getElementById("toast"),
        total: document.getElementById("total"),
        empty: document.getElementById("empty"),
    };

    // Оголошення функцій перед їх використанням
    const toggleModal = (show) => elements.modal.classList.toggle("hidden", !show);

    const openModal = (product = null) => {
        toggleModal(true);
        elements.form.reset();
        document.getElementById("id").value = product?.id || "";
        document.getElementById("name").value = product?.name || "";
        document.getElementById("price").value = product?.price || "";
        document.getElementById("category").value = product?.category || "";
        document.getElementById("image").value = product?.image || "";
        document.getElementById("form-title").textContent = product ? "Редагування товару" : "Новий товар";
    };

    const showToast = (text) => {
        elements.toast.textContent = text;
        elements.toast.classList.remove("hidden");
        setTimeout(() => elements.toast.classList.add("hidden"), 3000);
    };

    const createCard = ({ id, name, price, category, image }) => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Назва:</strong> ${name}</p>
            <p><strong>Ціна:</strong> ${price} грн</p>
            <p><strong>Категорія:</strong> ${category}</p>
            <img src="${image}" alt="${name}">
            <button data-edit="${id}">Редагувати</button>
            <button data-delete="${id}">Видалити</button>
        `;
        return div;
    };

    const render = () => {
        elements.list.innerHTML = "";

        const filtered = filterCategory === "all"
            ? products
            : products.filter(p => p.category === filterCategory);

        const sorted = [...filtered].sort((a, b) => {
            if (sortType === "price") return a.price - b.price;
            if (sortType === "created") return a.created - b.created;
            if (sortType === "updated") return a.updated - b.updated;
            return 0;
        });

        if (sorted.length === 0) {
            elements.empty.style.display = "block";
        } else {
            elements.empty.style.display = "none";
            sorted.forEach(p => elements.list.append(createCard(p)));
        }

        const total = sorted.reduce((sum, p) => sum + Number(p.price), 0);
        elements.total.textContent = `Загальна вартість: ${total} грн`;

        // Додаємо обробники подій для нових кнопок
        document.querySelectorAll("[data-edit]").forEach(btn => {
            btn.addEventListener("click", () => editProduct(btn.dataset.edit));
        });

        document.querySelectorAll("[data-delete]").forEach(btn => {
            btn.addEventListener("click", () => deleteProduct(btn.dataset.delete));
        });
    };

    const saveProduct = (e) => {
        e.preventDefault();
        const id = document.getElementById("id").value || Date.now().toString();
        const name = document.getElementById("name").value.trim();
        const price = +document.getElementById("price").value;
        const category = document.getElementById("category").value;
        const image = document.getElementById("image").value;

        const index = products.findIndex(p => p.id === id);
        const now = Date.now();

        if (index >= 0) {
            products[index] = { ...products[index], name, price, category, image, updated: now };
            showToast(`Оновлено: ${id} - ${name}`);
        } else {
            products.push({ id, name, price, category, image, created: now, updated: now });
            showToast("Товар додано");
        }

        toggleModal(false);
        render();
    };

    const deleteProduct = (id) => {
        products = products.filter(p => p.id !== id);
        render();
        showToast("Товар видалено");
    };

    const editProduct = (id) => {
        const product = products.find(p => p.id === id);
        openModal(product);
    };

    // Налаштування обробників подій
    document.getElementById("add").addEventListener("click", () => openModal());
    document.getElementById("cancel").addEventListener("click", () => toggleModal(false));
    document.getElementById("form").addEventListener("submit", saveProduct);

    document.querySelectorAll("[data-category]").forEach(btn => {
        btn.addEventListener("click", () => {
            filterCategory = btn.dataset.category;
            render();
        });
    });

    document.querySelectorAll("[data-sort]").forEach(btn => {
        btn.addEventListener("click", () => {
            sortType = btn.dataset.sort;
            render();
        });
    });

    document.getElementById("reset-sort").addEventListener("click", () => {
        sortType = "";
        render();
    });

    // Початковий рендеринг
    render();
});
