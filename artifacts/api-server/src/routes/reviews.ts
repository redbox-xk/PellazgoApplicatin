import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import { ListReviewsQueryParams, CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const parsed = ListReviewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { businessId, productId } = parsed.data;
  const conditions: SQL[] = [];
  if (businessId !== undefined) conditions.push(eq(reviewsTable.businessId, businessId));
  if (productId !== undefined) conditions.push(eq(reviewsTable.productId, productId));

  const reviews = conditions.length
    ? await db.select().from(reviewsTable).where(and(...conditions))
    : await db.select().from(reviewsTable);
  res.json(reviews);
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [review] = await db.insert(reviewsTable).values(parsed.data).returning();
  res.status(201).json(review);
});

export default router;
