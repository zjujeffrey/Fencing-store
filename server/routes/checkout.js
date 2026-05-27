import { Router } from "express";
import Stripe from "stripe";
import { getProductById } from "../data/products.js";
import {
  createOrder,
  createOrderNumber,
  findOrderByNumber,
  updateOrder
} from "../lib/orderStore.js";

const router = Router();

function getBaseUrl(request) {
  return process.env.BASE_URL || `${request.protocol}://${request.get("host")}`;
}

function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("replace_me")) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function buildOrderItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  return cartItems.map((item) => {
    const product = getProductById(item.productId);
    if (!product) {
      throw new Error(`Unknown product: ${item.productId}`);
    }

    const quantity = Number.parseInt(item.quantity, 10);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 25) {
      throw new Error(`Invalid quantity for ${product.title}`);
    }

    const variant =
      product.variants.find((candidate) => candidate.id === item.variantId) || product.variants[0];

    return {
      productId: product.id,
      variantId: variant.id,
      title: product.title,
      variantName: variant.name,
      quantity,
      unitPriceCents: product.priceCents,
      currency: product.currency,
      imageUrl: product.imageUrl
    };
  });
}

router.post("/", async (request, response) => {
  try {
    const stripe = createStripeClient();
    const email = request.body.email || "guest@example.com";
    const items = buildOrderItems(request.body.items);
    const subtotalCents = items.reduce(
      (total, item) => total + item.unitPriceCents * item.quantity,
      0
    );
    const shippingCents = subtotalCents >= 14900 ? 0 : 1200;
    const taxCents = 0;
    const totalCents = subtotalCents + shippingCents + taxCents;
    const orderNumber = createOrderNumber();
    const baseUrl = getBaseUrl(request);

    const order = await createOrder({
      orderNumber,
      email,
      status: "pending",
      fulfillmentStatus: "unfulfilled",
      items,
      subtotalCents,
      shippingCents,
      taxCents,
      totalCents,
      currency: "usd",
      stripeSessionId: null,
      stripePaymentIntentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (!stripe) {
      response.status(501).json({
        error: "Stripe is not configured",
        message:
          "Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to .env, then restart the server.",
        order
      });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: item.currency,
          unit_amount: item.unitPriceCents,
          product_data: {
            name: `${item.title} - ${item.variantName}`,
            images: [`${baseUrl}${item.imageUrl}`]
          }
        }
      })),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingCents, currency: "usd" },
            display_name: shippingCents === 0 ? "Free shipping" : "Standard shipping"
          }
        }
      ],
      metadata: {
        orderNumber
      },
      success_url: `${baseUrl}/success.html?order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${baseUrl}/shop.html?canceled=${encodeURIComponent(orderNumber)}`
    });

    order.stripeSessionId = session.id;
    await updateOrder(orderNumber, { stripeSessionId: session.id });

    response.json({
      orderNumber,
      checkoutUrl: session.url
    });
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.get("/orders/:orderNumber", async (request, response) => {
  const order = await findOrderByNumber(request.params.orderNumber);

  if (!order) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.json({ order });
});

export default router;
