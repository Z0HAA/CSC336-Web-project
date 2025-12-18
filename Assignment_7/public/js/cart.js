// Shopping Cart Functionality

// Get cart from session storage
function getCart() {
  const cart = sessionStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

// Save cart to session storage
function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

// Add item to cart
function addToCart(id, name, price, image) {
  let cart = getCart();
  
  // Check if item already in cart
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, image, quantity: 1 });
  }
  
  saveCart(cart);
  
  // Show success message
  alert(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  displayCart();
}

// Update quantity
function updateQuantity(id, change) {
  let cart = getCart();
  const item = cart.find(item => item.id === id);
  
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
    displayCart();
  }
}

// Display cart items
function displayCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const cartSummary = document.getElementById('cartSummary');
  
  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartItemsContainer.innerHTML = '';
    cartSummary.style.display = 'none';
    return;
  }
  
  emptyCart.style.display = 'none';
  cartSummary.style.display = 'block';
  
  let html = '';
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    html += `
      <div class="col-12">
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h3 class="cart-item-name">${item.name}</h3>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
              <div class="quantity-display">${item.quantity}</div>
              <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
              <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                <i class="bi bi-trash"></i> Remove
              </button>
            </div>
          </div>
          <div style="text-align: right; min-width: 100px;">
            <p style="color: #E8BCB5; font-size: 1.3rem; font-weight: 600; margin: 0;">
              $${itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = html;
  
  // Update summary
  document.getElementById('itemCount').textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('subtotal').textContent = subtotal.toFixed(2);
  document.getElementById('total').textContent = subtotal.toFixed(2);
}

// Update cart badge in navbar
function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Find or create cart badge
  let badge = document.getElementById('cartBadge');
  const cartLink = document.querySelector('a[href="/cart"]');
  
  if (!badge && cartLink) {
    badge = document.createElement('span');
    badge.id = 'cartBadge';
    badge.style.cssText = 'background: #E8BCB5; color: #111; border-radius: 50%; padding: 0.2rem 0.5rem; font-size: 0.75rem; margin-left: 0.3rem; font-weight: 600;';
    cartLink.appendChild(badge);
  }
  
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

// Initialize cart display if on cart page
if (document.getElementById('cartItems')) {
  displayCart();
}

// Update badge on page load
updateCartBadge();