import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, loyaltyAccountsTable } from "@workspace/db";
import { RedeemPointsBody } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

const TIERS = [
  { name: "Bronze", minPoints: 0, benefits: ["5% discount on orders", "Birthday reward", "Early access to offers"], color: "#CD7F32", icon: "award" },
  { name: "Silver", minPoints: 500, benefits: ["10% discount on orders", "Free shipping", "Priority support", "Exclusive offers"], color: "#C0C0C0", icon: "star" },
  { name: "Gold", minPoints: 2000, benefits: ["15% discount on orders", "Free priority shipping", "Dedicated support", "VIP event access"], color: "#FFD700", icon: "crown" },
  { name: "Platinum", minPoints: 5000, benefits: ["20% discount on orders", "Free express shipping", "Personal concierge", "Exclusive products", "Quarterly gift"], color: "#E5E4E2", icon: "gem" },
];

function getTier(points: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points >= TIERS[i].minPoints) return TIERS[i];
  }
  return TIERS[0];
}

function getNextTierPoints(points: number) {
  for (const tier of TIERS) {
    if (tier.minPoints > points) return tier.minPoints;
  }
  return TIERS[TIERS.length - 1].minPoints;
}

async function getOrCreateAccount() {
  let [account] = await db.select().from(loyaltyAccountsTable).where(eq(loyaltyAccountsTable.userId, USER_ID));
  if (!account) {
    [account] = await db
      .insert(loyaltyAccountsTable)
      .values({
        userId: USER_ID,
        points: 350,
        lifetimePoints: 350,
        streakDays: 7,
        tier: "Bronze",
        nextTierPoints: 500,
        badges: JSON.stringify(["First Purchase", "Explorer"]),
      })
      .returning();
  }
  return account;
}

router.get("/loyalty/tiers", async (_req, res): Promise<void> => {
  res.json(TIERS);
});

router.get("/loyalty/me", async (_req, res): Promise<void> => {
  const account = await getOrCreateAccount();
  const tier = getTier(account.points);
  const nextTierPoints = getNextTierPoints(account.points);
  res.json({
    ...account,
    tier: tier.name,
    nextTierPoints,
    badges: JSON.parse(account.badges),
  });
});

router.post("/loyalty/redeem", async (req, res): Promise<void> => {
  const parsed = RedeemPointsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const account = await getOrCreateAccount();
  if (account.points < parsed.data.points) {
    res.status(400).json({ error: "Insufficient points" });
    return;
  }
  const newPoints = account.points - parsed.data.points;
  const [updated] = await db
    .update(loyaltyAccountsTable)
    .set({ points: newPoints })
    .where(eq(loyaltyAccountsTable.id, account.id))
    .returning();
  const tier = getTier(updated.points);
  res.json({
    ...updated,
    tier: tier.name,
    nextTierPoints: getNextTierPoints(updated.points),
    badges: JSON.parse(updated.badges),
  });
});

export default router;
