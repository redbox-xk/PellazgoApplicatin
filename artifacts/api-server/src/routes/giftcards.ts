import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, giftCardsTable } from "@workspace/db";
import { GetGiftCardParams, CreateGiftCardBody } from "@workspace/api-zod";

const router: IRouter = Router();

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.get("/gift-cards", async (_req, res): Promise<void> => {
  const cards = await db.select().from(giftCardsTable).orderBy(giftCardsTable.createdAt);
  res.json(cards);
});

router.post("/gift-cards", async (req, res): Promise<void> => {
  const parsed = CreateGiftCardBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  const [card] = await db.insert(giftCardsTable).values({
    code: generateCode(),
    balance: parsed.data.amount,
    originalAmount: parsed.data.amount,
    status: "active",
    recipientEmail: parsed.data.recipientEmail,
    message: parsed.data.message,
    expiresAt,
  }).returning();
  res.status(201).json(card);
});

router.get("/gift-cards/:id", async (req, res): Promise<void> => {
  const params = GetGiftCardParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [card] = await db.select().from(giftCardsTable).where(eq(giftCardsTable.id, params.data.id));
  if (!card) {
    res.status(404).json({ error: "Gift card not found" });
    return;
  }
  res.json(card);
});

export default router;
