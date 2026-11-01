import { showToast } from './toast.js';

export function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('cart'));
    if (!Array.isArray(cart)) return [];

    return cart.map((item) => ({
      name: item?.name || 'Item',
      price: Number(item?.price) || 0,
      quantity: Math.max(1, Number(item?.quantity) || 1)
    }));
  } catch (error) {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function updateCartBadge() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = String(getCartItemCount());
  }
}

export function addToCart(item) {
  const cart = getCart();
  const existingItem = cart.find(
    (entry) => entry.name.toLowerCase() === item.name.toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity = (Number(existingItem.quantity) || 1) + 1;
  } else {
    cart.push({
      name: item.name,
      price: Number(item.price) || 0,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartBadge();
  showToast(`✓ ${item.name} added to your cart!`);
}

export function changeCartItemQuantity(name, delta) {
  const cart = getCart();
  const itemIndex = cart.findIndex(
    (entry) => entry.name.toLowerCase() === name.toLowerCase()
  );

  if (itemIndex === -1) return;

  cart[itemIndex].quantity = Math.max(0, (Number(cart[itemIndex].quantity) || 1) + delta);

  if (cart[itemIndex].quantity === 0) {
    cart.splice(itemIndex, 1);
  }

  saveCart(cart);
  updateCartBadge();

  const cartItemsDiv = document.getElementById('cartItems');
  if (cartItemsDiv && typeof window.renderCart === 'function') {
    window.renderCart();
  }
}

export function clearCart() {
  saveCart([]);
  updateCartBadge();

  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const message = document.getElementById('checkoutMessage');
  const cartCount = document.getElementById('cartCount');

  if (cartItems) {
    cartItems.innerHTML = '';
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'Your cart is empty. Add some coffee! ☕';
    cartItems.appendChild(emptyMessage);
  }

  if (cartTotal) {
    cartTotal.textContent = '₹0';
  }

  if (message) {
    message.textContent = 'Your cart has been cleared!';
    message.style.color = '#4b2e2e';
  }

  if (cartCount) {
    cartCount.textContent = '0';
  }
}

export function proceedToCheckout() {
  const cart = getCart();
  const message = document.getElementById('checkoutMessage');

  if (cart.length === 0) {
    if (message) {
      message.textContent = '☕ Your cart is empty! Please add a product before checkout.';
    }
    return;
  }

  window.location.href = 'order.html';
}
