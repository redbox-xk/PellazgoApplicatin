import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, favoritesTable } from "@workspace/db";
import { AddFavoriteBody, RemoveFavoriteParams } from "@workspace/api-zod";

const router: IRouter = Router();
const USER_ID = "default";

router.get("/favorites", async (_req, res): Promise<void> => {
  const favorites = await db.select().from(favoritesTable).where(eq(favoritesTable.userId, USER_ID));
  res.json(favorites);
});

router.post("/favorites", async (req, res): Promise<void> => {
  const parsed = AddFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [fav] = await db.insert(favoritesTable).values({ ...parsed.data, userId: USER_ID }).returning();
  res.status(201).json(fav);
});

router.delete("/favorites/:id", async (req, res): Promise<void> => {
  const params = RemoveFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(favoritesTable).where(and(eq(favoritesTable.id, params.data.id), eq(favoritesTable.userId, USER_ID)));
  res.sendStatus(204);
});

export default router;
