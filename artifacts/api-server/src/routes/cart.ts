import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartsTable, cartItemsTable } from "@workspace/db";
import { AddToCartBody, RemoveFromCartParams } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

async function getOrCreateCart() {
  let [cart] = await db.select().from(cartsTable).where(eq(cartsTable.userId, USER_ID));
  if (!cart) {
    [cart] = await db.insert(cartsTable).values({ userId: USER_ID }).returning();
  }
  return cart;
}

async function buildCartResponse(cartId: number) {
  const [cart] = await db.select().from(cartsTable).where(eq(cartsTable.id, cartId));
  const items = await db.select().from(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...cart, items, total, itemCount };
}

router.get("/cart", async (_req, res): Promise<void> => {
  const cart = await getOrCreateCart();
  res.json(await buildCartResponse(cart.id));
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const cart = await getOrCreateCart();
  const { productId, quantity } = parsed.data;

  // Import product info
  const { productsTable } = await import("@workspace/db");
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [existing] = await db.select().from(cartItemsTable).where(
    and(eq(cartItemsTable.cartId, cart.id), eq(cartItemsTable.productId, productId))
  );

  if (existing) {
    await db.update(cartItemsTable).set({ quantity: existing.quantity + quantity }).where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({
      cartId: cart.id,
      productId,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.imageUrl,
    });
  }

  res.json(await buildCartResponse(cart.id));
});

router.delete("/cart/items/:itemId", async (req, res): Promise<void> => {
  const params = RemoveFromCartParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const cart = await getOrCreateCart();
  await db.delete(cartItemsTable).where(
    and(eq(cartItemsTable.id, params.data.itemId), eq(cartItemsTable.cartId, cart.id))
  );
  res.json(await buildCartResponse(cart.id));
});

router.delete("/cart/clear", async (_req, res): Promise<void> => {
  const cart = await getOrCreateCart();
  await db.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cart.id));
  res.json(await buildCartResponse(cart.id));
});

export default router;
