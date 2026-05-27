# Stripe Test Payment Setup

This project uses Stripe Checkout for payment collection and Stripe webhooks for order confirmation.

## 1. Create `.env`

Copy `.env.example` to `.env` and add your Stripe test secret key.

```env
PORT=4174
BASE_URL=http://127.0.0.1:4174
STRIPE_SECRET_KEY=sk_test_replace_me
STRIPE_WEBHOOK_SECRET=whsec_replace_me
```

Do not commit `.env`.

## 2. Log in to Stripe CLI

```bash
npm run stripe:login
```

Follow the browser prompt and confirm the pairing code.

## 3. Start the app

```bash
npm run dev
```

## 4. Start webhook forwarding

Open a second terminal:

```bash
npm run stripe:listen
```

Stripe CLI will print a webhook secret that starts with `whsec_`.
Copy it into `.env` as `STRIPE_WEBHOOK_SECRET`, then restart `npm run dev`.

## 5. Test checkout

Open:

```text
http://127.0.0.1:4174/shop.html
```

Add a product to the bag, click Checkout, and use Stripe test card:

```text
4242 4242 4242 4242
Any future expiry
Any CVC
Any ZIP
```

After payment, Stripe redirects to `success.html`. The webhook updates the order from `pending` to `paid`.

## Official References

- https://docs.stripe.com/stripe-cli
- https://docs.stripe.com/checkout/quickstart
- https://docs.stripe.com/checkout/fulfillment
