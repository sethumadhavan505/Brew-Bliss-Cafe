import { getCart } from './cart.js';

const orderForm = document.getElementById('orderForm');

if (orderForm) {
  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cart = getCart();
    const orderMessage = document.getElementById('orderMessage');
    const customerName = document.getElementById('customerName')?.value.trim();
    const customerAddress = document.getElementById('customerAddress')?.value.trim();
    const customerPhone = document.getElementById('customerPhone')?.value.trim();

    if (cart.length === 0) {
      if (orderMessage) {
        orderMessage.textContent = 'Your cart is empty! Please add items before placing an order. ☕';
      }
      return;
    }

    if (!customerName || !customerAddress || !customerPhone) {
      if (orderMessage) {
        orderMessage.textContent = 'Please complete all fields before placing your order.';
      }
      return;
    }

    const submitButton = orderForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
    }

    if (orderMessage) {
      orderMessage.textContent = 'Submitting your order...';
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          address: customerAddress,
          phone: customerPhone,
          items: cart
        })
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to save your order. Please try again.');
      }

      if (orderMessage) {
        orderMessage.textContent = `Thank you, ${customerName}! Order ${result.orderId} has been saved. Total: ₹${result.total}`;
      }

      localStorage.removeItem('cart');
      orderForm.reset();

      const cartCount = document.getElementById('cartCount');
      if (cartCount) {
        cartCount.textContent = '0';
      }
    } catch (error) {
      if (orderMessage) {
        orderMessage.textContent = error.message || 'Unable to save your order. Please try again.';
      }
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
