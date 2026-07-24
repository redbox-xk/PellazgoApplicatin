import { Router, type IRouter } from "express";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import { db, businessesTable } from "@workspace/db";
import {
  ListBusinessesQueryParams,
  GetBusinessParams,
  CreateBusinessBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/businesses/featured", async (_req, res): Promise<void> => {
  const businesses = await db
    .select()
    .from(businessesTable)
    .where(eq(businessesTable.isFeatured, true))
    .limit(8);
  res.json(businesses);
});

router.get("/businesses", async (req, res): Promise<void> => {
  const parsed = ListBusinessesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { search, category, featured } = parsed.data;
  const conditions: SQL[] = [];
  if (search) conditions.push(ilike(businessesTable.name, `%${search}%`));
  if (category) conditions.push(eq(businessesTable.category, category));
  if (featured !== undefined) conditions.push(eq(businessesTable.isFeatured, featured));

  const businesses = conditions.length
    ? await db.select().from(businessesTable).where(and(...conditions))
    : await db.select().from(businessesTable);
  res.json(businesses);
});

router.post("/businesses", async (req, res): Promise<void> => {
  const parsed = CreateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [business] = await db.insert(businessesTable).values(parsed.data).returning();
  res.status(201).json(business);
});

router.get("/businesses/:id", async (req, res): Promise<void> => {
  const params = GetBusinessParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [business] = await db
    .select()
    .from(businessesTable)
    .where(eq(businessesTable.id, params.data.id));
  if (!business) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  res.json(business);
});

export default router;
