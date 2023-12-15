// Function to toggle the cart panel
function toggleCart() {
  const cartPanel = document.querySelector(".cart-panel");
  cartPanel.classList.toggle("active");

  // Calculate total price when opening the cart
  calculateTotal();
}
// Function to load products and display them
async function loadProducts() {
  try {
    const productsContainer = document.querySelector(".products");

    const response = await fetch("http://localhost:3000/coffee");
    const products = await response.json();

    console.log("Output: ", products);

    products.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("product");
      productItem.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="product-title">${product.title}</div>
        <div class="product-price">$${product.price}</div>
        <div class="product-quantity">In Storage: ${product.quantityInStorage}</div>
        <button onclick="addToCart(${product.id}, '${product.title}', ${product.price})">Add to Cart</button>
      `;
      productsContainer.appendChild(productItem);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Function to add product to cart
function addToCart(productId, title, price) {
  // Check if the product is already in the cart
  const cartItems = document.querySelectorAll(".cart-item");
  let found = false;

  cartItems.forEach((item) => {
    if (item.dataset.productId === String(productId)) {
      found = true;
      let quantity = parseInt(item.dataset.quantity) + 1;
      item.innerHTML = `${quantity}x ${title} - $${price * quantity}`;
      item.dataset.quantity = quantity;
    }
  });

  if (!found) {
    // Create an object representing the product
    const product = { id: productId, title: title, price: price, quantity: 1 };

    // Add the item to the cart panel
    const cartContent = document.querySelector(".cart-content");
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.dataset.productId = String(productId);
    cartItem.dataset.quantity = "1";
    cartItem.innerHTML = `1x ${title} - $${price}`;
    cartContent.appendChild(cartItem);
  }

  // Calculate total price whenever an item is added
  calculateTotal();
}

// Function to calculate the total price of all items in the cart
function calculateTotal() {
  const cartItems = document.querySelectorAll(".cart-item");
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const itemPrice = parseFloat(item.innerHTML.split("$")[1]); // Extract item price
    totalPrice += itemPrice;
  });

  const cartPanel = document.querySelector(".cart-panel");
  const totalElement = document.createElement("div");
  totalElement.classList.add("total");
  totalElement.innerHTML = `<strong>Total Price:</strong> $${totalPrice.toFixed(
    2
  )}`;

  // Remove previous total price element before appending a new one
  const existingTotal = document.querySelector(".total");
  if (existingTotal) {
    cartPanel.removeChild(existingTotal);
  }

  cartPanel.appendChild(totalElement);
}

// Function to clear the cart (remove all items)
function clearCart() {
  const cartContent = document.querySelector(".cart-content");
  cartContent.innerHTML = ""; // Clear all cart items

  // Clear total price when cart is cleared
  const cartPanel = document.querySelector(".cart-panel");
  const existingTotal = document.querySelector(".total");
  if (existingTotal) {
    cartPanel.removeChild(existingTotal);
  }
}

// Function to authenticate user credentials
function authenticate(username, password) {
  return fetch("http://localhost:3000/credential")
    .then((response) => response.json())
    .then((credentials) => {
      const foundUser = credentials.find(
        (cred) => cred.username === username && cred.password === password
      );
      return foundUser ? true : false;
    })
    .catch((error) => {
      console.error("Error fetching credentials:", error);
      return false;
    });
}

// Function to handle login form submission
function login(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  authenticate(username, password).then((isAuthenticated) => {
    if (isAuthenticated) {
      // Store authentication status in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      window.location.href = "index.html"; // Redirect to main page on successful login
    } else {
      alert("Invalid credentials. Please try again.");
    }
  });
}
// Function to log out (clears authentication status and redirects to login page)
function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

// Function to check if user is logged in
function checkLogin() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  if (!isLoggedIn || isLoggedIn !== "true") {
    window.location.href = "login.html"; // Redirect to login page if not logged in
  }
}
// Function to generate a random unique string to serve as purchase code
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
// Function to confirm purchase
function confirmPurchase() {
  const isLoggedIn = localStorage.getItem("loggedIn");
  const storedUsername = localStorage.getItem("username");
  if (!isLoggedIn || isLoggedIn !== "true" || !storedUsername) {
    alert("Please login to confirm your purchase.");
    return;
  }
  calculateTotal(); // Calculate the total price

  const cartPanel = document.querySelector(".cart-panel");
  const totalElement = document.querySelector(".total");
  let totalPrice = 0;

  if (totalElement) {
    totalPrice = parseFloat(totalElement.textContent.split("$")[1]); // Get the total price from the UI
  }

  const cartItems = document.querySelectorAll(".cart-item");
  const purchaseDetails = [];
  const purchaseCode = generateRandomString(10);
  cartItems.forEach((item) => {
    const productId = item.dataset.productId;
    const quantity = parseInt(item.dataset.quantity);
    const title = item.innerHTML.split("x")[1].trim().split("-")[0].trim();
    const price = parseFloat(item.innerHTML.split("$")[1]);
    purchaseDetails.push({ productId, title, quantity, price });
  });

  const purchaseData = {
    username: storedUsername,
    purchaseCode: purchaseCode,
    items: purchaseDetails,
    totalPrice: totalPrice,
  };

  sendPurchaseDataToServer(purchaseData);
}

// Function to send purchase data to server using RESTful API
function sendPurchaseDataToServer(data) {
  fetch("http://localhost:3000/purchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Purchase confirmed:", result);
      var purchaseCode = data.purchaseCode; // Retrieve purchaseCode from data object using 'var'
      alert(
        `Purchase confirmed! Your purchase code is: ${purchaseCode}\nThank you for shopping with us.`
      );
      clearCart(); // Clear the cart after purchase confirmation
    })
    .catch((error) => {
      console.error("Error confirming purchase:", error);
      alert("There was an error confirming your purchase. Please try again.");
    });
}
// Check login status when loading the main page
if (
  window.location.pathname === "/index.html" ||
  window.location.pathname === "/"
) {
  checkLogin();
}

// Call the function to load products when the page loads
loadProducts();
