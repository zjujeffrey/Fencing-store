const defaultVersion = "2026-01";

export function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || defaultVersion;
  const configured =
    Boolean(domain) &&
    Boolean(token) &&
    !domain.includes("your-store") &&
    !token.includes("your_storefront");

  return {
    configured,
    domain,
    token,
    version,
    endpoint: domain ? `https://${domain}/api/${version}/graphql.json` : null
  };
}

export async function shopifyRequest(query, variables = {}) {
  const config = getShopifyConfig();

  if (!config.configured) {
    const error = new Error("Shopify Storefront API is not configured");
    error.status = 501;
    throw error;
  }

  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": config.token
    },
    body: JSON.stringify({ query, variables })
  });
  const payload = await response.json();

  if (!response.ok || payload.errors) {
    const error = new Error(payload.errors?.[0]?.message || "Shopify request failed");
    error.status = response.status || 502;
    error.details = payload.errors;
    throw error;
  }

  return payload.data;
}

export function normalizeShopifyProduct(node) {
  const firstVariant = node.variants.nodes[0];
  const price = firstVariant?.price;

  return {
    id: node.id,
    slug: node.handle,
    handle: node.handle,
    title: node.title,
    category: node.productType || "gear",
    badge: node.vendor || "Shopify",
    description: node.description || node.descriptionHtml?.replace(/<[^>]+>/g, "") || "",
    details: node.description || "",
    price: price
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: price.currencyCode
        }).format(Number(price.amount))
      : "$0.00",
    priceCents: price ? Math.round(Number(price.amount) * 100) : 0,
    imageUrl: node.featuredImage?.url || "/assets/fencer-mask.jpg",
    variants: node.variants.nodes.map((variant) => ({
      id: variant.id,
      name: variant.title,
      availableForSale: variant.availableForSale,
      price: variant.price,
      selectedOptions: variant.selectedOptions
    })),
    source: "shopify"
  };
}
