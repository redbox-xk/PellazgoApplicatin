import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, profilesTable } from "@workspace/db";
import { UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

async function getOrCreateProfile() {
  let [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, USER_ID));
  if (!profile) {
    [profile] = await db.insert(profilesTable).values({ userId: USER_ID, name: "Alex Rivera", email: "alex@pellazgo.com" }).returning();
  }
  return profile;
}

router.get("/profile", async (_req, res): Promise<void> => {
  const profile = await getOrCreateProfile();
  res.json(profile);
});

router.patch("/profile", async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const profile = await getOrCreateProfile();
  const [updated] = await db
    .update(profilesTable)
    .set(parsed.data)
    .where(eq(profilesTable.id, profile.id))
    .returning();
  res.json(updated);
});

export default router;
