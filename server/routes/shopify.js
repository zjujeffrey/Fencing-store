import { Router } from "express";
import {
  getShopifyConfig,
  normalizeShopifyProduct,
  shopifyRequest
} from "../lib/shopify.js";

const router = Router();

const productFields = `
  id
  handle
  title
  vendor
  productType
  description
  descriptionHtml
  featuredImage {
    url
    altText
  }
  variants(first: 20) {
    nodes {
      id
      title
      availableForSale
      price {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
    }
  }
`;

router.get("/status", (request, response) => {
  const config = getShopifyConfig();
  response.json({
    configured: config.configured,
    domain: config.domain || null,
    version: config.version
  });
});

router.get("/products", async (request, response) => {
  try {
    const data = await shopifyRequest(
      `
        query Products($first: Int!) {
          products(first: $first) {
            nodes {
              ${productFields}
            }
          }
        }
      `,
      { first: Number(request.query.first || 24) }
    );

    response.json({
      products: data.products.nodes.map(normalizeShopifyProduct)
    });
  } catch (error) {
    response.status(error.status || 500).json({
      error: error.message,
      details: error.details || null
    });
  }
});

router.get("/products/:handle", async (request, response) => {
  try {
    const data = await shopifyRequest(
      `
        query ProductByHandle($handle: String!) {
          product(handle: $handle) {
            ${productFields}
          }
        }
      `,
      { handle: request.params.handle }
    );

    if (!data.product) {
      response.status(404).json({ error: "Product not found" });
      return;
    }

    response.json({ product: normalizeShopifyProduct(data.product) });
  } catch (error) {
    response.status(error.status || 500).json({
      error: error.message,
      details: error.details || null
    });
  }
});

router.post("/cart", async (request, response) => {
  try {
    const lines = request.body.lines || request.body.items || [];
    const data = await shopifyRequest(
      `
        mutation CartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              checkoutUrl
              totalQuantity
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        input: {
          buyerIdentity: request.body.email ? { email: request.body.email } : undefined,
          lines: lines.map((line) => ({
            merchandiseId: line.merchandiseId || line.variantId,
            quantity: line.quantity
          }))
        }
      }
    );
    const result = data.cartCreate;

    if (result.userErrors.length) {
      response.status(400).json({ errors: result.userErrors });
      return;
    }

    response.json({
      cart: result.cart,
      checkoutUrl: result.cart.checkoutUrl
    });
  } catch (error) {
    response.status(error.status || 500).json({
      error: error.message,
      details: error.details || null
    });
  }
});

router.post("/cart/lines", async (request, response) => {
  try {
    const data = await shopifyRequest(
      `
        mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              checkoutUrl
              totalQuantity
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        cartId: request.body.cartId,
        lines: (request.body.lines || []).map((line) => ({
          merchandiseId: line.merchandiseId || line.variantId,
          quantity: line.quantity
        }))
      }
    );
    const result = data.cartLinesAdd;

    if (result.userErrors.length) {
      response.status(400).json({ errors: result.userErrors });
      return;
    }

    response.json({
      cart: result.cart,
      checkoutUrl: result.cart.checkoutUrl
    });
  } catch (error) {
    response.status(error.status || 500).json({
      error: error.message,
      details: error.details || null
    });
  }
});

export default router;
