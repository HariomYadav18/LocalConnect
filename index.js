// Enhanced LocalConnect Index JavaScript with Advanced Features
const shopContainer = document.getElementById('shopContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const sortBtn = document.getElementById('sortBtn');
const sortDropdown = document.getElementById('sortDropdown');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const noResults = document.getElementById('noResults');

let currentShops = [...shops];
let sortOrder = 'default';
let activeFilters = new Set();

// Custom cursor functionality
function initCustomCursor() {
  const cursor = document.getElementById('cursor-glow');
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .category-card, .card-3d');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.3) 0%, transparent 70%)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'radial-gradient(circle, rgba(255, 107, 53, 0.8) 0%, transparent 70%)';
    });
  });
}

// Voice search functionality
function initVoiceSearch() {
  const voiceButtons = document.querySelectorAll('.fa-microphone');
  
  voiceButtons.forEach(button => {
    button.addEventListener('click', () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.start();
        button.style.color = '#FF6B35';
        button.classList.add('animate-pulse');
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          searchInput.value = transcript;
          filterShops();
          button.style.color = '';
          button.classList.remove('animate-pulse');
        };
        
        recognition.onerror = () => {
          button.style.color = '';
          button.classList.remove('animate-pulse');
        };
      } else {
        alert('Voice search is not supported in this browser');
      }
    });
  });
}

// Enhanced category population with icons
function populateCategories() {
  const categories = Array.from(new Set(shops.map(shop => shop.category)));
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  
  const categoryIcons = {
    'Grocery': 'fas fa-shopping-basket',
    'Electronics': 'fas fa-laptop',
    'Books': 'fas fa-book',
    'Clothing': 'fas fa-tshirt',
    'Vegetables': 'fas fa-carrot'
  };

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Advanced filtering system
function filterShops() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  
  // Show loading skeleton
  showLoading();
  
  setTimeout(() => {
    let filteredShops = shops.filter(shop => {
      const matchesSearch = shop.name.toLowerCase().includes(searchTerm) ||
                           shop.category.toLowerCase().includes(searchTerm) ||
                           shop.location.toLowerCase().includes(searchTerm);
      
      const matchesCategory = !selectedCategory || shop.category === selectedCategory;
      
      // Apply active filters
      let matchesFilters = true;
      activeFilters.forEach(filter => {
        switch(filter) {
          case 'rating':
            matchesFilters = matchesFilters && shop.rating >= 4;
            break;
          case 'open':
            matchesFilters = matchesFilters && Math.random() > 0.3; // Simulate open status
            break;
          case 'delivery':
            matchesFilters = matchesFilters && Math.random() > 0.5; // Simulate free delivery
            break;
          case 'discount':
            matchesFilters = matchesFilters && Math.random() > 0.4; // Simulate offers
            break;
        }
      });
      
      return matchesSearch && matchesCategory && matchesFilters;
    });
    
    // Apply sorting
    filteredShops = sortShops(filteredShops, sortOrder);
    
    // Update display
    currentShops = filteredShops;
    displayShops(filteredShops);
    hideLoading();
  }, 500);
}

// Enhanced sorting functionality
function sortShops(shops, order) {
  const sortedShops = [...shops];
  
  switch(order) {
    case 'rating':
      return sortedShops.sort((a, b) => b.rating - a.rating);
    case 'name':
      return sortedShops.sort((a, b) => a.name.localeCompare(b.name));
    case 'delivery':
      return sortedShops.sort((a, b) => Math.random() - 0.5); // Simulate delivery time
    case 'distance':
      return sortedShops.sort((a, b) => Math.random() - 0.5); // Simulate distance
    default:
      return sortedShops;
  }
}

// Loading states
function showLoading() {
  loadingSkeleton.classList.remove('hidden');
  shopContainer.classList.add('hidden');
  noResults.classList.add('hidden');
}

function hideLoading() {
  loadingSkeleton.classList.add('hidden');
  shopContainer.classList.remove('hidden');
}

// Enhanced shop display with animations
function displayShops(shops) {
  shopContainer.innerHTML = '';
  
  if (shops.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }
  
  noResults.classList.add('hidden');
  
  shops.forEach((shop, index) => {
    const shopCard = createShopCard(shop, index);
    shopContainer.appendChild(shopCard);
  });
}

// Create enhanced shop card with 3D effects
function createShopCard(shop, index) {
  const card = document.createElement('div');
  card.className = 'bg-white dark:bg-darkCard rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-fadeIn card-3d group cursor-pointer';
  card.style.animationDelay = `${index * 0.1}s`;
  
  // Add random features for demo
  const hasFreeDelivery = Math.random() > 0.5;
  const hasOffers = Math.random() > 0.6;
  const isOpen = Math.random() > 0.3;
  
  card.innerHTML = `
    <div class="relative overflow-hidden rounded-t-2xl">
      <img src="${shop.image}" alt="${shop.name}" class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500">
      <div class="absolute top-4 left-4 flex space-x-2">
        ${hasOffers ? '<span class="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">OFFER</span>' : ''}
        ${hasFreeDelivery ? '<span class="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">FREE DELIVERY</span>' : ''}
      </div>
      <div class="absolute top-4 right-4">
        <span class="bg-white dark:bg-darkCard px-2 py-1 rounded-full text-xs font-semibold ${isOpen ? 'text-green-600' : 'text-red-600'}">
          ${isOpen ? 'OPEN' : 'CLOSED'}
        </span>
      </div>
      <div class="absolute bottom-4 right-4 bg-white dark:bg-darkCard rounded-full p-2 shadow-lg">
        <i class="fas fa-heart text-gray-400 hover:text-red-500 transition-colors duration-300"></i>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">${shop.name}</h3>
        <div class="flex items-center space-x-1">
          <i class="fas fa-star text-yellow-400 text-sm"></i>
          <span class="text-sm font-semibold text-gray-900 dark:text-white">${shop.rating}</span>
        </div>
      </div>
      
      <div class="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
        <i class="fas fa-map-marker-alt mr-1"></i>
        <span>${shop.location}</span>
        <span class="mx-2">•</span>
        <span class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">${shop.category}</span>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fas fa-clock text-gray-400 text-sm"></i>
          <span class="text-sm text-gray-600 dark:text-gray-400">20-30 min</span>
        </div>
        <button class="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:from-secondary hover:to-primary transition-all duration-300 font-semibold group-hover:scale-105">
          View Shop
        </button>
      </div>
    </div>
  `;
  
  // Add click handler
  card.addEventListener('click', () => {
    window.location.href = `shop-details.html?shopId=${shop.id}`;
  });
  
  return card;
}

// Category card interactions
function initCategoryCards() {
  const categoryCards = document.querySelectorAll('.category-card');
  
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (category && category !== 'More') {
        categoryFilter.value = category;
        filterShops();
        
        // Scroll to shops section
        document.getElementById('shops').scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Sort dropdown functionality
function initSortDropdown() {
  sortBtn.addEventListener('click', () => {
    sortDropdown.classList.toggle('hidden');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!sortBtn.contains(e.target) && !sortDropdown.contains(e.target)) {
      sortDropdown.classList.add('hidden');
    }
  });
  
  // Sort options
  document.querySelectorAll('.sort-option').forEach(option => {
    option.addEventListener('click', () => {
      sortOrder = option.dataset.sort;
      sortBtn.innerHTML = `
        <i class="fas fa-sort"></i>
        <span>${option.textContent.trim()}</span>
        <i class="fas fa-chevron-down text-sm"></i>
      `;
      sortDropdown.classList.add('hidden');
      filterShops();
    });
  });
}

// Quick filters functionality
function initQuickFilters() {
  const quickFilters = document.querySelectorAll('.quick-filter');
  
  quickFilters.forEach(filter => {
    filter.addEventListener('click', () => {
      const filterType = filter.dataset.filter;
      
      if (activeFilters.has(filterType)) {
        activeFilters.delete(filterType);
        filter.classList.remove('bg-primary', 'text-white');
        filter.classList.add('bg-gray-200', 'dark:bg-gray-700');
      } else {
        activeFilters.add(filterType);
        filter.classList.add('bg-primary', 'text-white');
        filter.classList.remove('bg-gray-200', 'dark:bg-gray-700');
      }
      
      filterShops();
    });
  });
}

// Confetti animation for special events
function createConfetti() {
  const colors = ['#FF6B35', '#F7931E', '#FFD23F', '#2ECC71', '#E74C3C'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '9999';
    confetti.style.animation = 'confetti 3s ease-out forwards';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fadeIn');
      }
    });
  }, observerOptions);
  
  // Observe all cards and sections
  document.querySelectorAll('.card-3d, section').forEach(el => {
    observer.observe(el);
  });
}

// Enhanced search with debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initCustomCursor();
  initVoiceSearch();
  populateCategories();
  initCategoryCards();
  initSortDropdown();
  initQuickFilters();
  initScrollAnimations();
  
  // Event listeners
  searchInput.addEventListener('input', debounce(filterShops, 300));
  categoryFilter.addEventListener('change', filterShops);
  
  // Initial display
  displayShops(shops);
  
  // Special effects
  setTimeout(() => {
    createConfetti();
  }, 2000);
  
  // Auto-update activity feed
  setInterval(() => {
    updateActivityFeed();
  }, 10000);
});

// Update activity feed with new activities
function updateActivityFeed() {
  const activities = [
    { type: 'order', text: 'New order placed at Sharma Kirana', time: '1 minute ago', icon: 'shopping-cart', color: 'green' },
    { type: 'user', text: 'New user registered', time: '3 minutes ago', icon: 'user-plus', color: 'blue' },
    { type: 'review', text: '5-star review for Tech Bazaar', time: '5 minutes ago', icon: 'star', color: 'purple' },
    { type: 'shop', text: 'New shop FreshMart joined', time: '8 minutes ago', icon: 'store', color: 'orange' }
  ];
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const activityFeed = document.querySelector('.space-y-3');
  
  if (activityFeed) {
    const newActivity = document.createElement('div');
    newActivity.className = 'flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fadeIn';
    newActivity.innerHTML = `
      <div class="w-8 h-8 bg-${randomActivity.color}-500 rounded-full flex items-center justify-center">
        <i class="fas fa-${randomActivity.icon} text-white text-sm"></i>
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-900 dark:text-white">${randomActivity.text}</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">${randomActivity.time}</p>
      </div>
    `;
    
    activityFeed.insertBefore(newActivity, activityFeed.firstChild);
    
    // Remove old activities if too many
    if (activityFeed.children.length > 6) {
      activityFeed.removeChild(activityFeed.lastChild);
    }
  }
}

// Enhanced cart badge update
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cart-badge');
  
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Add animation when items change
    if (totalItems > 0) {
      badge.classList.add('animate-bounce');
      setTimeout(() => {
        badge.classList.remove('animate-bounce');
      }, 1000);
    }
  }
}

// Initialize cart badge
updateCartBadge();

// Hero search functionality with enhanced features
document.getElementById('hero-search').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    searchInput.value = this.value;
    searchInput.dispatchEvent(new Event('input'));
    document.getElementById('shops').scrollIntoView({ behavior: 'smooth' });
    
    // Add success animation
    this.style.borderColor = '#2ECC71';
    setTimeout(() => {
      this.style.borderColor = '';
    }, 2000);
  }
});

// Export functions for global access
window.LocalConnect = {
  filterShops,
  createConfetti,
  updateCartBadge
};
