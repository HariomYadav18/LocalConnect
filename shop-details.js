

function getShopIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("shopId"));
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg transition-all duration-300 transform translate-x-full`;
  const bgColor = type === 'success' ? 'bg-success' : 'bg-primary';
  const icon = type === 'success' ? 'fas fa-check' : 'fas fa-info';
  notification.innerHTML = `
    <div class="flex items-center space-x-3 ${bgColor} text-white px-4 py-3 rounded-xl">
      <i class="${icon}"></i>
      <span class="font-medium">${message}</span>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 100);
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Confetti animation
function createConfettiBurst() {
  const colors = ['#FF6B35', '#F7931E', '#FFD23F', '#2ECC71', '#E74C3C'];
  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = (window.innerWidth / 2 + (Math.random() - 0.5) * 200) + 'px';
    confetti.style.top = (window.innerHeight / 2 + (Math.random() - 0.5) * 50) + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.opacity = '0.85';
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animation = `confetti-pop 1.2s cubic-bezier(0.4,0,0.2,1) forwards`;
    confetti.style.animationDelay = (Math.random() * 0.3) + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1400);
  }
}

// Add to Cart Popup
function showCartPopup(product, shop) {
  const container = document.getElementById('cart-popup-container');
  if (!container) return;
  container.innerHTML = `
    <div id="cart-popup" class="fixed inset-0 flex items-center justify-center z-[9999] bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-darkCard rounded-2xl shadow-2xl p-8 max-w-xs w-full text-center relative animate-bounceIn">
        <button id="close-cart-popup" class="absolute top-3 right-3 text-gray-400 hover:text-error text-xl focus:outline-none">&times;</button>
        <div class="flex flex-col items-center">
          <div class="w-16 h-16 bg-gradient-to-br from-success to-green-400 rounded-full flex items-center justify-center mb-4 animate-bounceIn">
            <i class="fas fa-check text-white text-3xl"></i>
          </div>
          <img src="${product.image}" alt="${product.name}" class="w-16 h-16 object-cover rounded-xl mb-2 shadow-md">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">${product.name}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4">Added to cart!</p>
          <div class="flex gap-2 w-full">
            <a href="cart.html" class="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 rounded-xl font-semibold hover:from-secondary hover:to-primary transition-all duration-300">View Cart</a>
            <button id="continue-shopping" class="flex-1 bg-gray-100 dark:bg-darkBorder text-gray-900 dark:text-white py-2 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300">Continue</button>
          </div>
        </div>
      </div>
    </div>
    <style>
      @keyframes confetti-pop {
        0% { opacity: 0.85; transform: scale(0.7) translateY(0); }
        60% { opacity: 1; transform: scale(1.1) translateY(-40px); }
        100% { opacity: 0; transform: scale(0.8) translateY(80px); }
      }
      .animate-bounceIn { animation: bounceIn 0.7s cubic-bezier(0.68,-0.55,0.27,1.55); }
      @keyframes bounceIn {
        0% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { opacity: 1; transform: scale(1); }
      }
    </style>
  `;
  // Close logic
  document.getElementById('close-cart-popup').onclick = () => container.innerHTML = '';
  document.getElementById('continue-shopping').onclick = () => container.innerHTML = '';
  // Auto-dismiss after 2.5s
  setTimeout(() => { container.innerHTML = ''; }, 2500);
}

function addToCart(product, shop) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find(item => item.productName === product.name && item.shopId === shop.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      productName: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      qty: 1,
      shopId: shop.id,
      shopName: shop.name,
      image: product.image
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge(true);
  showCartPopup(product, shop);
  createConfettiBurst();
}

// Fix: Ensure dark mode toggle and theme always work
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('localconnect_theme', isDark ? 'dark' : 'light');
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.className = isDark ? 'fas fa-sun text-gray-300' : 'fas fa-moon text-gray-700';
  }
}

function initializeTheme() {
  if (localStorage.getItem('localconnect_theme') === 'dark') {
    document.documentElement.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-sun text-gray-300';
  } else {
    document.documentElement.classList.remove('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-moon text-gray-700';
  }
}

// --- Product Quick View Modal, Image Zoom, Card Hover, Live Stock Badge ---

// Demo reviews for products
const DEMO_REVIEWS = [
  {
    user: 'Rahul S.',
    rating: 5,
    text: 'Great quality and fast delivery!'
  },
  {
    user: 'Priya K.',
    rating: 4,
    text: 'Fresh and well-packed. Will order again.'
  },
  {
    user: 'Amit R.',
    rating: 5,
    text: 'Excellent service and product.'
  }
];

function getRandomStock() {
  // Simulate stock: 1-10
  return Math.floor(Math.random() * 10) + 1;
}

// --- Unified Product Card Renderer ---
function renderProductCard(product, idx, shop, options = {}) {
  // options: { showShopName, showAddToCart, showQuickView, showFavorite, onAddToCart, onQuickView, onFavorite }
  const stock = product.inStock ? (typeof product.stock === 'number' ? product.stock : getRandomStock()) : 0;
  return `
    <div class="group bg-white dark:bg-darkCard rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fadeIn card-3d product-card" tabindex="0" aria-label="View details for ${product.name}" data-product-idx="${idx}">
      <div class="relative overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300 product-img-zoom"/>
        ${product.discount > 0 ? `
          <div class="absolute top-3 left-3">
            <span class="bg-error text-white px-2 py-1 rounded-full text-xs font-bold">
              -${product.discount}%
            </span>
          </div>
        ` : ''}
        ${stock > 0 && stock <= 3 ? `
          <div class="absolute top-3 right-3">
            <span class="bg-warning text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
              Only ${stock} left!
            </span>
          </div>
        ` : ''}
        ${!product.inStock ? `
          <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span class="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        ` : ''}
      </div>
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors duration-200">
          ${product.name}
        </h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          ${product.description || ''}
        </p>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span class="text-2xl font-bold text-primary dark:text-accent">₹${product.price}</span>
            ${product.originalPrice > product.price ? `
              <span class="text-gray-500 dark:text-gray-400 line-through">₹${product.originalPrice}</span>
            ` : ''}
          </div>
        </div>
        ${options.showAddToCart !== false ? `
        <button 
          class="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${!product.inStock ? 'opacity-60 cursor-not-allowed' : ''} add-to-cart-btn"
          ${!product.inStock ? 'disabled' : ''}
          data-product-idx="${idx}"
        >
          <i class="fas fa-shopping-cart"></i>
          <span>${product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
        ` : ''}
      </div>
    </div>
  `;
}

function renderShopDetails() {
  // Defensive: Wait for shops to be defined
  if (typeof shops === 'undefined' || !Array.isArray(shops)) {
    setTimeout(renderShopDetails, 50); // Try again shortly
    return;
  }
  const shopId = getShopIdFromURL();
  if (!shopId || isNaN(shopId)) {
    document.getElementById("shop-container").innerHTML = `
      <div class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Invalid shop link</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">No shop selected. Please choose a shop from the homepage.</p>
        <a href="index.html" class="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:from-secondary hover:to-primary transition-all duration-300">
          Back to Home
        </a>
      </div>
    `;
    return;
  }
  const shop = shops.find(s => s.id === shopId);
  const container = document.getElementById("shop-container");

  if (!shop) {
    container.innerHTML = `
      <div class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-exclamation-triangle text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Shop not found</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">The shop you're looking for doesn't exist or has been removed.</p>
        <a href="index.html" class="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:from-secondary hover:to-primary transition-all duration-300">
          Back to Home
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="bg-white dark:bg-darkCard rounded-2xl shadow-lg overflow-hidden mb-8">
      <div class="relative h-64 md:h-80">
        <img src="${shop.image}" alt="${shop.name}" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div class="absolute bottom-6 left-6 right-6">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between">
            <div class="text-white">
              <h1 class="text-3xl md:text-4xl font-display font-bold mb-2">${shop.name}</h1>
              <p class="text-white/90 mb-3 flex items-center">
                <i class="fas fa-map-marker-alt mr-2"></i>
                ${shop.location}
              </p>
              <div class="flex items-center space-x-4">
                <span class="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  ${shop.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-6">
        <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          ${shop.description || ''}
        </p>
      </div>
    </div>
    <div class="mb-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl md:text-3xl font-display font-bold text-gray-900 dark:text-white">
          Products
        </h2>
        <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <i class="fas fa-shopping-bag"></i>
          <span>${shop.products.length} items available</span>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${shop.products.map((product, idx) => {
          return renderProductCard(product, idx, shop, { showAddToCart: true });
        }).join("")}
      </div>
    </div>
  `;

  // --- Product Card Interactivity ---
  // Image zoom on hover (already via CSS, but ensure smoothness)
  document.querySelectorAll('.product-img-zoom').forEach(img => {
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.13)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });

  // 3D tilt effect on card hover
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Quick View Modal on card click/Enter
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-cart-btn')) return; // Don't open modal if add to cart clicked
      const idx = card.getAttribute('data-product-idx');
      openProductModal(shop, shop.products[idx]);
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const idx = card.getAttribute('data-product-idx');
        openProductModal(shop, shop.products[idx]);
      }
    });
  });
}

// --- Product Quick View Modal ---
function openProductModal(shop, product) {
  const container = document.getElementById('cart-popup-container');
  if (!container) return;
  // Demo: random reviews and stock
  const reviews = DEMO_REVIEWS.slice(0, Math.floor(Math.random() * DEMO_REVIEWS.length) + 1);
  const stock = product.inStock ? getRandomStock() : 0;
  container.innerHTML = `
    <div id="product-modal" class="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div class="bg-white dark:bg-darkCard rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative animate-bounceIn outline-none" tabindex="0" aria-modal="true" role="dialog">
        <button id="close-product-modal" class="absolute top-3 right-3 text-gray-400 hover:text-error text-xl focus:outline-none" aria-label="Close">&times;</button>
        <div class="flex flex-col items-center">
          <img src="${product.image}" alt="${product.name}" class="w-32 h-32 object-cover rounded-xl mb-4 shadow-md transition-transform duration-300 hover:scale-110 cursor-zoom-in">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">${product.name}</h3>
          <div class="flex items-center justify-center mb-2">
            <span class="text-2xl font-bold text-primary dark:text-accent">₹${product.price}</span>
            ${product.originalPrice > product.price ? `<span class="ml-2 text-gray-500 dark:text-gray-400 line-through">₹${product.originalPrice}</span>` : ''}
            ${product.discount > 0 ? `<span class="ml-2 bg-error text-white px-2 py-1 rounded-full text-xs font-bold">-${product.discount}%</span>` : ''}
          </div>
          ${stock > 0 && stock <= 3 ? `<div class="mb-2"><span class="bg-warning text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">Only ${stock} left!</span></div>` : ''}
          ${!product.inStock ? `<div class="mb-2"><span class="bg-error text-white px-2 py-1 rounded-full text-xs font-bold">Out of Stock</span></div>` : ''}
          <p class="text-gray-600 dark:text-gray-300 mb-4">${product.description || ''}</p>
          <div class="flex items-center justify-center mb-4">
            <button class="mr-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:from-secondary hover:to-primary add-to-cart-btn-modal" ${!product.inStock ? 'disabled style="opacity:0.6;cursor:not-allowed;"' : ''}>Add to Cart</button>
            <button class="ml-2 bg-gray-100 dark:bg-darkBorder text-gray-900 dark:text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-700 favorite-btn-modal">
              <i class="fas fa-heart ${isProductFavorite(shop, product) ? 'text-red-500 scale-110' : 'text-gray-400'}"></i>
            </button>
          </div>
          <div class="text-left w-full mt-4">
            <h4 class="font-semibold text-gray-900 dark:text-white mb-2">Reviews</h4>
            <div class="space-y-2">
              ${reviews.map(r => `
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">${r.user[0]}</div>
                  <div>
                    <div class="flex text-yellow-400 text-sm">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                    <div class="text-gray-700 dark:text-gray-300 text-sm">${r.text}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      .card-3d:focus { outline: 2px solid #FF6B35; outline-offset: 2px; }
      .product-card:focus { outline: 2px solid #FF6B35; outline-offset: 2px; }
    </style>
  `;
  // Modal close logic
  document.getElementById('close-product-modal').onclick = () => container.innerHTML = '';
  // Keyboard accessibility
  const modal = document.getElementById('product-modal');
  modal.focus();
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') container.innerHTML = '';
  });
  // Add to Cart in modal
  const addBtn = modal.querySelector('.add-to-cart-btn-modal');
  if (addBtn) {
    addBtn.onclick = () => { addToCart(product, shop); container.innerHTML = ''; };
  }
  // Favorite in modal
  const favBtn = modal.querySelector('.favorite-btn-modal');
  if (favBtn) {
    favBtn.onclick = () => {
      toggleProductFavorite(shop, product, favBtn.querySelector('i'));
    };
  }
}

function isProductFavorite(shop, product) {
  // For demo, just use shop favorite for now
  const favs = JSON.parse(localStorage.getItem('favoriteShops') || '[]');
  return favs.includes(shop.id);
}
function toggleProductFavorite(shop, product, iconEl) {
  let favs = JSON.parse(localStorage.getItem('favoriteShops') || '[]');
  if (favs.includes(shop.id)) {
    favs = favs.filter(id => id !== shop.id);
    iconEl.classList.remove('text-red-500', 'scale-110');
    iconEl.classList.add('text-gray-400');
  } else {
    favs.push(shop.id);
    iconEl.classList.add('text-red-500', 'scale-110');
    iconEl.classList.remove('text-gray-400');
    iconEl.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.3)' },
      { transform: 'scale(1)' }
    ], { duration: 400, easing: 'cubic-bezier(0.68,-0.55,0.27,1.55)' });
  }
  localStorage.setItem('favoriteShops', JSON.stringify(favs));
}

// Enhance cart badge with animation
function updateCartBadge(animated) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
    if (animated && totalItems > 0) {
      badge.classList.add('animate-bounce');
      setTimeout(() => badge.classList.remove('animate-bounce'), 1000);
    }
  }
}

// Floating Action Button (FAB) - show help message
function setupFAB() {
  const fab = document.getElementById('fab');
  if (fab) {
    fab.addEventListener('click', () => {
      alert('Need help? Contact the developer at hariomydv1844@gmail.com');
    });
  }
}

// --- Animated Add to Cart Button ---
function animateAddToCartButton(btn) {
  if (!btn) return;
  const icon = btn.querySelector('i');
  const text = btn.querySelector('span');
  if (!icon || !text) return;
  // Morph to checkmark
  icon.className = 'fas fa-check text-white';
  text.textContent = 'Added!';
  btn.classList.add('bg-success', 'from-success', 'to-green-500');
  btn.classList.remove('from-primary', 'to-secondary');
  btn.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.15)' },
    { transform: 'scale(1)' }
  ], { duration: 600, easing: 'cubic-bezier(0.68,-0.55,0.27,1.55)' });
  setTimeout(() => {
    icon.className = 'fas fa-shopping-cart';
    text.textContent = 'Add to Cart';
    btn.classList.remove('bg-success', 'from-success', 'to-green-500');
    btn.classList.add('from-primary', 'to-secondary');
  }, 1200);
}

// Patch addToCart to animate button
const _originalAddToCart = addToCart;
window.addToCart = function(product, shop, btn) {
  _originalAddToCart(product, shop);
  if (btn) animateAddToCartButton(btn);
};

// Patch product card and modal to use animated button
function patchAddToCartButtons(shop) {
  // Card buttons
  document.querySelectorAll('.add-to-cart-btn').forEach((btn, idx) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      window.addToCart(shop.products[idx], shop, btn);
    };
  });
}

// Patch modal button
function patchModalAddToCartButton(shop, product) {
  const modal = document.getElementById('product-modal');
  if (!modal) return;
  const btn = modal.querySelector('.add-to-cart-btn-modal');
  if (btn) {
    btn.onclick = () => {
      window.addToCart(product, shop, btn);
      setTimeout(() => { document.getElementById('cart-popup-container').innerHTML = ''; }, 900);
    };
  }
}

// Initialize all features on DOMContentLoaded
function initializeShopDetailsPage() {
  initializeTheme();
  updateCartBadge();
  setupFAB();
  renderShopDetails();
}

// Ensure shop details are rendered on every navigation
window.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  updateCartBadge();
  setupFAB();
  renderShopDetails();
});
window.addEventListener('popstate', renderShopDetails);
