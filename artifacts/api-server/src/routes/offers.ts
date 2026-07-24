import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, offersTable } from "@workspace/db";
import { ListOffersQueryParams, GetOfferParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/offers", async (req, res): Promise<void> => {
  const parsed = ListOffersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { featured } = parsed.data;
  const conditions: SQL[] = [];
  if (featured !== undefined) conditions.push(eq(offersTable.isFeatured, featured));

  const offers = conditions.length
    ? await db.select().from(offersTable).where(and(...conditions))
    : await db.select().from(offersTable);
  res.json(offers);
});

router.get("/offers/:id", async (req, res): Promise<void> => {
  const params = GetOfferParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [offer] = await db.select().from(offersTable).where(eq(offersTable.id, params.data.id));
  if (!offer) {
    res.status(404).json({ error: "Offer not found" });
    return;
  }
  res.json(offer);
});

export default router;
