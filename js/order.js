import { getCart } from './cart.js';

const orderForm = document.getElementById('orderForm');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
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

    const total = cart.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return sum + (price * quantity);
    }, 0);

    if (orderMessage) {
      orderMessage.textContent = `✅ Thank you, ${customerName}! Your order has been placed. Total: ₹${total}`;
    }

    localStorage.removeItem('cart');
    orderForm.reset();

    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      cartCount.textContent = '0';
    }
  });
}
