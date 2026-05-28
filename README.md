# BladeCraft Fencing Store

BladeCraft is a custom fencing ecommerce storefront built on Shopify Hydrogen and designed for Shopify Oxygen deployment.

## Stack

- Shopify Hydrogen
- Shopify Oxygen runtime
- React Router
- React
- Tailwind CSS
- Shopify Storefront API

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by the Hydrogen CLI.

## Required Environment

Set these in `.env` locally and in Oxygen environment variables for production:

```env
SESSION_SECRET=replace_with_a_long_random_string
PUBLIC_STORE_DOMAIN=pf2r62-r8.myshopify.com
PUBLIC_CHECKOUT_DOMAIN=pf2r62-r8.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_access_token
PUBLIC_STOREFRONT_API_VERSION=2026-01
```

Never commit `.env`.

## Useful Commands

```bash
npm run dev
npm run build
npm run preview
npm run deploy
```

## Main Pages

- `/`
- `/shop`
- `/club`
- `/products/:handle`
- `/cart`
- `/account`

## Deployment

This repository is configured for Shopify Hydrogen/Oxygen.

```bash
npm run build
npm run deploy
```

If the Shopify CLI asks you to log in or connect a store, follow the browser prompt and choose the Shopify store that owns the Hydrogen storefront.
