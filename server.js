const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

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

app.get('/api/orders', (req, res) => {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(raw);
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to read orders.' });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { name, address, phone, items, total } = req.body || {};

    if (!name || !address || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, address, and phone are required.'
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart cannot be empty.'
      });
    }

    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    const orders = JSON.parse(raw);

    const order = {
      id: `BB-${Date.now()}`,
      name: String(name).trim(),
      address: String(address).trim(),
      phone: String(phone).trim(),
      items,
      total: Number(total) || 0,
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
