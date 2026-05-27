import { Router } from "express";
import { getProductBySlug, products } from "../data/products.js";
import { formatMoney } from "../lib/money.js";

const router = Router();

function serializeProduct(product) {
  return {
    ...product,
    price: formatMoney(product.priceCents, product.currency)
  };
}

router.get("/", (request, response) => {
  response.json({ products: products.map(serializeProduct) });
});

router.get("/:slug", (request, response) => {
  const product = getProductBySlug(request.params.slug);

  if (!product) {
    response.status(404).json({ error: "Product not found" });
    return;
  }

  response.json({ product: serializeProduct(product) });
});

export default router;
