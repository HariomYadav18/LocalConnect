// utils.js
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function formatCurrency(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}
window.getCart = getCart;
window.saveCart = saveCart;
window.formatCurrency = formatCurrency; 