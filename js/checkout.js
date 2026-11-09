const CART_KEY = "enchantedLibraryCart";
const ORDER_KEY = "enchantedLibraryOrderConfirmed";

const message = document.getElementById("checkout-message");

const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
const previousConfirmation = sessionStorage.getItem(ORDER_KEY);

if (cart.length > 0) {

    const total = cart.reduce(
        (sum, book) => sum + Number(book.price) * (book.quantity || 1),
        0
    );

    localStorage.removeItem(CART_KEY);
    sessionStorage.setItem(ORDER_KEY, "true");

    message.replaceChildren();

    const icon = document.createElement("p");
    icon.className = "checkout-icon";
    icon.textContent = "✓";

    const heading = document.createElement("h2");
    heading.textContent = "Your Order Was Successful!";

    const text = document.createElement("p");
    text.textContent =
        "Thank you for shopping at The Enchanted Library.";

    const totalText = document.createElement("p");
    totalText.className = "checkout-total";
    totalText.textContent = "Order total: " + total + "€";

    const note = document.createElement("p");
    note.textContent =
        "Your magical reading adventure awaits!";

    message.append(icon, heading, text, totalText, note);

} else if (previousConfirmation === "true") {

    message.replaceChildren();

    const icon = document.createElement("p");
    icon.className = "checkout-icon";
    icon.textContent = "✓";

    const heading = document.createElement("h2");
    heading.textContent = "Your Order Was Successful!";

    const text = document.createElement("p");
    text.textContent =
        "Thank you for shopping at The Enchanted Library.";

    const note = document.createElement("p");
    note.textContent =
        "Your magical reading adventure awaits!";

    message.append(icon, heading, text, note);

} else {

    message.replaceChildren();

    const heading = document.createElement("h2");
    heading.textContent = "Your Cart Is Empty";

    const text = document.createElement("p");
    text.textContent =
        "Please add a book to your cart before checking out.";

    message.append(heading, text);
}