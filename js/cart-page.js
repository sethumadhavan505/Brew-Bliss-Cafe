import { getCart, clearCart, proceedToCheckout } from './cart.js';

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
        total += price;
        return `<p>${item.name} - ₹${price}</p>`;
      })
      .join('');
  }

  if (cartTotal) {
    cartTotal.textContent = `₹${total}`;
  }
}

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
