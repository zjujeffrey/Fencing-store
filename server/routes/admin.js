import { Router } from "express";
import { listOrders, updateOrder } from "../lib/orderStore.js";

const router = Router();

router.get("/orders", async (request, response) => {
  response.json({ orders: await listOrders() });
});

router.patch("/orders/:orderNumber/fulfillment", async (request, response) => {
  const updated = await updateOrder(request.params.orderNumber, {
    fulfillmentStatus: request.body.fulfillmentStatus || "fulfilled",
    trackingNumber: request.body.trackingNumber || null
  });

  if (!updated) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.json({ order: updated });
});

export default router;
