// Function to authenticate admin credentials
function authenticateAdmin(username, password) {
  return fetch("http://localhost:3000/adminCredential")
    .then((response) => response.json())
    .then((credentials) => {
      const foundAdmin = credentials.find(
        (cred) => cred.username === username && cred.password === password
      );
      return foundAdmin ? true : false;
    })
    .catch((error) => {
      console.error("Error fetching admin credentials:", error);
      return false;
    });
}

// Function to handle admin login form submission
function adminLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  authenticateAdmin(username, password).then((isAuthenticated) => {
    if (isAuthenticated) {
      // Store authentication status in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      window.location.href = "adminPage.html"; // Redirect to admin page on successful login
    } else {
      alert("Invalid admin credentials. Please try again.");
    }
  });
}

// Function to log out admin (clears authentication status and redirects to admin login page)
function adminLogout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "adminLogin.html";
}

// Function to check if admin is logged in
function checkAdminLogin() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "adminLogin.html"; // Redirect to admin login page if not logged in
  } else {
    loadProducts(); // Load products if admin is logged in
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

// Fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/coffee");
    const products = await response.json();
    populateProductSelect(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Populate the product select dropdown with fetched products
function populateProductSelect(products) {
  const productSelect = document.getElementById("productSelect");

  products.forEach((product) => {
    const option = document.createElement("option");
    option.value = product._id;
    option.textContent = product.title;
    productSelect.appendChild(option);
  });
}

// Function to update the quantity of selected product
async function updateQuantity() {
  const selectedProductId = document.getElementById("productSelect").value;
  const quantity = parseInt(document.getElementById("quantityInput").value);

  if (!isNaN(quantity)) {
    try {
      const response = await fetch(
        `http://localhost:3000/coffee/${selectedProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantityInStorage: quantity }),
        }
      );

      if (response.ok) {
        alert("Quantity updated successfully!");
      } else {
        alert("Quantity updated.");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error updating quantity.");
    }
  } else {
    alert("Please enter a valid quantity!");
  }
}

// Check if admin is logged in and load products on page load
window.onload = function () {
  checkAdminLogin();
};
