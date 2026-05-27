# BladeCraft Fencing Store

Independent fencing storefront built with React, Tailwind CSS, Express, and Shopify Storefront API.

## Stack

- React + Vite
- Tailwind CSS
- Express API server
- Shopify Storefront API for products, cart, and checkout
- Stripe order prototype kept as fallback/dev experiment

## Local Development

```bash
npm install
cp .env.example .env
npm run build
npm run dev
```

Open:

```text
http://127.0.0.1:4174
```

## Shopify Environment

Set these in `.env` locally and in your production host:

```env
SHOPIFY_STORE_DOMAIN=pf2r62-r8.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2026-01
```

Do not commit `.env`.

## Useful URLs

```text
/shop
/product?slug=sample-coconut-bar-soap
/club
/order
/admin
/api/shopify/status
/api/shopify/products
```

## Deployment

Recommended host: Render Web Service.

Build command:

```bash
npm install && npm run build
```

Start command:

```bash
npm start
```
