// ✅ Initialize LocalStorage
if (!localStorage.getItem("wishlist")) {
  localStorage.setItem("wishlist", JSON.stringify([]));
}
if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}

// ✅ Product Data
const productData = {
  "Glowing Face Cream": 399,
  "Matte Lipstick": 299,
  "Herbal Face Wash": 199,
  "Waterproof Kajal": 150,
  "Birthday Chocolate Box": 499,
  "Wedding Special Chocolates": 699,
  "Anniversary Choco Gift": 599
};

// ✅ Add to Cart
function addToCart(productName) {
  if (!productData[productName]) {
    alert("❌ Invalid product.");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const exists = cart.find(item => item.name === productName);
  if (exists) {
    alert(`${productName} is already in cart.`);
    return;
  }

  cart.push({ name: productName, price: productData[productName] });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${productName} added to cart! 🛒`);
  triggerConfetti();
}

// ✅ Add to Wishlist
function addToWishlist(productName) {
  if (!productData[productName]) {
    alert("❌ Invalid product.");
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  if (!wishlist.includes(productName)) {
    wishlist.push(productName);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${productName} added to wishlist! 💖`);
    triggerHeart();
  } else {
    alert(`${productName} is already in wishlist.`);
  }
}

// ✅ Remove from Wishlist
function removeFromWishlist(productName) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  wishlist = wishlist.filter(name => name !== productName);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  alert(`${productName} removed from wishlist.`);
  location.reload();
}

// ✅ Move from Wishlist to Cart
function moveToCart(productName) {
  addToCart(productName);
  removeFromWishlist(productName);
}

// ✅ Display Wishlist
function displayWishlist() {
  const wishlistDiv = document.getElementById("wishlistItems");
  const wishlist = JSON.parse(localStorage.getItem("wishlist"));
  wishlistDiv.innerHTML = "";

  if (wishlist.length === 0) {
    wishlistDiv.innerHTML = "<p>No items in wishlist yet.</p>";
    return;
  }

  wishlist.forEach(name => {
    const price = productData[name] || 500;
    const item = document.createElement("div");
    item.className = "product-card";
    item.innerHTML = `
      <h3>${name}</h3>
      <p>Price: ₹${price}</p>
      <button onclick="removeFromWishlist('${name}')">Remove</button>
      <button onclick="moveToCart('${name}')">Move to Cart</button>
    `;
    wishlistDiv.appendChild(item);
  });
}

// ✅ Display Cart Review (for thankyou.html)
function displayCartReview() {
  const cartItemsContainer = document.getElementById('cartItems');
  const totalCostContainer = document.getElementById('totalCost');
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>No items in cart.</p>";
    totalCostContainer.innerText = "Total: ₹0";
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
      <h3>${item.name}</h3>
      <p>Price: ₹${item.price}</p>
      <button onclick="removeCartItem(${index})">❌ Remove</button>
    `;
    cartItemsContainer.appendChild(div);
    total += item.price;
  });

  totalCostContainer.innerText = `Total: ₹${total}`;
}

// ✅ Remove from Cart
function removeCartItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartReview();
}

// ✅ Handle Payment Form Submission
function submitOrder(event) {
  event.preventDefault();
  const selectedPayment = document.querySelector('input[name="paymentMode"]:checked');
  if (!selectedPayment) {
    alert("Please select a payment method.");
    return;
  }

  const paymentMode = selectedPayment.value;
  const confirmationSection = document.getElementById("confirmationMessage");
  confirmationSection.classList.remove("hidden");

  // Clear cart after order
  localStorage.setItem("cart", JSON.stringify([]));
  document.querySelector(".cart-review").style.display = "none";
}

// ✅ Login Welcome
function loginUser() {
  const username = document.getElementById("username").value;
  const userType = document.getElementById("userType").value;

  if (username.trim() === "") {
    alert("Please enter your name.");
    return;
  }

  document.getElementById("welcomeMessage").innerText = `Welcome, ${username}! You are logged in as a ${userType}.`;
}

// ✅ Confetti Animation
function triggerConfetti() {
  for (let i = 0; i < 20; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.innerText = "🎉";
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.animationDuration = `${0.8 + Math.random()}s`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1500);
  }
}

// ✅ Heart Animation
function triggerHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.innerText = "💖";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1000);
}

// ✅ Auto Run Based on Page
document.addEventListener("DOMContentLoaded", function () {
  if (document.body.classList.contains("wishlist-page")) {
    displayWishlist();
  }
  if (document.body.classList.contains("thankyou-page")) {
    displayCartReview();
    document.getElementById("orderForm")?.addEventListener("submit", submitOrder);
  }
});
