// cart.js

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Import the unified product card renderer from shop-details.js if not already present
// (Assume shop-details.js is loaded before cart.js, or move the function to a shared file if needed)

function renderCartItems() {
  const cartBody = document.getElementById("cart-body");
  const totalPriceElem = document.getElementById("total-price");
  cartBody.innerHTML = "";

  let total = 0;

  if (cart.length === 0) {
    cartBody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-gray-500 dark:text-gray-400">Your cart is empty.</td></tr>`;
    totalPriceElem.textContent = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    const shop = shops.find(s => s.id === item.shopId);
    const product = shop?.products?.[item.productIndex];

    if (product && shop) {
      const subtotal = product.price * item.qty;
      total += subtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
          ${renderProductCard(product, item.productIndex, shop, { showAddToCart: false })}
          <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">${shop.name}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <div class="flex items-center gap-2">
            <button class="decrease bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button class="increase bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" data-index="${index}">+</button>
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">₹${subtotal}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm">
          <button class="remove text-red-600 hover:text-red-800 font-semibold" data-index="${index}">Remove</button>
        </td>
      `;
      cartBody.appendChild(row);
    } else {
      // Handle missing product/shop gracefully
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4" class="text-center text-error">Product or shop not found (may have been removed).</td>`;
      cartBody.appendChild(row);
    }
  });

  totalPriceElem.textContent = `Total: ₹${total}`;

  attachEventListeners();
}

function attachEventListeners() {
  // Increase Quantity
  document.querySelectorAll(".increase").forEach(btn =>
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      cart[index].qty++;
      saveCart();
      renderCartItems();
    })
  );

  // Decrease Quantity
  document.querySelectorAll(".decrease").forEach(btn =>
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      if (cart[index].qty > 1) {
        cart[index].qty--;
      } else {
        cart.splice(index, 1);
      }
      saveCart();
      renderCartItems();
    })
  );

  // Remove Item
  document.querySelectorAll(".remove").forEach(btn =>
    btn.addEventListener("click", e => {
      const index = +e.target.dataset.index;
      cart.splice(index, 1);
      saveCart();
      renderCartItems();
    })
  );
}

function clearCart() {
  cart = [];
  saveCart();
  renderCartItems();
}
