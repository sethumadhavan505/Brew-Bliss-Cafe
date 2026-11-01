const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const MENU_ITEMS = new Map([
  ['espresso', { name: 'Espresso', price: 120 }],
  ['cappuccino', { name: 'Cappuccino', price: 150 }],
  ['latte', { name: 'Latte', price: 160 }],
  ['chocolate muffin', { name: 'Chocolate Muffin', price: 80 }],
  ['cheese croissant', { name: 'Cheese Croissant', price: 100 }],
  ['caramel frappe', { name: 'Caramel Frappe', price: 200 }],
  ['mocha delight', { name: 'Mocha Delight', price: 180 }]
]);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]', 'utf8');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Brew Bliss Café API is running.' });
});

app.post('/api/orders', (req, res) => {
  try {
    const { name, address, phone, items } = req.body || {};
    const customerName = typeof name === 'string' ? name.trim() : '';
    const customerAddress = typeof address === 'string' ? address.trim() : '';
    const customerPhone = typeof phone === 'string' ? phone.trim() : '';

    if (!customerName || !customerAddress || !/^\d{10}$/.test(customerPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, and a valid 10-digit phone number are required.'
      });
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > MENU_ITEMS.size) {
      return res.status(400).json({
        success: false,
        message: 'Cart must contain valid menu items.'
      });
    }

    const orderItems = [];
    for (const item of items) {
      const productName = typeof item?.name === 'string' ? item.name.trim().toLowerCase() : '';
      const product = MENU_ITEMS.get(productName);
      const quantity = Number(item?.quantity);

      if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({
          success: false,
          message: 'Cart contains an invalid menu item or quantity.'
        });
      }

      orderItems.push({ ...product, quantity });
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(raw);

    const order = {
      id: `BB-${Date.now()}`,
      name: customerName,
      address: customerAddress,
      phone: customerPhone,
      items: orderItems,
      total,
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf8');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully.',
      orderId: order.id,
      total: order.total
    });
  } catch (error) {
    console.error('Order save error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to save order. Please try again.'
    });
  }
});

app.use(express.static(__dirname));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`Brew Bliss Café server running at http://localhost:${PORT}`);
});
