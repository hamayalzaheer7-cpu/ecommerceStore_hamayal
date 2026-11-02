// Get saved products
var product = JSON.parse(localStorage.getItem("product")) || [
  {
    id: 1,
    name: "Shoes",
    price: 2500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  },
  {
    id: 2,
    name: "Bag",
    price: 1800,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
  },
  {
    id: 3,
    name: "Watch",
    price: 3000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
  },
];

// Save default products
localStorage.setItem("product", JSON.stringify(product));

var cart = JSON.parse(localStorage.getItem("cart")) || [];
var username = localStorage.getItem("username") || "";

// Customer login
function setName() {
  username = document.getElementById("username").value.trim();

  if (username == "") {
    alert("Enter your name!");
    return;
  }

  localStorage.setItem("username", username);
  showName();
}

// Show customer name
function showName() {
  if (username != "") {
    document.getElementById("welcome").innerHTML = "Welcome " + username + "!";
    document.getElementById("username").value = username;
  }
}

// Display products
function showproducts() {
  product = JSON.parse(localStorage.getItem("product")) || [];

  var html = "";

  product.forEach(function (p) {
    html += `
            <div class="card">
                <img src="${p.image}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>Rs. ${p.price}</p>
                <button onclick="addCart(${p.id})">Add to Cart</button>
            </div>
        `;
  });

  document.getElementById("product").innerHTML =
    html || "No product available!";
}

// Add to cart
function addCart(id) {
  var item = cart.find(function (p) {
    return p.id == id;
  });

  if (item) {
    item.qty++;
  } else {
    var itemProduct = product.find(function (p) {
      return p.id == id;
    });

    if (!itemProduct) return;

    cart.push({
      ...itemProduct,
      qty: 1,
    });
  }

  saveCart();
}

// Change quantity
function changeQty(id, amount) {
  var item = cart.find(function (p) {
    return p.id == id;
  });

  if (!item) return;

  item.qty = item.qty + amount;

  if (item.qty <= 0) {
    cart = cart.filter(function (p) {
      return p.id != id;
    });
  }

  saveCart();
}

// Remove cart item
function removeItem(id) {
  cart = cart.filter(function (p) {
    return p.id != id;
  });

  saveCart();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  showCart();
}

// Display cart
function showCart() {
  var html = "";
  var total = 0;

  cart.forEach(function (p) {
    total += p.price * p.qty;

    html += `
            <p>
                ${p.name} - Rs. ${p.price}
                <button onclick="changeQty(${p.id}, -1)">-</button>
                ${p.qty}
                <button onclick="changeQty(${p.id}, 1)">+</button>
                <button onclick="removeItem(${p.id})">Remove</button>
            </p>
        `;
  });

  document.getElementById("cart").innerHTML = html || "Your cart is empty!";
  document.getElementById("total").innerHTML = "Total: Rs. " + total;
}

// Checkout
function checkout() {
  if (username == "") {
    alert("Please enter your name first!");
    return;
  }

  if (cart.length == 0) {
    alert("Your cart is empty!");
    return;
  }

  var orders = JSON.parse(localStorage.getItem("orders")) || [];
  var total = 0;

  cart.forEach(function (p) {
    total += p.price * p.qty;
  });

  orders.push({
    customer: username,
    items: cart,
    total: total,
  });

  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Order placed successfully!");

  cart = [];
  saveCart();
}

// Load saved data
showName();
showproducts();
showCart();
