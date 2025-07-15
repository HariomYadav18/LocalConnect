const shops = [
  {
    id: 1,
    name: "Sharma Kirana Store",
    category: "Grocery",
    location: "Delhi",
    rating: 4.3,
    image: "./assets/sharma-kirana.jpg",
    products: [
      {
        name: "Rice",
        price: 55,
        originalPrice: 65,
        discount: 15,
        inStock: true,
        description: "Premium Basmati Rice 1kg",
        image: "./assets/rice.jpg"
      },
      {
        name: "Wheat Flour",
        price: 45,
        originalPrice: 50,
        discount: 10,
        inStock: true,
        description: "Fresh Chakki Atta 1kg",
        image: "./assets/wheat-flour.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "Tech Bazaar",
    category: "Electronics",
    location: "Mumbai",
    rating: 4.7,
    image: "./assets/tech.jpg",
    products: [
      {
        name: "Headphones",
        price: 1299,
        originalPrice: 1599,
        discount: 19,
        inStock: true,
        description: "Wireless Bluetooth Headphones",
        image: "./assets/headphones.jpg"
      },
      {
        name: "USB Cable",
        price: 199,
        originalPrice: 299,
        discount: 33,
        inStock: false,
        description: "Fast charging Type-C cable",
        image: "./assets/usb.jpg"
      }
    ]
  },
  {
    id: 3,
    name: "City Bookstore",
    category: "Books",
    location: "Pune",
    rating: 4.6,
    image: "./assets/city-bookstore.jpg",
    products: [
      {
        name: "Atomic Habits",
        price: 349,
        originalPrice: 499,
        discount: 30,
        inStock: true,
        description: "Bestselling book by James Clear",
        image: "./assets/atomic.jpg"
      },
      {
        name: "1984",
        price: 299,
        originalPrice: 399,
        discount: 25,
        inStock: true,
        description: "Classic novel by George Orwell",
        image: "./assets/1984-cover.jpg"
      }
    ]
  }
];

function addToCart(product, shop) {
  if (!product || !shop) {
    console.error("addToCart: Missing product or shop!", { product, shop });
    showNotification("Could not add product to cart. Please try again.", "error");
    return;
  }

  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) cart = [];
  } catch (e) {
    console.error("addToCart: Failed to parse cart from localStorage", e);
    cart = [];
  }

  // Use a unique key (shopId + productName) for cart items
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

  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error("addToCart: Failed to save cart to localStorage", e);
    showNotification("Could not save cart. Storage may be full or blocked.", "error");
    return;
  }

  updateCartBadge(true);
  showCartPopup(product, shop);
  createConfettiBurst();
  console.log("addToCart: Cart after adding:", cart);
}
window.addToCart = addToCart; // Ensure global access for all event handlers
