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

console.log(window.shops)
