// Assumes `shops` is loaded from shops.js
const shopContainer = document.getElementById('shopContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

function populateCategories() {
  const categories = Array.from(new Set(shops.map(shop => shop.category)));
  categoryFilter.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function renderShops(filteredShops) {
  shopContainer.innerHTML = '';

  if (filteredShops.length === 0) {
    shopContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-300">No shops found.</p>';
    return;
  }

  filteredShops.forEach(shop => {
    const card = document.createElement('div');
    card.className = "bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 duration-300 animate-fadeIn";

    const stars = '⭐'.repeat(Math.floor(shop.rating)) + (shop.rating % 1 >= 0.5 ? '✬' : '');

    card.innerHTML = `
      <img src="${shop.image}" alt="${shop.name}" class="w-full h-48 object-cover rounded-t-xl">
      <div class="p-4">
        <h3 class="text-xl font-semibold text-primary dark:text-accent">${shop.name}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">${shop.category} • ${shop.location}</p>
        <p class="text-sm mt-1 text-yellow-500 dark:text-yellow-400">Rating: ${shop.rating.toFixed(1)} (${stars})</p>
        <button class="mt-3 px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition text-sm view-btn">
          View Details
        </button>
      </div>
    `;

    shopContainer.appendChild(card);
  });

  document.querySelectorAll('.view-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const shopId = filteredShops[index].id;
      window.location.href = `shop-details.html?shopId=${shopId}`;
    });
  });
}

function filterShops() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;

  localStorage.setItem('localconnect_search', searchTerm);
  localStorage.setItem('localconnect_category', selectedCategory);

  const filtered = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm) ||
                          shop.category.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "" || shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  renderShops(filtered);
}

function restoreSearchState() {
  const savedSearch = localStorage.getItem('localconnect_search') || '';
  const savedCategory = localStorage.getItem('localconnect_category') || '';
  searchInput.value = savedSearch;
  categoryFilter.value = savedCategory;
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector("button[onclick*='dark']");
  if (toggleButton) {
    toggleButton.innerText = document.documentElement.classList.contains('dark') ? 'Light Mode' : 'Dark Mode';

    toggleButton.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle('dark');
      toggleButton.innerText = isDark ? 'Light Mode' : 'Dark Mode';
    });
  }
});

populateCategories();
restoreSearchState();
filterShops();
searchInput.addEventListener('input', filterShops);
categoryFilter.addEventListener('change', filterShops);
