
const CART_KEY = "enchantedLibraryCart";

// Učitavanje sačuvanih knjiga
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Čuvanje knjiga
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Dodavanje knjige u korpu
function addToCart(title, price) {
    const cart = getCart();
    const existingBook = cart.find(book => book.title === title);

    if (existingBook) {
        existingBook.quantity = (existingBook.quantity || 1) + 1;
    } else {
        cart.push({
            title: title,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart(cart);
    displayCart();

    alert(title + " has been added to your cart!");
}

// Prikaz knjiga u korpi
function displayCart() {
    const cartItems = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");

    // Ako nismo na stranici korpe, prekidamo funkciju
    if (!cartItems || !totalElement) {
        return;
    }

    const cart = getCart();

    // Brišemo prethodni prikaz
    cartItems.replaceChildren();

    if (cart.length === 0) {
        const message = document.createElement("p");
        message.textContent = "Your cart is currently empty.";
        cartItems.appendChild(message);
    } else {
        cart.forEach((book, index) => {
            const item = document.createElement("div");
            item.className = "cart-item";

            const name = document.createElement("p");
            name.className = "cart-book-title";
            name.textContent = book.title;

            const quantity = book.quantity || 1;

            const details = document.createElement("div");
            details.className = "cart-book-details";

            const quantityLabel = document.createElement("span");
            quantityLabel.textContent = "Quantity: ";

            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.className = "quantity-button";
            decreaseButton.textContent = "−";
            decreaseButton.dataset.index = index;
            decreaseButton.dataset.action = "decrease";
            decreaseButton.setAttribute("aria-label", "Decrease quantity");

            const quantityValue = document.createElement("span");
            quantityValue.className = "quantity-value";
            quantityValue.textContent = quantity;

            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.className = "quantity-button";
            increaseButton.textContent = "+";
            increaseButton.dataset.index = index;
            increaseButton.dataset.action = "increase";
            increaseButton.setAttribute("aria-label", "Increase quantity");

            const unitPrice = document.createElement("span");
            unitPrice.textContent = " × " + book.price + "€";

            details.append(
                quantityLabel,
                decreaseButton,
                quantityValue,
                increaseButton,
                unitPrice
            );

            const subtotal = document.createElement("p");
            subtotal.className = "cart-book-price";
            subtotal.textContent = (book.price * quantity) + "€";

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-book-button";
            removeButton.textContent = "Remove";
            removeButton.dataset.index = index;

            item.append(name, details, subtotal, removeButton);
            cartItems.appendChild(item);
        });
    }

    // Računanje ukupne cene svih primeraka
    const total = cart.reduce(
        (sum, book) => sum + Number(book.price) * (book.quantity || 1),
        0
    );

    totalElement.textContent = total + "€";
}

// Povezivanje dugmadi Add to Cart na stranicama knjiga
document.querySelectorAll(".add-to-cart-button").forEach(button => {
    button.addEventListener("click", function () {
        const bookDetails = button.closest(".book-details");

        if (!bookDetails) {
            return;
        }

        const image = bookDetails.querySelector(".book-cover img");
        const priceElement = bookDetails.querySelector(".book-cover .price");

        if (!image || !priceElement) {
            return;
        }

        const title = image.alt
            .replace(/\s*book cover\s*/i, "")
            .trim();

        const priceText = priceElement.textContent;
        const price = parseFloat(
            priceText.replace(",", ".").replace(/[^\d.]/g, "")
        );

        if (!title || Number.isNaN(price)) {
            alert("Sorry, we couldn't add this book to your cart.");
            return;
        }

        addToCart(title, price);
    });
});

// Uklanjanje knjige iz korpe
document.addEventListener("click", function (event) {
    const cart = getCart();

    // Potpuno uklanjanje knjige
    if (event.target.classList.contains("remove-book-button")) {
        const index = Number(event.target.dataset.index);

        cart.splice(index, 1);
        saveCart(cart);
        displayCart();
        return;
    }

    // Povećavanje ili smanjivanje količine
    if (event.target.classList.contains("quantity-button")) {
        const index = Number(event.target.dataset.index);
        const action = event.target.dataset.action;
        const book = cart[index];

        if (!book) {
            return;
        }

        book.quantity = book.quantity || 1;

        if (action === "increase") {
            book.quantity += 1;
        } else if (action === "decrease") {
            book.quantity -= 1;

            // Kada količina dođe do nule, uklanjamo knjigu
            if (book.quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        saveCart(cart);
        displayCart();
    }
});

// Prikaz korpe pri otvaranju stranice
displayCart();
