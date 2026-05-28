# Shopify Hydrogen Setup

This project uses Shopify as the product, cart, checkout, customer account, order, and payment backend. The custom storefront is built with Hydrogen and deployed to Oxygen.

## 1. Prepare Shopify Products

In Shopify Admin, create product data for fencing categories:

- Masks
- Weapons
- Jackets
- Gloves
- Bags
- Scoring equipment
- Club starter kits

For each product, add title, description, price, variants, inventory, SEO handle, and images. Publish the products to the storefront channel used by Storefront API.

## 2. Storefront API Access

In Shopify Admin:

1. Go to **Settings > Apps and sales channels**.
2. Open **Develop apps**.
3. Create or open a custom app.
4. Enable **Storefront API access**.
5. Allow product, cart, checkout, and customer account related Storefront API permissions.
6. Copy the Storefront API access token.

## 3. Configure Local Environment

Create `.env` in the project root:

```env
SESSION_SECRET=replace_with_a_long_random_string
PUBLIC_STORE_DOMAIN=pf2r62-r8.myshopify.com
PUBLIC_CHECKOUT_DOMAIN=pf2r62-r8.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=your_storefront_access_token
PUBLIC_STOREFRONT_API_VERSION=2026-01
```

Do not commit `.env`.

## 4. Verify Locally

```bash
npm install
npm run dev
```

Open the local Hydrogen URL printed by the CLI and check:

- Home page loads products from Shopify.
- `/shop` lists Shopify products.
- Product detail pages load with Shopify handles.
- Cart and checkout open Shopify checkout.

## 5. Deploy to Oxygen

```bash
npm run build
npm run deploy
```

During deployment, the Shopify CLI may ask you to authenticate, choose the Shopify store, and connect or create a Hydrogen storefront.

## Official References

- https://shopify.dev/docs/storefronts/headless/hydrogen
- https://shopify.dev/docs/storefronts/headless/hydrogen/deployments/oxygen
- https://shopify.dev/docs/api/storefront
