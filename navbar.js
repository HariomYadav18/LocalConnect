// navbar.js
function updateCartBadge() {
  const cart = window.getCart ? window.getCart() : [];
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 0), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}
window.updateCartBadge = updateCartBadge;
document.addEventListener('DOMContentLoaded', updateCartBadge); 