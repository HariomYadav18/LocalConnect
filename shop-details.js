

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

// Fix: Always re-render product features and re-attach event listeners after navigation or theme change
function renderShopDetails() {
  const shopId = getShopIdFromURL();
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
        ${shop.products.map(product => `
          <div class="group bg-white dark:bg-darkCard rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fadeIn">
            <div class="relative overflow-hidden">
              <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
              ${product.discount > 0 ? `
                <div class="absolute top-3 left-3">
                  <span class="bg-error text-white px-2 py-1 rounded-full text-xs font-bold">
                    -${product.discount}%
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
              <button 
                class="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 ${!product.inStock ? 'opacity-60 cursor-not-allowed' : ''}"
                ${!product.inStock ? 'disabled' : ''}
                onclick='window.addToCart && addToCart(${JSON.stringify(product)}, ${JSON.stringify(shop)})'
              >
                <i class="fas fa-shopping-cart"></i>
                <span>${product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
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

// Initialize all features on DOMContentLoaded
function initializeShopDetailsPage() {
  initializeTheme();
  updateCartBadge();
  setupFAB();
  renderShopDetails();
}

// Ensure theme is initialized on every navigation
window.addEventListener('DOMContentLoaded', initializeTheme);
