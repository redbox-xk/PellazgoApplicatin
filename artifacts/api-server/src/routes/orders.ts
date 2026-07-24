import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, cartsTable, cartItemsTable } from "@workspace/db";
import { GetOrderParams, CreateOrderBody } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.userId, USER_ID))
    .orderBy(ordersTable.createdAt);
  res.json(orders);
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, USER_ID));
  if (!cart) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  if (items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [order] = await db.insert(ordersTable).values({
    userId: USER_ID,
    status: "confirmed",
    total,
    items: items,
    shippingAddress: parsed.data.shippingAddress,
  }).returning();

  // Clear cart
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));

  res.status(201).json(order);
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, params.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(order);
});

export default router;
