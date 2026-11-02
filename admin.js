// Get saved product and orders
var product = JSON.parse(localStorage.getItem("product")) || [];
var orders = JSON.parse(localStorage.getItem("orders")) || [];
var image = "";

// Admin login
function login() {
  var password = document.getElementById("password").value;

  if (password == "admin123") {
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    showproduct();
    showOrders();
    showStats();
  } else {
    alert("Wrong Password!");
  }
}

// Upload and preview image
function previewImage() {
  var file = document.getElementById("image").files[0];

  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image!");
      return;
    }

    if (file.size > 500000) {
      alert("Please select an image smaller than 500 KB!");
      document.getElementById("image").value = "";
      return;
    }

    var reader = new FileReader();

    reader.onload = function () {
      image = reader.result;
      document.getElementById("preview").src = image;
      document.getElementById("preview").style.display = "inline";
    };

    reader.readAsDataURL(file);
  }
}

// Add a new product
function addProduct() {
  var name = document.getElementById("pname").value.trim();
  var price = Number(document.getElementById("price").value);

  if (name == "" || price <= 0 || image == "") {
    alert("Enter all product details and picture!");
    return;
  }

  var product = {
    id: Date.now(),
    name: name,
    price: price,
    image: image,
  };

  product.push(product);

  localStorage.setItem("product", JSON.stringify(product));

  alert("Product Added!");

  document.getElementById("pname").value = "";
  document.getElementById("price").value = "";
  document.getElementById("image").value = "";
  document.getElementById("preview").style.display = "none";

  image = "";

  showproduct();
  showStats();
}

// Show all product
function showproduct() {
  product = JSON.parse(localStorage.getItem("product")) || [];

  document.getElementById("productList").innerHTML = product
    .map(function (p) {
      return `
        <div class="admin-card">
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>Rs. ${p.price}</p>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      `;
    })
    .join("") || "No product yet!";
}

// Delete a product
function deleteProduct(id) {
  product = product.filter(function (p) {
    return p.id != id;
  });

  localStorage.setItem("product", JSON.stringify(product));

  showproduct();
  showStats();
}

// Show customer orders
function showOrders() {
  orders = JSON.parse(localStorage.getItem("orders")) || [];

  document.getElementById("orderList").innerHTML = orders
    .map(function (o) {
      return `
        <div class="admin-card">
          <h3>Customer: ${o.customer}</h3>
          <p>${o.items.map(function (p) {
            return p.name + " x " + p.qty;
          }).join(", ")}</p>
          <h3>Rs. ${o.total}</h3>
        </div>
      `;
    })
    .join("") || "No orders yet!";
}

// Update dashboard statistics
function showStats() {
  orders = JSON.parse(localStorage.getItem("orders")) || [];

  document.getElementById("productCount").innerHTML = product.length;
  document.getElementById("orderCount").innerHTML = orders.length;

  var total = orders.reduce(function (sum, o) {
    return sum + o.total;
  }, 0);

  document.getElementById("sales").innerHTML = total;
}