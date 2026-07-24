import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db, businessesTable, productsTable, offersTable, loyaltyAccountsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [{ value: totalBusinesses }] = await db.select({ value: count() }).from(businessesTable);
  const [{ value: totalProducts }] = await db.select({ value: count() }).from(productsTable);
  const [{ value: totalOffers }] = await db.select({ value: count() }).from(offersTable);
  const [{ value: featuredBusinessCount }] = await db.select({ value: count() }).from(businessesTable).where(eq(businessesTable.isFeatured, true));

  let activeLoyaltyPoints = 350;
  const [account] = await db.select().from(loyaltyAccountsTable).where(eq(loyaltyAccountsTable.userId, "default"));
  if (account) activeLoyaltyPoints = account.points;

  res.json({
    totalBusinesses,
    totalProducts,
    totalOffers,
    featuredBusinessCount,
    activeLoyaltyPoints,
  });
});

export default router;
