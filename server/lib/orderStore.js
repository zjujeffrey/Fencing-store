import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, "..", "data");
const ordersFile = join(dataDir, "orders.json");

async function readOrders() {
  try {
    const raw = await readFile(ordersFile, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeOrders(orders) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

export function createOrderNumber() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BC-${stamp}-${suffix}`;
}

export async function createOrder(order) {
  const orders = await readOrders();
  orders.unshift(order);
  await writeOrders(orders);
  return order;
}

export async function listOrders() {
  return readOrders();
}

export async function findOrderByNumber(orderNumber) {
  const orders = await readOrders();
  return orders.find((order) => order.orderNumber === orderNumber);
}

export async function findOrderByStripeSession(stripeSessionId) {
  const orders = await readOrders();
  return orders.find((order) => order.stripeSessionId === stripeSessionId);
}

export async function updateOrder(orderNumber, patch) {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.orderNumber === orderNumber);

  if (index === -1) {
    return null;
  }

  orders[index] = {
    ...orders[index],
    ...patch,
    updatedAt: new Date().toISOString()
  };
  await writeOrders(orders);
  return orders[index];
}
