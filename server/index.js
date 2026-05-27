import "dotenv/config";
import express from "express";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import adminRouter from "./routes/admin.js";
import checkoutRouter from "./routes/checkout.js";
import productsRouter from "./routes/products.js";
import shopifyRouter from "./routes/shopify.js";
import webhookRouter from "./routes/webhook.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 4174);
const publicDir = join(__dirname, "..", "public");
const distDir = join(__dirname, "..", "dist");
const clientDir = existsSync(join(distDir, "index.html")) ? distDir : publicDir;

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }), webhookRouter);

app.use(express.json());
app.use(express.static(clientDir));
app.use("/assets", express.static(join(publicDir, "assets")));
app.use("/vendor", express.static(join(publicDir, "vendor")));

app.use("/api/products", productsRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/admin", adminRouter);
app.use("/api/shopify", shopifyRouter);

app.get("/health", (request, response) => {
  response.json({ ok: true });
});

app.get(/^\/(?!api\/).*/, (request, response) => {
  const fallback = join(clientDir, "index.html");
  response.sendFile(fallback);
});

app.listen(port, () => {
  console.log(`BladeCraft store running at http://127.0.0.1:${port}`);
});
