import { getCart, clearCart, proceedToCheckout, changeCartItemQuantity } from './cart.js';

function renderCart() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const cart = getCart();

  if (!cartItemsDiv) {
    return;
  }

  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.textContent = 'Your cart is empty. Add some coffee! ☕';
  } else {
    cartItemsDiv.innerHTML = cart
      .map((item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const itemTotal = price * quantity;
        total += itemTotal;

        return `
          <div class="cart-item">
            <div class="cart-item-meta">
              <span>${item.name}</span>
              <small>₹${price} each</small>
            </div>

            <div class="qty-controls">
              <button class="qty-btn" data-action="decrease" data-name="${item.name}" type="button">−</button>
              <span class="qty-value">${quantity}</span>
              <button class="qty-btn" data-action="increase" data-name="${item.name}" type="button">+</button>
            </div>

            <strong>₹${itemTotal}</strong>
          </div>
        `;
      })
      .join('');

    const qtyButtons = cartItemsDiv.querySelectorAll('.qty-btn');
    qtyButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const { action, name } = button.dataset;
        if (action === 'increase') {
          changeCartItemQuantity(name, 1);
        } else if (action === 'decrease') {
          changeCartItemQuantity(name, -1);
        }
      });
    });
  }

  if (cartTotal) {
    cartTotal.textContent = `₹${total}`;
  }
}

window.renderCart = renderCart;

const checkoutBtn = document.getElementById('checkoutBtn');
const clearBtn = document.getElementById('clearCartBtn');

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', proceedToCheckout);
}

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    clearCart();
    renderCart();
  });
}

renderCart();
