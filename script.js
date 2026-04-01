const productsContainer = document.getElementById("products");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortPriceSelect = document.getElementById("sortPrice");
const themeToggle = document.getElementById("themeToggle");

let allProducts = [];
let filteredProducts = [];

// 🔄 Fetch API (NEW API)
async function fetchProducts() {
  showLoader(true);

  try {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    allProducts = data.products;
    filteredProducts = data.products;

    populateCategories();
    renderProducts(filteredProducts);

  } catch (err) {
    loader.innerText = "Failed to load data";
  }

  showLoader(false);
}

// 🧱 Render Products
function renderProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = "<h2>No products found</h2>";
    return;
  }

  products.map(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" />
      <h4>${product.title}</h4>
      <p>₹ ${product.price}</p>
      <p>${product.category}</p>
      <button onclick="toggleFav(${product.id})">❤️ Favorite</button>
    `;

    productsContainer.appendChild(card);
  });
}

// 🔍 Debounce Search
function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

const handleSearch = debounce((value) => {
  applyAll();
}, 400);

searchInput.addEventListener("input", (e) => {
  handleSearch(e.target.value);
});

// 🎯 Populate Categories
function populateCategories() {
  const categories = ["all", ...new Set(allProducts.map(p => p.category))];

  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// 🎯 Filter + Sort + Search
function applyAll() {
  let temp = [...allProducts];

  // search
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    temp = temp.filter(p =>
      p.title.toLowerCase().includes(searchValue)
    );
  }

  // filter
  if (categoryFilter.value !== "all") {
    temp = temp.filter(p => p.category === categoryFilter.value);
  }

  // sort
  if (sortPriceSelect.value === "low") {
    temp.sort((a, b) => a.price - b.price);
  } else if (sortPriceSelect.value === "high") {
    temp.sort((a, b) => b.price - a.price);
  }

  filteredProducts = temp;
  renderProducts(filteredProducts);
}

categoryFilter.addEventListener("change", applyAll);
sortPriceSelect.addEventListener("change", applyAll);

// ❤️ Favorites
function toggleFav(id) {
  let favs = JSON.parse(localStorage.getItem("favs")) || [];

  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
  } else {
    favs.push(id);
  }

  localStorage.setItem("favs", JSON.stringify(favs));
  alert("Updated Favorites");
}

// 🌙 Dark Mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.className);
});

// Load Theme
window.onload = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.className = savedTheme;
  }
};

// Loader
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

// Start
fetchProducts();