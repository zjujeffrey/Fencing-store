# Shopify Storefront Setup

This project can use Shopify as the product, cart, checkout, order, and payment backend while keeping the custom React + Tailwind storefront.

## 1. Create Test Products

In Shopify Admin, create several products for testing:

- Mask
- Weapon
- Starter Kit
- Jacket
- Bag
- Wireless scoring set

Add prices, images, variants, and inventory.

## 2. Create Storefront API Access

In Shopify Admin:

1. Go to **Settings > Apps and sales channels**
2. Open **Develop apps**
3. Create or open a custom app
4. Enable **Storefront API access**
5. Allow product and cart/checkout related Storefront API permissions
6. Copy the Storefront API access token

Make sure products are published to the channel that Storefront API can access.

## 3. Configure `.env`

Copy `.env.example` to `.env` and fill:

```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
SHOPIFY_API_VERSION=2026-01
```

Do not commit `.env`.

## 4. Verify Connection

Start the app:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:4174/api/shopify/status
http://127.0.0.1:4174/api/shopify/products
```

If configured correctly, `/api/shopify/products` returns Shopify products.

## Official Reference

- https://shopify.dev/docs/api/storefront
- https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api
