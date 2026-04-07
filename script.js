const productBox = document.getElementById("products");
const loader = document.getElementById("loader");

const search = document.getElementById("searchInput");
const category = document.getElementById("categoryFilter");
const sort = document.getElementById("sortPrice");
const themeBtn = document.getElementById("themeToggle");
const count = document.getElementById("count");

let allProducts = [];

// API
async function fetchProducts() {
  showLoader(true);

  try {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();

    allProducts = data.products;

    setCategories();
    applyAll(); // show data after fetch

  } catch (err) {
    loader.innerText = "Failed to load data";
  }

  showLoader(false);
}

// show products
function renderProducts(products) {
  productBox.innerHTML = "";

  // show count
  if (count) {
    count.innerText = products.length + " products found";
  }

  // if no products
  if (products.length === 0) {
    productBox.innerHTML = "<h2>No products found</h2>";
    return;
  }

  // loop products
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.thumbnail}" />
      <h4>${product.title}</h4>
      <p>₹ ${product.price}</p>
      <p>${product.category}</p>
      <button class="fav-btn" onclick="toggleFav(${product.id})">❤️</button>
    `;

    productBox.appendChild(card);
  });
}

// set categories
function setCategories() {
  const cats = ["all", ...new Set(allProducts.map(p => p.category))];

  category.innerHTML = cats
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");
}

// debounce 
function debounce(fn, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

// search + filter + sort
function applyAll() {
  let temp = [...allProducts];

  // search
  let val = search.value.toLowerCase();
  if (val) {
    temp = temp.filter(p => p.title.toLowerCase().includes(val));
  }

  // filter
  if (category.value !== "all") {
    temp = temp.filter(p => p.category === category.value);
  }

  // sort
  if (sort.value === "low") {
    temp.sort((a, b) => a.price - b.price);
  } else if (sort.value === "high") {
    temp.sort((a, b) => b.price - a.price);
  }

  renderProducts(temp);
}

// events
search.addEventListener("input", debounce(applyAll, 400));
category.addEventListener("change", applyAll);
sort.addEventListener("change", applyAll);

// favorite logic 
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

// dark mode 
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.className);
});

// load saved theme
window.onload = () => {
  const t = localStorage.getItem("theme");
  if (t) {
    document.body.className = t;
  }
};

// loader
function showLoader(show) {
  loader.style.display = show ? "block" : "none";
}

// start
fetchProducts();