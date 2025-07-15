// cart.js (rewritten from scratch)

// Utility: Get cart from localStorage
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

// Utility: Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Utility: Update cart badge
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Render cart items
function renderCartItems() {
  const cart = getCart();
  const cartBody = document.getElementById('cart-items-container');
  const subtotalElem = document.getElementById('subtotal');
  const totalElem = document.getElementById('total');
  const deliveryFeeElem = document.getElementById('delivery-fee');
  const taxesElem = document.getElementById('taxes');
  const checkoutBtn = document.getElementById('checkout-btn');

  cartBody.innerHTML = '';
  let subtotal = 0;
  let hasValidItems = false;

  if (!window.shops || !Array.isArray(window.shops)) {
    cartBody.innerHTML = '<div class="text-center py-6 text-error">Shop data not loaded. Please refresh the page.</div>';
    return;
  }

  if (cart.length === 0) {
    cartBody.innerHTML = `<div class="text-center py-6 text-gray-500 dark:text-gray-400">Your cart is empty.</div>`;
    if (subtotalElem) subtotalElem.textContent = '₹0';
    if (totalElem) totalElem.textContent = '₹0';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  cart.forEach((item, index) => {
    // Robust matching: allow string/number for shopId, and check productIndex
    const shop = window.shops.find(s => String(s.id) === String(item.shopId) || Number(s.id) === Number(item.shopId));
    const product = shop && Array.isArray(shop.products) && item.productIndex != null && shop.products[item.productIndex] ? shop.products[item.productIndex] : null;
    if (product && shop) {
      hasValidItems = true;
      const itemSubtotal = (product.price || 0) * (item.qty || 1);
      subtotal += itemSubtotal;
      const div = document.createElement('div');
      div.className = 'flex items-center justify-between border-b border-gray-200 dark:border-darkBorder py-4';
      div.innerHTML = `
        <div class="flex items-center space-x-4">
          <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-xl shadow-md">
          <div>
            <div class="font-semibold text-lg text-gray-900 dark:text-white">${product.name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${shop.name}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Qty: <span class="font-bold">${item.qty}</span></div>
          </div>
        </div>
        <div class="flex flex-col items-end">
          <div class="font-semibold text-primary dark:text-accent text-lg">₹${product.price}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400 line-through">${product.originalPrice > product.price ? `₹${product.originalPrice}` : ''}</div>
          <button class="remove text-red-600 hover:text-red-800 font-semibold mt-2 text-xs" data-index="${index}">Remove</button>
        </div>
      `;
      cartBody.appendChild(div);
    } else {
      const div = document.createElement('div');
      div.className = 'text-center text-error py-2';
      div.textContent = 'Product or shop not found (may have been removed).';
      cartBody.appendChild(div);
    }
  });

  if (subtotalElem) subtotalElem.textContent = `₹${subtotal}`;
  const deliveryFee = 20;
  const taxes = 0;
  const total = subtotal + deliveryFee + taxes;
  if (deliveryFeeElem) deliveryFeeElem.textContent = `₹${deliveryFee}`;
  if (taxesElem) taxesElem.textContent = `₹${taxes}`;
  if (totalElem) totalElem.textContent = `₹${total}`;
  if (checkoutBtn) checkoutBtn.disabled = !hasValidItems;

  attachCartEventListeners();
  updateCartBadge();
}

function attachCartEventListeners() {
  document.querySelectorAll('.remove').forEach(btn =>
    btn.addEventListener('click', e => {
      const cart = getCart();
      const index = +e.target.dataset.index;
      cart.splice(index, 1);
      saveCart(cart);
      renderCartItems();
    })
  );
  // Clear cart button
  const clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.onclick = function() {
      saveCart([]);
      renderCartItems();
    };
  }
}

// Wait for shops to be loaded before rendering cart
function waitForShopsAndRender(tries = 0) {
  if (!window.shops || !Array.isArray(window.shops)) {
    if (tries > 30) {
      document.getElementById('cart-items-container').innerHTML = '<div class="text-center py-6 text-error">Shop data could not be loaded. Please refresh.</div>';
      return;
    }
    setTimeout(() => waitForShopsAndRender(tries + 1), 50);
    return;
  }
  renderCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
  waitForShopsAndRender();
});
