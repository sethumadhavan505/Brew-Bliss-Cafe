# Brew Bliss Café

A modern, responsive café website showcasing coffee, snacks, and special drinks with a cart and checkout flow.

## Features

- Home page with menu tabs
- Add-to-cart and quantity controls
- Cart summary with live totals
- Order form with validation
- Lightweight backend for saving orders

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Backend

The app now includes a small Express API at:

- `GET /api/health`
- `POST /api/orders`

Orders are saved in `data/orders.json`. Order totals are calculated by the server from its menu prices. Order records are not exposed through a public read endpoint because they contain customer details.
