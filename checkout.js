// checkout.js
let lastOrderTotal = 0;
function renderOrderSummary() {
  const summaryDiv = document.getElementById('order-summary');
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!summaryDiv) return;
  if (cart.length === 0) {
    summaryDiv.innerHTML = '<div class="text-gray-500">Your cart is empty.</div>';
    lastOrderTotal = 0;
    return;
  }
  let subtotal = 0;
  let itemsHTML = cart.map(item => {
    const line = `<div class=\"flex justify-between py-1\">\n      <span>${item.productName} × ${item.qty}</span>\n      <span>₹${item.price * item.qty}</span>\n    </div>`;
    subtotal += item.price * item.qty;
    return line;
  }).join('');
  const delivery = 20;
  const total = subtotal + delivery;
  lastOrderTotal = total;
  summaryDiv.innerHTML = `
    <h4 class=\"font-semibold mb-2\">Order Summary</h4>
    ${itemsHTML}
    <div class=\"flex justify-between border-t pt-2 mt-2 font-bold\">\n      <span>Subtotal</span>\n      <span>₹${subtotal}</span>\n    </div>
    <div class=\"flex justify-between pt-1\">\n      <span>Delivery</span>\n      <span>₹${delivery}</span>\n    </div>
    <div class=\"flex justify-between border-t pt-2 mt-2 font-bold text-lg\">\n      <span>Total</span>\n      <span>₹${total}</span>\n    </div>
  `;
}
document.addEventListener('DOMContentLoaded', renderOrderSummary);
document.addEventListener('DOMContentLoaded', function() {
  var checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.onsubmit = function(e) {
      e.preventDefault();
      // Gather form data
      const formData = new FormData(checkoutForm);
      const orderData = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        pincode: formData.get('pincode'),
        instructions: formData.get('instructions'),
        items: JSON.parse(localStorage.getItem('cart') || '[]'),
        total: lastOrderTotal
      };
      // Save order summary for confirmation page
      localStorage.setItem('orderSummary', JSON.stringify(orderData));
      // Clear cart
      localStorage.setItem('cart', '[]');
      // Redirect to confirmation page
      window.location.href = 'checkout-success.html';
    };
  }
}); 