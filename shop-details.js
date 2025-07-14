

function getShopIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("shopId"));
}

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
                  <span class="text-2xl font-bold text-primary dark:text-accent"> 9${product.price}</span>
                </div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// --- Advanced Features and Dark Mode Logic ---

// Dark mode toggle
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('localconnect_theme', isDark ? 'dark' : 'light');
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.className = isDark ? 'fas fa-sun text-gray-300' : 'fas fa-moon text-gray-700';
  }
}

// Initialize theme on page load
function initializeTheme() {
  if (localStorage.getItem('localconnect_theme') === 'dark') {
    document.documentElement.classList.add('dark');
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) themeIcon.className = 'fas fa-sun text-gray-300';
  }
}

// Update cart badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
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

document.addEventListener('DOMContentLoaded', initializeShopDetailsPage);
