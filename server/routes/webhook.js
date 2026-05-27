import { Router } from "express";
import Stripe from "stripe";
import { findOrderByStripeSession, updateOrder } from "../lib/orderStore.js";

const router = Router();

function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes("replace_me")) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

router.post("/", async (request, response) => {
  const stripe = createStripeClient();

  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    response.status(501).send("Stripe webhook is not configured");
    return;
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      request.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await findOrderByStripeSession(session.id);

    if (order) {
      await updateOrder(order.orderNumber, {
        status: "paid",
        stripePaymentIntentId: session.payment_intent || null,
        paidAt: new Date().toISOString()
      });
    }
  }

  response.json({ received: true });
});

export default router;
